import React, { useState, useEffect } from 'react';
import '../styles/components.css';

const ImageGallery = ({ images = [] }) => {
    const [activeImage, setActiveImage] = useState(images.length > 0 ? images[0] : null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        if (images.length > 0 && !activeImage) {
            setActiveImage(images[0]);
        }
    }, [images, activeImage]);

    if (!images || images.length === 0) {
        return (
            <div className="gallery-container">
                <div className="gallery-main skeleton" style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PREPARING STUNNING VISUALS...</span>
                </div>
            </div>
        );
    }

    const handleNext = (e) => {
        e.stopPropagation();
        const idx = images.findIndex(img => img.id === activeImage.id);
        const nextIdx = (idx + 1) % images.length;
        setActiveImage(images[nextIdx]);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        const idx = images.findIndex(img => img.id === activeImage.id);
        const prevIdx = (idx - 1 + images.length) % images.length;
        setActiveImage(images[prevIdx]);
    };

    return (
        <div className="gallery-container page-enter">
            <div className="gallery-main glass-panel" onClick={() => setIsLightboxOpen(true)} style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', background: '#000', padding: 0, border: 'none', borderRadius: '24px' }}>
                <img
                    src={activeImage?.src}
                    alt="Car View"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />

                {/* Navigation Overlays */}
                <div className="gallery-nav-btn gallery-prev" onClick={handlePrev} style={{ left: '20px' }}>
                    <span style={{ fontSize: '1.2rem' }}>❮</span>
                </div>
                <div className="gallery-nav-btn gallery-next" onClick={handleNext} style={{ right: '20px' }}>
                    <span style={{ fontSize: '1.2rem' }}>❯</span>
                </div>

                {/* View Tag */}
                <div style={{
                    position: 'absolute', bottom: '24px', left: '24px',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    color: 'white', padding: '8px 16px', borderRadius: '12px',
                    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px',
                    border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase'
                }}>
                    {activeImage?.type?.replace(/-/g, ' ') || 'EXTERIOR VIEW'}
                </div>
            </div>

            <div className="gallery-grid" style={{ marginTop: '20px', gap: '12px' }}>
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={`gallery-thumb ${activeImage.id === img.id ? 'active' : ''}`}
                        onClick={() => setActiveImage(img)}
                        style={{ borderRadius: '12px', overflow: 'hidden', border: activeImage.id === img.id ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.3s ease' }}
                    >
                        <img src={img.src} alt={img.type} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ))}
            </div>

            {isLightboxOpen && (
                <div className="page-enter" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.95)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(20px)'
                }} onClick={() => setIsLightboxOpen(false)}>
                    <div className="gallery-nav-btn gallery-prev" style={{ opacity: 1, left: '40px' }} onClick={(e) => { e.stopPropagation(); handlePrev(e); }}>
                        <span>❮</span>
                    </div>
                    <img src={activeImage.src} style={{ maxHeight: '85vh', maxWidth: '90vw', borderRadius: '12px', boxShadow: '0 0 100px rgba(0,0,0,0.5)' }} alt="Fullscreen" />
                    <div className="gallery-nav-btn gallery-next" style={{ opacity: 1, right: '40px' }} onClick={(e) => { e.stopPropagation(); handleNext(e); }}>
                        <span>❯</span>
                    </div>
                    <button style={{
                        position: 'absolute', top: '40px', right: '40px',
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                        width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
                        fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setIsLightboxOpen(false)}>
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
