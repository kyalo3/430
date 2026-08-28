import api from '../../lib/api';

/** County / service-area picker backed by /platform/reference/service-areas */
export function CountyField({
  id = 'ss-counties',
  value,
  onChange,
  areas = [],
  required = false,
  normalize = true,
  className = 'rounded-lg border border-emerald-200 px-3 py-2 text-sm',
  placeholder = 'County or approximate area (not exact address)',
}) {
  const onBlur = async () => {
    if (!normalize || !value || !String(value).trim()) return;
    try {
      const res = await api.post('/platform/reference/normalize-place', { query: value });
      const canonical = res.data?.canonical?.name;
      if (canonical && canonical !== value) onChange(canonical);
    } catch (_) {
      /* keep free text — matching still works */
    }
  };

  return (
    <>
      <input
        list={id}
        required={required}
        className={className}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete="off"
      />
      <datalist id={id}>
        {areas.map((area) => (
          <option key={area.id} value={area.name} />
        ))}
      </datalist>
    </>
  );
}

/** Food category select backed by Open Food Facts–aligned taxonomy */
export function CategorySelect({
  value,
  onChange,
  categories = [],
  className = 'rounded-lg border border-emerald-200 px-3 py-2 text-sm',
  includeEmpty = false,
  emptyLabel = 'Any category',
}) {
  return (
    <select className={className} value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.label}
        </option>
      ))}
    </select>
  );
}

/**
 * World Bank / SDG national context card.
 * Never present this as Sustainashare verified impact.
 */
export function SdgContextCard({ sdg, onSync, syncing, compact }) {
  if (!sdg) {
    return <p className="text-sm text-emerald-800/70">Loading official context…</p>;
  }

  return (
    <article className={`rounded-2xl border border-emerald-100 bg-white ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">SDG 2 context</p>
          <h2 className={`font-display font-semibold text-emerald-950 ${compact ? 'text-lg' : 'text-xl'}`}>
            Official national undernourishment
          </h2>
          <p className="mt-1 text-sm text-emerald-800/75">
            World Bank figure for Kenya. Not a Sustainashare impact counter — verified fulfilments stay separate.
          </p>
        </div>
        {onSync && (
          <button
            type="button"
            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
            onClick={onSync}
            disabled={syncing}
          >
            {syncing ? 'Syncing…' : 'Sync official data'}
          </button>
        )}
      </div>
      {sdg.available ? (
        <p className="mt-4 text-sm text-emerald-950">
          Kenya undernourishment: <strong>{sdg.value}%</strong> ({sdg.year}
          {sdg.stale ? ', cached snapshot' : ''})
        </p>
      ) : (
        <p className="mt-4 text-sm text-emerald-800/70">
          {sdg.reason || 'Official context unavailable. Platform journeys still work without it.'}
        </p>
      )}
    </article>
  );
}

/** Short strip explaining which reference datasets power forms */
export function ReferenceSourceNote({ catalog = [] }) {
  const live = catalog.filter((d) => d.status === 'now');
  if (!live.length) return null;
  return (
    <p className="text-xs text-emerald-800/65">
      Areas and categories come from public reference data ({live.map((d) => d.name.split('(')[0].trim()).join(' · ')}
      ). Exact addresses are never required here.
    </p>
  );
}
