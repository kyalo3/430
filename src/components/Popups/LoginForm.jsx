import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginForm({ handleSwitch }) {
    const { signIn } = useContext(AuthContext);
    const validationSchemaLogin = Yup.object({
        userName: Yup.string().required('Username is required'),  
        password: Yup.string().required('Password is required')
    });
    const handleLogin = (values, {resetForm }) => {
        try {
            signIn(values.email, values.password);
            resetForm();
        }
        catch (error) {
            console.error('Error during signin', error);
        }
    };

    return (
        <Formik
            initialValues={{
            userName: '',
            password:'',
            }}
            validationSchema={validationSchemaLogin}
            onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
                handleLogin(values, {resetForm});
                setSubmitting(false);
            }, 400);
            }}
        >
            {({ isSubmitting, isValid}) => (
            <Form>
                <div className="mb-4">
                    <Field
                    type="text"
                    name="userName"
                    placeholder="Username"
                    className="mt-1 bg-emerald-50 block w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
                    />
                    <ErrorMessage name="userName" component="div" className="text-red-500 text-sm mt-1 text-left" />
                </div>
                <div className="mb-4">
                    <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="mt-1 block w-full px-3 py-4 bg-emerald-50 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-emerald-700 focus:border-emerald-700 sm:text-sm"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1 text-left" />
                </div>

                <button
                type="submit"
                disabled={isSubmitting}
                style={{background:isValid?'#f97316': '#fdba74'}}
                className="mb-2 w-full py-4 px-4  text-white font-medium rounded-md  focus:outline-none focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                Login
                </button>
                <p className='mb-6 mt-2 text-emerald-700 text-sm text-center'><strong>Forgot your password? </strong> <button className='font-s underline text-primary hover:text-blue-700'>Request a reset link</button></p>
                <p className='mt-4 mb-4 text-emerald-700 text-sm text-center'><strong>Not Registered?  </strong>
                <button
                    onClick={()=> handleSwitch('register')}
                    className="font-s underline text-primary hover:text-blue-700"
                >
                    Sign up
                </button>
                </p>
            </Form>
            )}
        </Formik>
  )
}

export default LoginForm