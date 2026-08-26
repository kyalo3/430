export default function OnboardingChecklist({ role, items, nextAction }) {
  const done = items.filter((i) => i.done).length;
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm" aria-labelledby="onboarding-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Get started</p>
          <h2 id="onboarding-heading" className="font-display text-xl font-semibold text-emerald-950">
            Your next-best action
          </h2>
          <p className="mt-1 text-sm text-emerald-800/80">
            {done}/{items.length} steps complete · {role} journey
          </p>
        </div>
        {nextAction}
      </div>
      <ol className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                item.done ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
              }`}
              aria-hidden="true"
            >
              {item.done ? '✓' : '·'}
            </span>
            <span>
              <span className={`font-semibold ${item.done ? 'text-emerald-800' : 'text-emerald-950'}`}>{item.title}</span>
              <span className="block text-emerald-800/70">{item.why}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
