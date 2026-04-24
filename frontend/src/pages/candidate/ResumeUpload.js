import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const styles = {
    container: { maxWidth: '680px', margin: '2rem auto', padding: '0 1rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    title: { fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.4rem' },
    sub: { color: '#888', marginBottom: '2rem', fontSize: '0.9rem' },
    uploadArea: { border: '2px dashed #ddd', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', background: '#fafafa', cursor: 'pointer' },
    uploadIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
    uploadText: { color: '#555', fontSize: '0.95rem', marginBottom: '0.5rem' },
    uploadSub: { color: '#aaa', fontSize: '0.8rem' },
    fileInput: { display: 'none' },
    selectedFile: { background: '#eaf4fd', color: '#1a6fa8', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' },
    btn: { width: '100%', padding: '0.9rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginBottom: '1rem' },
    error: { background: '#ffeaea', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
    success: { background: '#eafaf1', color: '#1e8449', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
    currentResume: { background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' },
    resumeLabel: { color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' },
    resumeName: { fontWeight: '600', color: '#1a1a2e', fontSize: '0.95rem' },
    resumeDate: { color: '#aaa', fontSize: '0.8rem', marginTop: '0.2rem' },
    divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '1.5rem 0' }
};

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentResume, setCurrentResume] = useState(null);

    useEffect(() => {
        API.get('/resume/my')
            .then(res => setCurrentResume(res.data))
            .catch(() => {});
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            return;
        }
        setFile(selected);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) { setError('Please select a PDF file first.'); return; }
        setLoading(true); setError(''); setSuccess('');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await API.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(res.data.message || 'Resume uploaded successfully!');
            setCurrentResume({ fileName: file.name, uploadedAt: new Date().toISOString() });
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.title}>Resume Upload</div>
                <div style={styles.sub}>Upload your PDF resume to apply to jobs and get AI match scores</div>

                {currentResume && (
                    <div style={styles.currentResume}>
                        <div style={styles.resumeLabel}>Current Resume</div>
                        <div style={styles.resumeName}>{currentResume.fileName}</div>
                        <div style={styles.resumeDate}>Uploaded: {currentResume.uploadedAt?.substring(0, 10)}</div>
                    </div>
                )}

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <label htmlFor="resume-input">
                    <div style={styles.uploadArea}>
                        <div style={styles.uploadIcon}>📄</div>
                        <div style={styles.uploadText}>Click to select your resume</div>
                        <div style={styles.uploadSub}>PDF only, max 5MB</div>
                    </div>
                </label>
                <input
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    style={styles.fileInput}
                    onChange={handleFileChange}
                />

                {file && (
                    <div style={styles.selectedFile}>
                        Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </div>
                )}

                <button style={styles.btn} onClick={handleUpload} disabled={loading || !file}>
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </button>
            </div>
        </div>
    );
}

export default ResumeUpload;