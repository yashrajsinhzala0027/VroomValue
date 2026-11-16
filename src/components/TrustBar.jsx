import React from 'react';
import {
    Cpu,
    ShieldCheck,
    TrendingUp,
    CheckCircle2,
    RotateCcw,
    FileCheck,
    Truck
} from 'lucide-react';

const PRIMARY_STRIP = [
    { icon: Cpu,         title: 'AI Powered Valuation', sub: 'Algorithm-driven fair market rates' },
    { icon: ShieldCheck, title: 'Verified Listings',     sub: '100% authentic vehicle documentation' },
    { icon: TrendingUp,  title: 'Real Market Data',      sub: 'Millions of live price transactions' },
];

const TRUST_INDICATORS = [
    {
        icon: CheckCircle2,
        title: '140+ Inspection Checkpoints',
        desc: 'Rigorous 140+ point digital inspection by certified automotive engineers.'
    },
    {
        icon: RotateCcw,
        title: '5-Day Return',
        desc: 'Enjoy peace of mind with our 5-day zero questions asked money-back policy.'
    },
    {
        icon: FileCheck,
        title: 'Verified Vehicle History',
        desc: 'Complete transparency on past owners, insurance claims and authentic odometer readings.'
    },
    {
        icon: Truck,
        title: 'Home Delivery',
        desc: 'Convenient contactless doorstep delivery directly to your home across 50+ cities.'
    },
];

const TrustBar = () => {
    return (
        <section className="trust-verification-section" aria-label="Trust and Verification">
            <div className="container">
                {/* 1. Horizontal Trust Strip */}
                <div className="trust-strip-container">
                    {PRIMARY_STRIP.map(({ icon: Icon, title, sub }) => (
                        <div key={title} className="trust-strip-item">
                            <div className="trust-strip-icon-box">
                                <Icon size={20} strokeWidth={2.2} />
                            </div>
                            <div className="trust-strip-text">
                                <div className="trust-strip-title">{title}</div>
                                <div className="trust-strip-sub">{sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Four Trust Indicators */}
                <div className="trust-indicators-grid">
                    {TRUST_INDICATORS.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="trust-indicator-card">
                            <div className="trust-indicator-icon-wrap">
                                <Icon size={22} strokeWidth={2} />
                            </div>
                            <h3 className="trust-indicator-heading">{title}</h3>
                            <p className="trust-indicator-desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBar;
