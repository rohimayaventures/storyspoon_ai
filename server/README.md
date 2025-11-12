# StorySpoon Server

Minimal proxy to keep the AI model key server-side.

## Endpoints
- `GET /health`
- `POST /api/live-session` -> returns `{ wsUrl: "/realtime", model }`
- `WS /realtime` -> bridges client <-> provider using server-held key

## Run
```bash
pnpm i
cp .env.example .env  # set GOOGLE_API_KEY
pnpm dev
```
