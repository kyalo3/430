import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import DashboardShell from '../components/dashboard/DashboardShell';

export default function AccountPrivacy() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get('/platform/privacy-notice')
      .then((res) => setNotice(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const exportData = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.get('/platform/me/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sustainashare-export-${currentUser?.username || 'account'}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus('Export downloaded. Review it privately — it contains your operational records.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveConsent = async (purpose, granted) => {
    setError('');
    try {
      await api.post('/platform/consent', { purpose, granted });
      setStatus(granted ? `Consent recorded for ${purpose.replaceAll('_', ' ')}.` : `Consent withdrawn for ${purpose.replaceAll('_', ' ')}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const anonymise = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/platform/me/delete-request', { confirmation });
      await signOut();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <DashboardShell
      roleLabel={`${currentUser?.username || ''} · ${currentUser?.role || ''}`}
      onSignOut={async () => {
        await signOut();
        navigate('/');
      }}
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Better Data Deal</p>
      <h1 className="font-display text-3xl font-semibold text-emerald-950">Privacy and account data</h1>
      <p className="mt-2 max-w-2xl text-sm text-emerald-800/80">
        We collect data to verify participants, match surplus to needs, complete handovers, and report confirmed
        impact. We do not publish recipient profiles or rank people by deservingness.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {status && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800" role="status">
          {status}
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Why we ask</h2>
        {notice ? (
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Purposes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/85">
                {(notice.purposes || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">What we do not do</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/85">
                {(notice.not_done || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-emerald-800/70">Loading privacy notice…</p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Optional publication consent</h2>
        <p className="mt-1 text-sm text-emerald-800/75">
          Impact stories, photographs, or names are never published unless you opt in. Operational matching does not
          use this consent.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" onClick={() => saveConsent('impact_story', true)}>
            Allow impact story
          </button>
          <button type="button" className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900" onClick={() => saveConsent('impact_story', false)}>
            Withdraw story consent
          </button>
          <button type="button" className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900" onClick={() => saveConsent('photograph', true)}>
            Allow photograph
          </button>
          <button type="button" className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900" onClick={() => saveConsent('photograph', false)}>
            Withdraw photograph consent
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Export your data</h2>
        <p className="mt-1 text-sm text-emerald-800/75">
          Download a JSON copy of your account, listings, needs, consents, and notifications.
        </p>
        <button
          type="button"
          disabled={busy}
          className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:bg-emerald-300"
          onClick={exportData}
        >
          Download export
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-red-100 bg-red-50/60 p-6">
        <h2 className="font-display text-xl font-semibold text-red-950">Anonymise this account</h2>
        <p className="mt-1 text-sm text-red-900/80">
          This removes personal identifiers and revokes sign-in. Verified donation records may be retained without your
          name so impact reporting stays honest. Type DELETE to confirm.
        </p>
        <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={anonymise}>
          <label className="text-sm font-semibold text-red-950">
            Confirmation
            <input
              className="mt-1 block rounded-lg border border-red-200 px-3 py-2 font-mono text-sm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={busy || confirmation.trim().toUpperCase() !== 'DELETE'}
            className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white disabled:bg-red-300"
          >
            Anonymise account
          </button>
        </form>
      </section>

      <p className="mt-6 text-sm text-emerald-800/75">
        Read community safety guidance on the{' '}
        <Link className="font-semibold text-emerald-900 underline" to="/guidance">
          guidance page
        </Link>
        .
      </p>
    </DashboardShell>
  );
}
