import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { db } from './db.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});

await fastify.register(websocket);

// -------------------------------------------------------------
// CACHED PREPARED STATEMENTS
// -------------------------------------------------------------
const stmts = {
  // Auth & Users
  getUsers: db.prepare('SELECT * FROM users'),
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserByToken: db.prepare('SELECT * FROM users WHERE token = ?'),
  insertUser: db.prepare(`
    INSERT INTO users (id, email, name, initials, avatar_color, role, student_id, cohort, major, year, gpa, auth_provider, telegram_username, token)
    VALUES (@id, @email, @name, @initials, @avatar_color, @role, @student_id, @cohort, @major, @year, @gpa, @auth_provider, @telegram_username, @token)
  `),

  // Mentors
  getMentors: db.prepare('SELECT * FROM mentors'),
  resetMyMentor: db.prepare('UPDATE mentors SET is_your_mentor = 0'),
  setMyMentor: db.prepare('UPDATE mentors SET is_your_mentor = 1, assigned_mentees = assigned_mentees + 1, spots_left = MAX(0, spots_left - 1) WHERE id = ?'),

  // 1-on-1 Bookings & Meetings
  getBookings: db.prepare('SELECT * FROM one_on_one_bookings ORDER BY created_at DESC'),
  getBookingsByStudent: db.prepare('SELECT * FROM one_on_one_bookings WHERE student_id = ? ORDER BY created_at DESC'),
  getBookingsByMentor: db.prepare('SELECT * FROM one_on_one_bookings WHERE mentor_id = ? ORDER BY created_at DESC'),
  insertBooking: db.prepare(`
    INSERT INTO one_on_one_bookings (id, mentor_id, mentor_name, student_id, student_name, date_str, time_slot, topic, format, location, teams_link, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateBookingStatus: db.prepare('UPDATE one_on_one_bookings SET status = ? WHERE id = ?'),
  getBookingById: db.prepare('SELECT * FROM one_on_one_bookings WHERE id = ?'),

  // Hard Lectures & Attendance
  getLectures: db.prepare('SELECT * FROM hard_lectures ORDER BY created_at DESC'),
  getLectureById: db.prepare('SELECT * FROM hard_lectures WHERE id = ?'),
  getRegistrationsByLecture: db.prepare('SELECT * FROM lecture_registrations WHERE lecture_id = ?'),
  getRegistration: db.prepare('SELECT * FROM lecture_registrations WHERE lecture_id = ? AND student_id = ?'),
  insertLecture: db.prepare(`
    INSERT INTO hard_lectures (
      id, title, subject, lecturer_id, lecturer_name, lecturer_initials,
      lecturer_avatar_bg, lecturer_gpa, lecturer_role, date_text, location,
      description, total_seats, booked_seats, attendance_points, checkin_token
    ) VALUES (
      @id, @title, @subject, @lecturer_id, @lecturer_name, @lecturer_initials,
      @lecturer_avatar_bg, @lecturer_gpa, @lecturer_role, @date_text, @location,
      @description, @total_seats, 0, @attendance_points, @checkin_token
    )
  `),
  insertRegistration: db.prepare(`
    INSERT INTO lecture_registrations (id, lecture_id, student_id, student_name, student_email, tier)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  incrementLectureSeats: db.prepare('UPDATE hard_lectures SET booked_seats = booked_seats + 1 WHERE id = ?'),
  decrementLectureSeats: db.prepare('UPDATE hard_lectures SET booked_seats = MAX(0, booked_seats - 1) WHERE id = ?'),
  deleteRegistration: db.prepare('DELETE FROM lecture_registrations WHERE lecture_id = ? AND student_id = ?'),
  checkInRegistration: db.prepare('UPDATE lecture_registrations SET checked_in_at = ? WHERE lecture_id = ? AND student_id = ?'),

  // Stories & Polls
  getStories: db.prepare('SELECT * FROM stories ORDER BY created_at DESC'),
  getStoryById: db.prepare('SELECT * FROM stories WHERE id = ?'),
  insertStory: db.prepare(`
    INSERT INTO stories (
      id, author_id, author_name, author_initials, author_avatar_bg,
      type, content, background_color, timestamp, hours_left, view_count, likes_count, is_official, poll_data, reactions_data
    ) VALUES (
      @id, @author_id, @author_name, @author_initials, @author_avatar_bg,
      @type, @content, @background_color, 'Just now', 24, 1, 0, @is_official, @poll_data, @reactions_data
    )
  `),
  updateStoryPoll: db.prepare('UPDATE stories SET poll_data = ? WHERE id = ?'),
  updateStoryReactions: db.prepare('UPDATE stories SET reactions_data = ? WHERE id = ?'),
  incrementStoryViews: db.prepare('UPDATE stories SET view_count = view_count + 1 WHERE id = ?'),
  getStoryVote: db.prepare('SELECT * FROM story_poll_votes WHERE story_id = ? AND user_id = ?'),
  insertStoryVote: db.prepare('INSERT INTO story_poll_votes (story_id, user_id, choice) VALUES (?, ?, ?)'),

  // Chat Rooms & Messages
  getChatRooms: db.prepare('SELECT * FROM chat_rooms'),
  getChatMessagesByRoom: db.prepare('SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC'),
  getAllChatMessages: db.prepare('SELECT * FROM chat_messages ORDER BY created_at ASC'),
  insertChatMessage: db.prepare(`
    INSERT INTO chat_messages (id, room_id, sender_id, sender_name, sender_initials, sender_avatar_bg, is_me, text, time, reply_to, reactions_data, attachment_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateMessageReactions: db.prepare('UPDATE chat_messages SET reactions_data = ? WHERE id = ?'),
  getMessageById: db.prepare('SELECT * FROM chat_messages WHERE id = ?'),

  // DSEW Reports
  getReports: db.prepare('SELECT * FROM dsew_reports ORDER BY id DESC'),
  insertReport: db.prepare(`
    INSERT INTO dsew_reports (id, period, title, status, report_type, highlights, concerns, selected_assignments, submitted_at)
    VALUES (?, ?, ?, 'Reviewed', ?, ?, ?, ?, ?)
  `)
};

// -------------------------------------------------------------
// WEBSOCKET HUB & BROADCASTER
// -------------------------------------------------------------
const clients = new Set();

function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload });
  for (const client of clients) {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  }
}

fastify.get('/ws', { websocket: true }, (socket) => {
  clients.add(socket);
  fastify.log.info(`WebSocket client connected. Total clients: ${clients.size}`);

  socket.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (data.type === 'TYPING') {
        // Broadcast typing indicator to all other clients
        broadcast('USER_TYPING', data.payload);
      }
    } catch {
      // ignore
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    fastify.log.info(`WebSocket client disconnected. Total clients: ${clients.size}`);
  });
});

// Health check
fastify.get('/api/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString(), connectedClients: clients.size };
});

// -------------------------------------------------------------
// AUTHENTICATION & SSO APIS
// -------------------------------------------------------------

// List available accounts for quick-switching in demo/testing
fastify.get('/api/auth/users', async () => {
  const users = stmts.getUsers.all();
  return users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    initials: u.initials,
    avatarColor: u.avatar_color,
    role: u.role,
    studentId: u.student_id,
    cohort: u.cohort,
    major: u.major,
    year: u.year,
    gpa: u.gpa,
    authProvider: u.auth_provider,
    telegramUsername: u.telegram_username,
    token: u.token
  }));
});

// Microsoft 365 / AITU SSO Authentication
fastify.post('/api/auth/sso', async (request, reply) => {
  const { email } = request.body || {};
  if (!email || !email.includes('@')) {
    return reply.status(400).send({ error: 'Valid AITU email is required (@astanait.edu.kz)' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = stmts.getUserByEmail.get(normalizedEmail);

  if (!user) {
    // Auto-provision user account for @astanait.edu.kz
    const id = `usr-${Date.now()}`;
    const nameParts = normalizedEmail.split('@')[0].split('.');
    const displayName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    const initials = nameParts.map(p => p.charAt(0).toUpperCase()).join('') || 'ST';
    const studentIdMatch = normalizedEmail.match(/^(\d+)/);
    const studentId = studentIdMatch ? studentIdMatch[1] : `ID-${Math.floor(100000 + Math.random() * 900000)}`;

    const newUser = {
      id,
      email: normalizedEmail,
      name: displayName,
      initials,
      avatar_color: 'bg-blue-600 text-white',
      role: 'mentee',
      student_id: studentId,
      cohort: 'SE-2401',
      major: 'Software Engineering',
      year: '1st year',
      gpa: '4.00',
      auth_provider: 'microsoft',
      telegram_username: null,
      token: `tok-${Date.now()}-${id}`
    };

    stmts.insertUser.run(newUser);
    user = newUser;
  }

  broadcast('USER_AUTHENTICATED', { userId: user.id, name: user.name, role: user.role });
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials,
      avatarColor: user.avatar_color,
      role: user.role,
      studentId: user.student_id,
      cohort: user.cohort,
      major: user.major,
      year: user.year,
      gpa: user.gpa,
      authProvider: user.auth_provider,
      telegramUsername: user.telegram_username,
      token: user.token
    }
  };
});

// Telegram WebApp Authentication
fastify.post('/api/auth/telegram', async (request) => {
  const { telegramUser } = request.body || {};
  const tgId = telegramUser?.id ? String(telegramUser.id) : 'tg-demo';
  const username = telegramUser?.username || 'aitu_student';
  const firstName = telegramUser?.first_name || 'AITU';
  const lastName = telegramUser?.last_name || 'Student';
  const displayName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0] || 'T'}${lastName[0] || 'G'}`;

  // Find or provision
  let user = db.prepare('SELECT * FROM users WHERE telegram_username = ?').get(username);
  if (!user) {
    const id = `usr-tg-${tgId}`;
    const newUser = {
      id,
      email: `${username}@astanait.edu.kz`,
      name: displayName,
      initials,
      avatar_color: 'bg-sky-600 text-white',
      role: 'mentee',
      student_id: '254977',
      cohort: 'SE-2401',
      major: 'Software Engineering',
      year: '2nd year',
      gpa: '3.85',
      auth_provider: 'telegram',
      telegram_username: username,
      token: `tok-tg-${id}`
    };
    stmts.insertUser.run(newUser);
    user = newUser;
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      initials: user.initials,
      avatarColor: user.avatar_color,
      role: user.role,
      studentId: user.student_id,
      cohort: user.cohort,
      major: user.major,
      year: user.year,
      gpa: user.gpa,
      authProvider: 'telegram',
      telegramUsername: user.telegram_username,
      token: user.token
    }
  };
});

