# Studer Mobile — CLAUDE.md

## Project overview

Studer Mobile is an Expo (managed workflow) React Native app for the Studer study-assistant backend. Users upload PDFs, group them into study collections, and receive push notifications with AI-generated quiz questions for active recall.

**v1 scope:** Auth + collections + PDF upload + question answering + push notifications.

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native | 0.81.5 |
| App container | Expo (managed) | ~54.0.33 |
| Navigation | Expo Router (file-based) | ~6.0.23 |
| React | React | 19.1.0 |
| Auth + DB client | Supabase JS | ^2.106.0 |
| Server state | SWR | ^2.4.1 |
| Styling | NativeWind v4 + Tailwind CSS | ^4.1.23 / ^3.3.0 |
| Animations | React Native Reanimated | ~4.1.1 |
| Push notifications | expo-notifications | ^55.0.23 |
| File picking | expo-document-picker | ^55.0.13 |
| TypeScript | strict mode | ~5.9.2 |

---

## Project structure

```
app/                        # Expo Router file-based routes
  _layout.tsx               # Root layout — AuthProvider + Stack
  (auth)/                   # Auth route group (login, register)
  (tabs)/                   # Main tab group (Today, Collections, Progress)
  collection/               # Dynamic collection routes ([id].tsx, new.tsx)

components/
  ui/                       # Primitive UI (Button.tsx, Input.tsx)
  QuestionCard.tsx
  CollectionCard.tsx
  ProgressBar.tsx

services/
  api.ts                    # Typed fetch wrapper over Studer FastAPI
  supabase.ts               # Supabase client (auth only)

hooks/
  useAuth.ts                # Re-export from AuthContext
  useCollections.ts         # SWR — collection list
  useQuestions.ts           # SWR — questions per collection + today

context/
  AuthContext.tsx           # Session state, push token registration, redirect logic

types/index.ts              # Canonical TypeScript types
constants/
  config.ts                 # EXPO_PUBLIC_* env vars
  Colors.ts                 # Light/dark color tokens

mobile-handoff/
  API_REFERENCE.md          # Source of truth for backend API contract
docs/
  studer_mobile_spec.md     # Product spec (defer to API_REFERENCE for field names)
```

---

## Coding conventions

### Styling
- **Always use NativeWind `className`** — never `StyleSheet.create`
- Custom Tailwind tokens (defined in `tailwind.config.js`):
  - `bg-surface` (#111111), `bg-surface-raised` (#1a1a1a)
  - `text-primary` / `bg-primary` (#0070f3)
  - `border-border` (#222222)
- Dark theme is the default; use `dark:` variants where needed

### Routing & navigation
- File-based routes under `app/`; groups `(auth)/` and `(tabs)/`
- Auth redirect logic lives **only** in `context/AuthContext.tsx` via `useSegments`
- Never add redirect logic in individual screen layouts

### Data fetching
- Server state via SWR hooks in `hooks/`; follow the pattern in `useCollections.ts`
- Call `api.*` methods from `services/api.ts`; add new endpoints there
- Always call `mutate()` after writes to revalidate SWR cache

### Types & API contract
- **Source of truth for field names: `mobile-handoff/API_REFERENCE.md`**
- `docs/studer_mobile_spec.md` may have outdated field names — do NOT use it for API types
- Notable correction: `StatsResponse` uses `total_answered`, `total_correct`, `accuracy`, `by_topic` — no `streak_days` in v1
- Add new types to `types/index.ts`

### Environment variables
- All env vars in `constants/config.ts`; must be prefixed `EXPO_PUBLIC_`
- Never hardcode URLs or keys in source files

### Code quality
- TypeScript strict: explicit types, no `any`
- No `console.log` in production paths
- No comments unless the WHY is non-obvious (hidden constraint, workaround, subtle invariant)
- Minimal diffs — only change what the task requires

---

## Running the project

```bash
npm install          # or yarn
npx expo start       # Expo dev server (scan QR with Expo Go)
npx expo start --android
npx expo start --ios
npx expo start --web
```

Type check:
```bash
npx tsc --noEmit
```

Tests:
```bash
npx jest --passWithNoTests
```

---

## Development subagents

Subagents live in `.claude/agents/` and are used **by Claude Code during development** — they are not part of the app's logic.

| Agent | Model | Role |
|---|---|---|
| `file-explorer` | Haiku | Search, locate, and read source files |
| `code-reviewer` | Sonnet | Review quality, patterns, and consistency after changes |
| `test-runner` | Haiku | Run tsc, Jest, expo-doctor; interpret results |
| `implementer` | Sonnet | Implement features, fix bugs, write new code |
| `doc-reader` | Haiku | Read and summarize docs, specs, and API references |

Use `file-explorer` and `doc-reader` first to gather context cheaply (Haiku). Use `implementer` and `code-reviewer` for reasoning-heavy work (Sonnet).

---

## Key decisions & gotchas

- **NativeWind v4 setup** requires `babel.config.js` with `jsxImportSource: nativewind`, the `nativewind/babel` plugin, and `withNativeWind` in `metro.config.js` — do not modify these without understanding the chain
- **Supabase is auth-only** — the Studer FastAPI backend handles all business logic; Supabase is not used as a database directly from the app
- **Push token registration** happens inside `AuthContext` on login — do not add a second registration elsewhere
- **Expo managed workflow** — no bare React Native; use Expo SDK APIs and config plugins for native features
- **React 19** — some third-party libs may not be compatible; check before adding dependencies
- **`newArchEnabled: true`** in `app.json` — the new React Native architecture is active; avoid libs that are not compatible with it
