
import React, { useState } from 'react';
import { useCompare } from './CompareContext';
import { useLocation } from 'react-router-dom';

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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
            zIndex: 9998, // Below VroomValue AI
            padding: '20px',
            transform: isOpen ? 'translateY(0)' : 'translateY(85%)',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            {/* Toggle Handle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '8px 20px',
                    borderRadius: '12px 12px 0 0',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    boxShadow: '0 -5px 15px rgba(0,0,0,0.05)'
                }}
            >
                {isOpen ? 'Minimize Compare' : `Compare (${compareList.length})`}
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Smart Compare</h3>
                    <button onClick={clearCompare} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: '20px' }}>
                    {compareList.map(car => (
                        <div key={car.id} style={{ position: 'relative' }}>
                            <button
                                onClick={() => removeFromCompare(car.id)}
                                style={{ position: 'absolute', right: 0, top: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                            >
                                ×
                            </button>

                            <img src={car.image || "https://via.placeholder.com/300"} alt={car.model} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />

                            <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>{car.make} {car.model}</h4>

                            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
                                <div style={{
                                    padding: '8px',
                                    background: bestPrice === car.id ? 'var(--primary)' : '#f8fafc',
                                    color: bestPrice === car.id ? 'white' : 'inherit',
                                    borderRadius: '6px',
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span>Price</span>
                                    <span>₹{(car.priceINR / 100000).toFixed(2)} Lakh</span>
                                </div>

                                <div style={{
                                    padding: '8px',
                                    background: bestKms === car.id ? 'var(--primary)' : '#f8fafc',
                                    color: bestKms === car.id ? 'white' : 'inherit',
                                    borderRadius: '6px',
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span>Odo</span>
                                    <span>{car.kms.toLocaleString()} km</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {compareList.length < 3 && (
                        <div style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8',
                            height: '100%'
                        }}>
                            Add more cars to compare
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompareTray;
