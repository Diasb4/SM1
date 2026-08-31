export type Language = 'en' | 'ru' | 'kz';

export interface Translations {
  appName: string;
  botUsername: string;
  tagline: string;
  roles: {
    mentee: string;
    mentor: string;
    hardMentor: string;
  };
  nav: {
    home: string;
    mentors: string;
    lectures: string;
    guide: string;
    events: string;
    chat: string;
    profile: string;
    community: string;
    stories: string;
    reports: string;
    scanner: string;
  };
  home: {
    greeting: string;
    date: string;
    checkInTitle: string;
    checkInSubtitle: string;
    yourSoftMentor: string;
    seeProfile: string;
    message: string;
    chooseMentor: string;
    pickHumanTag: string;
    dashboardEvents: string;
    more: string;
    noEventsToday: string;
    activeAssignment: string;
  };
  guide: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    tabAcademic: string;
    tabCampus: string;
    tabClubs: string;
    tabDigital: string;
    tabContacts: string;
    gpaCalcTitle: string;
    gpaCalcSubtitle: string;
    r1Label: string;
    r2Label: string;
    finalLabel: string;
    totalScore: string;
    letterGrade: string;
    gpaPoints: string;
    retakeWarning: string;
    excellentPass: string;
    goodPass: string;
    floor1Title: string;
    floor2Title: string;
    floor3Title: string;
    moodleTitle: string;
    duTitle: string;
    eduroamTitle: string;
    aitusaTitle: string;
    gdscTitle: string;
    decentrathonTitle: string;
    debateTitle: string;
    sportTitle: string;
  };
  lectures: {
    title: string;
    subtitle: string;
    attendancePill: string;
    points: string;
    bannerTitle: string;
    bannerDesc: string;
    allSubjects: string;
    searchPlaceholder: string;
    seatsLeft: string;
    seatsBooked: string;
    capacity: string;
    reserveSeat: string;
    viewTicket: string;
    checkedIn: string;
    cancel: string;
    soldOut: string;
    auditoriumPicker: string;
    downloadMaterials: string;
    rowFront: string;
    rowMiddle: string;
    rowBack: string;
    selectTier: string;
    tierSeatsAvailable: string;
  };
  ticket: {
    passTitle: string;
    student: string;
    reward: string;
    autoCredited: string;
    dateTime: string;
    auditorium: string;
    simScan: string;
    checkedInSuccess: string;
    countdown: string;
    startsIn: string;
    downloadPass: string;
    shareTicket: string;
  };
  lecturerDesk: {
    title: string;
    subtitle: string;
    metricsLectures: string;
    metricsCapacity: string;
    metricsTotalBooked: string;
    scheduledSessions: string;
    qrScanBtn: string;
    registeredRoster: string;
    createLectureBtn: string;
    scannerTitle: string;
    cameraInstruction: string;
    manualCheckIn: string;
    manualCheckInPlaceholder: string;
    checkInBtn: string;
    quickCheckInBirzhan: string;
    exportCsv: string;
    studentId: string;
    studentName: string;
    status: string;
    time: string;
  };
  mentorCatalog: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    forYou: string;
    myMajor: string;
    creative: string;
    sport: string;
    star: string;
    spots: string;
    full: string;
    yourMentor: string;
    selectAsMentor: string;
    about: string;
    languages: string;
    hobbies: string;
    onCampus: string;
    achievements: string;
    bookOneOnOne: string;
    oneOnOneAdvisory: string;
  };
  oneOnOne: {
    title: string;
    subtitle: string;
    selectTopic: string;
    topicElective: string;
    topicStress: string;
    topicCareer: string;
    topicCampusLife: string;
    selectSlot: string;
    selectLocation: string;
    locCoworking: string;
    locAkiTime: string;
    locPark: string;
    locTeams: string;
    notes: string;
    notesPlaceholder: string;
    confirmBooking: string;
    bookingSuccess: string;
  };
  stories: {
    title: string;
    subtitle: string;
    postStory: string;
    postStoryDesc: string;
    liveNow: string;
    you: string;
    views: string;
    hoursLeft: string;
    newStory: string;
    photo: string;
    text: string;
    poll: string;
    tapToUpload: string;
    captionPlaceholder: string;
    typeStoryPlaceholder: string;
    pollQuestionPlaceholder: string;
    shareBtn: string;
    replyPlaceholder: string;
    pollYes: string;
    pollNo: string;
    voted: string;
  };
  checkIn: {
    title: string;
    streak: string;
    loggedAt: string;
    savedPrivately: string;
    rough: string;
    tired: string;
    okay: string;
    good: string;
    great: string;
    historyTitle: string;
    wellbeingScore: string;
  };
  chat: {
    groupTitle: string;
    membersOnline: string;
    today: string;
    messagePlaceholder: string;
    send: string;
    searchMessages: string;
  };
  reports: {
    title: string;
    dueIn: string;
    desc: string;
    typeTitle: string;
    highlights: string;
    highlightsPlaceholder: string;
    concerns: string;
    concernsPlaceholder: string;
    chooseAssignment: string;
    submitDSEW: string;
    pastReports: string;
    analyticsTitle: string;
    sentimentOverview: string;
  };
  profile: {
    title: string;
    verifiedMicrosoft: string;
    softMentor: string;
    installPin: string;
    privacyData: string;
    signOut: string;
    language: string;
    theme: string;
    dark: string;
    light: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'AITU Mentorship',
    botUsername: '@aitumentor_bot',
    tagline: 'Pick the human, not the metric',
    roles: {
      mentee: '👨‍🎓 Mentee',
      mentor: '👩‍🏫 Soft Mentor',
      hardMentor: '📐 Hard Mentor (Ayan)'
    },
    nav: {
      home: 'Home',
      mentors: 'Soft Mentors',
      lectures: 'Hard Lectures',
      guide: 'AITU Guide 2.0',
      events: 'Events',
      chat: 'Chat',
      profile: 'Profile',
      community: 'Cohort',
      stories: 'Stories',
      reports: 'Reports',
      scanner: 'QR Scanner'
    },
    guide: {
      title: 'AITU Guide 2.0',
      subtitle: 'Official freshman handbook & campus knowledge base (@guideaitu2)',
      searchPlaceholder: 'Search GPA rules, campus rooms (C1), clubs or contacts...',
      tabAcademic: '🎓 Academic & GPA',
      tabCampus: '🏢 EXPO Campus Map',
      tabClubs: '⚡ Student Clubs',
      tabDigital: '💻 Digital LMS',
      tabContacts: '📞 Contacts',
      gpaCalcTitle: 'Interactive AITU GPA Calculator',
      gpaCalcSubtitle: 'Formula: (R1 × 0.3) + (R2 × 0.3) + (Final × 0.4)',
      r1Label: 'Attestation 1 (0–100)',
      r2Label: 'Attestation 2 (0–100)',
      finalLabel: 'Final Exam (0–100)',
      totalScore: 'Total Score',
      letterGrade: 'Letter Grade',
      gpaPoints: 'GPA Equivalent',
      retakeWarning: '⚠️ Below 50 points (F/FX): Requires Retake / Retake Exam session',
      excellentPass: '🎉 Honors standing (A / A-)',
      goodPass: '✅ Successfully passed discipline',
      floor1Title: 'Floor 1 (C1.1) · Main Entrance & Canteen',
      floor2Title: 'Floor 2 (C1.2) · Registrar, Library & Silent Hall',
      floor3Title: 'Floor 3 (C1.3) · 100-Seat Auditoriums & Tech Labs',
      moodleTitle: 'Moodle LMS (moodle.astanait.edu.kz)',
      duTitle: 'Digital University (du.astanait.edu.kz)',
      eduroamTitle: 'Eduroam & AITU-Student Wi-Fi',
      aitusaTitle: 'AITUSA Student Government',
      gdscTitle: 'GDSC AITU (Google Developer Student Club)',
      decentrathonTitle: 'Decentrathon & Web3 Hub',
      debateTitle: 'AITU Debate Club (Nomad)',
      sportTitle: 'AITU Sports Leagues (Football, Basketball, Table Tennis)'
    },
    home: {
      greeting: 'Hi, Birzhan',
      date: 'Tuesday · 3 June',
      checkInTitle: 'Daily check-in',
      checkInSubtitle: 'How are you today? Just for you — nobody sees this unless you share it.',
      yourSoftMentor: 'Your soft mentor',
      seeProfile: 'See profile',
      message: 'Message',
      chooseMentor: 'Choose your Soft Mentor',
      pickHumanTag: 'Pick the human, not the metric',
      dashboardEvents: 'Dashboard of events',
      more: 'More',
      noEventsToday: 'No upcoming events today.',
      activeAssignment: 'Active assignment'
    },
    lectures: {
      title: 'Academic Lectures',
      subtitle: 'Hard mentors & Peer Tutors · Offline sessions',
      attendancePill: 'Attendance',
      points: 'pts',
      bannerTitle: 'Earn attendance points offline',
      bannerDesc: 'Reserve your seat, scan your QR ticket at the auditorium entrance with the lecturer, and earn +50 points for university attendance grading.',
      allSubjects: 'All',
      searchPlaceholder: 'Search by topic, lecturer (e.g. Ayan) or room...',
      seatsLeft: 'seats left',
      seatsBooked: 'seats booked',
      capacity: 'Capacity',
      reserveSeat: 'Reserve Seat & Get QR Ticket',
      viewTicket: 'View QR Ticket',
      checkedIn: 'Checked In ✓',
      cancel: 'Cancel',
      soldOut: 'Sold Out (100% Full)',
      auditoriumPicker: 'Auditorium Seat Tier Visualizer',
      downloadMaterials: 'Lecture Cheat-Sheet & Slides (PDF)',
      rowFront: 'Front Rows (1–4) · Premium Q&A View',
      rowMiddle: 'Middle Hall (5–10) · Best Acoustics',
      rowBack: 'Back Tier (11–15) · Study Group Row',
      selectTier: 'Choose Preferred Seating Area',
      tierSeatsAvailable: 'available'
    },
    ticket: {
      passTitle: 'AITU Attendance Pass',
      student: 'Student',
      reward: 'Points Reward',
      autoCredited: 'Auto-credited',
      dateTime: 'Time & Date',
      auditorium: 'Auditorium',
      simScan: 'Simulate Lecturer Scan & Claim +50 Pts',
      checkedInSuccess: 'Checked in! +50 Points Credited',
      countdown: 'Starts in',
      startsIn: 'Lecture starts in',
      downloadPass: 'Save to Device',
      shareTicket: 'Share Pass'
    },
    lecturerDesk: {
      title: 'Lecturer Desk',
      subtitle: 'Ayan Serikbay · Lead Math Peer Tutor',
      metricsLectures: 'Lectures',
      metricsCapacity: 'Capacity',
      metricsTotalBooked: 'Total Booked',
      scheduledSessions: 'Your Scheduled Sessions',
      qrScanBtn: 'QR Scan',
      registeredRoster: 'registered students',
      createLectureBtn: 'Schedule Hard Lecture',
      scannerTitle: 'Auditorium Check-In Scanner',
      cameraInstruction: 'Point camera at Student Pass QR Code',
      manualCheckIn: 'Manual ID check-in',
      manualCheckInPlaceholder: 'Or type Student ID (e.g. 254977)',
      checkInBtn: 'Check In',
      quickCheckInBirzhan: '✓ Quick Check-in Student Birzhan (254977)',
      exportCsv: 'Export Roster (CSV for Dean’s Office)',
      studentId: 'Student ID',
      studentName: 'Name',
      status: 'Status',
      time: 'Check-in Time'
    },
    mentorCatalog: {
      title: 'Choose your mentor',
      subtitle: 'Soft mentors — pick the human, not the metric',
      searchPlaceholder: 'Search by name, hobby or tech stack...',
      forYou: 'For you',
      myMajor: 'My major',
      creative: 'Creative',
      sport: 'Sport',
      star: 'Star',
      spots: 'spots',
      full: 'Full',
      yourMentor: 'Your mentor',
      selectAsMentor: 'Select as mentor',
      about: 'About',
      languages: 'Languages',
      hobbies: 'Hobbies & interests',
      onCampus: 'On campus',
      achievements: 'Achievements',
      bookOneOnOne: '📅 Book 1-on-1 Advisory Slot',
      oneOnOneAdvisory: 'Schedule 20-min private chat'
    },
    oneOnOne: {
      title: 'Book 1-on-1 Advisory Session',
      subtitle: 'Private 20-minute mentor chat',
      selectTopic: 'What would you like to discuss?',
      topicElective: 'Elective Selection & Academic Guidance',
      topicStress: 'Stress, Burnout & Exam Prep',
      topicCareer: 'Internship, Decentrathon & Resume Review',
      topicCampusLife: 'Campus Life & Club Involvement',
      selectSlot: 'Select Available Date & Time Slot',
      selectLocation: 'Preferred Meeting Venue',
      locCoworking: 'C1 Coworking Space (Offline)',
      locAkiTime: 'AkiTime Coffee Bar (Offline)',
      locPark: 'Triathlon Park Walk',
      locTeams: 'MS Teams (Online Video)',
      notes: 'Notes for your mentor (Optional)',
      notesPlaceholder: 'Anything specific you want to ask in advance?',
      confirmBooking: 'Confirm 1-on-1 Booking',
      bookingSuccess: '1-on-1 session booked! Added to your calendar.'
    },
    stories: {
      title: 'Stories',
      subtitle: 'Keep the cohort alive · 24h ephemeral',
      postStory: 'Post a story',
      postStoryDesc: 'Photo, campus update or a quick note',
      liveNow: 'Live now',
      you: 'You',
      views: 'views',
      hoursLeft: 'h left',
      newStory: 'New story',
      photo: 'Photo',
      text: 'Text',
      poll: 'Poll / Question',
      tapToUpload: 'tap to upload photo',
      captionPlaceholder: 'Add a caption...',
      typeStoryPlaceholder: 'Type your story update for your mentees...',
      pollQuestionPlaceholder: 'Ask a question (e.g. Coming to Calculus crash course?)',
      shareBtn: 'Share to 21 mentees',
      replyPlaceholder: 'Reply to',
      pollYes: 'Yes, absolutely! 🔥',
      pollNo: 'Not this time 😴',
      voted: 'Thanks for voting!'
    },
    checkIn: {
      title: 'Daily check-in',
      streak: 'day streak',
      loggedAt: 'Logged today at',
      savedPrivately: 'Saved privately',
      rough: 'Rough',
      tired: 'Tired',
      okay: 'Okay',
      good: 'Good',
      great: 'Great',
      historyTitle: 'Your 30-Day Wellbeing Pulse',
      wellbeingScore: 'Wellbeing Stability Index'
    },
    chat: {
      groupTitle: 'Group of Ruslan Kadirov',
      membersOnline: '24 members · 4 online',
      today: 'Today',
      messagePlaceholder: 'Message in cohort chat...',
      send: 'Send',
      searchMessages: 'Search in conversation...'
    },
    reports: {
      title: 'Weekly report',
      dueIn: 'Due in 2 days · period 21 May–3 Jun',
      desc: 'A qualitative pulse on your pool. Written by you — your judgement, not a metric.',
      typeTitle: 'Type of report',
      highlights: 'Highlights this period',
      highlightsPlaceholder: 'Wins, new friendships, who came out of their shell...',
      concerns: 'Concerns or risks',
      concernsPlaceholder: 'Anyone struggling? Disengaging? Your honest read.',
      chooseAssignment: 'Choose assignment',
      submitDSEW: 'Submit to DSEW',
      pastReports: 'Past reports',
      analyticsTitle: 'Cohort Wellbeing Analytics',
      sentimentOverview: 'Sentiment Overview'
    },
    profile: {
      title: 'Profile',
      verifiedMicrosoft: 'Verified via Microsoft SSO',
      softMentor: 'Soft mentor',
      installPin: 'Install / pin app (PWA)',
      privacyData: 'Privacy & data policy',
      signOut: 'Switch Demo Persona / Role',
      language: 'Language / Тіл / Язык',
      theme: 'Theme Mode',
      dark: 'Dark Mode',
      light: 'Light Mode'
    }
  },
  ru: {
    appName: 'AITU Менторство',
    botUsername: '@aitumentor_bot',
    tagline: 'Выбирай человека, а не метрику',
    roles: {
      mentee: '👨‍🎓 Менти',
      mentor: '👩‍🏫 Софт Ментор',
      hardMentor: '📐 Хард Ментор (Аян)'
    },
    nav: {
      home: 'Главная',
      mentors: 'Софт Менторы',
      lectures: 'Хард Лекции',
      guide: 'Гайд AITU 2.0',
      events: 'Ивенты',
      chat: 'Чат',
      profile: 'Профиль',
      community: 'Когорта',
      stories: 'Сториз',
      reports: 'Отчеты',
      scanner: 'QR Сканер'
    },
    guide: {
      title: 'AITU GUIDE 2.0',
      subtitle: 'Полный гид для студентов и первокурсников (@guideaitu2)',
      searchPlaceholder: 'Поиск правил GPA, кабинетов C1, клубов или контактов...',
      tabAcademic: '🎓 Учеба и GPA',
      tabCampus: '🏢 Карта кампуса EXPO',
      tabClubs: '⚡ Клубы и AITUSA',
      tabDigital: '💻 Moodle и Сервисы',
      tabContacts: '📞 Контакты отделов',
      gpaCalcTitle: 'Калькулятор оценок и GPA AITU',
      gpaCalcSubtitle: 'Формула: (Р1 × 0.3) + (Р2 × 0.3) + (Экзамен × 0.4)',
      r1Label: 'Рейтинг 1 (0–100)',
      r2Label: 'Рейтинг 2 (0–100)',
      finalLabel: 'Экзамен Final (0–100)',
      totalScore: 'Итоговый балл',
      letterGrade: 'Буквенная оценка',
      gpaPoints: 'Эквивалент GPA',
      retakeWarning: '⚠️ Менее 50 баллов (F/FX): Назначается пересдача или платный ретейк',
      excellentPass: '🎉 Отличная оценка (A / A-)',
      goodPass: '✅ Предмет успешно сдан',
      floor1Title: '1 этаж (C1.1) · Главный вход, турникеты, медпункт и столовая',
      floor2Title: '2 этаж (C1.2) · Студенческий отдел, библиотека, коворкинг',
      floor3Title: '3 этаж (C1.3) · Большие аудитории 100 мест, Mac Lab, Cisco Lab',
      moodleTitle: 'Moodle LMS (moodle.astanait.edu.kz)',
      duTitle: 'Digital University (du.astanait.edu.kz)',
      eduroamTitle: 'Wi-Fi Eduroam и AITU-Student',
      aitusaTitle: 'Студенческий совет AITUSA',
      gdscTitle: 'GDSC AITU (Google Developer Student Club)',
      decentrathonTitle: 'Decentrathon & Web3 Hub Astana',
      debateTitle: 'Дебатный клуб AITU (Nomad)',
      sportTitle: 'Спортивные секции (Футбол, Баскетбол, Настольный теннис)'
    },
    home: {
      greeting: 'Привет, Биржан',
      date: 'Вторник · 3 июня',
      checkInTitle: 'Ежедневный чек-ин',
      checkInSubtitle: 'Как ты себя чувствуешь? Только для тебя — никто не видит, пока ты сам не поделишься.',
      yourSoftMentor: 'Твой софт-ментор',
      seeProfile: 'Профиль',
      message: 'Написать',
      chooseMentor: 'Выбрать Софт Ментора',
      pickHumanTag: 'Выбирай человека, а не метрику',
      dashboardEvents: 'Дашборд событий',
      more: 'Все',
      noEventsToday: 'На сегодня событий нет.',
      activeAssignment: 'Активное задание'
    },
    lectures: {
      title: 'Академические Лекции',
      subtitle: 'Хард менторы и тьюторы · Офлайн разборы в аудиториях',
      attendancePill: 'Посещаемость',
      points: 'баллов',
      bannerTitle: 'Получай баллы посещаемости офлайн',
      bannerDesc: 'Забронируй место, отсканируй QR-билет на входе в аудиторию у лектора и получи +50 баллов к университетской оценке посещаемости.',
      allSubjects: 'Все предметы',
      searchPlaceholder: 'Поиск по теме, лектору (напр. Аян) или кабинету...',
      seatsLeft: 'мест осталось',
      seatsBooked: 'забронировано',
      capacity: 'Вместимость',
      reserveSeat: 'Занять место и получить QR-билет',
      viewTicket: 'Показать QR-билет',
      checkedIn: 'Отмечен ✓',
      cancel: 'Отменить бронь',
      soldOut: 'Мест нет (100% занято)',
      auditoriumPicker: 'Схема аудитории (100 мест)',
      downloadMaterials: 'Шпаргалка и слайды лекции (PDF)',
      rowFront: 'Передние ряды (1–4) · Отличный обзор и вопросы',
      rowMiddle: 'Центральный зал (5–10) · Идеальный звук',
      rowBack: 'Верхний ярус (11–15) · Групповая работа',
      selectTier: 'Выберите удобную зону в аудитории',
      tierSeatsAvailable: 'свободно'
    },
    ticket: {
      passTitle: 'Пропуск посещаемости AITU',
      student: 'Студент',
      reward: 'Награда',
      autoCredited: 'Автоначисление',
      dateTime: 'Дата и время',
      auditorium: 'Аудитория',
      simScan: 'Симулировать скан лектором и забрать +50 баллов',
      checkedInSuccess: 'Успешно отмечен! +50 баллов начислено',
      countdown: 'Начало через',
      startsIn: 'Лекция начнется через',
      downloadPass: 'Сохранить пропуск',
      shareTicket: 'Поделиться'
    },
    lecturerDesk: {
      title: 'Рабочий стол лектора',
      subtitle: 'Аян Серикбай · Главный тьютор по высшей математике',
      metricsLectures: 'Лекций',
      metricsCapacity: 'Мест в зале',
      metricsTotalBooked: 'Всего записано',
      scheduledSessions: 'Запланированные лекции',
      qrScanBtn: 'QR Сканер',
      registeredRoster: 'зарегистрированных студентов',
      createLectureBtn: 'Создать академическую лекцию',
      scannerTitle: 'Сканер входа в аудиторию',
      cameraInstruction: 'Наведите камеру на QR-код студента',
      manualCheckIn: 'Ручной ввод ID студента',
      manualCheckInPlaceholder: 'Или введите ID (напр. 254977)',
      checkInBtn: 'Отметить',
      quickCheckInBirzhan: '✓ Быстрый чек-ин: Биржан (254977)',
      exportCsv: 'Экспорт списка (CSV для Деканата)',
      studentId: 'ID студента',
      studentName: 'ФИО',
      status: 'Статус',
      time: 'Время входа'
    },
    mentorCatalog: {
      title: 'Выбери ментора',
      subtitle: 'Софт менторы — выбирай человека, а не метрику',
      searchPlaceholder: 'Поиск по имени, хобби или стеку...',
      forYou: 'Для тебя',
      myMajor: 'Моя специальность',
      creative: 'Творчество',
      sport: 'Спорт',
      star: 'Топ рейтинг',
      spots: 'мест',
      full: 'Заполнено',
      yourMentor: 'Твой ментор',
      selectAsMentor: 'Выбрать ментором',
      about: 'О себе',
      languages: 'Языки',
      hobbies: 'Хобби и интересы',
      onCampus: 'В универе',
      achievements: 'Достижения',
      bookOneOnOne: '📅 Записаться на 1-на-1 консультацию',
      oneOnOneAdvisory: 'Личная 20-минутная встреча'
    },
    oneOnOne: {
      title: 'Запись на 1-на-1 встречу с ментором',
      subtitle: 'Приватная 20-минутная консультация',
      selectTopic: 'Какую тему хочешь обсудить?',
      topicElective: 'Выбор элективов и академическая нагрузка',
      topicStress: 'Стресс, выгорание и подготовка к экзаменам',
      topicCareer: 'Стажировки, хакатоны и разбор резюме',
      topicCampusLife: 'Студенческая жизнь и клубы AITU',
      selectSlot: 'Выберите свободную дату и время',
      selectLocation: 'Где встретимся?',
      locCoworking: 'Коворкинг C1 (Офлайн)',
      locAkiTime: 'Кофейня AkiTime (Офлайн)',
      locPark: 'Прогулка в Триатлон парке',
      locTeams: 'MS Teams (Онлайн звонок)',
      notes: 'Комментарий для ментора (необязательно)',
      notesPlaceholder: 'О чем хочешь спросить заранее?',
      confirmBooking: 'Подтвердить запись на встречу',
      bookingSuccess: 'Встреча успешно забронирована! Добавлена в ваш календарь.'
    },
    stories: {
      title: 'Сториз',
      subtitle: 'Жизнь когорты · исчезают через 24ч',
      postStory: 'Опубликовать сториз',
      postStoryDesc: 'Фото, новости кампуса или важная мысль',
      liveNow: 'Активные сейчас',
      you: 'Вы',
      views: 'просмотров',
      hoursLeft: 'ч осталось',
      newStory: 'Новая сториз',
      photo: 'Фото',
      text: 'Текст',
      poll: 'Опрос / Вопрос',
      tapToUpload: 'нажмите для загрузки фото',
      captionPlaceholder: 'Добавить подпись...',
      typeStoryPlaceholder: 'Напишите новость для своих менти...',
      pollQuestionPlaceholder: 'Задайте вопрос (напр. Идете на разбор Calculus?)',
      shareBtn: 'Поделиться с 21 менти',
      replyPlaceholder: 'Ответить',
      pollYes: 'Да, обязательно! 🔥',
      pollNo: 'В этот раз нет 😴',
      voted: 'Спасибо за голос!'
    },
    checkIn: {
      title: 'Ежедневный чек-ин',
      streak: 'дней подряд',
      loggedAt: 'Зафиксировано сегодня в',
      savedPrivately: 'Сохранено конфиденциально',
      rough: 'Тяжело',
      tired: 'Устал(а)',
      okay: 'Нормально',
      good: 'Хорошо',
      great: 'Отлично',
      historyTitle: 'Пульс самочувствия за 30 дней',
      wellbeingScore: 'Индекс эмоциональной стабильности'
    },
    chat: {
      groupTitle: 'Группа Руслана Кадирова',
      membersOnline: '24 участника · 4 онлайн',
      today: 'Сегодня',
      messagePlaceholder: 'Сообщение в чат когорты...',
      send: 'Отправить',
      searchMessages: 'Поиск по переписке...'
    },
    reports: {
      title: 'Еженедельный отчет',
      dueIn: 'Срок сдачи через 2 дня · период 21 мая–3 июня',
      desc: 'Качественная обратная связь о твоей группе. Твое экспертное суждение для DSEW.',
      typeTitle: 'Тип отчета',
      highlights: 'Главные успехи и позитивные моменты',
      highlightsPlaceholder: 'Победы, новые связи, кто раскрылся...',
      concerns: 'Опасения, риски и проблемы',
      concernsPlaceholder: 'Кому нужна помощь? Кто пропускает пары? Честный отзыв.',
      chooseAssignment: 'Необходимые действия DSEW',
      submitDSEW: 'Отправить отчет в DSEW',
      pastReports: 'Архив отчетов',
      analyticsTitle: 'Аналитика состояния когорты',
      sentimentOverview: 'Общий эмоциональный фон'
    },
    profile: {
      title: 'Профиль',
      verifiedMicrosoft: 'Подтверждено через Microsoft SSO',
      softMentor: 'Софт ментор',
      installPin: 'Установить приложение (PWA)',
      privacyData: 'Политика конфиденциальности',
      signOut: 'Сменить роль / демо аккаунт',
      language: 'Язык / Тіл / Language',
      theme: 'Тема оформления',
      dark: 'Темная тема',
      light: 'Светлая тема'
    }
  },
  kz: {
    appName: 'AITU Тәлімгерлік',
    botUsername: '@aitumentor_bot',
    tagline: 'Метриканы емес, тұлғаны таңда',
    roles: {
      mentee: '👨‍🎓 Менти',
      mentor: '👩‍🏫 Софт Тәлімгер',
      hardMentor: '📐 Хард Ментор (Аян)'
    },
    nav: {
      home: 'Басты бет',
      mentors: 'Софт Менторлар',
      lectures: 'Хард Дәрістер',
      guide: 'AITU Гиді 2.0',
      events: 'Іс-шаралар',
      chat: 'Чат',
      profile: 'Профиль',
      community: 'Когорта',
      stories: 'Сториз',
      reports: 'Есептер',
      scanner: 'QR Сканер'
    },
    guide: {
      title: 'AITU GUIDE 2.0',
      subtitle: 'Студенттер мен 1-курсқа арналған толық анықтамалық (@guideaitu2)',
      searchPlaceholder: 'GPA ережелері, C1 бөлмелері, клубтар немесе байланыстар...',
      tabAcademic: '🎓 Оқу және GPA',
      tabCampus: '🏢 EXPO Кампус Картасы',
      tabClubs: '⚡ Студенттік Клубтар',
      tabDigital: '💻 Moodle және Қызметтер',
      tabContacts: '📞 Байланыс деректері',
      gpaCalcTitle: 'AITU Бағалар мен GPA Калькуляторы',
      gpaCalcSubtitle: 'Формула: (Р1 × 0.3) + (Р2 × 0.3) + (Емтихан × 0.4)',
      r1Label: 'Рейтинг 1 (0–100)',
      r2Label: 'Рейтинг 2 (0–100)',
      finalLabel: 'Final Емтихан (0–100)',
      totalScore: 'Қорытынды балл',
      letterGrade: 'Әріптік баға',
      gpaPoints: 'GPA Эквиваленті',
      retakeWarning: '⚠️ 50 баллдан төмен (F/FX): Қайта тапсыру немесе ретейк тағайындалады',
      excellentPass: '🎉 Үздік баға (A / A-)',
      goodPass: '✅ Пән сәтті тапсырылды',
      floor1Title: '1-қабат (C1.1) · Басты кіреберіс, турникеттер, медициналық пункт, асхана',
      floor2Title: '2-қабат (C1.2) · Студенттік бөлім, кітапхана, коворкинг',
      floor3Title: '3-қабат (C1.3) · 100 орындық үлкен аудиториялар, Mac Lab, Cisco Lab',
      moodleTitle: 'Moodle LMS (moodle.astanait.edu.kz)',
      duTitle: 'Digital University (du.astanait.edu.kz)',
      eduroamTitle: 'Eduroam және AITU-Student Wi-Fi',
      aitusaTitle: 'AITUSA Студенттік Кеңесі',
      gdscTitle: 'GDSC AITU (Google Developer Student Club)',
      decentrathonTitle: 'Decentrathon & Web3 Hub',
      debateTitle: 'AITU Дебат Клубы (Nomad)',
      sportTitle: 'AITU Спорт Лигалары (Футбол, Баскетбол, Үстел теннисі)'
    },
    home: {
      greeting: 'Сәлем, Біржан',
      date: 'Сейсенбі · 3 маусым',
      checkInTitle: 'Күнделікті чек-ин',
      checkInSubtitle: 'Бүгінгі көңіл-күйің қалай? Тек сен үшін — бөліспейінше ешкім көрмейді.',
      yourSoftMentor: 'Сенің софт-менторың',
      seeProfile: 'Профиль',
      message: 'Жазу',
      chooseMentor: 'Софт Ментор таңдау',
      pickHumanTag: 'Метриканы емес, тұлғаны таңда',
      dashboardEvents: 'Оқиғалар тақтасы',
      more: 'Барлығы',
      noEventsToday: 'Бүгінге жоспарланған іс-шаралар жоқ.',
      activeAssignment: 'Белсенді тапсырма'
    },
    lectures: {
      title: 'Академиялық Дәрістер',
      subtitle: 'Хард менторлар мен репетиторлар · Офлайн сабақтар',
      attendancePill: 'Қатысу',
      points: 'ұпай',
      bannerTitle: 'Офлайн дәріске қатысып ұпай жинаңыз',
      bannerDesc: 'Орынды брондаңыз, аудитория кіреберісінде дәріскерге QR-билетті көрсетіп, қатысу бағасына +50 ұпай қосыңыз.',
      allSubjects: 'Барлық пәндер',
      searchPlaceholder: 'Тақырып, дәріскер (мыс. Аян) немесе аудитория бойынша іздеу...',
      seatsLeft: 'орын қалды',
      seatsBooked: 'брондалды',
      capacity: 'Сыйымдылық',
      reserveSeat: 'Орын брондау және QR-билет алу',
      viewTicket: 'QR-билетті көру',
      checkedIn: 'Белгіленді ✓',
      cancel: 'Броннан бас тарту',
      soldOut: 'Орындар таусылды (100%)',
      auditoriumPicker: 'Аудитория сызбасы (100 орын)',
      downloadMaterials: 'Дәріс материалдары мен шпаргалка (PDF)',
      rowFront: 'Алдыңғы қатарлар (1–4) · Ең жақсы көрініс',
      rowMiddle: 'Орталық зал (5–10) · Таза дыбыс',
      rowBack: 'Жоғарғы қатар (11–15) · Топтық жұмыс',
      selectTier: 'Аудиториядан ыңғайлы орынды таңдаңыз',
      tierSeatsAvailable: 'бос орын'
    },
    ticket: {
      passTitle: 'AITU Қатысу Рұқсатнамасы',
      student: 'Студент',
      reward: 'Сыйақы',
      autoCredited: 'Автоматты есептеледі',
      dateTime: 'Күні мен уақыты',
      auditorium: 'Аудитория',
      simScan: 'Оқытушы сканерлеуін симуляциялау (+50 ұпай)',
      checkedInSuccess: 'Сәтті белгіленді! +50 ұпай қосылды',
      countdown: 'Басталуына',
      startsIn: 'Дәріс басталуына қалды',
      downloadPass: 'Құрылғыға сақтау',
      shareTicket: 'Бөлісу'
    },
    lecturerDesk: {
      title: 'Дәріскердің жұмыс үстелі',
      subtitle: 'Аян Серікбай · Жоғары математика бас тәлімгері',
      metricsLectures: 'Дәрістер',
      metricsCapacity: 'Сыйымдылық',
      metricsTotalBooked: 'Жалпы тіркелген',
      scheduledSessions: 'Жоспарланған дәрістер',
      qrScanBtn: 'QR Сканер',
      registeredRoster: 'тіркелген студенттер',
      createLectureBtn: 'Жаңа хард дәріс құру',
      scannerTitle: 'Аудиторияға кіру сканері',
      cameraInstruction: 'Камераны студенттің QR-кодына бағыттаңыз',
      manualCheckIn: 'Студент ID-ін қолмен енгізу',
      manualCheckInPlaceholder: 'ID енгізіңіз (мыс. 254977)',
      checkInBtn: 'Белгілеу',
      quickCheckInBirzhan: '✓ Жылдам белгілеу: Біржан (254977)',
      exportCsv: 'Тізімді экспорттау (Деканатқа CSV)',
      studentId: 'Студент ID',
      studentName: 'Аты-жөні',
      status: 'Мәртебесі',
      time: 'Кіру уақыты'
    },
    mentorCatalog: {
      title: 'Менторыңды таңда',
      subtitle: 'Софт менторлар — көрсеткішті емес, адамды таңда',
      searchPlaceholder: 'Аты, хоббиі немесе бағыты бойынша іздеу...',
      forYou: 'Сен үшін',
      myMajor: 'Менің мамандығым',
      creative: 'Шығармашылық',
      sport: 'Спорт',
      star: 'Жұлдызды',
      spots: 'орын',
      full: 'Толық',
      yourMentor: 'Сенің менторың',
      selectAsMentor: 'Ментор ретінде таңдау',
      about: 'Өзі туралы',
      languages: 'Тілдер',
      hobbies: 'Хобби мен қызығушылықтар',
      onCampus: 'Университетте',
      achievements: 'Жетістіктері',
      bookOneOnOne: '📅 1-ге-1 кеңес алуға жазылу',
      oneOnOneAdvisory: 'Жеке 20 минуттық кездесу'
    },
    oneOnOne: {
      title: 'Ментормен жеке кездесуге жазылу',
      subtitle: 'Жеке 20 минуттық ақыл-кеңес',
      selectTopic: 'Қандай тақырыпты талқылаймыз?',
      topicElective: 'Элективтерді таңдау және академиялық бағыт',
      topicStress: 'Стресс, шаршау және емтиханға дайындық',
      topicCareer: 'Тағылымдамалар, хакатондар және түйіндеме',
      topicCampusLife: 'Студенттік өмір және AITU клубтары',
      selectSlot: 'Бос күн мен уақытты таңдаңыз',
      selectLocation: 'Қай жерде кездесеміз?',
      locCoworking: 'C1 Коворкинг аймағы (Офлайн)',
      locAkiTime: 'AkiTime кофеханасы (Офлайн)',
      locPark: 'Триатлон паркінде серуендеу',
      locTeams: 'MS Teams (Онлайн бейнеқоңырау)',
      notes: 'Менторға ескертпе (міндетті емес)',
      notesPlaceholder: 'Алдын ала қандай сұрақ қойғыңыз келеді?',
      confirmBooking: 'Кездесуді растау',
      bookingSuccess: 'Кездесу сәтті брондалды! Күнтізбеңізге қосылды.'
    },
    stories: {
      title: 'Сториз',
      subtitle: 'Когорта тынысы · 24 сағаттан соң өшеді',
      postStory: 'Сториз жариялау',
      postStoryDesc: 'Фото, кампус жаңалықтары немесе ой-пікір',
      liveNow: 'Қазір белсенді',
      you: 'Сіз',
      views: 'қаралым',
      hoursLeft: 'сағ қалды',
      newStory: 'Жаңа сториз',
      photo: 'Фото',
      text: 'Мәтін',
      poll: 'Сауалнама / Сұрақ',
      tapToUpload: 'фото жүктеу үшін басыңыз',
      captionPlaceholder: 'Сипаттама жазыңыз...',
      typeStoryPlaceholder: 'Ментилеріңізге арналған жаңалықты жазыңыз...',
      pollQuestionPlaceholder: 'Сұрақ қойыңыз (мыс. Calculus сабағына келесіз бе?)',
      shareBtn: '21 ментимен бөлісу',
      replyPlaceholder: 'Жауап беру',
      pollYes: 'Иә, әрине! 🔥',
      pollNo: 'Бұл жолы емес 😴',
      voted: 'Дауыс бергеніңізге рақмет!'
    },
    checkIn: {
      title: 'Күнделікті чек-ин',
      streak: 'күн қатарынан',
      loggedAt: 'Бүгін белгіленген уақыт:',
      savedPrivately: 'Құпия сақталды',
      rough: 'Ауыр',
      tired: 'Шаршадым',
      okay: 'Қалыпты',
      good: 'Жақсы',
      great: 'Тамаша',
      historyTitle: '30 күндік көңіл-күй пульсі',
      wellbeingScore: 'Эмоционалды тұрақтылық индексі'
    },
    chat: {
      groupTitle: 'Руслан Қадіровтың тобы',
      membersOnline: '24 мүше · 4 онлайн',
      today: 'Бүгін',
      messagePlaceholder: 'Когорта чатына хабарлама жазу...',
      send: 'Жіберу',
      searchMessages: 'Чаттан іздеу...'
    },
    reports: {
      title: 'Апталық есеп',
      dueIn: 'Тапсыруға 2 күн қалды · 21 мамыр–3 маусым',
      desc: 'Тобыңыз бойынша сапалық талдау. DSEW департаментіне арналған бағалау.',
      typeTitle: 'Есеп түрі',
      highlights: 'Осы кезеңнің басты жетістіктері',
      highlightsPlaceholder: 'Жетістіктер, жаңа достар, ашылған студенттер...',
      concerns: 'Қауіптер мен алаңдаушылықтар',
      concernsPlaceholder: 'Кімге көмек керек? Қиналып жүргендер бар ма? Шынайы пікір.',
      chooseAssignment: 'DSEW қажетті әрекеттері',
      submitDSEW: 'DSEW-ге жіберу',
      pastReports: 'Бұрынғы есептер мұрағаты',
      analyticsTitle: 'Когортаның көңіл-күй талдауы',
      sentimentOverview: 'Жалпы эмоционалды жағдай'
    },
    profile: {
      title: 'Профиль',
      verifiedMicrosoft: 'Microsoft SSO арқылы расталған',
      softMentor: 'Софт ментор',
      installPin: 'Қосымшаны орнату (PWA)',
      privacyData: 'Құпиялылық және деректер саясаты',
      signOut: 'Рөлді / демо аккаунтты ауыстыру',
      language: 'Тіл / Язык / Language',
      theme: 'Безендіру тақырыбы',
      dark: 'Қараңғы тақырып',
      light: 'Ашық тақырып'
    }
  }
};
