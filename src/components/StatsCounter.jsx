
import React from 'react';

const STATS = [
    { value: '350', suffix: '+',  label: 'Certified Cars' },
    { value: '18',  suffix: '+',  label: 'Cities Covered' },
    { value: '140', suffix: '+',  label: 'Quality Checks' },
    { value: '15',  suffix: 'k+', label: 'Happy Customers' },
];

const StatsCounter = () => {
    return (
        <section className="stats-counter-section">
            <div className="container">
                <div className="stats-grid">
                    {STATS.map(({ value, suffix, label }) => (
                        <div key={label} className="stat-item">
                            <div className="stat-value">
                                {value}<span className="stat-plus">{suffix}</span>
                            </div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
