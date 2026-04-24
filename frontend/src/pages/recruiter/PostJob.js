import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const styles = {
    container: { maxWidth: '680px', margin: '2rem auto', padding: '0 1rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    title: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.4rem' },
    sub: { color: '#888', marginBottom: '2rem', fontSize: '0.9rem' },
    label: { display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#444', fontSize: '0.9rem' },
    input: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1.2rem' },
    textarea: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1.2rem', minHeight: '120px', resize: 'vertical' },
    select: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1.2rem', background: '#fff' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    btn: { width: '100%', padding: '0.9rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
    error: { background: '#ffeaea', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
    success: { background: '#eafaf1', color: '#1e8449', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }
};

function PostJob() {
    const [form, setForm] = useState({
        title: '', description: '', company: '', location: '',
        jobType: 'FULL_TIME', skills: '', salaryRange: '', status: 'ACTIVE'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await API.post('/jobs', form);
            setSuccess('Job posted successfully! Redirecting...');
            setTimeout(() => navigate('/recruiter/my-jobs'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.title}>Post a New Job</div>
                <div style={styles.sub}>Fill in the details to attract the right candidates</div>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Job Title *</label>
                    <input style={styles.input} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Java Backend Developer" required />

                    <label style={styles.label}>Company Name *</label>
                    <input style={styles.input} name="company" value={form.company} onChange={handleChange} placeholder="e.g. TechCorp India" required />

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Location *</label>
                            <input style={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="e.g. Pune" required />
                        </div>
                        <div>
                            <label style={styles.label}>Salary Range</label>
                            <input style={styles.input} name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="e.g. 6-10 LPA" />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Job Type *</label>
                            <select style={styles.select} name="jobType" value={form.jobType} onChange={handleChange}>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="REMOTE">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>Status</label>
                            <select style={styles.select} name="status" value={form.status} onChange={handleChange}>
                                <option value="ACTIVE">Active</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>

                    <label style={styles.label}>Required Skills *</label>
                    <input style={styles.input} name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Java, Spring Boot, MySQL" required />

                    <label style={styles.label}>Job Description *</label>
                    <textarea style={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, requirements..." required />

                    <button style={styles.btn} disabled={loading}>
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostJob;