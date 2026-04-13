import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'donor', 'recipient', 'volunteer', 'admin'
  const [showDonorRec, setShowDonorRec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full user data from backend
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me');

      if (res.data) {
        setCurrentUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));

        if (res.data.role) {
          setUserRole(res.data.role);
          localStorage.setItem('userRole', res.data.role);
        } else {
          setUserRole(null);
          localStorage.removeItem('userRole');
        }
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    }
  };

  // Sign-up function
  const signUp = async (username, email, password, role, adminCode) => {
    try {
      const payload = {
        user: { username, email, role, password },
        admin_code: adminCode || '',
      };

      await api.post('/register', payload);

      // Auto-login after registration
      await signIn(username, password);

      setShowDonorRec(true);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data || err.message);
      throw err;
    }
  };

  // Sign-in function
  const signIn = async (identifier, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', identifier);
      formData.append('password', password);

      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      setUserToken(token);
      localStorage.setItem('token', token);

      // Fetch the full user data
      await fetchCurrentUser();

      setLoading(false);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data || err.message);
      setLoading(false);
      throw err;
    }
  };

  // Sign-out function
  const signOut = () => {
    setCurrentUser(null);
    setUserToken(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    console.log('User signed out');
  };

  // On mount, check localStorage for token and fetch user
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setUserToken(storedToken);
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userToken,
        userRole,
        showDonorRec,
        setShowDonorRec,
        signUp,
        signIn,
        signOut,
        error,
        setError,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
