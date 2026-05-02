import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import team from '../assets/images/team.svg';
import family from '../assets/images/family.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

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

const money = (value) => `KES ${Number(value || 0).toLocaleString()}`;

function DonorDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
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
  const [systemDonationCount, setSystemDonationCount] = useState(0);
  const [donationSearch, setDonationSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [reportRange, setReportRange] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDonor((prev) => ({ ...prev, ...currentUser }));
      setForm((prev) => ({
        ...prev,
        ...currentUser,
        services_interested_in: currentUser.services_interested_in || [],
        participating_locations: currentUser.participating_locations || [],
        recent_aid: currentUser.recent_aid || [],
        recent_events: currentUser.recent_events || [],
      }));
    }
  }, [currentUser]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!currentUser?.id || currentUser.id === 'replace_with_real_id') return;
      const res = await axios.get(`${API_URL}/donors/${currentUser.id}/donations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data || []);
    } catch {
      setDonations([]);
    }
  };

  const fetchSystemDonationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/donations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSystemDonationCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch {
      setSystemDonationCount(0);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [currentUser?.id]);

  useEffect(() => {
    fetchSystemDonationCount();
  }, []);

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationForm((prev) => ({ ...prev, [name]: value }));
  };

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
      isNaN(Number(donationForm.quantity)) ||
      Number(donationForm.quantity) < 1 ||
      !donationForm.price ||
      isNaN(Number(donationForm.price)) ||
      Number(donationForm.price) < 0 ||
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

      await axios.post(`${API_URL}/donations/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonationSuccess('Donation added successfully.');
      setDonationForm({
        food_item: '',
        brand: '',
        description: '',
        quantity: '',
        price: '',
        recipient_id: '',
      });
      fetchDonations();
      fetchSystemDonationCount();
    } catch (err) {
      setDonationError(err.response?.data?.detail || 'Failed to add donation');
    } finally {
      setDonationLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

      await axios.put(`${API_URL}/donors/${donorId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonor((prev) => ({ ...prev, ...payload }));
      setEditMode(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const totalDonationValue = donations.reduce((sum, item) => {
    const value = (Number(item.price) || 0) * (Number(item.quantity) || 0);
    return sum + value;
  }, 0);

  const averageDonationValue = donations.length > 0 ? totalDonationValue / donations.length : 0;
  const uniqueRecipients = new Set(donations.map((d) => d.recipient_id)).size;
  const donationGoal = 50000;
  const progress = Math.min(100, Math.round((totalDonationValue / donationGoal) * 100));

  const donationValues = donations.map((d) => (Number(d.price) || 0) * (Number(d.quantity) || 0));
  const recentValues = donationValues.slice(-8);
  const sparklineValues = recentValues.length > 0 ? recentValues : [0, 0, 0, 0, 0, 0, 0, 0];
  const sparklineMax = Math.max(...sparklineValues, 1);
  const sparklinePoints = sparklineValues
    .map((value, index) => {
      const x = (index / (sparklineValues.length - 1 || 1)) * 100;
      const y = 100 - (value / sparklineMax) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const brandTotals = donations.reduce((acc, item) => {
    const key = (item.brand || 'Unknown').trim() || 'Unknown';
    const current = acc[key] || 0;
    acc[key] = current + ((Number(item.price) || 0) * (Number(item.quantity) || 0));
    return acc;
  }, {});
  const topBrands = Object.entries(brandTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const topBrandMax = Math.max(...topBrands.map(([, value]) => value), 1);

  const recipientCountsMap = donations.reduce((acc, item) => {
    const key = (item.recipient_id || 'Unknown').trim() || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const recipientCounts = Object.values(recipientCountsMap);
  const topRecipientCount = recipientCounts.length > 0 ? Math.max(...recipientCounts) : 0;
  const topRecipientShare = donations.length > 0 ? Math.round((topRecipientCount / donations.length) * 100) : 0;
  const recipientRingStyle = {
    background: `conic-gradient(#0f766e 0% ${topRecipientShare}%, #d1fae5 ${topRecipientShare}% 100%)`,
  };

  const parseDonationDate = (donation) => {
    const raw = donation?.created_at || donation?.date || donation?.createdAt;
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const isDonationInRange = (donation) => {
    if (reportRange === 'all') return true;
    const donationDate = parseDonationDate(donation);
    if (!donationDate) return false;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (reportRange === '7d') {
      const from = new Date();
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return donationDate >= from && donationDate <= today;
    }

    if (reportRange === '30d') {
      const from = new Date();
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      return donationDate >= from && donationDate <= today;
    }

    if (reportRange === 'custom') {
      if (!customFrom || !customTo) return true;
      const from = new Date(customFrom);
      const to = new Date(customTo);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      return donationDate >= from && donationDate <= to;
    }

    return true;
  };

  const rangeFilteredDonations = donations.filter(isDonationInRange);

  const filteredAndSortedDonations = [...rangeFilteredDonations]
    .filter((d) => {
      const q = donationSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        (d.food_item || '').toLowerCase().includes(q) ||
        (d.brand || '').toLowerCase().includes(q) ||
        (d.recipient_id || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aValue = (Number(a.price) || 0) * (Number(a.quantity) || 0);
      const bValue = (Number(b.price) || 0) * (Number(b.quantity) || 0);
      if (sortBy === 'value-high') return bValue - aValue;
      if (sortBy === 'value-low') return aValue - bValue;
      if (sortBy === 'qty-high') return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
      if (sortBy === 'qty-low') return (Number(a.quantity) || 0) - (Number(b.quantity) || 0);
      return 0;
    });

  const reportTotalDonationValue = filteredAndSortedDonations.reduce(
    (sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
    0
  );
  const reportAverageDonationValue =
    filteredAndSortedDonations.length > 0 ? reportTotalDonationValue / filteredAndSortedDonations.length : 0;

  const sentSeriesRaw = donations.slice(-6).map((item, idx) => ({
    label: (item.food_item || `Donation ${idx + 1}`).slice(0, 8),
    quantity: Number(item.quantity) || 0,
  }));
  const sentSeries = sentSeriesRaw.length > 0
    ? sentSeriesRaw
    : [
        { label: 'D1', quantity: 0 },
        { label: 'D2', quantity: 0 },
        { label: 'D3', quantity: 0 },
        { label: 'D4', quantity: 0 },
        { label: 'D5', quantity: 0 },
        { label: 'D6', quantity: 0 },
      ];
  const sentMax = Math.max(...sentSeries.map((s) => s.quantity), 1);

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    signOut();
    window.location.href = '/';
  };

  const handleExportDonorReport = () => {
    const rows = filteredAndSortedDonations.map((donation) => {
      const quantity = Number(donation.quantity) || 0;
      const price = Number(donation.price) || 0;
      const total = quantity * price;
      return {
        food_item: donation.food_item || '',
        brand: donation.brand || '',
        quantity,
        unit_price: price,
        total_value: total,
        recipient_id: donation.recipient_id || '',
      };
    });

    const headerLines = [
      ['Report Type', 'Donor Contribution Report'],
      ['Generated On', new Date().toLocaleString()],
      ['Total Records', String(rows.length)],
      ['Range', reportRange],
      ['Total Donation Value', String(reportTotalDonationValue)],
      ['Average Donation Value', String(Math.round(reportAverageDonationValue))],
      [],
    ];

    const columns = ['food_item', 'brand', 'quantity', 'unit_price', 'total_value', 'recipient_id'];
    const csvLines = [
      ...headerLines.map((line) => line.join(',')),
      columns.join(','),
      ...rows.map((row) =>
        columns
          .map((key) => {
            const raw = row[key] ?? '';
            const safe = String(raw).replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(',')
      ),
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donor-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdfReport = () => {
    const popup = window.open('', '_blank', 'width=1000,height=800');
    if (!popup) return;

    const rows = filteredAndSortedDonations
      .map((donation) => {
        const quantity = Number(donation.quantity) || 0;
        const unitPrice = Number(donation.price) || 0;
        const totalValue = quantity * unitPrice;
        return `<tr>
          <td style="padding:8px;border:1px solid #ddd;">${donation.food_item || ''}</td>
          <td style="padding:8px;border:1px solid #ddd;">${donation.brand || ''}</td>
          <td style="padding:8px;border:1px solid #ddd;">${quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">${unitPrice}</td>
          <td style="padding:8px;border:1px solid #ddd;">${totalValue}</td>
          <td style="padding:8px;border:1px solid #ddd;">${donation.recipient_id || ''}</td>
        </tr>`;
      })
      .join('');

    popup.document.write(`
      <html>
        <head>
          <title>Donor Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin-bottom: 6px; }
            .meta { color: #4b5563; font-size: 13px; margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            th { background: #ecfdf5; border: 1px solid #ddd; text-align: left; padding: 8px; }
            td { border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Donor Contribution Report</h1>
          <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
          <div class="meta">Range: ${reportRange.toUpperCase()} | Records: ${filteredAndSortedDonations.length}</div>
          <div class="meta">Total Donation Value: ${reportTotalDonationValue}</div>
          <table>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Recipient</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.onload = function () { window.print(); };</script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent('Donor Contribution Report');
    const body = encodeURIComponent(
      [
        'Hello,',
        '',
        'Here is my donor contribution snapshot:',
        `- Generated: ${new Date().toLocaleString()}`,
        `- Range: ${reportRange}`,
        `- Records: ${filteredAndSortedDonations.length}`,
        `- Total Value: ${money(reportTotalDonationValue)}`,
        `- Average Value: ${money(Math.round(reportAverageDonationValue))}`,
        '',
        'Please find details in my dashboard export.',
      ].join('\n')
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const cardBase = 'relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fef9c3_0,#d1fae5_35%,#ecfeff_70%,#f8fafc_100%)] px-3 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="dashboard-fade-up relative overflow-hidden rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Donor Dashboard</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-5xl">Hello, {currentUser?.username || 'Donor'}.</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Everything important is in one place: your impact snapshot, profile controls, and donation operations.</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{formattedDate}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-800"
                onClick={() => document.getElementById('donation-composer')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Add Donation
              </button>
              <button
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setEditMode((m) => !m)}
              >
                {editMode ? 'Cancel Edit' : 'Update Profile'}
              </button>
              <button
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-700"
                onClick={handleExportDonorReport}
              >
                Download Report (CSV)
              </button>
              <button
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Impact Goal Progress</span>
              <span className="font-bold text-emerald-700">{money(totalDonationValue)} / {money(donationGoal)}</span>
            </div>
            <div className="h-3 rounded-full bg-emerald-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-semibold text-emerald-700">{progress}% complete</p>
          </div>
        </section>

        <section className="dashboard-fade-up grid grid-cols-1 gap-4 md:grid-cols-3" style={{ animationDelay: '240ms' }}>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="h-36 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.webp')" }} />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Campaign Overview</h3>
              <p className="mt-1 text-xs text-slate-600">Quick visual context from the main home campaign for consistent navigation feel.</p>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <img src={team} alt="Team collaboration" className="h-36 w-full bg-emerald-50 object-contain" />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Donor Network</h3>
              <p className="mt-1 text-xs text-slate-600">Your dashboard actions contribute directly to the same team impact shown on the home page.</p>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <img src={family} alt="Community support" className="h-36 w-full bg-emerald-50 object-contain" />
            <div className="p-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Community Outcomes</h3>
              <p className="mt-1 text-xs text-slate-600">Track donations with the same beneficiary-first visual language used on the landing page.</p>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className={`${cardBase} dashboard-fade-up dashboard-card-glow border-emerald-200 bg-gradient-to-br from-emerald-50 to-white`} style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-emerald-200/70" />
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Total Donations</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{systemDonationCount}</p>
            <p className="mt-1 text-xs text-slate-500">System-wide records</p>
          </article>

          <article className={`${cardBase} dashboard-fade-up dashboard-card-glow border-amber-200 bg-gradient-to-br from-amber-50 to-white`} style={{ animationDelay: '140ms' }}>
            <div className="absolute -left-8 -top-8 h-24 w-24 rotate-45 rounded-xl bg-amber-200/60" />
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Contribution Value</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{money(totalDonationValue)}</p>
            <p className="mt-1 text-xs text-slate-500">Total estimated worth</p>
          </article>

          <article className={`${cardBase} dashboard-fade-up dashboard-card-glow border-cyan-200 bg-gradient-to-br from-cyan-50 to-white`} style={{ animationDelay: '200ms' }}>
            <div className="absolute -bottom-4 -right-2 h-12 w-20 rounded-full bg-cyan-200/70" />
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Average Donation</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{money(averageDonationValue)}</p>
            <p className="mt-1 text-xs text-slate-500">Per donation entry</p>
          </article>

          <article className={`${cardBase} dashboard-fade-up dashboard-card-glow border-lime-200 bg-gradient-to-br from-lime-50 to-white`} style={{ animationDelay: '260ms' }}>
            <div className="absolute right-3 top-3 h-5 w-5 rounded-sm bg-lime-300" />
            <div className="absolute right-10 top-6 h-3 w-3 rounded-full bg-lime-200" />
            <p className="text-xs font-bold uppercase tracking-widest text-lime-700">Recipients Reached</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{uniqueRecipients}</p>
            <p className="mt-1 text-xs text-slate-500">Unique recipient IDs</p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <article className="dashboard-fade-up rounded-2xl border border-emerald-200 bg-white p-5 shadow-lg" style={{ animationDelay: '300ms' }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-700">Donation Trend</h3>
              <span className="text-xs font-semibold text-slate-500">Last 8 entries</span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <svg viewBox="0 0 100 100" className="h-28 w-full overflow-visible">
                <polyline
                  fill="none"
                  stroke="#99f6e4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklinePoints}
                  opacity="0.4"
                />
                <polyline
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklinePoints}
                />
              </svg>
            </div>
            <p className="mt-2 text-xs text-slate-600">Peak donation value: <span className="font-semibold text-slate-800">{money(sparklineMax)}</span></p>
          </article>

          <article className="dashboard-fade-up rounded-2xl border border-amber-200 bg-white p-5 shadow-lg" style={{ animationDelay: '360ms' }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-700">Top Brands</h3>
              <span className="text-xs font-semibold text-slate-500">By value</span>
            </div>
            <div className="space-y-2">
              {topBrands.length > 0 ? topBrands.map(([brand, value]) => (
                <div key={brand}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="max-w-[65%] truncate font-semibold text-slate-700">{brand}</span>
                    <span className="font-semibold text-slate-500">{money(value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-amber-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${Math.max(8, Math.round((value / topBrandMax) * 100))}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-500">No brand data yet.</p>
              )}
            </div>
          </article>

          <article className="dashboard-fade-up rounded-2xl border border-cyan-200 bg-white p-5 shadow-lg" style={{ animationDelay: '420ms' }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-cyan-700">Recipient Concentration</h3>
              <span className="text-xs font-semibold text-slate-500">Distribution</span>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-cyan-50 p-3">
              <div className="relative h-20 w-20 rounded-full" style={recipientRingStyle}>
                <div className="absolute inset-3 rounded-full bg-cyan-50" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{topRecipientShare}%</p>
                <p className="text-xs text-slate-600">of donations went to your top recipient</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-600">Unique recipients: <span className="font-semibold text-slate-800">{uniqueRecipients}</span></p>
          </article>

          <article className="dashboard-fade-up rounded-2xl border border-violet-200 bg-white p-5 shadow-lg" style={{ animationDelay: '480ms' }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-violet-700">Donations Sent</h3>
              <span className="text-xs font-semibold text-slate-500">Qty chart</span>
            </div>
            <div className="rounded-xl bg-violet-50 p-3">
              <div className="flex h-28 items-end gap-2">
                {sentSeries.map((item, idx) => (
                  <div key={`${item.label}-${idx}`} className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all duration-700"
                      style={{ height: `${Math.max(8, Math.round((item.quantity / sentMax) * 100))}%` }}
                      title={`${item.label}: ${item.quantity}`}
                    />
                    <span className="mt-1 max-w-full truncate text-[10px] font-semibold text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-600">Total quantity sent: <span className="font-semibold text-slate-800">{donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0)}</span></p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <article className="dashboard-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" style={{ animationDelay: '320ms' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Profile</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Donor account</span>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-600">First Name
                      <input name="first_name" value={form.first_name} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" required />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Last Name
                      <input name="last_name" value={form.last_name} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" required />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Email
                      <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" required type="email" />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">ID Number
                      <input name="id_no" value={form.id_no} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" required />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Phone
                      <input name="phone_number" value={form.phone_number} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" required />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Gender
                      <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Address
                      <input name="address" value={form.address} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
                    </label>
                    <label className="text-sm font-semibold text-slate-600">Company
                      <input name="company" value={form.company} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
                    </label>
                    <label className="text-sm font-semibold text-slate-600 md:col-span-2">Services Interested In (comma separated)
                      <input name="services_interested_in" value={form.services_interested_in.join(', ')} onChange={handleArrayChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
                    </label>
                    <label className="text-sm font-semibold text-slate-600 md:col-span-2">Participating Locations (comma separated)
                      <input name="participating_locations" value={form.participating_locations.join(', ')} onChange={handleArrayChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
                    </label>
                    <label className="text-sm font-semibold text-slate-600 md:col-span-2">Type of Company
                      <input name="type_of_company" value={form.type_of_company} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    {success && <span className="text-sm font-semibold text-emerald-700">{success}</span>}
                    {error && <span className="text-sm font-semibold text-red-600">{error}</span>}
                  </div>
                </form>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</p>
                    <p className="font-semibold text-slate-900">{donor?.first_name || '-'} {donor?.last_name || ''}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900">{donor?.email || '-'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900">{donor?.phone_number || '-'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</p>
                    <p className="font-semibold text-slate-900">{donor?.address || '-'}</p>
                  </div>
                </div>
              )}
            </article>
          </div>

          <aside className="space-y-6">
            <article id="donation-composer" className="dashboard-fade-up rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-xl" style={{ animationDelay: '380ms' }}>
              <h3 className="text-lg font-black text-slate-900">Quick Donation</h3>
              <p className="mt-1 text-xs text-slate-600">Minimal steps. Fast entry.</p>
              <form onSubmit={handleDonationSubmit} className="mt-4 space-y-3">
                <input name="food_item" value={donationForm.food_item} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Food item" required />
                <input name="brand" value={donationForm.brand} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Brand" required />
                <input name="description" value={donationForm.description} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Description" required />
                <div className="grid grid-cols-2 gap-2">
                  <input name="quantity" value={donationForm.quantity} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" type="number" placeholder="Qty" required min="1" />
                  <input name="price" value={donationForm.price} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" type="number" placeholder="Price" required min="0" />
                </div>
                <input name="recipient_id" value={donationForm.recipient_id} onChange={handleDonationChange} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Recipient ID" required />
                <button type="submit" className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800" disabled={donationLoading}>
                  {donationLoading ? 'Saving...' : 'Submit Donation'}
                </button>
                {donationError && <p className="text-xs font-semibold text-red-600">{donationError}</p>}
                {donationSuccess && <p className="text-xs font-semibold text-emerald-700">{donationSuccess}</p>}
              </form>
            </article>

            <article className="dashboard-fade-up rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-xl" style={{ animationDelay: '440ms' }}>
              <h3 className="text-lg font-black text-slate-900">At a Glance</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2"><span>Aid Received</span><strong>{donor?.aid_received || 0}</strong></li>
                <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2"><span>Events</span><strong>{donor?.events_attended || 0}</strong></li>
                <li className="flex items-center justify-between rounded-lg bg-white px-3 py-2"><span>Locations</span><strong>{(donor?.participating_locations || []).length}</strong></li>
              </ul>
            </article>
          </aside>
        </section>

        <section className="dashboard-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" style={{ animationDelay: '500ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Recent Donations</h2>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest entries</p>
              <button
                onClick={handleExportDonorReport}
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                CSV
              </button>
              <button
                onClick={handleExportPdfReport}
                className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                PDF
              </button>
              <button
                onClick={handleEmailReport}
                className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                Email
              </button>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-4">
            <select
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <input
              value={donationSearch}
              onChange={(e) => setDonationSearch(e.target.value)}
              placeholder="Search by food item, brand, or recipient"
              className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="newest">Default Order</option>
              <option value="value-high">Value: High to Low</option>
              <option value="value-low">Value: Low to High</option>
              <option value="qty-high">Quantity: High to Low</option>
              <option value="qty-low">Quantity: Low to High</option>
            </select>
          </div>

          {reportRange === 'custom' && (
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <p className="mb-3 text-xs text-slate-600">
            Report Summary: <span className="font-semibold text-slate-800">{filteredAndSortedDonations.length}</span> records,
            total <span className="font-semibold text-slate-800">{money(reportTotalDonationValue)}</span>,
            average <span className="font-semibold text-slate-800">{money(Math.round(reportAverageDonationValue))}</span>.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2">Food Item</th>
                  <th className="px-3 py-2">Brand</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Value</th>
                  <th className="px-3 py-2">Recipient</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedDonations.map((don, idx) => (
                  <tr key={idx} className="border-b border-slate-100 transition hover:bg-emerald-50/40">
                    <td className="px-3 py-2 font-semibold text-slate-800">{don.food_item || ''}</td>
                    <td className="px-3 py-2 text-slate-700">{don.brand || ''}</td>
                    <td className="px-3 py-2 text-slate-700">{don.quantity ?? ''}</td>
                    <td className="px-3 py-2 text-slate-700">{money((Number(don.price || 0) * Number(don.quantity || 0)))}</td>
                    <td className="px-3 py-2 text-slate-700">{don.recipient_id || ''}</td>
                  </tr>
                ))}
                {filteredAndSortedDonations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">No matching donations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <style>{`
          @keyframes dashboardFadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dashboardCardGlow {
            0%, 100% {
              box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
            }
            50% {
              box-shadow: 0 14px 32px rgba(16, 185, 129, 0.16);
            }
          }

          .dashboard-fade-up {
            opacity: 0;
            animation: dashboardFadeUp 560ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
          }

          .dashboard-card-glow {
            animation: dashboardFadeUp 560ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards,
              dashboardCardGlow 3.2s ease-in-out 700ms infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

export default DonorDashboard;
