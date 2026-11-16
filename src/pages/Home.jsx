import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import FeaturedBrands from '../components/FeaturedBrands';
import Testimonials from '../components/Testimonials';
import { ShieldCheck, BarChart3, Zap, Plus, Minus } from 'lucide-react';

/* ── Reusable fade-in-up on scroll ── */
const FadeInWhenVisible = ({ children, delay = 0, className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
        {children}
    </motion.div>
);

/* ── Advantage features ── */
const ADVANTAGES = [
    {
        num: '01',
        icon: ShieldCheck,
        title: 'Elite Certification',
        text: 'Every vehicle undergoes a detailed inspection to provide buyers with greater confidence.',
    },
    {
        num: '02',
        icon: BarChart3,
        title: 'Market Transparency',
        text: 'Discover fair pricing with market insights and transparent vehicle information.',
    },
    {
        num: '03',
        icon: Zap,
        title: 'Express Closures',
        text: 'From documentation to delivery, experience a smoother car-buying journey.',
    },
];

/* ── FAQ data ── */
const FAQS = [
    {
        q: 'How does VroomValue verify cars?',
        a: 'Every car listed on our platform undergoes a rigorous 140+ point technical audit by certified automotive engineers, inspecting mechanical components, frame integrity, electronics, and historical paperwork.'
    },
    {
        q: 'What is the benefit of AI Valuation?',
        a: 'Unlike traditional dealer appraisals with hidden markups, our AI engine computes real-time pricing using live transaction data and 28+ verified condition factors for true market transparency.'
    },
    {
        q: 'How long does the selling process take?',
        a: 'You can get an instant online valuation in 60 seconds, schedule doorstep verification within 24 hours, and receive full digital payment immediately upon vehicle handover.'
    },
    {
        q: 'Can I book a test drive for any car?',
        a: 'Yes! You can easily schedule a complimentary doorstep test drive or visit our regional VV-Hub directly from any car listing.'
    },
];

/* ── FAQ Accordion Item ── */
const FAQItem = ({ q, a, isOpen, onToggle }) => (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
        <button
            type="button"
            className="faq-trigger"
            onClick={onToggle}
            aria-expanded={isOpen}
        >
            <span className="faq-question-text">{q}</span>
            <span className="faq-icon-bubble">
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
            </span>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="faq-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="faq-answer-text">{a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Home = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="page-enter">
            <Helmet>
                <title>VroomValue | India's Premier AI Car Marketplace</title>
                <meta name="description" content="Experience the future of car buying with VroomValue. AI-driven valuations, 140+ point inspections, and a premium curated inventory of certified vehicles." />
                <meta property="og:title" content="VroomValue | India's Premier AI Car Marketplace" />
                <meta property="og:description" content="Experience the future of car buying with VroomValue. AI-driven valuations and 1000+ certified vehicles." />
                <meta name="keywords" content="used cars, certified cars, buy car india, luxury cars, second hand cars, AI car valuation" />
            </Helmet>

            {/* 02 & 03: Hero & Vehicle Finder */}
            <Hero />

            {/* 04: Trust Indicators */}
            <TrustBar />

            {/* 05: Vehicle Listings */}
            <FeaturedCarousel />

            {/* 06: Brands */}
            <FeaturedBrands />

            {/* 07: Testimonials */}
            <Testimonials />

            {/* 08: The VroomValue Advantage */}
            <section className="section home-features-section" aria-labelledby="features-heading">
                <div className="container">
                    <FadeInWhenVisible>
                        <div className="section-header-center">
                            <span className="section-eyebrow">Why Choose Us</span>
                            <h2 id="features-heading" className="section-title">The VroomValue Advantage</h2>
                            <p className="section-subtitle">
                                Revolutionizing India's car market with data science and absolute transparency.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <div className="features-grid-home">
                        {ADVANTAGES.map(({ num, icon: Icon, title, text }) => (
                            <div key={title} className="home-feature-card">
                                <div className="feature-card-header">
                                    <span className="feature-number">{num}</span>
                                    <div className="home-feature-icon">
                                        <Icon size={22} strokeWidth={2} />
                                    </div>
                                </div>
                                <h3 className="feature-title">{title}</h3>
                                <p className="feature-text">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 09: Frequently Asked Questions */}
            <section className="section home-faq-section" aria-labelledby="faq-heading">
                <div className="container home-faq-container">
                    <FadeInWhenVisible>
                        <div className="section-header-center">
                            <span className="section-eyebrow">Clear Answers</span>
                            <h2 id="faq-heading" className="section-title">Frequently Asked Questions</h2>
                            <p className="section-subtitle">
                                Everything you need to know about India's smartest car platform.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.1}>
                        <div className="faq-list">
                            {FAQS.map((item, i) => (
                                <FAQItem
                                    key={i}
                                    q={item.q}
                                    a={item.a}
                                    isOpen={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                                />
                            ))}
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </div>
    );
};

export default Home;
