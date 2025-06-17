# Fidel_AI


my-chatbot-app/
├── app/                          # Expo Router (App Directory)
│   ├── (auth)/                   # Auth group routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── verify-email.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── chat.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── OTPInput.tsx
│   │   └── LoadingSpinner.tsx
│   ├── auth/                     # Auth-specific components
│   │   ├── AuthHeader.tsx
│   │   ├── SocialButtons.tsx
│   │   └── AuthForm.tsx
│   └── chat/                     # Chat-specific components
│       ├── MessageBubble.tsx
│       ├── ChatInput.tsx
│       └── TypingIndicator.tsx
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── useKeyboard.ts
├── services/                     # API services
│   ├── auth.ts
│   ├── chat.ts
│   └── api.ts
├── store/                        # State management
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── index.ts
├── types/                        # TypeScript types
│   ├── auth.ts
│   ├── chat.ts
│   └── api.ts
├── utils/                        # Utility functions
│   ├── validation.ts
│   ├── storage.ts
│   └── constants.ts
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
└── tailwind.config.js