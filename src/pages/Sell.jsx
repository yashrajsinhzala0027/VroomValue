
import React from 'react';
import SellCarForm from '../components/SellCarForm';

const Sell = () => {
    return (
        <div className="sell-page">
            {/* Hero Section */}
            <section className="sell-hero" style={{ padding: 'clamp(80px, 12vw, 120px) 0 clamp(40px, 8vw, 60px)', textAlign: 'center' }}>
                <div className="container">
                    <h1 className="animate-fade-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.03em', lineHeight: 1 }}>Sell Your Car in Minutes</h1>
                    <p className="animate-fade-up" style={{ animationDelay: '0.1s', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        Get the best market value with our AI-driven valuation engine.
                        Transparent, fast, and completely hassle-free.
                    </p>

                    <div className="animate-fade-up" style={{ marginTop: '40px', animationDelay: '0.15s' }}>
                        <button
                            onClick={() => document.getElementById('sell-form').scrollIntoView({ behavior: 'smooth' })}
                            className="btn btn-primary"
                            style={{ padding: 'clamp(14px, 2vw, 18px) clamp(30px, 4vw, 50px)', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 800 }}
                        >
                            Start Selling Now
                        </button>
                    </div>

                    <div className="process-grid animate-fade-up" style={{ animationDelay: '0.2s', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '60px' }}>
                        <div className="process-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                            <div className="process-number">1</div>
                            <h4 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Enter Details</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Share your car's basic info and photos in minutes.</p>
                        </div>
                        <div className="process-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                            <div className="process-number">2</div>
                            <h4 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Get AI Quote</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Our engine analyzes market trends for a fair price.</p>
                        </div>
                        <div className="process-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                            <div className="process-number">3</div>
                            <h4 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Instant Payment</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Once verified, get paid directly and securely.</p>
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
            <section className="sell-form-section" id="sell-form" style={{ padding: 'clamp(40px, 8vw, 100px) 0' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 40px)' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', color: 'var(--secondary)' }}>Ready to Sell?</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Fill out the form below to get started.</p>
                    </div>
                    <SellCarForm />
                </div>
            </section>
        </div>
    );
};

export default Sell;
