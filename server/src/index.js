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

// WebSocket connected clients
const clients = new Set();

function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload });
  for (const client of clients) {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  }
}

// WebSocket Route
fastify.get('/ws', { websocket: true }, (socket, req) => {
  clients.add(socket);
  fastify.log.info('WebSocket client connected. Total clients: ' + clients.size);

  socket.on('close', () => {
    clients.delete(socket);
    fastify.log.info('WebSocket client disconnected. Total clients: ' + clients.size);
  });
});

// Health check
fastify.get('/api/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// --- MENTORS ---
fastify.get('/api/mentors', async () => {
  const rows = db.prepare('SELECT * FROM mentors').all();
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

  db.prepare('UPDATE mentors SET is_your_mentor = 0').run();
  db.prepare('UPDATE mentors SET is_your_mentor = 1, assigned_mentees = assigned_mentees + 1, spots_left = MAX(0, spots_left - 1) WHERE id = ?').run(mentorId);

  broadcast('MENTOR_SELECTED', { mentorId });
  return { success: true };
});

// --- HARD LECTURES ---
fastify.get('/api/lectures', async (request) => {
  const studentId = request.query?.studentId || '254977';
  const lectures = db.prepare('SELECT * FROM hard_lectures ORDER BY created_at DESC').all();

  return lectures.map(l => {
    const registrations = db.prepare('SELECT * FROM lecture_registrations WHERE lecture_id = ?').all(l.id);
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
      isBookedByMe: Boolean(myReg),
      isCheckedIn: Boolean(myReg?.checked_in_at),
      registeredStudents: registrations.map(r => ({
        studentId: r.student_id,
        studentName: r.student_name,
        studentEmail: r.student_email,
        checkedInAt: r.checked_in_at
      }))
    };
  });
});

fastify.post('/api/lectures', async (request, reply) => {
  const body = request.body;
  if (!body?.title) return reply.status(400).send({ error: 'Title is required' });

  const id = `lec-${Date.now()}`;
  db.prepare(`
    INSERT INTO hard_lectures (
      id, title, subject, lecturer_id, lecturer_name, lecturer_initials,
      lecturer_avatar_bg, lecturer_gpa, lecturer_role, date_text, location,
      description, total_seats, booked_seats, attendance_points
    ) VALUES (
      @id, @title, @subject, @lecturer_id, @lecturer_name, @lecturer_initials,
      @lecturer_avatar_bg, @lecturer_gpa, @lecturer_role, @date_text, @location,
      @description, @total_seats, 0, @attendance_points
    )
  `).run({
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
    attendance_points: Number(body.attendancePoints) || 50
  });

  const created = db.prepare('SELECT * FROM hard_lectures WHERE id = ?').get(id);
  broadcast('LECTURE_CREATED', created);
  return created;
});

// Book seat in lecture
fastify.post('/api/lectures/:id/book', async (request, reply) => {
  const { id } = request.params;
  const { studentId = '254977', studentName = 'Birzhan Zhanbolatuly', studentEmail = '254977@astanait.edu.kz' } = request.body || {};

  const lecture = db.prepare('SELECT * FROM hard_lectures WHERE id = ?').get(id);
  if (!lecture) return reply.status(404).send({ error: 'Lecture not found' });

  const existing = db.prepare('SELECT * FROM lecture_registrations WHERE lecture_id = ? AND student_id = ?').get(id, studentId);
  if (existing) {
    return { success: true, message: 'Already booked' };
  }

  if (lecture.booked_seats >= lecture.total_seats) {
    return reply.status(400).send({ error: 'Lecture is fully booked' });
  }

  const regId = `reg-${Date.now()}`;
  db.prepare(`
    INSERT INTO lecture_registrations (id, lecture_id, student_id, student_name, student_email)
    VALUES (?, ?, ?, ?, ?)
  `).run(regId, id, studentId, studentName, studentEmail);

  db.prepare('UPDATE hard_lectures SET booked_seats = booked_seats + 1 WHERE id = ?').run(id);

  broadcast('LECTURE_BOOKED', { lectureId: id, studentId, bookedSeats: lecture.booked_seats + 1 });
  return { success: true };
});

