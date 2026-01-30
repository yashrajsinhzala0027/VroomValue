
import React from 'react';
import SellCarForm from '../components/SellCarForm';

const Sell = () => {
    return (
        <div className="sell-page">
            {/* Hero Section */}
            <section className="sell-hero">
                <div className="container">
                    <h1 className="animate-fade-up">Sell Your Car in Minutes</h1>
                    <p className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Get the best market value with our AI-driven valuation engine.
                        Transparent, fast, and completely hassle-free.
                    </p>

                    <div className="animate-fade-up" style={{ marginTop: '40px', animationDelay: '0.15s' }}>
                        <button
                            onClick={() => document.getElementById('sell-form').scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-primary"
                            style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '50px' }}
                        >
                            Start Selling Now
                        </button>
                    </div>

                    <div className="process-grid animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="process-card">
                            <div className="process-number">1</div>
                            <h4>Enter Details</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Share your car's basic info and photos in minutes.</p>
                        </div>
                        <div className="process-card">
                            <div className="process-number">2</div>
                            <h4>Get AI Quote</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Our engine analyzes market trends for a fair price.</p>
                        </div>
                        <div className="process-card">
                            <div className="process-number">3</div>
                            <h4>Instant Payment</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Once verified, get paid directly and securely.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container">
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <div className="benefit-icon">📈</div>
                        <div>
                            <h4 style={{ fontWeight: '700' }}>Top Market Value</h4>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>We ensure you get the best price for your vehicle.</p>
                        </div>
                    </div>
                    <div className="benefit-item">
                        <div className="benefit-icon">⚖️</div>
                        <div>
                            <h4 style={{ fontWeight: '700' }}>AI Valuation</h4>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>Data-driven pricing that's fair and transparent.</p>
                        </div>
                    </div>
                    <div className="benefit-item">
                        <div className="benefit-icon">⚡</div>
                        <div>
                            <h4 style={{ fontWeight: '700' }}>Instant Sale</h4>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>Skip the wait with our expedited verification process.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="sell-form-section" id="sell-form">
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Ready to Sell?</h2>
                        <p style={{ color: '#666' }}>Fill out the form below to get started.</p>
                    </div>
                    <SellCarForm />
                </div>
            </section>
        </div>
    );
};

export default Sell;