// Current User Me
fastify.get('/api/auth/me', async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : request.query?.token;
  if (!token) {
    // Return default Birzhan student
    const defaultUser = stmts.getUserById.get('usr-student');
    return defaultUser;
  }

  const user = stmts.getUserByToken.get(token);
  if (!user) return reply.status(401).send({ error: 'Invalid or expired token' });
  return user;
});

// -------------------------------------------------------------
// MENTORS CATALOG
// -------------------------------------------------------------
fastify.get('/api/mentors', async () => {
  const rows = stmts.getMentors.all();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    initials: r.initials,
    avatarColor: r.avatar_color,
    coverTag: r.cover_tag,
    coverGradient: r.cover_gradient,
    tagline: r.tagline,
    major: r.major,
    year: r.year,
    cohort: r.cohort,
    assignedMentees: r.assigned_mentees,
    maxMentees: r.max_mentees,
    spotsLeft: r.spots_left,
    isYourMentor: Boolean(r.is_your_mentor),
    category: r.category,
    tags: JSON.parse(r.tags || '[]'),
    about: r.about,
    languages: JSON.parse(r.languages || '[]'),
    hobbies: JSON.parse(r.hobbies || '[]'),
    onCampus: JSON.parse(r.on_campus || '[]'),
    achievements: JSON.parse(r.achievements || '[]'),
    rating: r.rating,
    reviewCount: r.review_count,
    quote: r.quote
  }));
});

