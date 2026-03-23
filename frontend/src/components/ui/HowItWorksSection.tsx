import { Search, MousePointerClick, Bot, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    color: 'bg-[var(--clr-saffron)] text-white',
    title: 'Describe Your Need',
    desc: 'Type what you need in plain language — no jargon required. For example: "I lost my PAN card" or "need a loan for my shop".',
  },
  {
    step: '02',
    icon: MousePointerClick,
    color: 'bg-[var(--clr-navy)] text-white',
    title: 'Browse Matched Services',
    desc: 'Our AI instantly matches your query to the most relevant official government services with all key details.',
  },
  {
    step: '03',
    icon: Bot,
    color: 'bg-purple-600 text-white',
    title: 'Ask the AI Assistant',
    desc: 'Click "Ask AI" on any service card to get personalized step-by-step guidance, document checklists, and fee details.',
  },
  {
    step: '04',
    icon: CheckCircle,
    color: 'bg-[var(--clr-jade)] text-white',
    title: 'Visit Official Portal',
    desc: 'Click the "Visit Portal" button to go directly to the official government website and complete your application.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[var(--clr-navy)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          How It Works
        </h2>
        <p className="text-[var(--clr-muted)] text-sm max-w-md mx-auto">
          Four simple steps to find and apply for any Indian government service
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connector line (desktop only) */}
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[var(--clr-saffron)] via-[var(--clr-navy)] to-[var(--clr-jade)] opacity-20 z-0" />

        {STEPS.map(({ step, icon: Icon, color, title, desc }, idx) => (
          <div
            key={step}
            className="relative flex flex-col items-center text-center bg-white border border-[var(--clr-border)] rounded-2xl p-6 z-10 hover:shadow-md transition-shadow"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Step number */}
            <div className="absolute -top-3 left-5 text-xs font-mono font-bold text-[var(--clr-muted)] bg-[var(--clr-surface)] px-2 py-0.5 rounded-full border border-[var(--clr-border)]">
              {step}
            </div>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md ${color}`}>
              <Icon size={22} />
            </div>

            <h3
              className="font-semibold text-[var(--clr-navy)] text-base mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h3>
            <p className="text-xs text-[var(--clr-muted)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
