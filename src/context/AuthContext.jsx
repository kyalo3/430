import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showDonorRec, setShowDonorRec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Function to handle user sign-up
  const signUp = async (userName, email, password) => {
    try {
      setCurrentUser(null);
      const response = await axios.post('http://127.0.0.1:8000/register', {
        username: userName,
        email,
        password,
      });

      const { access_token, token_type } = response.data;
      const tokenData = { token: access_token, type: token_type };
      const user = response.data;

      setUserToken(tokenData);
      setCurrentUser(user);
      console.log(userToken);
      console.log("User Data Auth:", user);
      setShowDonorRec(true);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Sign-up failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  // Function to handle user sign-in
  const signIn = async (userName, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', userName);
      formData.append('password', password);

      const response = await axios.post('http://127.0.0.1:8000/login/', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, token_type } = response.data;
      const tokenData = { token: access_token, type: token_type };

      setUserToken(tokenData);
      localStorage.setItem('userToken', JSON.stringify(tokenData));
      console.log('Login successful:', tokenData);
    } catch (error) {
      console.error('Sign-in failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  // Function to handle user sign-out
  const signOut = () => {
    setCurrentUser(null);
    setUserToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    console.log('User signed out');
  };

  // Check local storage for an authenticated user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('userToken');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedToken) setUserToken(JSON.parse(storedToken));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userToken, showDonorRec, setShowDonorRec, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
