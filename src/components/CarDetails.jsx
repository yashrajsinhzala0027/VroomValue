import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCarById, updateCarListing } from '../api/mockApi';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useToast } from './Toasts';
import { useWishlist } from './WishlistContext';
import { useAuth } from './AuthContext';
import ImageGallery from './ImageGallery';
import ScheduleTestDrive from './ScheduleTestDrive';
import BiddingWidget from './BiddingWidget';
import VirtualShowroom from './VirtualShowroom';
import {
    CheckCircle2,
    Gauge,
    Fuel,
    MapPin,
    Car as CarIcon,
    Settings,
    Zap,
    Users,
    ShieldCheck,
    ArrowLeft,
    Check,
    MessageCircle,
    RotateCcw,
    FileCheck2,
    Truck,
    Calendar,
    Heart,
    Share2
} from 'lucide-react';

const INSPECTION_CATEGORIES = [
    {
        title: 'Engine & Powertrain',
        details: 'Compression tested, 0 oil leaks, electronic ignition & starter calibrated'
    },
    {
        title: 'Transmission & Clutch',
        details: 'Smooth progressive shifting, clutch plate verified, zero gearbox slippage'
    },
    {
        title: 'Steering & Suspension',
        details: 'Struts, control arms & tie-rods dynamically road-tested for zero play'
    },
    {
        title: 'Brakes & Tyres',
        details: 'Brake pads & rotor thickness checked, verified >70% remaining tyre tread'
    },
    {
        title: 'Electricals & Air Conditioning',
        details: 'OBD-II full scan complete with 0 fault codes, chilling AC performance'
    },
    {
        title: 'Structure & Chassis',
        details: 'Certified non-accidental, original factory spot welds and structural pillars'
    },
    {
        title: 'Paperwork & Verification',
        details: 'Single/verified owner title, authentic odometer guarantee, clear RTO NOC'
    }
];

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show360, setShow360] = useState(false);
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { currentUser } = useAuth();

    const handleSave = () => {
        if (!car) return;
        toggleWishlist(car);
    };

    const handleBuy = async () => {
        if (!currentUser) {
            addToast('Please log in to complete your purchase.', 'error');
            navigate('/login');
            return;
        }
        if (!car) return;

        try {
            setLoading(true);
            await updateCarListing(car.id, {
                status: 'sold',
                buyerDetails: {
                    name: currentUser.name || currentUser.displayName || 'Customer',
                    email: currentUser.email,
                    date: new Date().toISOString()
                }
            }, currentUser.token);
            addToast('Vehicle order placed successfully! Our concierge will contact you.', 'success');
            getCarById(id).then(data => {
                setCar(data);
                setLoading(false);
            });
        } catch (error) {
            addToast(`Error placing order: ${error.message}`, 'error');
            setLoading(false);
        }
    };

    const handleReserve = async () => {
        if (!currentUser) {
            addToast('Please log in to reserve this car.', 'error');
            navigate('/login');
            return;
        }
        if (!car) return;

        try {
            setLoading(true);
            await updateCarListing(car.id, {
                status: 'reserved',
                auction: {
                    name: currentUser.name || currentUser.displayName || 'Customer',
                    email: currentUser.email,
                    date: new Date().toISOString()
                }
            }, currentUser.token);
            addToast('Car reserved for 48 hours! A confirmation has been sent to your email.', 'success');
            getCarById(id).then(data => {
                setCar(data);
                setLoading(false);
            });
        } catch (error) {
            addToast(`Error reserving car: ${error.message}`, 'error');
            setLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (!car) return;
        const msg = encodeURIComponent(`Hi VroomValue! I'm interested in the ${car.year} ${car.make} ${car.model} (${formatPriceINR(car.priceINR)}) listed on your platform.`);
        window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    };

    useEffect(() => {
        if (!id || id === 'undefined') return;

        getCarById(id).then(data => {
            setCar(data);
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch car details:", error);
            addToast("Failed to load vehicle details.", "error");
            setLoading(false);
        });
        window.scrollTo(0, 0);
    }, [id, addToast]);

    const parseJSON = (data) => {
        if (!data) return null;
        if (typeof data === 'object') return data;
        try { return JSON.parse(data); } catch (e) { return null; }
    };

    if (loading) return (
        <div className="container details-loading-container">
            <div className="car-details-layout">
                <div>
                    <div className="skeleton" style={{ height: '420px', borderRadius: '12px', marginBottom: '24px' }}></div>
                    <div className="skeleton" style={{ height: '140px', borderRadius: '12px', marginBottom: '24px' }}></div>
                    <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }}></div>
                </div>
                <div>
                    <div className="skeleton" style={{ height: '380px', borderRadius: '12px' }}></div>
                </div>
            </div>
        </div>
    );

    if (!car) return (
        <div className="container details-loading-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Vehicle Listing Not Found</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>The vehicle you are looking for may have been sold or removed from inventory.</p>
            <button onClick={() => navigate('/listings')} className="btn btn-primary">Browse Active Inventory</button>
        </div>
    );

    const images = parseJSON(car.images) || [];
    const auction = parseJSON(car.auction);
    const features = parseJSON(car.features) || ['ABS', 'Airbags', 'Automatic Climate Control', 'Alloy Wheels', 'Rear Parking Sensors', 'Touchscreen Infotainment'];

    const isSaved = isInWishlist(car.id);
    const emiEstimate = Math.round((Number(car.priceINR) || 500000) * 0.015);

    return (
        <div className="page-enter details-page-bg">
            <Helmet>
                <title>{`${car.year} ${car.make} ${car.model} ${car.variant || ''} | VroomValue`}</title>
                <meta name="description" content={`Buy certified used ${car.year} ${car.make} ${car.model}. ${formatKm(car.kms)}, ${car.fuel}, ${car.transmission}. 140+ point inspected with 5-day money-back guarantee.`} />
                <meta property="og:title" content={`${car.year} ${car.make} ${car.model} | VroomValue`} />
                <meta property="og:image" content={images[0]?.src || ''} />
                <meta property="og:price:amount" content={car.priceINR} />
                <meta property="og:price:currency" content="INR" />
            </Helmet>

            <div className="container details-main-container">
                {/* ── Top Bar: Breadcrumb & Back Action ── */}
                <div className="details-topbar">
                    <nav className="details-breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/listings">Listings</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{car.year} {car.make} {car.model}</span>
                    </nav>

                    <button
                        className="btn btn-outline details-back-btn"
                        onClick={() => navigate('/listings')}
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Listings</span>
                    </button>
                </div>

                {/* 360 View Modal */}
                {show360 && <VirtualShowroom car={car} onClose={() => setShow360(false)} />}

                {/* ── Main Two-Column Layout ── */}
                <div className="car-details-layout">

                    {/* Left Column: Gallery, Specs, Checklist, Test Drive */}
                    <div className="details-primary-column">

                        {/* 1. Image Gallery */}
                        <div className="details-gallery-wrapper">
                            <ImageGallery images={images} />
                            <div className="gallery-action-bar">
                                <button
                                    onClick={() => setShow360(true)}
                                    className="btn btn-outline gallery-360-trigger"
                                    type="button"
                                >
                                    <RotateCcw size={15} />
                                    <span>Interactive 360° Studio View</span>
                                </button>
                                <div className="gallery-certified-badge">
                                    <ShieldCheck size={15} />
                                    <span>140-Point Certified</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Key Vehicle Snapshot Strip */}
                        <div className="vehicle-snapshot-strip">
                            <div className="snapshot-item">
                                <span className="snapshot-label">Reg. Year</span>
                                <span className="snapshot-val">{car.year}</span>
                            </div>
                            <div className="snapshot-divider" />
                            <div className="snapshot-item">
                                <span className="snapshot-label">Odometer</span>
                                <span className="snapshot-val">{formatKm(car.kms)}</span>
                            </div>
                            <div className="snapshot-divider" />
                            <div className="snapshot-item">
                                <span className="snapshot-label">Fuel</span>
                                <span className="snapshot-val">{car.fuel}</span>
                            </div>
                            <div className="snapshot-divider" />
                            <div className="snapshot-item">
                                <span className="snapshot-label">Transmission</span>
                                <span className="snapshot-val">{car.transmission}</span>
                            </div>
                            <div className="snapshot-divider" />
                            <div className="snapshot-item">
                                <span className="snapshot-label">Ownership</span>
                                <span className="snapshot-val">{car.owner === 1 ? '1st Owner' : `${car.owner}nd Owner`}</span>
                            </div>
                            <div className="snapshot-divider" />
                            <div className="snapshot-item">
                                <span className="snapshot-label">Location</span>
                                <span className="snapshot-val">{car.city || 'Gurgaon'}</span>
                            </div>
                        </div>

                        {/* 3. Vehicle Overview & Features */}
                        <section className="details-section-card" aria-labelledby="overview-heading">
                            <h2 id="overview-heading" className="section-card-title">Vehicle Overview</h2>
                            <p className="overview-body-text">
                                {car.description || `Certified ${car.year} ${car.make} ${car.model} in excellent condition. Complete service history verified with zero accident record. Inspected across 140+ rigorous checkpoints.`}
                            </p>

                            <h3 className="section-card-subtitle-bold">Key Features &amp; Equipment</h3>
                            <div className="features-badge-grid">
                                {features.map(f => (
                                    <div key={f} className="feature-badge-chip">
                                        <CheckCircle2 size={15} className="feature-check-icon" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Technical Specifications */}
                        <section className="details-section-card" aria-labelledby="specs-heading">
                            <div className="section-card-header">
                                <h2 id="specs-heading" className="section-card-title">Technical Specifications</h2>
                                <span className="specs-verified-tag">RTO Verified</span>
                            </div>

                            <div className="specs-tiles-grid">
                                {[
                                    { label: 'Engine Capacity', val: car.engineCapacity ? `${car.engineCapacity} cc` : '1197 cc', Icon: Gauge },
                                    { label: 'ARAI Mileage', val: car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '21.5 kmpl', Icon: Fuel },
                                    { label: 'RTO Registration', val: car.rto || 'DL-01', Icon: MapPin },
                                    { label: 'Body Type', val: car.bodyType || 'Hatchback', Icon: CarIcon },
                                    { label: 'Transmission', val: car.transmission, Icon: Settings },
                                    { label: 'Fuel Type', val: car.fuel, Icon: Zap },
                                    { label: 'Seating Capacity', val: car.seats || '5 Seater', Icon: Users },
                                    { label: 'Insurance Status', val: car.insuranceValidity || 'Comprehensive', Icon: ShieldCheck }
                                ].map(spec => (
                                    <div key={spec.label} className="spec-tile">
                                        <div className="spec-tile-icon-box">
                                            <spec.Icon size={18} />
                                        </div>
                                        <div className="spec-tile-info">
                                            <span className="spec-tile-label">{spec.label}</span>
                                            <span className="spec-tile-val">{spec.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. 140-Point Inspection & Verification Checklist */}
                        <section className="details-section-card" aria-labelledby="inspection-heading">
                            <div className="section-card-header">
                                <div>
                                    <h2 id="inspection-heading" className="section-card-title">140-Point Inspection Verification</h2>
                                    <p className="section-card-subtitle">Every vehicle undergoes a standardized mechanical audit by certified engineers.</p>
                                </div>
                                <div className="checklist-status-badge">
                                    <Check size={15} />
                                    <span>All Passed</span>
                                </div>
                            </div>

                            <div className="inspection-checklist-list">
                                {INSPECTION_CATEGORIES.map((cat, idx) => (
                                    <div key={cat.title} className="inspection-checklist-row">
                                        <div className="checklist-check-circle">
                                            <Check size={14} />
                                        </div>
                                        <div className="checklist-text-wrap">
                                            <div className="checklist-category-title">{cat.title}</div>
                                            <div className="checklist-category-desc">{cat.details}</div>
                                        </div>
                                        <span className="checklist-row-status">Verified</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 6. Schedule Doorstep Test Drive Form */}
                        <ScheduleTestDrive
                            carId={car.id}
                            carTitle={`${car.year} ${car.make} ${car.model}`}
                        />
                    </div>

                    {/* Right Column: Sticky Purchase & Reservation Panel */}
                    <aside className="details-sidebar-column">
                        <div className="details-sticky-card">
                            {/* Vehicle Header */}
                            <div className="sidebar-meta-row">
                                <span className="sidebar-year-tag">{car.year} Model</span>
                                <span className="sidebar-dot">•</span>
                                <span className="sidebar-kms-tag">{formatKm(car.kms)}</span>
                                <span className="sidebar-dot">•</span>
                                <span className="sidebar-city-tag">{car.city || 'India'}</span>
                            </div>

                            <h1 className="sidebar-vehicle-title">{car.make} {car.model}</h1>
                            <div className="sidebar-variant-text">{car.variant || 'Standard Edition'}</div>

                            {/* Price Card */}
                            <div className="sidebar-pricing-card">
                                <div className="pricing-primary-line">
                                    <span className="sidebar-price-amount">{formatPriceINR(car.priceINR)}</span>
                                    <button
                                        onClick={handleSave}
                                        className={`sidebar-wishlist-btn ${isSaved ? 'saved' : ''}`}
                                        aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                                        type="button"
                                    >
                                        <Heart size={20} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#71817F'} />
                                    </button>
                                </div>
                                <div className="pricing-secondary-line">
                                    <span>EMI from ₹{emiEstimate.toLocaleString('en-IN')}/month</span>
                                    <span className="pricing-tax-note">Fixed Fair Price (Incl. GST)</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {auction && auction.isAuction ? (
                                <BiddingWidget car={{ ...car, auction }} onBidPlaced={() => getCarById(id).then(setCar)} />
                            ) : (
                                <div className="sidebar-actions-group">
                                    {car.status === 'sold' ? (
                                        <div className="sidebar-status-banner sold">
                                            This vehicle has been sold
                                        </div>
                                    ) : car.status === 'reserved' ? (
                                        <div className="sidebar-status-banner reserved">
                                            Currently reserved by customer
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleBuy}
                                                className="btn btn-primary sidebar-buy-btn"
                                            >
                                                Buy Online Now
                                            </button>
                                            <button
                                                onClick={handleReserve}
                                                className="btn btn-outline sidebar-reserve-btn"
                                            >
                                                Reserve for ₹10,000 (Refundable)
                                            </button>
                                            <button
                                                onClick={handleWhatsApp}
                                                className="btn sidebar-whatsapp-btn"
                                                type="button"
                                            >
                                                <MessageCircle size={18} />
                                                <span>Chat with Car Advisor</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* VroomValue Reassurance Card */}
                            <div className="sidebar-reassurance-box">
                                <div className="reassurance-header">
                                    <div className="reassurance-icon">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="reassurance-title">VroomValue Assured</div>
                                        <div className="reassurance-subtitle">Certified automotive guarantee</div>
                                    </div>
                                </div>

                                <div className="reassurance-points">
                                    <div className="reassurance-point-item">
                                        <Check size={14} className="reassurance-check" />
                                        <span>140+ Point Digital Audit Passed</span>
                                    </div>
                                    <div className="reassurance-point-item">
                                        <RotateCcw size={14} className="reassurance-check" />
                                        <span>5-Day Money-Back Guarantee</span>
                                    </div>
                                    <div className="reassurance-point-item">
                                        <FileCheck2 size={14} className="reassurance-check" />
                                        <span>Free RC Transfer & Paperwork</span>
                                    </div>
                                    <div className="reassurance-point-item">
                                        <Truck size={14} className="reassurance-check" />
                                        <span>Doorstep Delivery Across 50+ Cities</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Bottom Fixed Action Bar */}
            <div className="mobile-details-bottom-bar">
                <div className="mobile-bar-price-wrap">
                    <span className="mobile-bar-price-label">Fixed Price</span>
                    <span className="mobile-bar-price-val">{formatPriceINR(car.priceINR)}</span>
                </div>
                <div className="mobile-bar-buttons">
                    <button
                        onClick={handleSave}
                        className={`btn btn-outline mobile-bar-heart-btn ${isSaved ? 'active' : ''}`}
                        aria-label="Save"
                    >
                        <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : '#172B2B'} />
                    </button>
                    {car.status !== 'sold' && car.status !== 'reserved' && (
                        <button onClick={handleBuy} className="btn btn-primary mobile-bar-buy-btn">
                            Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
