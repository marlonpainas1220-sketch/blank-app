'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('demo@example.com');
  const [name, setName] = useState('Demo User');
  const [session, setSession] = useState<any>(null);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [log, setLog] = useState<string>('');

  async function refreshSession() {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    setSession(data);
  }

  useEffect(() => {
    refreshSession();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken: '',
        email,
        name,
      }).toString(),
    });
    if (res.ok) await refreshSession();
  }

  async function handleSignOut() {
    await fetch('/api/auth/signout', { method: 'POST' });
    await refreshSession();
  }

  async function seed() {
    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
  }

  async function listInfluencers() {
    const res = await fetch('/api/health'); // ping to ensure server alive
    if (!res.ok) return;
    const list = await fetch('/api/dev/influencers').catch(() => null);
    if (list && list.ok) {
      const data = await list.json();
      setInfluencers(data.items ?? []);
    } else {
      // fallback query through a temporary inline API via fetch to /api route not present
      setLog('No /api/dev/influencers route. Use DB viewer or generate by id.');
    }
  }

  async function generate(influencerId: string) {
    const res = await fetch('/api/generate/daily', { method: 'POST', body: JSON.stringify({ influencerId }) });
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>AI Virtual Influencer</h1>
      <p>Autentique-se, faça seed e gere conteúdo diário.</p>

      {session?.user ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>Logado como {session.user.email}</span>
          <button onClick={handleSignOut}>Sair</button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={seed}>Seed demo</button>
        <button onClick={listInfluencers}>Listar influencers (dev)</button>
      </div>

      {influencers.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Influencers</h3>
          <ul>
            {influencers.map((i) => (
              <li key={i.id}>
                {i.name} ({i.handle}) <button onClick={() => generate(i.id)}>Gerar conteúdo diário</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <h3>Output</h3>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#0f0', padding: 12, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>{log}</pre>
      </div>

      <ul>
        <li>Identity & Memory layers</li>
        <li>Narrative arcs</li>
        <li>Visual consistency engine</li>
      </ul>
    </main>
  );
}
