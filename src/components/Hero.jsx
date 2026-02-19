
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

                    <div className="hero-actions" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                        <button onClick={() => navigate('/sell')} className="btn btn-primary btn-lg">Sell My Car</button>
                        <button onClick={() => navigate('/listings')} className="btn btn-outline btn-lg">Browse Cars</button>
                    </div>

                    <div className="hero-trust-badges">
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">🤖</div>
                            <span className="trust-badge-text">Instant AI Valuation</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">📋</div>
                            <span className="trust-badge-text">Secure & Verified Listings</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">📈</div>
                            <span className="trust-badge-text">Real Market Data Analysis</span>
                        </div>
                    </div>
                </div>

                <div className="hero-form-card">
                    <h3 className="hero-form-title">Find Your Vroom</h3>
                    <SearchBar vertical={true} />
                    <div className="quick-filters">
                        <span className="quick-filter-label">Quick Filter:</span>
                        {['SUV', 'Luxury', 'Hatchback', 'Electric'].map(tag => (
                            <button
                                key={tag}
                                className="badge"
                                style={{ background: 'var(--bg-main)', cursor: 'pointer', border: '1px solid var(--border)' }}
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
