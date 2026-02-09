
import React from 'react';

const TrustBar = () => {
    const items = [
        { icon: '🔎', label: '140+ Checkpoints', sub: 'Certified Inspection' },
        { icon: '🔄', label: '5-Day Return', sub: 'Zero Questions Asked' },
        { icon: '📜', label: 'Verified History', sub: '100% Transparency' },
        { icon: '🚚', label: 'Home Delivery', sub: 'Across Tier 1 Cities' }
    ];

    return (
        <div className="container trust-bar-wrapper">
            <div className="trust-bar-grid glass-panel">
                {items.map((item, idx) => (
                    <div key={idx} className="trust-item">
                        <span className="trust-icon">{item.icon}</span>
                        <div>
                            <div className="trust-label">{item.label}</div>
                            <div className="trust-sub">{item.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrustBar;
