import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mentorship.db');

// Universal SQLite Loader (better-sqlite3 with fallback to node:sqlite)
let db;
try {
  const { default: Database } = await import('better-sqlite3');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
} catch {
  // Built-in Node 22+ DatabaseSync fallback
  const { DatabaseSync } = await import('node:sqlite');
  const nativeDb = new DatabaseSync(dbPath);
  try {
    nativeDb.exec('PRAGMA journal_mode = WAL;');
    nativeDb.exec('PRAGMA synchronous = NORMAL;');
    nativeDb.exec('PRAGMA foreign_keys = ON;');
  } catch {}

  // Adapter to match better-sqlite3 API interface
  db = {
    exec: (sql) => nativeDb.exec(sql),
    pragma: (sql) => {
      try { return nativeDb.exec(`PRAGMA ${sql};`); } catch {}
    },
    prepare: (sql) => {
      const stmt = nativeDb.prepare(sql);
      return {
        all: (...params) => {
          if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
            return stmt.all(params[0]);
          }
          return stmt.all(...params);
        },
        get: (...params) => {
          if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
            return stmt.get(params[0]);
          }
          return stmt.get(...params);
        },
        run: (...params) => {
          if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
            return stmt.run(params[0]);
          }
          return stmt.run(...params);
        }
      };
    }
  };
}

export { db };

// Initialize database schema
db.exec(`
  -- Email OTP Verifications table
  CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    role TEXT DEFAULT 'mentee',
    expires_at INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Users & Accounts table (SSO & Telegram auth)
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    initials TEXT,
    avatar_color TEXT,
    role TEXT NOT NULL DEFAULT 'mentee',
    student_id TEXT,
    cohort TEXT,
    major TEXT,
    year TEXT,
    gpa TEXT,
    auth_provider TEXT DEFAULT 'email_otp',
    telegram_username TEXT,
    token TEXT,
    is_verified INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Mentors Catalog table
  CREATE TABLE IF NOT EXISTS mentors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    initials TEXT,
    avatar_color TEXT,
    cover_tag TEXT,
    cover_gradient TEXT,
    tagline TEXT,
    major TEXT,
    year TEXT,
    cohort TEXT,
    assigned_mentees INTEGER DEFAULT 0,
    max_mentees INTEGER DEFAULT 24,
    spots_left INTEGER DEFAULT 24,
    is_your_mentor INTEGER DEFAULT 0,
    category TEXT,
    tags TEXT,
    about TEXT,
    languages TEXT,
    hobbies TEXT,
    on_campus TEXT,
    achievements TEXT,
    rating REAL DEFAULT 4.9,
    review_count INTEGER DEFAULT 0,
    quote TEXT
  );

  -- Hard Lectures table (100-seat auditoriums)
  CREATE TABLE IF NOT EXISTS hard_lectures (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    lecturer_id TEXT NOT NULL,
    lecturer_name TEXT NOT NULL,
    lecturer_initials TEXT,
    lecturer_avatar_bg TEXT,
    lecturer_gpa TEXT,
    lecturer_role TEXT,
    date_text TEXT,
    location TEXT,
    description TEXT,
    total_seats INTEGER DEFAULT 100,
    booked_seats INTEGER DEFAULT 0,
    attendance_points INTEGER DEFAULT 50,
    checkin_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Lecture Registrations & Attendance table
  CREATE TABLE IF NOT EXISTS lecture_registrations (
    id TEXT PRIMARY KEY,
    lecture_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT,
    tier TEXT DEFAULT 'front',
    checked_in_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lecture_id) REFERENCES hard_lectures(id) ON DELETE CASCADE
  );

  -- 1-on-1 Mentorship Bookings & Meetings table
  CREATE TABLE IF NOT EXISTS one_on_one_bookings (
    id TEXT PRIMARY KEY,
    mentor_id TEXT NOT NULL,
    mentor_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    date_str TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    topic TEXT NOT NULL,
    format TEXT DEFAULT 'offline',
    location TEXT NOT NULL,
    teams_link TEXT,
    notes TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Stories & Polls table
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    author_id TEXT,
    author_name TEXT,
    author_initials TEXT,
    author_avatar_bg TEXT,
    type TEXT,
    content TEXT,
    background_color TEXT,
    timestamp TEXT,
    hours_left INTEGER DEFAULT 24,
    view_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    is_official INTEGER DEFAULT 0,
    poll_data TEXT,
    reactions_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Story Votes table (prevent double voting)
  CREATE TABLE IF NOT EXISTS story_poll_votes (
    story_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    choice TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, user_id)
  );

  -- Chat Rooms table
  CREATE TABLE IF NOT EXISTS chat_rooms (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    avatar_bg TEXT,
    initials TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Chat Messages table
  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL DEFAULT 'room-cohort',
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_initials TEXT,
    sender_avatar_bg TEXT,
    is_me INTEGER DEFAULT 0,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    reply_to TEXT,
    reactions_data TEXT,
    attachment_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe column migrations
try { db.prepare("ALTER TABLE chat_messages ADD COLUMN room_id TEXT DEFAULT 'room-cohort'").run(); } catch {}
try { db.prepare("ALTER TABLE chat_messages ADD COLUMN attachment_data TEXT").run(); } catch {}
try { db.prepare("ALTER TABLE one_on_one_bookings ADD COLUMN format TEXT DEFAULT 'offline'").run(); } catch {}
try { db.prepare("ALTER TABLE one_on_one_bookings ADD COLUMN teams_link TEXT").run(); } catch {}
try { db.prepare("ALTER TABLE hard_lectures ADD COLUMN checkin_token TEXT").run(); } catch {}
try { db.prepare("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 1").run(); } catch {}

// Performance Indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_reg_lecture ON lecture_registrations(lecture_id);
  CREATE INDEX IF NOT EXISTS idx_reg_student ON lecture_registrations(student_id);
  CREATE INDEX IF NOT EXISTS idx_book_student ON one_on_one_bookings(student_id);
  CREATE INDEX IF NOT EXISTS idx_book_mentor ON one_on_one_bookings(mentor_id);
  CREATE INDEX IF NOT EXISTS idx_chat_room ON chat_messages(room_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_stories_created ON stories(created_at);
`);