fastify.post('/api/mentors/select', async (request, reply) => {
  const { mentorId } = request.body || {};
  if (!mentorId) return reply.status(400).send({ error: 'mentorId is required' });

  stmts.resetMyMentor.run();
  stmts.setMyMentor.run(mentorId);

  broadcast('MENTOR_SELECTED', { mentorId });
  return { success: true };
});

// -------------------------------------------------------------
// 1-ON-1 MEETINGS & MS TEAMS BOOKINGS
// -------------------------------------------------------------
fastify.get('/api/bookings/one-on-one', async (request) => {
  const studentId = request.query?.studentId;
  const mentorId = request.query?.mentorId;

  let rows;
  if (mentorId) {
    rows = stmts.getBookingsByMentor.all(mentorId);
  } else if (studentId) {
    rows = stmts.getBookingsByStudent.all(studentId);
  } else {
    rows = stmts.getBookings.all();
  }

  return rows.map(r => ({
    id: r.id,
    mentorId: r.mentor_id,
    mentorName: r.mentor_name,
    studentId: r.student_id,
    studentName: r.student_name,
    dateStr: r.date_str,
    timeSlot: r.time_slot,
    topic: r.topic,
    format: r.format || 'offline',
    location: r.location,
    teamsLink: r.teams_link,
    notes: r.notes,
    status: r.status,
    createdAt: r.created_at
  }));
});

