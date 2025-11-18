import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  // Load user and API key from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedApiKey = localStorage.getItem('geminiApiKey');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedApiKey) {
        setGeminiApiKey(storedApiKey);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setGeminiApiKey('');
    localStorage.removeItem('user');
    localStorage.removeItem('geminiApiKey');
  };

  const saveApiKey = (apiKey) => {
    setGeminiApiKey(apiKey);
    localStorage.setItem('geminiApiKey', apiKey);
  };

  const value = {
    user,
    geminiApiKey,
    loading,
    login,
    logout,
    saveApiKey
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
