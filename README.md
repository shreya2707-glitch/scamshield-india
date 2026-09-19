# ScamShield

A mobile-first web app that helps everyday users in India spot scam messages and practise
resisting scams — in English, हिन्दी and मराठी.

## Features

- **Check a message** — paste text (up to 2000 characters) and get a risk level
  (low / medium / high), scam type, plain-language summary, red flags, step-by-step actions,
  reporting details (1930 and cybercrime.gov.in) and a confidence note. Three sample
  messages are one tap away. (Screenshot upload is hidden for now: the current text-only
  model cannot read images.)
- **Train yourself** — pick a scenario (fake bank KYC call, fake job offer, digital arrest
  call), chat with an AI playing the scammer, then get a 0–100 score with what you caught,
  what you missed and tips.
- Full UI translation across three languages from a single i18n file.
- No accounts, no database, nothing stored.

## Tech stack

- React 19 + TypeScript + Vite
- TanStack Start / TanStack Router
- Tailwind CSS v4
- Groq API (OpenAI-compatible chat completions) via secure server functions

## Backend

Server logic lives in `src/lib/scamshield.functions.ts` (`analyzeMessage` and `trainTurn`),
which run only on the server — the API key never reaches the browser.

- Model name: single constant `GROQ_MODEL` in `src/lib/groq.server.ts`
  (currently `llama-3.3-70b-versatile`).
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`, JSON output mode requested
  for the analysis and scoring calls, with safe parsing of the response.
- Prompts: `src/lib/prompts.server.ts` (placeholder constants, safe to rewrite).
- Server-side limits: text 2000 characters, history 20 messages; friendly
  errors are returned when exceeded. User content is passed as untrusted data and is
  never logged.

## Setup

```bash
bun install
bun run dev
```

## Environment variable

| Name           | Purpose               |
| -------------- | --------------------- |
| `GROQ_API_KEY` | Groq API key (server) |

Store it as a project secret; never put it in frontend code.

## Privacy

Messages and practice chats are sent to the AI model only to produce the
result you see, and are not stored, logged or linked to you. ScamShield gives guidance,
not a guarantee — always verify with your bank or official sources.
