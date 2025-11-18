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

    if (!token) {
      navigate('/');
      return;
    }

    fetchRecipientData(token);
  }, [navigate]);

  const fetchRecipientData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch recipient profile - backend returns recipient for current authenticated user
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
              <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
              {recipient && (
                <p className="text-emerald-100 mt-1">
                  Welcome, {recipient.first_name} {recipient.last_name}
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
        {recipient ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="font-semibold text-gray-800">{recipient.first_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="font-semibold text-gray-800">{recipient.last_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-800">{recipient.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-semibold text-gray-800">{recipient.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="font-semibold text-gray-800">{recipient.gender}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">ID Number</p>
                <p className="font-semibold text-gray-800">{recipient.id_no}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold text-gray-800">{recipient.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Household Size</p>
                <p className="font-semibold text-gray-800">{recipient.house_hold_size} members</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 text-sm mb-2">Household Members</p>
                <div className="flex flex-wrap gap-2">
                  {recipient.house_hold_members?.map((member, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Disability Status</p>
                <p className="font-semibold text-gray-800">
                  {recipient.disability ? (
                    <span className="text-orange-600">Yes</span>
                  ) : (
                    <span className="text-green-600">No</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p className="mt-4 text-gray-600">No recipient profile found</p>
            <p className="text-sm text-gray-500 mt-2">
              Please complete your profile to start receiving donations
            </p>
          </div>
        )}

        {/* Available Donations Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Donations</h2>
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="mt-4 text-gray-600">No available donations at this time</p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for new donation opportunities
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecipientDashboard;
