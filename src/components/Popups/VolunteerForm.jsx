import React, { useState } from 'react';

function VolunteerForm({ handleSwitch }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    id_no: '',
    phone_number: '',
    gender: '',
    address: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit form to backend
    alert('Volunteer form submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Volunteer Registration</h2>
      <div className="flex gap-2">
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded w-1/2"
          required
        />
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded w-1/2"
          required
        />
      </div>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="text"
        name="id_no"
        value={form.id_no}
        onChange={handleChange}
        placeholder="ID Number"
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="text"
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border p-2 rounded w-full"
        required
      />
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="border p-2 rounded w-full"
        required
      />
      <div className="flex justify-between items-center">
        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Register</button>
        <button type="button" onClick={() => handleSwitch('login')} className="text-emerald-600 hover:underline">Already have an account?</button>
      </div>
    </form>
  );
}

export default VolunteerForm;
