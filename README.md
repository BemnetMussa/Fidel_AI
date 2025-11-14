<div align="center">
  <img src="client/assets/images/logo.png" alt="Fidel AI logo" width="120" />

  # Fidel AI – Mobile Learning Coach
  A culturally tuned AI tutor and study coach for Ethiopian students, delivered through a modern mobile experience built with Expo and powered by a Better Auth + Prisma backend.
</div>

---

## Mission

Help high school students truly understand complex subjects—science, engineering, history, and more—using AI that explains, quizzes, and coaches in Amharic and English, tailored to the Ethiopian context but ready for global expansion.

---

## Problem

Most students struggle not because they don’t try, but because:

- Textbooks are dense and hard to digest.
- Nobody teaches them how to study effectively.
- Existing AI tools ignore cultural context and “learning to learn.”

The result: massive failure rates, wasted effort, and untapped potential.

---

## Solution & Unique Value

Fidel AI is a **mobile application** (iOS, Android, web via Expo) that acts as a friendly tutor:

- Explains textbook topics step by step
- Provides quizzes and interactive practice
- Speaks in the student’s own language and cultural style
- Coaches on study strategies—not just facts

Designed to help students:

- Skim and break down chapters
- Dive deeper through practice
- Master subjects “their way,” not just the textbook way

---

## Core Features (MVP, 2025–2026)

- Explanation modules for all major high school subjects
- Quizzes and interactive “test yourself” flows
- Dual-language support (Amharic + English)
- Friendly conversational UI in the mobile app
- Basic progress tracking and motivational feedback
- Data collection for learning outcomes and user feedback

---

---

## Competition & Inspiration

- [Exam Buddy – Ace Your Exams Smarter](https://www.exambuddy.app/#features)
- [Model Documentation – V1](https://www.notion.so/Model-Documentation-V1-2a00a40caecb80a9b49cdf1727f5444a?pvs=21)

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Mobile Client | Expo Router (React Native 0.79), NativeWind/Tailwind, React Hook Form, MMKV, Toasts, Lucide icons |
| Backend | Node.js + Express 5, Better Auth, Prisma ORM, PostgreSQL, Gemini API integration |
| Infra / Tooling | Nodemailer SMTP email OTP, Axios, TypeScript (client & server), ESLint, Tailwind, Expo dev tooling |

---

## Repository Layout

```
Fidel_AI-main/
├── client/                # Expo mobile application
│   ├── app/               # File-based routes (auth screens, chat tabs, welcome)
│   ├── components/        # Reusable UI (buttons, inputs, themed views, auth widgets)
│   ├── conversation-actions/ # Helpers for chat management (rename, clear, etc.)
│   ├── contexts/          # Theme provider
│   ├── lib/               # auth client, storage helpers, utilities
│   ├── hooks/             # Color scheme + theming hooks
│   ├── assets/            # Images, fonts, icons
│   └── tailwind.config.js # NativeWind/Tailwind setup
├── server/                # Express + Prisma API
│   ├── src/
│   │   ├── controllers/   # Conversation, message, user controllers
│   │   ├── routes/        # REST routes with Better Auth protection
│   │   ├── lib/           # Better Auth config, email sender
│   │   ├── middlewares/   # `requireAuth`
│   │   └── config/        # Prisma client
│   └── prisma/            # Schema + migrations
└── README.md              # You are here
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- PostgreSQL database (for Prisma)
- Expo Go app or emulator/simulator for mobile testing

### Environment Variables

Create `.env` files for both `client` and `server` (see `.env.example` templates if available):

- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `GEMINI_API_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Frontend base URLs for CORS (`server/src/index.ts`)

### Run the Client
```bash
cd client
npm install
npx expo start
```

### Run the Server
```bash
cd server
npm install
npx prisma migrate deploy   # or migrate dev
npm run dev
```

---

## Contributing

1. Fork the repository and create a feature branch.
2. Run linting/tests before opening a PR.
3. Include context: missions, personas, and learning goals matter as much as code.

---

## Summary

Fidel AI is a culturally tuned, AI-powered tutor and study coach that helps students actually learn—not just memorize—using chat, quizzes, and stepwise guidance tailored for their world. Starting local, expanding global, measuring every step.
