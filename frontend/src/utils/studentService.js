/**
 * Student Service - Simulates API calls
 * 
 * This service mimics backend API calls using async/await and setTimeout
 * In the future, these functions will make actual HTTP requests to the backend
 * 
 * WHY SEPARATE SERVICE LAYER:
 * - Keeps API logic separate from UI components
 * - Easy to swap mock data for real API calls later
 * - Centralizes all data fetching logic in one place
 * - Makes testing easier (can mock these functions)
 */

import { mockStudents } from './mockData';

// Simulate network delay (500-1000ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET all students - simulates fetching from /api/students
 * Uses useEffect to call this on component mount
 */
export const getStudents = async () => {
  await delay(800); // Simulate network latency
  return [...mockStudents]; // Return copy to prevent mutation
};

/**
 * GET single student by ID - simulates /api/students/:id
 */
export const getStudentById = async (id) => {
  await delay(500);
  const student = mockStudents.find(s => s.id === id);
  if (!student) {
    throw new Error('Student not found');
  }
  return { ...student };
};

/**
 * POST create new student - simulates POST /api/students
 * In a real app, this would send JSON body to backend
 */
export const createStudent = async (studentData) => {
  await delay(800);
  
  // Validate data
  if (!studentData.name || !studentData.age || !studentData.course) {
    throw new Error('All fields are required');
  }
  
  // Create new student with generated ID
  const newStudent = {
    id: String(Date.now()), // Simple ID generation
    ...studentData,
    createdAt: new Date().toISOString()
  };
  
  return newStudent;
};

/**
 * PUT update existing student - simulates PUT /api/students/:id
 */
export const updateStudent = async (id, studentData) => {
  await delay(800);
  
  const existingStudent = mockStudents.find(s => s.id === id);
  if (!existingStudent) {
    throw new Error('Student not found');
  }
  
  // Validate data
  if (!studentData.name || !studentData.age || !studentData.course) {
    throw new Error('All fields are required');
  }
  
  // Return updated student
  return {
    ...existingStudent,
    ...studentData,
    updatedAt: new Date().toISOString()
  };
};

/**
 * DELETE student - simulates DELETE /api/students/:id
 */
export const deleteStudent = async (id) => {
  await delay(600);
  
  const existingStudent = mockStudents.find(s => s.id === id);
  if (!existingStudent) {
    throw new Error('Student not found');
  }
  
  return { success: true, message: 'Student deleted successfully' };
};

/**
 * SEARCH students - simulates GET /api/students?search=query
 * This is a bonus feature for filtering students
 */
export const searchStudents = async (query) => {
  await delay(500);
  
  const lowerQuery = query.toLowerCase();
  return mockStudents.filter(student => 
    student.name.toLowerCase().includes(lowerQuery) ||
    student.course.toLowerCase().includes(lowerQuery)
  );
};

/**
 * FUTURE API INTEGRATION NOTES:
 * 
 * When connecting to real backend, replace these functions with:
 * 
 * import axios from 'axios';
 * 
 * export const getStudents = async () => {
 *   const response = await axios.get('/api/students');
 *   return response.data;
 * };
 * 
 * export const createStudent = async (studentData) => {
 *   const response = await axios.post('/api/students', studentData);
 *   return response.data;
 * };
 * 
 * etc.
 */