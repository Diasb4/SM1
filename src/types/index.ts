export type UserRole = 'mentee' | 'mentor' | 'hard_mentor';

export type MenteeView = 'home' | 'mentors' | 'lectures' | 'events' | 'chat' | 'profile' | 'skeleton' | 'empty_tasks' | 'offline_error';
export type MentorView = 'community' | 'stories' | 'new_story' | 'weekly_report' | 'events' | 'profile';
export type HardMentorView = 'my_lectures' | 'scanner' | 'create_lecture' | 'analytics';

export type MoodType = 'terrible' | 'bad' | 'neutral' | 'good' | 'amazing';

export interface MoodCheckIn {
  date: string;
  mood: MoodType | null;
  timestamp?: string;
  sharedWithMentor: boolean;
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
}

export type SubjectCategory = 'Calculus' | 'Linear Algebra' | 'OOP & Java' | 'Algorithms & DSA' | 'Physics' | 'Discrete Math';

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
  registeredStudents: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    checkedInAt?: string;
  }[];
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatarBg: string;
  type: 'photo' | 'text';
  content: string;
  backgroundColor?: string;
  timestamp: string;
  hoursLeft: number;
  viewCount: number;
  likesCount: number;
  hasUnseen: boolean;
  isOfficial?: boolean;
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
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderAvatarBg: string;
  isMe: boolean;
  text: string;
  time: string;
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
