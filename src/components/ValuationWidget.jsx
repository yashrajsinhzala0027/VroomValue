
import React from 'react';
import { formatPriceINR } from '../utils/formatters';

const ValuationWidget = ({ valuation, currentPrice }) => {
    if (!valuation || !valuation.fairPrice) {
        return (
            <div className="details-card">
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>VroomValue Estimation</h3>
                <div style={{ background: 'var(--bg-deep)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Calculating real-time market value...</p>
                </div>
            </div>
        );
    }

    const { fairPrice, goodPrice } = valuation;
    const price = Number(currentPrice || 0);

    // Calculate needle position based on market range
    // 0% at fairPrice - 10%, 100% at goodPrice + 10%
    const minRange = fairPrice * 0.9;
    const maxRange = goodPrice * 1.1;
    let needlePos = ((price - minRange) / (maxRange - minRange)) * 100;
    needlePos = Math.max(5, Math.min(95, needlePos)); // Clamp for UI

    let label = "Fair Price";
    let color = "var(--warning)";

    if (price <= fairPrice) {
        label = "Great Price";
        color = "var(--success)";
    } else if (price > goodPrice) {
        label = "High Price";
        color = "var(--danger)";
    }

    return (
        <div className="details-card">
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>VroomValue Estimation</h3>
            <div style={{ background: 'var(--bg-deep)', padding: '16px', borderRadius: '8px', textAlign: 'center', position: 'relative' }}>
                <h4 style={{ fontSize: '1.5rem', color: color, marginBottom: '8px' }}>{label}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Estimated Market Range:<br />
                    <strong>{formatPriceINR(fairPrice)} - {formatPriceINR(goodPrice)}</strong>
                </p>
                <div style={{ marginTop: '16px', height: '8px', background: '#e2e8f0', borderRadius: '4px', position: 'relative', overflow: 'visible' }}>
                    <div style={{
                        width: '33%', left: '0', background: 'var(--success)', height: '100%', position: 'absolute',
                        borderRadius: '4px 0 0 4px', opacity: 0.8
                    }}></div>
                    <div style={{
                        width: '34%', left: '33%', background: 'var(--warning)', height: '100%', position: 'absolute',
                        opacity: 0.8
                    }}></div>
                    <div style={{
                        width: '33%', left: '67%', background: 'var(--danger)', height: '100%', position: 'absolute',
                        borderRadius: '0 4px 4px 0', opacity: 0.8
                    }}></div>

                    {/* Price Needle */}
                    <div style={{
                        position: 'absolute',
                        left: `${needlePos}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '14px',
                        height: '14px',
                        background: 'white',
                        border: `3px solid ${color}`,
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 5,
                        transition: 'all 0.5s ease-out'
                    }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>Low</span>
                    <span>Market Average</span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export default ValuationWidget;
