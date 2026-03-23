export default function Footer() {
  return (
    <footer className="bg-[var(--clr-navy-dark)] text-white/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-display text-xl font-bold text-white mb-2">
              Gov<span className="text-[var(--clr-saffron)]">Saathi</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered platform helping every Indian citizen discover and navigate
              government services with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Quick Links
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ['India.gov.in', 'https://www.india.gov.in'],
                ['MyGov.in', 'https://www.mygov.in'],
                ['DigiLocker', 'https://digilocker.gov.in'],
                ['UMANG App', 'https://web.umang.gov.in'],
              ].map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--clr-saffron-lt)] transition-colors"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <div className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Disclaimer
            </div>
            <p className="text-xs leading-relaxed">
              This platform is an independent AI-assisted directory service. It is NOT
              an official Government of India website. Always verify information on
              official government portals before taking action.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© {new Date().getFullYear()} GovSaathi. Built for Indian Citizens.</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[var(--stripe-saffron)]" />
            <span className="w-3 h-3 rounded-full bg-white/90" />
            <span className="w-3 h-3 rounded-full bg-[var(--stripe-green)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
