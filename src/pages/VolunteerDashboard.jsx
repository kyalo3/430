import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VolunteerDashboard() {
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    fetchVolunteerData(token);
  }, [navigate]);

  const fetchVolunteerData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch volunteer profile - backend returns volunteer for current authenticated user
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
      console.error('Error fetching volunteer data:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-emerald-700 text-white px-6 py-2 rounded hover:bg-emerald-800"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
              {volunteer && (
                <p className="text-emerald-100 mt-1">
                  Welcome, {volunteer.first_name} {volunteer.last_name}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-emerald-700 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        {volunteer && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="font-semibold text-gray-800">{volunteer.first_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="font-semibold text-gray-800">{volunteer.last_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-800">{volunteer.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-semibold text-gray-800">{volunteer.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="font-semibold text-gray-800">{volunteer.gender}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">ID Number</p>
                <p className="font-semibold text-gray-800">{volunteer.id_no}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold text-gray-800">{volunteer.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-emerald-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Hours Volunteered</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-orange-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">People Helped</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-gray-600">No upcoming tasks</p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for new volunteer opportunities
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VolunteerDashboard;
