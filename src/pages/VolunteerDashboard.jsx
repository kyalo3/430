
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const emptyVolunteer = {
  id: '',
  user_id: '',
  first_name: '',
  last_name: '',
  email: '',
  id_no: '',
  phone_number: '',
  gender: '',
  address: '',
};

function VolunteerDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [form, setForm] = useState(emptyVolunteer);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/volunteers/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVolunteers(res.data || []);
      } catch (err) {
        setError('Failed to fetch volunteers');
      }
    };
    fetchVolunteers();
  }, [success]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        // Update
        await axios.put(`http://127.0.0.1:8000/volunteers/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Volunteer updated successfully!');
      } else {
        // Create
        await axios.post('http://127.0.0.1:8000/volunteers/', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Volunteer created successfully!');
      }
      setForm(emptyVolunteer);
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save volunteer');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (vol) => {
    setForm(vol);
    setEditId(vol.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/volunteers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Volunteer deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete volunteer');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm(emptyVolunteer);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-6">Volunteer Management Dashboard</h1>
        {error && <div className="bg-red-100 border-l-4 border-red-600 text-red-900 p-4 rounded-xl shadow mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 border-l-4 border-green-600 text-green-900 p-4 rounded-xl shadow mb-4 text-center">{success}</div>}

        {/* Volunteer Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Volunteer' : 'Add Volunteer'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" required />
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required type="email" />
            <input name="id_no" value={form.id_no} onChange={handleChange} placeholder="ID Number" className="border p-2 rounded" required />
            <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" required />
            <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded md:col-span-2" required />
            <div className="md:col-span-2 flex gap-2 mt-2">
              <button type="submit" className="bg-green-800 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold" disabled={loading}>{loading ? 'Saving...' : (editId ? 'Update' : 'Add')}</button>
              {editId && <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>}
            </div>
          </form>
        </div>

        {/* Volunteers Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">All Volunteers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-emerald-100">
                  <th className="p-2 border">First Name</th>
                  <th className="p-2 border">Last Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">ID No</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">User ID</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 ? (
                  <tr><td colSpan={9} className="text-center p-4">No volunteers found.</td></tr>
                ) : (
                  volunteers.map((vol) => (
                    <tr key={vol.id} className="border-b">
                      <td className="p-2 border">{vol.first_name}</td>
                      <td className="p-2 border">{vol.last_name}</td>
                      <td className="p-2 border">{vol.email}</td>
                      <td className="p-2 border">{vol.id_no}</td>
                      <td className="p-2 border">{vol.phone_number}</td>
                      <td className="p-2 border">{vol.gender}</td>
                      <td className="p-2 border">{vol.address}</td>
                      <td className="p-2 border">{vol.user_id}</td>
                      <td className="p-2 border flex gap-2">
                        <button onClick={() => handleEdit(vol)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(vol.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
