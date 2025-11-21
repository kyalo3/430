import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// Create the AuthContext
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showDonorRec, setShowDonorRec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'donor', 'recipient', 'volunteer', or 'admin'

  // Function to handle user sign-up
  const signUp = async (userName, email, password, role, adminCode) => {
    try {
      console.log('Starting registration...', { username: userName, email });
      // Always wrap user fields in 'user' object for backend compatibility
      const payload = {
        user: {
          username: userName,
          email: email,
          password: password,
          role: role
        }
      };
      // Only include admin_code for admin
      if (role === 'admin') {
        payload.admin_code = adminCode || '';
      }
      const response = await axios.post(`${API_URL}/register`, payload);
      console.log('Registration successful:', response.data);
      console.log('Attempting auto-login with email:', email);
      await signIn(email, password);
      console.log('Auto-login successful');
      // Set userRole and localStorage immediately so redirect works
      setUserRole(role);
      localStorage.setItem('userRole', role);
      setShowDonorRec(true);
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response ? error.response.data : error.message);
      throw error; // Re-throw to be caught by the form handler
    }
  };

  // Function to handle user sign-in
  const signIn = async (identifier, password) => {
    try {
      console.log('Starting login...', { identifier });
      const formData = new URLSearchParams();
      formData.append('username', identifier);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Login response:', response.data);
      const token = response.data.access_token;
      setUserToken(token);
      localStorage.setItem('token', token);

      const userData = { email: identifier };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Determine user role by checking which profile exists
      await determineUserRole(token);

      setLoading(false);
      console.log('Login complete');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
      setLoading(false);
      throw error; // Re-throw to be caught by the form handler
    }
  };

  // Function to determine user role based on existing profiles
  const determineUserRole = async (token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Try to get user info and use role directly if present
      try {
        const userRes = await axios.get(`${API_URL}/users/me`, config);
        if (userRes.data && userRes.data.role) {
          setUserRole(userRes.data.role);
          localStorage.setItem('userRole', userRes.data.role);
          return;
        }
      } catch (err) {
        console.log('Could not fetch /users/me for role:', err);
      }

      // Fallback: Check if user has a donor profile
      try {
        await axios.get(`${API_URL}/donors/`, config);
        setUserRole('donor');
        localStorage.setItem('userRole', 'donor');
        return;
      } catch (err) {
        console.log('No donor profile found');
      }

      // Fallback: Check if user has a recipient profile
      try {
        await axios.get(`${API_URL}/recipients/`, config);
        setUserRole('recipient');
        localStorage.setItem('userRole', 'recipient');
        return;
      } catch (err) {
        console.log('No recipient profile found');
      }

      // Fallback: Check if user has a volunteer profile
      try {
        await axios.get(`${API_URL}/volunteers/`, config);
        setUserRole('volunteer');
        localStorage.setItem('userRole', 'volunteer');
        return;
      } catch (err) {
        console.log('No volunteer profile found');
      }

      // Default to showing donor/recipient selection
      setUserRole(null);
      localStorage.removeItem('userRole');
    } catch (error) {
      console.error('Error determining user role:', error);
      setUserRole(null);
    }
  };

  // Function to handle user sign-out
  const signOut = () => {
    setCurrentUser(null);
    setUserToken(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    console.log('User signed out');
  };

  // Check local storage for an authenticated user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedToken) setUserToken(storedToken);
    if (storedRole) setUserRole(storedRole);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userToken, userRole, showDonorRec, setShowDonorRec, signUp, signIn, signOut, error, setError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
