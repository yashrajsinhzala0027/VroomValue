
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCarById, updateCarListing } from '../api/mockApi';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useToast } from './Toasts';
import { useWishlist } from './WishlistContext';
import { useAuth } from './AuthContext';
import ImageGallery from './ImageGallery';
import ValuationWidget from './ValuationWidget';
import ScheduleTestDrive from './ScheduleTestDrive';
import BiddingWidget from './BiddingWidget';
import VirtualShowroom from './VirtualShowroom';
import { CarHealthScore, ResalePredictor } from './IntelligenceCenter';
import AIValuationMeter from './AIValuationMeter';

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
            addToast('Please log in to buy a car.', 'error');
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
            addToast('Car marked as sold successfully!', 'success');
            // Refresh car data after update
            getCarById(id).then(data => {
                setCar(data);
                setLoading(false);
            });
        } catch (error) {
            addToast(`Error buying car: ${error.message}`, 'error');
            setLoading(false);
        }
    };

    const handleReserve = async () => {
        if (!currentUser) {
            addToast('Please log in to reserve a car.', 'error');
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
            addToast('Car reserved successfully!', 'success');
            // Refresh car data after update
            getCarById(id).then(data => {
                setCar(data);
                setLoading(false);
            });
        } catch (error) {
            addToast(`Error reserving car: ${error.message}`, 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id || id === 'undefined') return;

        getCarById(id).then(data => {
            setCar(data);
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch car details:", error);
            addToast("Failed to load car details.", "error");
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
        <div className="container details-skeleton-container">
            <div className="pro-grid">
                <div style={{ background: 'var(--border)', height: '400px', borderRadius: '20px' }} className="skeleton"></div>
                <div>
                    <div style={{ background: 'var(--border)', height: '60px', width: '80%', marginBottom: '20px' }} className="skeleton"></div>
                    <div style={{ background: 'var(--border)', height: '100px', width: '100%', marginBottom: '20px' }} className="skeleton"></div>
                </div>
            </div>
        </div>
    );

    if (!car) return <div className="container details-skeleton-container">Car not found</div>;

    const images = parseJSON(car.images) || [];
    const valuation = parseJSON(car.valuation);
    const auction = parseJSON(car.auction);
    const features = parseJSON(car.features) || [];

    // Dynamic Health Calculations
    const age = 2024 - (Number(car.year) || 2024);
    const kms = Number(car.kms) || 0;
    const healthScore = Math.max(78, Math.min(98, 100 - (age * 1.5) - (kms / 12000)));

    return (
        <div className="page-enter details-page-bg">
            <Helmet>
                <title>{`${car.year} ${car.make} ${car.model} | VroomValue`}</title>
                <meta name="description" content={`Buy certified used ${car.year} ${car.make} ${car.model} in excellent condition. ${formatKm(car.kms)}, ${car.fuel}. VroomValue Certified with 140+ point check.`} />
                <meta property="og:title" content={`${car.year} ${car.make} ${car.model} | VroomValue`} />
                <meta property="og:image" content={images[0]?.src || ''} />
                <meta property="og:price:amount" content={car.priceINR} />
                <meta property="og:price:currency" content="INR" />
            </Helmet>
            <div className="container">
                <div className="details-breadcrumb">
                    <Link to="/">HOME</Link>
                    <span>/</span>
                    <Link to="/listings">LISTINGS</Link>
                    <span>/</span>
                    <span className="active">{car.make.toUpperCase()} {car.model.toUpperCase()}</span>
                </div>

                <button
                    className="btn btn-outline back-gallery-btn"
                    onClick={() => navigate(-1)}
                >
                    <span>&larr;</span> Back to Gallery
                </button>

                {show360 && <VirtualShowroom car={car} onClose={() => setShow360(false)} />}

                <div className="car-details-layout">
                    {/* Main Content Area */}
                    <div className="flex-stack">
                        <section style={{ position: 'relative' }}>
                            <ImageGallery images={images} />
                            <button
                                onClick={() => setShow360(true)}
                                className="btn btn-primary details-360-btn"
                            >
                                <span>↺</span> View in 360°
                            </button>
                        </section>

                        <AIValuationMeter score={car.id % 2 === 0 ? 94 : 91} />

                        <section className="glass-panel vehicle-overview">
                            <h2>Vehicle Overview</h2>
                            <p className="overview-text" style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '32px' }}>
                                {car.description}
                            </p>

                            <h3>Premium Features</h3>
                            <div className="features-icon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '20px' }}>
                                {features.map(f => (
                                    <div key={f} className="feature-icon-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '1.2rem' }}>✨</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <CarHealthScore
                            score={healthScore}
                            engine={healthScore + 2}
                            body={healthScore - 3}
                            interior={healthScore + 1}
                        />

                        <section className="glass-panel spec-grid-container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ margin: 0 }}>Technical Specifications</h2>
                                <span className="badge badge-verified">VV Certified Audit</span>
                            </div>
                            <div className="spec-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '24px' }}>
                                {[
                                    { label: 'Engine', val: car.engineCapacity ? `${car.engineCapacity} cc` : '1.2L dual-Jet', icon: '🚀' },
                                    { label: 'Mileage', val: car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '22.3 kmpl', icon: '⛽' },
                                    { label: 'RTO', val: car.rto || 'DL-01', icon: '📍' },
                                    { label: 'Body', val: car.bodyType || 'Hatchback', icon: '🚗' },
                                    { label: 'Trans', val: car.transmission, icon: '⚙️' },
                                    { label: 'Fuel', val: car.fuel, icon: '🔥' },
                                    { label: 'Seats', val: car.seats || '5 Seater', icon: '💺' },
                                    { label: 'Insurance', val: car.insuranceValidity || 'Comprehensive', icon: '🛡️' }
                                ].map(spec => (
                                    <div key={spec.label} style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{spec.icon}</div>
                                        <div className="spec-item-label" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{spec.label}</div>
                                        <div className="spec-item-value" style={{ fontWeight: 800, fontSize: '1rem', marginTop: '4px' }}>{spec.val}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <ResalePredictor currentPrice={car.priceINR} />

                        <ScheduleTestDrive
                            carId={car.id}
                            carTitle={`${car.year} ${car.make} ${car.model}`}
                        />
                    </div>

                    {/* Desktop Sidebar / Sticky Panel */}
                    <div className="sticky-panel desktop-only">
                        <div className="glass-panel sidebar-panel" style={{ padding: '32px', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: '12px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                                {car.year} • {formatKm(car.kms)} • {car.owner === 1 ? '1st' : `${car.owner}nd`} Owner
                            </div>
                            <h1 className="sidebar-car-title" style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: '1.1', marginBottom: '24px' }}>{car.make} {car.model}</h1>

                            <div className="price-display-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', background: 'var(--bg-main)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="price-main" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{formatPriceINR(car.priceINR)}</span>
                                    <span className="price-sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>Fixed Market Price (Inc. GST)</span>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className={`btn ${isInWishlist(car.id) ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ borderRadius: '16px', padding: '12px', minHeight: '56px', minWidth: '56px' }}
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill={isInWishlist(car.id) ? 'white' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>
                            </div>

                            {auction && auction.isAuction ? (
                                <BiddingWidget car={{ ...car, auction }} onBidPlaced={() => getCarById(id).then(setCar)} />
                            ) : (
                                <div className="flex-stack" style={{ gap: '16px' }}>
                                    {car.status === 'sold' ? (
                                        <div className="badge-sold badge-status-large" style={{ background: '#fee2e2', color: '#ef4444', padding: '24px', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem' }}>VEHICLE SOLD OUT</div>
                                    ) : car.status === 'reserved' ? (
                                        <div className="badge-reserved badge-status-large" style={{ background: '#fef3c7', color: '#d97706', padding: '24px', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem' }}>CURRENTLY RESERVED</div>
                                    ) : (
                                        <>
                                            <button onClick={handleBuy} className="btn btn-primary" style={{ width: '100%', height: '64px', fontSize: '1.25rem', fontWeight: 900, borderRadius: '20px' }}>BUY THIS VEHICLE</button>
                                            <button onClick={handleReserve} className="btn btn-outline" style={{ width: '100%', height: '56px', fontWeight: 800, borderRadius: '20px' }}>RESERVE FOR ₹10,000</button>
                                            <button onClick={() => addToast("Connecting to seller...", "info")} className="btn btn-outline" style={{ width: '100%', height: '56px', fontWeight: 800, borderRadius: '20px', borderColor: 'var(--primary)', color: 'var(--primary)', background: 'var(--primary-soft)' }}>WHATSAPP SELLER</button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="seller-trust-box" style={{ marginTop: '40px', padding: '28px', borderRadius: '28px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🛡️</div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>VroomValue Certified</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>140+ Point Digital Audit Passed</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Response Rate</div>
                                        <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>98.4%</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Location</div>
                                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>{car.city || 'Gurgaon'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Action Bar */}
            <div className="mobile-action-bar">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Price</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.4rem', fontWeight: 900 }}>{formatPriceINR(car.priceINR)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleSave}
                        className={`btn ${isInWishlist(car.id) ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '8px', minWidth: '44px', minHeight: '44px' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(car.id) ? 'white' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    {car.status === 'approved' && !auction?.isAuction && (
                        <button onClick={handleBuy} className="btn btn-primary" style={{ padding: '0 20px', height: '44px', fontWeight: 800 }}>BUY NOW</button>
                    )}
                    {car.status === 'sold' && <span style={{ color: 'var(--danger)', fontWeight: 900, fontSize: '0.9rem' }}>SOLD</span>}
                    {car.status === 'reserved' && <span style={{ color: 'var(--warning)', fontWeight: 900, fontSize: '0.9rem' }}>RESERVED</span>}
                    {auction?.isAuction && (
                        <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="btn btn-primary" style={{ padding: '0 20px', height: '44px', fontWeight: 800 }}>BID NOW</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
