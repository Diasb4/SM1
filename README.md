# 🎓 AITU Mentorship Platform & Telegram Mini App (TMA)

> **"Pick the human, not the metric"** — A fullstack student peer-mentorship & academic tutoring platform designed specifically for Astana IT University (AITU).

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-black.svg?style=flat&logo=fastify)](https://fastify.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)
[![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini_App_Ready-2CA5E0.svg?style=flat&logo=telegram)](https://core.telegram.org/bots/webapps)

---

## 🌟 Key Capabilities & Ecosystem

1. **🌐 Multilingual Support (KZ / RU / EN)**:
   - Complete i18n covering **Қазақ тілі**, **Русский язык**, and **English**.
   - Instant language switcher in the TMA header and profile settings.

2. **📐 Hard Mentorship & Academic Tutoring (100-Seat Auditoriums)**:
   - Offline crash courses & exam reviews in large auditoriums (e.g. *Calculus 1 with Ayan in C1.3.250 on 100 seats*).
   - **Interactive Auditorium Visualizer**: View Front, Middle, and Back tiers with live seat availability.
   - **Boarding-Pass Style QR Ticket**: Apple Wallet-styled pass with high-contrast matrix, barcode, and countdown timer to lecture start.
   - **Lecturer Desk & Camera Scanner**: Fast QR viewfinder with audio-haptic confirmation, student search, and **CSV / Excel export for the Dean's Office**.
   - **+50 Attendance Points**: Claimed points update the student's grading records in real time.

3. **🌿 Soft Mentorship (Wellbeing & Adaptation)**:
   - Cohorts of up to 24 mentees with senior soft mentors.
   - **📅 1-on-1 Advisory Scheduler**: Book 20-minute private chats (topics: *Electives, Exam Stress, Hackathons & Internships, Campus Life*).
   - **🔥 Daily Mood Streak Tracker & 30-Day Pulse**: Interactive wellbeing calendar with streak counter and private reflection notes.
   - **📊 DSEW Qualitative Reports & Sentiment Analytics**: Visual sentiment distribution (Positive, Neutral, Exam Stress) and printable report generator for the University administration.

4. **✨ Ephemeral Stories & Cohort Chat**:
   - 24h stories with photo uploads, custom gradients, and **interactive polls** (*"Attending Calculus midterm review?"*).
   - Floating animated emoji reactions (`🔥`, `👏`, `❤️`, `💡`, `🎓`) and direct reply into cohort chat.
   - Real-time chat with message search, message replies, emoji reactions, and Web Audio API synthesized sound effects.

5. **📱 Telegram Mini App (TMA) Native Polish**:
   - Native integration with Telegram WebApp SDK (`window.Telegram.WebApp`).
   - Tactile Haptic Feedback on seat bookings, check-ins, and reactions.
   - Dark / Light Mode theme toggle matching Telegram color schemes.

---

## 🐳 Running with Docker (Frontend + Backend + SQLite)

```bash
# 1. Build and launch all services in the background
docker compose up --build -d

# 2. Access the application:
# Frontend & TMA: http://localhost:8080
# Backend API:    http://localhost:5000/api/health
```

### Stopping the containers:
```bash
docker compose down
```

---

## 🛠 Fullstack Architecture

```
                                  ┌───────────────────────────────┐
                                  │   Telegram App / Browser      │
                                  └───────────────┬───────────────┘
                                                  │ HTTP / WS (:8080)
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │   Nginx Reverse Proxy & SPA   │
                                  │   (Container: 7.4 MB RAM)     │
                                  └───────┬───────────────┬───────┘
                                          │               │
                            / (Static SPA)│               │ /api/ & /ws
                                          ▼               ▼
                                 [React 18 PWA]  ┌─────────────────────────────┐
                                                 │ Fastify Backend (:5000)     │
                                                 │ Real-time WebSockets        │
                                                 └──────────────┬──────────────┘
                                                                │
                                                                ▼
                                                 ┌─────────────────────────────┐
                                                 │ SQLite DB (mentorship.db)   │
                                                 │ Persistent Volume Storage   │
                                                 └─────────────────────────────┘
```

---

## 🚀 Key Endpoints

| Category | Endpoint / Feature | Description |
| :--- | :--- | :--- |
| **Academic Lectures** | `GET /api/lectures` | List all 100-seat lectures with live booked counts and tiers |
| **Seat Booking** | `POST /api/lectures/:id/book` | Reserve seat tier and broadcast update via WebSocket |
| **QR Check-In** | `POST /api/lectures/:id/checkin` | Lecturer scans student QR to award +50 attendance pts |
| **1-on-1 Bookings** | `GET /api/bookings/one-on-one` | Retrieve scheduled advisory sessions with mentors |
| **Book 1-on-1** | `POST /api/bookings/one-on-one` | Schedule private 20-min session (C1 Coworking, AkiTime, etc.) |
| **Soft Mentors** | `GET /api/mentors` | Retrieve mentor portfolios & cohort quotas |
| **Realtime Chat** | `GET /api/chat`, `POST /api/chat/messages` | Instant messaging across all students with replies |
| **DSEW Reports** | `GET /api/reports`, `POST /api/reports` | Submit weekly wellbeing pulse and export summaries |

---

## ⚡ Local Development (Without Docker)

### 1. Start Backend API:
```bash
cd server
npm install
npm start
```
*(Runs on `http://localhost:5000`)*

### 2. Start Frontend & TMA:
```bash
# In the root project directory:
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 📄 License
This project was developed for educational and mentorship purposes at Astana IT University.
