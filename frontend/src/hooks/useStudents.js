/**
 * Custom Hook: useStudents
 * 
 * This hook manages student data state and provides CRUD operations
 * Now uses REAL API calls instead of mock data
 * 
 * DEMONSTRATES:
 * - useState: For managing students, loading, and error states
 * - useEffect: For fetching data on component mount
 * - Closures: Event handlers close over state variables
 * - Virtual DOM: React efficiently updates only changed elements
 */

import { useState, useEffect, useCallback } from 'react';
import * as studentService from '../services/studentService';

export const useStudents = () => {
  // useState - manages state in functional components
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect - Side effect handling
   * Runs after component mounts (empty dependency array)
   * Fetches students from the real API
   * 
   * Virtual DOM Concept:
   * React creates a virtual representation of the UI in memory.
   * When state changes, React compares old virtual DOM with new (reconciliation).
   * Only updates what actually changed - making updates efficient and fast.
   */
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new student - POST request
  const addStudent = async (studentData) => {
    try {
      setLoading(true);
      setError(null);
      const newStudent = await studentService.createStudent(studentData);
      // Optimistic update: add to existing list
      setStudents(prevStudents => [...prevStudents, newStudent]);
      return { success: true, student: newStudent };
    } catch (err) {
      setError(err.message || 'Failed to create student');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing student - PUT request
  const editStudent = async (id, studentData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedStudent = await studentService.updateStudent(id, studentData);
      // Update the specific student in the list
      // Handle both _id (MongoDB) and id (legacy)
      setStudents(prevStudents => 
        prevStudents.map(student => {
          const studentId = student._id?.toString() || student.id;
          return studentId === id ? updatedStudent : student;
        })
      );
      return { success: true, student: updatedStudent };
    } catch (err) {
      setError(err.message || 'Failed to update student');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete student - DELETE request
  const removeStudent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await studentService.deleteStudent(id);
      // Optimistic update: remove from list immediately
      // Handle both _id (MongoDB ObjectId) and id (string)
      setStudents(prevStudents => 
        prevStudents.filter(student => {
          const studentId = student._id?.toString() || student.id;
          return studentId !== id;
        })
      );
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete student');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get single student by ID
  const getStudent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const student = await studentService.getStudentById(id);
      return { success: true, student };
    } catch (err) {
      setError(err.message || 'Failed to fetch student');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Return state and functions for use in components
  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    editStudent,
    removeStudent,
    getStudent,
    clearError
  };
};

export default useStudents;