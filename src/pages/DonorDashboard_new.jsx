import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DonorDashboard() {
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchDonorData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDonorData = async (token) => {
    try {
      setLoading(true);
      
      const donorResponse = await axios.get(
        `http://127.0.0.1:8000/donors/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (donorResponse.data && donorResponse.data.length > 0) {
        const donorData = donorResponse.data[0];
        setDonor(donorData);
        
        const donationsResponse = await axios.get(
          `http://127.0.0.1:8000/donors/${donorData.id}/donations/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setDonations(donationsResponse.data || []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching donor data:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 bg-emerald-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-red-200">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <svg className="h-12 w-12 text-red-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Header with Gradient */}
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-white/30 transform hover:scale-110 transition-all duration-300">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight">Donor Dashboard</h1>
                  <p className="text-emerald-100 mt-2 text-xl">Welcome back, <span className="font-semibold">{donor?.first_name || 'Donor'}</span>! 👋</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/30 hover:shadow-2xl"
            >
              <span className="flex items-center space-x-2">
                <span>Logout</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 font-semibold uppercase tracking-wide text-sm">Total Donations</p>
                <p className="text-5xl font-bold mt-2">{donations.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-orange-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-semibold uppercase tracking-wide text-sm">Impact Score</p>
                <p className="text-5xl font-bold mt-2">A+</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-semibold uppercase tracking-wide text-sm">Active Locations</p>
                <p className="text-5xl font-bold mt-2">{donor?.participating_locations?.length || 0}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card with Enhanced Design */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-emerald-100 hover:shadow-emerald-200/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-5">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 shadow-xl transform hover:rotate-6 transition-all duration-300">
                  <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-800">Profile Information</h2>
                  <p className="text-emerald-600 font-semibold mt-2 text-lg">Your donor details and contributions</p>
                </div>
              </div>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-all duration-200">
                ✨ Active Donor
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Full Name</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">{donor?.first_name} {donor?.last_name}</p>
              </div>

              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Email</p>
                </div>
                <p className="text-lg font-semibold text-gray-800 break-all">{donor?.email || 'Not provided'}</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-purple-700 uppercase tracking-wide">Phone</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{donor?.phone_number || 'Not provided'}</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">Company</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{donor?.company || 'Not provided'}</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-200 hover:border-pink-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-pink-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-pink-700 uppercase tracking-wide">Company Type</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{donor?.type_of_company || 'Not provided'}</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-indigo-500 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Address</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">{donor?.address || 'Not provided'}</p>
              </div>
            </div>

            {donor?.participating_locations && donor.participating_locations.length > 0 && (
              <div className="mt-10 bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-3xl border-2 border-teal-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-teal-500 p-3 rounded-xl">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-teal-700 uppercase tracking-wide">Participating Locations</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {donor.participating_locations.map((location, index) => (
                    <span
                      key={index}
                      className="bg-white px-6 py-3 rounded-full text-sm font-bold text-teal-700 shadow-lg border-2 border-teal-300 hover:shadow-xl hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      📍 {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {donor?.services_interested_in && donor.services_interested_in.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-purple-700 uppercase tracking-wide">Services Interested In</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {donor.services_interested_in.map((service, index) => (
                    <span
                      key={index}
                      className="bg-white px-6 py-3 rounded-full text-sm font-bold text-purple-700 shadow-lg border-2 border-purple-300 hover:shadow-xl hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      ✨ {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donations Section with Beautiful Design */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-orange-100 hover:shadow-orange-200/50 transition-all duration-300">
          <div className="flex items-center space-x-5 mb-10">
            <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-5 shadow-xl transform hover:rotate-6 transition-all duration-300">
              <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">My Donations</h2>
              <p className="text-orange-600 font-semibold mt-2 text-lg">Track your generous contributions</p>
            </div>
          </div>

          {donations.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border-2 border-gray-200 shadow-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-orange-600 to-pink-600">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Item</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation, index) => (
                    <tr key={donation.id || index} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 transform hover:scale-[1.02]">
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-800">{donation.item_name}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-600">{donation.quantity}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="px-5 py-2 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-200">
                          {donation.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="px-5 py-2 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border-2 border-green-200">
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-600">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No donations yet</h3>
              <p className="text-gray-500 text-lg mb-8">Start making a difference by creating your first donation!</p>
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="flex items-center space-x-2">
                  <span>Create Donation</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default DonorDashboard;
