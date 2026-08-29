import Database from 'better-sqlite3';
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
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lecture_registrations (
    id TEXT PRIMARY KEY,
    lecture_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT,
    checked_in_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lecture_id) REFERENCES hard_lectures(id) ON DELETE CASCADE
  );

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    sender_name TEXT,
    sender_initials TEXT,
    sender_avatar_bg TEXT,
    is_me INTEGER DEFAULT 0,
    text TEXT,
    time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS dsew_reports (
    id TEXT PRIMARY KEY,
    period TEXT,
    title TEXT,
    status TEXT DEFAULT 'Reviewed',
    report_type TEXT,
    highlights TEXT,
    concerns TEXT,
    selected_assignments TEXT,
    submitted_at TEXT
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    date TEXT,
    mood TEXT,
    timestamp TEXT,
    shared_with_mentor INTEGER DEFAULT 1
  );
`);

// Seed initial data if tables are empty
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
      description, total_seats, booked_seats, attendance_points
    ) VALUES (
      @id, @title, @subject, @lecturer_id, @lecturer_name, @lecturer_initials,
      @lecturer_avatar_bg, @lecturer_gpa, @lecturer_role, @date_text, @location,
      @description, @total_seats, @booked_seats, @attendance_points
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
    attendance_points: 50
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
    attendance_points: 40
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
    attendance_points: 50
  });
}
