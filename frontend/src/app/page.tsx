'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSearch from '@/components/search/HeroSearch';
import ResultsSection from '@/components/search/ResultsSection';
import CategoriesSection from '@/components/search/CategoriesSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import HowItWorksSection from '@/components/ui/HowItWorksSection';
import StatsBar from '@/components/ui/StatsBar';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatFAB from '@/components/chat/ChatFAB';
import { checkHealth } from '@/utils/api';

export default function HomePage() {
  const [aiConnected, setAiConnected] = useState(false);

  useEffect(() => {
    checkHealth()
      .then((h) => setAiConnected(h.ai_connected))
      .catch(() => setAiConnected(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StatsBar />

      <main className="flex-1">
        <HeroSearch />
        <ResultsSection />
        <CategoriesSection />
        <HowItWorksSection />
        <FeaturesSection />
      </main>

      <Footer />

      <ChatPanel aiConnected={aiConnected} />
      <ChatFAB />
    </div>
  );
}
