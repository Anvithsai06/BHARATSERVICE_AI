import { Shield, Zap, Bot, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    color: 'text-[var(--clr-saffron)] bg-[var(--clr-saffron)]/10',
    title: 'Instant Results',
    desc: 'AI-powered semantic search returns the most relevant services in under a second.',
  },
  {
    icon: Shield,
    color: 'text-[var(--clr-jade)] bg-[var(--clr-jade)]/10',
    title: 'Official Links Only',
    desc: 'Every service links directly to official .gov.in portals. No third-party redirects.',
  },
  {
    icon: Bot,
    color: 'text-blue-600 bg-blue-50',
    title: 'AI Step-by-Step Guide',
    desc: 'Ask the AI assistant to walk you through any application process, end-to-end.',
  },
  {
    icon: Globe,
    color: 'text-purple-600 bg-purple-50',
    title: 'No Login Required',
    desc: 'Freely accessible to every citizen. No account, no signup, no friction.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[var(--clr-navy-dark)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Why Use GovSaathi?
          </h2>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Built to make government services accessible to every Indian citizen
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3
                className="text-white font-semibold text-sm mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h3>
              <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
