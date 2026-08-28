import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { dashboardPathForRole } from '../../lib/demo-accounts';

const ROLES = [
  {
    value: 'donor',
    title: 'Donor',
    hint: 'Share surplus resources',
  },
  {
    value: 'recipient',
    title: 'Recipient',
    hint: 'Request support privately',
  },
  {
    value: 'volunteer',
    title: 'Volunteer',
    hint: 'Help with safe handovers',
  },
];

const fieldClass =
  'mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-3 text-sm text-emerald-950 placeholder:text-slate-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30';

function passwordScore(password) {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function strengthLabelFor(score, password) {
  if (!password) return '';
  if (score <= 2) return 'Weak';
  if (score === 3) return 'Fair';
  if (score === 4) return 'Good';
  return 'Strong';
}

function RegistrationForm({ handleSwitch }) {
  const { signUp, currentUser, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const validation = Yup.object({
    username: Yup.string().min(3, 'At least 3 characters').required('Username is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(10, 'At least 10 characters')
      .test(
        'strength',
        'Use upper, lower, and a number or symbol',
        (value) => passwordScore(value || '') >= 4
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm your password'),
    role: Yup.string().oneOf(['donor', 'recipient', 'volunteer']).required('Choose how you will participate'),
    acceptTerms: Yup.boolean().oneOf([true], 'Please accept the privacy notice to continue'),
  });

  useEffect(() => {
    if (!pendingRedirect) return;
    const role = userRole || currentUser?.role;
    if (!role) return;
    navigate(dashboardPathForRole(role), { replace: true });
  }, [pendingRedirect, userRole, currentUser, navigate]);

  const handleRegister = async (values, actions) => {
    setServerError('');
    setSuccessMsg('');
    try {
      const user = await signUp(values.username, values.email, values.password, values.role);
      if (user?.needsVerification) {
        setSuccessMsg('Account created. Confirm your email before logging in.');
        actions.resetForm();
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`, { replace: true });
        return;
      }
      setSuccessMsg('Account created. Taking you to your dashboard…');
      setPendingRedirect(true);
      const path = dashboardPathForRole(user?.role);
      if (path !== '/') navigate(path, { replace: true });
      actions.resetForm();
    } catch (error) {
      const msg = error.response?.data?.detail || error.response?.data || error.message || 'Registration failed';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      setPendingRedirect(false);
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        acceptTerms: false,
      }}
      validationSchema={validation}
      onSubmit={handleRegister}
    >
      {({ isSubmitting, isValid, values, setFieldValue, dirty }) => {
        const score = passwordScore(values.password);
        const strengthLabel = strengthLabelFor(score, values.password);

        return (
          <Form className="space-y-4" autoComplete="on" noValidate>
            {serverError && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {successMsg}
              </div>
            )}

            <div>
              <label htmlFor="reg-username" className="block text-sm font-medium text-emerald-900">
                Username
              </label>
              <Field
                id="reg-username"
                name="username"
                autoComplete="username"
                className={fieldClass}
                placeholder="e.g. greenkitchen"
              />
              <ErrorMessage name="username" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-emerald-900">
                Email address
              </label>
              <Field
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                className={fieldClass}
                placeholder="you@example.com"
              />
              <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-emerald-900">
                Password
              </label>
              <div className="relative">
                <Field
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  className={`${fieldClass} pr-12`}
                  placeholder="At least 10 characters"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-emerald-700 hover:text-emerald-900"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                </button>
              </div>
              {values.password ? (
                <div className="mt-2">
                  <div className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 flex-1 rounded-full ${
                          score >= n
                            ? score <= 2
                              ? 'bg-red-400'
                              : score === 3
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-emerald-800/80">
                    Strength: {strengthLabel}. Use upper, lower, and a number or symbol.
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Min. 10 characters with mixed case and a number or symbol.
                </p>
              )}
              <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-emerald-900">
                Confirm password
              </label>
              <div className="relative">
                <Field
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  className={`${fieldClass} pr-12`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-emerald-700 hover:text-emerald-900"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-emerald-900">
                How will you participate?
              </legend>
              <div className="grid gap-2">
                {ROLES.map((role) => {
                  const selected = values.role === role.value;
                  return (
                    <label
                      key={role.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20'
                          : 'border-emerald-100 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={selected}
                        onChange={() => setFieldValue('role', role.value)}
                        className="mt-1 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-emerald-950">{role.title}</span>
                        <span className="block text-xs text-emerald-800/75">{role.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <ErrorMessage name="role" component="p" className="mt-1 text-sm text-red-600" />
            </fieldset>

            <label className="flex items-start gap-3 text-sm text-emerald-900">
              <Field
                type="checkbox"
                name="acceptTerms"
                className="mt-1 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>
                I understand Sustainashare protects sensitive recipient details and only counts verified impact.{' '}
                <a href="/faqs" className="font-medium text-emerald-700 underline underline-offset-2">
                  Learn more
                </a>
              </span>
            </label>
            <ErrorMessage name="acceptTerms" component="p" className="text-sm text-red-600" />

            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className="w-full rounded-lg bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-emerald-800">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitch('login')}
                className="font-semibold text-emerald-900 underline underline-offset-2"
              >
                Log in
              </button>
            </p>
          </Form>
        );
      }}
    </Formik>
  );
}

export default RegistrationForm;
