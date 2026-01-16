# AI Virtual Influencer SaaS (MVP)

This repository contains a production-ready scaffold for a multi-tenant SaaS that automates daily content for a photorealistic AI virtual influencer with strict facial consistency, long-term memory, and continuous storytelling.

## Getting Started

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`.
3. Generate DB and client: `npm run prisma:push`.
4. Run dev server: `npm run dev`.
5. Seed demo data (with the dev server running): `curl -X POST http://localhost:3000/api/seed`.
6. In the home page, sign in with email `demo@example.com` (any name). After sign-in, click "Listar influencers" and then "Gerar conteúdo diário".

## Tech
- Next.js 14 (App Router)
- Prisma + SQLite (swap provider for Postgres in production)
- NextAuth (Credentials)
- OpenAI API

## API
- `POST /api/generate/daily` { influencerId } — requires auth
- `GET /api/dev/influencers` — list influencers for the current user's tenants (auth)
- `POST /api/seed` — dev only
- `GET /api/health`

## Core Folders
- `src/server/ai` — memory, narrative, visual consistency constraint builder, generator
- `prisma/schema.prisma` — multi-tenant data model

## Notes
- Visual generation is orchestrated via prompts with strict constraints; actual image generation backend (e.g., Google, SDXL) can be plugged later.
- The system reads recent memory, decides continuation, adjusts emotional tone, then generates structured content.
