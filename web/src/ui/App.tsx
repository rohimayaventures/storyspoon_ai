import React, { useEffect, useRef, useState } from 'react';
import { useCookingSession } from '../hooks/useCookingSession';
import { toSSML } from '../lib/ssml';

const DEMO_STEPS = [
  "Welcome to StorySpoon! Let's brew Masala Chai. Ready?",
  "Boil 300 ml water. Add 2 tsp loose black tea.",
  "Add 2-3 crushed green cardamom pods and a small piece of ginger.",
  "Simmer 3 minutes. Add 200 ml milk. Simmer gently again for 2 minutes.",
  "Sweeten to taste with sugar or jaggery. Strain and serve. Peacock-approved!"
];

export default function App(){
  const { state, handleUtterance } = useCookingSession(0);
  const [status, setStatus] = useState<'idle'|'connecting'|'listening'|'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket|null>(null);
  const audioCtxRef = useRef<AudioContext|null>(null);
  const micNodeRef = useRef<AudioWorkletNode|null>(null);

  useEffect(() => {
    // warm up audio worklets on first user gesture
  }, []);

  async function connect() {
    try {
      setStatus('connecting');
      const r = await fetch('/api/live-session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ locale: 'en' }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'live-session-failed');

      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${proto}://${location.host}${j.wsUrl}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        // Initialize audio
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioCtxRef.current = ctx;
        await ctx.audioWorklet.addModule('/audio-worklets/input-processor.js');
        await ctx.audioWorklet.addModule('/audio-worklets/output-processor.js');
        const micNode = new AudioWorkletNode(ctx, 'mic-processor');
        micNode.port.onmessage = (ev) => {
          // Forward PCM16 upstream (provider-specific envelope left abstract)
          ws.send(ev.data);
        };
        micNodeRef.current = micNode;

        // Ask for mic
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const src = ctx.createMediaStreamSource(stream);
        src.connect(micNode);

        setStatus('listening');
        setLog(l => [`Connected to model: ${j.model}`, ...l]);
        // Kick off a greeting text (if provider supports text-to-speech; here we just log)
        setLog(l => [`👋 Say "Next", "Repeat", "Pause", "Step 3", or "2 minute timer"`, ...l]);
      };

      ws.onmessage = (ev) => {
        // Provider audio/text would arrive here.
        // For demo, we'll just log a placeholder.
        setLog(l => [`(model) ${new Date().toLocaleTimeString()}: [audio chunk ${ev.data?.byteLength ?? '…'}]`, ...l]);
      };
      ws.onerror = () => setStatus('error');
      ws.onclose = () => setStatus('idle');

    } catch(e:any){
      console.error(e);
      setStatus('error');
      setLog(l => [`❌ ${e.message}`, ...l]);
    }
  }

  function speakCurrent(){
    // In a real integration, you'd send SSML upstream.
    // Here we log the SSML so you can verify pacing.
    const step = DEMO_STEPS[state.stepIndex] ?? "All done!";
    const ssml = toSSML(step, state.pace);
    setLog(l => [`🔊 ${ssml}`, ...l]);
  }

  function handleCommand(text:string){
    handleUtterance(text);
    speakCurrent();
  }

  const now = Date.now();

  return (
    <div className="wrap">
      <h1>🦚 StorySpoon AI — Demo</h1>
      <div className="card" style={{display:'grid', gap:12}}>
        <div>
          <span className="pill">{status.toUpperCase()}</span>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn" onClick={connect} disabled={status==='listening' || status==='connecting'}>Connect</button>
          <button className="btn secondary" onClick={speakCurrent}>Speak Step</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          <div className="card" style={{background:'#fdfcf8'}}>
            <h3>Recipe Steps</h3>
            <ol>
              {DEMO_STEPS.map((s,i)=>(
                <li key={i} style={{padding:'6px 0', fontWeight: i===state.stepIndex?800:400}}>
                  {i+1}. {s} {i===state.stepIndex?'←':null}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3>Try Commands</h3>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {['Next','Previous','Repeat','Pause','Resume','Step 3','Slower','Faster','2 minute timer'].map((c)=>(
                <button key={c} className="btn" onClick={()=>handleCommand(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Log</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{log.join('\n')}</pre>
        </div>
      </div>

      <div className="timers">
        {state.timers.map(t=>{
          const remain = Math.max(0, t.endsAt - now);
          const m = Math.floor(remain/60000);
          const s = Math.floor((remain%60000)/1000);
          return <div key={t.id} className="timer">⏱ {t.label}: {m}:{String(s).padStart(2,'0')}</div>
        })}
      </div>
    </div>
  );
}
