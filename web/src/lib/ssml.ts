export function toSSML(text: string, pace:'slow'|'normal'|'fast'='normal') {
  const rate = pace==='slow'?'85%':pace==='fast'?'115%':'100%';
  const processed = text.replace(/([.!?])\s+/g, '$1 <break time="350ms"/>');
  return `<speak><prosody rate="${rate}">${processed}</prosody></speak>`;
}
