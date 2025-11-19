import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecipientDashboard() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchRecipientData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRecipientData = async (token) => {
    try {
      setLoading(true);
      
      const recipientResponse = await axios.get(
        `http://127.0.0.1:8000/recipients/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (recipientResponse.data && recipientResponse.data.length > 0) {
        setRecipient(recipientResponse.data[0]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipient data:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-700 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-emerald-600 animate-ping mx-auto"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading your dashboard...</p>
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
      <header className="bg-gradient-to-r from-green-900 via-emerald-800 to-teal-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg animate-pulse">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Recipient Dashboard</h1>
                <p className="text-emerald-100 mt-2 text-lg">
                  {recipient ? `Welcome, ${recipient.first_name}! 🏠` : 'Welcome to your dashboard'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border border-white/30 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {recipient ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-800 to-emerald-700 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-semibold uppercase tracking-wide">Household Size</p>
                    <p className="text-5xl font-bold mt-2">{recipient.house_hold_size || 0}</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-700 to-teal-700 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-semibold uppercase tracking-wide">Status</p>
                    <p className="text-3xl font-bold mt-2">Active Recipient</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-green-900 hover:shadow-emerald-900/50 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-900 to-emerald-800 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Profile Information</h2>
                    <p className="text-blue-100 font-medium mt-1">Your household and contact details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-700 hover:border-emerald-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Full Name</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{recipient.first_name} {recipient.last_name}</p>
                  </div>

                  <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border-2 border-emerald-700 hover:border-green-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Email</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 break-all">{recipient.email}</p>
                  </div>

                  <div className="group bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl border-2 border-green-800 hover:border-emerald-800 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Phone</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{recipient.phone_number}</p>
                  </div>

                  <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border-2 border-emerald-700 hover:border-green-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Address</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{recipient.address}</p>
                  </div>

                  <div className="group bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-green-900 hover:border-emerald-900 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Household Size</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{recipient.house_hold_size} members</p>
                  </div>

                  <div className="group bg-gradient-to-br from-emerald-100 to-green-200 p-6 rounded-2xl border-2 border-emerald-900 hover:border-green-900 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Disability Status</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{recipient.disability || 'None reported'}</p>
                  </div>
                </div>

                {recipient.house_hold_members && recipient.house_hold_members.length > 0 && (
                  <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-900">
                    <div className="flex items-center space-x-3 mb-4">
                      <svg className="h-6 w-6 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Household Members</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {recipient.house_hold_members.map((member, index) => (
                        <span
                          key={index}
                          className="bg-white px-6 py-3 rounded-full text-sm font-bold text-green-900 shadow-md border-2 border-green-900 hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                          👤 {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-16 text-center border border-gray-200">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 w-32 h-32 mx-auto mb-6">
              <svg className="h-16 w-16 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Profile Found</h3>
            <p className="text-gray-500 text-lg mb-8">Please complete your recipient profile to access your dashboard.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-10 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Complete Profile
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecipientDashboard;
