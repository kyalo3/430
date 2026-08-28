import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardSection from '../components/dashboard/DashboardSection';
import DashboardStatStrip from '../components/dashboard/DashboardStatStrip';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';
import StatusPill from '../components/dashboard/StatusPill';
import DataBreakdown from '../components/dashboard/DataBreakdown';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { journeyStage } from '../lib/donationStates';
import { donorPipeline, formatWhen } from '../lib/dashboardData';
import { useReferenceData } from '../hooks/useReferenceData';
import { CategorySelect, CountyField, ReferenceSourceNote } from '../components/dashboard/ReferenceFields';
import { LOAD_CLASSES, LOGISTICS_MODES } from '../lib/logistics';
import { MEDIA } from '../constants/media';

const emptyForm = {
  food_item: '',
  description: '',
  quantity: '',
  unit: 'units',
  category: 'general',
  approx_location: '',
  collection_window: '',
  window_start: '',
  window_end: '',
  load_class: 'small',
  logistics_mode: 'either',
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
  const [orgImpact, setOrgImpact] = useState(null);
  const [activity, setActivity] = useState([]);
  const [platformImpact, setPlatformImpact] = useState(null);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'community', approx_location: '' });
  const { areas, categories, catalog, categoryLabel } = useReferenceData();

  const load = useCallback(async () => {
    setError('');
    try {
      const [mine, me, verified, mineOrgs, notes, summary] = await Promise.all([
        api.get('/donations/', { params: { mine: true } }),
        api.get('/donors/').catch(() => ({ data: null })),
        api.get('/impact/mine').catch(() => ({ data: { items: [] } })),
        api.get('/organisations/mine').catch(() => ({ data: [] })),
        api.get('/notifications/me').catch(() => ({ data: [] })),
        api.get('/impact/summary').catch(() => ({ data: null })),
      ]);
      setListings(mine.data || []);
      setProfile(me.data);
      setImpact(verified.data || { items: [] });
      setActivity((notes.data || []).slice(0, 8));
      setPlatformImpact(summary.data || null);
      const orgList = mineOrgs.data || [];
      setOrgs(orgList);
      if (orgList[0]?.id) {
        const pack = await api.get(`/impact/organisation/${orgList[0].id}`).catch(() => null);
        setOrgImpact(pack?.data || null);
      } else {
        setOrgImpact(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to load your listings');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => donorPipeline(listings, impact.items || []), [listings, impact]);

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
        window_start: form.window_start ? new Date(form.window_start).toISOString() : undefined,
        window_end: form.window_end ? new Date(form.window_end).toISOString() : undefined,
        load_class: form.load_class || 'small',
        logistics_mode: form.logistics_mode || 'either',
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
      <DashboardHero
        role="donor"
        eyebrow="Donor"
        title="Share surplus"
        subtitle="List what you can spare. Sustainashare verifies, matches to a private need, and records impact only after the recipient confirms receipt."
      />

      <div className="mt-4">
        <OnboardingChecklist role="donor" items={items} />
      </div>

      <DashboardStatStrip
        items={[
          ['Your listings', counts.listed],
          ['Awaiting review', counts.awaitingReview],
          ['Available', counts.available],
          ['In handover', counts.inHandover],
        ]}
      />
      <DashboardStatStrip
        items={[
          ['Verified journeys', counts.verified],
          ['Verified qty', counts.verifiedQty],
          ['Organisations', orgs.length],
          ['Platform verified', platformImpact?.verified_fulfilments ?? '—'],
        ]}
      />

      <DashboardSection title="Your pipeline" description="Live counts from your listings — not estimates or meal conversions.">
        <div className="grid gap-4 sm:grid-cols-2">
          <DataBreakdown title="By status" counts={counts.byStatus} empty="List surplus to see status flow." />
          <DataBreakdown title="By load class" counts={counts.byLoad} empty="Load class appears after you list." />
        </div>
        <div className="mt-4">
          <ActivityFeed title="Your notifications" items={activity} empty="Lifecycle alerts will show here." />
        </div>
      </DashboardSection>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white/90 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <DashboardSection
        title="List surplus"
        description="No price. No recipient picker. Approximate area only."
        media={MEDIA.vegBundle}
      >
        <ReferenceSourceNote catalog={catalog} />
        <form className="mt-1 grid gap-3 sm:grid-cols-2" onSubmit={submitListing}>
          <input required className="min-h-11 w-full rounded-lg border border-emerald-200 px-3 py-2.5 text-sm" placeholder="Item" value={form.food_item} onChange={(e) => setForm({ ...form, food_item: e.target.value })} />
          <input className="min-h-11 w-full rounded-lg border border-emerald-200 px-3 py-2.5 text-sm" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} categories={categories} />
          <CountyField id="ss-donor-counties" value={form.approx_location} onChange={(approx_location) => setForm({ ...form, approx_location })} areas={areas} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select
            className="rounded-lg border border-emerald-200 px-3 py-2 text-sm"
            value={form.load_class}
            onChange={(e) =>
              setForm({
                ...form,
                load_class: e.target.value,
                logistics_mode: e.target.value === 'bulk' ? 'partner' : form.logistics_mode,
              })
            }
            aria-label="Load class"
          >
            {LOAD_CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-emerald-200 px-3 py-2 text-sm"
            value={form.logistics_mode}
            onChange={(e) => setForm({ ...form, logistics_mode: e.target.value })}
            aria-label="Logistics mode"
          >
            {LOGISTICS_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <label className="text-sm text-emerald-900">
            Window start (optional)
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
              value={form.window_start}
              onChange={(e) => setForm({ ...form, window_start: e.target.value })}
            />
          </label>
          <label className="text-sm text-emerald-900">
            Window end (optional)
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
              value={form.window_end}
              onChange={(e) => setForm({ ...form, window_end: e.target.value })}
            />
          </label>
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Collection window label (optional free text)" value={form.collection_window} onChange={(e) => setForm({ ...form, collection_window: e.target.value })} />
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
          <button type="submit" disabled={busy} className="min-h-11 w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 sm:col-span-2">
            Submit for review
          </button>
        </form>
      </DashboardSection>

      <DashboardSection title="Your listings" media={MEDIA.marketShelf}>
        {listings.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No surplus listed yet.</p>
        ) : (
          <ul className="space-y-3">
            {listings.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 bg-white/80 p-4">
                <div>
                  <p className="font-semibold text-emerald-950">{d.food_item || d.title}</p>
                  <p className="text-sm text-emerald-800/75">
                    {d.quantity} {d.unit} · {d.load_class || 'small'} · {d.logistics_mode || 'either'} ·{' '}
                    {journeyStage(d.status)} · {d.approx_location || 'Area private until match'}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700/80">
                    Updated {formatWhen(d.updated_at || d.created_at)}
                    {d.collection_window ? ` · Window: ${d.collection_window}` : ''}
                    {d.organisation_id ? ' · Org listing' : ''}
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
      </DashboardSection>

      <DashboardSection
        title="Partner organisation"
        description="Optional. For retailers, NGOs and community groups listing surplus in bulk. No public member directory."
        media={MEDIA.greensField}
      >
        <form className="grid gap-3 sm:grid-cols-3" onSubmit={createOrg}>
          <input required className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Organisation name" value={newOrg.name} onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })} />
          <select className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" value={newOrg.type} onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value })}>
            <option value="community">Community</option>
            <option value="ngo">NGO</option>
            <option value="retailer">Retailer</option>
            <option value="hospitality">Hospitality</option>
            <option value="logistics">Logistics</option>
          </select>
          <CountyField id="ss-org-counties" value={newOrg.approx_location} onChange={(approx_location) => setNewOrg({ ...newOrg, approx_location })} areas={areas} placeholder="Organisation county / area" />
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
      </DashboardSection>

      <DashboardSection
        title="Verified impact"
        description={impact.methodology || 'Only recipient-confirmed (or admin-verified) fulfilments are counted.'}
        media={MEDIA.fruitPile}
        tone="impact"
      >
        {orgImpact && (
          <article className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-950">
            <p className="font-semibold">
              Organisation pack · {orgImpact.organisation?.name || 'Your org'}
            </p>
            <p className="mt-1 text-emerald-800/80">
              {orgImpact.verified_fulfilments} verified fulfilments · {orgImpact.quantity_redistributed} units
              redistributed (no meal/carbon conversion).
            </p>
            <p className="mt-2 text-xs text-emerald-800/70">{orgImpact.methodology}</p>
          </article>
        )}
        {(impact.items || []).length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No verified fulfilments yet — listings in review or handover do not count.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-2">
              {impact.items.map((row) => (
                <li key={row.donation_id} className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                  {row.quantity} {row.unit} · {categoryLabel(row.category)} · confirmed{' '}
                  {row.completed_at ? new Date(row.completed_at).toLocaleDateString() : ''}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  category: impact.items[0]?.category || prev.category,
                  food_item: '',
                  description: '',
                  quantity: '',
                }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setNotice('List another surplus item to keep the redistribution journey moving.');
              }}
            >
              List surplus again
            </button>
          </>
        )}
      </DashboardSection>
    </DashboardShell>
  );
}
