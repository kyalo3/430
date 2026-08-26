import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';
import DashboardShell from '../components/dashboard/DashboardShell';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';
import StatusPill from '../components/dashboard/StatusPill';
import { nextActions } from '../lib/donationStates';

export default function VolunteerDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [eligible, setEligible] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [evidence, setEvidence] = useState('');
  const [logistics, setLogistics] = useState({ service_area: '', availability_notes: '', capacity: 1, task_types: '' });

  const load = useCallback(async () => {
    setError('');
    try {
      const [el, my, me] = await Promise.all([
        api.get('/fulfilments/eligible'),
        api.get('/fulfilments/mine'),
        api.get('/volunteers/').catch(() => ({ data: null })),
      ]);
      setEligible(el.data || []);
      setMine(my.data || []);
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
      setNotice('Service area saved. Eligible tasks prefer this approximate area.');
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
      await load();
    } catch (err) {
      setError(err.message);
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
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Volunteer</p>
      <h1 className="font-display text-3xl font-semibold text-emerald-950">Handover assignments</h1>
      <p className="mt-2 max-w-2xl text-sm text-emerald-800/80">
        Choose a task in your area. Sensitive handover notes appear only after you accept. Do not share recipient identity in public channels.
      </p>

      <div className="mt-6">
        <OnboardingChecklist role="volunteer" items={items} />
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Service capacity</h2>
        <p className="mt-1 text-sm text-emerald-800/75">Approximate area only. Exact addresses stay hidden until you accept a task.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={saveLogistics}>
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" placeholder="Service area (e.g. Westlands)" value={logistics.service_area} onChange={(e) => setLogistics({ ...logistics, service_area: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm" type="number" min="1" max="50" value={logistics.capacity} onChange={(e) => setLogistics({ ...logistics, capacity: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Availability notes" value={logistics.availability_notes} onChange={(e) => setLogistics({ ...logistics, availability_notes: e.target.value })} />
          <input className="rounded-lg border border-emerald-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Task types (comma separated)" value={logistics.task_types} onChange={(e) => setLogistics({ ...logistics, task_types: e.target.value })} />
          <button type="submit" className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
            Save logistics
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Eligible tasks</h2>
        {eligible.length === 0 ? (
          <p className="py-6 text-sm text-emerald-800/70">No unmatched handovers right now.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {eligible.map((task) => (
              <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                <div>
                  <p className="font-semibold text-emerald-950">{task.food_item || task.title}</p>
                  <p className="text-sm text-emerald-800/75">
                    {task.quantity} {task.unit} · {task.handover?.approx_location || 'Service area'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={task.status} />
                  <button
                    type="button"
                    disabled={busy === task.id}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                    onClick={() => accept(task.id)}
                  >
                    Accept
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Active assignments</h2>
        <label className="mt-3 block text-sm text-emerald-900">
          Evidence note (optional)
          <input
            className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
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
              return (
                <li key={task.id} className="rounded-xl border border-emerald-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-emerald-950">{task.food_item || task.title}</p>
                    <StatusPill value={task.status} />
                  </div>
                  <p className="mt-2 text-sm text-emerald-900">
                    Window: {task.handover?.collection_window || '—'}
                  </p>
                  <p className="text-sm text-emerald-900">Notes: {task.handover?.handling_notes || '—'}</p>
                  <p className="text-sm text-emerald-900">Area: {task.handover?.approx_location || '—'}</p>
                  {actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {actions.map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={busy === task.id}
                          className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                          onClick={() => progress(task.id, st)}
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
      </section>
    </DashboardShell>
  );
}
