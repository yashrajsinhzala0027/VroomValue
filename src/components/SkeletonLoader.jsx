import React from 'react';
import '../styles/globals.css';

export const Skeleton = ({ width, height, borderRadius = 'var(--radius-sm)', className = '' }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius
            }}
        />
    );
};

export const CarCardSkeleton = () => {
    return (
        <div className="car-card skeleton-card" style={{ cursor: 'default' }}>
            <div className="car-card__image-container">
                <Skeleton height="100%" />
            </div>
            <div className="car-card__content" style={{ padding: '20px' }}>
                <Skeleton width="70%" height="24px" style={{ marginBottom: '12px' }} />
                <Skeleton width="40%" height="16px" style={{ marginBottom: '20px' }} />

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <Skeleton width="30%" height="32px" borderRadius="4px" />
                    <Skeleton width="30%" height="32px" borderRadius="4px" />
                    <Skeleton width="30%" height="32px" borderRadius="4px" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '12px' }}>
                    <Skeleton width="40%" height="28px" />
                    <Skeleton width="30%" height="36px" borderRadius="20px" />
                </div>
            </div>
        </div>
    );
};

export const ListingSkeleton = () => {
    return (
        <div className="pro-grid">
            {Array(6).fill(0).map((_, i) => (
                <CarCardSkeleton key={i} />
            ))}
        </div>
    );
};
