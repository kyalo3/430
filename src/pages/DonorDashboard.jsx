import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Replace with real data fetching in production
const initialDonor = {
  id: '',
  user_id: 'replace_with_real_user_id',
  first_name: '',
  last_name: '',
  email: '',
  id_no: '',
  phone_number: '',
  gender: '',
  address: '',
  company: '',
  services_interested_in: [],
  participating_locations: [],
  type_of_company: '',
  household_size: 0,
  aid_received: 0,
  events_attended: 0,
  recent_aid: [],
  recent_events: [],
};

function DonorDashboard() {
  const { currentUser, userRole } = useContext(AuthContext);
  const [donor, setDonor] = useState(initialDonor);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...initialDonor });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const [donationForm, setDonationForm] = useState({
    food_item: '',
    brand: '',
    description: '',
    quantity: '',
    price: '',
    recipient_id: '',
  });
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState('');
  const [donationSuccess, setDonationSuccess] = useState('');

  // Fetch donations for this donor from backend
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!currentUser?.id || currentUser.id === 'replace_with_real_id') return;
      const res = await axios.get(
        `http://127.0.0.1:8000/donors/${currentUser.id}/donations/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations(res.data || []);
    } catch (err) {
      setDonations([]);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [currentUser?.id]);

  // Handle new donation form input
  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new donation submit
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setDonationLoading(true);
    setDonationError('');
    setDonationSuccess('');

    if (
      !donationForm.food_item.trim() ||
      !donationForm.brand.trim() ||
      !donationForm.description.trim() ||
      !donationForm.quantity ||
      isNaN(Number(donationForm.quantity)) || Number(donationForm.quantity) < 1 ||
      !donationForm.price ||
      isNaN(Number(donationForm.price)) || Number(donationForm.price) < 0 ||
      !donationForm.recipient_id.trim()
    ) {
      setDonationError('Please fill in all fields with valid values. Quantity must be at least 1 and price must be 0 or more.');
      setDonationLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!currentUser?.id || currentUser.id === 'replace_with_real_id') throw new Error('Invalid donor ID');
      const payload = {
        ...donationForm,
        quantity: Number(donationForm.quantity),
        price: Number(donationForm.price),
        donor_id: currentUser.id,
      };
      await axios.post(
        'http://127.0.0.1:8000/donations/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonationSuccess('Donation added successfully!');
      setDonationForm({ food_item: '', brand: '', description: '', quantity: '', price: '', recipient_id: '' });
      fetchDonations();
    } catch (err) {
      setDonationError(err.response?.data?.detail || 'Failed to add donation');
    } finally {
      setDonationLoading(false);
    }
  };

  // Handle profile form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.split(',').map((v) => v.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const donorId = currentUser?.id;
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        id_no: form.id_no,
        phone_number: form.phone_number,
        gender: form.gender,
        address: form.address,
        company: form.company,
        services_interested_in: form.services_interested_in,
        participating_locations: form.participating_locations,
        type_of_company: form.type_of_company,
      };
      await axios.put(
        `http://127.0.0.1:8000/donors/${donorId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonor((prev) => ({ ...prev, ...payload }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Donor Dashboard</h1>
            <p className="text-emerald-100 text-base">Welcome, {currentUser?.username|| ''}!</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button
              className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              onClick={() => setEditMode((m) => !m)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              className="bg-emerald-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              onClick={() => window.location.href = '/'}
            >
              Logout
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              onClick={() => setEditMode(true)}
              disabled={editMode}
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900 p-4 rounded-xl shadow mb-8 text-center">
          <span className="italic font-semibold">“The meaning of life is to find your gift. The purpose of life is to give it away.”</span>
          <span className="block mt-2 text-emerald-700">— Pablo Picasso</span>
        </div>

        {/* Profile Card or Edit Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Fields */}
                <div>
                  <label className="block text-green-900 font-semibold mb-1">First Name</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Last Name</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required type="email" />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">ID Number</label>
                  <input name="id_no" value={form.id_no} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Phone Number</label>
                  <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded p-2">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Company</label>
                  <input name="company" value={form.company} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Services Interested In (comma separated)</label>
                  <input name="services_interested_in" value={form.services_interested_in.join(', ')} onChange={handleArrayChange} className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Participating Locations (comma separated)</label>
                  <input name="participating_locations" value={form.participating_locations.join(', ')} onChange={handleArrayChange} className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Type of Company</label>
                  <input name="type_of_company" value={form.type_of_company} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button type="submit" className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                {success && <span className="text-green-700 font-semibold">{success}</span>}
                {error && <span className="text-red-600 font-semibold">{error}</span>}
              </div>
            </form>
          ) : (
            <>
              {/* Display Profile */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                  <span role="img" aria-label="donor" className="text-6xl" style={{ color: '#26a69a' }}>💝</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-900 mb-1">{currentUser?.first_name || ''} {currentUser?.last_name || ''}</div>
                  <div className="text-emerald-900 mb-1">{currentUser?.email || ''}</div>
                  <div className="text-emerald-900 mb-1">{currentUser?.phone_number || ''}</div>
                  <div className="text-emerald-900 mb-1">{currentUser?.address || ''}</div>
                  <div className="text-emerald-900 mb-1">{currentUser?.gender || ''}</div>
                  <div className="text-emerald-900 mb-1">ID: {currentUser?.id_no || ''}</div>
                  <div className="text-emerald-900 mb-1">Company: {currentUser?.company || ''}</div>
                  <div className="text-emerald-900 mb-1">Services: {(currentUser?.services_interested_in || []).join(', ')}</div>
                  <div className="text-emerald-900 mb-1">Locations: {(currentUser?.participating_locations || []).join(', ')}</div>
                  <div className="text-emerald-900 mb-1">Type: {currentUser?.type_of_company || ''}</div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-emerald-50 rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-green-900">{currentUser?.household_size ?? ''}</div>
                  <div className="text-emerald-800 mt-1">Household Size</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-green-900">{currentUser?.aid_received ?? ''}</div>
                  <div className="text-emerald-800 mt-1">Aid Received</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-green-900">{currentUser?.events_attended ?? ''}</div>
                  <div className="text-emerald-800 mt-1">Events Attended</div>
                </div>
              </div>

              {/* Recent Aid Section */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-green-900 mb-2">Recent Aid Received</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-xl">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 text-left text-emerald-800">Type</th>
                        <th className="py-2 px-4 text-left text-emerald-800">Date</th>
                        <th className="py-2 px-4 text-left text-emerald-800">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentUser?.recent_aid || []).map((aid, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="py-2 px-4">{aid.type || ''}</td>
                          <td className="py-2 px-4">{aid.date || ''}</td>
                          <td className="py-2 px-4">{aid.details || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Events Attended Section */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-green-900 mb-2">Events Attended</h3>
                <ul className="list-disc pl-6 text-emerald-900">
                  {(currentUser?.recent_events || []).map((event, idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-semibold">{event.name || ''}</span> <span className="text-emerald-700">({event.date || ''})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Donations Section */}
        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">Donations</h3>
          <form onSubmit={handleDonationSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="food_item" value={donationForm.food_item} onChange={handleDonationChange} className="border rounded p-2" placeholder="Food Item" required />
            <input name="brand" value={donationForm.brand} onChange={handleDonationChange} className="border rounded p-2" placeholder="Brand" required />
            <input name="description" value={donationForm.description} onChange={handleDonationChange} className="border rounded p-2" placeholder="Description" required />
            <input name="quantity" value={donationForm.quantity} onChange={handleDonationChange} className="border rounded p-2" type="number" placeholder="Quantity" required min="1" />
            <input name="price" value={donationForm.price} onChange={handleDonationChange} className="border rounded p-2" type="number" placeholder="Price" required min="0" />
            <input name="recipient_id" value={donationForm.recipient_id} onChange={handleDonationChange} className="border rounded p-2" placeholder="Recipient ID" required />
            <button type="submit" className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 md:col-span-2">
              {donationLoading ? 'Saving...' : 'Add Donation'}
            </button>
            {donationError && <span className="text-red-600 font-semibold md:col-span-2">{donationError}</span>}
            {donationSuccess && <span className="text-green-700 font-semibold md:col-span-2">{donationSuccess}</span>}
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-emerald-800">Food Item</th>
                  <th className="py-2 px-4 text-left text-emerald-800">Brand</th>
                  <th className="py-2 px-4 text-left text-emerald-800">Quantity</th>
                  <th className="py-2 px-4 text-left text-emerald-800">Price</th>
                  <th className="py-2 px-4 text-left text-emerald-800">Recipient</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{don.food_item || ''}</td>
                    <td className="py-2 px-4">{don.brand || ''}</td>
                    <td className="py-2 px-4">{don.quantity ?? ''}</td>
                    <td className="py-2 px-4">{don.price ?? ''}</td>
                    <td className="py-2 px-4">{don.recipient_id || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
