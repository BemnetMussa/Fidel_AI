# Fidel_AI

my-chatbot-app/
├── app/                          # App routing (handled by Expo Router)
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── verify-email.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/                   # Main app screens (tab-based navigation)
│   │   ├── chat.tsx              # Chat interface
│   │   ├── history.tsx           # Chat history screen
│   │   └── profile.tsx           # User profile screen
│   ├── _layout.tsx               # Root layout (navigation shell)
│   └── index.tsx                 # App entry point
│
├── components/                   # Reusable UI and logic components
│   ├── ui/                       # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── OTPInput.tsx
│   │   └── LoadingSpinner.tsx
│   ├── auth/                     # Components specific to authentication
│   │   ├── AuthHeader.tsx
│   │   ├── SocialButtons.tsx
│   │   └── AuthForm.tsx
│   └── chat/                     # Components used in chat experience
│       ├── MessageBubble.tsx
│       ├── ChatInput.tsx
│       └── TypingIndicator.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth logic hook
│   ├── useChat.ts                # Chat logic hook
│   └── useKeyboard.ts            # Keyboard handling for mobile
│
├── services/                     # API service handlers
│   ├── auth.ts                   # Auth API logic
│   ├── chat.ts                   # Chat API logic
│   └── api.ts                    # Axios/global API config
│
├── store/                        # Global state management (e.g., Zustand)
│   ├── authStore.ts              # Auth state
│   ├── chatStore.ts              # Chat state
│   └── index.ts                  # Combined store entry
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts
│   ├── chat.ts
│   └── api.ts
│
├── utils/                        # Utility/helper functions
│   ├── validation.ts             # Input validation logic
│   ├── storage.ts                # Local storage utils
│   └── constants.ts              # Constants and config values
│
├── assets/                       # Static files and design assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── tailwind.config.js            # Tailwind CSS config file
