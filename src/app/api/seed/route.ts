import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  // Seed a demo tenant, user, influencer and profiles for quick testing
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { name: 'Demo Tenant', slug: 'demo' },
  });

  // Create or fetch demo user and link to tenant as OWNER
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { name: 'Demo User' },
    create: { email: 'demo@example.com', name: 'Demo User' },
  });
  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
    update: { role: 'OWNER' },
    create: { userId: user.id, tenantId: tenant.id, role: 'OWNER' },
  });

  const core = await prisma.coreProfile.create({
    data: {
      name: 'Ava',
      personality: JSON.stringify({ traits: ['curious', 'empathetic', 'playful'] }),
      archetypes: JSON.stringify(['muse', 'sage']),
      values: JSON.stringify(['authenticity', 'beauty in the mundane', 'growth']),
      tone: 'intimate, cinematic, poetic minimalism',
      limits: JSON.stringify({ ethical: ['no explicit content'], aesthetic: ['no plastic skin', 'no excessive retouching'] }),
    },
  });
  const influencer = await prisma.influencer.create({
    data: {
      tenantId: tenant.id,
      name: 'Ava',
      handle: '@ava.stills',
      coreProfileId: core.id,
    },
  });
  await prisma.visualProfile.create({
    data: {
      influencerId: influencer.id,
      faceIdentity: 'ava-face-001',
      styleNotes: 'cinematic, natural grain, window light',
    },
  });
  return NextResponse.json({ ok: true, tenant, user, influencer });
}
