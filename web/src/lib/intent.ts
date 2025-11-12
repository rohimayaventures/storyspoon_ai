export type Intent =
  | { type: 'PAUSE' } | { type: 'RESUME' } | { type: 'REPEAT' }
  | { type: 'NEXT' } | { type: 'PREV' }
  | { type: 'GOTO_STEP'; step: number }
  | { type: 'PACE'; value: 'slower'|'faster' }
  | { type: 'TIMER_SET'; minutes: number; label?: string };

const rules = [
  { re: /\b(pause|stop)\b/i, map: () => ({ type:'PAUSE' }) },
  { re: /\b(resume|continue)\b/i, map: () => ({ type:'RESUME' }) },
  { re: /\b(repeat|again)\b/i, map: () => ({ type:'REPEAT' }) },
  { re: /\b(next)\b/i, map: () => ({ type:'NEXT' }) },
  { re: /\b(previous|back)\b/i, map: () => ({ type:'PREV' }) },
  { re: /\bstep\s*(\d+)\b/i, map: (m:RegExpMatchArray) => ({ type:'GOTO_STEP', step: Number(m[1]) }) },
  { re: /\b(slower|slow down)\b/i, map: () => ({ type:'PACE', value:'slower' }) },
  { re: /\b(faster|speed up)\b/i, map: () => ({ type:'PACE', value:'faster' }) },
  { re: /\b(\d+)[ -]?(?:min|minute)s? timer\b/i, map: (m:RegExpMatchArray) => ({ type:'TIMER_SET', minutes: Number(m[1]) }) },
] as const;

export function parseIntent(text: string): Intent | null {
  for (const r of rules) {
    const m = text.match(r.re);
    if (m) return (r.map as any)(m);
  }
  return null;
}
