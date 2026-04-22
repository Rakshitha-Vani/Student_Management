/**
 * StudentForm Component
 * 
 * Reusable form for adding and editing students
 * Demonstrates: useState for form handling, validation, semantic HTML5
 * 
 * WHY SEPARATE FORM:
 * - Can be used for both add and edit modes
 * - Centralized validation logic
 * - Clean separation of concerns
 * - Easy to maintain and test
 */

import { useState, useEffect } from 'react';
import Button from './Button';

const StudentForm = ({ student, onSubmit, onCancel, isLoading }) => {
  // useState - manages form state
  // Each input has its own state, managed by a single handler
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // useEffect - populate form when editing existing student
  // This demonstrates how useEffect handles side effects
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age?.toString() || '',
        course: student.course || ''
      });
    }
  }, [student]);

  // Handle input changes - Closure example
  // The handleChange function "closes over" setFormData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 1 || age > 150) {
      newErrors.age = 'Please enter a valid age (1-150)';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (validate()) {
      onSubmit({
        ...formData,
        age: parseInt(formData.age)
      });
    }
  };

  const isEditMode = !!student;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter student name"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Age Field */}
      <div>
        <label 
          htmlFor="age" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.age 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter student age"
          min="1"
          max="150"
          disabled={isLoading}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age}</p>
        )}
      </div>

      {/* Course Field */}
      <div>
        <label 
          htmlFor="course" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course
        </label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.course 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        >
          <option value="">Select a course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
        </select>
        {errors.course && (
          <p className="mt-1 text-sm text-red-600">{errors.course}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading 
            ? (isEditMode ? 'Updating...' : 'Adding...') 
            : (isEditMode ? 'Update Student' : 'Add Student')
          }
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;