# 🎓 AITU Mentorship Platform & Telegram Mini App (TMA)

> **"Pick the human, not the metric"** — A modern student peer-mentorship & academic tutoring platform designed specifically for Astana IT University (AITU).

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini_App_Ready-2CA5E0.svg?style=flat&logo=telegram)](https://core.telegram.org/bots/webapps)

---

## 🌟 Overview

The **AITU Mentorship Platform** bridges the gap between first/second-year students and experienced upperclassmen through a **dual-mentorship architecture**:

1. **🌿 Soft Mentorship (Wellbeing & Adaptation)**:
   - Personal student guides in cohorts of up to 24 mentees.
   - Private daily mood check-ins (*"Just for you — nobody sees this unless you share it"*).
   - 24h ephemeral Stories sharing campus updates and elective guidance.
   - Qualitative weekly reporting directly to the university **DSEW** (*Department of Student Engagement & Wellbeing*).

2. **📐 Hard Mentorship & Peer Tutoring (Academic Lectures)**:
   - Offline crash courses & exam reviews in large auditoriums (e.g. *Calculus 1 with Ayan in C1.3.250 on 100 seats*).
   - Live seat capacity tracking and reservation system.
   - **QR Attendance Pass**: Students claim an attendance ticket, scan it at the door with the lecturer, and earn **+50 Attendance Points** towards university grading.

3. **📱 Telegram Mini App (TMA)**:
   - Native integration with Telegram WebApp SDK (`window.Telegram.WebApp`).
   - Tactile Haptic Feedback on seat bookings and check-ins.
   - Zero-barrier onboarding straight from the official university bot (`@aitumentor_bot`).

---

## 🚀 Key Features

### 👨‍🎓 For Students (Mentee Flow)
* **Home Dashboard**: Greeting, unread notifications bell, Story tray, 5-state Daily Check-in mood picker, assigned soft mentor card, and upcoming event countdowns.
* **Story Viewer**: Fullscreen dark-mode player with segmented progress timers, quick replies, and heart reactions.
* **Choose Your Soft Mentor**: Filter by categories (*For You, My Major, Creative, Sport, Star*), capacity indicators (*6 spots left / Full*), and rich portfolios with campus achievements.
* **Hard Lectures Catalog**: Browse offline lectures (Calculus, Linear Algebra, OOP & Java, Discrete Math, Algorithms), reserve seats, and monitor the live progress bar.
* **QR Attendance Pass**: Boarding pass ticket with dynamic QR code and attendance points counter (*150 pts · 94% rate*).
* **Cohort Group Chat**: Real-time communication with peer mentors and cohort group members.
* **Events & RSVP Tracker**: Checkbox tracker for offline socialization events (board games, pizza nights, morning runs in Triathlon Park).
* **Profile**: Verified Microsoft Azure SSO (`@astanait.edu.kz`) and PWA installation guide.

### 👩‍🏫 For Soft Mentors
* **Community Cohort**: Monitor 21/24 mentees, review incoming signals (*"Asked to talk"*, *"RSVP'd mixer"*), and send cohort-wide announcements.
* **Stories Manager**: Post 24-hour photo/text updates with custom pastel backgrounds and track view metrics.
* **Weekly DSEW Report**: Qualitative student pulse reports with risk assessments, highlights, and DSEW action tag referrals (*Psychologist, Exam-stress workshop, Extra study space*).

### 📐 For Hard Mentors (Lecturers / Peer Tutors)
* **Lecturer Desk**: Schedule 100-seat auditorium sessions with date, room, and point values.
* **Auditorium QR Scanner**: Interactive camera check-in simulator to scan incoming students and award attendance points in real-time.

### ⚙️ System States
* **Pools Skeleton Loader**: Shimmer loading state for slow network conditions.
* **Empty State**: *"You're all caught up"* tasks illustration.
* **503 Offline Error**: Reconnection flow with animated retry action.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) with pastel tokens & smooth micro-animations |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Telegram Integration** | [Telegram WebApp SDK](https://core.telegram.org/bots/webapps) |
| **Celebratory Feedback** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **State Management** | React Context + LocalStorage reactive persistence |

---

## 📂 Project Structure

```
SM/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx          # Role-aware bottom navigation
│   │   │   └── DeviceFrame.tsx        # Mobile wrapper, TMA bar, and role switcher
│   │   ├── lectures/
│   │   │   ├── AttendanceTicketModal.tsx # QR Attendance Pass modal
│   │   │   ├── HardMentorLecturesView.tsx # Lecturer desk & QR scanner
│   │   │   └── LectureCatalogView.tsx # 100-seat academic lectures catalog
│   │   ├── mentee/
│   │   │   ├── ChatView.tsx           # Cohort chat
│   │   │   ├── DailyCheckIn.tsx       # Mood tracking
│   │   │   ├── EventsView.tsx         # Event checklist
│   │   │   ├── HomeView.tsx           # Student home dashboard
│   │   │   ├── MenteeProfileView.tsx  # Profile & Microsoft SSO
│   │   │   ├── MentorCatalogView.tsx  # Soft mentor selection
│   │   │   └── MentorDetailModal.tsx  # Mentor portfolio modal
│   │   ├── mentor/
│   │   │   ├── MentorCommunityView.tsx# Cohort signals & mentees grid
│   │   │   ├── MentorEventsView.tsx   # Offline events creation
│   │   │   ├── MentorProfileView.tsx  # Mentor profile & rating
│   │   │   ├── MentorStoriesView.tsx  # Active stories manager
│   │   │   └── WeeklyReportView.tsx   # DSEW reporting form
│   │   ├── stories/
│   │   │   ├── StoryCreatorModal.tsx  # Create photo/text story
│   │   │   ├── StoryTray.tsx          # Stories avatar carousel
│   │   │   └── StoryViewerModal.tsx   # Fullscreen story viewer
│   │   └── system/
│   │       ├── OfflineErrorView.tsx   # 503 error state
│   │       ├── SkeletonView.tsx       # Shimmer loading skeleton
│   │       └── TasksEmptyView.tsx     # Empty state
│   ├── context/
│   │   └── AppContext.tsx             # Global application state store
│   ├── data/
│   │   └── mockData.ts                # Mock cohorts, lectures, & mentors
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── App.tsx                        # Main view router
│   ├── index.css                      # Tailwind base & custom animations
│   └── main.tsx                       # React DOM root
├── index.html                         # PWA & Telegram WebApp HTML shell
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)

### 2. Installation
```bash
git clone <your-repo-url>
cd SM
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🎮 Interactive Demo Controls

When running locally, the top toolbar provides testing tools:
* **Role Switcher**:
  - `👨‍🎓 Mentee (Birzhan)`
  - `👩‍🏫 Soft Mentor (Aizhan)`
  - `📐 Hard Mentor (Ayan - Math)`
* **Quick Screen Jump**: Jump directly to any of the 12+ screens in one click.
* **TMA Toggle**: Switch between the **Telegram Mini App** container and standard Web/PWA frame.
* **Device Mockup**: Toggle between phone frame and full-width responsive mode.

---

## 📄 License
This project was developed for educational and mentorship purposes at Astana IT University.
