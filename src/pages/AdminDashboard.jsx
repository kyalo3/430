import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAdminData(token);
    } else {
      // Set demo stats for viewing without login
      setStats({
        totalDonors: 156,
        totalRecipients: 89,
        totalVolunteers: 42,
        totalDonations: 234,
        activeDonations: 45,
        completedDonations: 189
      });
      setLoading(false);
    }
  }, []);

  const fetchAdminData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch all data for admin statistics
      const [donorsRes, recipientsRes, volunteersRes, donationsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/donors/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/recipients/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/volunteers/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/donations/', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const donations = donationsRes.data || [];
      const activeDonations = donations.filter(d => d.status === 'Active' || d.status === 'Pending').length;
      const completedDonations = donations.filter(d => d.status === 'Completed').length;

      setStats({
        totalDonors: donorsRes.data?.length || 0,
        totalRecipients: recipientsRes.data?.length || 0,
        totalVolunteers: volunteersRes.data?.length || 0,
        totalDonations: donations.length,
        activeDonations,
        completedDonations
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.detail || 'Failed to load admin data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-700 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-emerald-600 animate-ping mx-auto"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-red-200">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold mb-3 text-gray-800">Oops! Something went wrong</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      {/* Header */}
      <header className="bg-white rounded-[2rem] shadow-xl mt-6 mb-10 mx-auto max-w-5xl px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="bg-gradient-to-br from-green-900 to-emerald-800 p-4 rounded-2xl shadow-md flex items-center justify-center">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">System Overview & Management</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-green-800 to-emerald-700 hover:from-green-900 hover:to-emerald-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2 mt-8 md:mt-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {stats ? (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Donations Card */}
              <div className="rounded-xl bg-gradient-to-br from-green-800 to-emerald-700 shadow-lg p-6 flex flex-col justify-between min-h-[140px] w-full max-w-xs transform hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-1">Total Donations</p>
                    <p className="text-4xl font-extrabold text-white mb-1">{stats.totalDonations}</p>
                    <p className="text-white/80 text-xs">All donations processed</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/30 rounded-full p-3 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 z-0">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              {/* Donors Card */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-teal-700 shadow-lg p-6 flex flex-col justify-between min-h-[140px] w-full max-w-xs transform hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-1">Donors</p>
                    <p className="text-4xl font-extrabold text-white mb-1">{stats.totalDonors}</p>
                    <p className="text-white/80 text-xs">Active contributors</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/30 rounded-full p-3 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 z-0">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              {/* Recipients Card */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg p-6 flex flex-col justify-between min-h-[140px] w-full max-w-xs transform hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-1">Recipients</p>
                    <p className="text-4xl font-extrabold text-white mb-1">{stats.totalRecipients}</p>
                    <p className="text-white/80 text-xs">Receiving support</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/30 rounded-full p-3 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 z-0">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Volunteers Card */}
              <div className="rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg p-6 flex flex-col justify-between min-h-[140px] w-full max-w-xs transform hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-1">Volunteers</p>
                    <p className="text-4xl font-extrabold text-white mb-1">{stats.totalVolunteers}</p>
                    <p className="text-white/80 text-xs">Helping hands</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-white/30 rounded-full p-3 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 z-0">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Donation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-900 hover:shadow-emerald-900/50 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-900 to-emerald-800 px-6 py-4">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active Donations
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-6xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">{stats.activeDonations}</p>
                  <p className="text-gray-600 mt-3 text-lg">Currently active and pending donations</p>
                  <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-semibold">Status</span>
                      <span className="bg-green-900 text-white px-4 py-1 rounded-full text-sm font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-900 hover:shadow-emerald-900/50 transition-all duration-300">
                <div className="bg-gradient-to-r from-green-800 to-emerald-700 px-6 py-4">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed Donations
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-6xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">{stats.completedDonations}</p>
                  <p className="text-gray-600 mt-3 text-lg">Successfully completed donations</p>
                  <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-900 font-semibold">Status</span>
                      <span className="bg-green-900 text-white px-4 py-1 rounded-full text-sm font-bold">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-900">
              <div className="bg-gradient-to-r from-green-900 to-emerald-800 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-900 rounded-2xl p-3">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">System Overview</h2>
                    <p className="text-emerald-100 font-medium mt-1">Platform health & metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-900">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-green-900 font-bold text-lg">Donors</h4>
                      <div className="bg-green-900 rounded-full p-2">
                        <svg className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-green-900">{stats.totalDonors}</p>
                    <p className="text-emerald-600 text-sm mt-2">Active contributors</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl border-2 border-green-900">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-green-900 font-bold text-lg">Recipients</h4>
                      <div className="bg-green-900 rounded-full p-2">
                        <svg className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-green-900">{stats.totalRecipients}</p>
                    <p className="text-emerald-600 text-sm mt-2">Receiving support</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-900">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-green-900 font-bold text-lg">Volunteers</h4>
                      <div className="bg-green-900 rounded-full p-2">
                        <svg className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-green-900">{stats.totalVolunteers}</p>
                    <p className="text-emerald-600 text-sm mt-2">Helping hands</p>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-900 font-bold text-xl mb-2">Platform Impact</h4>
                      <p className="text-emerald-600">
                        <span className="font-bold text-2xl text-green-900">{stats.totalDonations}</span> donations processed
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-4">
                      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-200">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 w-32 h-32 mx-auto mb-6">
              <svg className="h-16 w-16 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Data Available</h3>
            <p className="text-gray-500 text-lg mb-8">Unable to load system statistics.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
