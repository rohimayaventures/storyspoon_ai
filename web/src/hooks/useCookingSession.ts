import { useReducer } from 'react';
import { parseIntent } from '../lib/intent';

export type SessionState = {
  stepIndex: number;
  pace: 'slow'|'normal'|'fast';
  paused: boolean;
  timers: { id:string; label:string; endsAt:number }[];
};
type Action =
  | { type:'SET_PACE'; value: SessionState['pace'] }
  | { type:'PAUSE' }|{ type:'RESUME' }|{ type:'REPEAT' }
  | { type:'NEXT' }|{ type:'PREV' }
  | { type:'GOTO_STEP'; step:number }
  | { type:'TIMER_SET'; minutes:number; label?:string };

const reducer = (s:SessionState, a:Action): SessionState => {
  switch (a.type) {
    case 'SET_PACE': return { ...s, pace: a.value };
    case 'PAUSE': return { ...s, paused: true };
    case 'RESUME': return { ...s, paused: false };
    case 'REPEAT': return s;
    case 'NEXT': return { ...s, stepIndex: s.stepIndex+1, paused:false };
    case 'PREV': return { ...s, stepIndex: Math.max(0, s.stepIndex-1), paused:false };
    case 'GOTO_STEP': return { ...s, stepIndex: Math.max(0, a.step-1), paused:false };
    case 'TIMER_SET':
      const id = Math.random().toString(36).slice(2);
      const endsAt = Date.now() + a.minutes*60*1000;
      return { ...s, timers: [...s.timers, { id, label:a.label ?? `${a.minutes} min`, endsAt }] };
    default: return s;
  }
};

export function useCookingSession(initialStep=0) {
  const [state, dispatch] = useReducer(reducer, { stepIndex: initialStep, pace:'normal', paused:false, timers: []});
  function handleUtterance(text:string) {
    const i = parseIntent(text);
    if (!i) return;
    switch(i.type) {
      case 'PAUSE': dispatch({type:'PAUSE'}); break;
      case 'RESUME': dispatch({type:'RESUME'}); break;
      case 'REPEAT': dispatch({type:'REPEAT'}); break;
      case 'NEXT': dispatch({type:'NEXT'}); break;
      case 'PREV': dispatch({type:'PREV'}); break;
      case 'GOTO_STEP': dispatch({type:'GOTO_STEP', step:i.step}); break;
      case 'PACE': dispatch({type:'SET_PACE', value: i.value==='slower'?'slow':'fast'}); break;
      case 'TIMER_SET': dispatch({type:'TIMER_SET', minutes:i.minutes}); break;
    }
  }
  return { state, dispatch, handleUtterance };
}
