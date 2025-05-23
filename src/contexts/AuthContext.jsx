import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from stored token
  useEffect(() => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setUser(decoded);
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (token, refreshToken) => {
    try {
      const decoded = jwtDecode(token);
      sessionStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      setUser(decoded);
      setError(null);
    } catch (err) {
      setError('Invalid token received');
      console.error('Login error:', err);
    }
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setError(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Here you would make an API call to your refresh token endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token: newToken, refreshToken: newRefreshToken } = await response.json();
      await handleLogin(newToken, newRefreshToken);
      return newToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      handleLogout();
      throw err;
    }
  }, [handleLogin]);

  const getAuthHeader = useCallback(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        refreshToken,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 