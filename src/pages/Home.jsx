
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
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>The VroomValue Advantage</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Revolutionizing India's car market with data science and absolute transparency.</p>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {[
                            {
                                icon: '🛡️',
                                title: 'Elite Certification',
                                text: 'Every vehicle undergoes our proprietary 140+ point digital audit. We check everything from engine compression to body paint thickness to ensure zero surprises.'
                            },
                            {
                                icon: '📊',
                                title: 'Market Transparency',
                                text: 'Our Live Valuation Engine scans millions of listings across India to provide you with the absolute Fair Market Price. No hidden margins, no deceptive discounts.'
                            },
                            {
                                icon: '⚡',
                                title: 'Express Closures',
                                text: 'Experience the future of car buying. From instant paperless documentation to door-step test drives and delivery, we handle the friction while you enjoy the drive.'
                            }
                        ].map((f, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '48px', borderRadius: '32px', textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid var(--border)', cursor: 'default' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '32px', background: 'var(--primary-glow)', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '16px', fontWeight: 800 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '24px' }}>{f.text}</p>
                                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>LEARN MORE <span style={{ fontSize: '1.2rem' }}>→</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>Frequently Asked Questions</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Everything you need to know about India's smartest car platform.</p>
                    </div>

                    <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { q: "How does VroomValue verify cars?", a: "Every car listed on our platform undergoes a rigorous 140+ point technical audit by our certified engineers, covering engine, transmission, electricals, and structure." },
                            { q: "What is the benefit of AI Valuation?", a: "Unlike manual appraisals, our AI engine analyzes 28+ real-time market variables and millions of transaction data points to give you a bias-free, accurate market price." },
                            { q: "How long does the selling process take?", a: "With our Express Sale flow, you can get a valuation in 60 seconds, a physical inspection within 24 hours, and payment within 2 hours of handover." },
                            { q: "Can I book a test drive for any car?", a: "Yes! High-intent buyers can book a doorstep test drive or visit our VV-Hubs. Simply use the 'Book Test Drive' feature on any car listing." }
                        ].map((item, i) => (
                            <details key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 800, fontSize: '1.1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {item.q}
                                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>+</span>
                                </summary>
                                <p style={{ marginTop: '16px', color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
