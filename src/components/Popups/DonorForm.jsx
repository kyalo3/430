import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import countyData from '../../counties';
import businessCategories from '../../business';
import Select from 'react-select';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { AuthContext } from '../../context/AuthContext';



function DonorForm({ handleSwitch }) {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    idNo: Yup.string().required('ID number is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    title: Yup.string().required('Title is required'),
    company: Yup.string().required('Company name is required'),
    typeOfCompany: Yup.string().required('Type of company is required'),
    phoneNumber: Yup.string().matches(
      /^(\+?\d{1,4}[-.\s]?|\(\d{1,4}\)\s?)?(\d{1,4}[-.\s]?){1,4}\d{1,4}$/,
      'Invalid phone number',)
      .required('Contact number is required'),
    counties: Yup.array().min(1, 'At least one location is required').required('At least one location is required'),
    businessCategory: Yup.array().min(1, 'At least one business category is required').required('Business category is required'),
  });
  const countyOptions = countyData.map((county) => ({
    value: county,
    label: county
  }));
  const titleOptions = [
    { value: 'Mr.', label: 'Mr.' },
    { value: 'Mrs.', label: 'Mrs.' },
    { value: 'Ms.', label: 'Ms.' },
    { value: 'Dr.', label: 'Dr.' },
    { value: 'Prof.', label: 'Prof.' },    
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const companyTypeOptions = [
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Grocery Store', label: 'Grocery Store' },
    { value: 'Catering', label: 'Catering' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Other', label: 'Other' },
  ];
  
  
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #f7fafc',
      background: '#ecfdf5',
      borderColor: '#f7fafc',
      borderRadius: '0.375rem', // rounded-md
      minHeight:'3.5rem',
      textAlign:'left',
      boxShadow: 'none',
      '&:focus': {
        borderColor: '#1B7443', // focus:border-secondary
        boxShadow: '0 0 0 3px #1B7443' // focus:ring-secondary
      }
    }),
    option: (provided) => ({
      ...provided,
      padding: '0.5rem',
      textAlign:'left'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e5e7eb', // bg-gray-200
      borderRadius: '0.375rem' // rounded-md
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#374151' // text-gray-700
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#374151', // text-gray-700
      '&:hover': {
        backgroundColor: '#f3f4f6', // hover:bg-gray-200
        color: '#111827' // hover:text-gray-900
      }
    })
  };

  const handleDonorForm = async (values, { resetForm }) => {
    try {
      console.log(userToken);
        const formdata = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            id_no: values.idNo,
            phone_number: values.phoneNumber,
            gender: values.gender,
            address: values.address,
            company: values.company,
            type_of_company: values.typeOfCompany,
            services_interested_in: values.businessCategory,
            participating_locations: values.counties,
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await axios.post('http://127.0.0.1:8000/donors/', formdata, {
          headers: {
            "Authorization": `Bearer ${token}`
        }
        });

        console.log('Donor created successfully:', response.data);
        
        // Set user role to donor
        localStorage.setItem('userRole', 'donor');
        
        resetForm();
        // Redirect to donor dashboard
        navigate('/dashboard/donor');
    } catch (error) {
        console.error('Error submitting form:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        idNo: '',
        gender: '',
        address: '',
        title:'',
        company:'',
        typeOfCompany: '',
        phoneNumber:'',
        counties:[],
        businessCategory:'',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleDonorForm(values, { resetForm });
        setSubmitting(false);
      }}
    >
    {({ values,isSubmitting, setFieldValue, isValid}) => (
      <Form>
        <div className="mb-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="mt-1 bg-emerald-50 block w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
            <div className="w-1/2">
              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="mt-1 block w-full bg-emerald-50 px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
            <Select
                name="title"
                options={titleOptions}
                styles={customSelectStyles}
                className="mt-1 block bg-emerald-50 rounded-md w-full shadow-sm"
                classNamePrefix="Title"
                placeholder="Select title"
                onChange={(selectedOption) => setFieldValue('title', selectedOption.value)}
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
            <div className="w-1/2">
            <Select
                name="gender"
                options={genderOptions}
                styles={customSelectStyles}
                className="mt-1 block bg-emerald-50 rounded-md w-full shadow-sm"
                classNamePrefix="Gender"
                placeholder="Select gender"
                onChange={(selectedOption) => setFieldValue('gender', selectedOption.value)}
              />
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <Field
            type="email"
            name="email"
            placeholder="Email Address"
            className="mt-1 block bg-emerald-50 w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1 text-left" />
        </div>
        <div className="mb-4">
          <Field
            type="text"
            name="idNo"
            placeholder="ID Number"
            className="mt-1 block bg-emerald-50 w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
          />
          <ErrorMessage name="idNo" component="div" className="text-red-500 text-sm mt-1 text-left" />
        </div>
        <div className="mb-4">
          <Field
            type="text"
            name="address"
            placeholder="Physical Address"
            className="mt-1 block bg-emerald-50 w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
          />
          <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1 text-left" />
        </div>
        <div className="mb-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Field
                type="text"
                name="company"
                placeholder="Company Name"
                className="mt-1 block bg-emerald-50 w-full px-3 py-4 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
              />
              <ErrorMessage name="company" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
            <div className="w-1/2">
            <Select
                name="typeOfCompany"
                options={companyTypeOptions}
                styles={customSelectStyles}
                className="mt-1 block bg-emerald-50 rounded-md w-full shadow-sm"
                classNamePrefix="Company Type"
                placeholder="Select company type"
                onChange={(selectedOption) => setFieldValue('typeOfCompany', selectedOption.value)}
              />
              <ErrorMessage name="typeOfCompany" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <PhoneInput
            placeholder="Contact Number"
            defaultCountry="KE"
            value={values.phoneNumber}
            onChange={(phoneNumber) => setFieldValue('phoneNumber', phoneNumber)}
            inputProps={{
                name: 'phoneNumber',
                required: true,
                autoFocus: true,
            }}
          />
          <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1 text-left" />
        </div>
        <hr className='w-full mb-4 mt-4'/>
        <div className="mb-8">
          <div className="flex space-x-4">
            <div className="w-1/2">
            <Select
            isMulti
            name="counties"
            options={countyOptions}
            styles={customSelectStyles}
            className="mt-1 block w-full rounded-md bg-emerald-50 shadow-sm"
            classNamePrefix="Participating Locations"
            placeholder="Select participating locations"
            onChange={(selectedCounties) => setFieldValue('counties', selectedCounties.map(option => option.value))}
          />
              <ErrorMessage name="counties" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
            <div className="w-1/2">
            <Select
              isMulti
              name="businessCategory"
              options={businessCategories}
              styles={customSelectStyles}
              className="mt-1 block bg-emerald-50 w-full rounded-md shadow-sm"
              classNamePrefix="Type of Business"
              placeholder="Select type of business"
              onChange={(selectedBusiness) => setFieldValue('businessCategory', selectedBusiness.map(option => option.value))}
            />
              <ErrorMessage name="businessCategory" component="div" className="text-red-500 text-sm mt-1 text-left" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          style={{ background: isValid ? '#f97316' : '#fdba74' }}
          className="mb-2 w-full py-4 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          LET&apos;S DO THIS
        </button>
        <p className='mb-4 mt-2 text-emerald-700 text-sm text-center'>By signing up, you agree to our Terms of Use and Privacy Policy.</p>
        <p className='mt-4 mb-4 text-sm text-center text-emerald-700'><strong>Not a business?  </strong>
          <button
              type='button'
              onClick={() => handleSwitch('recipient')}
              className="font-s underline text-emerald-700 hover:text-blue-700"
          >
            Sign up to receive food
          </button>
          </p>
      </Form>
    )}
    </Formik>
  )
}

export default DonorForm;
