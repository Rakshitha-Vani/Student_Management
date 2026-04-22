/**
 * FormPage - Add/Edit Student
 * 
 * Reusable form page for both creating and editing students
 * Demonstrates: useState, useEffect, navigation, conditional rendering
 * 
 * KEY CONCEPTS:
 * - Uses URL params to determine add vs edit mode
 * - Uses location state to pass student data for editing
 * - Handles form submission with proper validation
 * - Shows loading state during submission
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useStudents from '../hooks/useStudents';
import StudentForm from '../components/StudentForm';
import LoadingSpinner from '../components/LoadingSpinner';

const FormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get student ID from URL params
  const location = useLocation(); // Get passed state (student data for editing)
  
  // Use custom hook for CRUD operations
  const { addStudent, editStudent, loading } = useStudents();

  // Determine if we're in edit mode
  const isEditMode = !!id;
  
  // Get student data from location state (passed from Dashboard)
  const student = location.state?.student;

  // Local loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if in edit mode but no student data
  useEffect(() => {
    if (isEditMode && !student) {
      // In a real app, you'd fetch the student by ID here
      // For now, redirect back to dashboard
      navigate('/dashboard');
    }
  }, [isEditMode, student, navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditMode) {
        // Update existing student
        result = await editStudent(id, formData);
      } else {
        // Create new student
        result = await addStudent(formData);
      }

      if (result.success) {
        // Navigate back to dashboard on success
        navigate('/dashboard');
      } else {
        // Show error message to user
        alert(`Failed: ${result.error || 'Unknown error occurred'}`);
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel - go back to dashboard
  const handleCancel = () => {
    navigate('/dashboard');
  };

  // Show loading while redirecting in edit mode without data
  if (isEditMode && !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading student data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode 
              ? 'Update the student information below' 
              : 'Fill in the details to add a new student'
            }
          </p>
        </header>

        {/* Form Card */}
        <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <StudentForm
            student={student}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </section>

        {/* Help Text */}
        <aside className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Name should be at least 2 characters</li>
            <li>• Age must be between 1 and 150</li>
            <li>• Select a course from the dropdown</li>
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default FormPage;