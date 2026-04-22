/**
 * App Component - Main Application Entry Point
 * 
 * Sets up routing with authentication
 * 
 * ROUTING STRUCTURE:
 * / - Landing page (public)
 * /login - Login page (public)
 * /signup - Signup page (public)
 * /dashboard - Dashboard (protected)
 * /students/add - Add student (protected)
 * /students/edit/:id - Edit student (protected)
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navbar appears on all pages */}
          <Navbar />
          
          {/* Route content changes based on URL */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/add" 
              element={
                <ProtectedRoute>
                  <FormPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/edit/:id" 
              element={
                <ProtectedRoute>
                  <FormPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;