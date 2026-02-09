
import React from 'react';

const StatsCounter = () => {
    return (
        <section className="section" style={{ background: 'var(--bg-main)' }}>
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">350<span>+</span></div>
                        <div className="stat-label">Certified Cars</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">18<span>+</span></div>
                        <div className="stat-label">Cities Covered</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">140<span>+</span></div>
                        <div className="stat-label">Quality Checks</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">15<span>k+</span></div>
                        <div className="stat-label">Happy Customers</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
