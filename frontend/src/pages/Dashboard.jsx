/**
 * Dashboard Page
 * 
 * Main page for viewing and managing students
 * Demonstrates: useState, useEffect, custom hooks, responsive design
 * 
 * FEATURES:
 * - Display students in table or card view
 * - Add, edit, delete students
 * - Search functionality (UI only)
 * - Loading and empty states
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudents from '../hooks/useStudents';
import StudentCard from '../components/StudentCard';
import StudentTable from '../components/StudentTable';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Use custom hook for student data management
  // This demonstrates the useState and useEffect concepts
  const { students, loading, error, addStudent, editStudent, removeStudent } = useStudents();

  // View mode state (table or cards)
  const [viewMode, setViewMode] = useState('table');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add student - navigate to form
  const handleAdd = () => {
    navigate('/students/add');
  };

  // Handle edit student - navigate to form with student data
  // Note: Backend uses _id, frontend used id - handle both for compatibility
  const handleEdit = (student) => {
    const studentId = student._id || student.id;
    navigate(`/students/edit/${studentId}`, { state: { student } });
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  // Confirm delete
  const confirmDelete = async () => {
    await removeStudent(deleteConfirm);
    setDeleteConfirm(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Loading state
  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner text="Loading students..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your student records</p>
        </header>

        {/* Controls Section */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students by name or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cards
                </button>
              </div>

              {/* Add Student Button */}
              <Button onClick={handleAdd} variant="primary">
                + Add Student
              </Button>
            </div>
          </div>
        </section>

        {/* Students Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>

        {/* Students Display */}
        <section>
          {filteredStudents.length === 0 ? (
            <EmptyState 
              title={searchQuery ? 'No matching students' : 'No students yet'}
              message={searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Click "Add Student" to create your first student record'
              }
            />
          ) : viewMode === 'table' ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <StudentTable 
                students={filteredStudents}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={confirmDelete} 
                  variant="danger" 
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button 
                  onClick={cancelDelete} 
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;