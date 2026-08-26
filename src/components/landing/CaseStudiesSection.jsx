import { MEDIA } from '../../constants/media';

const JOURNEYS = [
  {
    title: 'Hospitality surplus → community pantry',
    summary:
      'A kitchen lists same-day surplus produce. After review, the listing becomes available, a nearby need is matched, a volunteer completes pickup, and the recipient confirms receipt.',
    outcomes: ['Less avoidable waste', 'Faster access to food', 'Verified handover record'],
    tag: 'Donor → Volunteer → Recipient',
    image: MEDIA.kitchen,
  },
  {
    title: 'Household need → matched donation',
    summary:
      'A recipient submits a need with only the information required for matching. Suitable listings appear with reasons (category, quantity, area). Exact address stays private until authorised.',
    outcomes: ['Dignity-preserving matching', 'Explainable suggestions', 'Admin oversight when needed'],
    tag: 'Recipient → Match → Confirm',
    image: MEDIA.community,
  },
  {
    title: 'Volunteer corridor in a service area',
    summary:
      'Volunteers set availability and capacity, accept eligible tasks, confirm pickup and delivery, and build a contribution history without exposing unrelated personal data.',
    outcomes: ['Clear assignments', 'Safer logistics', 'Repeat participation'],
    tag: 'Volunteer fulfilment',
    image: MEDIA.volunteers,
  },
];

export default function CaseStudiesSection({ onCta }) {
  return (
    <section id="journeys" className="scroll-mt-24 py-20 sm:py-24 bg-white" aria-labelledby="journeys-heading">
      <div className="container mx-auto px-6 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 mb-3">Case studies</p>
        <h2 id="journeys-heading" className="font-display text-3xl md:text-5xl font-semibold text-emerald-950 mb-4 max-w-2xl">
          Example redistribution journeys
        </h2>
        <p className="text-emerald-800/80 mb-12 max-w-2xl text-lg">
          Patterned journeys Sustainashare is designed to support — not invented client metrics.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {JOURNEYS.map((j) => (
            <article
              key={j.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-[#f7faf8] shadow-sm"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={j.image.src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: j.image.objectPosition }}
                  loading="lazy"
                />
                <p className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                  {j.tag}
                </p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold text-emerald-950 mb-3">{j.title}</h3>
                <p className="text-sm text-emerald-900/80 leading-relaxed flex-1">{j.summary}</p>
                <ul className="mt-5 space-y-2">
                  {j.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-emerald-900">
                      <i className="fas fa-check text-emerald-600 mt-1" aria-hidden="true" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onCta}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
          >
            Start your journey
          </button>
        </div>
      </div>
    </section>
  );
}
