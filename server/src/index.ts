import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const MODEL = process.env.MODEL ?? 'gemini-2.0-realtime-exp-02-2025';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? '';
const GOOGLE_REALTIME_URL = process.env.GOOGLE_REALTIME_URL ?? 'wss://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-realtime?key=';

app.get('/health', (_req, res) => res.json({ ok: true, model: MODEL }));

app.post('/api/live-session', async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) return res.status(500).json({ ok: false, error: 'missing-api-key' });
    const { locale = 'en' } = req.body ?? {};
    return res.json({ ok: true, wsUrl: '/realtime', model: MODEL, locale });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'live-session-failed' });
  }
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/realtime' });

wss.on('connection', async (clientWs) => {
  if (!GOOGLE_API_KEY) {
    clientWs.close(1011, 'Server missing GOOGLE_API_KEY');
    return;
  }
  const target = GOOGLE_REALTIME_URL + encodeURIComponent(GOOGLE_API_KEY) + `&model=${encodeURIComponent(MODEL)}`;
  const ProviderWS = (await import('ws')).default;
  const upstream = new ProviderWS(target, { headers: { Origin: 'https://localhost' }});

  upstream.on('open', () => {
    clientWs.on('message', (d) => { if (upstream.readyState === upstream.OPEN) upstream.send(d); });
    upstream.on('message', (d) => { if (clientWs.readyState === clientWs.OPEN) clientWs.send(d); });
    clientWs.on('close', () => upstream.close());
    upstream.on('close', () => clientWs.close());
  });
  upstream.on('error', (err) => {
    console.error('[provider-ws error]', err);
    clientWs.readyState === clientWs.OPEN && clientWs.close(1011, 'Provider error');
  });
});

server.listen(PORT, HOST, () => console.log(`✅ [StorySpoon] server running on http://${HOST}:${PORT}`));
