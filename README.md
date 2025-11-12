# StorySpoon AI — Bootstrap Repo (MVP Demo)

A secure, Codespaces-friendly starter for a **voice‑guided cooking** demo:
- 🔐 Server proxy holds your model key (no secrets in the browser)
- 🎙️ Web client with AudioWorklet, voice intents, SSML pacing, timers
- 🌍 i18n-ready structure
- 🧪 Easy to extend

## Quickstart (local)
```bash
pnpm i
# Configure server/.env (see server/.env.example)
pnpm dev  # runs server (8787) + web (5173)
```

Open http://localhost:5173
