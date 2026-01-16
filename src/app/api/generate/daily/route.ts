import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDailyContent } from '@/server/ai/generator';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { influencerId } = await req.json();
  if (!influencerId) return NextResponse.json({ error: 'Missing influencerId' }, { status: 400 });

  const influencer = await prisma.influencer.findFirst({
    where: { id: influencerId },
    include: { coreProfile: true, visualProfile: true },
  });
  if (!influencer) return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });

  const result = await generateDailyContent(influencer);
  return NextResponse.json(result);
}
