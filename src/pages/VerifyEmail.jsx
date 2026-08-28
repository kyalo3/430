import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbars/AuthNavbar.jsx';
import Footer from '../components/Footers/Footer.jsx';
import { AuthModal } from '../components/Popups/AuthModal.jsx';
import api from '../lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState('');

  const togglePopup = (type) => {
    if (type === '' && isOpen) {
      setPopupType(type);
      setIsOpen(!isOpen);
    } else if (type !== '' && isOpen) {
      setPopupType(type);
    } else {
      setPopupType(type);
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      const res = await api.post('/verify-email', { email: email.trim(), code: code.trim() });
      if (res.data?.note) {
        setNotice(res.data.note);
      } else {
        setNotice('Email verified. You can log in and continue your journey.');
      }
      setTimeout(() => {
        setPopupType('login');
        setIsOpen(true);
      }, 600);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : err.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar togglePopup={togglePopup} />
      <AuthModal isOpen={isOpen} togglePopup={togglePopup} popupType={popupType} />
      <main className="min-h-screen bg-[#f3f7f4] pt-24 pb-16">
        <div className="container mx-auto max-w-lg px-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Account</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-emerald-950">Verify your email</h1>
          <p className="mt-4 text-emerald-800/85">
            When verification is enabled, enter the code sent to your inbox. In local development the code is{' '}
            <code className="rounded bg-white px-1.5 py-0.5 text-sm">424242</code>.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-emerald-100 bg-white p-6">
            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {notice && (
              <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {notice}
              </div>
            )}
            <div>
              <label htmlFor="verify-email" className="block text-sm font-medium text-emerald-900">
                Email
              </label>
              <input
                id="verify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-3 text-sm"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="verify-code" className="block text-sm font-medium text-emerald-900">
                Verification code
              </label>
              <input
                id="verify-code"
                type="text"
                required
                minLength={4}
                maxLength={32}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-3 text-sm"
                autoComplete="one-time-code"
                placeholder="Enter code"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {submitting ? 'Verifying…' : 'Confirm email'}
            </button>
          </form>

          <p className="mt-6 text-sm text-emerald-800">
            Already verified?{' '}
            <button type="button" className="font-semibold underline" onClick={() => togglePopup('login')}>
              Log in
            </button>
            {' · '}
            <Link to="/" className="font-semibold underline">
              Home
            </Link>
            {' · '}
            <button type="button" className="font-semibold underline" onClick={() => navigate('/guidance')}>
              Guidance
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
