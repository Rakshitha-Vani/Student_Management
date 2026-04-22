/**
 * Auth Context - Manage authentication state globally
 * 
 * This provides authentication state to all components
 * Uses useState and useEffect for state management
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated as checkAuth, 
  getCurrentUser as getUser,
  logout as authLogout,
  getToken
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const auth = checkAuth();
      const userData = getUser();
      
      setIsAuthenticated(auth);
      setUser(userData);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get token for API calls
  const getAuthToken = () => getToken();

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;