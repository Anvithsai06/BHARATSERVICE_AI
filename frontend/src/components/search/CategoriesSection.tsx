'use client';

import { useSearchStore } from '@/store';

const CATEGORIES = [
  { label: 'Identity & Travel',       icon: '🛂', query: 'passport visa pcc oci overseas citizen identity travel' },
  { label: 'Identity',                icon: '🪪', query: 'aadhaar uid biometric identity enrollment update' },
  { label: 'Tax & Finance',           icon: '💸', query: 'income tax return itr pan card gst filing customs duty' },
  { label: 'Transport',               icon: '🚗', query: 'driving licence vehicle registration rc fastag vahan parivahan' },
  { label: 'Civil Registration',      icon: '📋', query: 'birth certificate death certificate marriage registration domicile' },
  { label: 'State Services',          icon: '🏛️', query: 'caste certificate income certificate ration card land records property registration' },
  { label: 'Agriculture & Farmers',   icon: '🌾', query: 'pm kisan fasal bima kisan credit card soil health enam nabard' },
  { label: 'Health',                  icon: '🏥', query: 'ayushman bharat abha health insurance jan aushadhi cghs fssai' },
  { label: 'Housing & Urban Dev',     icon: '🏠', query: 'pmay housing urban gramin clss subsidy smart cities amrut' },
  { label: 'Labour & Employment',     icon: '👷', query: 'epfo pf eshram esic ncs job portal apprenticeship shram yogi' },
  { label: 'Education',               icon: '🎓', query: 'scholarship nsp jee neet ugc swayam udise skill samarth' },
  { label: 'Business & MSME',         icon: '🏢', query: 'msme udyam startup india gem company incorporation mudra pmegp' },
  { label: 'Banking & Finance',       icon: '🏦', query: 'jan dhan pmjdy post office ppf pmsby pmjjby aeps cersai' },
  { label: 'Electoral',               icon: '🗳️', query: 'voter id epic card election registration eci' },
  { label: 'Pension & Retirement',    icon: '👴', query: 'nps national pension pran nsap old age widow pension pmvvy' },
  { label: 'Digital Services & IT',   icon: '📱', query: 'digilocker umang bhim upi digital payment e-procurement data portal' },
  { label: 'Food & Civil Supplies',   icon: '🍚', query: 'ration card nfsa pds one nation one ration card onorc' },
  { label: 'Energy',                  icon: '⚡', query: 'lpg ujjwala gas connection saubhagya electricity pm kusum solar' },
  { label: 'Water & Sanitation',      icon: '💧', query: 'jal jeevan mission tap water swachh bharat toilet ihhl phed' },
  { label: 'Rural Development',       icon: '🌱', query: 'mgnrega nrega job card pmgsy gram sadak egram swaraj aajeevika shg' },
  { label: 'Women & Child Dev',       icon: '👩', query: 'pmmvy maternity anganwadi icds sukanya samriddhi beti bachao cara adoption' },
  { label: 'Skill Development',       icon: '🛠️', query: 'pmkvy skill india digital training vocational nsdc certification' },
  { label: 'Government Recruitment',  icon: '📝', query: 'upsc civil services ssc cgl ibps bank rrb railway agniveer agnipath' },
  { label: 'Legal & Judiciary',       icon: '⚖️', query: 'supreme court ecourts nalsa legal aid lok adalat consumer complaint rti sarfaesi' },
  { label: 'Governance',              icon: '🏗️', query: 'cpgrams grievance mygov rti pfms dbt gati shakti niti aayog' },
  { label: 'Commerce & Trade',        icon: '🌐', query: 'apeda mpeda invest india fdi bis hallmark weights measures iec dgft' },
  { label: 'Railways & Aviation',     icon: '✈️', query: 'irctc train ticket rail madad dgca pilot digi yatra airport' },
  { label: 'Posts & Telecom',         icon: '📮', query: 'india post speed post mnp mobile portability trai spam dnd' },
  { label: 'Science & Technology',    icon: '🔬', query: 'isro space csir technology transfer imd weather ndma disaster' },
  { label: 'Environment & Climate',   icon: '🌿', query: 'cpcb pollution forest clearance parivesh environmental ngt green' },
];

export default function CategoriesSection() {
  const { runSearch } = useSearchStore();

  const handleClick = (query: string) => {
    runSearch(query);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[var(--clr-navy)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Browse by Category
        </h2>
        <p className="text-[var(--clr-muted)] text-sm">
          Select any category to explore all related government services
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {CATEGORIES.map(({ label, icon, query }) => (
          <button
            key={label}
            onClick={() => handleClick(query)}
            className="group flex flex-col items-center gap-2 p-3.5 bg-white border border-[var(--clr-border)] rounded-2xl hover:border-[var(--clr-saffron)] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200 leading-none">
              {icon}
            </span>
            <span className="text-[11px] font-semibold text-[var(--clr-navy)] leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
