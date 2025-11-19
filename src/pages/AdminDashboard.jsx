import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
      // Example activity feed (combine donations, reviews, contacts)
      const [activityFeed, setActivityFeed] = useState([]);

      useEffect(() => {
        // Example: Combine donations, reviews, contacts for activity feed (mocked for now)
        const feed = [];
        donations.slice(0, 3).forEach(d => feed.push({
          type: 'Donation',
          message: `Donation of ${d.quantity} ${d.food_item} by Donor ${d.donor_id}`,
          date: d.created_at || ''
        }));
        reviews.slice(0, 3).forEach(r => feed.push({
          type: 'Review',
          message: `Review: "${r.title}" (${r.rating}★)`,
          date: r.created_at || ''
        }));
        contacts.slice(0, 3).forEach(c => feed.push({
          type: 'Contact',
          message: `Contact from ${c.name}: ${c.message.substring(0, 30)}...`,
          date: c.created_at || ''
        }));
        setActivityFeed(feed.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
      }, [donations, reviews, contacts]);
    // New state for reviews, contacts, users
    const [reviews, setReviews] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState([]);
    const [topDonors, setTopDonors] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);

    // Fetch recent reviews, contacts, users, top donors, user growth
    useEffect(() => {
      // Example: Fetch recent reviews
      axios.get('http://127.0.0.1:8000/reviews/user/1') // Replace '1' with admin or aggregate endpoint
        .then(res => setReviews(res.data.slice(-5).reverse()))
        .catch(() => setReviews([]));

      // Example: Fetch recent contacts (assuming endpoint exists)
      axios.get('http://127.0.0.1:8000/contact/')
        .then(res => setContacts(res.data.slice(-5).reverse()))
        .catch(() => setContacts([]));

      // Example: Fetch users (assuming endpoint exists)
      // axios.get('http://127.0.0.1:8000/users/')
      //   .then(res => setUsers(res.data))
      //   .catch(() => setUsers([]));

      // Example: Fetch top donors (assuming endpoint exists)
      // axios.get('http://127.0.0.1:8000/donors/top')
      //   .then(res => setTopDonors(res.data))
      //   .catch(() => setTopDonors([]));

      // Example: Fetch user growth (assuming endpoint exists)
      // axios.get('http://127.0.0.1:8000/users/growth')
      //   .then(res => setUserGrowth(res.data))
      //   .catch(() => setUserGrowth([]));
    }, []);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showDonations, setShowDonations] = useState(false);
  const [showDonors, setShowDonors] = useState(false);
  const [showRecipients, setShowRecipients] = useState(false);


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
      setDonors(donorsRes.data || []);
      setRecipients(recipientsRes.data || []);
      setDonations(donations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.detail || 'Failed to load admin data');
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-900 border-opacity-50 mb-4"></div>
          <span className="text-green-900 text-xl font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-green-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-green-800 font-medium">Welcome, Admin! Here is an overview of the platform activity.</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-200"
          >
            Logout
          </button>
        </div>
        {/* Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

              {/* Recent Reviews Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4">Recent Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="text-gray-500">No recent reviews found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review, idx) => (
                      <div key={review.id || idx} className="bg-white rounded-xl shadow p-4 border-l-4 border-green-400">
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 font-bold mr-2">{'★'.repeat(review.rating)}</span>
                          <span className="text-gray-700 font-semibold">{review.title}</span>
                        </div>
                        <div className="text-gray-600 mb-2">{review.content}</div>
                        <div className="text-xs text-gray-400">User: {review.user_id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Contacts Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4">Recent Contact Messages</h2>
                {contacts.length === 0 ? (
                  <div className="text-gray-500">No recent contact messages found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact, idx) => (
                      <div key={contact.id || idx} className="bg-white rounded-xl shadow p-4 border-l-4 border-emerald-400">
                        <div className="font-semibold text-green-800 mb-1">{contact.name}</div>
                        <div className="text-xs text-gray-400 mb-2">{contact.email}</div>
                        <div className="text-gray-600 mb-2">{contact.message}</div>
                        <div className="text-xs text-gray-400">{contact.created_at}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MongoDB Insights Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4">Platform Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Growth Example */}
                  <div className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-400">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">User Growth (Example)</h3>
                    {/* Replace with chart or real data if available */}
                    <div className="text-gray-600">{userGrowth.length > 0 ? userGrowth.join(', ') : 'User growth data not available.'}</div>
                  </div>
                  {/* Top Donors Example */}
                  <div className="bg-white rounded-xl shadow p-6 border-t-4 border-yellow-400">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-2">Top Donors (Example)</h3>
                    <ul className="list-disc pl-5">
                      {topDonors.length > 0 ? topDonors.map((donor, idx) => (
                        <li key={donor.id || idx} className="text-gray-700">{donor.first_name} {donor.last_name} ({donor.company})</li>
                      )) : <li className="text-gray-600">Top donors data not available.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-600">
              <span className="text-3xl font-bold text-green-700 mb-2">{stats.totalDonors}</span>
              <span className="text-lg text-green-900 font-semibold">Total Donors</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-emerald-600">
              <span className="text-3xl font-bold text-emerald-700 mb-2">{stats.totalRecipients}</span>
              <span className="text-lg text-green-900 font-semibold">Total Recipients</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-teal-600">
              <span className="text-3xl font-bold text-teal-700 mb-2">{stats.totalVolunteers}</span>
              <span className="text-lg text-green-900 font-semibold">Total Volunteers</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-yellow-500">
              <span className="text-3xl font-bold text-yellow-600 mb-2">{stats.totalDonations}</span>
              <span className="text-lg text-green-900 font-semibold">Total Donations</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-500">
              <span className="text-3xl font-bold text-blue-700 mb-2">{stats.activeDonations}</span>
              <span className="text-lg text-green-900 font-semibold">Active Donations</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-gray-500">
              <span className="text-3xl font-bold text-gray-700 mb-2">{stats.completedDonations}</span>
              <span className="text-lg text-green-900 font-semibold">Completed Donations</span>
            </div>
          </div>
        )}
        {error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow mb-8">{error}</div>
        ) : stats ? (
          <>
            {/* Place the detailed tables here, after the main dashboard content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Donations Table */}
              <div className="mb-8">
                <button
                  className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 mb-2"
                  onClick={() => setShowDonations((v) => !v)}
                >
                  {showDonations ? 'Hide' : 'Show'} Latest Donations
                </button>
                {showDonations && (
                  <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-bold text-green-900 mb-4">Latest 10 Donations</h2>
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-left">Food Item</th>
                          <th className="py-2 px-4 text-left">Brand</th>
                          <th className="py-2 px-4 text-left">Description</th>
                          <th className="py-2 px-4 text-left">Quantity</th>
                          <th className="py-2 px-4 text-left">Price</th>
                          <th className="py-2 px-4 text-left">Donor ID</th>
                          <th className="py-2 px-4 text-left">Recipient ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.slice(-10).reverse().map((don, idx) => (
                          <tr key={don.id || idx} className="border-b last:border-b-0">
                            <td className="py-2 px-4">{don.food_item}</td>
                            <td className="py-2 px-4">{don.brand}</td>
                            <td className="py-2 px-4">{don.description}</td>
                            <td className="py-2 px-4">{don.quantity}</td>
                            <td className="py-2 px-4">{don.price}</td>
                            <td className="py-2 px-4">{don.donor_id}</td>
                            <td className="py-2 px-4">{don.recipient_id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Donors Table */}
              <div className="mb-8">
                <button
                  className="bg-gradient-to-r from-emerald-700 to-green-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 mb-2"
                  onClick={() => setShowDonors((v) => !v)}
                >
                  {showDonors ? 'Hide' : 'Show'} Latest Donors
                </button>
                {showDonors && (
                  <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-bold text-green-900 mb-4">Latest 10 Donors</h2>
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-left">First Name</th>
                          <th className="py-2 px-4 text-left">Last Name</th>
                          <th className="py-2 px-4 text-left">Email</th>
                          <th className="py-2 px-4 text-left">Phone</th>
                          <th className="py-2 px-4 text-left">Company</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.slice(-10).reverse().map((d, idx) => (
                          <tr key={d.id || idx} className="border-b last:border-b-0">
                            <td className="py-2 px-4">{d.first_name}</td>
                            <td className="py-2 px-4">{d.last_name}</td>
                            <td className="py-2 px-4">{d.email}</td>
                            <td className="py-2 px-4">{d.phone_number}</td>
                            <td className="py-2 px-4">{d.company}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Recipients Table */}
              <div className="mb-8">
                <button
                  className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 mb-2"
                  onClick={() => setShowRecipients((v) => !v)}
                >
                  {showRecipients ? 'Hide' : 'Show'} Latest Recipients
                </button>
                {showRecipients && (
                  <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
                    <h2 className="text-xl font-bold text-green-900 mb-4">Latest 10 Recipients</h2>
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-left">First Name</th>
                          <th className="py-2 px-4 text-left">Last Name</th>
                          <th className="py-2 px-4 text-left">Email</th>
                          <th className="py-2 px-4 text-left">Phone</th>
                          <th className="py-2 px-4 text-left">Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipients.slice(-10).reverse().map((r, idx) => (
                          <tr key={r.id || idx} className="border-b last:border-b-0">
                            <td className="py-2 px-4">{r.first_name}</td>
                            <td className="py-2 px-4">{r.last_name}</td>
                            <td className="py-2 px-4">{r.email}</td>
                            <td className="py-2 px-4">{r.phone_number}</td>
                            <td className="py-2 px-4">{r.address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>
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
      </div>
    </div>
  );
}

export default AdminDashboard;