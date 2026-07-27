import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { ShieldCheck, BadgeCheck, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';

/* ── Animation Variants ── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
};

const cardVariants = {
    hidden:  { opacity: 0, x: 32, scale: 0.97 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 },
    },
};

const TRUST_BADGES = [
    { icon: ShieldCheck,  label: 'AI Powered Valuation' },
    { icon: BadgeCheck,   label: 'Verified Listings' },
    { icon: BarChart3,    label: 'Real Market Data' },
];

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

                {/* ── Left: Content ── */}
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Eyebrow */}
                    <motion.div className="hero-eyebrow" variants={itemVariants}>
                        <TrendingUp size={14} />
                        India's #1 AI-Powered Car Marketplace
                    </motion.div>

                    {/* Heading */}
                    <motion.h1 className="hero-title" variants={itemVariants}>
                        Buy & Sell Cars<br />
                        <span className="text-gradient">The Smart Way</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p className="hero-subtitle" variants={itemVariants}>
                        Get accurate AI-powered valuations, browse 1000+ certified vehicles,
                        and experience a completely transparent car marketplace.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div className="hero-actions-container" variants={itemVariants}>
                        <button
                            onClick={() => navigate('/sell')}
                            className="btn btn-primary btn-lg"
                        >
                            Sell My Car
                        </button>
                        <button
                            onClick={() => navigate('/listings')}
                            className="btn btn-outline btn-lg"
                        >
                            Browse Cars <ArrowRight size={18} />
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div className="hero-stats-container" variants={itemVariants}>
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="hero-stat-item">
                                <div className="hero-stat-value">{value}</div>
                                <div className="hero-stat-label">{label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div className="hero-trust-badges" variants={itemVariants}>
                        {TRUST_BADGES.map(({ icon: Icon, label }) => (
                            <div key={label} className="trust-badge-item">
                                <div className="trust-badge-icon">
                                    <Icon size={16} />
                                </div>
                                <span className="trust-badge-text">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── Right: Search Card ── */}
                <motion.div
                    className="hero-form-card"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="hero-form-title">Find Your Vroom</h2>
                    <SearchBar vertical={true} />
                    <div className="quick-filters">
                        <span className="quick-filter-label">Quick:</span>
                        {['SUV', 'Luxury', 'Sedan', 'Electric'].map(tag => (
                            <button
                                key={tag}
                                className="badge quick-filter-badge"
                                onClick={() => navigate(`/listings?bodyType=${tag}`)}
                                type="button"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
