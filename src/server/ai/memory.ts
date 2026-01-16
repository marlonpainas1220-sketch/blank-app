import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import type { EmotionalState } from './types';

export async function readRecentMemory(influencerId: string) {
  const since = subDays(new Date(), 30);
  const memories = await prisma.memory.findMany({
    where: { influencerId, createdAt: { gte: since } },
    orderBy: { createdAt: 'asc' },
  });
  return memories.map((m) => ({ ...m, content: safeParseJSON(m.content) }));
}

export async function appendNarrativeMemory(influencerId: string, content: any, tags?: string[]) {
  await prisma.memory.create({
    data: {
      influencerId,
      type: 'NARRATIVE',
      content: JSON.stringify(content),
      tags: tags?.join(',') ?? null,
    },
  });
}

export async function setEmotionalMemory(influencerId: string, state: EmotionalState) {
  await prisma.memory.create({
    data: {
      influencerId,
      type: 'EMOTIONAL',
      content: JSON.stringify(state),
    },
  });
}

export function safeParseJSON(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