fastify.post('/api/bookings/one-on-one', async (request, reply) => {
  const body = request.body;
  if (!body?.mentorId || !body?.topic) return reply.status(400).send({ error: 'mentorId and topic required' });

  const id = `book-${Date.now()}`;
  const format = body.format || 'offline';
  const meetingCode = Math.random().toString(36).substring(2, 9);
  const teamsLink = format === 'online_teams'
    ? `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${meetingCode}%40thread.v2/0?context=%7b%22Tid%22%3a%22astanait-edu-kz%22%7d`
    : null;

  stmts.insertBooking.run(
    id,
    body.mentorId,
    body.mentorName || 'Aizhan Beibarys',
    body.studentId || '254977',
    body.studentName || 'Birzhan Zhanbolatuly',
    body.dateStr || 'Tomorrow',
    body.timeSlot || '16:30 – 16:50',
    body.topic,
    format,
    body.location || (format === 'online_teams' ? 'Microsoft Teams Meeting' : 'C1 Coworking'),
    teamsLink,
    body.notes || '',
    'confirmed'
  );

  const created = stmts.getBookingById.get(id);
  broadcast('ONE_ON_ONE_BOOKED', created);
  return created;
});

fastify.patch('/api/bookings/one-on-one/:id/status', async (request, reply) => {
  const { id } = request.params;
  const { status } = request.body || {};
  if (!status) return reply.status(400).send({ error: 'Status is required' });

  stmts.updateBookingStatus.run(status, id);
  const updated = stmts.getBookingById.get(id);
  broadcast('BOOKING_STATUS_CHANGED', updated);
  return updated;
});

// -------------------------------------------------------------
// HARD LECTURES & QR ATTENDANCE
// -------------------------------------------------------------
fastify.get('/api/lectures', async (request) => {
  const studentId = request.query?.studentId || '254977';
  const lectures = stmts.getLectures.all();

  return lectures.map(l => {
    const registrations = stmts.getRegistrationsByLecture.all(l.id);
    const myReg = registrations.find(r => r.student_id === studentId);

    return {
      id: l.id,
      title: l.title,
      subject: l.subject,
      lecturerId: l.lecturer_id,
      lecturerName: l.lecturer_name,
      lecturerInitials: l.lecturer_initials,
      lecturerAvatarBg: l.lecturer_avatar_bg,
      lecturerGpa: l.lecturer_gpa,
      lecturerRole: l.lecturer_role,
      dateText: l.date_text,
      location: l.location,
      description: l.description,
      totalSeats: l.total_seats,
      bookedSeats: l.booked_seats,
      attendancePoints: l.attendance_points,
      checkinToken: l.checkin_token || `AITU-${l.id.toUpperCase()}-TOKEN`,
      isBookedByMe: Boolean(myReg),
      isCheckedIn: Boolean(myReg?.checked_in_at),
      selectedTier: myReg?.tier || 'front',
      registeredStudents: registrations.map(r => ({
        studentId: r.student_id,
        studentName: r.student_name,
        studentEmail: r.student_email,
        tier: r.tier || 'front',
        checkedInAt: r.checked_in_at
      }))
    };
  });
});

