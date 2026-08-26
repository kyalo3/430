import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';
import DashboardShell from '../components/dashboard/DashboardShell';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';
import StatusPill from '../components/dashboard/StatusPill';

export default function RecipientDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [needForm, setNeedForm] = useState({ item: '', quantity: 1, urgency: 'normal', approx_location: '' });
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [matchMeta, setMatchMeta] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [avail, claimed, reqs, me] = await Promise.all([
        api.get('/donations/', { params: { status_filter: 'available' } }),
        api.get('/donations/', { params: { mine: true } }),
        api.get('/donation-requests/').catch(() => ({ data: [] })),
        api.get('/recipients/').catch(() => ({ data: null })),
      ]);
      setAvailable(avail.data || []);
      setMine(claimed.data || []);
      setNeeds(reqs.data || []);
      setProfile(me.data);
      const firstNeed = (reqs.data || [])[0];
      if (firstNeed?.id) {
        const ranked = await api.post('/matching/suggest', { need_id: firstNeed.id }).catch(() => ({ data: { results: [] } }));
        setSuggestions(ranked.data?.results || []);
        setMatchMeta({ engine: ranked.data?.engine, explanation: ranked.data?.explanation });
      } else {
        setSuggestions([]);
        setMatchMeta(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to load your needs');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const claim = async (id) => {
    setBusy(id);
    try {
      await api.post(`/donations/${id}/claim`, { reasons: ['Suitable category and quantity'] });
      track(EVENTS.use_claim, { donation_id: id });
      setNotice('Listing matched to you. A volunteer can now accept the handover. Your details stay off public pages.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const confirm = async (id) => {
    setBusy(id);
    try {
      await api.post(`/donations/${id}/transition`, { status: 'recipient_confirmed', reason: 'Recipient confirmed receipt' });
      track(EVENTS.use_confirm_receipt, { donation_id: id });
      setNotice('Receipt confirmed. Verified impact will appear for the donor.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const submitNeed = async (e) => {
    e.preventDefault();
    if (!profile?.id) {
      setError('Your recipient profile could not be loaded. Refresh and try again.');
      return;
    }
    try {
      await api.post('/donation-requests/', {
        recipient_id: profile.id,
        item: needForm.item,
        quantity: Number(needForm.quantity) || 1,
        urgency: needForm.urgency,
        approx_location: needForm.approx_location,
      });
      track(EVENTS.use_need_created);
      setNeedForm({ item: '', quantity: 1, urgency: 'normal', approx_location: '' });
      setNotice('Need submitted for matching.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const waitingConfirm = mine.filter((d) => d.status === 'delivered');
  const items = [
    { id: 'profile', title: 'Recipient profile on file', why: 'Needed for matching — not published publicly.', done: Boolean(profile?.id) },
    { id: 'need', title: 'Submit a need or claim suitable surplus', why: 'We match on category, quantity and area — not “deservingness”.', done: needs.length > 0 || mine.length > 0 },
    { id: 'confirm', title: 'Confirm receipt when a handover arrives', why: 'Impact counts only after confirmation.', done: mine.some((d) => ['recipient_confirmed', 'completed'].includes(d.status)) },
  ];

  return (
    <DashboardShell
      roleLabel={`${currentUser?.username || ''} · recipient`}
      onSignOut={async () => {
        await signOut();
        window.location.href = '/';
      }}
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Recipient</p>
      <h1 className="font-display text-3xl font-semibold text-emerald-950">Your support journey</h1>
      <p className="mt-2 max-w-2xl text-sm text-emerald-800/80">
        Private by design. Exact addresses stay hidden until an authorised handover.
      </p>
      <div className="mt-6">
        <OnboardingChecklist
          role="recipient"
          items={items}
          nextAction={
            waitingConfirm.length > 0 ? (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-900">
                {waitingConfirm.length} waiting for your confirmation
              </span>
            ) : null
          }
        />
      </div>
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Submit a need</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitNeed}>
          <input required className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Item or category" value={needForm.item} onChange={(e) => setNeedForm({ ...needForm, item: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" type="number" min="1" value={needForm.quantity} onChange={(e) => setNeedForm({ ...needForm, quantity: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Approximate area (not exact address)" value={needForm.approx_location} onChange={(e) => setNeedForm({ ...needForm, approx_location: e.target.value })} />
          <select className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" value={needForm.urgency} onChange={(e) => setNeedForm({ ...needForm, urgency: e.target.value })}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
            Submit need
          </button>
        </form>
        {needs.length > 0 && (
          <ul className="mt-4 space-y-2">
            {needs.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm">
                <span className="font-semibold text-emerald-950">
                  {n.item} · qty {n.quantity}
                </span>
                <StatusPill value={n.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Suggested matches</h2>
        <p className="mt-1 text-sm text-emerald-800/75">
          {matchMeta?.explanation || 'Transparent rules: category, quantity, area and urgency. No opaque AI.'}
        </p>
        {suggestions.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">Submit a need to see why listings may fit — or claim from available surplus below.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {suggestions.map((row) => (
              <li key={row.donation?.id} className="rounded-xl border border-emerald-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-emerald-950">{row.donation?.food_item || row.donation?.title}</p>
                    <p className="text-sm text-emerald-800/75">
                      Score {row.score} · {row.donation?.quantity} {row.donation?.unit}
                    </p>
                    <ul className="mt-1 list-disc pl-4 text-xs text-emerald-800/80">
                      {(row.reasons || []).map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  {row.donation?.id && (
                    <button type="button" disabled={busy === row.donation.id} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => claim(row.donation.id)}>
                      Claim
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Available surplus</h2>
        {available.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No available listings in this area yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {available.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                <div>
                  <p className="font-semibold text-emerald-950">{d.food_item || d.title}</p>
                  <p className="text-sm text-emerald-800/75">
                    {d.quantity} {d.unit} · {d.approx_location || 'Area listed after match'}
                  </p>
                </div>
                <button type="button" disabled={busy === d.id} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => claim(d.id)}>
                  Claim
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Your matches</h2>
        {mine.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No reserved or in-progress handovers yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {mine.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                <div>
                  <p className="font-semibold text-emerald-950">{d.food_item || d.title}</p>
                  <p className="text-sm text-emerald-800/75">{d.quantity} {d.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={d.status} />
                  {d.status === 'delivered' && (
                    <button type="button" disabled={busy === d.id} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" onClick={() => confirm(d.id)}>
                      Confirm receipt
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardShell>
  );
}
