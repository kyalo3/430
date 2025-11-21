import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function RegistrationForm({ handleSwitch }) {
  const { signUp, showDonorRec, currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const validationSchemaRegister = Yup.object({
    userNameReg: Yup.string().required('Username is required'),
    emailReg: Yup.string().email('Invalid email address').required('Email address is required'),    
    passwordReg: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPasswordReg: Yup.string()
      .oneOf([Yup.ref('passwordReg'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    role: Yup.string().oneOf(['donor', 'recipient', 'volunteer', 'admin'], 'Please select a role').required('Please select a role'),
    adminCode: Yup.string().when('role', {
      is: 'admin',
      then: Yup.string().required('Admin code is required'),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const handleSignUp = async (values, { resetForm, setSubmitting }) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);
    try {
      // Pass adminCode if role is admin
      await signUp(values.userNameReg, values.emailReg, values.passwordReg, values.role, values.adminCode);
      // Store the selected role for use after login
      localStorage.setItem('regRole', values.role);
      setSuccessMessage('Registration successful! Please complete your profile.');
      resetForm();
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      if (error.response?.data?.detail) {
        message = typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail);
      } else if (error.response?.data) {
        message = typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      setErrorMessage(message);
      // Log error for debugging
      if (error.config && error.config.url) {
        console.error('Registration request failed:', error.config.url, error);
      } else {
        console.error('Registration error:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        userNameReg: '',
        emailReg: '',
        passwordReg: '',
        confirmPasswordReg: '',
        role: '',
        adminCode: '',
      }}
      validationSchema={validationSchemaRegister}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleSignUp(values, { resetForm, setSubmitting });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, values, setFieldValue }) => (
        <Form autoComplete='off'>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <div className="mb-4">
            <Field
              id="userNameReg"
              type="text"
              name="userNameReg"
              placeholder="Username"
              autoComplete="off"
              className="mt-1 bg-emerald-50 block w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
            />
            <ErrorMessage name="userNameReg" component="div" className="text-red-500 text-sm mt-1 text-left" />
          </div>
          <div className="mb-4">
            <Field
              id="emailReg"
              type="email"
              name="emailReg"
              placeholder="Email Address"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-4 bg-emerald-50 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
            />
            <ErrorMessage name="emailReg" component="div" className="text-red-500 text-sm mt-1 text-left" />
          </div>
          <div className="mb-4">
            <Field
              id="passwordReg"
              type="password"
              name="passwordReg"
              placeholder="Password"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-4 bg-emerald-50 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
            />
            <ErrorMessage name="passwordReg" component="div" className="text-red-500 text-sm mt-1 text-left" />
          </div>
          <div className="mb-4">
            <Field
              id="confirmPasswordReg"
              type="password"
              name="confirmPasswordReg"
              placeholder="Confirm Password"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-4 bg-emerald-50 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
            />
            <ErrorMessage name="confirmPasswordReg" component="div" className="text-red-500 text-sm mt-1 text-left" />
          </div>
          <div className="mb-4">
            <label className="block text-emerald-800 font-semibold mb-2">Select Your Category</label>
            <Field as="select" id="role" name="role" className="block w-full px-3 py-3 border border-emerald-200 rounded-md bg-emerald-50 focus:outline-none focus:ring-emerald-700 focus:border-emerald-700">
              <option value="">-- Choose a category --</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </Field>
            <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1 text-left" />
          </div>
          {/* Admin code field, only show if admin is selected */}
          {values.role === 'admin' && (
            <div className="mb-4">
              <Field
                id="adminCode"
                type="password"
                name="adminCode"
                placeholder="Enter admin registration code"
                autoComplete="off"
                className="mt-1 block w-full px-3 py-4 bg-emerald-50 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
              />
              <ErrorMessage name="adminCode" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            style={{ background: isValid ? '#f97316' : '#fdba74' }}
            className="mb-2 w-full py-4 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Registering...
              </>
            ) : (
              "Register Now"
            )}
          </button>
          <p className='mb-4 mt-2 text-emerald-700 text-sm text-center'>
            By registering, you agree to our Terms of Use and Privacy Policy.
          </p>
          <p className='mt-4 mb-4 text-emerald-700 text-sm text-center'>
            <strong>Already Registered?  </strong>
            <button
              type="button"
              onClick={() => handleSwitch('login')}
              className="font-s underline text-primary hover:text-blue-700"
            >
              Login
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}

export default RegistrationForm;
