import React from 'react';
import api from '../lib/api';
import team from '../assets/images/team.svg';
import family from '../assets/images/family.svg';

function StatCard({ title, value, icon, color }) {
  // Color map for icon backgrounds
  const colorMap = {
    'border-emerald-400': 'bg-emerald-100 text-emerald-600',
    'border-yellow-400': 'bg-yellow-100 text-yellow-600',
    'border-blue-400': 'bg-blue-100 text-blue-600',
    'border-pink-400': 'bg-pink-100 text-pink-600',
  };
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl shadow-xl p-7 w-full border-0 bg-white/60 backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-3 text-3xl font-bold shadow ${colorMap[color] || 'bg-gray-100 text-gray-600'}`}>{icon}</div>
      <div className="text-3xl font-extrabold text-gray-900 drop-shadow-sm mb-1">{value}</div>
      <div className="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1">{title}</div>
      <div className={`h-1 w-10 rounded-full mt-2 ${color}`}></div>
    </div>
  );
}

function ActivityItem({ icon, text, time, color }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-b-0">
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${color}`}>{icon}</span>
      <span className="flex-1 text-gray-700">{text}</span>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

function TopDonorsTable({ donors }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-yellow-700 mb-4">Top Donors</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">Donor</th>
            <th className="px-2 py-1 text-left">Total Donated</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((d, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="px-2 py-1 font-semibold text-green-800">{d.name}</td>
              <td className="px-2 py-1">{d.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniStatCard({ title, value, icon, color }) {
  return (
    <div className={`flex items-center gap-3 bg-white/80 rounded-lg shadow p-4 border-l-4 ${color}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-lg font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{title}</div>
      </div>
    </div>
  );
}

function RecentUsersList({ users }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-emerald-900 mb-4">Recent Users</h2>
      <ul className="space-y-3">
        {users.map((user, i) => (
          <li key={i} className="border-l-4 border-emerald-400 pl-4">
            <div className="font-semibold text-green-800">{user.name}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState } from 'react';
function DonationsTrendChart({ data }) {
  // data: array of { day, value }
  const max = Math.max(...data.map(d => d.value), 1);
  const [hoverIdx, setHoverIdx] = useState(null);
  return (
    <div className="bg-gradient-to-br from-yellow-50 via-emerald-50 to-white rounded-xl shadow p-6 flex flex-col items-center relative">
      <div className="text-lg font-bold text-yellow-700 mb-2 flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
        Donations Trend (7d)
      </div>
      <svg width="240" height="80" viewBox="0 0 240 80" className="w-full max-w-xs md:max-w-sm lg:max-w-md">
        <defs>
          <linearGradient id="donationLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polyline
          fill="url(#donationLine)"
          stroke="none"
          points={data.map((d, i) => `${(i * 40)},${80 - (d.value / max) * 60}`).join(' ') + ` 240,80 0,80`}
          opacity="0.25"
        />
        {/* Trend line */}
        <polyline
          fill="none"
          stroke="url(#donationLine)"
          strokeWidth="3"
          points={data.map((d, i) => `${(i * 40)},${80 - (d.value / max) * 60}`).join(' ')}
        />
        {/* Dots and tooltips */}
        {data.map((point, i) => (
          <g key={i}>
            <circle
              cx={i * 40}
              cy={80 - (point.value / max) * 60}
              r={hoverIdx === i ? 7 : 5}
              fill={hoverIdx === i ? '#facc15' : '#34d399'}
              stroke="#fff"
              strokeWidth="2"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: 'pointer', transition: 'r 0.2s' }}
            />
            {hoverIdx === i && (
              <g>
                <rect x={i * 40 - 24} y={80 - (point.value / max) * 60 - 38} width="48" height="28" rx="6" fill="#fffbe9" stroke="#facc15" strokeWidth="1" />
                <text x={i * 40} y={80 - (point.value / max) * 60 - 22} textAnchor="middle" fontSize="13" fill="#b45309" fontWeight="bold">{point.value} donations</text>
                <text x={i * 40} y={80 - (point.value / max) * 60 - 8} textAnchor="middle" fontSize="11" fill="#6b7280">{point.day.slice(5)}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1 max-w-xs md:max-w-sm lg:max-w-md">
        {data.map((d, i) => (
          <span key={i} className="w-8 text-center">{d.day.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
    // Sample donation requests for demonstration
    const donationRequests = [
      { id: 1, recipient: 'Jane Doe', item: 'Food', custom: 'Rice, Beans', status: 'Pending', date: '2025-11-20' },
      { id: 2, recipient: 'Mary Smith', item: 'Clothes', custom: 'Children size', status: 'Fulfilled', date: '2025-11-19' },
      { id: 3, recipient: 'John Lee', item: 'Medicine', custom: 'Painkillers', status: 'Pending', date: '2025-11-18' },
    ];
    const [search, setSearch] = React.useState('');
    const filteredRequests = donationRequests.filter(r =>
      r.recipient.toLowerCase().includes(search.toLowerCase()) ||
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      r.custom.toLowerCase().includes(search.toLowerCase())
    );
  const [activeTab, setActiveTab] = React.useState('donors');
  const [showAddUser, setShowAddUser] = React.useState(false);
  const [userType, setUserType] = React.useState('donor');
  const [userForm, setUserForm] = React.useState({
    username: '',
    email: '',
    password: '',
    // Donor/Recipient/Volunteer fields
    first_name: '',
    last_name: '',
    id_no: '',
    phone_number: '',
    gender: '',
    address: '',
  });
  const [addUserError, setAddUserError] = React.useState('');
  const [addUserSuccess, setAddUserSuccess] = React.useState('');
  const handleAddUser = () => {
    setShowAddUser(true);
    setAddUserError('');
    setAddUserSuccess('');
  };
  const handleAddDonation = () => alert('Add Donation clicked!');
  const handleViewReports = () => {
    window.location.href = '/dashboard/reports';
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  const handleUserFormChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };
  const handleUserModalClose = () => {
    setShowAddUser(false);
    setUserForm({
      username: '', email: '', password: '', first_name: '', last_name: '', id_no: '', phone_number: '', gender: '', address: '',
    });
    setUserType('donor');
    setAddUserError('');
    setAddUserSuccess('');
  };
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');
    try {
      const profile = {
        first_name: userForm.first_name,
        last_name: userForm.last_name,
        id_no: userForm.id_no,
        phone_number: userForm.phone_number,
        gender: userForm.gender,
        address: userForm.address,
      };
      const payload = {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        role: userType,
        profile,
      };
      const res = await api.post('/users/', payload);
      setAddUserSuccess('User added successfully!');
      setTimeout(() => handleUserModalClose(), 1200);
    } catch (err) {
      setAddUserError(err.message);
    }
  };
  // Sample data for UI
  const stats = [
    { title: 'Users', value: 1280, icon: '👤', color: 'border-emerald-400' },
    { title: 'Donors', value: 320, icon: '💸', color: 'border-yellow-400' },
    { title: 'Recipients', value: 540, icon: '🎁', color: 'border-blue-400' },
    { title: 'Volunteers', value: 110, icon: '🤝', color: 'border-pink-400' },
  ];
  // New content data
  const miniStats = [
    { title: 'Pending Users', value: 7, icon: '⏳', color: 'border-yellow-400' },
    { title: 'Pending Donations', value: 3, icon: '📦', color: 'border-blue-400' },
    { title: 'Pending Reviews', value: 2, icon: '📝', color: 'border-pink-400' },
    { title: 'Unread Contacts', value: 5, icon: '📧', color: 'border-emerald-400' },
  ];
  const pendingApprovals = [
    { type: 'User', name: 'Frank', detail: 'frank@example.com', date: '2025-11-20' },
    { type: 'Donation', name: '10kg Maize', detail: 'by Alice', date: '2025-11-19' },
    { type: 'Review', name: 'Review by Bob', detail: 'Donation #123', date: '2025-11-18' },
  ];
  const announcements = [
    { title: 'System Maintenance', message: 'Scheduled for Nov 25, 2:00 AM - 4:00 AM UTC. Expect downtime.', date: '2025-11-19' },
    { title: 'New Feature', message: 'Bulk user import is now available for admins.', date: '2025-11-18' },
  ];
  const activities = [
    { icon: '🆕', text: 'New user registered: alice@example.com', time: '2 min ago', color: 'bg-emerald-100' },
    { icon: '💸', text: 'Donation received: 10kg rice', time: '10 min ago', color: 'bg-yellow-100' },
    { icon: '⭐', text: 'Review posted by John', time: '30 min ago', color: 'bg-blue-100' },
    { icon: '🤝', text: 'Volunteer signed up: Sarah', time: '1 hr ago', color: 'bg-pink-100' },
    { icon: '🎁', text: 'Recipient request approved', time: '2 hr ago', color: 'bg-blue-50' },
  ];
  const topDonors = [
    { name: 'Alice', total: '₤500' },
    { name: 'Bob', total: '₤350' },
    { name: 'Carol', total: '₤300' },
    { name: 'David', total: '₤250' },
    { name: 'Eve', total: '₤200' },
  ];
  const recentUsers = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Carol', email: 'carol@example.com' },
    { name: 'David', email: 'david@example.com' },
    { name: 'Eve', email: 'eve@example.com' },
  ];
  const donationsTrend = [
    { day: '2025-11-14', value: 2 },
    { day: '2025-11-15', value: 4 },
    { day: '2025-11-16', value: 3 },
    { day: '2025-11-17', value: 6 },
    { day: '2025-11-18', value: 5 },
    { day: '2025-11-19', value: 7 },
    { day: '2025-11-20', value: 8 },
  ];
  const recentDonations = [
    { food: 'Rice', qty: 10, donor: 'Alice', date: '2025-11-20' },
    { food: 'Beans', qty: 5, donor: 'Bob', date: '2025-11-19' },
    { food: 'Maize', qty: 8, donor: 'Carol', date: '2025-11-19' },
    { food: 'Wheat', qty: 6, donor: 'David', date: '2025-11-18' },
    { food: 'Sugar', qty: 3, donor: 'Eve', date: '2025-11-18' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#fef3c7_0,#d1fae5_35%,#c7d2fe_70%,#0f172a_100%)] px-3 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="admin-fade-up relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950/90 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">Admin Command Center</p>
              <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">Platform oversight, at a glance.</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Monitor system health, manage people, review requests, and keep operations moving from a single coordinated workspace.</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">Last checked: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-emerald-400" onClick={handleAddUser}>
                Add User
              </button>
              <button className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-amber-300" onClick={handleAddDonation}>
                Add Donation
              </button>
              <button className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20" onClick={handleViewReports}>
                View Reports
              </button>
              <button className="rounded-xl border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">System Health</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <span className="inline-block h-3 w-3 rounded-full bg-emerald-400" />
                All services operational
              </div>
              <p className="mt-2 text-xs text-slate-300">Core services are responding normally and admin actions are available.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Pending Queue</p>
              <p className="mt-2 text-3xl font-black text-white">{pendingApprovals.length + miniStats[0].value + miniStats[1].value}</p>
              <p className="mt-1 text-xs text-slate-300">Approvals, reviews, and donation actions waiting attention.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">System Focus</p>
              <p className="mt-2 text-sm font-semibold text-white">Coordinate people, donations, and visibility from one control room.</p>
              <p className="mt-1 text-xs text-slate-300">Designed for fast scanning and rapid action.</p>
            </article>
          </div>
        </section>

        <section className="admin-fade-up grid grid-cols-1 gap-4 md:grid-cols-3" style={{ animationDelay: '120ms' }}>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="h-36 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.webp')" }} />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Platform Snapshot</h3>
              <p className="mt-1 text-xs text-slate-600">A calm visual anchor for the admin workspace.</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <img src={team} alt="Operations team" className="h-36 w-full bg-emerald-50 object-contain" />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Operations Team</h3>
              <p className="mt-1 text-xs text-slate-600">Represents the coordination layer keeping the platform moving.</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <img src={family} alt="Beneficiary outcomes" className="h-36 w-full bg-emerald-50 object-contain" />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Outcome Lens</h3>
              <p className="mt-1 text-xs text-slate-600">Keeps the end-user outcome visible while managing operations.</p>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, index) => (
            <div key={s.title} className="admin-fade-up" style={{ animationDelay: `${120 + index * 60}ms` }}>
              <StatCard {...s} />
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-xl xl:col-span-2" style={{ animationDelay: '420ms' }}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Donation Requests</h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search, review, and act quickly</p>
              </div>
              <input type="text" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none md:w-72" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-2">Recipient</th>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Custom Request</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-500">No requests found.</td></tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-3 font-semibold text-slate-900">{req.recipient}</td>
                        <td className="px-3 py-3 text-slate-700">{req.item}</td>
                        <td className="px-3 py-3 text-slate-700">{req.custom}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{req.status}</span>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{req.date}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            {req.status === 'Pending' && <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Mark Fulfilled</button>}
                            <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">View</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="space-y-6">
            <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl" style={{ animationDelay: '480ms' }}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Recent Activity</h3>
                <span className="text-xs font-semibold text-slate-500">Live feed</span>
              </div>
              <div className="space-y-1">
                {activities.map((a, i) => <ActivityItem key={i} {...a} />)}
              </div>
            </article>

            <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl" style={{ animationDelay: '540ms' }}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Announcements</h3>
                <span className="text-xs font-semibold text-slate-500">System notices</span>
              </div>
              <ul className="space-y-3">
                {announcements.map((a, i) => (
                  <li key={i} className="rounded-2xl bg-slate-50 p-3">
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{a.message}</div>
                    <div className="mt-2 text-xs text-slate-400">{a.date}</div>
                  </li>
                ))}
              </ul>
            </article>
          </aside>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2" style={{ animationDelay: '600ms' }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-700">Donations Trend</h3>
              <span className="text-xs font-semibold text-slate-500">7 day view</span>
            </div>
            <DonationsTrendChart data={donationsTrend} />
          </article>

          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl" style={{ animationDelay: '660ms' }}>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Recent Donations</h3>
            <ul className="mt-3 space-y-3">
              {recentDonations.map((don, idx) => (
                <li key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="font-semibold text-slate-900">{don.food}</div>
                  <div className="mt-1 text-xs text-slate-500">Qty: {don.qty} | Donor: {don.donor}</div>
                  <div className="mt-1 text-xs text-slate-400">{don.date}</div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl" style={{ animationDelay: '720ms' }}>
            <TopDonorsTable donors={topDonors} />
          </article>
          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-white p-5 shadow-xl" style={{ animationDelay: '780ms' }}>
            <RecentUsersList users={recentUsers} />
          </article>
          <article className="admin-fade-up rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl" style={{ animationDelay: '840ms' }}>
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">Leadership Note</h3>
            <p className="mt-3 text-sm text-slate-300">Great platforms feel calm even when the system is busy. This panel keeps operations, people, and outcomes visible without mixing the visual language of the role-based dashboards.</p>
          </article>
        </section>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
              <button onClick={handleUserModalClose} className="absolute right-4 top-3 text-3xl text-slate-400 transition hover:text-rose-600">&times;</button>
              <h2 className="text-2xl font-black text-slate-900">Add User</h2>
              {addUserError && <div className="mt-3 rounded-xl bg-rose-50 p-3 text-rose-700">{addUserError}</div>}
              {addUserSuccess && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-emerald-700">{addUserSuccess}</div>}
              <form onSubmit={handleUserFormSubmit} className="mt-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="username" value={userForm.username} onChange={handleUserFormChange} placeholder="Username" className="rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                  <input name="email" value={userForm.email} onChange={handleUserFormChange} placeholder="Email" className="rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required type="email" />
                </div>
                <input name="password" value={userForm.password} onChange={handleUserFormChange} placeholder="Password" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required type="password" />
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">User Type</label>
                  <select value={userType} onChange={handleUserTypeChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none">
                    <option value="donor">Donor</option>
                    <option value="recipient">Recipient</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="first_name" value={userForm.first_name} onChange={handleUserFormChange} placeholder="First Name" className="rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                  <input name="last_name" value={userForm.last_name} onChange={handleUserFormChange} placeholder="Last Name" className="rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                </div>
                <input name="id_no" value={userForm.id_no} onChange={handleUserFormChange} placeholder="ID Number" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                <input name="phone_number" value={userForm.phone_number} onChange={handleUserFormChange} placeholder="Phone Number" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                <select name="gender" value={userForm.gender} onChange={handleUserFormChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input name="address" value={userForm.address} onChange={handleUserFormChange} placeholder="Address" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-slate-500 focus:outline-none" required />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800">Add User</button>
                  <button type="button" onClick={handleUserModalClose} className="rounded-xl bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-300">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style>{`
          .admin-fade-up {
            opacity: 0;
            transform: translateY(14px);
            animation: adminFadeUp 0.55s ease-out forwards;
          }
          @keyframes adminFadeUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdminDashboard;