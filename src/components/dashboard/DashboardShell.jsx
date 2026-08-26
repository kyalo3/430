import { useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';
import NotificationBell from './NotificationBell';

export default function DashboardShell({ roleLabel, children, extraNav, onSignOut, wide }) {
  const navigate = useNavigate();
  const width = wide ? 'max-w-7xl' : 'max-w-6xl';
  return (
    <div className="min-h-screen bg-[#eef5f0]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className={`mx-auto flex ${width} items-center justify-between gap-3 px-4 py-3 sm:px-6`}>
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              onClick={() => navigate('/account/privacy')}
            >
              Privacy
            </button>
            {extraNav}
            <span className="hidden text-sm text-emerald-800 sm:inline">{roleLabel}</span>
            <button
              type="button"
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              onClick={() => navigate('/')}
            >
              Home
            </button>
            {onSignOut && (
              <button
                type="button"
                className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                onClick={onSignOut}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className={`mx-auto ${width} px-4 py-8 sm:px-6`}>{children}</main>
    </div>
  );
}
