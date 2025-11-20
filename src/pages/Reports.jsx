import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      // Example: fetch summary stats, donations, users, etc.
      const [users, donations, reviews] = await Promise.all([
        axios.get('http://127.0.0.1:8000/users/'),
        axios.get('http://127.0.0.1:8000/donations/'),
        axios.get('http://127.0.0.1:8000/reviews/')
      ]);
      setReportData({
        users: users.data,
        donations: donations.data,
        reviews: reviews.data
      });
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Download CSV helper
  const downloadCSV = (data, filename) => {
    const csvRows = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 py-8 px-2">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-extrabold text-emerald-900 mb-6 text-center">System Reports</h1>
        {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow mb-8">{error}</div>}
        <div className="flex justify-end mb-4">
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1 rounded" onClick={fetchReport} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-400 border-opacity-50"></div>
            <span className="text-green-900 text-lg font-semibold ml-4">Loading...</span>
          </div>
        ) : reportData ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-emerald-800 mb-2">Summary</h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Total Users: {reportData.users.length}</li>
                <li>Total Donations: {reportData.donations.length}</li>
                <li>Total Reviews: {reportData.reviews.length}</li>
              </ul>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-green-800 mb-2">Donations Report</h2>
              {reportData.donations && reportData.donations.length > 0 ? (
                <>
                  <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded mb-2" onClick={() => downloadCSV(reportData.donations, 'donations_report.csv')}>Download CSV</button>
                  <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr>
                          {Object.keys(reportData.donations[0] || {}).map((key) => (
                            <th key={key} className="px-2 py-1 border-b text-left">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.donations.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-2 py-1">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 italic">No donations data available.</div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-emerald-800 mb-2">Users Report</h2>
              {reportData.users && reportData.users.length > 0 ? (
                <>
                  <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1 rounded mb-2" onClick={() => downloadCSV(reportData.users, 'users_report.csv')}>Download CSV</button>
                  <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr>
                          {Object.keys(reportData.users[0] || {}).map((key) => (
                            <th key={key} className="px-2 py-1 border-b text-left">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.users.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-2 py-1">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 italic">No users data available.</div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Reviews Report</h2>
              {reportData.reviews && reportData.reviews.length > 0 ? (
                <>
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded mb-2" onClick={() => downloadCSV(reportData.reviews, 'reviews_report.csv')}>Download CSV</button>
                  <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr>
                          {Object.keys(reportData.reviews[0] || {}).map((key) => (
                            <th key={key} className="px-2 py-1 border-b text-left">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.reviews.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-2 py-1">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 italic">No reviews data available.</div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Reports;
