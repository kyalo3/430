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
import { nextActions } from '../lib/donationStates';
import { useReferenceData } from '../hooks/useReferenceData';
import { CountyField, ReferenceSourceNote } from '../components/dashboard/ReferenceFields';
import { MEDIA } from '../constants/media';
import { volunteerPipeline, formatWhen } from '../lib/dashboardData';

export default function VolunteerDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [eligible, setEligible] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [evidence, setEvidence] = useState('');
  const [activeId, setActiveId] = useState('');
  const [logistics, setLogistics] = useState({ service_area: '', availability_notes: '', capacity: 1, task_types: '' });
  const [activity, setActivity] = useState([]);
  const { areas, catalog } = useReferenceData();

  const load = useCallback(async () => {
    setError('');
    try {
      const [el, my, me, notes] = await Promise.all([
        api.get('/fulfilments/eligible'),
        api.get('/fulfilments/mine'),
        api.get('/volunteers/').catch(() => ({ data: null })),
        api.get('/notifications/me').catch(() => ({ data: [] })),
      ]);
      setEligible(el.data || []);
      const myTasks = my.data || [];
      setMine(myTasks);
      setActiveId((prev) => prev || myTasks[0]?.id || '');
      setActivity((notes.data || []).slice(0, 8));
      if (me.data) {
        setLogistics({
          service_area: me.data.service_area || '',
          availability_notes: me.data.availability_notes || '',
          capacity: me.data.capacity || 1,
          task_types: (me.data.task_types || []).join(', '),
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to load assignments');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveLogistics = async (e) => {
    e.preventDefault();
    try {
      await api.put('/volunteers/me/logistics', {
        service_area: logistics.service_area,
        availability_notes: logistics.availability_notes,
        capacity: Number(logistics.capacity) || 1,
        task_types: logistics.task_types.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setNotice('Service area saved. Eligible tasks prefer this approximate area and your remaining capacity.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const accept = async (id) => {
    setBusy(id);
    try {
      await api.post(`/fulfilments/${id}/accept`);
      track(EVENTS.use_volunteer_accept, { donation_id: id });
      setNotice('Assignment accepted. Exact handover details are now visible.');
      setActiveId(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setBusy('');
    }
  };

  const progress = async (id, status) => {
    setBusy(id);
    try {
      await api.post(`/fulfilments/${id}/progress`, { status, note: evidence || undefined });
      track(EVENTS.use_handover_progress, { donation_id: id, status });
      setEvidence('');
      setNotice(`Marked ${status.replaceAll('_', ' ')}.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const active = mine.find((t) => t.id === activeId) || mine[0];
  const counts = useMemo(
    () => volunteerPipeline(eligible, mine, logistics.capacity),
    [eligible, mine, logistics.capacity],
  );
  const completed = mine.filter((t) => ['delivered', 'recipient_confirmed', 'completed'].includes(t.status));
  const items = [
    { id: 'profile', title: 'Keep your profile current', why: 'So coordinators know how to reach you safely.', done: Boolean(currentUser?.email) },
    { id: 'accept', title: 'Accept an eligible handover', why: 'Exact pickup details stay hidden until you take the task.', done: mine.length > 0 },
    { id: 'complete', title: 'Confirm pickup and delivery', why: 'Impact is only counted after the recipient confirms receipt.', done: mine.some((d) => ['delivered', 'recipient_confirmed', 'completed'].includes(d.status)) },
  ];

  return (
    <DashboardShell
      roleLabel={`${currentUser?.username || ''} · volunteer`}
      onSignOut={async () => {
        await signOut();
        window.location.href = '/';
      }}
    >
      <div className="pb-28 md:pb-0">
        <DashboardHero
          role="volunteer"
          eyebrow="Volunteer"
          title="Handover assignments"
          subtitle="Choose a task that fits your capacity and load class. Sensitive handover notes appear only after you accept."
        />

        <div className="mt-4">
          <OnboardingChecklist role="volunteer" items={items} />
        </div>

        <DashboardStatStrip
          items={[
            ['Eligible now', counts.eligible],
            ['Active tasks', counts.active],
            ['Completed', counts.completed],
            ['Open capacity', `${counts.openSlots}/${counts.capacity}`],
          ]}
        />

        <DashboardSection
          title="Assignment overview"
          description={logistics.service_area ? `Serving ${logistics.service_area}` : 'Set a service area to prioritise nearby handovers.'}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DataBreakdown title="Your tasks by status" counts={counts.byStatus} empty="Accept a handover to build history." />
            <ActivityFeed title="Notifications" items={activity} empty="Assignment alerts will show here." />
          </div>
        </DashboardSection>

        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white/90 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

        <DashboardSection
          title="Service capacity"
          description={
            <>
              Capacity is how many concurrent handovers you can take (weighted by load class). Add task types like{' '}
              <code className="rounded bg-emerald-50 px-1">cold</code> or <code className="rounded bg-emerald-50 px-1">vehicle</code> when relevant.
            </>
          }
          media={MEDIA.watering}
        >
          <ReferenceSourceNote catalog={catalog} />
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={saveLogistics}>
            <CountyField id="ss-volunteer-counties" value={logistics.service_area} onChange={(service_area) => setLogistics({ ...logistics, service_area })} areas={areas} placeholder="Service county or area" />
            <input className="min-h-11 rounded-lg border border-emerald-200 px-3 py-2 text-sm" type="number" min="1" max="50" value={logistics.capacity} onChange={(e) => setLogistics({ ...logistics, capacity: e.target.value })} aria-label="Capacity" />
            <input className="min-h-11 rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Availability notes" value={logistics.availability_notes} onChange={(e) => setLogistics({ ...logistics, availability_notes: e.target.value })} />
            <input className="min-h-11 rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Task types (comma separated: handover, cold, vehicle)" value={logistics.task_types} onChange={(e) => setLogistics({ ...logistics, task_types: e.target.value })} />
            <button type="submit" className="min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
              Save logistics
            </button>
          </form>
        </DashboardSection>

        <DashboardSection title="Eligible tasks" media={MEDIA.gardenBeds}>
          {eligible.length === 0 ? (
            <p className="py-6 text-sm text-emerald-800/70">No unmatched handovers fit your area and capacity right now.</p>
          ) : (
            <ul className="space-y-3">
              {eligible.map((task) => (
                <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 bg-white/80 p-4">
                  <div>
                    <p className="font-semibold text-emerald-950">{task.food_item || task.title}</p>
                    <p className="text-sm text-emerald-800/75">
                      {task.quantity} {task.unit} · {task.load_class || 'small'} · {task.handover?.approx_location || 'Service area'}
                    </p>
                    <p className="mt-1 text-xs text-emerald-700/70">
                      Cost {task.capacity_cost || 1} capacity
                      {task.collection_window || task.handover?.collection_window
                        ? ` · Window: ${task.collection_window || task.handover?.collection_window}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                    <StatusPill value={task.status} />
                    <button
                      type="button"
                      disabled={busy === task.id}
                      className="min-h-11 flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 sm:flex-none"
                      onClick={() => accept(task.id)}
                    >
                      Accept
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection title="Active assignments" media={MEDIA.soilHands} tone="impact">
          <label className="block text-sm text-emerald-900">
            Evidence note (optional)
            <input
              className="mt-1 min-h-11 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Pickup condition, delay, or safety note"
            />
          </label>
          {mine.length === 0 ? (
            <p className="py-6 text-sm text-emerald-800/70">Accept a task to see exact handover details.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {mine.map((task) => {
                const actions = nextActions(task.status, 'volunteer');
                const selected = (active?.id || '') === task.id;
                return (
                  <li
                    key={task.id}
                    className={`rounded-xl border p-4 ${selected ? 'border-orange-300 bg-orange-50/40' : 'border-emerald-50 bg-white/80'}`}
                    onClick={() => setActiveId(task.id)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-emerald-950">{task.food_item || task.title}</p>
                      <StatusPill value={task.status} />
                    </div>
                    <p className="mt-2 text-sm text-emerald-900">
                      Load: {task.load_class || task.handover?.load_class || 'small'}
                    </p>
                    <p className="text-sm text-emerald-900">Window: {task.handover?.collection_window || '—'}</p>
                    <p className="text-sm text-emerald-900">Notes: {task.handover?.handling_notes || '—'}</p>
                    <p className="text-sm text-emerald-900">Area: {task.handover?.approx_location || '—'}</p>
                    <p className="text-xs text-emerald-700/70">Updated {formatWhen(task.updated_at || task.created_at)}</p>
                    {actions.length > 0 && (
                      <div className="mt-3 hidden flex-wrap gap-2 md:flex">
                        {actions.map((st) => (
                          <button
                            key={st}
                            type="button"
                            disabled={busy === task.id}
                            className="min-h-10 rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              progress(task.id, st);
                            }}
                          >
                            {st.replaceAll('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection title="Contribution history" description="Delivered and confirmed handovers on your record.">
          {completed.length === 0 ? (
            <p className="py-4 text-sm text-emerald-800/70">Completed handovers will collect here after delivery and confirmation.</p>
          ) : (
            <ul className="space-y-2">
              {completed.map((task) => (
                <li key={`done-${task.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-50 bg-emerald-50/50 px-3 py-2.5 text-sm">
                  <span className="font-semibold text-emerald-950">
                    {task.food_item || task.title} · {task.quantity} {task.unit}
                  </span>
                  <StatusPill value={task.status} />
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>

      {active && nextActions(active.status, 'volunteer').length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(6,78,59,0.08)] md:hidden">
          <p className="truncate text-xs font-semibold text-emerald-900">{active.food_item || active.title}</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
            {nextActions(active.status, 'volunteer').map((st) => (
              <button
                key={st}
                type="button"
                disabled={busy === active.id}
                className="min-h-11 shrink-0 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={() => progress(active.id, st)}
              >
                {st.replaceAll('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
