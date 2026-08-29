# 🎓 AITU Mentorship Platform & Telegram Mini App (TMA)

> **"Pick the human, not the metric"** — A fullstack student peer-mentorship & academic tutoring platform designed specifically for Astana IT University (AITU).

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-black.svg?style=flat&logo=fastify)](https://fastify.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)
[![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini_App_Ready-2CA5E0.svg?style=flat&logo=telegram)](https://core.telegram.org/bots/webapps)

---

## 🌟 Overview

The **AITU Mentorship Platform** is a complete fullstack application featuring:

1. **🌿 Soft Mentorship (Wellbeing & Adaptation)**:
   - Cohorts of up to 24 mentees with senior soft mentors.
   - Private daily mood check-ins (*"Just for you — nobody sees this unless you share it"*).
   - 24h ephemeral Stories sharing campus updates and elective guidance.
   - Qualitative weekly reporting directly to the university **DSEW** (*Department of Student Engagement & Wellbeing*).

2. **📐 Hard Mentorship & Peer Tutoring (Academic Lectures)**:
   - Offline crash courses & exam reviews in large auditoriums (e.g. *Calculus 1 with Ayan in C1.3.250 on 100 seats*).
   - Live seat capacity tracking and reservation system with WebSocket synchronization.
   - **QR Attendance Pass**: Students claim an attendance ticket, scan it at the door with the lecturer, and earn **+50 Attendance Points** towards university grading.

3. **📱 Telegram Mini App (TMA)**:
   - Native integration with Telegram WebApp SDK (`window.Telegram.WebApp`).
   - Tactile Haptic Feedback on seat bookings and check-ins.
   - Zero-barrier onboarding straight from the official university bot (`@aitumentor_bot`).

4. **⚡ Lightweight Backend & Database (Fastify + SQLite)**:
   - High-performance SQLite database with WAL mode running in Docker.
   - Real-time WebSockets for instant seat updates and cohort chat.
   - Persistent storage in `./server/data/mentorship.db`.

---

## 🐳 Running with Docker (Frontend + Backend + SQLite)

```bash
# 1. Start Docker Desktop (if on Windows/macOS)

# 2. Build and launch all services in the background
docker compose up --build -d

# 3. Access the application:
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

## 🚀 Key Features & Endpoints

| Category | Endpoint / Feature | Description |
| :--- | :--- | :--- |
| **Academic Lectures** | `GET /api/lectures` | List all 100-seat lectures with live booked counts |
| **Seat Booking** | `POST /api/lectures/:id/book` | Reserve a seat and broadcast update via WebSocket |
| **QR Check-In** | `POST /api/lectures/:id/checkin` | Lecturer scans student QR to award +50 attendance pts |
| **Soft Mentors** | `GET /api/mentors` | Retrieve mentor portfolios & cohort quotas |
| **Realtime Chat** | `GET /api/chat`, `POST /api/chat/messages` | Instant messaging across all students |
| **DSEW Reports** | `GET /api/reports`, `POST /api/reports` | Submit weekly wellbeing pulse to university |

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
