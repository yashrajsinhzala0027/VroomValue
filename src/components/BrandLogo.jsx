import React, { useState } from 'react';

const BrandLogo = ({ make, size = 48, className = '' }) => {
    const [imgError, setImgError] = useState(false);

    // High-quality logo URLs - using reliable CDN sources
    const brandStyles = {
        'Maruti Suzuki': { bg: '#fff', color: '#2563eb', initial: 'MS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Suzuki_logo_2025.svg' },
        'Hyundai': { bg: '#fff', color: '#1e3a8a', initial: 'H', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/hyundai.png?v=1629973397992&q=80' },
        'Tata': { bg: '#fff', color: '#0369a1', initial: 'T', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/tata.png?v=1629973397992&q=80' },
        'Mahindra': { bg: '#fff', color: '#dc2626', initial: 'M', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/mahindra.png?v=1629973397992&q=80' },
        'Honda': { bg: '#fff', color: '#ef4444', initial: 'H', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/honda.png?v=1629973397992&q=80' },
        'Toyota': { bg: '#fff', color: '#b91c1c', initial: 'T', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/toyota.png?v=1629973397992&q=80' },
        'Kia': { bg: '#fff', color: '#991b1b', initial: 'K', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/kia.png?v=1629973397992&q=80' },
        'Renault': { bg: '#fff', color: '#1e293b', initial: 'R', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/renault.png?v=1629973397992&q=80' },
        'Volkswagen': { bg: '#fff', color: '#0284c7', initial: 'V', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/volkswagen.png?v=1629973397992&q=80' },
        'Skoda': { bg: '#fff', color: '#15803d', initial: 'S', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/skoda.png?v=1629973397992&q=80' },
        'MG': { bg: '#fff', color: '#dc2626', initial: 'MG', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/MG_Motor_logo.svg' },
        'Nissan': { bg: '#fff', color: '#475569', initial: 'N', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/nissan.png?v=1629973397992&q=80' },
        'Ford': { bg: '#fff', color: '#1d4ed8', initial: 'F', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/ford.png?v=1629973397992&q=80' },
        'Jeep': { bg: '#fff', color: '#334155', initial: 'J', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/jeep.png?v=1629973397992&q=80' },
    };

    const config = brandStyles[make] || { bg: '#cbd5e1', color: '#64748b', initial: make?.[0] || '?' };

    return (
        <div
            className={`brand-logo-circle ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: config.bg,
                color: config.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                fontSize: size * 0.4,
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                flexShrink: 0,
                overflow: 'hidden',
                padding: config.logo ? size * 0.15 : 0
            }}
        >
            {config.logo && !imgError ? (
                <img
                    src={config.logo}
                    alt={make}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={() => setImgError(true)}
                />
            ) : (
                <span>{config.initial}</span>
            )}
        </div>
    );
};

export default BrandLogo;
