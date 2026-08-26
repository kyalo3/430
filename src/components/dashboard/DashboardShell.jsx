import { useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';

export default function DashboardShell({ roleLabel, children, extraNav }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#eef5f0]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2">
            {extraNav}
            <span className="hidden text-sm text-emerald-800 sm:inline">{roleLabel}</span>
            <button
              type="button"
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
