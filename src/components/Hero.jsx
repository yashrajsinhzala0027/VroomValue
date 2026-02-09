
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
                        DRIVE THE <br />
                        <span className="hero-highlight">FUTURE</span> TODAY.
                    </h1>
                    <p className="hero-subtitle">
                        India's elite destination for certified pre-owned vehicles. Engineered with high-intelligence trust reports and market-accurate valuation.
                    </p>

                    <div className="hero-trust-badges desktop-only">
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">✓</div>
                            <span className="trust-badge-text">140+ Point Audit</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-badge-icon">✓</div>
                            <span className="trust-badge-text">Real-time Valuation</span>
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
