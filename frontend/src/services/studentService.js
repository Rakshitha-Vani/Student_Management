/**
 * Student Service - API Integration Layer
 * 
 * This service handles all HTTP communication with the backend
 * Uses native fetch API (no axios) as per requirements
 * 
 * IMPORTANT: All requests include JWT token for authentication
 */

export const API_BASE_URL = 'http://127.0.0.1:5001';

/**
 * Get auth header with JWT token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Helper function to handle API responses
 */
const handleResponse = async (response) => {
  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(response.statusText || 'Invalid response');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error ${response.status}`);
  }

  // Normalize student IDs and handle results
  if (Array.isArray(data.data)) {
    return data.data.map(s => ({ ...s, id: s._id || s.id }));
  }
  
  const student = data.data;
  if (student && (student._id || student.id)) {
    return { ...student, id: student._id || student.id };
  }
  
  return student;
};

/**
 * GET all students - Fetch list from /api/students
 */
export const getStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

/**
 * GET single student by ID
 */
export const getStudentById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};

/**
 * POST create new student
 */
export const createStudent = async (studentData) => {
  try {
    const isFormData = studentData instanceof FormData;
    
    const headers = { ...getAuthHeader() };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers,
      body: isFormData ? studentData : JSON.stringify(studentData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * PUT update existing student
 */
export const updateStudent = async (id, studentData) => {
  try {
    const isFormData = studentData instanceof FormData;
    
    const headers = { ...getAuthHeader() };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'PUT',
      headers,
      body: isFormData ? studentData : JSON.stringify(studentData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

/**
 * DELETE student
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

/**
 * SEARCH students
 */
export const searchStudents = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students?search=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export default {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};