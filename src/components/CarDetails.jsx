
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

                        <section className="glass-panel vehicle-overview">
                            <h2>Vehicle Overview</h2>
                            <p className="overview-text">
                                {car.description}
                            </p>
                            <div className="feature-tag-list">
                                {features.slice(0, 8).map(f => (
                                    <span key={f} className="badge badge-outline">
                                        {f}
                                    </span>
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
                            <h2>
                                <span style={{ color: 'var(--primary)' }}>⚙️</span> Key Specifications
                            </h2>
                            <div className="spec-grid">
                                {[
                                    { label: 'Engine', val: car.engineCapacity ? `${car.engineCapacity} cc` : '1.2L dual-Jet' },
                                    { label: 'Mileage', val: car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '22.3 kmpl' },
                                    { label: 'RTO', val: car.rto || 'DL-01' },
                                    { label: 'Body', val: car.bodyType || 'Hatchback' },
                                    { label: 'Trans', val: car.transmission },
                                    { label: 'Fuel', val: car.fuel }
                                ].map(spec => (
                                    <div key={spec.label}>
                                        <div className="spec-item-label">{spec.label}</div>
                                        <div className="spec-item-value">{spec.val}</div>
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
                        <div className="glass-panel sidebar-panel">
                            <div style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{car.year} • {car.kms} kms • {car.owner === 1 ? '1st' : '2nd'} Owner</div>
                            <h1 className="sidebar-car-title">{car.make} {car.model}</h1>

                            <div className="price-display-wrapper">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="price-main">{formatPriceINR(car.priceINR)}</span>
                                    <span className="price-sub">Certified Market Price</span>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className={`btn ${isInWishlist(car.id) ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ borderRadius: '12px', padding: '12px', minHeight: '50px', minWidth: '50px' }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(car.id) ? 'white' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </button>
                            </div>

                            {auction && auction.isAuction ? (
                                <BiddingWidget car={{ ...car, auction }} onBidPlaced={() => getCarById(id).then(setCar)} />
                            ) : (
                                <div className="flex-stack">
                                    {car.status === 'sold' ? (
                                        <div className="badge-sold badge-status-large">SOLD OUT</div>
                                    ) : car.status === 'reserved' ? (
                                        <div className="badge-reserved badge-status-large">RESERVED</div>
                                    ) : (
                                        <>
                                            <button onClick={handleBuy} className="btn btn-primary" style={{ width: '100%', height: '60px', fontSize: '1.1rem', fontWeight: 800 }}>BUY THIS VEHICLE</button>
                                            <button onClick={handleReserve} className="btn btn-outline" style={{ width: '100%', height: '54px', fontWeight: 700 }}>RESERVE NOW (₹10,000)</button>
                                        </>
                                    )}
                                </div>
                            )}
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
