import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { track, EVENTS } from '../lib/analytics';
import DashboardShell from '../components/dashboard/DashboardShell';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';

export default function VolunteerDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [eligible, setEligible] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [evidence, setEvidence] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [el, my] = await Promise.all([api.get('/fulfilments/eligible'), api.get('/fulfilments/mine')]);
      setEligible(el.data || []);
      setMine(my.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load assignments');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      extraNav={
        <button type="button" className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white" onClick={async () => { await signOut(); window.location.href = '/'; }}>
          Log out
        </button>
      }
    >
      <h1 className="font-display text-3xl font-semibold text-emerald-950">Volunteer assignments</h1>
      <p className="mt-2 max-w-2xl text-sm text-emerald-800/80">
        Choose a task in your area. Sensitive handover notes appear only after you accept.
      </p>

      <div className="mt-6">
        <OnboardingChecklist role="volunteer" items={items} />
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">{notice}</p>}

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
                    {task.quantity} {task.unit} · {task.handover?.approx_location || 'Service area'} · {task.status}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy === task.id}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                  onClick={() => accept(task.id)}
                >
                  Accept
                </button>
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
            {mine.map((task) => (
              <li key={task.id} className="rounded-xl border border-emerald-50 p-4">
                <p className="font-semibold text-emerald-950">{task.food_item || task.title}</p>
                <p className="text-sm text-emerald-800/80">Status: {task.status}</p>
                <p className="mt-2 text-sm text-emerald-900">
                  Window: {task.handover?.collection_window || '—'} · Notes: {task.handover?.handling_notes || '—'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['collected', 'in_transit', 'delivered', 'failed'].map((st) => (
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardShell>
  );
}
