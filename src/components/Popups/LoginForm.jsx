import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginForm({ handleSwitch }) {
    const { signIn, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const validationSchemaLogin = Yup.object({
        userName: Yup.string().required('Username or Email is required'),  
        password: Yup.string().required('Password is required')
    });
    const handleLogin = async (values, {resetForm, setSubmitting }) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            
            await signIn(values.userName, values.password);
            
            setSuccessMessage('Login successful! Redirecting...');
            resetForm();
            
            // Wait a moment then redirect based on user role
            setTimeout(() => {
                const role = localStorage.getItem('userRole');
                if (role === 'donor') {
                    window.location.href = '/dashboard/donor';
                } else if (role === 'recipient') {
                    window.location.href = '/dashboard/recipient';
                } else if (role === 'volunteer') {
                    window.location.href = '/dashboard/volunteer';
                } else if (role === 'admin') {
                    window.location.href = '/dashboard/admin';
                } else {
                    setSuccessMessage('Login successful! Please complete your profile.');
                }
            }, 1000);
        }
        catch (error) {
            console.error('Error during signin', error);
            let message = 'Login failed. Please check your credentials.';
            
            if (error.response?.data?.detail) {
                message = typeof error.response.data.detail === 'string' 
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
            initialValues={{
                userName: '',
                password: ''
            }}
            validationSchema={validationSchemaLogin}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                await handleLogin(values, { resetForm, setSubmitting });
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, isValid }) => (
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
                            type="text"
                            name="userName"
                            placeholder="Username or Email"
                            autoComplete="off"
                            className="mt-1 bg-emerald-50 block w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
                        />
                        <ErrorMessage name="userName" component="div" className="text-red-500 text-sm mt-1 text-left" />
                    </div>
                    <div className="mb-4">
                        <Field
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            className="mt-1 bg-emerald-50 block w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1 text-left" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        style={{ background: isValid ? '#f97316' : '#fdba74' }}
                        className="mb-2 w-full py-4 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                    <p className='mb-4 mt-2 text-emerald-700 text-sm text-center'>
                        Forgot your password? <a href="#" className="underline text-primary hover:text-blue-700">Request a reset link</a>
                    </p>
                    <p className='mt-4 mb-4 text-emerald-700 text-sm text-center'>
                        <strong>Not Registered?  </strong>
                        <button
                            type="button"
                            onClick={() => handleSwitch('signup')}
                            className="font-s underline text-primary hover:text-blue-700"
                        >
                            Sign up
                        </button>
                    </p>
                </Form>
            )}
        </Formik>
    );
}

export default LoginForm