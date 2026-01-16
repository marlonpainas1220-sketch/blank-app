import type { NarrativeBeat, EmotionalState } from './types';

export function decideNarrativeContinuation(recentMemories: any[]): { beat: NarrativeBeat; justification: string } {
  // Very simple heuristic placeholder: rotate beats weekly based on weekday
  const weekday = new Date().getDay(); // 0=Sun..6=Sat
  const rotation: NarrativeBeat[] = ['proximity', 'authority', 'vulnerability', 'desire', 'climax', 'proximity', 'authority'];
  const beat = rotation[weekday];
  const justification = `Continuing arc with beat ${beat} considering ${recentMemories.length} recent memory entries.`;
  return { beat, justification };
}

export function adjustEmotionalTone(beat: NarrativeBeat, recentState?: EmotionalState): EmotionalState {
  const base: EmotionalState = recentState ?? { mood: 'curious', intensity: 2, arcWeek: 1 };
  switch (beat) {
    case 'proximity':
      return { ...base, mood: 'calm', intensity: 2 };
    case 'authority':
      return { ...base, mood: 'confident', intensity: 3 };
    case 'vulnerability':
      return { ...base, mood: 'melancholic', intensity: 3 };
    case 'desire':
      return { ...base, mood: 'yearning', intensity: 4 };
    case 'climax':
      return { ...base, mood: 'resolved', intensity: 5 };
  }
}
