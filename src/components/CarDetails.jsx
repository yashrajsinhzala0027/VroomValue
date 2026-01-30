
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '../api/mockApi';
import { formatPriceINR, formatKm } from '../utils/formatters';
import { useToast } from './Toasts';
import ImageGallery from './ImageGallery';
import ValuationWidget from './ValuationWidget';
import ScheduleTestDrive from './ScheduleTestDrive';
import BiddingWidget from './BiddingWidget';
import '../styles/components.css';

import VirtualShowroom from './VirtualShowroom';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show360, setShow360] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        getCarById(id).then(data => {
            setCar(data);
            setLoading(false);
        });
    }, [id, navigate]);

    // Safe JSON Parse Helper
    const parseJSON = (data) => {
        if (!data) return null;
        if (typeof data === 'object') return data;
        try { return JSON.parse(data); } catch (e) { return null; }
    };

    const images = car ? (parseJSON(car.images) || []) : [];
    const valuation = car ? parseJSON(car.valuation) : null;
    const auction = car ? parseJSON(car.auction) : null;
    const features = car ? (parseJSON(car.features) || []) : [];

    const refreshData = () => {
        getCarById(id).then(data => setCar(data));
    };

    const handleSave = () => {
        // Add to localstorage saved list
        const saved = JSON.parse(localStorage.getItem('VroomValue_saved') || '[]');
        if (car && !saved.some(c => c.id === car.id)) {
            saved.push(car);
            localStorage.setItem('VroomValue_saved', JSON.stringify(saved));
            addToast("Car added to your shortlist!", "success");
        } else {
            addToast("Car is already active in your shortlist", "info");
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading details...</div>;
    if (!car) return <div className="container" style={{ paddingTop: '40px' }}>Car not found</div>;

    return (
        <div className="container" style={{ padding: '160px 16px 40px', position: 'relative' }}>
            <button
                className="back-btn"
                onClick={() => navigate(-1)}
                style={{ top: '90px', left: '16px' }}
                title="Go Back"
            >
                <span>❮</span>
            </button>
            {show360 && <VirtualShowroom car={car} onClose={() => setShow360(false)} />}

            <div className="car-details-grid">
                {/* Left Column: Gallery & Desc */}
                <div>
                    <div style={{ position: 'relative' }}>
                        <ImageGallery images={images} />
                        <button
                            onClick={() => setShow360(true)}
                            className="btn btn-primary"
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem'
                            }}
                        >
                            <span>↻</span> View in 360°
                        </button>
                    </div>

                    <div className="details-card" style={{ marginTop: '24px' }}>
                        <h3>Vehicle Overview</h3>
                        <p style={{ marginTop: '12px', lineHeight: '1.6', color: '#555' }}>
                            {car.description}
                        </p>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {features.map(f => (
                                <span key={f} style={{ background: '#e9ecef', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="details-card" style={{ marginTop: '24px' }}>
                        <h3>Technical Specifications</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginTop: '16px',
                            background: '#f8fafc',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engine Capacity</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.engineCapacity ? `${car.engineCapacity} cc` : 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mileage</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.mileageKmpl ? `${car.mileageKmpl} kmpl` : 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RTO Region</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.rto || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insurance</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.insuranceValidity || 'Comprehensive'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Type</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.bodyType || 'SUV'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</div>
                                <div style={{ fontWeight: '600', marginTop: '4px' }}>{car.color || 'White'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 12px', borderRadius: '8px',
                                background: car.accidental === false || car.accidental === undefined ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: car.accidental === false || car.accidental === undefined ? '#059669' : '#dc2626',
                                fontSize: '0.85rem', fontWeight: '600'
                            }}>
                                <span>{car.accidental === false || car.accidental === undefined ? '✓' : '⚠'}</span>
                                {car.accidental === false || car.accidental === undefined ? 'Accident Free' : 'Accident History'}
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 12px', borderRadius: '8px',
                                background: car.serviceHistory === false ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: car.serviceHistory === false ? '#d97706' : '#059669',
                                fontSize: '0.85rem', fontWeight: '600'
                            }}>
                                <span>{car.serviceHistory === false ? '⚠' : '✓'}</span>
                                {car.serviceHistory === false ? 'Partial Service History' : 'Full Service History'}
                            </div>
                        </div>
                    </div>

                    <div className="details-card">
                        <h3>Service History</h3>
                        <ul style={{ marginTop: '16px', borderLeft: '2px solid #eee', paddingLeft: '20px' }}>
                            {(car.history && car.history.length > 0) ? car.history.map((h, i) => (
                                <li key={i} style={{ marginBottom: '16px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-26px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    <strong>{h.date}</strong>
                                    <div style={{ color: '#666' }}>{h.event}</div>
                                </li>
                            )) : (
                                <li style={{ marginBottom: '16px', color: '#64748b' }}>
                                    Standard 140-point quality check completed by VroomValue.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Key Details & CTAs */}
                <div>
                    <div className="details-card">
                        <div style={{ marginBottom: '8px', color: '#666' }}>{car.year} • {car.fuel}</div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>{car.make} {car.model}</h1>
                        <div className="price-block">
                            <span className="main-price">{formatPriceINR(car.priceINR)}</span>
                            <button
                                onClick={handleSave}
                                className="btn btn-outline"
                            >
                                ♥ Save
                            </button>
                        </div>

                        <div className="feature-grid">
                            <div className="feature-item">
                                <span className="feature-label">Kilometers</span>
                                <span className="feature-value">{formatKm(car.kms)}</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-label">Owner</span>
                                <span className="feature-value">{car.owner === 1 ? '1st' : '2nd'} Owner</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-label">Fuel Type</span>
                                <span className="feature-value">{car.fuel}</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-label">Transmission</span>
                                <span className="feature-value">{car.transmission}</span>
                            </div>
                        </div>
                    </div>

                    <ValuationWidget valuation={valuation || {}} currentPrice={car.priceINR} />

                    {auction && auction.isAuction && (
                        <div style={{ marginTop: '24px' }}>
                            <BiddingWidget car={{ ...car, auction }} onBidPlaced={refreshData} />
                        </div>
                    )}

                    <ScheduleTestDrive carTitle={`${car.year} ${car.make} ${car.model}`} />
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
