import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem'
    },
    subtitle: {
        color: '#888',
        marginBottom: '2rem',
        fontSize: '0.9rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.4rem',
        fontWeight: '500',
        fontSize: '0.9rem',
        color: '#444'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1.5px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        marginBottom: '1.2rem',
        transition: 'border-color 0.2s'
    },
    btn: {
        width: '100%',
        padding: '0.85rem',
        background: '#1a1a2e',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.5rem'
    },
    error: {
        background: '#ffeaea',
        color: '#c0392b',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    },
    link: {
        color: '#4fc3f7',
        textDecoration: 'none'
    },
    footer: {
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.9rem',
        color: '#888'
    }
};

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data.token, {
                email: res.data.email,
                role: res.data.role
            });
            if (res.data.role === 'RECRUITER') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.title}>Welcome back</div>
                <div style={styles.subtitle}>Login to your SmartHire account</div>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    <button style={styles.btn} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div style={styles.footer}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Register here</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;