import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Government Service Finder | India',
  description:
    'Discover official Indian government services instantly. AI-powered search and step-by-step application guidance for every citizen.',
  keywords:
    'government services, India, passport, aadhaar, pan card, voter id, ai assistant',
  authors: [{ name: 'AI Gov Finder' }],
  openGraph: {
    title: 'AI Government Service Finder',
    description: 'Find and navigate Indian government services with AI assistance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
