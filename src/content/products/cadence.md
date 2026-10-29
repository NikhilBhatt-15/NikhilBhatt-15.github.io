---
name: cadence
tagline: Keep a steady posting rhythm on X and LinkedIn without living in the feed.
order: 9
repo: NikhilBhatt-15/cadence
kind: web
live: https://cadence-one-ruby.vercel.app
liveKind: app
liveSub: sign in with GitHub · works on phones
liveNote: Drafting needs an AI key (a free Gemini key works) and posting needs your X account. Both are connected in Settings and stored encrypted.
platform: Web
language: TypeScript
genre: Web app · Social scheduling
badge: New
poster: { bg: '#0e0f2a', ink: '#eceeff', accent: '#8583ff', motif: cadence }
screenshots:
  - { src: /products/cadence-board.png, alt: The week board with scheduled posts, a live now marker and the weekly goal meter }
  - { src: /products/cadence-compose.png, alt: Composer with an AI-drafted three-part thread }
  - { src: /products/cadence-preview.png, alt: Preview of the thread as it will look on X }
  - { src: /products/cadence-voices.png, alt: Voices page for the style rules the AI follows }
  - { src: /products/cadence-landing.png, alt: Landing page with an animated example week }
install:
  - 'You need Node.js 20+ and a Postgres database (a free [Neon](https://neon.tech) database, or `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=pw -e POSTGRES_DB=cadence postgres:17-alpine`).'
  - "Clone it and install:\n```bash\ngit clone https://github.com/NikhilBhatt-15/cadence.git\ncd cadence\nnpm install\ncp .env.example .env.local\n```"
  - 'Fill in `.env.local`: the database URL, three random secrets, a GitHub OAuth app for sign-in and an X developer app (the free tier is enough). The file explains each one.'
  - 'Run `npm run db:push`, then `npm run dev`, and open **http://localhost:3000**. To deploy, import the repo on Vercel and add the same variables.'
usage:
  - 'Open [cadence-one-ruby.vercel.app](https://cadence-one-ruby.vercel.app), sign in with GitHub, connect X under **Settings**, and add an AI key. A free Gemini key works; OpenAI, Anthropic and any OpenAI-compatible API do too.'
  - 'In **Write**, pick a kind of post and where to start from: an idea, a GitHub repo, a link, notes, or a post to rewrite. Press **Ctrl+Enter** to draft it.'
  - 'Turn on **Write as a thread** for X threads. Every part gets its own character ring.'
  - 'On **Schedule**, drag drafts onto a day to schedule them, or drag posts between days to move them. Undo is in the toast.'
  - 'Set up **Voices** once (tone, length, words to avoid) and every draft follows them.'
stack: [Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion, Postgres, Drizzle ORM, AI SDK, X API v2, LinkedIn API]
---

A scheduler for people who would rather build than post. Cadence turns an idea, rough notes,
a link or one of your GitHub projects into a post or thread in your own voice, then
publishes it to X or LinkedIn at the time you pick. It is multi-user, keeps every token
and API key encrypted, and runs entirely on free tiers.

- **Any kind of post:** thoughts, project updates, tips, stories, announcements, questions
  and hot takes, each with its own brief for the AI.
- **Streaming drafts:** the text appears in the editor as it is written. Stop, edit by hand
  or draft again.
- **A week board, not a list:** a live "now" marker, drag-to-reschedule with undo, and a
  weekly goal meter that turns orange when you go past it.
- **Bring your own model:** Gemini, OpenAI, Anthropic, Groq, OpenRouter or a local Ollama.
- **Built to grow:** each network is a small adapter, so adding another platform doesn't
  touch the composer or the scheduler.

## Behind the scenes

Vercel's free plan only runs crons once a day, so a GitHub Actions workflow calls the
publish endpoint every five minutes. That endpoint claims due posts with
`FOR UPDATE SKIP LOCKED`, so overlapping runs never post twice. It refreshes X tokens
(saving the rotated refresh token) and posts threads as a reply chain. Results are stored per
platform, so a retry only re-sends where it failed. Links and custom AI URLs go through a
guard that resolves DNS and refuses private addresses on every redirect hop.
