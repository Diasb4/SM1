import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  MenteeView,
  MentorView,
  HardMentorView,
  Mentor,
  Story,
  EventItem,
  ChatMessage,
  DSEWReport,
  MoodType,
  MoodCheckIn,
  MenteeSignal,
  HardLecture
} from '../types';
import {
  INITIAL_MENTORS,
  INITIAL_STORIES,
  INITIAL_EVENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DSEW_REPORTS,
  MENTEE_SIGNALS,
  INITIAL_HARD_LECTURES
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
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
  
  // Hard Lectures (Ayan / Peer Tutoring)
  hardLectures: HardLecture[];
  bookLecture: (lectureId: string) => void;
  cancelLectureBooking: (lectureId: string) => void;
  createHardLecture: (lecture: Omit<HardLecture, 'id' | 'bookedSeats' | 'isBookedByMe' | 'isCheckedIn' | 'registeredStudents'>) => void;
  checkInStudent: (lectureId: string, studentId: string) => void;
  
  // Attendance & QR Ticket
  selectedTicketLecture: HardLecture | null;
  openTicketModal: (lecture: HardLecture) => void;
  closeTicketModal: () => void;
  attendancePoints: number;
  attendanceRate: number;
  
  // Stories
  stories: Story[];
  activeStoryIndex: number | null;
  openStoryModal: (index: number) => void;
  closeStoryModal: () => void;
  addStory: (newStory: Omit<Story, 'id' | 'timestamp' | 'hoursLeft' | 'viewCount' | 'likesCount' | 'hasUnseen'>) => void;
  likeStory: (id: string) => void;
  
  // Mood check-in
  todayCheckIn: MoodCheckIn;
  setMood: (mood: MoodType) => void;
  
  // Events
  events: EventItem[];
  toggleEventRegistration: (id: string) => void;
  addEvent: (event: Omit<EventItem, 'id' | 'attendeesCount' | 'isRegistered' | 'isCompleted'>) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  
  // Signals (Mentor)
  menteeSignals: MenteeSignal[];
  
  // DSEW Reports (Mentor)
  reports: DSEWReport[];
  submitReport: (report: Omit<DSEWReport, 'id' | 'status' | 'submittedAt'>) => void;
  
  // Global & Telegram state
  notificationCount: number;
  clearNotifications: () => void;
  triggerConfetti: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success') => void;
  isSimulatingOffline: boolean;
  setIsSimulatingOffline: (val: boolean) => void;
  isTelegramMode: boolean;
  setIsTelegramMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('aitu_role') as UserRole) || 'mentee';
  });

  const [menteeView, setMenteeView] = useState<MenteeView>('home');
  const [mentorView, setMentorView] = useState<MentorView>('community');
  const [hardMentorView, setHardMentorView] = useState<HardMentorView>('my_lectures');

  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem('aitu_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [selectedMentorDetail, setSelectedMentorDetail] = useState<Mentor | null>(null);

  // Hard Lectures state
  const [hardLectures, setHardLectures] = useState<HardLecture[]>(() => {
    const saved = localStorage.getItem('aitu_hard_lectures');
    return saved ? JSON.parse(saved) : INITIAL_HARD_LECTURES;
  });

  const [selectedTicketLecture, setSelectedTicketLecture] = useState<HardLecture | null>(null);
  const [attendancePoints, setAttendancePoints] = useState<number>(() => {
    const saved = localStorage.getItem('aitu_att_points');
    return saved ? Number(saved) : 150;
  });
  const [attendanceRate, setAttendanceRate] = useState<number>(94);

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('aitu_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const [todayCheckIn, setTodayCheckIn] = useState<MoodCheckIn>(() => {
    const saved = localStorage.getItem('aitu_checkin');
    return saved ? JSON.parse(saved) : { date: 'Tuesday · 3 June', mood: null, sharedWithMentor: true };
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('aitu_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aitu_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [menteeSignals, setMenteeSignals] = useState<MenteeSignal[]>(MENTEE_SIGNALS);

  const [reports, setReports] = useState<DSEWReport[]>(() => {
    const saved = localStorage.getItem('aitu_reports');
    return saved ? JSON.parse(saved) : INITIAL_DSEW_REPORTS;
  });

  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);
  const [isTelegramMode, setIsTelegramMode] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aitu_role', role);
  }, [role]);

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
    localStorage.setItem('aitu_checkin', JSON.stringify(todayCheckIn));
  }, [todayCheckIn]);

  useEffect(() => {
    localStorage.setItem('aitu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('aitu_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('aitu_reports', JSON.stringify(reports));
  }, [reports]);

  // Telegram WebApp initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
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

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    triggerHaptic('medium');
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
    triggerHaptic('success');
    triggerConfetti();
  };

  // Hard Lecture Actions
  const bookLecture = (lectureId: string) => {
    setHardLectures(prev =>
      prev.map(lec => {
        if (lec.id === lectureId) {
          if (lec.isBookedByMe) return lec;
          const updatedBooked = lec.bookedSeats + 1;
          const updatedStudents = [
            ...lec.registeredStudents,
            { studentId: '254977', studentName: 'Birzhan Zhanbolatuly', studentEmail: '254977@astanait.edu.kz' }
          ];
          const bookedLec = {
            ...lec,
            bookedSeats: updatedBooked,
            isBookedByMe: true,
            registeredStudents: updatedStudents
          };
          setSelectedTicketLecture(bookedLec);
          return bookedLec;
        }
        return lec;
      })
    );
    triggerHaptic('success');
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
            registeredStudents: lec.registeredStudents.filter(s => s.studentId !== '254977')
          };
        }
        return lec;
      })
    );
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
      registeredStudents: []
    };
    setHardLectures(prev => [newLec, ...prev]);
    triggerHaptic('success');
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
          const isMe = studentId === '254977';
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
    triggerHaptic('success');
    triggerConfetti();
  };

  const openTicketModal = (lecture: HardLecture) => {
    setSelectedTicketLecture(lecture);
    triggerHaptic('light');
  };

  const closeTicketModal = () => {
    setSelectedTicketLecture(null);
  };

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
      timestamp: 'Just now',
      hoursLeft: 24,
      viewCount: 1,
      likesCount: 0,
      hasUnseen: true
    };
    setStories(prev => [newStory, ...prev.filter(s => s.id !== 's-1')]);
    triggerHaptic('success');
    triggerConfetti();
  };

  const likeStory = (id: string) => {
    setStories(prev =>
      prev.map(s => (s.id === id ? { ...s, likesCount: s.likesCount + 1 } : s))
    );
    triggerHaptic('light');
  };

  const setMood = (mood: MoodType) => {
    setTodayCheckIn({
      date: 'Tuesday · 3 June',
      mood,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sharedWithMentor: true
    });
    triggerHaptic('medium');
    triggerConfetti();
  };

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
    triggerConfetti();
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const myMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: role === 'mentee' ? 'me' : role === 'hard_mentor' ? 'ayan' : 'mentor_me',
      senderName: role === 'mentee' ? 'Birzhan Zhanbolatuly' : role === 'hard_mentor' ? 'Ayan Serikbay' : 'Aizhan Beibarys',
      senderInitials: role === 'mentee' ? 'BZ' : role === 'hard_mentor' ? 'AS' : 'AB',
      senderAvatarBg: role === 'mentee' ? 'bg-blue-100 text-blue-700' : role === 'hard_mentor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-700',
      isMe: true,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, myMsg]);
    triggerHaptic('light');

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: 'ruslan',
        senderName: 'Ruslan K.',
        senderInitials: 'RK',
        senderAvatarBg: 'bg-emerald-100 text-emerald-700',
        isMe: false,
        text: 'Супер! Забронировал нам столик на 18:00 👍',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, replyMsg]);
      triggerHaptic('medium');
    }, 1500);
  };

  const submitReport = (reportData: Omit<DSEWReport, 'id' | 'status' | 'submittedAt'>) => {
    const newRep: DSEWReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'Reviewed',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setReports(prev => [newRep, ...prev]);
    triggerHaptic('success');
    triggerConfetti();
  };

  const clearNotifications = () => setNotificationCount(0);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#06b6d4']
      });
    } catch {
      // ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        hardLectures,
        bookLecture,
        cancelLectureBooking,
        createHardLecture,
        checkInStudent,
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
        todayCheckIn,
        setMood,
        events,
        toggleEventRegistration,
        addEvent,
        chatMessages,
        sendMessage,
        menteeSignals,
        reports,
        submitReport,
        notificationCount,
        clearNotifications,
        triggerConfetti,
        triggerHaptic,
        isSimulatingOffline,
        setIsSimulatingOffline,
        isTelegramMode,
        setIsTelegramMode
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
