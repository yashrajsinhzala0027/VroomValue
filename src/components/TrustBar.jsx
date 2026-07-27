import React from 'react';
import { motion } from 'framer-motion';
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
            {ITEMS.map(({ icon: Icon, label, sub }, i) => (
                <motion.div
                    key={label}
                    className="trust-item"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="trust-icon">
                        <Icon size={20} />
                    </div>
                    <div>
                        <div className="trust-label">{label}</div>
                        <div className="trust-sub">{sub}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

export default TrustBar;
