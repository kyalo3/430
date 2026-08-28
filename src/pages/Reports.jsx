import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import BrandLogo from '../components/BrandLogo';
import { useReferenceData } from '../hooks/useReferenceData';
import { SdgContextCard } from '../components/dashboard/ReferenceFields';

function toRows(data) {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    if (row && typeof row === 'object') {
      const copy = { ...row };
      delete copy.password;
      Object.keys(copy).forEach((key) => {
        const val = copy[key];
        if (val && typeof val === 'object') copy[key] = JSON.stringify(val);
      });
      return copy;
    }
    return { value: String(row) };
  });
}

function downloadCSV(data, filename) {
  const rows = toRows(data);
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map((row) => keys.map((k) => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportTable({ rows, empty }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-emerald-800/70">{empty}</p>;
  const keys = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key} className="px-2 py-2 text-left font-semibold uppercase tracking-wide text-emerald-700">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 25).map((row, idx) => (
            <tr key={idx} className="border-t border-emerald-50">
              {keys.map((key) => (
                <td key={key} className="max-w-xs truncate px-2 py-2 text-emerald-950">
                  {String(row[key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { sdg, refreshSdg } = useReferenceData({ includeSdg: true });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [users, donations, reviews, impact] = await Promise.all([
        api.get('/users/'),
        api.get('/admin/donations'),
        api.get('/reviews/').catch(() => ({ data: [] })),
        api.get('/impact/admin').catch(() => ({ data: { count: 0, items: [] } })),
      ]);
      setReportData({
        users: toRows(users.data),
        donations: toRows(donations.data),
        reviews: toRows(reviews.data),
        impactCount: impact.data?.count || 0,
      });
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const syncOfficial = async () => {
    setSyncing(true);
    try {
      await api.post('/platform/reference/sync');
      await refreshSdg();
    } catch (err) {
      setError(err.message || 'Unable to refresh official context');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#eef5f0]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2">
            <Link to="/dashboard/admin" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
              Admin console
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Reports</p>
            <h1 className="font-display text-3xl font-semibold text-emerald-950">Operational reports</h1>
            <p className="mt-2 text-sm text-emerald-800/80">Live extracts. Empty tables mean no records yet — not sample data.</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            onClick={fetchReport}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        {loading && !reportData ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-12 text-center text-emerald-800">Loading reports…</div>
        ) : reportData ? (
          <div className="space-y-6">
            <SdgContextCard sdg={sdg} onSync={syncOfficial} syncing={syncing} />

            <section className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-emerald-950">Summary</h2>
              <ul className="mt-3 grid gap-2 text-sm text-emerald-900 sm:grid-cols-2">
                <li>Users: {reportData.users.length}</li>
                <li>Donations: {reportData.donations.length}</li>
                <li>Reviews: {reportData.reviews.length}</li>
                <li>Verified impact records: {reportData.impactCount}</li>
              </ul>
            </section>

            {[
              ['Donations', reportData.donations, 'donations_report.csv', 'No donations yet.'],
              ['Users', reportData.users, 'users_report.csv', 'No users yet.'],
              ['Reviews', reportData.reviews, 'reviews_report.csv', 'No reviews yet.'],
            ].map(([title, rows, file, empty]) => (
              <section key={title} className="rounded-2xl border border-emerald-100 bg-white p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold text-emerald-950">{title}</h2>
                  {rows.length > 0 && (
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900"
                      onClick={() => downloadCSV(rows, file)}
                    >
                      Download CSV
                    </button>
                  )}
                </div>
                <ReportTable rows={rows} empty={empty} />
              </section>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
