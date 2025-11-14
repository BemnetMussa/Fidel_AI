<div align="center">
  <img src="client/assets/images/logo.png" alt="Fidel AI logo" width="120" />

  # Fidel AI – Mobile Learning Coach
  Fidel AI is a mobile-first AI chat application engineered to deliver personalized, intelligent conversations through a clean and scalable architecture—think ChatGPT for Ethiopian high-schoolers, wrapped in a native app experience. Built with Expo (React Native + TypeScript) on the client and an Express + Prisma stack on the server, it ships authentication, conversation history, profile management, and multilingual tutoring out of the box.  
  <br />
  🔗 GitHub: [BemnetMussa/Fidel_AI](https://github.com/BemnetMussa/Fidel_AI.git)
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

## Core Features

- Explanation modules for all major high school subjects
- Quizzes and interactive “test yourself” flows
- Dual-language support (Amharic + English)
- Friendly conversational UI in the mobile app
- Basic progress tracking and motivational feedback
- Data collection for learning outcomes and user feedback

---

## Feature Highlights (Current Build)

- **Adaptive onboarding** – `app/index.tsx` checks sessions via Better Auth before exposing chat tabs.
- **Auth suite** – Email/password + OTP flows (`/(auth)` routes, `components/auth/*`) reuse common form controls and toast messaging.
- **Chat experience** – `app/(tabs)/chats/*` drives ChatGPT-style threads, card sliders, drawers for conversation history, and a feedback modal.
- **Conversation management** – Helpers in `conversation-actions/*` rename, clear, or delete threads while keeping the UI responsive.
- **Feedback loop** – Structured submissions persist to the `Feedback` Prisma model for qualitative insight.
- **Theme + Accessibility** – NativeWind theming, haptics, and localized Amharic copy improve retention and comfort.

---

## Competition & Inspiration

- [Exam Buddy – Ace Your Exams Smarter](https://www.exambuddy.app/#features)
- [Model Documentation – V1](https://www.notion.so/Model-Documentation-V1-2a00a40caecb80a9b49cdf1727f5444a?pvs=21)

---

## About This Repository

- **Origin**: [BemnetMussa/Fidel_AI](https://github.com/BemnetMussa/Fidel_AI.git)
- **Focus**: Mobile-first AI tutor with authentication, chat history, and profile features
- **Languages**: ~96% TypeScript (Expo + Node), ~4% JavaScript
- **Open Issues / PRs**: Track work upstream for the latest backlog
- **License & Usage**: Refer to the upstream repository for governance and contribution policies

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Mobile Client | Expo Router (React Native 0.79), NativeWind/Tailwind, React Hook Form, MMKV, Toasts, Lucide icons |
| Native Shell | Capacitor 6 bridge (Android/iOS) + Ionic UI wrappers for native-first flows |
| Backend | Node.js + Express 5, Better Auth, Prisma ORM, PostgreSQL, Gemini API integration |
| Infra / Tooling | Nodemailer SMTP email OTP, Axios, TypeScript (client & server), ESLint, Tailwind, Expo dev tooling |

---

## Mobile Architecture & Platform Support

- **Expo-first development** keeps iteration fast on mobile and web.
- **Capacitor bridge** wraps Expo builds so we gain plug-and-play access to push notifications, background tasks, and store distribution.
- **Ionic overlays** can power native settings, parental controls, or diagnostics screens while the primary chat flows live inside the Expo bundle.
- **Shared TypeScript contracts** ensure the Express API and mobile client evolve together.

> Need advanced hardware access? Build a Capacitor plugin or Ionic screen and communicate with the Expo bundle through events or deep links.

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
- Expo Go app or iOS/Android emulator

### Environment Variables

Create `.env` files for both `client` and `server`:

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
npx prisma migrate deploy   # or prisma migrate dev
npm run dev
```

---

## Capacitor + Ionic Packaging

1. **Initialize Capacitor**
   ```bash
   # From repo root
   npx expo export:web             # or npx expo prebuild for native artifacts
   npx cap init FidelAI com.fidel.ai
   ```
2. **Sync the web bundle**
   ```bash
   npm run build --workspace client   # Expo production build
   npx cap copy                       # copy assets to android/ios
   npx cap sync android ios           # ensure plugins are up to date
   ```
3. **Add Ionic-native screens**
   - Build extra Ionic pages (settings, diagnostics, parental controls) inside the Capacitor native projects.
   - Use Capacitor plugins or deep links to hop between Ionic views and the Expo chat bundle.
4. **Run natively**
   ```bash
   npx cap open android
   npx cap open ios
   ```

This workflow keeps the Expo experience intact while letting you tap into Capacitor/Ionic’s plugin ecosystem for device-only capabilities.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Run linting/tests before opening a PR.
3. Include context: missions, personas, and learning goals matter as much as code.

---

## Summary

Fidel AI is a culturally tuned, AI-powered tutor and study coach that helps students actually learn—not just memorize—through conversational explanations, quizzes, and study coaching tailored to their world. Starting local, expanding global, and measuring every step.


- Explanation modules for all major high school subjects
- Quizzes and interactive “test yourself” flows
- Dual-language support (Amharic + English)
- Friendly conversational UI in the mobile app
- Basic progress tracking and motivational feedback
- Data collection for learning outcomes and user feedback

---

## Risks & Challenges

- Adoption reluctance (students not trusting or using AI learning tools)
- Tech limitations: language quality, cultural accuracy, subject coverage
- Scaling to new languages, curricula, and device capabilities

---

## Competition & Inspiration

- [Exam Buddy – Ace Your Exams Smarter](https://www.exambuddy.app/#features)
- [Model Documentation – V1](https://www.notion.so/Model-Documentation-V1-2a00a40caecb80a9b49cdf1727f5444a?pvs=21)

---

## About This Repository

- **Origin**: [BemnetMussa/Fidel_AI](https://github.com/BemnetMussa/Fidel_AI.git)
- **Focus**: Mobile-first AI tutor with authentication, chat history, and profile features
- **Languages**: ~96% TypeScript (Expo + Node), ~4% JavaScript
- **Open Issues / PRs**: Active development with tracked issues and contributions on GitHub
- **License & Usage**: Refer to the upstream repository for the latest governance, issues, and contribution policies

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
