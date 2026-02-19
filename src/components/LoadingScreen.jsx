import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
        }, 800); // Snappier 0.8s introduction
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', display: 'flex' }}>
                <span className="brand-word">Vroom</span>
                <span className="brand-word" style={{ color: 'var(--primary)' }}>Value</span>
            </div>
            <div className="loader-line" style={{
                width: '150px',
                height: '4px',
                background: '#e2e8f0',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '50%',
                    background: 'var(--primary)',
                    animation: 'indeterminate 1.5s infinite linear'
                }}></div>
            </div>
            <style>{`
                @keyframes indeterminate {
                    0% { left: -50%; width: 50%; }
                    50% { left: 25%; width: 75%; }
                    100% { left: 100%; width: 50%; }
                }
                .brand-word {
                    opacity: 0;
                    animation: slideUpFade 0.8s forwards;
                }
                .brand-word:nth-child(2) {
                    animation-delay: 0.2s;
                }
                @keyframes slideUpFade {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
