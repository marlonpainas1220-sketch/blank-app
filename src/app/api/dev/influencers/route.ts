import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberships = (session.user as any).tenants as { tenantId: string }[] | undefined;
  const tenantIds = memberships?.map((m) => m.tenantId) ?? [];

  const items = await prisma.influencer.findMany({
    where: tenantIds.length ? { tenantId: { in: tenantIds } } : undefined,
    select: { id: true, name: true, handle: true, tenantId: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}
