import React, { useState, useEffect } from 'react';
import axios from 'axios';


// Replace with real data fetching in production
const initialVolunteer = {
  id: 'replace_with_real_id',
  user_id: 'replace_with_real_user_id',
  first_name: 'John',
  last_name: 'Smith',
  email: 'john.smith@email.com',
  id_no: '87654321',
  phone_number: '+254798765432',
  gender: 'Male',
  address: 'Mombasa, Kenya',
};

function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(initialVolunteer);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const [awards, setAwards] = useState([]);
  const [awardsLoading, setAwardsLoading] = useState(false);
  const [awardsError, setAwardsError] = useState('');
    // Fetch events participated from backend
    useEffect(() => {
      const fetchEvents = async () => {
        setEventsLoading(true);
        setEventsError('');
        try {
          const token = localStorage.getItem('token');
          // Replace with your real backend endpoint and volunteer id
          const volunteerId = volunteer.id;
          const res = await axios.get(`http://127.0.0.1:8000/volunteers/${volunteerId}/events`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setEvents(res.data.events || []);
        } catch (err) {
          setEventsError('Failed to load events');
        } finally {
          setEventsLoading(false);
        }
      };
      if (volunteer && volunteer.id && volunteer.id !== 'replace_with_real_id') {
        fetchEvents();
      }
    }, [volunteer.id]);

    // Fetch awards won from backend
    useEffect(() => {
      const fetchAwards = async () => {
        setAwardsLoading(true);
        setAwardsError('');
        try {
          const token = localStorage.getItem('token');
          const volunteerId = volunteer.id;
          const res = await axios.get(`http://127.0.0.1:8000/volunteers/${volunteerId}/awards`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAwards(res.data.awards || []);
        } catch (err) {
          setAwardsError('Failed to load awards');
        } finally {
          setAwardsLoading(false);
        }
      };
      if (volunteer && volunteer.id && volunteer.id !== 'replace_with_real_id') {
        fetchAwards();
      }
    }, [volunteer.id]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...initialVolunteer });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
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

  // Handle delete profile
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const volunteerId = volunteer.id;
      await axios.delete(`http://127.0.0.1:8000/volunteers/${volunteerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile deleted successfully.');
      setVolunteer(null);
      setForm({});
      setEditMode(false);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Failed to delete profile');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        {deleteError && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-900 p-4 rounded-xl shadow mb-4 text-center">
            {deleteError}
          </div>
        )}
        {success === 'Profile deleted successfully.' && (
          <div className="bg-green-100 border-l-4 border-green-600 text-green-900 p-4 rounded-xl shadow mb-4 text-center">
            {success}
          </div>
        )}
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
          <span className="italic font-semibold">“The best way to find yourself is to lose yourself in the service of others.”</span>
          <span className="block mt-2 text-emerald-700">— Mahatma Gandhi</span>
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-green-900 font-semibold mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" />
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
              </div>
            </div>
          )}
        </div>

        {/* Lower Section (empty rounded card) */}
        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">Events Participated</h3>
          {eventsLoading ? (
            <p className="text-emerald-900 mb-4">Loading events...</p>
          ) : eventsError ? (
            <p className="text-red-600 mb-4">{eventsError}</p>
          ) : events.length === 0 ? (
            <p className="text-emerald-900 mb-4">No events found.</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {events.map((event, idx) => (
                <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-50 pb-2 mb-2 last:border-b-0 last:mb-0">
                  <div>
                    <span className="font-semibold text-green-900">{event.name}</span>
                    <span className="block text-emerald-700 text-sm">{event.date}</span>
                  </div>
                  {event.role && <span className="text-emerald-900 text-sm mt-2 md:mt-0">Role: {event.role}</span>}
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-xl font-bold text-green-900 mb-4">Awards Won</h3>
          {awardsLoading ? (
            <p className="text-emerald-900">Loading awards...</p>
          ) : awardsError ? (
            <p className="text-red-600">{awardsError}</p>
          ) : awards.length === 0 ? (
            <p className="text-emerald-900">No awards found.</p>
          ) : (
            <ul className="space-y-3">
              {awards.map((award, idx) => (
                <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-emerald-50 pb-2 mb-2 last:border-b-0 last:mb-0">
                  <div>
                    <span className="font-semibold text-green-900">{award.title}</span>
                    <span className="block text-emerald-700 text-sm">{award.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
