
import React from 'react';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import StatsCounter from '../components/StatsCounter';
import FeaturedBrands from '../components/FeaturedBrands';
import Testimonials from '../components/Testimonials';

import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div className="page-enter">
            <Helmet>
                <title>VroomValue | Premier Market for Certified Used Cars</title>
                <meta name="description" content="Experience the future of car buying with VroomValue. AI-driven valuations, 140+ point inspections, and a premium curated inventory of 350+ certified vehicles." />
                <meta property="og:title" content="VroomValue | Premier Market for Certified Used Cars" />
                <meta property="og:description" content="Experience the future of car buying with VroomValue. AI-driven valuations, 140+ point inspections, and a premium curated inventory of 350+ certified vehicles." />
                <meta name="keywords" content="used cars, certified cars, buy car india, luxury cars, second hand cars" />
            </Helmet>

            <Hero />
            <TrustBar />
            <StatsCounter />
            <FeaturedCarousel />
            <FeaturedBrands />
            <Testimonials />

            <section className="section" style={{ background: 'var(--bg-main)' }}>
                <div className="container">
                    <div className="features-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>The VroomValue Advantage</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Revolutionizing India's car market with data science and absolute transparency.</p>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        <div className="glass-panel feature-card" style={{ padding: '40px', borderRadius: '32px', textAlign: 'left', transition: 'all 0.3s ease', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '24px', background: 'var(--primary-glow)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>🛡️</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Elite Certification</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                                Every vehicle undergoes our proprietary 140+ point digital audit. We check everything from engine compression to body paint thickness to ensure zero surprises.
                            </p>
                            <div style={{ marginTop: '20px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>LEARN ABOUT AUDIT →</div>
                        </div>

                        <div className="glass-panel feature-card" style={{ padding: '40px', borderRadius: '32px', textAlign: 'left', transition: 'all 0.3s ease', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '24px', background: 'var(--primary-glow)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>📊</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Market Transparency</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                                Our Live Valuation Engine scans millions of listings across India to provide you with the absolute Fair Market Price. No hidden margins, no deceptive discounts.
                            </p>
                            <div style={{ marginTop: '20px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>VIEW MARKET TRENDS →</div>
                        </div>

                        <div className="glass-panel feature-card" style={{ padding: '40px', borderRadius: '32px', textAlign: 'left', transition: 'all 0.3s ease', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '24px', background: 'var(--primary-glow)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>⚡</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Express Closures</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                                Experience the future of car buying. From instant paperless documentation to door-step test drives and delivery, we handle the friction while you enjoy the drive.
                            </p>
                            <div style={{ marginTop: '20px', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>EXPLORE PROCESS →</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
