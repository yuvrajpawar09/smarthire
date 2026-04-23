import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
    welcome: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.5rem' },
    sub: { color: '#888', marginBottom: '2rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: '#fff', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    statNum: { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' },
    statLabel: { color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' },
    section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' },
    pipelineRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
    pipelineItem: (color) => ({ background: color, padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '100px' }),
    pipelineNum: { fontSize: '1.4rem', fontWeight: 'bold', color: '#fff' },
    pipelineLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' },
    quickLinks: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    linkBtn: { background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }
};

function RecruiterDashboard() {
    const [stats, setStats] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        API.get('/stats/recruiter').then(res => setStats(res.data)).catch(console.error);
    }, []);

    const pipeline = stats?.applicationsByStatus || {};
    const chartData = stats?.topJobsByApplicants?.map(j => ({
        name: j.jobTitle.length > 15 ? j.jobTitle.substring(0, 15) + '...' : j.jobTitle,
        applicants: j.applicantCount
    })) || [];

    return (
        <div style={styles.container}>
            <div style={styles.welcome}>Recruiter Dashboard</div>
            <div style={styles.sub}>Hi {user?.email} — here's your hiring overview</div>

            {stats && (
                <>
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}><div style={styles.statNum}>{stats.totalJobsPosted}</div><div style={styles.statLabel}>Jobs Posted</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#2ecc71' }}>{stats.activeJobs}</div><div style={styles.statLabel}>Active Jobs</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#e74c3c' }}>{stats.closedJobs}</div><div style={styles.statLabel}>Closed Jobs</div></div>
                        <div style={styles.statCard}><div style={{ ...styles.statNum, color: '#3498db' }}>{stats.totalApplicants}</div><div style={styles.statLabel}>Total Applicants</div></div>
                    </div>

                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>Hiring Pipeline</div>
                        <div style={styles.pipelineRow}>
                            {[
                                { key: 'APPLIED', color: '#3498db', label: 'Applied' },
                                { key: 'SHORTLISTED', color: '#f39c12', label: 'Shortlisted' },
                                { key: 'INTERVIEW', color: '#9b59b6', label: 'Interview' },
                                { key: 'HIRED', color: '#2ecc71', label: 'Hired' },
                                { key: 'REJECTED', color: '#e74c3c', label: 'Rejected' },
                            ].map(s => (
                                <div key={s.key} style={styles.pipelineItem(s.color)}>
                                    <div style={styles.pipelineNum}>{pipeline[s.key] || 0}</div>
                                    <div style={styles.pipelineLabel}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {chartData.length > 0 && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Top Jobs by Applicants</div>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis allowDecimals={false} fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="applicants" fill="#1a1a2e" radius={[4,4,0,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Quick Actions</div>
                <div style={styles.quickLinks}>
                    <Link to="/recruiter/post-job" style={styles.linkBtn}>Post a Job</Link>
                    <Link to="/recruiter/my-jobs" style={styles.linkBtn}>My Jobs</Link>
                </div>
            </div>
        </div>
    );
}

export default RecruiterDashboard;