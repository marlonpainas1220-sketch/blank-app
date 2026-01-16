import OpenAI from 'openai';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { decideNarrativeContinuation, adjustEmotionalTone } from './narrative';
import { readRecentMemory, appendNarrativeMemory, setEmotionalMemory } from './memory';
import { buildVisualConstraints, imagePromptFromConstraints } from './visual';
import type { GeneratedAssets } from './types';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function generateDailyContent(influencer: { id: string; coreProfile: any; visualProfile: any; name: string }) {
  // 1. Read last 30 days memory
  const recent = await readRecentMemory(influencer.id);

  // 2. Decide narrative continuation
  const { beat, justification } = decideNarrativeContinuation(recent);

  // 3. Adjust emotional tone
  const emotional = adjustEmotionalTone(beat);
  await setEmotionalMemory(influencer.id, emotional);

  // 4. Build visual constraints
  const constraints = buildVisualConstraints(influencer.visualProfile?.faceIdentity ?? 'face-token');

  // Build a system prompt encoding immutable core profile and constraints
  const system = [
    'You are a creative director for a photorealistic virtual influencer.',
    'Never mention AI or generation; everything is described as real life.',
    'Maintain strict facial identity consistency across all visual descriptions.',
    `Core identity (immutable): ${JSON.stringify(influencer.coreProfile)}`,
    `Visual constraints: ${JSON.stringify(constraints)}`,
    'Storytelling: continuous arcs; no random content; use unconscious desire principles (tension, symbolism, aspiration, mystery, micro-conflicts).',
  ].join('\n');

  const user = `Generate daily content for ${influencer.name} with beat ${beat} and emotional tone ${emotional.mood} (intensity ${emotional.intensity}). Include:\n- storySequence (3-5 steps)\n- feedPost (caption + visual description)\n- reel (script + caption)\n- carousel (5 slides outline)\n- breathingPhoto (aesthetic-only shot)\n- strategicCaptions (3)\n- subtleCTAs (2)\nReturn strict JSON with those keys.`;

  let assets: GeneratedAssets;
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    const contentText = completion.choices[0]?.message?.content ?? '{}';
    assets = JSON.parse(contentText);
  } catch (err) {
    // Fallback mock for local/dev without valid API key
    assets = {
      storySequence: [
        { step: 1, beat, note: 'Mock story step 1' },
        { step: 2, beat, note: 'Mock story step 2' },
      ],
      feedPost: { caption: 'Mock caption', visual: 'soft window light portrait' },
      reel: { script: 'Mock reel script', caption: 'Mock reel caption' },
      carousel: { slides: ['Mock 1', 'Mock 2', 'Mock 3', 'Mock 4', 'Mock 5'] },
      breathingPhoto: { prompt: '', guidance: '' },
      strategicCaptions: ['Mock strat 1', 'Mock strat 2', 'Mock strat 3'],
      subtleCTAs: ['Mock CTA 1', 'Mock CTA 2'],
    } as any;
  }

  // Example visual prompt for breathing photo from constraints
  const prompt = imagePromptFromConstraints(constraints, {
    pose: 'relaxed, gentle head tilt',
    outfit: 'minimalist monochrome',
    lighting: 'soft window light, late afternoon',
    env: 'quiet apartment interior',
    expression: 'soft gaze',
  });
  assets.breathingPhoto = { prompt, guidance: 'Keep facial identity exact; no smoothing; natural pores.' };

  await appendNarrativeMemory(influencer.id, { beat, justification, assetsSummary: Object.keys(assets) });

  // Persist generated assets per kind
  const now = new Date();
  await prisma.generatedContent.createMany({
    data: [
      { influencerId: influencer.id, date: now, kind: 'STORY_SEQUENCE', data: JSON.stringify(assets.storySequence ?? {}) },
      { influencerId: influencer.id, date: now, kind: 'FEED_POST', data: JSON.stringify(assets.feedPost ?? {}) },
      { influencerId: influencer.id, date: now, kind: 'REEL', data: JSON.stringify(assets.reel ?? {}) },
      { influencerId: influencer.id, date: now, kind: 'CAROUSEL', data: JSON.stringify(assets.carousel ?? {}) },
      { influencerId: influencer.id, date: now, kind: 'BREATHING_PHOTO', data: JSON.stringify(assets.breathingPhoto ?? {}) },
    ],
    skipDuplicates: true,
  });

  return { beat, emotional, assets };
}
