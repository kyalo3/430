/**
 * Simple section frame — no photo banners (they steal space on mobile).
 */
export default function DashboardSection({
  title,
  description,
  media: _media,
  children,
  className = '',
  tone = 'default',
}) {
  const tones = {
    default: 'border-emerald-100 bg-white',
    soft: 'border-emerald-100 bg-white',
    impact: 'border-emerald-100 bg-white',
  };

  return (
    <section
      className={`mt-4 rounded-2xl border p-4 sm:mt-5 sm:p-5 ${tones[tone] || tones.default} ${className}`}
    >
      {(title || description) && (
        <div className="mb-3 max-w-3xl sm:mb-4">
          {title && <h2 className="font-display text-lg font-semibold text-emerald-950 sm:text-xl">{title}</h2>}
          {description && <div className="mt-1 text-sm leading-relaxed text-emerald-800/75">{description}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
