
import React, { useState } from 'react';
import '../styles/components.css';

const ImageGallery = ({ images }) => {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Group images by type for potential labeled UI
    // const exterior = images.filter(img => img.type.startsWith('exterior'));
    // const interior = images.filter(img => img.type.startsWith('interior'));

    const handleNext = (e) => {
        e.stopPropagation();
        const idx = images.indexOf(activeImage);
        const nextIdx = (idx + 1) % images.length;
        setActiveImage(images[nextIdx]);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        const idx = images.indexOf(activeImage);
        const prevIdx = (idx - 1 + images.length) % images.length;
        setActiveImage(images[prevIdx]);
    };

    return (
        <div className="gallery-container">
            <div className="gallery-main" onClick={() => setIsLightboxOpen(true)}>
                <img src={activeImage.src} alt="Car View" loading="lazy" />
                <div className="gallery-nav-btn gallery-prev" onClick={handlePrev}>
                    <span>❮</span>
                </div>
                <div className="gallery-nav-btn gallery-next" onClick={handleNext}>
                    <span>❯</span>
                </div>
                <div style={{
                    position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    {activeImage.type.replace(/-/g, ' ').toUpperCase()}
                </div>
            </div>

            <div className="gallery-grid">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={`gallery-thumb ${activeImage.id === img.id ? 'active' : ''}`}
                        onClick={() => setActiveImage(img)}
                    >
                        <img src={img.src} alt={img.type} loading="lazy" />
                    </div>
                ))}
            </div>

            {isLightboxOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setIsLightboxOpen(false)}>
                    <div className="gallery-nav-btn gallery-prev" style={{ opacity: 1 }} onClick={(e) => { e.stopPropagation(); handlePrev(e); }}>
                        <span>❮</span>
                    </div>
                    <img src={activeImage.src} style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px' }} alt="Fullscreen" />
                    <div className="gallery-nav-btn gallery-next" style={{ opacity: 1 }} onClick={(e) => { e.stopPropagation(); handleNext(e); }}>
                        <span>❯</span>
                    </div>
                    <button style={{
                        position: 'absolute', top: '30px', right: '30px',
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                        width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
                        fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setIsLightboxOpen(false)}>
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
