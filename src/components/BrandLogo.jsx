import React, { useState } from 'react';

const BrandLogo = ({ make, size = 48, className = '' }) => {
    const [imgError, setImgError] = useState(false);

    const brandStyles = {
        'VroomValue': { bg: 'transparent', color: 'var(--primary)', logo: '/assets/logo_new.png', initial: 'V' },
        'Maruti Suzuki': { bg: '#fff', color: '#2563eb', initial: 'MS', logo: '/assets/brands/maruti.svg' },
        'Hyundai': { bg: '#fff', color: '#1e3a8a', initial: 'H', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/hyundai.png?v=1629973397992&q=80' },
        'Tata': { bg: '#fff', color: '#0369a1', initial: 'T', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/tata.png?v=1629973397992&q=80' },
        'Mahindra': { bg: '#fff', color: '#dc2626', initial: 'M', logo: '/assets/brands/mahindra.png' },
        'Honda': { bg: '#fff', color: '#ef4444', initial: 'H', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/honda.png?v=1629973397992&q=80' },
        'Toyota': { bg: '#fff', color: '#b91c1c', initial: 'T', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/toyota.png?v=1629973397992&q=80' },
        'Kia': { bg: '#fff', color: '#991b1b', initial: 'K', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/kia.png?v=1630500263590&q=80' },
        'Renault': { bg: '#fff', color: '#1e293b', initial: 'R', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/renault.png?v=1629973397992&q=80' },
        'Volkswagen': { bg: '#fff', color: '#0284c7', initial: 'V', logo: 'https://imgd.aeplcdn.com/0x0/cw/brands/logos/volkswagen.png?v=1629973397992&q=80' },
        'Skoda': { bg: '#fff', color: '#15803d', initial: 'S', logo: '/assets/brands/skoda.png' },
        'MG': { bg: '#fff', color: '#dc2626', initial: 'MG', logo: '/assets/brands/mg.png' },
        'Nissan': { bg: '#fff', color: '#475569', initial: 'N', logo: '/assets/brands/nissan.png' },
        'Ford': { bg: '#fff', color: '#1d4ed8', initial: 'F', logo: '/assets/brands/ford.png' },
        'Jeep': { bg: '#fff', color: '#334155', initial: 'J', logo: '/assets/brands/jeep.png' },
    };

    const isMainLogo = !make || make === 'VroomValue';
    const config = brandStyles[make] || brandStyles['VroomValue'];

    // For main branding, if size is large (like 165), it's the width
    const logoWidth = isMainLogo && size > 100 ? `${size}px` : (isMainLogo ? 'auto' : `${size}px`);
    const logoHeight = isMainLogo ? 'auto' : `${size}px`;

    return (
        <div
            className={`brand-logo-container ${className} ${isMainLogo ? 'main-site-logo' : ''}`}
            style={{
                width: logoWidth,
                height: logoHeight,
                minWidth: isMainLogo ? (size > 100 ? '160px' : '180px') : `${size}px`,
                maxHeight: isMainLogo ? '80px' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'visible',
                padding: '0',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                filter: !isMainLogo ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' : 'none'
            }}
        >
            {config.logo && !imgError ? (
                <img
                    src={config.logo}
                    alt={make || 'VroomValue'}
                    style={{
                        width: 'auto',
                        maxWidth: isMainLogo ? '220%' : '110%',
                        height: isMainLogo ? '50px' : '90%',
                        objectFit: 'contain',
                        transform: isMainLogo ? 'scale(1.4)' : 'none',
                        transformOrigin: 'left center',
                        transition: 'transform 0.4s'
                    }}
                    onError={() => setImgError(true)}
                />
            ) : (
                <span style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                    fontSize: `${size * 0.45}px`,
                    padding: isMainLogo ? '0 12px' : '0',
                    letterSpacing: '-0.5px'
                }}>
                    {config.initial}
                </span>
            )}
        </div>
    );
};




export default BrandLogo;
