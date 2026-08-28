import { formatWhen } from '../../lib/dashboardData';

/** Recent notifications or lightweight activity rows */
export default function ActivityFeed({ title = 'Recent activity', items = [], empty = 'No recent activity.' }) {
  return (
    <div>
      {title && <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">{title}</p>}
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-emerald-100 bg-emerald-50/40 px-3 py-3 text-sm text-emerald-800/70">
          {empty}
        </p>
      ) : (
        <ul className="divide-y divide-emerald-50 rounded-xl border border-emerald-100 bg-white">
          {items.map((item) => (
            <li key={item.id || `${item.title}-${item.created_at}`} className="px-3 py-2.5 sm:px-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-950">{item.title}</p>
                  {item.body && <p className="mt-0.5 text-xs leading-relaxed text-emerald-800/75">{item.body}</p>}
                </div>
                <time className="shrink-0 text-[11px] text-emerald-700/70">{formatWhen(item.created_at || item.at)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
