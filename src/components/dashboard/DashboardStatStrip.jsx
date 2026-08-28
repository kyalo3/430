/** Compact metric strip — 2 columns on phones, 4 on wide screens */
export default function DashboardStatStrip({ items }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <article
          key={label}
          className="rounded-xl border border-emerald-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5"
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 sm:text-xs">{label}</p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-emerald-950 sm:text-3xl">{value}</p>
        </article>
      ))}
    </div>
  );
}
