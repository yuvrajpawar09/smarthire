import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const statusStyle = (status) => ({
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
    background: status === 'HIRED' ? '#eafaf1' : status === 'REJECTED' ? '#fdecea' : status === 'INTERVIEW' ? '#fef9e7' : status === 'SHORTLISTED' ? '#eaf4fd' : '#f5f5f5',
    color: status === 'HIRED' ? '#1e8449' : status === 'REJECTED' ? '#c0392b' : status === 'INTERVIEW' ? '#d68910' : status === 'SHORTLISTED' ? '#1a6fa8' : '#555'
});

const styles = {
    container: { maxWidth: '860px', margin: '2rem auto', padding: '0 1rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e' },
    browseBtn: { background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' },
    left: {},
    jobTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.2rem' },
    company: { color: '#666', fontSize: '0.85rem', marginBottom: '0.2rem' },
    date: { color: '#aaa', fontSize: '0.8rem' },
    withdrawBtn: { background: '#fdecea', color: '#c0392b', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
    empty: { textAlign: 'center', color: '#888', padding: '3rem' },
    timeline: { display: 'flex', gap: '0.5rem', margin: '0.75rem 0', flexWrap: 'wrap' }
};

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED'];

function StatusTimeline({ current }) {
    const rejected = current === 'REJECTED';
    return (
        <div style={styles.timeline}>
            {rejected ? (
                <span style={{ ...statusStyle('REJECTED'), display: 'inline-block' }}>REJECTED</span>
            ) : (
                STAGES.map((s, i) => {
                    const reached = STAGES.indexOf(current) >= i;
                    return (
                        <span key={s} style={{
                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                            background: reached ? '#1a1a2e' : '#f0f0f0',
                            color: reached ? '#fff' : '#aaa'
                        }}>{s}</span>
                    );
                })
            )}
        </div>
    );
}

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/applications/my')
            .then(res => setApplications(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleWithdraw = async (id) => {
        if (!window.confirm('Withdraw this application?')) return;
        try {
            await API.delete(`/applications/${id}/withdraw`);
            setApplications(applications.filter(a => a.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Cannot withdraw at this stage.');
        }
    };

    if (loading) return <div style={styles.empty}>Loading applications...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>My Applications</div>
                <Link to="/jobs" style={styles.browseBtn}>Browse More Jobs</Link>
            </div>

            {applications.length === 0 ? (
                <div style={styles.empty}>
                    You haven't applied to any jobs yet.{' '}
                    <Link to="/jobs">Browse jobs now!</Link>
                </div>
            ) : applications.map(app => (
                <div key={app.id} style={styles.card}>
                    <div style={styles.left}>
                        <div style={styles.jobTitle}>{app.jobTitle}</div>
                        <div style={styles.company}>{app.company} — {app.location}</div>
                        <StatusTimeline current={app.status} />
                        <div style={styles.date}>Applied: {app.appliedAt?.substring(0, 10)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={statusStyle(app.status)}>{app.status}</span>
                        {app.status === 'APPLIED' && (
                            <button style={styles.withdrawBtn} onClick={() => handleWithdraw(app.id)}>
                                Withdraw
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyApplications;