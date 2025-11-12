class SpeakerProcessor extends AudioWorkletProcessor {
  constructor(){ super(); this.queue=[]; this.port.onmessage=(e)=>{ this.queue.push(new Float32Array(e.data)); }; }
  process(_in, outputs){
    const out=outputs[0][0]; if(!this.queue.length){ out.fill(0); return true; }
    const buf=this.queue.shift(); const n=Math.min(out.length, buf.length);
    for(let i=0;i<n;i++) out[i]=buf[i]; for(let i=n;i<out.length;i++) out[i]=0; return true;
  }
}
registerProcessor('speaker-processor', SpeakerProcessor);
