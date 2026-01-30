
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="hero-section">
            <div className="container hero-container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '60px', alignItems: 'center' }}>
                <div className="hero-content" style={{ textAlign: 'left' }}>
                    <h1 className="hero-title" style={{ margin: 0, textAlign: 'left' }}>Find Your <br />Perfect Drive</h1>
                    <p className="hero-subtitle" style={{ margin: '24px 0', textAlign: 'left', marginLeft: 0 }}>
                        Explore India's finest selection of quality used cars. Certified, inspected, and ready for the road.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start', opacity: 0.8, marginBottom: '40px' }} className="text-muted">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span> 150-point Inspection
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span> Instant Valuation
                        </div>
                    </div>
                </div>

                <div className="hero-sidebar-wrapper">
                    <SearchBar vertical={true} />
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', marginBottom: '4px', fontWeight: 600 }}>Popular Searches:</span>
                        <button
                            className="btn popular-tag"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', textTransform: 'none', borderRadius: '8px' }}
                            onClick={() => navigate('/listings?maxPrice=500000')}
                        >Under ₹5L</button>
                        <button
                            className="btn popular-tag"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', textTransform: 'none', borderRadius: '8px' }}
                            onClick={() => navigate('/listings?bodyType=SUV')}
                        >SUVs</button>
                        <button
                            className="btn popular-tag"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', textTransform: 'none', borderRadius: '8px' }}
                            onClick={() => navigate('/listings?make=Maruti+Suzuki')}
                        >Swift</button>
                        <button
                            className="btn popular-tag"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', textTransform: 'none', borderRadius: '8px' }}
                            onClick={() => navigate('/listings?certified=true')}
                        >Certified</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
