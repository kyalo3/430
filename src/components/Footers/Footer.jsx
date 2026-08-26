import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo';

export default function Footer() {
  return (
    <footer className="relative bg-[#071a14] text-emerald-50 border-t border-white/5">
      <div className="container mx-auto px-6 sm:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr] items-start">
          <div>
            <BrandLogo onDark size="lg" />
            <p className="mt-4 text-sm text-emerald-100/65 max-w-sm leading-relaxed">
              Trusted resource redistribution with verification, matching, safe handovers, and honest impact
              measurement.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-300/90 mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="text-emerald-50/90 hover:text-orange-300" href="/#how-it-works">
                  How it works
                </a>
              </li>
              <li>
                <a className="text-emerald-50/90 hover:text-orange-300" href="/#journeys">
                  Journeys
                </a>
              </li>
              <li>
                <Link className="text-emerald-50/90 hover:text-orange-300" to="/faqs">
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="text-emerald-50/90 hover:text-orange-300" to="/shop">
                  Browse surplus
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-300/90 mb-4">Trust</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="text-emerald-50/90 hover:text-orange-300" href="/#voices">
                  Journey voices
                </a>
              </li>
              <li>
                <a className="text-emerald-50/90 hover:text-orange-300" href="/#contact">
                  Contact
                </a>
              </li>
              <li>
                <span className="text-emerald-200/50">Privacy-first by design</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-emerald-200/55">
            © {new Date().getFullYear()} Sustainashare. Verified impact only — no invented counters.
          </p>
          <p className="text-xs text-emerald-200/40">Built for communities that refuse to waste what still can nourish.</p>
        </div>
      </div>
    </footer>
  );
}
