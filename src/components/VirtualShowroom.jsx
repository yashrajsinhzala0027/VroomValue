
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const VirtualShowroom = ({ car, onClose }) => {
    const [rotation, setRotation] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);

    useEffect(() => {
        let interval;
        if (autoRotate) {
            interval = setInterval(() => {
                setRotation(prev => (prev + 1) % 360);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [autoRotate]);

    // Handle manual drag to rotate
    const handleMouseMove = (e) => {
        if (e.buttons === 1) { // Left click held
            setAutoRotate(false);
            setRotation(prev => (prev + e.movementX) % 360);
        }
    };

    // Hotspots data (simulated)
    const hotspots = [
        { angle: 45, label: "LED Matrix Headlights", desc: "Adaptive lighting for night safety" },
        { angle: 135, label: "19-inch Alloy Wheels", desc: "Premium diamond-cut finish" },
        { angle: 225, label: "500L Boot Space", desc: "Example capacity for this class" },
        { angle: 315, label: "V6 Turbo Engine", desc: "300 HP performance power" }
    ];

    // Dynamic Image Selection based on Rotation
    const getCurrentImage = () => {
        if (!car.images || car.images.length === 0) return "https://placehold.co/800x500?text=No+Images";

        const deg = ((rotation % 360) + 360) % 360; // Normalize 0-359

        let type = 'exterior-front';
        if (deg > 45 && deg <= 135) type = 'exterior-right';
        else if (deg > 135 && deg <= 225) type = 'exterior-rear';
        else if (deg > 225 && deg <= 315) type = 'exterior-left';

        // Find the image, fallback to front if specific side isn't found
        const match = car.images.find(img => img.type === type) || car.images.find(img => img.type === 'exterior-front') || car.images[0];
        return match.src;
    };

    const currentHotspot = hotspots.find(h => Math.abs(h.angle - (((rotation % 360) + 360) % 360)) < 20);

    return createPortal(
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.95)',
            color: 'white',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-family)'
        }}>
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: 30, right: 30,
                    background: 'none', border: '1px solid white', borderRadius: '50%',
                    width: 50, height: 50, color: 'white', fontSize: '1.5rem', cursor: 'pointer',
                    zIndex: 100
                }}
            >
                &times;
            </button>

            <h2 style={{ position: 'absolute', top: 30, left: 30, fontSize: '2rem', margin: 0 }}>
                Virtual Showroom <span style={{ color: 'var(--primary)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', marginLeft: '10px' }}>PREMIUM 360°</span>
            </h2>
            <p style={{ position: 'absolute', top: 80, left: 30, opacity: 0.7 }}>
                {car.year} {car.make} {car.model} • Interactive Experience
            </p>

            {/* Simulated 3D View */}
            <div
                className="showroom-stage"
                onMouseMove={handleMouseMove}
                onMouseDown={() => setAutoRotate(false)}
                onMouseUp={() => setAutoRotate(true)}
                style={{
                    width: '100%', maxWidth: '900px', height: '550px',
                    position: 'relative',
                    cursor: 'grab',
                    perspective: '1000px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <div style={{
                    position: 'relative',
                    width: '100%', height: '100%',
                    transformStyle: 'preserve-3d',
                }}>
                    <img
                        src={getCurrentImage()}
                        alt="3D Car"
                        style={{
                            width: '100%', height: '100%', objectFit: 'contain',
                            borderRadius: '12px',
                            transition: 'opacity 0.2s ease-in-out',
                            filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
                        }}
                        draggable={false}
                    />

                    {/* HUD Overlay for Rotation */}
                    <div style={{
                        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px',
                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex', gap: '20px', alignItems: 'center'
                    }}>
                        <span>Drag to Rotate</span>
                        <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                            <div style={{ width: '20%', height: '100%', background: 'var(--primary)', marginLeft: `${(rotation % 360) / 360 * 100}%` }}></div>
                        </div>
                        <span>{Math.round(Math.abs(rotation) % 360)}°</span>
                    </div>

                    {/* Hotspot Popup */}
                    {currentHotspot && (
                        <div style={{
                            position: 'absolute', top: '20%', left: '20%',
                            background: 'rgba(0, 0, 0, 0.8)', padding: '16px',
                            borderRadius: '12px', border: '1px solid var(--primary)',
                            maxWidth: '250px',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                                {currentHotspot.label}
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                {currentHotspot.desc}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <button onClick={() => setAutoRotate(!autoRotate)} className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                    {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
                </button>
                <div style={{ opacity: 0.7 }}>
                    Interiors • Exteriors • Night Mode (Cooming Soon)
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>,
        document.body
    );
};

export default VirtualShowroom;
