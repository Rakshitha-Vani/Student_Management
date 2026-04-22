/**
 * Auth Service - API calls for authentication
 * 
 * Uses fetch API (no axios) as per requirements
 * Handles JWT token storage in localStorage
 */

const API_BASE_URL = 'http://127.0.0.1:5001';

/**
 * Helper function to handle API responses
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(response.statusText || 'Invalid response');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error ${response.status}`);
  }

  return data;
};

/**
 * SIGNUP - Register new user
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await handleResponse(response);
    
    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.data));
    }
    
    return result;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * LOGIN - Authenticate user
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse(response);
    
    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.data));
    }
    
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * LOGOUT - Clear stored data
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * GET CURRENT USER - Get stored user data
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * GET TOKEN - Get stored JWT token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * CHECK IF LOGGED IN
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * GET AUTH HEADER - Returns header with JWT token
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getAuthHeader
};