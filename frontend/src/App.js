import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import JobsList from './pages/JobsList';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import ResumeUpload from './pages/candidate/ResumeUpload';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import MyJobs from './pages/recruiter/MyJobs';

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
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobsList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Candidate routes */}
                <Route path="/candidate/dashboard" element={
                    <ProtectedRoute role="CANDIDATE"><CandidateDashboard /></ProtectedRoute>
                } />
                <Route path="/candidate/applications" element={
                    <ProtectedRoute role="CANDIDATE"><MyApplications /></ProtectedRoute>
                } />
                <Route path="/candidate/resume" element={
                    <ProtectedRoute role="CANDIDATE"><ResumeUpload /></ProtectedRoute>
                } />

                {/* Recruiter routes */}
                <Route path="/recruiter/dashboard" element={
                    <ProtectedRoute role="RECRUITER"><RecruiterDashboard /></ProtectedRoute>
                } />
                <Route path="/recruiter/post-job" element={
                    <ProtectedRoute role="RECRUITER"><PostJob /></ProtectedRoute>
                } />
                <Route path="/recruiter/my-jobs" element={
                    <ProtectedRoute role="RECRUITER"><MyJobs /></ProtectedRoute>
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