fastify.post('/api/lectures', async (request, reply) => {
  const body = request.body;
  if (!body?.title) return reply.status(400).send({ error: 'Title is required' });

  const id = `lec-${Date.now()}`;
  stmts.insertLecture.run({
    id,
    title: body.title,
    subject: body.subject || 'Calculus',
    lecturer_id: body.lecturerId || 'ayan',
    lecturer_name: body.lecturerName || 'Ayan Serikbay',
    lecturer_initials: body.lecturerInitials || 'AS',
    lecturer_avatar_bg: body.lecturerAvatarBg || 'bg-blue-100 text-blue-800 border-blue-200',
    lecturer_gpa: body.lecturerGpa || 'GPA 3.96',
    lecturer_role: body.lecturerRole || 'Lead Peer Tutor',
    date_text: body.dateText || 'Tuesday · 17:00',
    location: body.location || 'Auditorium C1.3.250 (Offline)',
    description: body.description || '',
    total_seats: Number(body.totalSeats) || 100,
    attendance_points: Number(body.attendancePoints) || 50,
    checkin_token: `AITU-${id.toUpperCase()}-TOKEN`
  });

  const created = stmts.getLectureById.get(id);
  broadcast('LECTURE_CREATED', created);
  return created;
});

// Book seat in lecture
fastify.post('/api/lectures/:id/book', async (request, reply) => {
  const { id } = request.params;
  const { studentId = '254977', studentName = 'Birzhan Zhanbolatuly', studentEmail = '254977@astanait.edu.kz', tier = 'front' } = request.body || {};

  const lecture = stmts.getLectureById.get(id);
  if (!lecture) return reply.status(404).send({ error: 'Lecture not found' });

  const existing = stmts.getRegistration.get(id, studentId);
  if (existing) {
    return { success: true, message: 'Already booked' };
  }

  if (lecture.booked_seats >= lecture.total_seats) {
    return reply.status(400).send({ error: 'Lecture is fully booked' });
  }

  const regId = `reg-${Date.now()}`;
  stmts.insertRegistration.run(regId, id, studentId, studentName, studentEmail, tier);
  stmts.incrementLectureSeats.run(id);

  broadcast('LECTURE_BOOKED', { lectureId: id, studentId, bookedSeats: lecture.booked_seats + 1, tier });
  return { success: true };
});

// Cancel seat in lecture
fastify.delete('/api/lectures/:id/book', async (request) => {
  const { id } = request.params;
  const { studentId = '254977' } = request.body || {};

  stmts.deleteRegistration.run(id, studentId);
  stmts.decrementLectureSeats.run(id);

  broadcast('LECTURE_CANCELLED', { lectureId: id, studentId });
  return { success: true };
});

// QR Attendance Check-In Verification
fastify.post('/api/lectures/:id/checkin', async (request, reply) => {
  const { id } = request.params;
  const { studentId = '254977', token } = request.body || {};

  const lecture = stmts.getLectureById.get(id);
  if (!lecture) return reply.status(404).send({ error: 'Lecture not found' });

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  stmts.checkInRegistration.run(nowStr, id, studentId);

  broadcast('STUDENT_CHECKED_IN', {
    lectureId: id,
    studentId,
    lectureTitle: lecture.title,
    pointsAwarded: lecture.attendance_points,
    checkedInAt: nowStr
  });

  return {
    success: true,
    studentId,
    lectureTitle: lecture.title,
    pointsAwarded: lecture.attendance_points,
    checkedInAt: nowStr
  };
});

