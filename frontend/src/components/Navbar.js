import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    nav: { background: '#1a1a2e', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
    logo: { color: '#4fc3f7', fontSize: '1.4rem', fontWeight: '800', textDecoration: 'none', letterSpacing: '1px' },
    links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' },
    btn: { background: '#e53935', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' },
    userInfo: { color: '#4fc3f7', fontSize: '0.82rem' }
};

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>SmartHire</Link>
            <div style={styles.links}>
                <Link to="/jobs" style={styles.link}>Jobs</Link>
                {user ? (
                    <>
                        {user.role === 'CANDIDATE' && (
                            <>
                                <Link to="/candidate/dashboard" style={styles.link}>Dashboard</Link>
                                <Link to="/candidate/applications" style={styles.link}>Applications</Link>
                                <Link to="/candidate/resume" style={styles.link}>Resume</Link>
                            </>
                        )}
                        {user.role === 'RECRUITER' && (
                            <>
                                <Link to="/recruiter/dashboard" style={styles.link}>Dashboard</Link>
                                <Link to="/recruiter/post-job" style={styles.link}>Post Job</Link>
                                <Link to="/recruiter/my-jobs" style={styles.link}>My Jobs</Link>
                            </>
                        )}
                        <span style={styles.userInfo}>{user.email}</span>
                        <button style={styles.btn} onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;