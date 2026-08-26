/**
 * Illustrative journey voices — clearly labeled so we do not claim unverified testimonials.
 */
const VOICES = [
  {
    role: 'Donor perspective',
    quote:
      'I need a simple way to list surplus before it expires, know it reached someone, and keep a receipt of what was confirmed — without turning giving into a shop.',
    focus: 'Traceability & trust',
  },
  {
    role: 'Recipient perspective',
    quote:
      'I want reliable access to appropriate resources without my private circumstances being displayed publicly or ranked against other people.',
    focus: 'Dignity & privacy',
  },
  {
    role: 'Volunteer perspective',
    quote:
      'Clear task details after I accept, a defined pickup window, and a way to confirm handover make volunteering feel safe and useful.',
    focus: 'Safe logistics',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="voices" className="scroll-mt-24 py-20 bg-emerald-50" aria-labelledby="voices-heading">
      <div className="container mx-auto px-4">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 mb-3">Voices</p>
        <h2 id="voices-heading" className="font-display text-3xl md:text-5xl font-semibold text-emerald-950 mb-4 max-w-2xl">
          What each role needs from the journey
        </h2>
        <p className="text-emerald-800/80 mb-10 max-w-2xl text-lg">
          Illustrative journey voices based on Sustainashare’s intended experience. We do not publish invented
          customer names or unverified impact quotes.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {VOICES.map((v) => (
            <figure
              key={v.role}
              className="rounded-2xl bg-white border border-emerald-100 p-6 shadow-sm"
            >
              <figcaption className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{v.focus}</p>
                <p className="mt-1 font-semibold text-emerald-950">{v.role}</p>
              </figcaption>
              <blockquote className="text-emerald-900/85 leading-relaxed">“{v.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
