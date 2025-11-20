import React, { useState, useEffect } from 'react';
import axios from 'axios';


// Replace with real data fetching in production
const initialRecipient = {
  id: 'replace_with_real_id',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane.doe@email.com',
  id_no: '12345678',
  phone_number: '+254712345678',
  gender: 'Female',
  address: 'Nairobi, Kenya',
  house_hold_size: 5,
  house_hold_members: ['John', 'Mary'],
  disability: false,
  status: 'Active Recipient',
  aid_received: [
    { type: 'Food Package', date: '2025-11-01', amount: '2 boxes' },
    { type: 'Medical Aid', date: '2025-10-15', amount: 'Ksh 3,000' },
    { type: 'Clothing', date: '2025-09-20', amount: '5 items' }
  ],
  events_attended: [
    { name: 'Community Health Camp', date: '2025-10-10' },
    { name: 'Food Drive', date: '2025-09-05' }
  ]
};

function RecipientDashboard() {
    // Handler for updating a donation (redirect to update page)
    function handleUpdateDonation(donation) {
      window.location.href = `/update-donation/${donation.id}`;
    }
  const [recipient, setRecipient] = useState(initialRecipient);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...initialRecipient });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // Remove delete state, not needed for update
  // Donations for this recipient (fetched from backend)
  const [donations, setDonations] = useState([]);

  // Donation request state
  const [requestForm, setRequestForm] = useState({
    item: '',
    custom: '',
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  // Handle donation request form changes
  const handleRequestChange = (e) => {
    setRequestForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle donation request submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestSuccess('');
    setRequestError('');
    try {
      const token = localStorage.getItem('token');
      // You may need to adjust the endpoint to match your backend
      await axios.post(
        `http://127.0.0.1:8000/donation-requests/`,
        {
          recipient_id: recipient.id,
          item: requestForm.item,
          custom: requestForm.custom,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestSuccess('Request submitted successfully!');
      setRequestForm({ item: '', custom: '' });
    } catch (err) {
      setRequestError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setRequestLoading(false);
    }
  };

  // Fetch donations for this recipient from backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        // Use recipient.id from state (should be real id after login)
        if (!recipient.id || recipient.id === 'replace_with_real_id') return;
        const res = await axios.get(
          `http://127.0.0.1:8000/recipients/${recipient.id}/donations/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDonations(res.data);
      } catch (err) {
        // Optionally handle error
        setDonations([]);
      }
    };
    fetchDonations();
  }, [recipient.id]);
  // Handle update profile (button outside form)
  const handleUpdate = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const recipientId = recipient.id;
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        id_no: form.id_no,
        phone_number: form.phone_number,
        gender: form.gender,
        address: form.address,
        house_hold_size: Number(form.house_hold_size),
        house_hold_members: form.house_hold_members,
        disability: Boolean(form.disability)
      };
      await axios.put(
        `http://127.0.0.1:8000/recipients/${recipientId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipient((prev) => ({ ...prev, ...payload }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      // Use the real recipient id in production
      const recipientId = recipient.id;
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        id_no: form.id_no,
        phone_number: form.phone_number,
        gender: form.gender,
        address: form.address,
        house_hold_size: Number(form.house_hold_size),
        house_hold_members: form.house_hold_members,
        disability: Boolean(form.disability)
      };
      await axios.put(
        `http://127.0.0.1:8000/recipients/${recipientId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipient((prev) => ({ ...prev, ...payload }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // For house_hold_members, handle as comma-separated string in form
  const handleMembersChange = (e) => {
    setForm((prev) => ({
      ...prev,
      house_hold_members: e.target.value.split(',').map((m) => m.trim())
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Remove delete error/success UI */}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Recipient Dashboard</h1>
            <p className="text-emerald-100 text-base">Welcome, {recipient.first_name}!</p>
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
              className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
           </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900 p-4 rounded-xl shadow mb-8 text-center">
          <span className="italic font-semibold">“We make a living by what we get, but we make a life by what we give.”</span>
          <span className="block mt-2 text-emerald-700">— Winston Churchill</span>
        </div>


        {/* Profile Card or Edit Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Household Size</label>
                  <input name="house_hold_size" value={form.house_hold_size} onChange={handleChange} className="w-full border rounded p-2" type="number" min="1" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Household Members (comma separated)</label>
                  <input name="house_hold_members" value={form.house_hold_members.join(', ')} onChange={handleMembersChange} className="w-full border rounded p-2" />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input name="disability" type="checkbox" checked={form.disability} onChange={handleChange} />
                  <label className="text-green-900 font-semibold">Disability</label>
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
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                <span role="img" aria-label="recipient" className="text-6xl" style={{ color: '#26a69a' }}>🎁</span>
              </div>
              <div>
                <div className="text-xl font-bold text-green-900 mb-1">{recipient.first_name} {recipient.last_name}</div>
                <div className="text-emerald-900 mb-1">{recipient.email}</div>
                <div className="text-emerald-900 mb-1">{recipient.phone_number}</div>
                <div className="text-emerald-900 mb-1">{recipient.address}</div>
                <div className="text-emerald-900 mb-1">{recipient.gender}</div>
                <div className="text-emerald-900 mb-1">ID: {recipient.id_no}</div>
                <div className="text-emerald-900 mb-1">Household: {recipient.house_hold_members.join(', ')}</div>
                <div className="text-emerald-700 font-semibold">{recipient.status}</div>
                <div className="text-emerald-700 font-semibold">Disability: {recipient.disability ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{recipient.house_hold_size}</span>
            <span className="text-emerald-700 mt-2">Household Size</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{recipient.aid_received.length}</span>
            <span className="text-emerald-700 mt-2">Aid Received</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{recipient.events_attended.length}</span>
            <span className="text-emerald-700 mt-2">Events Attended</span>
          </div>
        </div>


        {/* Recent Aid Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">Recent Aid Received</h3>
          <ul className="space-y-3">
            {recipient.aid_received.map((aid, idx) => (
              <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-50 pb-2 mb-2 last:border-b-0 last:mb-0">
                <div>
                  <span className="font-semibold text-green-900">{aid.type}</span>
                  <span className="block text-emerald-700 text-sm">{aid.date}</span>
                </div>
                <span className="text-emerald-900 text-sm mt-2 md:mt-0">{aid.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Request Donation Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">Request a Donation</h3>
          <form onSubmit={handleRequestSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-green-900 font-semibold mb-1">Select Item</label>
              <select
                name="item"
                value={requestForm.item}
                onChange={handleRequestChange}
                className="w-full border rounded p-2"
              >
                <option value="">-- Choose an item --</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Medicine">Medicine</option>
                <option value="Hygiene Products">Hygiene Products</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-1">Custom Request (optional)</label>
              <input
                name="custom"
                value={requestForm.custom}
                onChange={handleRequestChange}
                className="w-full border rounded p-2"
                placeholder="Describe your need..."
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 w-full"
                disabled={requestLoading}
              >
                {requestLoading ? 'Submitting...' : 'Request'}
              </button>
            </div>
          </form>
          {requestSuccess && <div className="bg-green-100 border-l-4 border-green-600 text-green-900 p-2 rounded-xl shadow mt-4 text-center">{requestSuccess}</div>}
          {requestError && <div className="bg-red-100 border-l-4 border-red-600 text-red-900 p-2 rounded-xl shadow mt-4 text-center">{requestError}</div>}
        </div>

        {/* Events Attended Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Events Attended</h3>
          <ul className="space-y-3">
            {recipient.events_attended.map((event, idx) => (
              <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-50 pb-2 mb-2 last:border-b-0 last:mb-0">
                <div>
                  <span className="font-semibold text-green-900">{event.name}</span>
                  <span className="block text-emerald-700 text-sm">{event.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default RecipientDashboard;
