
import React, { useState } from 'react';
import { useCompare } from './CompareContext';
import { useLocation } from 'react-router-dom';
import { formatPriceINR } from '../utils/formatters';

const CompareTray = () => {
    const { compareList, removeFromCompare, clearCompare } = useCompare();
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    // Only show on relevant pages
    // if (!['/listings', '/'].includes(location.pathname)) return null; 

    if (compareList.length === 0) return null;

    // Helper to find best stat
    const getBest = (field, reverse = false) => {
        if (compareList.length < 2) return null;
        let sorted = [...compareList].sort((a, b) => {
            const valA = parseFloat(a[field]) || 0;
            const valB = parseFloat(b[field]) || 0;
            return reverse ? valA - valB : valB - valA;
        });
        return sorted[0].id;
    };

    const bestPrice = getBest('priceINR', true); // Lowest price wins
    const bestKms = getBest('kms', true); // Lowest kms wins

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(30px)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 -20px 40px rgba(0,0,0,0.1)',
            zIndex: 9998,
            padding: '24px',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            visibility: compareList.length > 0 ? 'visible' : 'hidden'
        }}>
            {/* Toggle Handle - Modern Pill */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '30px 30px 0 0',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 -10px 20px rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                {isOpen ? '∨ MINIMIZE' : `📊 COMPARE NOW (${compareList.length})`}
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Side-by-Side Analysis</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Analyzing {compareList.length} models for technical superiority</p>
                    </div>
                    <button
                        onClick={clearCompare}
                        style={{ padding: '8px 20px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        RESET ALL
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, 1fr)`, gap: '24px' }}>
                    {[0, 1, 2].map(index => {
                        const car = compareList[index];
                        if (car) {
                            const images = typeof car.images === 'string' ? JSON.parse(car.images) : car.images;
                            const frontImg = Array.isArray(images) && (images.find(img => img.type === 'exterior-front') || images[0]);
                            const imgSrc = frontImg ? frontImg.src : 'https://placehold.co/300x200?text=Vehicle';

                            return (
                                <div key={car.id} style={{ position: 'relative', background: 'white', padding: '16px', borderRadius: '20px', border: '2px solid' + (car.id % 2 === 0 ? ' var(--primary-glow)' : ' transparent'), boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                    <button
                                        onClick={() => removeFromCompare(car.id)}
                                        style={{ position: 'absolute', right: '12px', top: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                                    >
                                        ×
                                    </button>

                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <img src={imgSrc} alt={car.model} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                        <div>
                                            <h4 style={{ fontWeight: 800, margin: '0 0 4px 0', fontSize: '1rem' }}>{car.make} {car.model}</h4>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <span className="badge" style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: 'none', fontSize: '0.65rem' }}>{formatPriceINR(car.priceINR)}</span>
                                                <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', fontSize: '0.65rem' }}>{car.fuel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={`empty-${index}`} style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#94a3b8',
                                minHeight: '114px',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>➕</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ADD VEHICLE</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompareTray;
