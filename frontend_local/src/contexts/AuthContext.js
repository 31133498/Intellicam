import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate login - accept any email/password
    const userData = {
      id: '1',
      full_name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
      email: email,
      is_verified: true
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const signup = async (userData) => {
    // Simulate signup - always successful
    const newUser = {
      id: Date.now().toString(),
      full_name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      is_verified: true
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, needsVerification: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    verifyEmail: async (email, code) => {
      // Simulate verification - always successful
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};