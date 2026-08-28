import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbars/AuthNavbar.jsx';
import Footer from '../components/Footers/Footer.jsx';
import { AuthModal } from '../components/Popups/AuthModal.jsx';
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx';
import CaseStudiesSection from '../components/landing/CaseStudiesSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';
import ClosingSection from '../components/landing/ClosingSection.jsx';
import StickyMobileCta from '../components/landing/StickyMobileCta.jsx';
import { MEDIA } from '../constants/media';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';

const ROLES = [
  {
    title: 'Donate resources',
    body: 'List surplus with condition, quantity, and collection windows. Track matching through to confirmed impact.',
    action: 'register',
    image: MEDIA.pantry,
  },
  {
    title: 'Request support',
    body: 'Share a need privately. See suitable matches with clear reasons — without public recipient profiles.',
    action: 'register',
    image: MEDIA.community,
  },
  {
    title: 'Volunteer',
    body: 'Accept logistics tasks in your area and confirm handovers with a verified contribution record.',
    action: 'register',
    image: MEDIA.volunteers,
  },
  {
    title: 'Partner with us',
    body: 'Organisations can participate with governance, bulk listings, and accountable impact reporting.',
    action: 'register',
    image: MEDIA.kitchen,
  },
];

export default function Landing({ isOpen, popupType, togglePopup }) {
  const [impact, setImpact] = useState(null);
  const [coverage, setCoverage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    track(EVENTS.choose_view_landing);
    api
      .get('/impact/summary')
      .then((res) => setImpact(res.data))
      .catch(() => setImpact({ empty: true, verified_fulfilments: 0 }));
    api
      .get('/platform/reference/service-areas')
      .then((res) => setCoverage({ count: res.data?.count || 0 }))
      .catch(() => setCoverage(null));
  }, []);

  return (
    <>
      <Navbar togglePopup={togglePopup} />
      <main className="pt-16 pb-24 md:pb-0">
        {/* Hero — full-bleed atmosphere, readable without crushing the photo */}
        <section className="relative min-h-[92vh] flex items-end sm:items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src={MEDIA.hero.src}
              alt=""
              className="hero-kenburns h-full w-full object-cover"
              style={{ objectPosition: MEDIA.hero.objectPosition }}
              fetchPriority="high"
            />
          </div>
          {/* Directional veil: strong on left for type, open on right so produce stays vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/55 to-emerald-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-emerald-950/30" />

          <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-10 py-24 sm:py-28">
            <div className="max-w-xl lg:max-w-2xl">
              <p className="hero-fade-in font-display text-emerald-200 text-lg sm:text-xl font-semibold mb-4">
                Sustainashare
              </p>
              <h1 className="hero-fade-in-delay font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.08]">
                Turn surplus into verified community support
              </h1>
              <p className="hero-fade-in-delay-2 mt-6 text-base sm:text-lg text-emerald-50/95 max-w-lg leading-relaxed">
                List usable resources, match legitimate needs, complete safe handovers, and count only confirmed impact.
              </p>
              <div className="hero-fade-in-delay-2 mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => togglePopup('register')}
                  className="rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
                >
                  Get started free
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/50 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  See how it works
                </a>
              </div>
              <p className="hero-fade-in-delay-2 mt-7 text-sm text-emerald-100/85 max-w-md">
                {impact?.empty || !impact?.verified_fulfilments ? (
                  <>Verified impact appears after the first confirmed fulfilment — we never invent counters.</>
                ) : (
                  <>
                    {impact.verified_fulfilments} verified fulfilments · {impact.quantity_redistributed} units
                    redistributed
                  </>
                )}
              </p>
            </div>
          </div>

          <a
            href="#participate"
            className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-white/80 hover:text-white sm:inline-flex flex-col items-center gap-1 text-xs font-semibold tracking-wide"
          >
            Explore
            <i className="fas fa-chevron-down animate-bounce" aria-hidden="true" />
          </a>

          <AuthModal isOpen={isOpen} togglePopup={togglePopup} popupType={popupType} />
        </section>

        {/* Trust strip with visual rhythm */}
        <section
          className="relative z-10 -mt-8 sm:-mt-10 mx-4 sm:mx-auto sm:max-w-5xl rounded-2xl border border-emerald-100/80 bg-white/95 backdrop-blur shadow-xl shadow-emerald-950/10 py-6 px-5 sm:px-8"
          aria-label="Trust principles"
        >
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Privacy by design', body: 'Sensitive needs stay off public pages.' },
              {
                title: 'Service areas ready',
                body: coverage?.count
                  ? `${coverage.count} Kenya counties available for approximate matching.`
                  : 'County-level matching without exact public addresses.',
              },
              { title: 'Honest impact', body: 'Only recipient-confirmed journeys count.' },
            ].map((item) => (
              <div key={item.title} className="text-center sm:text-left">
                <p className="font-display text-lg font-semibold text-emerald-950">{item.title}</p>
                <p className="mt-1 text-sm text-emerald-800/75">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Role CTAs with photography */}
        <section id="participate" className="scroll-mt-24 py-20 sm:py-24 bg-[#f3f7f4]" aria-labelledby="participate-heading">
          <div className="container mx-auto px-6 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 mb-3">Participate</p>
            <h2 id="participate-heading" className="font-display text-3xl md:text-5xl font-semibold text-emerald-950 mb-4 max-w-2xl">
              Choose how you contribute
            </h2>
            <p className="text-emerald-800/80 mb-12 max-w-2xl text-lg">
              One platform, four ways in — each route strengthens the same redistribution journey.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {ROLES.map((role) => (
                <button
                  key={role.title}
                  type="button"
                  onClick={() => togglePopup(role.action)}
                  className="group relative overflow-hidden rounded-3xl text-left min-h-[220px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  <img
                    src={role.image.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: role.image.objectPosition }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/45 to-emerald-950/10" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                    <h3 className="font-display text-2xl font-semibold text-white">{role.title}</h3>
                    <p className="mt-2 text-sm text-emerald-50/90 leading-relaxed max-w-md">{role.body}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-300">
                      Continue <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />

        {/* Product proof with real photo */}
        <section className="py-20 sm:py-24 bg-emerald-950 text-white overflow-hidden" aria-labelledby="product-heading">
          <div className="container mx-auto px-6 sm:px-8 grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-300 mb-3">Why Sustainashare</p>
              <h2 id="product-heading" className="font-display text-3xl md:text-5xl font-semibold mb-5 leading-tight">
                Built for trusted redistribution — not retail noise
              </h2>
              <p className="text-emerald-100/90 leading-relaxed mb-7 text-lg">
                Surplus and unmet need often exist side by side. Sustainashare closes the coordination gap with
                verification, matching, logistics, confirmation, and accountable reporting.
              </p>
              <ul className="space-y-3 text-sm text-emerald-50">
                <li className="flex gap-3">
                  <i className="fas fa-shield-alt text-orange-300 mt-0.5" aria-hidden="true" />
                  Role-based access with backend enforcement
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-route text-orange-300 mt-0.5" aria-hidden="true" />
                  Explicit donation and need lifecycles
                </li>
                <li className="flex gap-3">
                  <i className="fas fa-balance-scale text-orange-300 mt-0.5" aria-hidden="true" />
                  Explainable matching before any automation claims
                </li>
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-emerald-950 hover:bg-emerald-50"
                >
                  Browse surplus categories
                </Link>
                <Link
                  to="/guidance"
                  className="rounded-xl border border-white/35 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/10"
                >
                  Safety guidance
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/20 blur-2xl" aria-hidden="true" />
              <figure className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl">
                <img
                  src={MEDIA.handover.src}
                  alt={MEDIA.handover.alt}
                  className="h-[420px] w-full object-cover"
                  style={{ objectPosition: MEDIA.handover.objectPosition }}
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/90 to-transparent p-6 text-sm text-emerald-50">
                  Coordination across donors, recipients, and volunteers — with privacy as a product requirement.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <CaseStudiesSection onCta={() => togglePopup('register')} />
        <TestimonialsSection />
        <ClosingSection onJoin={() => togglePopup('register')} />
      </main>

      <Footer />
      <StickyMobileCta
        onPrimary={() => togglePopup('register')}
        onSecondary={() => togglePopup('login')}
      />
    </>
  );
}
