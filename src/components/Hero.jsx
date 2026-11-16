import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { ShieldCheck, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';

/* ── Animation Variants ── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

const vehicleVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
    },
};

const STATS = [
    { value: '1000+', label: 'Cars Listed' },
    { value: '500+',  label: 'Happy Buyers' },
    { value: '50+',   label: 'Cities' },
];

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-section" aria-label="Hero">
            <div className="container hero-container">

                {/* ── Upper: 2-Column Hero Showcase ── */}
                <div className="hero-showcase-grid">

                    {/* Left: Content & Trust */}
                    <motion.div
                        className="hero-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Eyebrow */}
                        <motion.div className="hero-eyebrow" variants={itemVariants}>
                            <TrendingUp size={14} />
                            <span>India's #1 AI-Powered Car Marketplace</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 className="hero-title" variants={itemVariants}>
                            Buy &amp; Sell Cars.<br />
                            <span className="hero-title-accent">The Smart Way.</span>
                        </motion.h1>

                        {/* Supporting Subtitle */}
                        <motion.p className="hero-subtitle" variants={itemVariants}>
                            Discover AI-powered valuations, quality-checked vehicles and a completely transparent way to buy or sell your next car.
                        </motion.p>

                        {/* Primary & Secondary Action CTAs */}
                        <motion.div className="hero-actions-container" variants={itemVariants}>
                            <button
                                onClick={() => navigate('/sell')}
                                className="btn btn-primary hero-btn-main"
                            >
                                Sell My Car
                            </button>
                            <button
                                onClick={() => navigate('/listings')}
                                className="btn btn-outline hero-btn-secondary"
                            >
                                Browse Cars <ArrowRight size={17} />
                            </button>
                        </motion.div>

                        {/* Trust Statistics */}
                        <motion.div className="hero-stats-row" variants={itemVariants}>
                            {STATS.map(({ value, label }, idx) => (
                                <React.Fragment key={label}>
                                    <div className="hero-stat-card">
                                        <div className="hero-stat-num">{value}</div>
                                        <div className="hero-stat-desc">{label}</div>
                                    </div>
                                    {idx < STATS.length - 1 && <div className="hero-stat-divider" />}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Studio Automotive Photography Stage */}
                    <motion.div
                        className="hero-vehicle-stage"
                        variants={vehicleVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="hero-studio-halo" />
                        <img
                            src="/cars/fronx.png"
                            alt="VroomValue Certified Premium Vehicle"
                            className="hero-vehicle-hero-img"
                            loading="eager"
                            fetchPriority="high"
                            width="680"
                            height="680"
                        />
                        <div className="hero-floor-shadow" />

                        {/* Floating Micro Trust Badges */}
                        <div className="hero-floating-badge badge-top">
                            <div className="floating-badge-icon">
                                <ShieldCheck size={16} />
                            </div>
                            <div className="floating-badge-text">
                                <span className="floating-badge-title">140+ Checkpoint Certified</span>
                                <span className="floating-badge-sub">0 Mechanical Defects</span>
                            </div>
                        </div>

                        <div className="hero-floating-badge badge-bottom">
                            <div className="floating-badge-icon">
                                <BarChart3 size={16} />
                            </div>
                            <div className="floating-badge-text">
                                <span className="floating-badge-title">AI Fair Price Verified</span>
                                <span className="floating-badge-sub">Zero Dealer Margin</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Lower: Find Your Vroom Search Panel ── */}
                <motion.div
                    className="hero-search-panel"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                >
                    <div className="search-panel-top-row">
                        <div className="search-panel-heading-wrap">
                            <h2 className="search-panel-title">Find Your Vroom</h2>
                            <span className="search-panel-subtitle">Explore India's verified pre-owned collection</span>
                        </div>

                        <div className="quick-category-group">
                            <span className="quick-category-label">Quick:</span>
                            {['SUV', 'Luxury', 'Sedan', 'Electric'].map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    className="quick-category-pill"
                                    onClick={() => navigate(`/listings?bodyType=${tag}`)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="search-panel-form-wrap">
                        <SearchBar vertical={false} />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
