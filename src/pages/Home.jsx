
import React from 'react';
import Hero from '../components/Hero';
import FeaturedCarousel from '../components/FeaturedCarousel';

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedCarousel />

            <section className="container" style={{ margin: '80px auto' }}>
                <h2 className="section-title">Why Choose VroomValue?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.2rem', fontWeight: 700 }}>Certified Quality</h3>
                        <p className="text-muted">Every car undergoes a rigorous 140+ point inspection process.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.2rem', fontWeight: 700 }}>Transparent Pricing</h3>
                        <p className="text-muted">Fixed prices based on real market data. No haggling needed.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.2rem', fontWeight: 700 }}>7-Day Returns</h3>
                        <p className="text-muted">Love it or return it. Full refund within 7 days used.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
