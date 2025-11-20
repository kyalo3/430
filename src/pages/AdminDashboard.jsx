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

function DonationsTrendChart({ data }) {
  // data: array of { day, value }
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
      <div className="text-lg font-bold text-yellow-700 mb-2">Donations Trend (7d)</div>
      <svg width="120" height="40" viewBox="0 0 120 40">
        {data.map((point, i, arr) =>
          i === 0 ? null : (
            <line
              key={i}
              x1={((i - 1) * 120) / 6}
              y1={40 - (arr[i - 1].value / max) * 35}
              x2={(i * 120) / 6}
              y2={40 - (point.value / max) * 35}
              stroke="#eab308"
              strokeWidth="2"
            />
          )
        )}
      </svg>
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
        {data.map((d, i) => (
          <span key={i}>{d.day.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  // Button handlers (replace with real logic as needed)
  const handleAddUser = () => alert('Add User clicked!');
  const handleAddDonation = () => alert('Add Donation clicked!');
  const handleViewReports = () => alert('View Reports clicked!');
  const handleLogout = () => {
    window.location.href = '/';
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
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>
        <div className="border-t border-emerald-100 mb-10"></div>
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