// Seed Initial Users
const userCount = db.prepare('SELECT count(*) as c FROM users').get().c;
if (userCount === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, email, name, initials, avatar_color, role, student_id,
      cohort, major, year, gpa, auth_provider, telegram_username, token, is_verified
    ) VALUES (
      @id, @email, @name, @initials, @avatar_color, @role, @student_id,
      @cohort, @major, @year, @gpa, @auth_provider, @telegram_username, @token, @is_verified
    )
  `);

  const initialUsers = [
    {
      id: 'usr-student',
      email: '254977@astanait.edu.kz',
      name: 'Birzhan Zhanbolatuly',
      initials: 'BZ',
      avatar_color: 'bg-blue-600 text-white',
      role: 'mentee',
      student_id: '254977',
      cohort: 'SE-2401',
      major: 'Software Engineering',
      year: '2nd year',
      gpa: '3.85',
      auth_provider: 'microsoft',
      telegram_username: 'birzhan_aitu',
      token: 'tok-student-254977',
      is_verified: 1
    },
    {
      id: 'usr-mentor',
      email: 'aizhan.beibarys@astanait.edu.kz',
      name: 'Aizhan Beibarys',
      initials: 'AB',
      avatar_color: 'bg-purple-600 text-white',
      role: 'mentor',
      student_id: '210452',
      cohort: 'SE-2401 Lead Mentor',
      major: 'Software Engineering',
      year: '4th year',
      gpa: '3.90',
      auth_provider: 'microsoft',
      telegram_username: 'aizhan_mentor',
      token: 'tok-mentor-aizhan',
      is_verified: 1
    },
    {
      id: 'usr-tutor',
      email: 'ayan.serikbay@astanait.edu.kz',
      name: 'Ayan Serikbay',
      initials: 'AS',
      avatar_color: 'bg-indigo-600 text-white',
      role: 'hard_mentor',
      student_id: '200118',
      cohort: 'Math Dept Peer Tutors',
      major: 'Computer Science',
      year: '4th year',
      gpa: '3.96',
      auth_provider: 'microsoft',
      telegram_username: 'ayan_calculus',
      token: 'tok-tutor-ayan',
      is_verified: 1
    }
  ];

  for (const u of initialUsers) {
    insertUser.run(u);
  }
}

// Seed Chat Rooms
const roomCount = db.prepare('SELECT count(*) as c FROM chat_rooms').get().c;
if (roomCount === 0) {
  const insertRoom = db.prepare(`
    INSERT INTO chat_rooms (id, type, name, subtitle, avatar_bg, initials)
    VALUES (@id, @type, @name, @subtitle, @avatar_bg, @initials)
  `);

  insertRoom.run({
    id: 'room-cohort',
    type: 'cohort',
    name: 'SE-2401 Cohort Chat',
    subtitle: 'Assylkhan Toilybekov & 24 peers',
    avatar_bg: 'bg-blue-100 text-blue-800',
    initials: 'SE'
  });

  insertRoom.run({
    id: 'room-direct-mentor',
    type: 'direct',
    name: 'Aizhan Beibarys (1-on-1)',
    subtitle: 'Direct Mentorship Channel',
    avatar_bg: 'bg-purple-100 text-purple-800',
    initials: 'AB'
  });

  insertRoom.run({
    id: 'room-calc-qa',
    type: 'lecture',
    name: 'Calculus 1 Q&A (Ayan S.)',
    subtitle: 'Auditorium C1.3.250 Discussion',
    avatar_bg: 'bg-indigo-100 text-indigo-800',
    initials: 'C1'
  });
}

// Seed Mentors
const mentorCount = db.prepare('SELECT count(*) as c FROM mentors').get().c;
if (mentorCount === 0) {
  const insertMentor = db.prepare(`
    INSERT INTO mentors (
      id, name, initials, avatar_color, cover_tag, cover_gradient, tagline,
      major, year, cohort, assigned_mentees, max_mentees, spots_left, is_your_mentor,
      category, tags, about, languages, hobbies, on_campus, achievements, rating, review_count, quote
    ) VALUES (
      @id, @name, @initials, @avatar_color, @cover_tag, @cover_gradient, @tagline,
      @major, @year, @cohort, @assigned_mentees, @max_mentees, @spots_left, @is_your_mentor,
      @category, @tags, @about, @languages, @hobbies, @on_campus, @achievements, @rating, @review_count, @quote
    )
  `);

  const initialMentors = [
    {
      id: 'm-1',
      name: 'Aizhan Beibarys',
      initials: 'AB',
      avatar_color: 'bg-purple-100 text-purple-700 border-purple-200',
      cover_tag: 'cover · orientation week',
      cover_gradient: 'from-purple-100/90 via-purple-50/50 to-white',
      tagline: 'Your campus navigator. Debate nerd, terrible at chess.',
      major: 'Software Engineering',
      year: '4th year',
      cohort: 'Navigators · SE-1',
      assigned_mentees: 21,
      max_mentees: 24,
      spots_left: 3,
      is_your_mentor: 0,
      category: 'for_you',
      tags: JSON.stringify(['Photography', 'Debate', 'Cycling', 'Coffee']),
      about: 'I moved here from Shymkent in my first year and knew nobody. I get how loud the silence can be. My pool is small on purpose — we figure out campus, electives and life together, at your pace.',
      languages: JSON.stringify(['Қазақша', 'Русский', 'English']),
      hobbies: JSON.stringify(['Photography', 'Debate', 'Cycling', 'Coffee']),
      on_campus: JSON.stringify(['Debate Club lead', 'Orientation volunteer', 'Women in Tech']),
      achievements: JSON.stringify(["Dean's List 2024", 'Best Peer Mentor 2025', 'Hackathon finalist ×3']),
      rating: 4.9,
      review_count: 16,
      quote: 'Laugh when you can. It’s a cheap medicine 🧘'
    },
    {
      id: 'm-2',
      name: 'Madina Kim',
      initials: 'MK',
      avatar_color: 'bg-blue-100 text-blue-700 border-blue-200',
      cover_tag: 'cover · demo day',
      cover_gradient: 'from-blue-100/90 via-blue-50/50 to-white',
      tagline: "Startup-brained. I'll drag you to a hackathon.",
      major: 'Cybersecurity',
      year: '3rd year',
      cohort: 'Innovators · CS-2',
      assigned_mentees: 18,
      max_mentees: 24,
      spots_left: 6,
      is_your_mentor: 0,
      category: 'creative',
      tags: JSON.stringify(['Product design', 'Hackathons', 'Synth music']),
      about: 'Passionate about building cool tech products from scratch. If you want to crack hackathons, build a portfolio, and balance chill student life with high growth, join our pool!',
      languages: JSON.stringify(['Русский', 'English', '한국어']),
      hobbies: JSON.stringify(['Product design', 'Hackathons', 'Synth music', 'Board games']),
      on_campus: JSON.stringify(['AITU Innovation Hub Lead', 'Google Developer Group']),
      achievements: JSON.stringify(['Decentrathon Winner 2024', 'Astana Hub Resident', 'Top GPA 3.92']),
      rating: 4.8,
      review_count: 12,
      quote: 'Build, ship, learn.'
    },
    {
      id: 'm-3',
      name: 'Yerlan Tarazov',
      initials: 'YT',
      avatar_color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cover_tag: 'cover · saturday run',
      cover_gradient: 'from-emerald-100/90 via-emerald-50/50 to-white',
      tagline: 'Sport, sleep, then code. In that order.',
      major: 'Computer Science',
      year: '4th year',
      cohort: 'Athletes & Coders · CS-1',
      assigned_mentees: 24,
      max_mentees: 24,
      spots_left: 0,
      is_your_mentor: 0,
      category: 'sport',
      tags: JSON.stringify(['Running', 'Football', 'Cooking']),
      about: 'Keeping your mental & physical health sharp is the real secret to graduating with honors. Regular runs in Triathlon Park, morning coffee, and clean coding habits.',
      languages: JSON.stringify(['Қазақша', 'Русский']),
      hobbies: JSON.stringify(['Running', 'Football', 'Cooking', 'Calisthenics']),
      on_campus: JSON.stringify(['AITU Football Captain', 'Peer Tutor (Calculus & Algo)']),
      achievements: JSON.stringify(['Astana Marathon 21km finisher', 'Dean’s Honor Roll 2023']),
      rating: 5.0,
      review_count: 22,
      quote: 'Consistency beats talent.'
    },
    {
      id: 'm-4',
      name: 'Assylkhan Toilybekov',
      initials: 'AT',
      avatar_color: 'bg-purple-100 text-purple-700 border-purple-200',
      cover_tag: 'cover · soft skills',
      cover_gradient: 'from-purple-100/90 via-purple-50/50 to-white',
      tagline: 'Laugh when you can. It’s a cheap medicine 🧘',
      major: 'Software Engineering',
      year: '4th year',
      cohort: 'Navigators · SE-1',
      assigned_mentees: 21,
      max_mentees: 24,
      spots_left: 3,
      is_your_mentor: 1,
      category: 'my_major',
      tags: JSON.stringify(['Algorithms', 'Career advice', 'Mental wellbeing']),
      about: 'Here to make sure you never feel alone with hard homework or university bureaucracy. We celebrate every small win and build strong bonds across senior and junior courses.',
      languages: JSON.stringify(['Қазақша', 'Русский', 'English']),
      hobbies: JSON.stringify(['Gaming', 'Philosophy', 'Standup comedy', 'Tea brewing']),
      on_campus: JSON.stringify(['AITU Student Council', 'Mentorship Program Core']),
      achievements: JSON.stringify(['Best Peer Mentor Award', 'Excellence in Tutoring']),
      rating: 4.9,
      review_count: 19,
      quote: 'Laugh when you can. It’s a cheap medicine 🧘'
    }
  ];

  for (const m of initialMentors) {
    insertMentor.run(m);
  }
}

// Seed Hard Lectures
const lectureCount = db.prepare('SELECT count(*) as c FROM hard_lectures').get().c;
if (lectureCount === 0) {
  const insertLec = db.prepare(`
    INSERT INTO hard_lectures (
      id, title, subject, lecturer_id, lecturer_name, lecturer_initials,
      lecturer_avatar_bg, lecturer_gpa, lecturer_role, date_text, location,
      description, total_seats, booked_seats, attendance_points, checkin_token
    ) VALUES (
      @id, @title, @subject, @lecturer_id, @lecturer_name, @lecturer_initials,
      @lecturer_avatar_bg, @lecturer_gpa, @lecturer_role, @date_text, @location,
      @description, @total_seats, @booked_seats, @attendance_points, @checkin_token
    )
  `);

  insertLec.run({
    id: 'lec-1',
    title: 'Calculus 1: Midterm Crash Course & Problem Solving',
    subject: 'Calculus',
    lecturer_id: 'ayan',
    lecturer_name: 'Ayan Serikbay',
    lecturer_initials: 'AS',
    lecturer_avatar_bg: 'bg-blue-100 text-blue-800 border-blue-200',
    lecturer_gpa: 'GPA 3.96',
    lecturer_role: 'Lead Peer Tutor · Math Dept',
    date_text: 'Tuesday · 17:00 – 19:00',
    location: 'Auditorium C1.3.250 (Offline)',
    description: 'Complete breakdown of past midterm exams, limits, derivatives, Taylor series and gotchas. Offline intensive session with live Q&A.',
    total_seats: 100,
    booked_seats: 68,
    attendance_points: 50,
    checkin_token: 'AITU-CALC-2026-TOKEN'
  });

  insertLec.run({
    id: 'lec-2',
    title: 'OOP & Java: Design Patterns & Exam Prep',
    subject: 'OOP & Java',
    lecturer_id: 'dias',
    lecturer_name: 'Dias Nurken',
    lecturer_initials: 'DN',
    lecturer_avatar_bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    lecturer_gpa: 'GPA 3.92',
    lecturer_role: 'Senior Peer Tutor · SE Dept',
    date_text: 'Thursday · 18:30 – 20:00',
    location: 'Auditorium C1.2.140 (Offline)',
    description: 'Polymorphism, SOLID principles, Factory & Observer patterns explained through practical exam examples in Java.',
    total_seats: 80,
    booked_seats: 54,
    attendance_points: 40,
    checkin_token: 'AITU-OOP-2026-TOKEN'
  });

  insertLec.run({
    id: 'lec-3',
    title: 'Discrete Math: Graphs, Combinatorics & Logic',
    subject: 'Discrete Math',
    lecturer_id: 'kamila',
    lecturer_name: 'Kamila Ospanova',
    lecturer_initials: 'KO',
    lecturer_avatar_bg: 'bg-purple-100 text-purple-800 border-purple-200',
    lecturer_gpa: 'GPA 3.98',
    lecturer_role: 'Peer Tutor · CS Dept',
    date_text: 'Friday · 16:00 – 18:00',
    location: 'Auditorium C1.1.300 (Offline)',
    description: 'Master shortest path algorithms, induction proofs, and recurrence relations before the deadline.',
    total_seats: 120,
    booked_seats: 92,
    attendance_points: 50,
    checkin_token: 'AITU-DISC-2026-TOKEN'
  });
}

// Seed Stories
const storyCount = db.prepare('SELECT count(*) as c FROM stories').get().c;
if (storyCount === 0) {
  const insertStory = db.prepare(`
    INSERT INTO stories (
      id, author_id, author_name, author_initials, author_avatar_bg,
      type, content, background_color, timestamp, hours_left, view_count, likes_count, is_official, poll_data, reactions_data
    ) VALUES (
      @id, @author_id, @author_name, @author_initials, @author_avatar_bg,
      @type, @content, @background_color, @timestamp, @hours_left, @view_count, @likes_count, @is_official, @poll_data, @reactions_data
    )
  `);

  insertStory.run({
    id: 's-leads',
    author_id: 'leads',
    author_name: 'AITU Mentorship Community',
    author_initials: 'MC',
    author_avatar_bg: 'bg-blue-600 text-white',
    type: 'poll',
    content: 'Нужна ли дополнительная консультация по Calculus 1 в эту субботу в C1.3.250?',
    background_color: '#1E3A8A',
    timestamp: '2h ago',
    hours_left: 22,
    view_count: 84,
    likes_count: 29,
    is_official: 1,
    poll_data: JSON.stringify({ question: 'Идешь на субботний разбор?', yesCount: 68, noCount: 16 }),
    reactions_data: JSON.stringify({ '❤️': 32, '🔥': 28, '👏': 14, '💡': 9 })
  });

  insertStory.run({
    id: 's-aizhan',
    author_id: 'aizhan',
    author_name: 'Aizhan Beibarys',
    author_initials: 'AB',
    author_avatar_bg: 'bg-purple-600 text-white',
    type: 'text',
    content: 'Команда SE-2401! Напоминаю: запись на 1-на-1 встречи в коворкинге C1 открыта до пятницы 18:00.',
    background_color: '#7C3AED',
    timestamp: '4h ago',
    hours_left: 20,
    view_count: 52,
    likes_count: 18,
    is_official: 0,
    poll_data: null,
    reactions_data: JSON.stringify({ '❤️': 18, '🔥': 12, '👏': 8, '💡': 5 })
  });
}

// Seed Chat Messages
const chatCount = db.prepare('SELECT count(*) as c FROM chat_messages').get().c;
if (chatCount === 0) {
  const insertMsg = db.prepare(`
    INSERT INTO chat_messages (id, room_id, sender_id, sender_name, sender_initials, sender_avatar_bg, is_me, text, time, reactions_data)
    VALUES (@id, @room_id, @sender_id, @sender_name, @sender_initials, @sender_avatar_bg, @is_me, @text, @time, @reactions_data)
  `);

  insertMsg.run({
    id: 'msg-1',
    room_id: 'room-cohort',
    sender_id: 'ruslan',
    sender_name: 'Ruslan K.',
    sender_initials: 'RK',
    sender_avatar_bg: 'bg-emerald-100 text-emerald-700',
    is_me: 0,
    text: 'Ребята, завтра собираемся в АкиТайм вечером в 18:00. Если кто-то пойдет, напишите сюда!',
    time: '17:42',
    reactions_data: JSON.stringify({ '🔥': 5, '👍': 8 })
  });

  insertMsg.run({
    id: 'msg-2',
    room_id: 'room-cohort',
    sender_id: 'madi',
    sender_name: 'Madi B.',
    sender_initials: 'MB',
    sender_avatar_bg: 'bg-purple-100 text-purple-700',
    is_me: 0,
    text: 'Оооо, газ! Кстати у студентов нашего уника скидка по студенческому ID.',
    time: '17:48',
    reactions_data: JSON.stringify({ '❤️': 4 })
  });
}
