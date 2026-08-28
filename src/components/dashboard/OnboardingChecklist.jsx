export default function OnboardingChecklist({ role, items, nextAction }) {
  const done = items.filter((i) => i.done).length;
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5" aria-labelledby="onboarding-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Get started</p>
          <h2 id="onboarding-heading" className="font-display text-lg font-semibold text-emerald-950 sm:text-xl">
            Your next-best action
          </h2>
          <p className="mt-1 text-sm text-emerald-800/80">
            {done}/{items.length} steps complete · {role} journey
          </p>
        </div>
        {nextAction && <div className="shrink-0">{nextAction}</div>}
      </div>
      <ol className="mt-3 space-y-2.5 sm:mt-4">
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
            <span className="min-w-0">
              <span className={`font-semibold ${item.done ? 'text-emerald-800' : 'text-emerald-950'}`}>{item.title}</span>
              <span className="block text-emerald-800/70">{item.why}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
