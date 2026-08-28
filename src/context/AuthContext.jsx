import { createContext, useState, useEffect, useContext } from 'react';
import api, { setCsrfToken, clearClientAuth } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showDonorRec, setShowDonorRec] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // userToken kept as boolean-ish for legacy components; never persisted
  const [userToken, setUserToken] = useState(null);

  const applySession = (payload) => {
    if (payload?.csrf_token) setCsrfToken(payload.csrf_token);
    if (payload?.user) {
      setCurrentUser(payload.user);
      setUserRole(payload.user.role);
      setUserToken(true);
    } else if (payload?.csrf_token) {
      setUserToken(true);
    }
  };

  const fetchCurrentUser = async () => {
    const res = await api.get('/users/me');
    setCurrentUser(res.data);
    setUserRole(res.data.role);
    return res.data;
  };

  const signIn = async (identifier, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', identifier);
      formData.append('password', password);
      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      applySession(response.data);
      let user = response.data.user;
      if (!user) user = await fetchCurrentUser();
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (username, email, password, role) => {
    try {
      const registered = await api.post('/register', { user: { username, email, role, password } });
      const payload = registered.data || {};
      if (payload.verification_required && payload.email_verified === false) {
        return {
          ...payload,
          needsVerification: true,
        };
      }
      const user = await signIn(username, password);
      setShowDonorRec(true);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/logout');
    } catch (_) {
      /* ignore */
    }
    clearClientAuth();
    setCurrentUser(null);
    setUserToken(null);
    setUserRole(null);
  };

  useEffect(() => {
    (async () => {
      try {
        // Prefer refresh cookie if present
        try {
          const refreshed = await api.post('/refresh');
          applySession(refreshed.data);
        } catch (_) {
          /* no session */
        }
        await fetchCurrentUser();
      } catch (_) {
        clearClientAuth();
        setCurrentUser(null);
        setUserRole(null);
        setUserToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userToken,
        userRole,
        authLoading: loading,
        showDonorRec,
        setShowDonorRec,
        signUp,
        signIn,
        signOut,
        error,
        setError,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-emerald-900">Loading session…</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
