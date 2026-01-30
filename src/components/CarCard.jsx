
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useCompare } from './CompareContext';
import { useWishlist } from './WishlistContext';
import '../styles/components.css';

const CarCard = ({ car }) => {
    const navigate = useNavigate();
    const { addToCompare, compareList } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();

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

    // Ensure we have a valid image, fallback to first if type not found
    const frontImg = Array.isArray(images) && (images.find(img => img.type === 'exterior-front') || images[0]);
    const imgSrc = frontImg ? frontImg.src : 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="car-card" onClick={() => navigate(`/car/${car.id}`)}>
            <div className="car-card__image-container">
                <div className="car-card__badges-wrapper">
                    {car.certified && <span className="car-card__badge certified">Certified</span>}
                    {valuation && (() => {
                        const price = Number(car.priceINR || 0);
                        const { fairPrice, goodPrice } = valuation;
                        if (price <= fairPrice) return <span className="car-card__badge valuation great">Great Price</span>;
                        if (price <= goodPrice) return <span className="car-card__badge valuation fair">Fair Price</span>;
                        return null;
                    })()}
                    {auction && auction.isAuction && (
                        <span className="car-card__badge auction">
                            Auction Ends in {(() => {
                                const diff = new Date(auction.endTime) - new Date();
                                if (diff <= 0) return 'Ended';
                                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
                            })()}
                        </span>
                    )}
                </div>
                <img
                    src={imgSrc}
                    alt={`${car.make} ${car.model}`}
                    className="car-card__image"
                    loading="lazy"
                />
                <button
                    className="car-card__compare"
                    onClick={(e) => { e.stopPropagation(); addToCompare(car); }}
                    title="Compare"
                    style={{
                        background: isInCompare ? 'var(--primary)' : 'rgba(255,255,255,0.9)',
                        color: isInCompare ? 'white' : 'var(--text-muted)',
                    }}
                >
                    ⚖️
                </button>
                <button
                    className={`car-card__wishlist ${isLiked ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(car); }}
                    style={{ color: isLiked ? '#ef4444' : undefined }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <div className="car-card__content">
                <div className="car-card__title">
                    <span>{car.year} {car.make} {car.model}</span>
                    <span className="car-card__variant">{car.variant}</span>
                </div>

                <div className="car-card__specs">
                    <span>{formatKm(car.kms)}</span>
                    <span className="car-card__dot">•</span>
                    <span>{car.fuel}</span>
                    <span className="car-card__dot">•</span>
                    <span>{car.transmission}</span>
                </div>

                <div className="car-card__price-row">
                    <span className="car-card__price">{formatPriceINR(car.priceINR)}</span>
                    <span className="car-card__emi">EMI starts @ ₹{Math.round(car.priceINR * 0.015)}/mo</span>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
