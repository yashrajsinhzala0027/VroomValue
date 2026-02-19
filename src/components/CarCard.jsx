import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useCompare } from './CompareContext';
import { useWishlist } from './WishlistContext';
import '../styles/components.css';

const CarCard = ({ car }) => {
    const navigate = useNavigate();
    const { addToCompare, compareList } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageLoaded, setImageLoaded] = useState(false);

    const isInCompare = compareList.some(c => c.id === car.id);
    const isLiked = isInWishlist(car.id);

    // Safe JSON Parse Helper
    const parseJSON = (data) => {
        if (!data) return null;
        if (typeof data === 'object') return data;
        try { return JSON.parse(data); } catch (e) { return null; }
    };

    const images = parseJSON(car.images) || [];
    const valuation = parseJSON(car.valuation);
    const auction = parseJSON(car.auction);

    // Dynamic Health Score based on age and kms (Scale 40-99 to allow "Red")
    const age = 2024 - (Number(car.year) || 2024);
    const kms = Number(car.kms) || 0;
    // Adjusted formula for wider range
    const healthScore = Math.max(40, Math.min(99, 100 - (age * 2.5) - (kms / 10000)));

    const getHealthColor = (score) => {
        if (score >= 90) return '#10b981'; // Emerald
        if (score >= 75) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const frontImg = Array.isArray(images) && (images.find(img => img.type === 'exterior-front') || images[0]);
    const imgSrc = frontImg ? frontImg.src : 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="car-card page-enter" onClick={() => navigate(`/car/${car.id}`)} style={{ cursor: 'pointer' }}>
            {/* Image Container with Skeleton */}
            <div className="car-card__image-container" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10', background: '#e2e8f0' }}>
                <div className={`skeleton-loader ${imageLoaded ? 'hidden' : ''}`} style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: imageLoaded ? 0 : 1, transition: 'opacity 0.5s' }}></div>

                <div className="car-card__badges-wrapper" style={{ zIndex: 5 }}>
                    {car.certified === 1 && <span className="car-card__badge certified">VV Certified</span>}
                    {valuation && (() => {
                        const price = Number(car.priceINR || 0);
                        const { fairPrice, goodPrice } = valuation;
                        if (price <= fairPrice) return <span className="car-card__badge valuation great">Great Price</span>;
                        if (price <= goodPrice) return <span className="car-card__badge valuation fair">Fair Price</span>;
                        return null;
                    })()}
                    {auction && auction.isAuction && (
                        <span className="car-card__badge auction">
                            Live Auction
                        </span>
                    )}
                </div>

                {/* Visual Health Gauge */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <svg width="24" height="12" viewBox="0 0 24 12" style={{ overflow: 'visible' }}>
                        <path d="M2 12 A 10 10 0 0 1 22 12" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                        <path
                            d="M2 12 A 10 10 0 0 1 22 12"
                            fill="none"
                            stroke={getHealthColor(healthScore)}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="31.4"
                            strokeDashoffset={31.4 - (31.4 * (healthScore / 100))}
                            style={{ transition: 'all 1s ease' }}
                        />
                    </svg>
                    <span>{Math.round(healthScore)}%</span>
                </div>

                <img
                    src={imgSrc}
                    alt={`${car.make} ${car.model}`}
                    className="car-card__image"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                />

                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                    <button
                        className={`car-card__wishlist ${isLiked ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(car); }}
                        style={{ position: 'static', background: isLiked ? 'white' : 'rgba(255,255,255,0.9)', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "currentColor"} strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button
                        className="car-card__compare"
                        onClick={(e) => { e.stopPropagation(); addToCompare(car); }}
                        style={{ position: 'static', background: isInCompare ? 'var(--primary)' : 'rgba(255,255,255,0.9)', color: isInCompare ? 'white' : 'inherit', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
                    >
                        ⚖️
                    </button>
                </div>
            </div>

            <div className="car-card__content" style={{ padding: '20px' }}>
                <div className="car-card__title" style={{ marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.year} {car.make} {car.model}</h4>
                    <span className="car-card__variant" style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>{car.variant} • {car.owner === 1 ? '1st Owner' : `${car.owner}nd Owner`}</span>
                </div>

                <div className="car-card__specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '10px', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{formatKm(car.kms).replace(' km', '')}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>KM</div>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{car.fuel}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Fuel</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{car.transmission}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Trans</div>
                    </div>
                </div>

                <div className="car-card__price-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span className="car-card__price" style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 900 }}>{formatPriceINR(car.priceINR)}</span>
                        {car.certified === 1 && (
                            <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>✓ Verified</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span className="car-card__emi" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                            EMI from {formatPriceINR(Math.round(car.priceINR * 0.015))}/month
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🔥 High demand
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
