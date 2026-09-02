import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  MenteeView,
  MentorView,
  HardMentorView,
  AuthUser,
  Mentor,
  Story,
  EventItem,
  ChatMessage,
  ChatRoom,
  MentorSessionNote,
  MenteeSignal,
  HardLecture,
  AuditoriumTier,
  OneOnOneBooking,
  NotificationItem
} from '../types';
import {
  INITIAL_MENTORS,
  INITIAL_STORIES,
  INITIAL_EVENTS,
  INITIAL_CHAT_MESSAGES,
  MENTEE_SIGNALS,
  INITIAL_HARD_LECTURES
} from '../data/mockData';
import { Language, TRANSLATIONS, Translations } from '../i18n/translations';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-cohort',
    type: 'cohort',
    name: 'SE-2401 Cohort Chat',
    subtitle: 'Assylkhan Toilybekov & 24 peers',
    avatarBg: 'bg-blue-100 text-blue-800',
    initials: 'SE'
  },
  {
    id: 'room-direct-mentor',
    type: 'direct',
    name: 'Aizhan Beibarys (1-on-1)',
    subtitle: 'Direct Mentorship Channel',
    avatarBg: 'bg-purple-100 text-purple-800',
    initials: 'AB'
  },
  {
    id: 'room-calc-qa',
    type: 'lecture',
    name: 'Calculus 1 Q&A (Ayan S.)',
    subtitle: 'Auditorium C1.3.250 Discussion',
    avatarBg: 'bg-indigo-100 text-indigo-800',
    initials: 'C1'
  }
];

const INITIAL_USERS: AuthUser[] = [
  {
    id: 'usr-student',
    email: '264977@astanait.edu.kz',
    name: 'Birzhan Zhanbolatuly',
    initials: 'BZ',
    avatarColor: 'bg-blue-600 text-white',
    role: 'mentee',
    studentId: '264977',
    cohort: 'SE-2601',
    major: 'Software Engineering',
    year: '1st year',
    gpa: '3.85',
    authProvider: 'microsoft',
    telegramUsername: 'birzhan_aitu',
    token: 'tok-student-264977'
  },
  {
    id: 'usr-mentor',
    email: 'aizhan.beibarys@astanait.edu.kz',
    name: 'Aizhan Beibarys',
    initials: 'AB',
    avatarColor: 'bg-purple-600 text-white',
    role: 'mentor',
    studentId: '250452',
    cohort: 'SE-2501 Lead Mentor',
    major: 'Software Engineering',
    year: '2nd year',
    gpa: '3.90',
    authProvider: 'microsoft',
    telegramUsername: 'aizhan_mentor',
    token: 'tok-mentor-aizhan'
  },
  {
    id: 'usr-tutor',
    email: 'ayan.serikbay@astanait.edu.kz',
    name: 'Ayan Serikbay',
    initials: 'AS',
    avatarColor: 'bg-indigo-600 text-white',
    role: 'hard_mentor',
    studentId: '240118',
    cohort: 'Math Dept Peer Tutors',
    major: 'Computer Science',
    year: '3rd year',
    gpa: '3.96',
    authProvider: 'microsoft',
    telegramUsername: 'ayan_calculus',
    token: 'tok-tutor-ayan'
  }
];

interface AppContextType {
  // Localization & Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Theme & App modes
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  isTelegramMode: boolean;
  setIsTelegramMode: (val: boolean) => void;
  isSimulatingOffline: boolean;
  setIsSimulatingOffline: (val: boolean) => void;

