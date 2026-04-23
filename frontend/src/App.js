import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobsList from './pages/JobsList';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';

// Protected route — redirects to login if not authenticated
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<JobsList />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="CANDIDATE"><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute role="RECRUITER"><RecruiterDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
  );
}

function App() {
  return (
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
  );
}

export default App;