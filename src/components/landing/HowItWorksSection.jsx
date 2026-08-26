const STEPS = [
  {
    title: 'Join with a role',
    body: 'Register as a donor, recipient, or volunteer. Share only what is needed to participate safely.',
    icon: 'fa-user-plus',
  },
  {
    title: 'List or request',
    body: 'Donors submit surplus with condition and windows. Recipients capture needs without public exposure.',
    icon: 'fa-box-open',
  },
  {
    title: 'Match & hand over',
    body: 'Transparent matching, optional volunteer logistics, and confirmation when resources arrive.',
    icon: 'fa-hands-helping',
  },
  {
    title: 'Measure what is real',
    body: 'Impact appears only after verified fulfilment — so trust compounds with every completed journey.',
    icon: 'fa-chart-line',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-24 bg-white" aria-labelledby="how-heading">
      <div className="container mx-auto px-6 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 mb-3">How it works</p>
        <h2 id="how-heading" className="font-display text-3xl md:text-5xl font-semibold text-emerald-950 mb-4 max-w-2xl">
          One journey from surplus to confirmed support
        </h2>
        <p className="text-emerald-800/80 mb-14 max-w-2xl text-lg">
          Sustainashare is built around a single core interaction — not a feature pile.
        </p>

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-emerald-100 bg-gradient-to-b from-[#f3f7f4] to-white p-6 shadow-sm"
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-md shadow-emerald-900/20">
                <i className={`fas ${step.icon}`} aria-hidden="true" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2">Step {index + 1}</p>
              <h3 className="font-display text-xl font-semibold text-emerald-950 mb-2">{step.title}</h3>
              <p className="text-sm text-emerald-900/80 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
