'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Database, Layers } from 'lucide-react';
import { checkHealth } from '@/utils/api';

interface HealthData {
  ai_connected: boolean;
  total_services: number;
}

export default function StatsBar() {
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    checkHealth()
      .then((h) => setHealth({ ai_connected: h.ai_connected, total_services: h.total_services }))
      .catch(() => setHealth({ ai_connected: false, total_services: 30 }));
  }, []);

  return (
    <div className="bg-[var(--clr-surface)] border-b border-[var(--clr-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-xs text-[var(--clr-muted)] overflow-x-auto gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <Database size={11} className="text-[var(--clr-navy)]" />
              <span>
                <span className="font-semibold text-[var(--clr-navy)]">
                  {health?.total_services ?? '30'}+
                </span>{' '}
                Government Services
              </span>
            </div>

            <div className="w-px h-3 bg-[var(--clr-border)]" />

            <div className="flex items-center gap-1.5">
              <Layers size={11} className="text-[var(--clr-saffron)]" />
              <span>Semantic AI Search</span>
            </div>

            <div className="w-px h-3 bg-[var(--clr-border)]" />

            <div className="flex items-center gap-1.5">
              {health?.ai_connected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Wifi size={11} className="text-emerald-500" />
                  <span className="text-emerald-600 font-medium">AI Online</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <WifiOff size={11} className="text-amber-500" />
                  <span className="text-amber-600 font-medium">AI Fallback Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="shrink-0 text-[10px] hidden sm:block">
            Official .gov.in links only &nbsp;•&nbsp; No login required &nbsp;•&nbsp; Free for all citizens
          </div>
        </div>
      </div>
    </div>
  );
}
