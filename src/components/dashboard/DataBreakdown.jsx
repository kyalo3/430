import { formatStatus } from '../../lib/donationStates';
import { topEntries } from '../../lib/dashboardData';

/** Compact status / category chips from a count map */
export default function DataBreakdown({ title, counts = {}, empty = 'No data yet.' }) {
  const entries = topEntries(counts, 8);
  if (!entries.length) {
    return (
      <div className="rounded-xl border border-dashed border-emerald-100 bg-emerald-50/40 px-3 py-3 text-sm text-emerald-800/70">
        {empty}
      </div>
    );
  }
  return (
    <div>
      {title && <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">{title}</p>}
      <ul className="flex flex-wrap gap-2">
        {entries.map(([key, value]) => (
          <li
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-950"
          >
            <span className="capitalize">{formatStatus(key)}</span>
            <span className="rounded-full bg-white px-1.5 py-0.5 text-emerald-800">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
