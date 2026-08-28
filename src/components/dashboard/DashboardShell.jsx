import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';
import NotificationBell from './NotificationBell';

export default function DashboardShell({ roleLabel, children, extraNav, onSignOut, wide }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const width = wide ? 'max-w-7xl' : 'max-w-6xl';

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#eef5f0]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white">
        <div className={`mx-auto flex ${width} items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3`}>
          <BrandLogo size="sm" />
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationBell />
            <span className="hidden max-w-[10rem] truncate text-sm text-emerald-800 md:inline">{roleLabel}</span>
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                onClick={() => navigate('/account/privacy')}
              >
                Privacy
              </button>
              {extraNav}
              <button
                type="button"
                className="min-h-10 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                onClick={() => navigate('/')}
              >
                Home
              </button>
              {onSignOut && (
                <button
                  type="button"
                  className="min-h-10 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                  onClick={onSignOut}
                >
                  Log out
                </button>
              )}
            </div>
            <button
              type="button"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-emerald-200 text-emerald-900 sm:hidden"
              aria-expanded={menuOpen}
              aria-controls="dashboard-mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div
            id="dashboard-mobile-menu"
            className="border-t border-emerald-100 bg-white px-3 py-3 sm:hidden"
          >
            <p className="mb-2 truncate text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {roleLabel}
            </p>
            <nav className="grid gap-1">
              <button
                type="button"
                className="min-h-11 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-emerald-950 hover:bg-emerald-50"
                onClick={() => {
                  closeMenu();
                  navigate('/account/privacy');
                }}
              >
                Privacy
              </button>
              {extraNav && (
                <div
                  className="min-h-11 [&>a]:flex [&>a]:min-h-11 [&>a]:items-center [&>a]:rounded-lg [&>a]:px-3 [&>a]:py-2.5 [&>a]:text-sm [&>a]:font-semibold [&>a]:text-emerald-950 [&>a]:hover:bg-emerald-50 [&>button]:flex [&>button]:min-h-11 [&>button]:w-full [&>button]:items-center [&>button]:rounded-lg [&>button]:px-3 [&>button]:py-2.5 [&>button]:text-left [&>button]:text-sm [&>button]:font-semibold"
                  onClick={closeMenu}
                >
                  {extraNav}
                </div>
              )}
              <button
                type="button"
                className="min-h-11 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-emerald-950 hover:bg-emerald-50"
                onClick={() => {
                  closeMenu();
                  navigate('/');
                }}
              >
                Home
              </button>
              {onSignOut && (
                <button
                  type="button"
                  className="min-h-11 rounded-lg bg-emerald-800 px-3 py-2.5 text-left text-sm font-semibold text-white"
                  onClick={() => {
                    closeMenu();
                    onSignOut();
                  }}
                >
                  Log out
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      <main className={`mx-auto ${width} px-3 py-4 sm:px-6 sm:py-6`}>{children}</main>
    </div>
  );
}
