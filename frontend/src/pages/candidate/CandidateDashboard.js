import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3498db', '#f39c12', '#9b59b6', '#2ecc71', '#e74c3c'];

const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
    welcome: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.5rem' },
    sub: { color: '#888', marginBottom: '2rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: '#fff', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    statNum: { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' },
    statLabel: { color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' },
    section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' },
    appRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f5f5f5' },
    jobName: { fontWeight: '600', color: '#1a1a2e' },
    company: { color: '#888', fontSize: '0.85rem' },
    statusBadge: (status) => ({
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        background: status === 'HIRED' ? '#eafaf1' : status === 'REJECTED' ? '#fdecea' : status === 'INTERVIEW' ? '#fef9e7' : status === 'SHORTLISTED' ? '#eaf4fd' : '#f5f5f5',
        color: status === 'HIRED' ? '#1e8449' : status === 'REJECTED' ? '#c0392b' : status === 'INTERVIEW' ? '#d68910' : status === 'SHORTLISTED' ? '#1a6fa8' : '#555'
    }),
    quickLinks: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    linkBtn: { background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }
};

function CandidateDashboard() {
    const [stats, setStats] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        API.get('/stats/candidate').then(res => setStats(res.data)).catch(console.error);
    }, []);

    const chartData = stats ? [
        { name: 'Applied', value: stats.totalApplications - stats.shortlisted - stats.interviews - stats.hired - stats.rejected },
        { name: 'Shortlisted', value: stats.shortlisted },
        { name: 'Interview', value: stats.interviews },
        { name: 'Hired', value: stats.hired },
        { name: 'Rejected', value: stats.rejected },
    ].filter(d => d.value > 0) : [];

    return (
        <div style={styles.container}>
            <div style={styles.welcome}>Welcome, {user?.email}!</div>
            <div style={styles.sub}>Here's your job search overview</div>

            {stats && (
                <>
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}><div style={styles.statNum}>{stats.totalApplications}</div><div style={styles.statLabel}>Total Applied</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#f39c12' }}>{stats.shortlisted}</div><div style={styles.statLabel}>Shortlisted</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#9b59b6' }}>{stats.interviews}</div><div style={styles.statLabel}>Interviews</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#2ecc71' }}>{stats.hired}</div><div style={styles.statLabel}>Hired</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#e74c3c' }}>{stats.rejected}</div><div style={styles.statLabel}>Rejected</div></div>
                    </div>

                    {chartData.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Application Status Chart</div>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                                        {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {stats.recentApplications?.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Recent Applications</div>
                            {stats.recentApplications.map((app, i) => (
                                <div key={i} style={styles.appRow}>
                                    <div>
                                        <div style={styles.jobName}>{app.jobTitle}</div>
                                        <div style={styles.company}>{app.company}</div>
                                    </div>
                                    <span style={styles.statusBadge(app.status)}>{app.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Quick Actions</div>
                <div style={styles.quickLinks}>
                    <Link to="/jobs" style={styles.linkBtn}>Browse Jobs</Link>
                    <Link to="/candidate/applications" style={styles.linkBtn}>My Applications</Link>
                </div>
            </div>
        </div>
    );
}

export default CandidateDashboard;