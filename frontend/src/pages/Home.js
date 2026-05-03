import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
:root {
  --ink: #0A0A0F;
  --ink2: #1C1C2E;
  --surface: #F7F6F3;
  --accent: #FF6B35;
  --accent2: #00C896;
  --muted: #6B7280;
  --border: #E8E6E1;
  --gold: #F59E0B;
}
* { box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; }
`;

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        setTimeout(() => setVisible(true), 100);
        return () => document.head.removeChild(style);
    }, []);

    const s = {
        hero: {
            background: 'var(--ink)',
            minHeight: '92vh',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2.5rem',
            position: 'relative',
            overflow: 'hidden',
        },
        heroBg: {
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(255,107,53,0.12), transparent), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,200,150,0.08), transparent)',
        },
        heroGrid: {
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
        },
        content: {
            position: 'relative', zIndex: 2,
            maxWidth: '640px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s cubic-bezier(.16,1,.3,1)',
        },
        badge: {
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,107,53,0.15)',
            border: '1px solid rgba(255,107,53,0.3)',
            color: 'var(--accent)',
            padding: '6px 14px', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '1.75rem', letterSpacing: '0.5px',
        },
        badgeDot: {
            width: 6, height: 6,
            background: 'var(--accent)', borderRadius: '50%',
            animation: 'pulse 2s infinite',
        },
        h1: {
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800, color: '#fff',
            lineHeight: 1.06, letterSpacing: '-2px',
            marginBottom: '1.5rem',
        },
        accent: { color: 'var(--accent)', fontStyle: 'normal' },
        sub: {
            color: '#9CA3AF', fontSize: '1.05rem', lineHeight: 1.7,
            marginBottom: '2.5rem', fontWeight: 300, maxWidth: '500px',
        },
        btnRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
        btnPrimary: {
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '14px 32px', borderRadius: '8px',
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'transform .15s, box-shadow .15s',
        },
        btnGhost: {
            background: 'transparent', color: '#fff',
            border: '1.5px solid rgba(255,255,255,0.2)',
            padding: '14px 32px', borderRadius: '8px',
            fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
        },
        statsRow: {
            display: 'flex', gap: '2.5rem',
            marginTop: '3.5rem', paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
        },
        statNum: {
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.8rem', fontWeight: 800, color: '#fff',
        },
        statLabel: { color: '#6B7280', fontSize: '0.78rem', marginTop: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' },
        visual: {
            position: 'absolute', right: '5%', top: '50%',
            transform: 'translateY(-50%)', width: '340px', zIndex: 2,
            opacity: visible ? 1 : 0,
            transition: 'all 1s cubic-bezier(.16,1,.3,1) 0.3s',
        },
        floatCard: (delay) => ({
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '1.1rem 1.25rem',
            backdropFilter: 'blur(12px)', marginBottom: '12px',
            animation: `floatAnim 3s ease-in-out ${delay}s infinite`,
        }),
        trust: {
            background: '#fff',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 2.5rem',
            display: 'flex', alignItems: 'center', gap: '3rem', overflow: 'hidden',
        },
        trustLabel: { color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.5px', textTransform: 'uppercase' },
        trustItem: { color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' },
    };

    const cards = [
        { abbr: 'TC', title: 'Java Backend Developer', company: 'TechCorp · Pune', skills: ['Spring Boot', 'MySQL'], match: '92%', color: 'linear-gradient(135deg,#FF6B35,#ff9a6c)', delay: 0 },
        { abbr: 'IN', title: 'React Developer', company: 'Infosys · Remote', skills: ['React', 'TypeScript'], match: '78%', color: 'linear-gradient(135deg,#00C896,#00a07a)', delay: 1 },
        { abbr: 'WP', title: 'Full Stack Engineer', company: 'Wipro · Bangalore', skills: ['Node.js', 'Docker'], match: '85%', color: 'linear-gradient(135deg,#6366F1,#4F46E5)', delay: 2 },
    ];

    return (
        <div>
            <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

            <div style={s.hero}>
                <div style={s.heroBg} />
                <div style={s.heroGrid} />

                <div style={s.content}>
                    <div style={s.badge}>
                        <span style={s.badgeDot} />
                        AI-Powered Resume Matching
                    </div>
                    <h1 style={s.h1}>
                        Land your dream job with <em style={s.accent}>smart</em> matching
                    </h1>
                    <p style={s.sub}>
                        SmartHire uses AI to match your resume against job descriptions —
                        so you apply where you actually fit and get hired faster.
                    </p>
                    <div style={s.btnRow}>
                        <button style={s.btnPrimary} onClick={() => navigate('/jobs')}>
                            Browse Jobs →
                        </button>
                        {!user && (
                            <Link to="/register" style={s.btnGhost}>Create Account</Link>
                        )}
                    </div>
                    <div style={s.statsRow}>
                        {[['100+', 'Active Jobs'], ['AI', 'Resume Match'], ['2', 'User Roles']].map(([num, label]) => (
                            <div key={label}>
                                <div style={s.statNum}>{num}</div>
                                <div style={s.statLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={s.visual}>
                    {cards.map((card) => (
                        <div key={card.abbr} style={{
                            ...s.floatCard(card.delay),
                            marginLeft: card.abbr === 'IN' ? '32px' : '0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '8px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.85rem', flexShrink: 0 }}>
                                    {card.abbr}
                                </div>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{card.title}</div>
                                    <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>{card.company}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {card.skills.map(s => (
                                    <span key={s} style={{ background: 'rgba(255,255,255,0.08)', color: '#D1D5DB', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem' }}>{s}</span>
                                ))}
                                <span style={{ background: 'rgba(0,200,150,0.15)', color: '#00C896', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                  {card.match} match
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={s.trust}>
                <span style={s.trustLabel}>Trusted by</span>
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    {['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'HCL'].map(name => (
                        <span key={name} style={s.trustItem}>{name}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;