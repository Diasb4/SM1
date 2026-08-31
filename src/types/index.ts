export type UserRole = 'mentee' | 'mentor' | 'hard_mentor' | 'dsew_admin';

export type MenteeView = 'home' | 'mentors' | 'lectures' | 'guide' | 'events' | 'chat' | 'profile' | 'skeleton' | 'empty_tasks' | 'offline_error';
export type MentorView = 'community' | 'stories' | 'new_story' | 'weekly_report' | 'events' | 'profile';
export type HardMentorView = 'my_lectures' | 'scanner' | 'create_lecture' | 'analytics';

export type AuthProviderType = 'microsoft' | 'telegram' | 'demo';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: UserRole;
  studentId: string;
  cohort: string;
  major: string;
  year: string;
  gpa: string;
  authProvider: AuthProviderType;
  telegramUsername?: string;
  token: string;
}

export interface Mentor {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  coverTag: string;
  coverGradient: string;
  tagline: string;
  major: string;
  year: string;
  cohort: string;
  assignedMentees: number;
  maxMentees: number;
  spotsLeft?: number;
  isYourMentor?: boolean;
  category: 'for_you' | 'my_major' | 'creative' | 'sport' | 'star';
  tags: string[];
  about: string;
  languages: string[];
  hobbies: string[];
  onCampus: string[];
  achievements: string[];
  quote?: string;
  rating?: number;
  reviewCount?: number;
  availableSlots?: string[];
}

export type SubjectCategory = 'Calculus' | 'Linear Algebra' | 'OOP & Java' | 'Algorithms & DSA' | 'Physics' | 'Discrete Math';

export type AuditoriumTier = 'front' | 'middle' | 'back';

export interface HardLecture {
  id: string;
  title: string;
  subject: SubjectCategory;
  lecturerId: string;
  lecturerName: string;
  lecturerInitials: string;
  lecturerAvatarBg: string;
  lecturerGpa: string;
  lecturerRole: string; // e.g. "Senior Peer Tutor"
  dateText: string; // "Tuesday · 17:00"
  location: string; // "Auditorium C1.3.250"
  description: string;
  totalSeats: number;
  bookedSeats: number;
  attendancePoints: number; // e.g. 50 pts
  isBookedByMe: boolean;
  isCheckedIn: boolean;
  selectedTier?: AuditoriumTier;
  checkinToken?: string;
  materialsUrl?: string;
  materialsTitle?: string;
  registeredStudents: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    checkedInAt?: string;
    tier?: AuditoriumTier;
  }[];
}

export interface StoryPoll {
  question: string;
  yesCount: number;
  noCount: number;
  userVoted?: 'yes' | 'no';
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatarBg: string;
  type: 'photo' | 'text' | 'poll';
  content: string;
  backgroundColor?: string;
  timestamp: string;
  hoursLeft: number;
  viewCount: number;
  likesCount: number;
  hasUnseen: boolean;
  isOfficial?: boolean;
  poll?: StoryPoll;
  reactions?: { [emoji: string]: number };
}

export interface MenteeSignal {
  id: string;
  menteeName: string;
  initials: string;
  avatarColor: string;
  actionText: string;
  timeAgo: string;
  type: 'talk_request' | 'rsvp' | 'check_in' | 'message';
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  mentorName: string;
  mentorInitials: string;
  timeText: string;
  timeDue?: string;
  deadlineWarning?: string;
  attendeesCount: number;
  totalSpots: number;
  isRegistered: boolean;
  isCompleted: boolean;
  tagColor?: string;
  format?: 'offline' | 'online_teams';
  locationOrUrl?: string;
}

export type ChatRoomType = 'cohort' | 'direct' | 'lecture';

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name: string;
  subtitle: string;
  avatarBg: string;
  initials: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderAvatarBg: string;
  isMe: boolean;
  text: string;
  time: string;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: { [emoji: string]: number };
  attachment?: {
    type: 'link' | 'file';
    title: string;
    url: string;
  };
}

export interface DSEWReport {
  id: string;
  period: string;
  title: string;
  status: 'Reviewed' | 'Pending' | 'Draft';
  reportType: 'Psychologist' | 'Assignments from DSEW' | 'Needs attention (questions)';
  highlights: string;
  concerns: string;
  selectedAssignments: string[];
  submittedAt: string;
}

export type MeetingFormat = 'offline' | 'online_teams';

export interface OneOnOneBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  dateStr: string;
  timeSlot: string;
  topic: string;
  format: MeetingFormat;
  location: string;
  teamsLink?: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'lecture' | 'mentor' | 'points' | 'event';
  actionView?: string;
}
