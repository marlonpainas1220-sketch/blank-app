import type { VisualConstraints } from './types';

export function buildVisualConstraints(faceIdentity: string): VisualConstraints {
  return {
    photorealistic: true,
    face: {
      identityToken: faceIdentity,
      structure: 'consistent bone structure with defined cheekbones',
      eyes: 'same iris color and shape, no enlargement',
      nose: 'unchanged nose profile',
      lips: 'natural texture, no over-smoothing',
      jaw: 'consistent jawline definition',
      skinUndertone: 'true-to-life undertone, no plastic look',
    },
    allowedVariation: {
      pose: true,
      outfit: true,
      expression: 'subtle',
      lighting: true,
      environment: true,
    },
    disallow: [
      'face morphing',
      'beauty filters',
      'plastic skin',
      'over-smoothing',
      'AI mention',
    ],
  };
}

export function imagePromptFromConstraints(c: VisualConstraints, scene: { pose: string; outfit: string; lighting: string; env: string; expression?: string; }): string {
  return [
    'ultra-detailed, photorealistic DSLR photography',
    `subject: consistent identity ${c.face.identityToken}`,
    `face: ${c.face.structure}; eyes ${c.face.eyes}; nose ${c.face.nose}; lips ${c.face.lips}; jaw ${c.face.jaw}; skin ${c.face.skinUndertone}`,
    `variation: pose ${scene.pose}; outfit ${scene.outfit}; expression ${scene.expression ?? 'subtle'}; lighting ${scene.lighting}; environment ${scene.env}`,
    'no face morphing, no beauty filters, no plastic skin, natural pores and texture, cinematic grading',
    'shot on full-frame DSLR, 50mm prime, shallow depth of field'
  ].join(' | ');
}
