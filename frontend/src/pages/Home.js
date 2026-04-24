import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    hero: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
    },
    inner: { maxWidth: '680px' },
    badge: { background: 'rgba(79, 195, 247, 0.15)', color: '#4fc3f7', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', display: 'inline-block', marginBottom: '1.5rem', border: '1px solid rgba(79, 195, 247, 0.3)' },
    h1: { fontSize: '3rem', fontWeight: '800', color: '#fff', lineHeight: '1.15', marginBottom: '1rem' },
    highlight: { color: '#4fc3f7' },
    p: { color: '#9ca3af', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' },
    btnRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
    primaryBtn: { background: '#4fc3f7', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem' },
    secondaryBtn: { background: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.3)' },
    stats: { display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' },
    stat: { textAlign: 'center' },
    statNum: { fontSize: '2rem', fontWeight: '800', color: '#4fc3f7' },
    statLabel: { color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.25rem' }
};

function Home() {
    const { user } = useAuth();
    return (
        <div style={styles.hero}>
            <div style={styles.inner}>
                <div style={styles.badge}>AI-Powered Job Portal</div>
                <h1 style={styles.h1}>
                    Find Your Dream Job with <span style={styles.highlight}>SmartHire</span>
                </h1>
                <p style={styles.p}>
                    SmartHire uses AI to match your resume with the best job opportunities.
                    Apply smarter, get hired faster.
                </p>
                <div style={styles.btnRow}>
                    {user ? (
                        <Link to="/jobs" style={styles.primaryBtn}>Browse Jobs</Link>
                    ) : (
                        <>
                            <Link to="/register" style={styles.primaryBtn}>Get Started Free</Link>
                            <Link to="/login" style={styles.secondaryBtn}>Login</Link>
                        </>
                    )}
                    <Link to="/jobs" style={styles.secondaryBtn}>View Jobs</Link>
                </div>
                <div style={styles.stats}>
                    <div style={styles.stat}><div style={styles.statNum}>100+</div><div style={styles.statLabel}>Jobs Posted</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>AI</div><div style={styles.statLabel}>Resume Matching</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>2</div><div style={styles.statLabel}>User Roles</div></div>
                </div>
            </div>
        </div>
    );
}

export default Home;