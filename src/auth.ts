import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export type JWTPayload = {
  sub: string;
  email?: string;
  name?: string | null;
  tenants?: { tenantId: string; role: 'OWNER' | 'ADMIN' | 'MEMBER'; plan: 'FREE' | 'PRO' | 'AGENCY' }[];
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(creds) {
        const schema = z.object({ email: z.string().email(), name: z.string().optional() });
        const parsed = schema.safeParse({ email: creds?.email, name: creds?.name });
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        const name = parsed.data.name ?? null;
        const user = await prisma.user.upsert({
          where: { email },
          update: { name },
          create: { email, name },
        });
        return { id: user.id, email: user.email, name: user.name } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On sign-in, enrich token with tenant memberships
      if (user) {
        const memberships = await prisma.userTenant.findMany({
          where: { userId: (user as any).id },
          include: { tenant: true },
        });
        (token as JWTPayload).tenants = memberships.map((m) => ({ tenantId: m.tenantId, role: m.role as any, plan: m.tenant.plan as any }));
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || ({} as any);
      (session.user as any).id = token.sub;
      (session.user as any).tenants = (token as any).tenants ?? [];
      return session;
    },
  },
});
