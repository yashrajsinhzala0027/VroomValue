import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
            <div
                className="gallery-main"
                onClick={() => setIsLightboxOpen(true)}
                style={{
                    aspectRatio: '16/10',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--bg-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'zoom-in'
                }}
            >
                <img
                    src={activeImage?.src}
                    alt="Car View"
                    loading="eager"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />

                {/* Navigation Overlays */}
                <div
                    className="gallery-nav-btn gallery-prev"
                    onClick={handlePrev}
                    style={{ left: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={22} />
                </div>
                <div
                    className="gallery-nav-btn gallery-next"
                    onClick={handleNext}
                    style={{ right: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Next image"
                >
                    <ChevronRight size={22} />
                </div>

                {/* View Tag */}
                <div style={{
                    position: 'absolute', bottom: '16px', left: '16px',
                    background: 'rgba(23, 43, 43, 0.75)', backdropFilter: 'blur(8px)',
                    color: '#FFFFFF', padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.8px',
                    border: '1px solid rgba(255,255,255,0.15)', textTransform: 'uppercase'
                }}>
                    {activeImage?.type?.replace(/-/g, ' ') || 'EXTERIOR VIEW'}
                </div>
            </div>

            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', marginTop: '14px', gap: '10px' }}>
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={`gallery-thumb ${activeImage.id === img.id ? 'active' : ''}`}
                        onClick={() => setActiveImage(img)}
                        style={{
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            height: '68px',
                            border: activeImage.id === img.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: 'var(--bg-alt)'
                        }}
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
                    <div className="gallery-nav-btn gallery-prev" style={{ opacity: 1, left: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); handlePrev(e); }}>
                        <ChevronLeft size={28} />
                    </div>
                    <img src={activeImage.src} style={{ maxHeight: '85vh', maxWidth: '90vw', borderRadius: '12px', boxShadow: '0 0 100px rgba(0,0,0,0.5)' }} alt="Fullscreen" />
                    <div className="gallery-nav-btn gallery-next" style={{ opacity: 1, right: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); handleNext(e); }}>
                        <ChevronRight size={28} />
                    </div>
                    <button style={{
                        position: 'absolute', top: '40px', right: '40px',
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                        width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setIsLightboxOpen(false)}>
                        <X size={28} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
