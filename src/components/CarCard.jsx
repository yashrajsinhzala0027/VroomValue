import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useCompare } from './CompareContext';
import { useWishlist } from './WishlistContext';
import { Heart, Scale, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import '../styles/components.css';

const MODEL_FALLBACK_MAP = {
    swift:    '/cars/swift.jpg',
    dzire:    '/cars/city.jpg',
    thar:     '/cars/thar.jpg',
    creta:    '/cars/harrier.jpg',
    nexon:    '/cars/nexon.jpg',
    fortuner: '/cars/fortuner.jpg',
    innova:   '/cars/innova.jpg',
    city:     '/cars/city.jpg',
    harrier:  '/cars/harrier.jpg',
    verna:    '/cars/verna.jpg',
    fronx:    '/cars/fronx.jpg',
    kwid:     '/cars/kwid.jpg',
    scorpio:  '/cars/fortuner.jpg',
    baleno:   '/cars/swift.jpg',
    brezza:   '/cars/fronx.jpg',
    seltos:   '/cars/harrier.jpg',
};

const CarCard = ({ car }) => {
    const navigate = useNavigate();
    const { addToCompare, compareList } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
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

    // Dynamic Condition Score based on age and kms
    const age = 2025 - (Number(car.year) || 2024);
    const kms = Number(car.kms) || 0;
    const healthScore = Math.max(72, Math.min(99, Math.round(100 - (age * 2.2) - (kms / 12000))));

    const frontImg = Array.isArray(images) && (images.find(img => img.type === 'exterior-front') || images[0]);
    const modelKey = (car.model || '').toLowerCase().trim();
    const reliableFallback = MODEL_FALLBACK_MAP[modelKey] || '/cars/swift.jpg';
    const imgSrc = imgFailed || !frontImg ? reliableFallback : frontImg.src;

    return (
        <div
            className="car-card"
            onClick={() => navigate(`/car/${car.id}`)}
            role="article"
            aria-label={`${car.year} ${car.make} ${car.model}`}
        >
            {/* 1. Vehicle Image Container */}
            <div className="car-card__image-container">
                <img
                    src={imgSrc}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="car-card__image"
                    loading="lazy"
                    width="320"
                    height="184"
                    onError={() => setImgFailed(true)}
                />

                {/* Status Badges Overlay */}
                <div className="car-card__badges-wrapper">
                    {Boolean(car.certified) && (
                        <span className="car-card__badge certified">
                            <ShieldCheck size={11} /> Certified
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

                {/* Health Condition Pill */}
                <div className="car-card__health-pill">
                    <span className="health-dot" />
                    <span>{healthScore}% Condition</span>
                </div>

                {/* Top-Right Action Controls */}
                <div className="car-card__action-controls">
                    <button
                        type="button"
                        className={`car-card__wishlist ${isLiked ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(car); }}
                        aria-label={isLiked ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                        <Heart size={15} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#69778C'} />
                    </button>
                    <button
                        type="button"
                        className={`car-card__compare ${isInCompare ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); addToCompare(car); }}
                        aria-label={isInCompare ? 'Remove from comparison' : 'Compare car'}
                    >
                        <Scale size={14} />
                    </button>
                </div>
            </div>

            {/* 2. Card Content */}
            <div className="car-card__content">
                <div className="car-card__title-group">
                    <h3 className="car-card__heading">
                        {car.year} {car.make} {car.model}
                    </h3>
                    <span className="car-card__variant">
                        {car.variant} • {car.owner === 1 ? '1st Owner' : `${car.owner}nd Owner`}
                    </span>
                </div>

                {/* Quick Specs Pill Row */}
                <div className="car-card__specs-row">
                    <div className="spec-pill">
                        <span className="spec-pill-value">{formatKm(car.kms)}</span>
                    </div>
                    <div className="spec-pill">
                        <span className="spec-pill-value">{car.fuel}</span>
                    </div>
                    <div className="spec-pill">
                        <span className="spec-pill-value">{car.transmission}</span>
                    </div>
                </div>

                {/* Price and EMI Row */}
                <div className="car-card__price-row">
                    <div className="price-primary-row">
                        <span className="car-card__price">{formatPriceINR(car.priceINR)}</span>
                        {Boolean(car.certified) && (
                            <span className="verified-chip">
                                <CheckCircle2 size={11} /> Verified
                            </span>
                        )}
                    </div>
                    <div className="price-secondary-row">
                        <span className="car-card__emi">
                            EMI from {formatPriceINR(Math.round(car.priceINR * 0.015))}/mo
                        </span>
                        <span className="card-view-details">
                            View <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
