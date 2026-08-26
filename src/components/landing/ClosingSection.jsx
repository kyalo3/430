import { useState } from 'react';
import { MEDIA } from '../../constants/media';

const INTERESTS = [
  { id: 'donor', label: 'Donate surplus', icon: 'fa-seedling' },
  { id: 'recipient', label: 'Request support', icon: 'fa-hand-holding-heart' },
  { id: 'volunteer', label: 'Volunteer', icon: 'fa-people-carry' },
  { id: 'partner', label: 'Partner', icon: 'fa-handshake' },
];

/**
 * Closing CTA — light, photographic, asymmetric (breaks the flat dark-green footer stack).
 */
export default function ClosingSection({ onJoin }) {
  const [interest, setInterest] = useState('donor');
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="scroll-mt-24 relative overflow-hidden bg-[#eef5f0] py-16 sm:py-24"
      aria-labelledby="cta-heading"
    >
      {/* Soft organic blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-6 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_30px_80px_-40px_rgba(15,61,46,0.45)] lg:grid lg:grid-cols-12">
          {/* Photo rail */}
          <div className="relative min-h-[280px] lg:col-span-5 lg:min-h-full">
            <img
              src={MEDIA.volunteers.src}
              alt={MEDIA.volunteers.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: MEDIA.volunteers.objectPosition }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <p className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                Your next verified handover starts with one conversation.
              </p>
              <p className="mt-3 text-sm text-emerald-100/85 max-w-sm">
                No invented counters. No public recipient profiles. Just a clear path from surplus to confirmed
                support.
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600 mb-3">Get involved</p>
            <h2 id="cta-heading" className="font-display text-3xl sm:text-4xl font-semibold text-emerald-950 mb-3">
              Ready when you are
            </h2>
            <p className="text-emerald-800/80 mb-8 max-w-xl">
              Create an account in minutes — or leave a note and we&apos;ll help you choose the right role.
            </p>

            <div className="mb-6" role="group" aria-label="I want to">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-3">I want to</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((item) => {
                  const active = interest === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInterest(item.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                          : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      <i className={`fas ${item.icon} text-xs`} aria-hidden="true" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {sent ? (
              <div
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-emerald-900"
              >
                <p className="font-display text-xl font-semibold">Thanks — next step is your account.</p>
                <p className="mt-2 text-sm text-emerald-800/80">
                  We&apos;ll open registration so you can join as a{' '}
                  {INTERESTS.find((i) => i.id === interest)?.label.toLowerCase()}.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                  onClick={onJoin}
                >
                  Continue to join
                </button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  // Guide into registration after a beat of confirmation
                  setTimeout(() => onJoin(), 600);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="closing-name" className="block text-xs font-bold uppercase tracking-wide text-emerald-800 mb-1">
                      Full name
                    </label>
                    <input
                      id="closing-name"
                      name="name"
                      required
                      autoComplete="name"
                      className="w-full rounded-2xl border border-emerald-200 bg-[#f7fbf8] px-4 py-3.5 text-sm text-emerald-950 shadow-inner focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
                      placeholder="Alex Mwangi"
                    />
                  </div>
                  <div>
                    <label htmlFor="closing-email" className="block text-xs font-bold uppercase tracking-wide text-emerald-800 mb-1">
                      Email
                    </label>
                    <input
                      id="closing-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full rounded-2xl border border-emerald-200 bg-[#f7fbf8] px-4 py-3.5 text-sm text-emerald-950 shadow-inner focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
                      placeholder="you@organisation.org"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="closing-message" className="block text-xs font-bold uppercase tracking-wide text-emerald-800 mb-1">
                    Anything we should know?
                  </label>
                  <textarea
                    id="closing-message"
                    name="message"
                    rows={3}
                    className="w-full rounded-2xl border border-emerald-200 bg-[#f7fbf8] px-4 py-3.5 text-sm text-emerald-950 shadow-inner focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
                    placeholder="Optional — location, organisation, or the kind of surplus you move."
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                  <button
                    type="submit"
                    className="rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                  >
                    Send &amp; create account
                  </button>
                  <button
                    type="button"
                    onClick={onJoin}
                    className="rounded-2xl border border-emerald-200 bg-white px-6 py-3.5 text-sm font-bold text-emerald-900 hover:bg-emerald-50"
                  >
                    Skip — join now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
