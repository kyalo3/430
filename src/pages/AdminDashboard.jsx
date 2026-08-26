import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import DashboardShell from '../components/dashboard/DashboardShell';
import StatusPill from '../components/dashboard/StatusPill';
import { nextActions } from '../lib/donationStates';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'donations', label: 'Donations' },
  { id: 'requests', label: 'Requests' },
  { id: 'partners', label: 'Partners' },
  { id: 'audit', label: 'Audit' },
];

const NEED_NEXT = {
  draft: ['submitted', 'cancelled'],
  submitted: ['verified', 'rejected', 'cancelled'],
  pending: ['verified', 'rejected', 'cancelled'],
  verified: ['open', 'rejected', 'cancelled'],
  open: ['partially_matched', 'fully_matched', 'expired', 'cancelled'],
  partially_matched: ['fully_matched', 'open', 'expired', 'cancelled', 'disputed'],
  fully_matched: ['fulfilled', 'disputed', 'cancelled'],
  disputed: ['open', 'cancelled', 'fulfilled'],
  fulfilled: [],
  rejected: [],
  cancelled: [],
  expired: [],
};

const REASON_STATUSES = new Set(['rejected', 'cancelled', 'disputed']);

function formatWhen(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function ReasonDialog({ title, confirmLabel, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const valid = reason.trim().length >= 5;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/50 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reason-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="reason-title" className="font-display text-xl font-semibold text-emerald-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-emerald-800/80">A reason of at least 5 characters is required for the audit log.</p>
        <textarea
          className="mt-4 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you taking this action?"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-300"
            onClick={() => onConfirm(reason.trim())}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return <p className="py-8 text-center text-sm text-emerald-800/70">{message}</p>;
}

export default function AdminDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [requests, setRequests] = useState([]);
  const [impact, setImpact] = useState({ count: 0, items: [] });
  const [audit, setAudit] = useState([]);
  const [ops, setOps] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pendingAction, setPendingAction] = useState(null);
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [healthRes, usersRes, donationsRes, summaryRes, requestsRes, impactRes, auditRes, opsRes, orgsRes] = await Promise.all([
        api.get('/health/ready').catch(() => ({ data: { status: 'not_ready', mongo: 'error' } })),
        api.get('/users/'),
        api.get('/admin/donations'),
        api.get('/admin/donations/fooditem-summary').catch(() => ({ data: [] })),
        api.get('/donation-requests/'),
        api.get('/impact/admin').catch(() => ({ data: { count: 0, items: [] } })),
        api.get('/platform/audit', { params: { limit: 50 } }).catch(() => ({ data: [] })),
        api.get('/impact/operations').catch(() => ({ data: { empty: true } })),
        api.get('/organisations/admin').catch(() => ({ data: [] })),
      ]);
      setHealth(healthRes.data);
      setUsers(usersRes.data || []);
      setDonations(donationsRes.data || []);
      setSummary(summaryRes.data || []);
      setRequests(requestsRes.data || []);
      setImpact(impactRes.data || { count: 0, items: [] });
      setAudit(Array.isArray(auditRes.data) ? auditRes.data : []);
      setOps(opsRes.data || null);
      setOrgs(orgsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const byRole = users.reduce((acc, u) => {
      const role = u.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    return {
      users: users.length,
      donors: byRole.donor || 0,
      recipients: byRole.recipient || 0,
      volunteers: byRole.volunteer || 0,
      admins: byRole.admin || 0,
      suspended: users.filter((u) => u.status === 'suspended').length,
      donations: donations.length,
      pendingReview: donations.filter((d) => ['submitted', 'under_review'].includes(d.status)).length,
      requests: requests.length,
      impact: impact.count || 0,
    };
  }, [users, donations, requests, impact]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      return [u.username, u.email, u.role, u.status].join(' ').toLowerCase().includes(q);
    });
  }, [users, userQuery, roleFilter]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const runAction = async (fn) => {
    try {
      setError('');
      await fn();
      setNotice('Action recorded.');
      setPendingAction(null);
      await load();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setBusyId('');
    }
  };

  const confirmPending = (reason) => {
    if (!pendingAction) return;
    const { type, target } = pendingAction;
    setBusyId(target.id);
    if (type === 'suspend') {
      runAction(() => api.post(`/users/${target.id}/suspend`, null, { params: { reason } }));
    } else if (type === 'restore') {
      runAction(() => api.post(`/users/${target.id}/restore`, null, { params: { reason } }));
    } else if (type === 'delete') {
      runAction(() => api.delete(`/users/${target.id}`, { params: { reason } }));
    } else if (type === 'need-status') {
      runAction(() =>
        api.put(`/donation-requests/${target.id}/status`, {
          status: target.status,
          reason: REASON_STATUSES.has(target.status) ? reason : reason || null,
        }),
      );
    } else if (type === 'donation-status') {
      runAction(() => api.post(`/donations/${target.id}/transition`, { status: target.status, reason }));
    } else if (type === 'org-verify') {
      runAction(() => api.post(`/organisations/${target.id}/verify`, { reason }));
    } else if (type === 'anonymise') {
      runAction(() => api.post(`/users/${target.id}/anonymise`, null, { params: { reason } }));
    }
  };

  const changeNeedStatus = (req, status) => {
    if (REASON_STATUSES.has(status)) {
      setPendingAction({ type: 'need-status', target: { id: req.id, status }, title: `Set request to ${status}` });
      return;
    }
    setBusyId(req.id);
    runAction(() => api.put(`/donation-requests/${req.id}/status`, { status }));
  };

  return (
    <DashboardShell
      wide
      roleLabel={`${currentUser?.username || ''} · admin`}
      extraNav={
        <Link to="/dashboard/reports" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
          Reports
        </Link>
      }
      onSignOut={handleLogout}
    >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Operations</p>
            <h1 className="font-display text-3xl font-semibold text-emerald-950 sm:text-4xl">Admin console</h1>
            <p className="mt-2 max-w-xl text-sm text-emerald-800/80">
              Live platform data. New administrators are created with the bootstrap script — public register cannot create admin accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === item.id ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-12 text-center text-emerald-800">Loading live data…</div>
        ) : (
          <>
            {tab === 'overview' && (
              <section className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'System', value: health?.status === 'ready' ? 'Ready' : 'Not ready', hint: `Mongo ${health?.mongo || 'unknown'}` },
                    { label: 'Users', value: counts.users, hint: `${counts.suspended} suspended` },
                    { label: 'Donations', value: counts.donations, hint: `${counts.pendingReview} awaiting review` },
                    { label: 'Verified impact', value: counts.impact, hint: 'Confirmed fulfilments only' },
                  ].map((card) => (
                    <article key={card.label} className="rounded-2xl border border-emerald-100 bg-white p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{card.label}</p>
                      <p className="mt-2 font-display text-3xl font-semibold text-emerald-950">{card.value}</p>
                      <p className="mt-1 text-sm text-emerald-800/70">{card.hint}</p>
                    </article>
                  ))}
                </div>
                {ops && !ops.empty && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      ['Median hours to match', ops.median_hours_to_match ?? '—'],
                      ['Median hours match→confirm', ops.median_hours_match_to_confirm ?? '—'],
                      ['Exception rate', ops.exception_rate == null ? '—' : `${Math.round(ops.exception_rate * 100)}%`],
                    ].map(([label, value]) => (
                      <article key={label} className="rounded-2xl border border-emerald-100 bg-white p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{label}</p>
                        <p className="mt-2 font-display text-2xl font-semibold text-emerald-950">{value}</p>
                      </article>
                    ))}
                  </div>
                )}
                {ops?.methodology && <p className="text-xs text-emerald-800/70">{ops.methodology}</p>}
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    ['Donors', counts.donors],
                    ['Recipients', counts.recipients],
                    ['Volunteers', counts.volunteers],
                    ['Open needs', counts.requests],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/80 px-4 py-3 text-sm">
                      <span className="text-emerald-800/70">{label}</span>
                      <span className="ml-2 font-semibold text-emerald-950">{value}</span>
                    </div>
                  ))}
                </div>
                <article className="rounded-2xl border border-emerald-100 bg-white p-6">
                  <h2 className="font-display text-xl font-semibold text-emerald-950">Review queue</h2>
                  <p className="mt-1 text-sm text-emerald-800/75">Submitted listings must be verified before they become available.</p>
                  {donations.filter((d) => ['submitted', 'under_review'].includes(d.status)).length === 0 ? (
                    <EmptyState message="Nothing waiting for moderation." />
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {donations
                        .filter((d) => ['submitted', 'under_review'].includes(d.status))
                        .map((d) => (
                          <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                            <div>
                              <p className="font-semibold text-emerald-950">{d.food_item || d.title}</p>
                              <p className="text-sm text-emerald-800/75">
                                {d.quantity} {d.unit} · {d.approx_location || 'area private'}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusPill value={d.status} />
                              {nextActions(d.status, 'admin')
                                .filter((s) => ['under_review', 'available', 'rejected', 'cancelled'].includes(s))
                                .map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    disabled={busyId === d.id}
                                    className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                                    onClick={() => {
                                      const needsReason = ['rejected', 'cancelled'].includes(status);
                                      if (needsReason) {
                                        setPendingAction({
                                          type: 'donation-status',
                                          target: { id: d.id, status },
                                          title: `Set donation to ${status}`,
                                        });
                                        return;
                                      }
                                      setBusyId(d.id);
                                      runAction(() =>
                                        api.post(`/donations/${d.id}/transition`, { status, reason: 'Admin verification' }),
                                      );
                                    }}
                                  >
                                    {status.replaceAll('_', ' ')}
                                  </button>
                                ))}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </article>
                <article className="rounded-2xl border border-emerald-100 bg-white p-6">
                  <h2 className="font-display text-xl font-semibold text-emerald-950">Recent audit</h2>
                  {audit.length === 0 ? (
                    <EmptyState message="No audit events yet." />
                  ) : (
                    <ul className="mt-4 divide-y divide-emerald-50">
                      {audit.slice(0, 8).map((row) => (
                        <li key={row.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-sm">
                          <div>
                            <p className="font-semibold text-emerald-950">{row.action}</p>
                            <p className="text-emerald-800/70">
                              {row.actor_role} · {row.entity_type} {row.entity_id}
                            </p>
                          </div>
                          <span className="text-xs text-emerald-700/70">{formatWhen(row.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </section>
            )}

            {tab === 'users' && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-display text-xl font-semibold text-emerald-950">People</h2>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="search"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Search username, email, role"
                      className="rounded-lg border border-emerald-200 px-3 py-2 text-sm"
                    />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="rounded-lg border border-emerald-200 px-3 py-2 text-sm"
                    >
                      <option value="all">All roles</option>
                      <option value="donor">Donor</option>
                      <option value="recipient">Recipient</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                {filteredUsers.length === 0 ? (
                  <EmptyState message="No users match this filter." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-emerald-700">
                          <th className="px-2 py-2">User</th>
                          <th className="px-2 py-2">Role</th>
                          <th className="px-2 py-2">Status</th>
                          <th className="px-2 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => {
                          const self = u.id === currentUser?.id;
                          return (
                            <tr key={u.id} className="border-t border-emerald-50">
                              <td className="px-2 py-3">
                                <div className="font-semibold text-emerald-950">{u.username}</div>
                                <div className="text-xs text-emerald-800/70">{u.email}</div>
                              </td>
                              <td className="px-2 py-3 capitalize">{u.role}</td>
                              <td className="px-2 py-3">
                                <StatusPill value={u.status || 'active'} />
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex flex-wrap gap-2">
                                  {u.status === 'suspended' ? (
                                    <button
                                      type="button"
                                      disabled={busyId === u.id}
                                      className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900"
                                      onClick={() => setPendingAction({ type: 'restore', target: u, title: `Restore ${u.username}` })}
                                    >
                                      Restore
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={self || busyId === u.id}
                                      className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-900 disabled:opacity-40"
                                      onClick={() => setPendingAction({ type: 'suspend', target: u, title: `Suspend ${u.username}` })}
                                    >
                                      Suspend
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={self || busyId === u.id}
                                    className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 disabled:opacity-40"
                                    onClick={() => setPendingAction({ type: 'delete', target: u, title: `Delete ${u.username}` })}
                                  >
                                    Delete
                                  </button>
                                  {u.status !== 'anonymised' && (
                                    <button
                                      type="button"
                                      disabled={self || busyId === u.id}
                                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 disabled:opacity-40"
                                      onClick={() => setPendingAction({ type: 'anonymise', target: u, title: `Anonymise ${u.username}` })}
                                    >
                                      Anonymise
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {tab === 'donations' && (
              <section className="space-y-6">
                {summary.length > 0 && (
                  <div className="rounded-2xl border border-emerald-100 bg-white p-6">
                    <h2 className="font-display text-xl font-semibold text-emerald-950">Verified by item</h2>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {summary.map((row) => (
                        <li key={row.food_item} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                          <span className="font-semibold text-emerald-950">{row.food_item || 'Unspecified'}</span>
                          <span className="ml-2 text-emerald-800/70">{row.total}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="rounded-2xl border border-emerald-100 bg-white p-6">
                  <h2 className="font-display text-xl font-semibold text-emerald-950">All donations</h2>
                  {donations.length === 0 ? (
                    <EmptyState message="No donations listed yet." />
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-emerald-700">
                            <th className="px-2 py-2">Item</th>
                            <th className="px-2 py-2">Qty</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Location</th>
                            <th className="px-2 py-2">Updated</th>
                            <th className="px-2 py-2">Moderate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d) => (
                            <tr key={d.id} className="border-t border-emerald-50">
                              <td className="px-2 py-3">
                                <div className="font-semibold text-emerald-950">{d.food_item || d.title || 'Untitled'}</div>
                                <div className="text-xs text-emerald-800/70">{d.category}</div>
                              </td>
                              <td className="px-2 py-3">
                                {d.quantity} {d.unit}
                              </td>
                              <td className="px-2 py-3">
                                <StatusPill value={d.status} />
                              </td>
                              <td className="px-2 py-3 text-emerald-800/80">{d.approx_location || '—'}</td>
                              <td className="px-2 py-3 text-xs text-emerald-700/70">{formatWhen(d.updated_at || d.created_at)}</td>
                              <td className="px-2 py-3">
                                <select
                                  className="rounded-md border border-emerald-200 px-2 py-1 text-xs"
                                  defaultValue=""
                                  disabled={busyId === d.id}
                                  onChange={(e) => {
                                    const status = e.target.value;
                                    if (!status) return;
                                    const needsReason = ['rejected', 'cancelled', 'recalled', 'disputed'].includes(status);
                                    if (needsReason) {
                                      setPendingAction({
                                        type: 'donation-status',
                                        target: { id: d.id, status },
                                        title: `Set donation to ${status}`,
                                      });
                                    } else {
                                      setBusyId(d.id);
                                      runAction(() =>
                                        api.post(`/donations/${d.id}/transition`, { status, reason: 'Admin moderation' }),
                                      );
                                    }
                                    e.target.value = '';
                                  }}
                                >
                                  <option value="">Advance…</option>
                                  {nextActions(d.status, 'admin').map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {tab === 'requests' && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-6">
                <h2 className="font-display text-xl font-semibold text-emerald-950">Need requests</h2>
                {requests.length === 0 ? (
                  <EmptyState message="No recipient needs submitted yet." />
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-emerald-700">
                          <th className="px-2 py-2">Item</th>
                          <th className="px-2 py-2">Urgency</th>
                          <th className="px-2 py-2">Status</th>
                          <th className="px-2 py-2">Advance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => {
                          const next = NEED_NEXT[req.status] || [];
                          return (
                            <tr key={req.id} className="border-t border-emerald-50">
                              <td className="px-2 py-3">
                                <div className="font-semibold text-emerald-950">{req.item}</div>
                                <div className="text-xs text-emerald-800/70">
                                  qty {req.quantity} · {req.approx_location || 'area private'}
                                </div>
                              </td>
                              <td className="px-2 py-3 capitalize">{req.urgency}</td>
                              <td className="px-2 py-3">
                                <StatusPill value={req.status} />
                              </td>
                              <td className="px-2 py-3">
                                {next.length === 0 ? (
                                  <span className="text-xs text-emerald-700/60">Terminal</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {next.map((status) => (
                                      <button
                                        key={status}
                                        type="button"
                                        disabled={busyId === req.id}
                                        className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 disabled:opacity-40"
                                        onClick={() => changeNeedStatus(req, status)}
                                      >
                                        {status.replaceAll('_', ' ')}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {tab === 'partners' && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-6">
                <h2 className="font-display text-xl font-semibold text-emerald-950">Partner organisations</h2>
                <p className="mt-1 text-sm text-emerald-800/75">Verified names only appear in the public directory. Member identities are not published.</p>
                {orgs.length === 0 ? (
                  <EmptyState message="No partner organisations yet." />
                ) : (
                  <ul className="mt-4 space-y-3">
                    {orgs.map((org) => (
                      <li key={org.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-50 p-4">
                        <div>
                          <p className="font-semibold text-emerald-950">{org.name}</p>
                          <p className="text-sm text-emerald-800/75">
                            {org.type} · {org.approx_location || 'area private'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill value={org.status} />
                          {org.status !== 'verified' && (
                            <button
                              type="button"
                              className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900"
                              onClick={() => setPendingAction({ type: 'org-verify', target: org, title: `Verify ${org.name}` })}
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {tab === 'audit' && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-6">
                <h2 className="font-display text-xl font-semibold text-emerald-950">Audit log</h2>
                {audit.length === 0 ? (
                  <EmptyState message="No audit events recorded." />
                ) : (
                  <ul className="mt-4 divide-y divide-emerald-50">
                    {audit.map((row) => (
                      <li key={row.id} className="py-3 text-sm">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-semibold text-emerald-950">{row.action}</p>
                          <span className="text-xs text-emerald-700/70">{formatWhen(row.created_at)}</span>
                        </div>
                        <p className="text-emerald-800/75">
                          {row.actor_role} · {row.entity_type} {row.entity_id}
                          {row.reason ? ` · ${row.reason}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}

      {pendingAction && (
        <ReasonDialog
          title={pendingAction.title}
          confirmLabel="Confirm"
          onClose={() => setPendingAction(null)}
          onConfirm={confirmPending}
        />
      )}
    </DashboardShell>
  );
}
