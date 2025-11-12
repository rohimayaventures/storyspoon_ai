class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const ch = input[0];
    const pcm16 = new Int16Array(ch.length);
    for (let i=0;i<ch.length;i++){ const s=Math.max(-1,Math.min(1,ch[i])); pcm16[i]=s<0?s*0x8000:s*0x7FFF; }
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    return true;
  }
}
registerProcessor('mic-processor', MicProcessor);
