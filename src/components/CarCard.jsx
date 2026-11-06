import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useCompare } from './CompareContext';
import { useWishlist } from './WishlistContext';
import { Heart, Scale, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import '../styles/components.css';

const CarCard = ({ car }) => {
    const navigate = useNavigate();
    const { addToCompare, compareList } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);

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

    // Dynamic Health Score based on age and kms
    const age = 2025 - (Number(car.year) || 2024);
    const kms = Number(car.kms) || 0;
    const healthScore = Math.max(70, Math.min(99, Math.round(100 - (age * 2.2) - (kms / 12000))));

    const frontImg = Array.isArray(images) && (images.find(img => img.type === 'exterior-front') || images[0]);
    const rawSrc = frontImg ? frontImg.src : '/cars/swift.jpg';
    const imgSrc = imgFailed ? '/cars/swift.jpg' : rawSrc;

    return (
        <div
            className="car-card"
            onClick={() => navigate(`/car/${car.id}`)}
            role="article"
            aria-label={`${car.year} ${car.make} ${car.model}`}
        >
            {/* Image Container with Skeleton */}
            <div className="car-card__image-container">
                <div className={`skeleton-loader ${imageLoaded ? 'hidden' : ''}`} />

                {/* Status Badges */}
                <div className="car-card__badges-wrapper">
                    {Boolean(car.certified) && (
                        <span className="car-card__badge certified">
                            <ShieldCheck size={12} /> Certified
                        </span>
                    )}
                    {valuation && (() => {
                        const price = Number(car.priceINR || 0);
                        const { fairPrice, goodPrice } = valuation;
                        if (price <= fairPrice) return <span className="car-card__badge valuation great">Great Value</span>;
                        if (price <= goodPrice) return <span className="car-card__badge valuation fair">Fair Price</span>;
                        return null;
                    })()}
                    {auction && auction.isAuction && (
                        <span className="car-card__badge auction">
                            Live Auction
                        </span>
                    )}
                </div>

                {/* Health Score Pill */}
                <div className="car-card__health-pill">
                    <span className="health-dot" />
                    <span>{healthScore}% Condition</span>
                </div>

                <img
                    src={imgSrc}
                    alt={`${car.make} ${car.model}`}
                    className="car-card__image"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImgFailed(true);
                        setImageLoaded(true);
                    }}
                />

                {/* Top-Right Action Controls */}
                <div className="car-card__action-controls">
                    <button
                        type="button"
                        className={`car-card__wishlist ${isLiked ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(car); }}
                        aria-label={isLiked ? "Remove from shortlist" : "Add to shortlist"}
                    >
                        <Heart size={16} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} />
                    </button>
                    <button
                        type="button"
                        className={`car-card__compare ${isInCompare ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); addToCompare(car); }}
                        aria-label={isInCompare ? "Remove from comparison" : "Compare car"}
                    >
                        <Scale size={16} />
                    </button>
                </div>
            </div>

            {/* Card Content */}
            <div className="car-card__content">
                <div className="car-card__title">
                    <h4 className="car-card__heading">
                        {car.year} {car.make} {car.model}
                    </h4>
                    <span className="car-card__variant">
                        {car.variant} • {car.owner === 1 ? '1st Owner' : `${car.owner}nd Owner`}
                    </span>
                </div>

                {/* Vehicle Quick Specs Grid */}
                <div className="car-card__specs">
                    <div className="spec-item">
                        <div className="spec-value">{formatKm(car.kms).replace(' km', '')}</div>
                        <div className="spec-label">KM</div>
                    </div>
                    <div className="spec-item spec-border">
                        <div className="spec-value">{car.fuel}</div>
                        <div className="spec-label">Fuel</div>
                    </div>
                    <div className="spec-item">
                        <div className="spec-value">{car.transmission}</div>
                        <div className="spec-label">Trans</div>
                    </div>
                </div>

                {/* Pricing & EMI Information */}
                <div className="car-card__price-row">
                    <div className="price-primary-row">
                        <span className="car-card__price">{formatPriceINR(car.priceINR)}</span>
                        {Boolean(car.certified) && (
                            <span className="verified-chip">
                                <CheckCircle2 size={12} /> Verified
                            </span>
                        )}
                    </div>
                    <div className="price-secondary-row">
                        <span className="car-card__emi">
                            EMI from {formatPriceINR(Math.round(car.priceINR * 0.015))}/mo
                        </span>
                        <span className="high-demand-badge">
                            <TrendingUp size={12} /> High Demand
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
