import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const COLORS = [
    'linear-gradient(135deg,#FF6B35,#ff9a6c)',
    'linear-gradient(135deg,#00C896,#00a07a)',
    'linear-gradient(135deg,#6366F1,#4F46E5)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#EC4899,#DB2777)',
    'linear-gradient(135deg,#14B8A6,#0D9488)',
];

function getInitials(str) {
    return (str || 'J').substring(0, 2).toUpperCase();
}

function JobCard({ job, onApply, applying, applied }) {
    const [hovered, setHovered] = useState(false);
    const colorIdx = job.id % COLORS.length;

    const s = {
        card: {
            background: '#fff',
            border: `1.5px solid ${hovered ? '#FF6B35' : '#E8E6E1'}`,
            borderRadius: '16px', padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all .2s',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
            position: 'relative', overflow: 'hidden',
        },
        logo: {
            width: 44, height: 44, borderRadius: '10px',
            background: COLORS[colorIdx],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: '0.9rem',
            fontFamily: "'Syne', sans-serif", flexShrink: 0,
        },
        title: {
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: '1rem', color: '#0A0A0F',
            marginBottom: '0.25rem', letterSpacing: '-0.3px',
        },
        company: { color: '#6B7280', fontSize: '0.83rem' },
        tag: (type) => ({
            padding: '4px 10px', borderRadius: '6px',
            fontSize: '0.72rem', fontWeight: 600,
            background: type === 'FULL_TIME' ? '#FEF3C7' : type === 'REMOTE' ? '#D1FAE5' : type === 'INTERNSHIP' ? '#EEF2FF' : '#F3F4F6',
            color: type === 'FULL_TIME' ? '#92400E' : type === 'REMOTE' ? '#065F46' : type === 'INTERNSHIP' ? '#3730A3' : '#374151',
        }),
        skill: {
            background: '#F3F4F6', color: '#6B7280',
            padding: '3px 8px', borderRadius: '4px',
            fontSize: '0.72rem', fontWeight: 500,
        },
        footer: {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: '1rem',
            borderTop: '1px solid #F3F4F6', marginTop: '0.75rem',
        },
        salary: {
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            color: '#0A0A0F', fontSize: '0.95rem',
        },
        time: { color: '#9CA3AF', fontSize: '0.75rem', marginTop: '2px' },
        match: {
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(0,200,150,0.1)', color: '#00C896',
            padding: '4px 10px', borderRadius: '6px',
            fontSize: '0.75rem', fontWeight: 700,
        },
        applyBtn: {
            background: applied ? '#EAF3DE' : '#FF6B35',
            color: applied ? '#1e8449' : '#fff',
            border: 'none', padding: '8px 20px', borderRadius: '7px',
            fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'opacity .15s',
        },
    };

    const skills = (job.skills || '').split(',').slice(0, 4);

    return (
        <div style={s.card} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={s.logo}>{getInitials(job.company)}</div>
                    <div>
                        <div style={s.title}>{job.title}</div>
                        <div style={s.company}>{job.company} · {job.location}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={s.tag(job.jobType)}>{(job.jobType || '').replace('_', ' ')}</span>
                {job.location === 'Remote' && <span style={s.tag('REMOTE')}>Remote</span>}
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {skills.map((skill, i) => (
                    <span key={i} style={s.skill}>{skill.trim()}</span>
                ))}
            </div>

            <div style={s.footer}>
                <div>
                    <div style={s.salary}>{job.salaryRange || 'Competitive'}</div>
                    <div style={s.time}>{job.createdAt ? job.createdAt.substring(0, 10) : 'Recent'}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={s.match}>⚡ AI Match</div>
                    <button
                        style={s.applyBtn}
                        onClick={(e) => { e.stopPropagation(); onApply(job.id); }}
                        disabled={applying === job.id || applied}
                    >
                        {applying === job.id ? '...' : applied ? 'Applied ✓' : 'Apply'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function JobsList() {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [applied, setApplied] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    const filters = ['All', 'Full Time', 'Remote', 'Internship', 'Contract'];

    useEffect(() => { fetchJobs(); }, [page, activeFilter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = { page, size: 6 };
            if (keyword) params.keyword = keyword;
            if (location) params.location = location;
            if (activeFilter !== 'All') params.jobType = activeFilter.replace(' ', '_').toUpperCase();
            const res = await API.get('/jobs', { params });
            setJobs(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
            setTotalElements(res.data.totalElements || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = () => { setPage(0); fetchJobs(); };

    const handleApply = async (jobId) => {
        if (!user) { navigate('/login'); return; }
        setApplying(jobId);
        try {
            await API.post('/applications/apply', { jobId, coverLetter: '' });
            setApplied(prev => ({ ...prev, [jobId]: true }));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to apply');
        } finally { setApplying(null); }
    };

    const s = {
        page: { background: '#F7F6F3', minHeight: '100vh', padding: '2.5rem', fontFamily: "'DM Sans', sans-serif" },
        header: { marginBottom: '2rem' },
        title: { fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#0A0A0F', letterSpacing: '-1px', marginBottom: '0.25rem' },
        sub: { color: '#6B7280', fontSize: '0.88rem' },
        searchWrap: {
            background: '#fff', border: '1.5px solid #E8E6E1',
            borderRadius: '14px', padding: '0.75rem 1rem',
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        },
        input: { flex: 1, border: 'none', fontSize: '0.95rem', color: '#0A0A0F', fontFamily: "'DM Sans', sans-serif", background: 'transparent', outline: 'none' },
        divider: { width: '1px', height: '24px', background: '#E8E6E1', flexShrink: 0 },
        locInput: { flex: 0.5, border: 'none', fontSize: '0.9rem', color: '#0A0A0F', fontFamily: "'DM Sans', sans-serif", background: 'transparent', outline: 'none' },
        searchBtn: { background: '#0A0A0F', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
        filterRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' },
        chip: (active) => ({
            padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500,
            cursor: 'pointer', border: `1.5px solid ${active ? '#0A0A0F' : '#E8E6E1'}`,
            background: active ? '#0A0A0F' : '#fff', color: active ? '#fff' : '#6B7280',
            transition: 'all .15s',
        }),
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' },
        empty: { textAlign: 'center', color: '#9CA3AF', padding: '4rem', fontSize: '1rem', gridColumn: '1/-1' },
        pagination: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' },
        pageBtn: (active) => ({
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            border: `1.5px solid ${active ? '#0A0A0F' : '#E8E6E1'}`,
            background: active ? '#0A0A0F' : '#fff',
            color: active ? '#fff' : '#374151',
            fontWeight: active ? 700 : 400, fontSize: '0.88rem',
        }),
    };

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={s.header}>
                    <div style={s.title}>Find your next role</div>
                    <div style={s.sub}>{totalElements} jobs available · Updated today</div>
                </div>

                <div style={s.searchWrap}>
                    <span style={{ color: '#9CA3AF' }}>🔍</span>
                    <input style={s.input} placeholder="Job title, skill, or keyword..."
                           value={keyword} onChange={e => setKeyword(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    <div style={s.divider} />
                    <input style={s.locInput} placeholder="📍 Location"
                           value={location} onChange={e => setLocation(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    <button style={s.searchBtn} onClick={handleSearch}>Search</button>
                </div>

                <div style={s.filterRow}>
                    {filters.map(f => (
                        <div key={f} style={s.chip(activeFilter === f)} onClick={() => { setActiveFilter(f); setPage(0); }}>
                            {f}
                        </div>
                    ))}
                </div>

                <div style={s.grid}>
                    {loading ? (
                        <div style={s.empty}>Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div style={s.empty}>No jobs found. Try a different search.</div>
                    ) : jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onApply={handleApply}
                            applying={applying}
                            applied={!!applied[job.id]}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={s.pagination}>
                        <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Prev</button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button key={i} style={s.pageBtn(i === page)} onClick={() => setPage(i)}>{i + 1}</button>
                        ))}
                        <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobsList;