import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest, logoutRequest, profileRequest } from '../api/auth';
import { setAuthToken } from '../api/httpClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('mototaxi-token'));
  const [isLoading, setIsLoading] = useState(true);

  const unwrapResource = (resource) => (resource?.data ? resource.data : resource);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      profileRequest()
        .then((profile) => setUser(unwrapResource(profile)))
        .catch(() => {
          handleSignOut();
        })
        .finally(() => setIsLoading(false));
    } else {
      setAuthToken(null);
      setIsLoading(false);
    }
  }, [token]);

  const handleAuthSuccess = (payload) => {
    const nextToken = payload.token;
    localStorage.setItem('mototaxi-token', nextToken);
    setToken(nextToken);
    setUser(unwrapResource(payload.user));
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    handleAuthSuccess(response);
    return response.user;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    handleAuthSuccess(response);
    return response.user;
  };

  const handleSignOut = () => {
    localStorage.removeItem('mototaxi-token');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      handleSignOut();
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user && token),
      user,
      token,
      login,
      register,
      logout,
      isLoading,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
