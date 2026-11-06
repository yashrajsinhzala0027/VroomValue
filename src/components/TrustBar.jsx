import React from 'react';
import { ClipboardCheck, RefreshCw, FileText, Truck } from 'lucide-react';

const ITEMS = [
    { icon: ClipboardCheck, label: '140+ Checkpoints', sub: 'Certified Inspection' },
    { icon: RefreshCw,      label: '5-Day Return',     sub: 'Zero Questions Asked' },
    { icon: FileText,       label: 'Verified History',  sub: '100% Transparency' },
    { icon: Truck,          label: 'Home Delivery',     sub: 'Across Tier 1 Cities' },
];

const TrustBar = () => (
    <div className="container trust-bar-wrapper">
        <div className="trust-bar-grid">
            {ITEMS.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="trust-item">
                    <div className="trust-icon">
                        <Icon size={20} />
                    </div>
                    <div className="trust-info">
                        <div className="trust-label">{label}</div>
                        <div className="trust-sub">{sub}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default TrustBar;
