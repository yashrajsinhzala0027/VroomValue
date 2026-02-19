import React, { useState, useEffect } from 'react';

const AIValuationMeter = ({ score = 92 }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(score), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="glass-panel ai-meter-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, white 0%, #f1f5f9 100%)', border: '1px solid var(--border)' }}>
            <div className="meter-visual" style={{ position: 'relative', width: '90px', height: '90px' }}>
                <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                    <circle
                        cx="50" cy="50" r="40"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    {progress}%
                </div>
            </div>
            <div className="meter-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem' }}>🤖</span>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Confidence</h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Based on 1.2M+ recent market transactions. High accuracy predicted for this vehicle profile.
                </p>
            </div>
        </div>
    );
};

export default AIValuationMeter;
