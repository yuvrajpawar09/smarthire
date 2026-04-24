import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e' },
    postBtn: { background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' },
    jobTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' },
    company: { color: '#666', fontSize: '0.9rem', marginTop: '0.2rem' },
    tagRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
    tag: { background: '#e8f4fd', color: '#1a6fa8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' },
    activeTag: { background: '#eafaf1', color: '#1e8449', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
    closedTag: { background: '#fdecea', color: '#c0392b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
    actionRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' },
    viewBtn: { background: '#f0f0f0', color: '#333', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
    deleteBtn: { background: '#fdecea', color: '#c0392b', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
    applicantsBtn: { background: '#eaf4fd', color: '#1a6fa8', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
    empty: { textAlign: 'center', color: '#888', padding: '3rem' },
    date: { color: '#aaa', fontSize: '0.8rem' },
    salary: { color: '#27ae60', fontWeight: '600', fontSize: '0.85rem' }
};

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState({});
    const [showApplicants, setShowApplicants] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchMyJobs(); }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await API.get('/jobs/my-jobs');
            setJobs(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try {
            await API.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err) { alert(err.response?.data?.error || 'Failed to delete'); }
    };

    const handleViewApplicants = async (jobId) => {
        if (showApplicants === jobId) { setShowApplicants(null); return; }
        try {
            const res = await API.get(`/applications/job/${jobId}`);
            setApplicants(prev => ({ ...prev, [jobId]: res.data }));
            setShowApplicants(jobId);
        } catch (err) { alert('Failed to load applicants'); }
    };

    const handleStatusChange = async (appId, status, jobId) => {
        try {
            await API.patch(`/applications/${appId}/status`, { status });
            const res = await API.get(`/applications/job/${jobId}`);
            setApplicants(prev => ({ ...prev, [jobId]: res.data }));
        } catch (err) { alert('Failed to update status'); }
    };

    if (loading) return <div style={styles.empty}>Loading your jobs...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>My Posted Jobs</div>
                <Link to="/recruiter/post-job" style={styles.postBtn}>+ Post New Job</Link>
            </div>

            {jobs.length === 0 ? (
                <div style={styles.empty}>
                    No jobs posted yet. <Link to="/recruiter/post-job">Post your first job!</Link>
                </div>
            ) : jobs.map(job => (
                <div key={job.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div>
                            <div style={styles.jobTitle}>{job.title}</div>
                            <div style={styles.company}>{job.company} — {job.location}</div>
                        </div>
                        <div style={styles.date}>{job.createdAt?.substring(0, 10)}</div>
                    </div>

                    <div style={styles.tagRow}>
            <span style={job.status === 'ACTIVE' ? styles.activeTag : styles.closedTag}>
              {job.status}
            </span>
                        <span style={styles.tag}>{job.jobType?.replace('_', ' ')}</span>
                        {job.salaryRange && <span style={styles.salary}>{job.salaryRange}</span>}
                    </div>

                    <div style={{ color: '#777', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Skills: {job.skills}
                    </div>

                    <div style={styles.actionRow}>
                        <button style={styles.applicantsBtn} onClick={() => handleViewApplicants(job.id)}>
                            {showApplicants === job.id ? 'Hide Applicants' : 'View Applicants'}
                        </button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(job.id)}>Delete</button>
                    </div>

                    {showApplicants === job.id && applicants[job.id] && (
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1a1a2e' }}>
                                Applicants ({applicants[job.id].length})
                            </div>
                            {applicants[job.id].length === 0 ? (
                                <div style={{ color: '#888', fontSize: '0.9rem' }}>No applicants yet.</div>
                            ) : applicants[job.id].map(app => (
                                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f5f5f5' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{app.candidateName}</div>
                                        <div style={{ color: '#888', fontSize: '0.8rem' }}>{app.candidateEmail}</div>
                                    </div>
                                    <select
                                        value={app.status}
                                        onChange={e => handleStatusChange(app.id, e.target.value, job.id)}
                                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="SHORTLISTED">Shortlisted</option>
                                        <option value="INTERVIEW">Interview</option>
                                        <option value="HIRED">Hired</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MyJobs;