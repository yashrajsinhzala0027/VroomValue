
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1>
                        India’s Smart AI Car <br />
                        <span className="hero-highlight">Valuation & Marketplace</span>
                    </h1>
                    <p className="hero-subtitle">
                        Get accurate car price insights instantly using real market data. The most trusted platform for buying and selling certified pre-owned vehicles.
                    </p>

                    <div className="hero-actions" style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                        <button onClick={() => navigate('/sell')} className="btn btn-primary">Sell My Car</button>
                        <button onClick={() => navigate('/listings')} className="btn btn-outline">Browse Cars</button>
                    </div>

                    <div className="hero-stats" style={{ display: 'flex', gap: '40px', marginBottom: '40px', padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                        <div className="stat-item">
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>1000+</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cars Listed</div>
                        </div>
                        <div className="stat-item">
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>500+</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Happy Users</div>
                        </div>
                        <div className="stat-item">
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>50+</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cities Covered</div>
                        </div>
                    </div>

                    <div className="hero-trust-badges">
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">🛡️</div>
                            <span className="trust-badge-text">AI Powered Valuation</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">✓</div>
                            <span className="trust-badge-text">Verified Listings</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">📊</div>
                            <span className="trust-badge-text">Real Market Insights</span>
                        </div>
                    </div>
                </div>

                <div className="hero-form-card">
                    <h3 className="hero-form-title">Find Your Vroom</h3>
                    <SearchBar vertical={true} />
                    <div className="quick-filters">
                        <span className="quick-filter-label">Quick Filter:</span>
                        {['SUV', 'Luxury', 'Sedan', 'Electric'].map(tag => (
                            <button
                                key={tag}
                                className="badge"
                                style={{ background: 'transparent', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                onClick={() => navigate(`/listings?bodyType=${tag}`)}
                            >{tag}</button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
