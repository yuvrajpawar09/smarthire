import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
    title: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '1.5rem' },
    searchRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    input: { flex: 1, padding: '0.7rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', minWidth: '180px' },
    searchBtn: { padding: '0.7rem 1.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' },
    jobTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.25rem' },
    company: { color: '#555', fontSize: '0.95rem', marginBottom: '0.5rem' },
    tagRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
    tag: { background: '#e8f4fd', color: '#1a6fa8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' },
    tagGreen: { background: '#eafaf1', color: '#1e8449', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' },
    desc: { color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' },
    applyBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
    appliedTag: { background: '#eafaf1', color: '#1e8449', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' },
    pageBtn: { padding: '6px 14px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: '#fff' },
    pageBtnActive: { padding: '6px 14px', border: '1px solid #1a1a2e', borderRadius: '6px', cursor: 'pointer', background: '#1a1a2e', color: '#fff' },
    empty: { textAlign: 'center', color: '#888', padding: '3rem', fontSize: '1rem' },
    salary: { color: '#27ae60', fontWeight: '600', fontSize: '0.9rem' }
};

function JobsList() {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [applied, setApplied] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = { page, size: 8 };
            if (keyword) params.keyword = keyword;
            if (location) params.location = location;
            const res = await API.get('/jobs', { params });
            setJobs(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        fetchJobs();
    };

    const handleApply = async (jobId) => {
        if (!user) { navigate('/login'); return; }
        setApplying(jobId);
        try {
            await API.post('/applications/apply', { jobId, coverLetter: '' });
            setApplied(prev => ({ ...prev, [jobId]: true }));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>Browse Jobs</div>
            <div style={styles.searchRow}>
                <input
                    style={styles.input}
                    placeholder="Search by skill, title or keyword..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <input
                    style={styles.input}
                    placeholder="Location..."
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
            </div>

            {loading ? (
                <div style={styles.empty}>Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div style={styles.empty}>No jobs found. Try a different search.</div>
            ) : (
                jobs.map(job => (
                    <div key={job.id} style={styles.card}>
                        <div style={styles.jobTitle}>{job.title}</div>
                        <div style={styles.company}>{job.company} — {job.location}</div>
                        <div style={styles.tagRow}>
                            <span style={styles.tag}>{job.jobType?.replace('_', ' ')}</span>
                            {job.salaryRange && <span style={styles.salary}>{job.salaryRange}</span>}
                        </div>
                        <div style={styles.desc}>
                            {job.description?.substring(0, 150)}...
                        </div>
                        <div style={styles.tagRow}>
                            {job.skills?.split(',').map((s, i) => (
                                <span key={i} style={styles.tagGreen}>{s.trim()}</span>
                            ))}
                        </div>
                        {user?.role === 'CANDIDATE' && (
                            applied[job.id] ? (
                                <span style={styles.appliedTag}>Applied!</span>
                            ) : (
                                <button
                                    style={styles.applyBtn}
                                    onClick={() => handleApply(job.id)}
                                    disabled={applying === job.id}
                                >
                                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                                </button>
                            )
                        )}
                    </div>
                ))
            )}

            {totalPages > 1 && (
                <div style={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            style={i === page ? styles.pageBtnActive : styles.pageBtn}
                            onClick={() => setPage(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobsList;