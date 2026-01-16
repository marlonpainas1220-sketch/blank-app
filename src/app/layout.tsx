import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Virtual Influencer SaaS',
  description: 'Narrative, memory and visual consistency engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
