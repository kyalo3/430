import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Example initial data structure for a recipient
const initialRecipient = {
  id: '',
  first_name: 'Jane',
  last_name: 'Recipient',
  email: 'jane.recipient@email.com',
  id_no: '12345678',
  phone_number: '+254712345678',
  gender: 'Female',
  address: 'Nairobi, Kenya',
  house_hold_size: 4,
  house_hold_members: ['John Doe', 'Mary Doe', 'Sam Doe', 'Lucy Doe'],
  disability: false,
  status: 'Active Recipient',
  donations_received: [
    { name: 'Food Parcel', date: '2025-09-10', donor: 'FoodBank' },
    { name: 'Clothes', date: '2025-08-15', donor: 'CharityOrg' }
  ]
};

function RecipientDashboard() {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...initialRecipient });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch recipient profile (replace with real API call)
  useEffect(() => {
    // Example: fetch recipient data from backend using token
    // const fetchRecipient = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const res = await axios.get('http://127.0.0.1:8000/recipients/me', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setRecipient(res.data);
    //     setForm(res.data);
    //   } catch (err) {
    //     setError('Failed to fetch recipient profile');
    //   }
    // };
    // fetchRecipient();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      // Example: update recipient profile
      // const token = localStorage.getItem('token');
      // await axios.put(`http://127.0.0.1:8000/recipients/${recipient.id}`, form, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      setRecipient((prev) => ({ ...prev, ...form }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
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
            <h1 className="text-3xl font-extrabold text-white mb-1">Recipient Dashboard</h1>
            <p className="text-emerald-100 text-base">Welcome, {recipient.first_name}!</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
            <button
              className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
              onClick={() => setEditMode((m) => !m)}
            >
              {editMode ? 'Cancel' : 'Update Profile'}
            </button>
            <button
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ml-2"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900 p-4 rounded-xl shadow mb-8 text-center">
          <span className="italic font-semibold">“Gratitude turns what we have into enough.”</span>
          <span className="block mt-2 text-emerald-700">— Anonymous</span>
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
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Household Size</label>
                  <input name="house_hold_size" type="number" min="0" value={form.house_hold_size} onChange={handleChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-green-900 font-semibold mb-1">Disability</label>
                  <select name="disability" value={form.disability ? 'true' : 'false'} onChange={e => setForm(prev => ({ ...prev, disability: e.target.value === 'true' }))} className="w-full border rounded p-2">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Household Members (comma separated)</label>
                  <input name="house_hold_members" value={Array.isArray(form.house_hold_members) ? form.house_hold_members.join(', ') : form.house_hold_members} onChange={e => setForm(prev => ({ ...prev, house_hold_members: e.target.value.split(',').map(m => m.trim()).filter(Boolean) }))} className="w-full border rounded p-2" />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button type="submit" className="bg-green-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200" disabled={loading}>
                  {loading ? 'Saving...' : 'Update Profile'}
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
                <div className="text-emerald-900 mb-1">Household Size: {recipient.house_hold_size}</div>
                <div className="text-emerald-900 mb-1">Disability: {recipient.disability ? 'Yes' : 'No'}</div>
                <div className="text-emerald-900 mb-1">Household Members: {Array.isArray(recipient.house_hold_members) ? recipient.house_hold_members.join(', ') : recipient.house_hold_members}</div>
                <div className="text-emerald-700 font-semibold">{recipient.status}</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{recipient.donations_received.length}</span>
            <span className="text-emerald-700 mt-2">Donations Received</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{recipient.status}</span>
            <span className="text-emerald-700 mt-2">Status</span>
          </div>
        </div>

        {/* Donations Received Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Donations Received</h3>
          <ul className="space-y-3">
            {recipient.donations_received.map((donation, idx) => (
              <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-50 pb-2 mb-2 last:border-b-0 last:mb-0">
                <div>
                  <span className="font-semibold text-green-900">{donation.name}</span>
                  <span className="block text-emerald-700 text-sm">{donation.date} from {donation.donor}</span>
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
