import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';


function VolunteerDashboard() {
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchVolunteerData(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchVolunteerData(token) {
    try {
      setLoading(true);
      const volunteerResponse = await axios.get(
        `http://127.0.0.1:8000/volunteers/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (volunteerResponse.data && volunteerResponse.data.length > 0) {
        setVolunteer(volunteerResponse.data[0]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  // Loading spinner (optional, can be simplified)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-700 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-emerald-600 animate-ping mx-auto"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-100">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state (optional, can be styled similarly)
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-green-900">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <FaUser className="w-12 h-12 text-green-900 mx-auto" />
            </div>
            <p className="text-2xl font-bold mb-3 text-green-900">Oops! Something went wrong</p>
            <p className="text-emerald-600 mb-6">{error}</p>
            <button
              onClick={handleLogout}
              className="bg-green-800 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard style (matches Recipient Dashboard reference)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <header className="flex items-center justify-between px-8 py-6 max-w-full">
        <div className="flex items-center space-x-4">
          <div className="bg-green-800 rounded-xl p-3 flex items-center justify-center">
            <FaUser className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Volunteer Dashboard</h1>
            <p className="text-emerald-100 text-base mt-1">Welcome to your dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border border-emerald-200 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 hover:border-emerald-300 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </header>

      <main className="flex items-center justify-center min-h-[70vh] px-2">
        <div className="bg-[#f4fcfa] w-full max-w-5xl rounded-2xl shadow-xl p-8 md:p-16 flex flex-col items-center">
          {volunteer ? (
            <>
              <div className="bg-green-100 rounded-full p-8 w-32 h-32 flex items-center justify-center mb-6">
                <FaUser className="h-16 w-16 text-green-900" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">Welcome, {volunteer.first_name}!</h2>
              <p className="text-emerald-700 text-lg mb-6">Thank you for volunteering. Here is your profile information:</p>
              <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-base font-semibold text-green-900 mb-1">Full Name</p>
                  <p className="text-lg text-emerald-900 mb-3">{volunteer.first_name} {volunteer.last_name}</p>
                  <p className="text-base font-semibold text-green-900 mb-1">Email</p>
                  <p className="text-lg text-emerald-900 mb-3 break-all">{volunteer.email}</p>
                  <p className="text-base font-semibold text-green-900 mb-1">Phone</p>
                  <p className="text-lg text-emerald-900 mb-3">{volunteer.phone_number}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-green-900 mb-1">Location</p>
                  <p className="text-lg text-emerald-900 mb-3">{volunteer.location}</p>
                  <p className="text-base font-semibold text-green-900 mb-1">Skills</p>
                  <p className="text-lg text-emerald-900 mb-3">{volunteer.skills?.join(', ') || 'N/A'}</p>
                  <p className="text-base font-semibold text-green-900 mb-1">Gender</p>
                  <p className="text-lg text-emerald-900 mb-3">{volunteer.gender}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-100 rounded-full p-8 w-32 h-32 flex items-center justify-center mb-6">
                <FaUser className="h-16 w-16 text-green-900" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">No Profile Found</h2>
              <p className="text-emerald-700 text-lg mb-6 text-center">Please complete your volunteer profile to access your dashboard.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-green-800 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all duration-200"
              >
                Complete Profile
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default VolunteerDashboard;
