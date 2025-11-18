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

    if (!token) {
      navigate('/');
      return;
    }

    fetchDonorData(token);
  }, [navigate]);

  const fetchDonorData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch donor profile - backend returns donor for current authenticated user
      const donorResponse = await axios.get(
        `http://127.0.0.1:8000/donors/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (donorResponse.data && donorResponse.data.length > 0) {
        const donorData = donorResponse.data[0];
        setDonor(donorData);
        
        // Fetch donations by this donor
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
              <h1 className="text-3xl font-bold">Donor Dashboard</h1>
              {donor && (
                <p className="text-emerald-100 mt-1">
                  Welcome, {donor.first_name} {donor.last_name}
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
        {donor && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="font-semibold text-gray-800">{donor.first_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="font-semibold text-gray-800">{donor.last_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-800">{donor.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-semibold text-gray-800">{donor.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="font-semibold text-gray-800">{donor.gender}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">ID Number</p>
                <p className="font-semibold text-gray-800">{donor.id_no}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold text-gray-800">{donor.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Company</p>
                <p className="font-semibold text-gray-800">{donor.company}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Company Type</p>
                <p className="font-semibold text-gray-800">{donor.type_of_company}</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 text-sm mb-2">Participating Locations</p>
                <div className="flex flex-wrap gap-2">
                  {donor.participating_locations?.map((location, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 text-sm mb-2">Services Interested In</p>
                <div className="flex flex-wrap gap-2">
                  {donor.services_interested_in?.map((service, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donations Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Donations</h2>
          {donations.length === 0 ? (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-gray-600">No donations yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start making a difference by creating your first donation!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {donation.food_item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {donation.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;
