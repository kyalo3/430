import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo';

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#journeys', label: 'Journeys' },
  { href: '/guidance', label: 'Guidance', isRoute: true },
  { href: '/faqs', label: 'FAQs', isRoute: true },
  { href: '/shop', label: 'Browse surplus', isRoute: true },
];

export default function Navbar({ togglePopup }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setNavbarOpen(false);

  const openAuth = (type) => {
    closeMenu();
    togglePopup(type);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      aria-label="Primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <BrandLogo size="md" onClick={closeMenu} className="shrink-0" />

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-expanded={navbarOpen}
            aria-controls="primary-nav-menu"
            aria-label={navbarOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavbarOpen((v) => !v)}
          >
            <i className={`fas ${navbarOpen ? 'fa-times' : 'fa-bars'} text-lg`} aria-hidden="true" />
          </button>

          <div
            id="primary-nav-menu"
            className={`${
              navbarOpen ? 'flex' : 'hidden'
            } absolute left-0 right-0 top-16 flex-col gap-1 bg-white border-b border-emerald-100 p-4 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            <ul className="flex flex-col lg:flex-row lg:items-center gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-col gap-2 border-t border-emerald-100 pt-3 lg:mt-0 lg:ml-4 lg:flex-row lg:items-center lg:border-0 lg:pt-0">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="rounded-md px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700"
              >
                Join free
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
