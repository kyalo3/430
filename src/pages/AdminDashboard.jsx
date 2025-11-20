import React from 'react';

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
      const token = localStorage.getItem('token');
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
      const res = await fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to add user');
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 py-10 px-2">
      <div className="max-w-6xl mx-auto">
        {/* Title at the very top */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4 relative">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-1">Admin Dashboard</h1>
            <p className="text-emerald-100 text-base">Welcome, Admin! Here’s a quick overview of your system.</p>
          </div>
          <button
            className="absolute right-0 top-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all md:static md:ml-auto md:mt-0"
            onClick={handleLogout}
            style={{ minWidth: 110 }}
          >
            Logout
          </button>
        </div>
        {/* System Health & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[220px]">
            <div className="text-2xl font-bold text-green-700 mb-1">System Health</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-green-700 font-semibold">All Services Operational</span>
            </div>
            <div className="text-xs text-gray-400">Last checked: {new Date().toLocaleTimeString()}</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all"
              onClick={handleAddUser}
            >
              Add User
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all"
              onClick={handleAddDonation}
            >
              Add Donation
            </button>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all"
              onClick={handleViewReports}
            >
              View Reports
            </button>
          </div>

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
                <button onClick={handleUserModalClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-emerald-800">Add User</h2>
                {addUserError && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{addUserError}</div>}
                {addUserSuccess && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{addUserSuccess}</div>}
                <form onSubmit={handleUserFormSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input name="username" value={userForm.username} onChange={handleUserFormChange} placeholder="Username" className="border p-2 rounded w-1/2" required />
                    <input name="email" value={userForm.email} onChange={handleUserFormChange} placeholder="Email" className="border p-2 rounded w-1/2" required type="email" />
                  </div>
                  <input name="password" value={userForm.password} onChange={handleUserFormChange} placeholder="Password" className="border p-2 rounded w-full" required type="password" />
                  <div>
                    <label className="block font-semibold mb-1">User Type</label>
                    <select value={userType} onChange={handleUserTypeChange} className="border p-2 rounded w-full">
                      <option value="donor">Donor</option>
                      <option value="recipient">Recipient</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input name="first_name" value={userForm.first_name} onChange={handleUserFormChange} placeholder="First Name" className="border p-2 rounded w-1/2" required />
                    <input name="last_name" value={userForm.last_name} onChange={handleUserFormChange} placeholder="Last Name" className="border p-2 rounded w-1/2" required />
                  </div>
                  <input name="id_no" value={userForm.id_no} onChange={handleUserFormChange} placeholder="ID Number" className="border p-2 rounded w-full" required />
                  <input name="phone_number" value={userForm.phone_number} onChange={handleUserFormChange} placeholder="Phone Number" className="border p-2 rounded w-full" required />
                  <select name="gender" value={userForm.gender} onChange={handleUserFormChange} className="border p-2 rounded w-full" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input name="address" value={userForm.address} onChange={handleUserFormChange} placeholder="Address" className="border p-2 rounded w-full" required />
                  <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded font-semibold">Add User</button>
                    <button type="button" onClick={handleUserModalClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>
        <div className="border-t border-emerald-100 mb-10"></div>

        {/* Donation Requests Management */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h2 className="text-lg font-bold text-emerald-700">Donation Requests</h2>
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="px-2 py-1 text-left">Recipient</th>
                  <th className="px-2 py-1 text-left">Item</th>
                  <th className="px-2 py-1 text-left">Custom Request</th>
                  <th className="px-2 py-1 text-left">Status</th>
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-4">No requests found.</td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b last:border-b-0">
                      <td className="px-2 py-1 font-semibold text-green-800">{req.recipient}</td>
                      <td className="px-2 py-1">{req.item}</td>
                      <td className="px-2 py-1">{req.custom}</td>
                      <td className="px-2 py-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{req.status}</span>
                      </td>
                      <td className="px-2 py-1">{req.date}</td>
                      <td className="px-2 py-1 flex gap-2">
                        {req.status === 'Pending' && <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs">Mark Fulfilled</button>}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Activity Timeline */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col">
              <h2 className="text-lg font-bold text-emerald-900 mb-4">Recent Activity</h2>
              <div className="flex-1 flex flex-col gap-2">
                {activities.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            </div>
          </div>
          {/* Top Donors Table */}
          <div className="flex flex-col h-full">
            <TopDonorsTable donors={topDonors} />
          </div>
          {/* Recent Users List */}
          <div className="flex flex-col h-full">
            <RecentUsersList users={recentUsers} />
          </div>
        </div>
        {/* Donations Trend Chart and Recent Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DonationsTrendChart data={donationsTrend} />
          <div className="flex flex-col gap-6">
            <div className="bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900 p-6 rounded-xl shadow flex flex-col justify-center items-center">
              <span className="italic font-semibold text-lg mb-2">“Great leaders don’t set out to be a leader… they set out to make a difference. It’s never about the role – always about the goal.”</span>
              <span className="block text-emerald-700">— Lisa Haisha</span>
            </div>
            {/* Recent Feedback Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-emerald-700 mb-4">Recent Feedback</h2>
              <ul className="divide-y">
                <li className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="font-bold text-gray-700">“Great donation process, very smooth!”</span>
                    <span className="text-xs text-gray-400 ml-2">- Alice, 2025-11-20</span>
                  </div>
                </li>
                <li className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="font-bold text-gray-700">“Appreciate the quick response from support.”</span>
                    <span className="text-xs text-gray-400 ml-2">- Bob, 2025-11-19</span>
                  </div>
                </li>
                <li className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="font-bold text-gray-700">“Would love to see more food variety.”</span>
                    <span className="text-xs text-gray-400 ml-2">- Carol, 2025-11-18</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-100 mb-10"></div>
        {/* Announcements Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-blue-700 mb-4">System Announcements</h2>
            <ul className="divide-y">
              {announcements.map((a, i) => (
                <li key={i} className="py-3">
                  <div className="font-semibold text-emerald-800">{a.title}</div>
                  <div className="text-gray-700 mb-1">{a.message}</div>
                  <div className="text-xs text-gray-400">{a.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Recent Donations List */}
        <div className="bg-white rounded-xl shadow p-6 mt-10">
          <h2 className="text-lg font-bold text-green-900 mb-4">Recent Donations</h2>
          <ul className="space-y-3">
            {recentDonations.map((don, idx) => (
              <li key={idx} className="border-l-4 border-yellow-400 pl-4">
                <div className="font-semibold text-yellow-800">{don.food}</div>
                <div className="text-xs text-gray-400">Qty: {don.qty} | Donor: {don.donor} | {don.date}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-10"></div>
      </div>
    </div>
  );
}

export default AdminDashboard;