// -------------------------------------------------------------
// STORIES, POLLS & REACTIONS
// -------------------------------------------------------------
fastify.get('/api/stories', async () => {
  const rows = stmts.getStories.all();
  return rows.map(r => ({
    id: r.id,
    authorId: r.author_id,
    authorName: r.author_name,
    authorInitials: r.author_initials,
    authorAvatarBg: r.author_avatar_bg,
    type: r.type,
    content: r.content,
    backgroundColor: r.background_color,
    timestamp: r.timestamp,
    hoursLeft: r.hours_left,
    viewCount: r.view_count,
    likesCount: r.likes_count,
    isOfficial: Boolean(r.is_official),
    poll: r.poll_data ? JSON.parse(r.poll_data) : undefined,
    reactions: r.reactions_data ? JSON.parse(r.reactions_data) : {}
  }));
});

fastify.post('/api/stories', async (request) => {
  const body = request.body;
  const id = `story-${Date.now()}`;

  stmts.insertStory.run({
    id,
    author_id: body.authorId || 'me',
    author_name: body.authorName || 'Aizhan Beibarys',
    author_initials: body.authorInitials || 'AB',
    author_avatar_bg: body.authorAvatarBg || 'bg-purple-100 text-purple-700',
    type: body.type || 'text',
    content: body.content || '',
    background_color: body.backgroundColor || '#7C3AED',
    is_official: body.isOfficial ? 1 : 0,
    poll_data: body.poll ? JSON.stringify(body.poll) : null,
    reactions_data: JSON.stringify({ '❤️': 0, '🔥': 0, '👏': 0, '💡': 0 })
  });

  const story = stmts.getStoryById.get(id);
  const formatted = {
    ...story,
    poll: story.poll_data ? JSON.parse(story.poll_data) : undefined,
    reactions: story.reactions_data ? JSON.parse(story.reactions_data) : {}
  };
  broadcast('NEW_STORY', formatted);
  return formatted;
});

// Vote in Story Poll
fastify.post('/api/stories/:id/poll', async (request, reply) => {
  const { id } = request.params;
  const { choice, userId = 'usr-student' } = request.body || {};
  if (!choice || (choice !== 'yes' && choice !== 'no')) {
    return reply.status(400).send({ error: 'Choice must be "yes" or "no"' });
  }

  const story = stmts.getStoryById.get(id);
  if (!story || !story.poll_data) return reply.status(404).send({ error: 'Story poll not found' });

  const poll = JSON.parse(story.poll_data);
  if (choice === 'yes') poll.yesCount = (poll.yesCount || 0) + 1;
  if (choice === 'no') poll.noCount = (poll.noCount || 0) + 1;

  stmts.updateStoryPoll.run(JSON.stringify(poll), id);
  try {
    stmts.insertStoryVote.run(id, userId, choice);
  } catch {
    // ignore duplicate vote entry
  }

  broadcast('STORY_POLL_UPDATED', { storyId: id, poll });
  return { success: true, poll };
});

// React with emoji to Story
fastify.post('/api/stories/:id/react', async (request, reply) => {
  const { id } = request.params;
  const { emoji = '❤️' } = request.body || {};

  const story = stmts.getStoryById.get(id);
  if (!story) return reply.status(404).send({ error: 'Story not found' });

  const reactions = JSON.parse(story.reactions_data || '{}');
  reactions[emoji] = (reactions[emoji] || 0) + 1;

  stmts.updateStoryReactions.run(JSON.stringify(reactions), id);
  broadcast('STORY_REACTION_UPDATED', { storyId: id, emoji, count: reactions[emoji] });
  return { success: true, reactions };
});

// -------------------------------------------------------------
// CHAT ROOMS & MESSAGES
// -------------------------------------------------------------
fastify.get('/api/chat/rooms', async () => {
  return stmts.getChatRooms.all();
});

fastify.get('/api/chat', async (request) => {
  const roomId = request.query?.roomId;
  if (roomId) {
    const rows = stmts.getChatMessagesByRoom.all(roomId);
    return rows.map(r => ({
      id: r.id,
      roomId: r.room_id,
      senderId: r.sender_id,
      senderName: r.sender_name,
      senderInitials: r.sender_initials,
      senderAvatarBg: r.sender_avatar_bg,
      isMe: Boolean(r.is_me),
      text: r.text,
      time: r.time,
      replyTo: r.reply_to ? JSON.parse(r.reply_to) : undefined,
      reactions: r.reactions_data ? JSON.parse(r.reactions_data) : {},
      attachment: r.attachment_data ? JSON.parse(r.attachment_data) : undefined
    }));
  }

  const rows = stmts.getAllChatMessages.all();
  return rows.map(r => ({
    id: r.id,
    roomId: r.room_id || 'room-cohort',
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderInitials: r.sender_initials,
    senderAvatarBg: r.sender_avatar_bg,
    isMe: Boolean(r.is_me),
    text: r.text,
    time: r.time,
    replyTo: r.reply_to ? JSON.parse(r.reply_to) : undefined,
    reactions: r.reactions_data ? JSON.parse(r.reactions_data) : {},
    attachment: r.attachment_data ? JSON.parse(r.attachment_data) : undefined
  }));
});

fastify.post('/api/chat/messages', async (request) => {
  const body = request.body;
  const id = `msg-${Date.now()}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const roomId = body.roomId || 'room-cohort';

  stmts.insertChatMessage.run(
    id,
    roomId,
    body.senderId || 'me',
    body.senderName || 'Birzhan Zhanbolatuly',
    body.senderInitials || 'BZ',
    body.senderAvatarBg || 'bg-blue-100 text-blue-700',
    body.isMe ? 1 : 0,
    body.text,
    now,
    body.replyTo ? JSON.stringify(body.replyTo) : null,
    JSON.stringify({}),
    body.attachment ? JSON.stringify(body.attachment) : null
  );

  const msg = {
    id,
    roomId,
    senderId: body.senderId || 'me',
    senderName: body.senderName || 'Birzhan Zhanbolatuly',
    senderInitials: body.senderInitials || 'BZ',
    senderAvatarBg: body.senderAvatarBg || 'bg-blue-100 text-blue-700',
    isMe: body.isMe,
    text: body.text,
    time: now,
    replyTo: body.replyTo,
    reactions: {},
    attachment: body.attachment
  };

  broadcast('CHAT_MESSAGE', msg);
  return msg;
});

// React to Chat Message
fastify.post('/api/chat/messages/:id/react', async (request, reply) => {
  const { id } = request.params;
  const { emoji = '👍' } = request.body || {};

  const msg = stmts.getMessageById.get(id);
  if (!msg) return reply.status(404).send({ error: 'Message not found' });

  const reactions = JSON.parse(msg.reactions_data || '{}');
  reactions[emoji] = (reactions[emoji] || 0) + 1;

  stmts.updateMessageReactions.run(JSON.stringify(reactions), id);
  broadcast('MESSAGE_REACTION', { messageId: id, emoji, count: reactions[emoji] });
  return { success: true, reactions };
});

// -------------------------------------------------------------
// DSEW REPORTS
// -------------------------------------------------------------
fastify.get('/api/reports', async () => {
  const rows = stmts.getReports.all();
  return rows.map(r => ({
    id: r.id,
    period: r.period,
    title: r.title,
    status: r.status,
    reportType: r.report_type,
    highlights: r.highlights,
    concerns: r.concerns,
    selectedAssignments: JSON.parse(r.selected_assignments || '[]'),
    submittedAt: r.submitted_at
  }));
});

fastify.post('/api/reports', async (request) => {
  const body = request.body;
  const id = `rep-${Date.now()}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  stmts.insertReport.run(
    id,
    body.period || 'Current Period',
    body.title || 'Weekly Report',
    body.reportType || 'Assignments from DSEW',
    body.highlights || '',
    body.concerns || '',
    JSON.stringify(body.selectedAssignments || []),
    dateStr
  );

  return { success: true, id };
});

// Start Fastify Server
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port: Number(port), host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