// Cancel seat in lecture
fastify.delete('/api/lectures/:id/book', async (request, reply) => {
  const { id } = request.params;
  const { studentId = '254977' } = request.body || {};

  db.prepare('DELETE FROM lecture_registrations WHERE lecture_id = ? AND student_id = ?').run(id, studentId);
  db.prepare('UPDATE hard_lectures SET booked_seats = MAX(0, booked_seats - 1) WHERE id = ?').run(id);

  broadcast('LECTURE_CANCELLED', { lectureId: id, studentId });
  return { success: true };
});

// QR Attendance Check-In
fastify.post('/api/lectures/:id/checkin', async (request, reply) => {
  const { id } = request.params;
  const { studentId = '254977' } = request.body || {};

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  db.prepare('UPDATE lecture_registrations SET checked_in_at = ? WHERE lecture_id = ? AND student_id = ?').run(nowStr, id, studentId);

  broadcast('STUDENT_CHECKED_IN', { lectureId: id, studentId, checkedInAt: nowStr });
  return { success: true, checkedInAt: nowStr };
});

// --- STORIES ---
fastify.get('/api/stories', async () => {
  return db.prepare('SELECT * FROM stories ORDER BY created_at DESC').all();
});

fastify.post('/api/stories', async (request) => {
  const body = request.body;
  const id = `story-${Date.now()}`;
  db.prepare(`
    INSERT INTO stories (
      id, author_id, author_name, author_initials, author_avatar_bg,
      type, content, background_color, timestamp, hours_left, view_count, likes_count
    ) VALUES (
      @id, @author_id, @author_name, @author_initials, @author_avatar_bg,
      @type, @content, @background_color, 'Just now', 24, 1, 0
    )
  `).run({
    id,
    author_id: body.authorId || 'me',
    author_name: body.authorName || 'Birzhan',
    author_initials: body.authorInitials || 'BZ',
    author_avatar_bg: body.authorAvatarBg || 'bg-blue-100 text-blue-700',
    type: body.type || 'photo',
    content: body.content,
    background_color: body.backgroundColor || '#7C3AED'
  });

  const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  broadcast('NEW_STORY', story);
  return story;
});

// --- CHAT ---
fastify.get('/api/chat', async () => {
  return db.prepare('SELECT * FROM chat_messages ORDER BY created_at ASC').all();
});

fastify.post('/api/chat/messages', async (request) => {
  const body = request.body;
  const id = `msg-${Date.now()}`;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.prepare(`
    INSERT INTO chat_messages (id, sender_id, sender_name, sender_initials, sender_avatar_bg, is_me, text, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.senderId || 'me',
    body.senderName || 'Birzhan Zhanbolatuly',
    body.senderInitials || 'BZ',
    body.senderAvatarBg || 'bg-blue-100 text-blue-700',
    body.isMe ? 1 : 0,
    body.text,
    now
  );

  const msg = {
    id,
    senderId: body.senderId || 'me',
    senderName: body.senderName || 'Birzhan Zhanbolatuly',
    senderInitials: body.senderInitials || 'BZ',
    senderAvatarBg: body.senderAvatarBg || 'bg-blue-100 text-blue-700',
    isMe: body.isMe,
    text: body.text,
    time: now
  };

  broadcast('CHAT_MESSAGE', msg);
  return msg;
});

// --- DSEW REPORTS ---
fastify.get('/api/reports', async () => {
  const rows = db.prepare('SELECT * FROM dsew_reports ORDER BY id DESC').all();
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

  db.prepare(`
    INSERT INTO dsew_reports (id, period, title, status, report_type, highlights, concerns, selected_assignments, submitted_at)
    VALUES (?, ?, ?, 'Reviewed', ?, ?, ?, ?, ?)
  `).run(
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
