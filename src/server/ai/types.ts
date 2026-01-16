export type EmotionalState = {
  mood: 'calm' | 'curious' | 'confident' | 'melancholic' | 'playful' | 'yearning' | 'resolved';
  intensity: 1 | 2 | 3 | 4 | 5;
  arcWeek: number; // week number in current arc
};

export type NarrativeBeat = 'proximity' | 'authority' | 'vulnerability' | 'desire' | 'climax';

export type VisualConstraints = {
  photorealistic: true;
  face: {
    identityToken: string; // reference to VisualProfile.faceIdentity
    structure: string; // textual description of bone structure
    eyes: string;
    nose: string;
    lips: string;
    jaw: string;
    skinUndertone: string;
  };
  allowedVariation: {
    pose: true;
    outfit: true;
    expression: 'subtle';
    lighting: true;
    environment: true;
  };
  disallow: string[]; // e.g., beauty filters, plastic skin, face morphing
};

export type DayPlan = {
  date: string;
  beat: NarrativeBeat;
  emotionalState: EmotionalState;
};

export type GeneratedAssets = {
  storySequence: any;
  feedPost: any;
  reel: { script: string; caption: string };
  carousel: any;
  breathingPhoto: { prompt: string; guidance: string };
  strategicCaptions: string[];
  subtleCTAs: string[];
};
