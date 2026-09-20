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
  what you missed and tips.# 🛡️ ScamShield

**Spot scams. Practise saying no.** A mobile-first web app that helps everyday people in India recognise fraud messages and rehearse how to resist scammers, in **English, हिन्दी and मराठी**.

Built solo during **HackDevengers 2.0** (24-hour open innovation hackathon).

🔗 **Live demo:** [ADD YOUR PUBLISHED LINK HERE]

## The problem
Online fraud in India keeps growing: fake bank KYC alerts, fake job offers, and "digital arrest" calls that pressure people into sending money. Victims are often everyday users who have no quick way to ask "is this real?" and no safe place to practise saying no.

## What it does

### 1. Check a message
Paste a suspicious SMS, WhatsApp message or email (up to 2000 characters) and get:
- a risk level (low / medium / high) and scam type
- a plain-language summary
- the specific red flags in that message
- safe next steps, plus reporting info (**1930** helpline and **cybercrime.gov.in**)
- a confidence note (guidance, not a guarantee)

Three sample messages are one tap away.

### 2. Train yourself
Pick a scenario (fake bank KYC call, fake job offer, digital arrest call) and chat with an AI playing the scammer. Get a 0–100 score showing what you caught, what you missed, and tips for next time. Everything in the practice chat is clearly labelled as a simulation.

### Also
- Full UI in three languages from a single i18n file
- No accounts, no database, nothing stored by ScamShield

## Screenshots
[ADD 2–3 SCREENSHOTS OR A SHORT GIF: result card, practice chat, score screen]

## How it works
1. The browser sends your text to a server function. It never talks to the AI directly.
2. The server function calls the Groq API (OpenAI-compatible chat completions) with a strict system prompt and returns structured JSON.
3. The UI renders the result.

**Safety by design**
- The API key lives only on the server and never reaches the browser.
- User text is treated as untrusted data, and the prompts tell the model to ignore instructions inside it (prompt-injection resistance).
- Server-side limits: 2000 characters of text, 20 chat messages. Friendly errors when exceeded.
- User content is never logged.
- The scammer simulation uses fictional names and placeholder links only, and breaks character if the user seems genuinely distressed.

## Tech stack
- React 19 + TypeScript + Vite
- TanStack Start / TanStack Router
- Tailwind CSS v4
- Groq API (`openai/gpt-oss-120b`, set in one constant, `GROQ_MODEL`, in `src/lib/groq.server.ts`)

Server logic: `src/lib/scamshield.functions.ts` (`analyzeMessage`, `trainTurn`). Prompts: `src/lib/prompts.server.ts`.

## Run it locally
```bash
bun install
bun run dev
```
Create a `.env` file in the project root:
```
GROQ_API_KEY=your_groq_api_key
```
Get a free key at [console.groq.com/keys](https://console.groq.com/keys). Never commit your key.

## Privacy
ScamShield does not store, log or link your messages to you. Text is sent to the Groq API only to produce your result and is processed under Groq's own terms, so avoid pasting real OTPs, PINs or account numbers.

## Limitations
- Text only for now: the current model can't read screenshots.
- It's an AI assessment and can be wrong. Always verify with your bank or official sources.
- Not affiliated with any bank or government agency.

## Future scope
- Screenshot support (on-device OCR)
- More languages and regional scam scenarios
- Voice-call practice mode
- A shareable "scam of the week" alert feed
- Community-reported scam patterns (with privacy safeguards)
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
  (currently `openai/gpt-oss-120b`; `llama-3.3-70b-versatile` is not available on this key).
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
