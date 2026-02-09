
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

            <section className="section container">
                <div className="features-header">
                    <h2>The VroomValue Difference</h2>
                    <p>Engineering trust in every transaction with high-intelligence reports.</p>
                </div>

                <div className="features-grid">
                    <div className="glass-panel feature-card">
                        <span className="feature-icon">🛡️</span>
                        <h3>Elite Certification</h3>
                        <p>Every vehicle undergoes our proprietary 140+ point digital audit, covering engine health, body integrity, and interior hygiene.</p>
                    </div>

                    <div className="glass-panel feature-card">
                        <span className="feature-icon">📊</span>
                        <h3>Data Transparency</h3>
                        <p>No hidden margins. Our Real-time Valuation Engine uses live market data to ensure you get the absolute fair price, every single time.</p>
                    </div>

                    <div className="glass-panel feature-card">
                        <span className="feature-icon">⚡</span>
                        <h3>Express Closures</h3>
                        <p>From instant paperless documentation to door-step delivery, we've optimized the car buying journey for the digital age.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
