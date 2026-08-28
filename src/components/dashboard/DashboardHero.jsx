import { DASHBOARD_VISUALS } from '../../constants/media';

/**
 * Compact page header — readable on phones first.
 * One optional thumbnail; no full-bleed overlays or mood strips.
 */
export default function DashboardHero({
  role = 'donor',
  eyebrow,
  title,
  subtitle,
  children,
}) {
  const visual = DASHBOARD_VISUALS[role] || DASHBOARD_VISUALS.donor;
  const media = visual.hero;

  return (
    <header className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50 sm:h-16 sm:w-16"
          aria-hidden="true"
        >
          <img
            src={media.src}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: media.objectPosition }}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">{eyebrow}</p>
          <h1 className="mt-0.5 font-display text-2xl font-semibold leading-tight text-emerald-950 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm leading-relaxed text-emerald-800/80">{subtitle}</p>
          )}
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </header>
  );
}