  // Authentication & Users
  isAuthenticated: boolean;
  currentUser: AuthUser;
  availableUsers: AuthUser[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  sendEmailOtp: (email: string, role?: UserRole) => Promise<{ success: boolean; devCode?: string; previewUrl?: string | null; message?: string }>;
  verifyEmailOtp: (params: { email: string; code: string; name?: string; major?: string; cohort?: string; studentId?: string }) => Promise<void>;
  updateUserProfile: (params: { name: string; major: string; cohort: string; studentId: string }) => Promise<void>;
  loginWithSSO: (email: string) => Promise<void>;
  loginWithTelegram: () => Promise<void>;
  switchUser: (user: AuthUser) => void;
  logout: () => void;

  // Roles & View navigation
  role: UserRole;
  setRole: (role: UserRole) => void;
  menteeView: MenteeView;
  setMenteeView: (view: MenteeView) => void;
  mentorView: MentorView;
  setMentorView: (view: MentorView) => void;
  hardMentorView: HardMentorView;
  setHardMentorView: (view: HardMentorView) => void;

  // Mentors
  mentors: Mentor[];
  selectedMentorDetail: Mentor | null;
  setSelectedMentorDetail: (mentor: Mentor | null) => void;
  myMentor: Mentor | null;
  selectAsMyMentor: (mentorId: string) => void;

  // 1-on-1 Mentorship Sessions & MS Teams Meetings
  oneOnOneBookings: OneOnOneBooking[];
  selectedMentorForBooking: Mentor | null;
  openOneOnOneModal: (mentor: Mentor) => void;
  closeOneOnOneModal: () => void;
  bookOneOnOneSession: (booking: Omit<OneOnOneBooking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (bookingId: string, status: OneOnOneBooking['status']) => void;

  // Hard Lectures (Ayan / Peer Tutoring)
  hardLectures: HardLecture[];
  bookLecture: (lectureId: string, tier?: AuditoriumTier) => void;
  cancelLectureBooking: (lectureId: string) => void;
  createHardLecture: (lecture: Omit<HardLecture, 'id' | 'bookedSeats' | 'isBookedByMe' | 'isCheckedIn' | 'registeredStudents'>) => void;
  checkInStudent: (lectureId: string, studentId: string) => void;
  verifyCheckInQR: (lectureId: string, studentId: string, token?: string) => Promise<any>;

  // Auditorium Visualizer Modal
  auditoriumLectureModal: HardLecture | null;
  openAuditoriumModal: (lecture: HardLecture) => void;
  closeAuditoriumModal: () => void;

  // Attendance & QR Ticket
  selectedTicketLecture: HardLecture | null;
  openTicketModal: (lecture: HardLecture) => void;
  closeTicketModal: () => void;
  attendancePoints: number;
  attendanceRate: number;

  // Stories & Polls & Floating Reactions
  stories: Story[];
  activeStoryIndex: number | null;
  openStoryModal: (index: number) => void;
  closeStoryModal: () => void;
  addStory: (newStory: Omit<Story, 'id' | 'timestamp' | 'hoursLeft' | 'viewCount' | 'likesCount' | 'hasUnseen'>) => void;
  likeStory: (id: string) => void;
  voteStoryPoll: (storyId: string, choice: 'yes' | 'no') => void;
  reactToStory: (storyId: string, emoji: string) => void;

  // Events
  events: EventItem[];
  toggleEventRegistration: (id: string) => void;
  addEvent: (event: Omit<EventItem, 'id' | 'attendeesCount' | 'isRegistered' | 'isCompleted'>) => void;

  // Multi-room Chat & Realtime Messaging
  chatRooms: ChatRoom[];
  activeChatRoomId: string;
  setActiveChatRoomId: (roomId: string) => void;
  chatMessages: ChatMessage[];
  sendMessage: (text: string, replyTo?: ChatMessage['replyTo'], attachment?: ChatMessage['attachment']) => void;
  reactToChatMessage: (msgId: string, emoji: string) => void;
  sendTypingSignal: () => void;
  typingUsers: { [userName: string]: boolean };

  // Signals (Mentor)
  menteeSignals: MenteeSignal[];

  // Mentor Session Notes
  mentorNotes: MentorSessionNote[];
  saveMentorSessionNote: (note: Omit<MentorSessionNote, 'id'>) => void;

  // Notifications
  notifications: NotificationItem[];
  notificationCount: number;
  isNotificationOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  markNotificationsAsRead: () => void;

  // Tactile & Haptic FX
  triggerConfetti: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: '⚡ +50 Attendance Points Available',
    body: 'Reserve your seat for Calculus 1 crash course with Ayan in C1.3.250.',
    time: '10m ago',
    read: false,
    type: 'lecture',
    actionView: 'lectures'
  },
  {
    id: 'n-2',
    title: '💬 Ruslan K. in Cohort Chat',
    body: '“Ребята, завтра собираемся в АкиТайм вечером в 18:00!”',
    time: '1h ago',
    read: false,
    type: 'mentor',
    actionView: 'chat'
  },
  {
    id: 'n-3',
    title: '🔥 Welcome to AITU Mentorship Platform',
    body: 'Your AITU SSO and Telegram ID are successfully connected.',
    time: 'Today',
    read: false,
    type: 'points'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & i18n
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('aitu_lang') as Language) || 'ru';
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aitu_lang', lang);
    playSound('click');
    triggerHaptic('light');
  };

