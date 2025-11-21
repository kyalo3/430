import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Replace with real data fetching in production
const initialVolunteer = {
  id: 'replace_with_real_id',
  first_name: 'John',
  last_name: 'Volunteer',
  email: 'john.volunteer@email.com',
  id_no: '87654321',
  phone_number: '+254798765432',
  gender: 'Male',
  address: 'Nairobi, Kenya',
  status: 'Active Volunteer',
  events_attended: [
    { name: 'Food Drive', date: '2025-09-05' },
    { name: 'Community Clean Up', date: '2025-08-20' }
  ]
};

function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(initialVolunteer);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...initialVolunteer });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch volunteer profile (replace with real API call)
  useEffect(() => {
    // Example: fetch volunteer data from backend using token
    // const fetchVolunteer = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const res = await axios.get('http://127.0.0.1:8000/volunteers/me', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setVolunteer(res.data);
    //     setForm(res.data);
    //   } catch (err) {
    //     setError('Failed to fetch volunteer profile');
    //   }
    // };
    // fetchVolunteer();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit profile
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const volunteerId = volunteer.id;
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        id_no: form.id_no,
        phone_number: form.phone_number,
        gender: form.gender,
        address: form.address
      };
      await axios.put(
         `http://127.0.0.1:8000/volunteers/${volunteerId}`,
         payload,
         { headers: { Authorization: `Bearer ${token}` } }
       );
      setVolunteer((prev) => ({ ...prev, ...payload }));
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
            <h1 className="text-3xl font-extrabold text-white mb-1">Volunteer Dashboard</h1>
            <p className="text-emerald-100 text-base">Welcome, {volunteer.first_name}!</p>
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
              onClick={handleSubmit}
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
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" required />
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
                <span role="img" aria-label="volunteer" className="text-6xl" style={{ color: '#26a69a' }}>🤝</span>
              </div>
              <div>
                <div className="text-xl font-bold text-green-900 mb-1">{volunteer.first_name} {volunteer.last_name}</div>
                <div className="text-emerald-900 mb-1">{volunteer.email}</div>
                <div className="text-emerald-900 mb-1">{volunteer.phone_number}</div>
                <div className="text-emerald-900 mb-1">{volunteer.address}</div>
                <div className="text-emerald-900 mb-1">{volunteer.gender}</div>
                <div className="text-emerald-900 mb-1">ID: {volunteer.id_no}</div>
                <div className="text-emerald-700 font-semibold">{volunteer.status}</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{volunteer.events_attended.length}</span>
            <span className="text-emerald-700 mt-2">Events Attended</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-emerald-100">
            <span className="text-3xl font-bold text-green-900">{volunteer.status}</span>
            <span className="text-emerald-700 mt-2">Status</span>
          </div>
        </div>

        {/* Events Attended Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Events Attended</h3>
          <ul className="space-y-3">
            {volunteer.events_attended.map((event, idx) => (
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

export default VolunteerDashboard;
