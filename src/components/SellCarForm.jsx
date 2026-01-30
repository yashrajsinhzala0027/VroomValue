
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MAKES, MODEL_PROFILES, FUEL_TYPES, TRANSMISSIONS, CITIES, BODY_TYPES, COLORS, FEATURES, SEATS, OWNERS, RTO_REGIONS, INSURANCE_TYPES } from '../utils/constants';
import { validateListing } from '../utils/validators';
import { createCarListing, getValuation, submitSellRequest, calculateRealMarketPrice } from '../api/mockApi';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import CustomSelect from './CustomSelect';
import { formatPriceINR } from '../utils/formatters';

const SellCarForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const { addToast } = useToast();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [valuationRange, setValuationRange] = useState(null);
    const [formData, setFormData] = useState({
        make: '', model: '', variant: '', year: new Date().getFullYear(), city: '',
        fuel: '', transmission: 'Manual', bodyType: '',
        engineCapacity: '', mileageKmpl: '',
        kms: '', owner: '1st owner', seats: '5 seater', color: 'White',
        rto: '', insuranceValidity: 'Comprehensive',
        accidental: false, serviceHistory: true,
        features: [],
        priceINR: '', description: '',
        images: []
    });
    const [errors, setErrors] = useState({});

    // Pre-fill effect
    useEffect(() => {
        if (location.state && location.state.prefill) {
            const prefill = location.state.prefill;
            setFormData(prev => ({
                ...prev,
                ...prefill,
                // Ensure kms is a number if stringified
                kms: prefill.kms || prev.kms,
                priceINR: prefill.priceINR || prev.priceINR
            }));

            // If we have enough info from valuation, skip to Step 4 (Photos) or at least 2
            if (prefill.make && prefill.model && prefill.year && prefill.city) {
                // We have basic info, maybe skip to step 2 or 3
                if (prefill.fuel && prefill.transmission) {
                    setStep(3); // Start at History
                } else {
                    setStep(2); // Start at Specs
                }
                addToast("Data pre-filled from valuation!", "success");
            }
        }
    }, [location.state, addToast]);

    useEffect(() => {
        if (formData.make && formData.year && formData.kms) {
            // Parse owner string (e.g., "1st owner" -> 1)
            const ownerNum = parseInt(formData.owner) || 1;

            const range = calculateRealMarketPrice({
                make: formData.make,
                model: formData.model,
                year: formData.year,
                kms: formData.kms,
                fuel: formData.fuel,
                transmission: formData.transmission,
                city: formData.city,
                owner: ownerNum,
                features: formData.features
            });
            setValuationRange(range);
        }
    }, [formData.make, formData.model, formData.year, formData.kms, formData.owner, formData.features]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-fill technical specs if model is found in profiles
            if (name === 'model' && MODEL_PROFILES[value]) {
                const profile = MODEL_PROFILES[value];
                updated.engineCapacity = profile.engine;
                updated.mileageKmpl = profile.mileage;
                updated.bodyType = ["Swift", "Baleno"].includes(value) ? "Hatchback" :
                    ["Dzire", "City"].includes(value) ? "Sedan" :
                        ["Creta", "Nexon", "Venue", "Thar", "Fortuner", "Innova", "Harrier", "XUV700", "TUV300"].includes(value) ? "SUV" : prev.bodyType;
            }
            return updated;
        });
        // Clear error for this field
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = {
                    id: Date.now() + Math.random(),
                    type: type,
                    src: reader.result,
                    srcSet: '' // Base64 usually doesn't need srcset
                };
                // Remove existing image of same type if present
                const others = formData.images.filter(img => img.type !== type);
                setFormData({ ...formData, images: [...others, newImage] });
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleFeature = (feature) => {
        const next = formData.features.includes(feature)
            ? formData.features.filter(f => f !== feature)
            : [...formData.features, feature];
        setFormData({ ...formData, features: next });
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.make) newErrors.make = 'Required';
            if (!formData.model) newErrors.model = 'Required';
            if (!formData.variant) newErrors.variant = 'Required';
            if (!formData.city) newErrors.city = 'Required';
        }

        if (currentStep === 2) {
            // Fuel and Transmission are critical for valuation logic
            if (!formData.fuel) newErrors.fuel = 'Required';
            if (!formData.transmission) newErrors.transmission = 'Required';
            // Optional: bodyType, engineCapacity, mileageKmpl
        }

        if (currentStep === 3) {
            // Kms and Owner are critical for valuation
            if (!formData.kms) newErrors.kms = 'Required';
            if (!formData.owner) newErrors.owner = 'Required';
            // Optional: seats, color, rto, insuranceValidity
        }

        if (currentStep === 4) {
            if (formData.images.length === 0) {
                newErrors.images = "Please upload at least one photo";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
            addToast("Please fill in all required fields", "error");
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, errors: valErrors } = validateListing(formData);
        if (!isValid) {
            setErrors(valErrors);
            addToast("Please fix errors before submitting", "error");
            return;
        }

        setLoading(true);
        try {
            await submitSellRequest({
                ...formData,
                priceINR: Number(formData.priceINR),
                kms: Number(formData.kms),
                engineCapacity: Number(formData.engineCapacity),
                mileageKmpl: Number(formData.mileageKmpl),
                owner: parseInt(formData.owner), // "1st owner" -> 1
                status: 'pending'
            });
            addToast("Request submitted! Waiting for admin approval.", "success");
            navigate('/listings');
        } catch (err) {
            console.error("Submission error:", err);
            addToast("Failed to publish. Local storage might be full—try using fewer or smaller photos.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="container" style={{ padding: '60px', textAlign: 'center' }}>
                <h2>Login Needed</h2>
                <p>Please login to sell your car.</p>
            </div>
        );
    }

    return (
        <div className="form-card-integrated" style={{ maxWidth: '800px', position: 'relative' }}>
            <div className="form-header-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Sell Your Car</h2>
                    <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>Step {step} of 5</div>
                </div>
                <div className="form-progress-bar">
                    <div className="form-progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
            </div>

            {step === 1 && (
                <div className="step-content">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Basic Information</h3>
                    <div className="form-group">
                        <label className="form-label">Make</label>
                        <CustomSelect
                            name="make"
                            value={formData.make}
                            options={MAKES}
                            onChange={handleChange}
                            placeholder="Select Make"
                            error={errors.make}
                        />
                        {errors.make && <div className="error-msg">{errors.make}</div>}
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Model</label>
                            <input name="model" className={`form-control ${errors.model ? 'error' : ''}`} value={formData.model} onChange={handleChange} placeholder="e.g. Swift, City" />
                            {errors.model && <div className="error-msg">{errors.model}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Variant</label>
                            <input name="variant" className={`form-control ${errors.variant ? 'error' : ''}`} value={formData.variant} onChange={handleChange} placeholder="e.g. VXI, SX" />
                            {errors.variant && <div className="error-msg">{errors.variant}</div>}
                        </div>
                    </div>

                    <div className="form-grid-mixed">
                        <div className="form-group">
                            <label className="form-label">Year</label>
                            <input type="number" name="year" className="form-control" value={formData.year} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">City</label>
                            <CustomSelect
                                name="city"
                                value={formData.city}
                                options={CITIES}
                                onChange={handleChange}
                                placeholder="Select City"
                                error={errors.city}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', marginTop: '20px' }}>Next: Specifications</button>
                </div>
            )}

            {step === 2 && (
                <div className="step-content">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Technical Specifications</h3>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Fuel Type</label>
                            <CustomSelect
                                name="fuel"
                                value={formData.fuel}
                                options={FUEL_TYPES}
                                onChange={handleChange}
                                placeholder="Select Fuel"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Transmission</label>
                            <CustomSelect
                                name="transmission"
                                value={formData.transmission}
                                options={TRANSMISSIONS}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Body Type</label>
                        <CustomSelect
                            name="bodyType"
                            value={formData.bodyType}
                            options={BODY_TYPES}
                            onChange={handleChange}
                            placeholder="Select Body Type"
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Engine Capacity (CC)</label>
                            <input type="number" name="engineCapacity" className="form-control" value={formData.engineCapacity} onChange={handleChange} placeholder="e.g. 1197" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mileage (kmpl)</label>
                            <input type="number" name="mileageKmpl" className="form-control" value={formData.mileageKmpl} onChange={handleChange} placeholder="e.g. 21" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>Next: History</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="step-content">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Usage & History</h3>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Kms Driven</label>
                            <input type="number" name="kms" className={`form-control ${errors.kms ? 'error' : ''}`} value={formData.kms} onChange={handleChange} placeholder="e.g. 45000" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">No. of Owners</label>
                            <CustomSelect name="owner" value={formData.owner} options={OWNERS} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Seating Capacity</label>
                            <CustomSelect name="seats" value={formData.seats} options={SEATS} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <CustomSelect
                                name="color"
                                value={formData.color}
                                options={COLORS.map(c => c.name)}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">RTO Region</label>
                        <CustomSelect name="rto" value={formData.rto} options={RTO_REGIONS} onChange={handleChange} placeholder="Select RTO" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Insurance Validity</label>
                        <CustomSelect name="insuranceValidity" value={formData.insuranceValidity} options={INSURANCE_TYPES} onChange={handleChange} />
                    </div>

                    <div className="form-grid-2" style={{ marginTop: '10px' }}>
                        <label className="premium-toggle">
                            <input type="checkbox" hidden checked={formData.accidental} onChange={(e) => setFormData({ ...formData, accidental: e.target.checked })} />
                            <div className="toggle-track">
                                <div className="toggle-thumb"></div>
                            </div>
                            <span className="form-label" style={{ marginBottom: 0 }}>Accident History</span>
                        </label>
                        <label className="premium-toggle">
                            <input type="checkbox" hidden checked={formData.serviceHistory} onChange={(e) => setFormData({ ...formData, serviceHistory: e.target.checked })} />
                            <div className="toggle-track">
                                <div className="toggle-thumb"></div>
                            </div>
                            <span className="form-label" style={{ marginBottom: 0 }}>Full Service records</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</button>
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>Next: Photos</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="step-content">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Vehicle Photos</h3>
                    <p style={{ marginBottom: '16px', color: '#666' }}>Upload clear photos for better reach.</p>

                    <div className="form-grid-2" style={{ gap: '20px' }}>
                        {['exterior-front', 'exterior-rear', 'exterior-left', 'exterior-right', 'interior-dashboard', 'interior-front-cabin'].map(type => (
                            <div key={type} className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>{type.replace(/-/g, ' ').toUpperCase()}</label>
                                <label className="premium-upload-zone">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageUpload(e, type)}
                                    />
                                    <div className="upload-icon">📸</div>
                                    <div className="upload-text">Click to Upload</div>

                                    {formData.images.find(img => img.type === type) && (
                                        <div className="upload-preview-overlay">
                                            <img
                                                src={formData.images.find(img => img.type === type).src}
                                                alt="Preview"
                                            />
                                            <div className="upload-check-badge">✓</div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.images && <div className="error-msg" style={{ marginBottom: '16px' }}>{errors.images}</div>}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={() => setStep(3)} style={{ flex: 1 }}>Back</button>
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 1 }}>Next: Price</button>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="step-content">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Features & Pricing</h3>

                    {valuationRange && (
                        <div style={{
                            background: 'var(--primary-soft)',
                            padding: '24px',
                            borderRadius: '16px',
                            marginBottom: '24px',
                            border: '1.5px solid var(--primary)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>💰</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>🤖 Real Market Price Estimate</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    {formatPriceINR(valuationRange.fairPrice)} - {formatPriceINR(valuationRange.goodPrice)}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                Our AI analyzed **{formData.make} {formData.model}** market trends, age ({2024 - formData.year}y), and usage ({Number(formData.kms).toLocaleString()} km) to find this fair value.
                            </p>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, priceINR: valuationRange.fairPrice })}
                                style={{
                                    marginTop: '16px', padding: '6px 12px', border: '1px solid var(--primary)',
                                    borderRadius: '20px', fontSize: '0.75rem', background: 'white', color: 'var(--primary)',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Use Recommended Price 👆
                            </button>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Key Features</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {FEATURES.map(f => (
                                <div
                                    key={f}
                                    onClick={() => toggleFeature(f)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: `1px solid ${formData.features.includes(f) ? 'var(--primary)' : '#e2e8f0'}`,
                                        background: formData.features.includes(f) ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Expected Price (₹)</label>
                        <input type="number" name="priceINR" className={`form-control ${errors.priceINR ? 'error' : ''}`} value={formData.priceINR} onChange={handleChange} placeholder="e.g. 500000" />
                        {errors.priceINR && <div className="error-msg">{errors.priceINR}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description" className="form-control" rows="4"
                            value={formData.description} onChange={handleChange}
                            placeholder="Tell buyers more about your car..."
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={() => setStep(4)} style={{ flex: 1 }}>Back</button>
                        <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Publishing...' : 'Post Listing'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SellCarForm;
