import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const fieldClass =
  'mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-3 text-sm text-emerald-950 placeholder:text-slate-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30';

function LoginForm({ handleSwitch }) {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validationSchemaLogin = Yup.object({
    userName: Yup.string().required('Username or email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values, { resetForm, setSubmitting }) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await signIn(values.userName, values.password);
      setSuccessMessage('Login successful. Redirecting…');
      resetForm();

      setTimeout(async () => {
        try {
          const { default: api } = await import('../../lib/api');
          const me = await api.get('/users/me');
          const role = me.data?.role;
          if (role === 'donor') navigate('/dashboard/donor');
          else if (role === 'recipient') navigate('/dashboard/recipient');
          else if (role === 'volunteer') navigate('/dashboard/volunteer');
          else if (role === 'admin') navigate('/dashboard/admin');
          else setSuccessMessage('Login successful. Please complete your profile.');
        } catch {
          setSuccessMessage('Login successful.');
        }
      }, 300);
    } catch (error) {
      let message = 'Login failed. Check your credentials and try again.';
      if (error.response?.data?.detail) {
        message =
          typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : JSON.stringify(error.response.data.detail);
      } else if (error.message) {
        message = error.message;
      }
      setErrorMessage(message);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ userName: '', password: '' }}
      validationSchema={validationSchemaLogin}
      onSubmit={async (values, helpers) => {
        await handleLogin(values, helpers);
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="space-y-4" autoComplete="on" noValidate>
          {errorMessage && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {successMessage}
            </div>
          )}

          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-emerald-900">
              Username or email
            </label>
            <Field
              id="login-username"
              type="text"
              name="userName"
              autoComplete="username"
              className={fieldClass}
              placeholder="you@example.com"
            />
            <ErrorMessage name="userName" component="p" className="mt-1 text-sm text-red-600" />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="login-password" className="block text-sm font-medium text-emerald-900">
                Password
              </label>
              <span className="text-xs text-slate-500">Reset coming soon</span>
            </div>
            <div className="relative">
              <Field
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                className={`${fieldClass} pr-12`}
                placeholder="Your password"
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
            <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="w-full rounded-lg bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
          >
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-sm text-emerald-800">
            New to Sustainashare?{' '}
            <button
              type="button"
              onClick={() => handleSwitch('register')}
              className="font-semibold text-emerald-900 underline underline-offset-2"
            >
              Create an account
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
