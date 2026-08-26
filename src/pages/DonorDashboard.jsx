import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';
import DashboardShell from '../components/dashboard/DashboardShell';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';
import StatusPill from '../components/dashboard/StatusPill';
import { journeyStage } from '../lib/donationStates';

const emptyForm = {
  food_item: '',
  description: '',
  quantity: '',
  unit: 'units',
  category: 'general',
  approx_location: '',
  collection_window: '',
  handling_notes: '',
  organisation_id: '',
};

export default function DonorDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [impact, setImpact] = useState({ items: [] });
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'community', approx_location: '' });

  const load = useCallback(async () => {
    setError('');
    try {
      const [mine, me, verified, mineOrgs] = await Promise.all([
        api.get('/donations/', { params: { mine: true } }),
        api.get('/donors/').catch(() => ({ data: null })),
        api.get('/impact/mine').catch(() => ({ data: { items: [] } })),
        api.get('/organisations/mine').catch(() => ({ data: [] })),
      ]);
      setListings(mine.data || []);
      setProfile(me.data);
      setImpact(verified.data || { items: [] });
      setOrgs(mineOrgs.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load your listings');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const verified = impact.items?.length || 0;
    const inHandover = listings.filter((d) =>
      ['matched', 'pickup_scheduled', 'collected', 'in_transit', 'delivered'].includes(d.status),
    ).length;
    const awaitingReview = listings.filter((d) => ['submitted', 'under_review', 'draft'].includes(d.status)).length;
    return { listed: listings.length, inHandover, verified, awaitingReview };
  }, [listings, impact]);

  const submitListing = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    if (!form.food_item.trim() || !form.description.trim() || Number(form.quantity) < 1) {
      setError('Please provide an item, description, and a quantity of at least 1.');
      setBusy(false);
      return;
    }
    try {
      const created = await api.post('/donations/', {
        food_item: form.food_item.trim(),
        description: form.description.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        category: form.category,
        approx_location: form.approx_location || undefined,
        collection_window: form.collection_window || undefined,
        handling_notes: form.handling_notes || undefined,
        organisation_id: form.organisation_id || undefined,
      });
      await api.post(`/donations/${created.data.id}/transition`, { status: 'submitted' });
      track(EVENTS.use_donation_created, { donation_id: created.data.id });
      setForm(emptyForm);
      setNotice('Listing submitted for review. It is not a shop checkout — matching starts after verification.');
      await load();
    } catch (err) {
      setError(err.message || 'Could not submit listing');
    } finally {
      setBusy(false);
    }
  };

  const recall = async (id) => {
    setBusy(true);
    try {
      await api.post(`/donations/${id}/transition`, { status: 'cancelled', reason: 'Donor withdrew listing' });
      setNotice('Listing withdrawn.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const createOrg = async (e) => {
    e.preventDefault();
    try {
      await api.post('/organisations/', newOrg);
      setNewOrg({ name: '', type: 'community', approx_location: '' });
      setNotice('Organisation submitted. An administrator verifies partners before they appear in the public directory.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const items = [
    { id: 'profile', title: 'Donor profile on file', why: 'Used only for coordination — not a public storefront.', done: Boolean(profile?.id) },
    { id: 'list', title: 'Submit surplus for review', why: 'An administrator verifies the listing before it becomes available.', done: listings.length > 0 },
    {
      id: 'impact',
      title: 'Wait for recipient confirmation',
      why: 'Impact counts only after a confirmed handover — never estimated KES or meals.',
      done: counts.verified > 0,
    },
  ];

  return (
    <DashboardShell
      roleLabel={`${currentUser?.username || ''} · donor`}
      onSignOut={async () => {
        await signOut();
        window.location.href = '/';
      }}
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Donor</p>
      <h1 className="font-display text-3xl font-semibold text-emerald-950">Share surplus</h1>
      <p className="mt-2 max-w-2xl text-sm text-emerald-800/80">
        List what you can spare. Sustainashare verifies, matches to a private need, and records impact only after the recipient confirms receipt.
      </p>

      <div className="mt-6">
        <OnboardingChecklist role="donor" items={items} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ['Your listings', counts.listed],
          ['Awaiting review', counts.awaitingReview],
          ['In handover', counts.inHandover],
          ['Verified impact', counts.verified],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{label}</p>
            <p className="mt-1 font-display text-3xl font-semibold text-emerald-950">{value}</p>
          </article>
        ))}
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">List surplus</h2>
        <p className="mt-1 text-sm text-emerald-800/75">No price. No recipient picker. Approximate area only.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitListing}>
          <input required className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Item" value={form.food_item} onChange={(e) => setForm({ ...form, food_item: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Approximate area" value={form.approx_location} onChange={(e) => setForm({ ...form, approx_location: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Collection window (optional)" value={form.collection_window} onChange={(e) => setForm({ ...form, collection_window: e.target.value })} />
          <textarea className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" rows={2} placeholder="Handling notes for the volunteer after they accept" value={form.handling_notes} onChange={(e) => setForm({ ...form, handling_notes: e.target.value })} />
          {orgs.length > 0 && (
            <select className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" value={form.organisation_id} onChange={(e) => setForm({ ...form, organisation_id: e.target.value })}>
              <option value="">List as an individual</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.status})
                </option>
              ))}
            </select>
          )}
          <button type="submit" disabled={busy} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 sm:col-span-2">
            Submit for review
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Your listings</h2>
        {listings.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No surplus listed yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {listings.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                <div>
                  <p className="font-semibold text-emerald-950">{d.food_item || d.title}</p>
                  <p className="text-sm text-emerald-800/75">
                    {d.quantity} {d.unit} · {journeyStage(d.status)} · {d.approx_location || 'Area private until match'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={d.status} />
                  {['draft', 'submitted', 'under_review', 'available'].includes(d.status) && (
                    <button type="button" disabled={busy} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800" onClick={() => recall(d.id)}>
                      Withdraw
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Partner organisation</h2>
        <p className="mt-1 text-sm text-emerald-800/75">Optional. For retailers, NGOs and community groups listing surplus in bulk. No public member directory.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={createOrg}>
          <input required className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Organisation name" value={newOrg.name} onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })} />
          <select className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" value={newOrg.type} onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value })}>
            <option value="community">Community</option>
            <option value="ngo">NGO</option>
            <option value="retailer">Retailer</option>
            <option value="hospitality">Hospitality</option>
            <option value="logistics">Logistics</option>
          </select>
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Approximate area" value={newOrg.approx_location} onChange={(e) => setNewOrg({ ...newOrg, approx_location: e.target.value })} />
          <button type="submit" className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white sm:col-span-3">
            Register organisation
          </button>
        </form>
        {orgs.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm">
            {orgs.map((org) => (
              <li key={org.id} className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2">
                <span>{org.name}</span>
                <StatusPill value={org.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Verified impact</h2>
        <p className="mt-1 text-sm text-emerald-800/75">
          {impact.methodology || 'Only recipient-confirmed (or admin-verified) fulfilments are counted.'}
        </p>
        {(impact.items || []).length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No verified fulfilments yet — listings in review or handover do not count.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {impact.items.map((row) => (
              <li key={row.donation_id} className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                {row.quantity} {row.unit} · {row.category} · confirmed {row.completed_at ? new Date(row.completed_at).toLocaleDateString() : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardShell>
  );
}
