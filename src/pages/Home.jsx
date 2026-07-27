import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import StatsCounter from '../components/StatsCounter';
import FeaturedBrands from '../components/FeaturedBrands';
import Testimonials from '../components/Testimonials';
import { Shield, BarChart3, Zap, Plus, Minus } from 'lucide-react';

/* ── Reusable fade-in-up on scroll ── */
const FadeInWhenVisible = ({ children, delay = 0, className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
        {children}
    </motion.div>
);

/* ── Advantage features ── */
const FEATURES = [
    {
        icon: Shield,
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        title: 'Elite Certification',
        text: 'Every vehicle undergoes our proprietary 140+ point digital audit. We check everything from engine compression to body paint thickness to ensure zero surprises.',
    },
    {
        icon: BarChart3,
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        title: 'Market Transparency',
        text: 'Our Live Valuation Engine scans millions of listings across India to give you the absolute Fair Market Price. No hidden margins, no deceptive discounts.',
    },
    {
        icon: Zap,
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        title: 'Express Closures',
        text: 'From instant paperless documentation to doorstep test drives and delivery, we handle the friction while you enjoy the drive.',
    },
];

/* ── FAQ data ── */
const FAQS = [
    { q: 'How does VroomValue verify cars?', a: 'Every car listed on our platform undergoes a rigorous 140+ point technical audit by our certified engineers, covering engine, transmission, electricals, and structure.' },
    { q: 'What is the benefit of AI Valuation?', a: "Unlike manual appraisals, our AI engine analyzes 28+ real-time market variables and millions of transaction data points to give you a bias-free, accurate market price." },
    { q: 'How long does the selling process take?', a: 'With our Express Sale flow, you can get a valuation in 60 seconds, a physical inspection within 24 hours, and payment within 2 hours of handover.' },
    { q: 'Can I book a test drive for any car?', a: "Yes! High-intent buyers can book a doorstep test drive or visit our VV-Hubs. Simply use the 'Book Test Drive' feature on any car listing." },
];

/* ── Animated FAQ Accordion ── */
const FAQItem = ({ q, a, isOpen, onToggle }) => (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
        <button className="faq-trigger" onClick={onToggle} aria-expanded={isOpen}>
            <span>{q}</span>
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    className="faq-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
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

            <Hero />
            <TrustBar />
            <StatsCounter />
            <FeaturedCarousel />
            <FeaturedBrands />
            <Testimonials />

            {/* ── VroomValue Advantage ── */}
            <section className="section home-features-section" aria-labelledby="features-heading">
                <div className="container">
                    <FadeInWhenVisible>
                        <div className="section-header-center">
                            <h2 id="features-heading">The VroomValue Advantage</h2>
                            <p className="section-subtitle">
                                Revolutionizing India's car market with data science and absolute transparency.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <div className="features-grid-home">
                        {FEATURES.map(({ icon: Icon, color, bgColor, title, text }, i) => (
                            <FadeInWhenVisible key={title} delay={i * 0.1}>
                                <motion.div
                                    className="home-feature-card"
                                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                                >
                                    <div
                                        className="home-feature-icon"
                                        style={{ background: bgColor, color }}
                                    >
                                        <Icon size={28} />
                                    </div>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </motion.div>
                            </FadeInWhenVisible>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="section home-faq-section" aria-labelledby="faq-heading">
                <div className="container home-faq-container">
                    <FadeInWhenVisible>
                        <div className="section-header-center">
                            <h2 id="faq-heading">Frequently Asked Questions</h2>
                            <p className="section-subtitle">
                                Everything you need to know about India's smartest car platform.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.1}>
                        <div className="faq-list" role="list">
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
