import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5'
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    title: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.5rem' },
    subtitle: { color: '#888', marginBottom: '2rem', fontSize: '0.9rem' },
    label: { display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem', color: '#444' },
    input: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', marginBottom: '1.2rem' },
    select: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', marginBottom: '1.2rem', background: '#fff' },
    btn: { width: '100%', padding: '0.85rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' },
    error: { background: '#ffeaea', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
    success: { background: '#eafaf1', color: '#1e8449', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
    link: { color: '#4fc3f7', textDecoration: 'none' },
    footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#888' }
};

function Register() {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await API.post('/auth/register', form);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.title}>Create account</div>
                <div style={styles.subtitle}>Join SmartHire today</div>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Full Name</label>
                    <input style={styles.input} name="fullName" value={form.fullName} onChange={handleChange} placeholder="Yuvraj Pawar" required />
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    <label style={styles.label}>Password</label>
                    <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
                    <label style={styles.label}>I am a</label>
                    <select style={styles.select} name="role" value={form.role} onChange={handleChange}>
                        <option value="CANDIDATE">Candidate — looking for jobs</option>
                        <option value="RECRUITER">Recruiter — hiring talent</option>
                    </select>
                    <button style={styles.btn} disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <div style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;