  // Theme
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('aitu_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('aitu_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    playSound('click');
  };

  // Auth & Current User
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aitu_auth_token') !== null || localStorage.getItem('aitu_authenticated') === 'true';
  });
  const [availableUsers, setAvailableUsers] = useState<AuthUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem('aitu_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [role, setRoleState] = useState<UserRole>(() => {
    return currentUser.role || 'mentee';
  });

  const [menteeView, setMenteeView] = useState<MenteeView>('home');
  const [mentorView, setMentorView] = useState<MentorView>('community');
  const [hardMentorView, setHardMentorView] = useState<HardMentorView>('my_lectures');

  // Mentors catalog
  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem('aitu_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [selectedMentorDetail, setSelectedMentorDetail] = useState<Mentor | null>(null);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);

  // 1-on-1 Sessions & Meetings
  const [oneOnOneBookings, setOneOnOneBookings] = useState<OneOnOneBooking[]>(() => {
    const saved = localStorage.getItem('aitu_1on1_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Hard Lectures
  const [hardLectures, setHardLectures] = useState<HardLecture[]>(() => {
    const saved = localStorage.getItem('aitu_hard_lectures');
    return saved ? JSON.parse(saved) : INITIAL_HARD_LECTURES;
  });

  const [selectedTicketLecture, setSelectedTicketLecture] = useState<HardLecture | null>(null);
  const [auditoriumLectureModal, setAuditoriumLectureModal] = useState<HardLecture | null>(null);

  const [attendancePoints, setAttendancePoints] = useState<number>(() => {
    const saved = localStorage.getItem('aitu_att_points');
    return saved ? Number(saved) : 150;
  });
  const [attendanceRate, setAttendanceRate] = useState<number>(94);

  // Stories
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('aitu_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Events & Multi-room Chat
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('aitu_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [chatRooms] = useState<ChatRoom[]>(INITIAL_CHAT_ROOMS);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>('room-cohort');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aitu_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES.map(m => ({ ...m, roomId: 'room-cohort' }));
  });
  const [typingUsers, setTypingUsers] = useState<{ [userName: string]: boolean }>({});

  const [menteeSignals] = useState<MenteeSignal[]>(MENTEE_SIGNALS);

  const [mentorNotes, setMentorNotes] = useState<MentorSessionNote[]>(() => {
    const saved = localStorage.getItem('aitu_mentor_notes');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationCount = notifications.filter(n => !n.read).length;

  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);
  const [isTelegramMode, setIsTelegramMode] = useState<boolean>(true);

  // WebSocket Live Sync with Auto-Reconnect
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;
    let retryDelay = 1000;

    const connect = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          retryDelay = 1000;
          setWsInstance(ws);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'LECTURE_BOOKED' || data.type === 'LECTURE_CANCELLED' || data.type === 'LECTURE_CREATED') {
              fetch('/api/lectures').then(r => r.json()).then(lecs => setHardLectures(lecs)).catch(() => {});
            } else if (data.type === 'CHAT_MESSAGE') {
              setChatMessages(prev => {
                if (prev.some(m => m.id === data.payload.id)) return prev;
                return [...prev, data.payload];
              });
              playSound('pop');
            } else if (data.type === 'STORY_POLL_UPDATED') {
              setStories(prev => prev.map(s => s.id === data.payload.storyId ? { ...s, poll: data.payload.poll } : s));
            } else if (data.type === 'ONE_ON_ONE_BOOKED') {
              setOneOnOneBookings(prev => {
                if (prev.some(b => b.id === data.payload.id)) return prev;
                return [data.payload, ...prev];
              });
            } else if (data.type === 'STUDENT_CHECKED_IN') {
              playSound('success');
              triggerConfetti();
              if (data.payload.studentId === currentUser.studentId) {
                setAttendancePoints(pt => pt + (data.payload.pointsAwarded || 50));
              }
            } else if (data.type === 'USER_TYPING') {
              const userName = data.payload?.userName;
              if (userName && userName !== currentUser.name) {
                setTypingUsers(prev => ({ ...prev, [userName]: true }));
                setTimeout(() => {
                  setTypingUsers(prev => ({ ...prev, [userName]: false }));
                }, 2500);
              }
            }
          } catch {
            // ignore malformed payloads
          }
        };

        ws.onclose = () => {
          setWsInstance(null);
          if (isMounted) {
            reconnectTimeout = setTimeout(() => {
              retryDelay = Math.min(retryDelay * 1.5, 10000);
              connect();
            }, retryDelay);
          }
        };
      } catch {
        if (isMounted) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [currentUser.studentId, currentUser.name]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aitu_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aitu_hard_lectures', JSON.stringify(hardLectures));
  }, [hardLectures]);

  useEffect(() => {
    localStorage.setItem('aitu_att_points', attendancePoints.toString());
  }, [attendancePoints]);

  useEffect(() => {
    localStorage.setItem('aitu_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('aitu_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('aitu_1on1_bookings', JSON.stringify(oneOnOneBookings));
  }, [oneOnOneBookings]);

  useEffect(() => {
    localStorage.setItem('aitu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('aitu_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('aitu_mentor_notes', JSON.stringify(mentorNotes));
  }, [mentorNotes]);

  // Telegram WebApp auto-detection
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        const displayName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() || 'AITU Student';
        setCurrentUser(prev => ({
          ...prev,
          name: displayName,
          telegramUsername: tgUser.username || prev.telegramUsername,
          authProvider: 'telegram'
        }));
      }
      if (tg.colorScheme === 'dark') {
        setThemeModeState('dark');
      }
    }
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'medium') => {
    try {
      if ((window as any).Telegram?.WebApp?.HapticFeedback) {
        if (type === 'success') {
          (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        } else {
          (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
      } else if (navigator.vibrate) {
        navigator.vibrate(type === 'heavy' ? 40 : 20);
      }
    } catch {
      // ignore
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']
      });
    } catch {
      // ignore
    }
  };

  // Auth Operations
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const sendEmailOtp = async (email: string, role: UserRole = 'mentee') => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json().catch(() => ({ error: 'Не удалось получить ответ от сервера' }));
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки кода');
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка соединения с сервером авторизации');
    }
  };

  const verifyEmailOtp = async (params: { email: string; code: string; name?: string; major?: string; cohort?: string; studentId?: string }) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json().catch(() => ({ error: 'Не удалось получить ответ от сервера' }));
      if (!res.ok) throw new Error(data.error || 'Ошибка проверки кода');

      setCurrentUser(data.user);
      setRoleState(data.user.role);
      setIsAuthenticated(true);
      localStorage.setItem('aitu_auth_token', data.token);
      localStorage.setItem('aitu_authenticated', 'true');
      localStorage.setItem('aitu_current_user', JSON.stringify(data.user));

      if (data.user.role === 'mentee') setMenteeView('home');
      else if (data.user.role === 'hard_mentor') setHardMentorView('my_lectures');
      else setMentorView('community');
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка проверки кода подтверждения');
    }
  };

  const updateUserProfile = async (params: { name: string; major: string; cohort: string; studentId: string }) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, ...params })
      });
      const data = await res.json().catch(() => ({}));
      if (data.user) {
        setCurrentUser(prev => ({ ...prev, ...data.user }));
        localStorage.setItem('aitu_current_user', JSON.stringify({ ...currentUser, ...data.user }));
      }
    } catch {
      // ignore
    }
  };

  const loginWithSSO = async (email: string) => {
    try {
      const res = await fetch('/api/auth/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({ error: 'Не удалось получить ответ от сервера SSO' }));
      if (!res.ok) throw new Error(data.error || 'Ошибка входа через SSO');
      setCurrentUser(data.user);
      setRoleState(data.user.role);
      setIsAuthenticated(true);
      localStorage.setItem('aitu_auth_token', data.user.token);
      localStorage.setItem('aitu_authenticated', 'true');
      localStorage.setItem('aitu_current_user', JSON.stringify(data.user));
      triggerConfetti();
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка авторизации через SSO');
    }
  };

  const loginWithTelegram = async () => {
    try {
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user || {
        id: 254977,
        first_name: 'Birzhan',
        last_name: 'Zhanbolatuly',
        username: 'birzhan_aitu'
      };

      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramUser: tgUser })
      });
      const data = await res.json().catch(() => ({ error: 'Не удалось получить ответ от сервера Telegram' }));
      if (!res.ok) throw new Error(data.error || 'Ошибка входа через Telegram');
      setCurrentUser(data.user);
      setRoleState(data.user.role);
      setIsAuthenticated(true);
      localStorage.setItem('aitu_auth_token', data.user.token);
      localStorage.setItem('aitu_authenticated', 'true');
      localStorage.setItem('aitu_current_user', JSON.stringify(data.user));
      triggerConfetti();
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка входа через Telegram');
    }
  };

  const switchUser = (user: AuthUser) => {
    setCurrentUser(user);
    setRoleState(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('aitu_auth_token', user.token);
    localStorage.setItem('aitu_authenticated', 'true');
    localStorage.setItem('aitu_current_user', JSON.stringify(user));
    triggerHaptic('success');
    playSound('click');
    if (user.role === 'mentee') setMenteeView('home');
    else if (user.role === 'hard_mentor') setHardMentorView('my_lectures');
    else setMentorView('community');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aitu_auth_token');
    localStorage.removeItem('aitu_authenticated');
    playSound('pop');
    triggerHaptic('medium');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUser(prev => ({ ...prev, role: newRole }));
    triggerHaptic('medium');
    playSound('click');
    if (newRole === 'mentee') {
      setMenteeView('home');
    } else if (newRole === 'mentor') {
      setMentorView('community');
    } else {
      setHardMentorView('my_lectures');
    }
  };

  const myMentor = mentors.find(m => m.isYourMentor) || mentors[3];

  const selectAsMyMentor = (mentorId: string) => {
    setMentors(prev =>
      prev.map(m => ({
        ...m,
        isYourMentor: m.id === mentorId,
        assignedMentees: m.id === mentorId ? m.assignedMentees + 1 : m.assignedMentees
      }))
    );
    fetch('/api/mentors/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId })
    }).catch(() => {});

    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  // 1-on-1 Mentorship Booking & Meetings
  const openOneOnOneModal = (mentor: Mentor) => {
    setSelectedMentorForBooking(mentor);
    triggerHaptic('light');
  };

  const closeOneOnOneModal = () => {
    setSelectedMentorForBooking(null);
  };

  const bookOneOnOneSession = (bookingData: Omit<OneOnOneBooking, 'id' | 'createdAt'>) => {
    const meetingCode = Math.random().toString(36).substring(2, 9);
    const teamsLink = bookingData.format === 'online_teams'
      ? `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${meetingCode}%40thread.v2/0?context=%7b%22Tid%22%3a%22astanait-edu-kz%22%7d`
      : undefined;

    const newBooking: OneOnOneBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      teamsLink,
      createdAt: new Date().toISOString()
    };
    setOneOnOneBookings(prev => [newBooking, ...prev]);

    // Also add to events list
    const newEv: EventItem = {
      id: `ev-1on1-${Date.now()}`,
      title: `1-on-1: ${bookingData.topic}`,
      description: `Meeting with ${bookingData.mentorName} at ${bookingData.location}. Notes: ${bookingData.notes || 'None'}`,
      category: 'Mentorship',
      mentorName: bookingData.mentorName,
      mentorInitials: bookingData.mentorName.split(' ').map(n => n[0]).join(''),
      timeText: `${bookingData.dateStr} · ${bookingData.timeSlot}`,
      attendeesCount: 1,
      totalSpots: 1,
      isRegistered: true,
      isCompleted: false,
      format: bookingData.format,
      locationOrUrl: teamsLink || bookingData.location,
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    setEvents(prev => [newEv, ...prev]);

    fetch('/api/bookings/one-on-one', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).catch(() => {});
  };

  const updateBookingStatus = (bookingId: string, status: OneOnOneBooking['status']) => {
    setOneOnOneBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    fetch(`/api/bookings/one-on-one/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
    triggerHaptic('medium');
    playSound('click');
  };

  // Hard Lecture Actions
  const openAuditoriumModal = (lecture: HardLecture) => {
    setAuditoriumLectureModal(lecture);
    triggerHaptic('light');
  };

  const closeAuditoriumModal = () => {
    setAuditoriumLectureModal(null);
  };

  const bookLecture = (lectureId: string, tier: AuditoriumTier = 'front') => {
    setHardLectures(prev =>
      prev.map(lec => {
        if (lec.id === lectureId) {
          if (lec.isBookedByMe) return lec;
          const updatedBooked = lec.bookedSeats + 1;
          const updatedStudents = [
            ...lec.registeredStudents,
            {
              studentId: currentUser.studentId,
              studentName: currentUser.name,
              studentEmail: currentUser.email,
              tier
            }
          ];
          const bookedLec = {
            ...lec,
            bookedSeats: updatedBooked,
            isBookedByMe: true,
            selectedTier: tier,
            registeredStudents: updatedStudents
          };
          setSelectedTicketLecture(bookedLec);
          return bookedLec;
        }
        return lec;
      })
    );

    fetch(`/api/lectures/${lectureId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentUser.studentId,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        tier
      })
    }).catch(() => {});

    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  const cancelLectureBooking = (lectureId: string) => {
    setHardLectures(prev =>
      prev.map(lec => {
        if (lec.id === lectureId) {
          return {
            ...lec,
            bookedSeats: Math.max(0, lec.bookedSeats - 1),
            isBookedByMe: false,
            isCheckedIn: false,
            registeredStudents: lec.registeredStudents.filter(s => s.studentId !== currentUser.studentId)
          };
        }
        return lec;
      })
    );

    fetch(`/api/lectures/${lectureId}/book`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: currentUser.studentId })
    }).catch(() => {});

    if (selectedTicketLecture?.id === lectureId) {
      setSelectedTicketLecture(null);
    }
    triggerHaptic('light');
  };

  const createHardLecture = (lectureData: Omit<HardLecture, 'id' | 'bookedSeats' | 'isBookedByMe' | 'isCheckedIn' | 'registeredStudents'>) => {
    const newLec: HardLecture = {
      ...lectureData,
      id: `lec-${Date.now()}`,
      bookedSeats: 0,
      isBookedByMe: false,
      isCheckedIn: false,
      checkinToken: `AITU-LEC-${Date.now()}-TOKEN`,
      registeredStudents: []
    };
    setHardLectures(prev => [newLec, ...prev]);

    fetch('/api/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lectureData)
    }).catch(() => {});

    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  const checkInStudent = (lectureId: string, studentId: string) => {
    setHardLectures(prev =>
      prev.map(lec => {
        if (lec.id === lectureId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedStudents = lec.registeredStudents.map(s =>
            s.studentId === studentId ? { ...s, checkedInAt: nowStr } : s
          );
          const isMe = studentId === currentUser.studentId;
          if (isMe) {
            setAttendancePoints(pt => pt + lec.attendancePoints);
          }
          return {
            ...lec,
            isCheckedIn: isMe ? true : lec.isCheckedIn,
            registeredStudents: updatedStudents
          };
        }
        return lec;
      })
    );

    fetch(`/api/lectures/${lectureId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    }).catch(() => {});

    playSound('beep');
    setTimeout(() => playSound('success'), 150);
    triggerHaptic('success');
    triggerConfetti();
  };

  const verifyCheckInQR = async (lectureId: string, studentId: string, token?: string) => {
    const res = await fetch(`/api/lectures/${lectureId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, token })
    });
    return res.json();
  };

  const openTicketModal = (lecture: HardLecture) => {
    setSelectedTicketLecture(lecture);
    triggerHaptic('light');
  };

  const closeTicketModal = () => {
    setSelectedTicketLecture(null);
  };

  // Stories & Polls
  const openStoryModal = (index: number) => {
    setActiveStoryIndex(index);
    triggerHaptic('light');
    setStories(prev =>
      prev.map((s, i) => (i === index ? { ...s, hasUnseen: false, viewCount: s.viewCount + 1 } : s))
    );
  };

  const closeStoryModal = () => {
    setActiveStoryIndex(null);
  };

  const addStory = (newStoryData: Omit<Story, 'id' | 'timestamp' | 'hoursLeft' | 'viewCount' | 'likesCount' | 'hasUnseen'>) => {
    const newStory: Story = {
      ...newStoryData,
      id: `story-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorInitials: currentUser.initials,
      authorAvatarBg: currentUser.avatarColor,
      timestamp: 'Just now',
      hoursLeft: 24,
      viewCount: 1,
      likesCount: 0,
      hasUnseen: true
    };
    setStories(prev => [newStory, ...prev.filter(s => s.id !== 's-1')]);

    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStoryData)
    }).catch(() => {});

    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  const likeStory = (id: string) => {
    setStories(prev =>
      prev.map(s => (s.id === id ? { ...s, likesCount: s.likesCount + 1 } : s))
    );
    triggerHaptic('light');
    playSound('pop');
  };

  const voteStoryPoll = (storyId: string, choice: 'yes' | 'no') => {
    setStories(prev =>
      prev.map(s => {
        if (s.id === storyId && s.poll) {
          return {
            ...s,
            poll: {
              ...s.poll,
              yesCount: choice === 'yes' ? s.poll.yesCount + 1 : s.poll.yesCount,
              noCount: choice === 'no' ? s.poll.noCount + 1 : s.poll.noCount,
              userVoted: choice
            }
          };
        }
        return s;
      })
    );

    fetch(`/api/stories/${storyId}/poll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, userId: currentUser.id })
    }).catch(() => {});

    playSound('success');
    triggerHaptic('success');
  };

  const reactToStory = (storyId: string, emoji: string) => {
    setStories(prev =>
      prev.map(s => {
        if (s.id === storyId) {
          const currentCount = s.reactions?.[emoji] || 0;
          return {
            ...s,
            reactions: {
              ...s.reactions,
              [emoji]: currentCount + 1
            }
          };
        }
        return s;
      })
    );

    fetch(`/api/stories/${storyId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji })
    }).catch(() => {});

    playSound('pop');
    triggerHaptic('light');
  };

  // Events
  const toggleEventRegistration = (id: string) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextRegistered = !e.isRegistered;
          return {
            ...e,
            isRegistered: nextRegistered,
            attendeesCount: nextRegistered ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
          };
        }
        return e;
      })
    );
    triggerHaptic('medium');
    playSound('click');
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'attendeesCount' | 'isRegistered' | 'isCompleted'>) => {
    const newEv: EventItem = {
      ...eventData,
      id: `ev-${Date.now()}`,
      attendeesCount: 1,
      isRegistered: true,
      isCompleted: false
    };
    setEvents(prev => [newEv, ...prev]);
    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  // Chat Operations
  const sendMessage = (text: string, replyTo?: ChatMessage['replyTo'], attachment?: ChatMessage['attachment']) => {
    if (!text.trim() && !attachment) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const myMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: activeChatRoomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderInitials: currentUser.initials,
      senderAvatarBg: currentUser.avatarColor,
      isMe: true,
      text: text.trim(),
      time: nowStr,
      replyTo,
      attachment
    };

    setChatMessages(prev => [...prev, myMsg]);
    triggerHaptic('light');
    playSound('pop');

    fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(myMsg)
    }).catch(() => {});
  };

  const reactToChatMessage = (msgId: string, emoji: string) => {
    setChatMessages(prev =>
      prev.map(m => {
        if (m.id === msgId) {
          const current = m.reactions?.[emoji] || 0;
          return {
            ...m,
            reactions: {
              ...m.reactions,
              [emoji]: current + 1
            }
          };
        }
        return m;
      })
    );

    fetch(`/api/chat/messages/${msgId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji })
    }).catch(() => {});

    playSound('pop');
    triggerHaptic('light');
  };

  const sendTypingSignal = useCallback(() => {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.send(JSON.stringify({
        type: 'TYPING',
        payload: { roomId: activeChatRoomId, userName: currentUser.name }
      }));
    }
  }, [wsInstance, activeChatRoomId, currentUser.name]);

  // Mentor Session Notes
  const saveMentorSessionNote = (noteData: Omit<MentorSessionNote, 'id'>) => {
    const newNote: MentorSessionNote = {
      ...noteData,
      id: `note-${Date.now()}`
    };
    setMentorNotes(prev => {
      const updated = [newNote, ...prev];
      localStorage.setItem('aitu_mentor_notes', JSON.stringify(updated));
      return updated;
    });
    triggerHaptic('success');
    playSound('success');
    triggerConfetti();
  };

  // Notifications
  const openNotifications = () => {
    setIsNotificationOpen(true);
    triggerHaptic('light');
  };

  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerHaptic('light');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        themeMode,
        setThemeMode,
        isTelegramMode,
        setIsTelegramMode,
        isSimulatingOffline,
        setIsSimulatingOffline,
        isAuthenticated,
        currentUser,
        availableUsers,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendEmailOtp,
        verifyEmailOtp,
        updateUserProfile,
        loginWithSSO,
        loginWithTelegram,
        switchUser,
        logout,
        role,
        setRole,
        menteeView,
        setMenteeView,
        mentorView,
        setMentorView,
        hardMentorView,
        setHardMentorView,
        mentors,
        selectedMentorDetail,
        setSelectedMentorDetail,
        myMentor,
        selectAsMyMentor,
        oneOnOneBookings,
        selectedMentorForBooking,
        openOneOnOneModal,
        closeOneOnOneModal,
        bookOneOnOneSession,
        updateBookingStatus,
        hardLectures,
        bookLecture,
        cancelLectureBooking,
        createHardLecture,
        checkInStudent,
        verifyCheckInQR,
        auditoriumLectureModal,
        openAuditoriumModal,
        closeAuditoriumModal,
        selectedTicketLecture,
        openTicketModal,
        closeTicketModal,
        attendancePoints,
        attendanceRate,
        stories,
        activeStoryIndex,
        openStoryModal,
        closeStoryModal,
        addStory,
        likeStory,
        voteStoryPoll,
        reactToStory,
        events,
        toggleEventRegistration,
        addEvent,
        chatRooms,
        activeChatRoomId,
        setActiveChatRoomId,
        chatMessages,
        sendMessage,
        reactToChatMessage,
        sendTypingSignal,
        typingUsers,
        menteeSignals,
        mentorNotes,
        saveMentorSessionNote,
        notifications,
        notificationCount,
        isNotificationOpen,
        openNotifications,
        closeNotifications,
        markNotificationsAsRead,
        triggerConfetti,
        triggerHaptic
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
