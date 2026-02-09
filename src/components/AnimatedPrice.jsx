import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { formatPriceShort } from '../utils/formatters';

const AnimatedPrice = ({ value, className = "" }) => {
    // Ultra-Fast "Lightning" spring physics
    const spring = useSpring(value, {
        stiffness: 700,
        damping: 45,
        mass: 0.3
    });

    const displayValue = useTransform(spring, (latest) => formatPriceShort(Math.round(latest)));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <motion.span
            className={`price-range-label ${className}`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <motion.span
                key={value}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
            >
                ₹
            </motion.span>
            <motion.span>{displayValue}</motion.span>
        </motion.span>
    );
};

export default AnimatedPrice;
