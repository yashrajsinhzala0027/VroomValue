import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAKES, MODEL_PROFILES, CITIES, FUEL_TYPES, TRANSMISSIONS, OWNERS } from '../utils/constants';
import { MODEL_TO_MAKE_MAP } from '../utils/modelMapping';
import { formatPriceINR } from '../utils/formatters';
import { useToast } from './Toasts';
import BrandLogo from './BrandLogo';
import PremiumSelect from './PremiumSelect';
import ConfirmModal from './ConfirmModal';
import { getValuation } from '../api/mockApi';
import ValuationResult from './ValuationResult';

const ValuationWizard = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [selection, setSelection] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        fuel: '',
        transmission: '',
        kms: '',
        owner: '1st owner',
        city: '',
        features: ['ABS', 'Airbags'] // Default assumed for valuation
    });

    const [errors, setErrors] = useState({});

    const steps = [
        { id: 1, title: 'Select Brand' },
        { id: 2, title: 'Select Model' },
        { id: 3, title: 'Details' },
        { id: 4, title: 'Condition' },
        { id: 5, title: 'Valuation' }
    ];

    const handleSelect = (field, value) => {
        setSelection(prev => {
            const newSelection = { ...prev, [field]: value };
            if (field === 'make') newSelection.model = '';
            return newSelection;
        });

        // Clear error when field is selected
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Auto-advance for visual selections
        if (step === 1 && field === 'make') {
            setTimeout(() => setStep(2), 300);
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 3) {
            if (!selection.year) newErrors.year = true;
            if (!selection.city) newErrors.city = true;
            if (!selection.fuel) newErrors.fuel = true;
            if (!selection.transmission) newErrors.transmission = true;
        }

        if (currentStep === 4) {
            if (!selection.kms) newErrors.kms = true;
            if (!selection.owner) newErrors.owner = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
            addToast("Please fill in all required fields", "error");
        }

        return isValid;
    };

    const handleNextStep = (nextStep) => {
        if (validateStep(step)) {
            setStep(nextStep);
        }
    };

    const getModelsForMake = (make) => {
        return Object.keys(MODEL_TO_MAKE_MAP).filter(
            model => MODEL_TO_MAKE_MAP[model] === make
        );
    };

    const calculateValuation = async () => {
        if (!validateStep(4)) return;

        setLoading(true);
        try {
            // Short artificial delay for "analysis" feel, but much faster than before
            await new Promise(resolve => setTimeout(resolve, 600));
            const valData = await getValuation(selection);
            setResult(valData);
            setStep(5);
        } catch (err) {
            addToast("Failed to calculate valuation. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelection({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            fuel: '',
            transmission: '',
            kms: '',
            owner: '1st owner',
            city: '',
            features: ['ABS', 'Airbags']
        });
        setResult(null);
        setStep(1);
        setErrors({});
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="brand-grid animate-in">
                        {MAKES.map(make => (
                            <div
                                key={make}
                                className={`brand-item ${selection.make === make ? 'selected' : ''}`}
                                onClick={() => handleSelect('make', make)}
                            >
                                <BrandLogo make={make} size={selection.make === make ? 48 : 40} />
                                <span>{make}</span>
                            </div>
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className="animate-in">
                        <div className="model-grid">
                            {getModelsForMake(selection.make).map(model => (
                                <div
                                    key={model}
                                    className={`model-card ${selection.model === model ? 'selected' : ''}`}
                                    onClick={() => {
                                        handleSelect('model', model);
                                        setTimeout(() => setStep(3), 300);
                                    }}
                                >
                                    <span style={{ fontSize: '1rem' }}>{model}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-back-link" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, padding: '10px 0' }}>← Change Brand</button>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-form animate-in">
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <PremiumSelect
                                    label="Registration Year"
                                    value={selection.year}
                                    onChange={val => handleSelect('year', val)}
                                    options={Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(y => ({
                                        value: y, label: y
                                    }))}
                                    placeholder="Select Year"
                                    error={errors.year}
                                />
                            </div>
                            <div className="form-group flex-1">
                                <PremiumSelect
                                    label="City"
                                    value={selection.city}
                                    onChange={val => handleSelect('city', val)}
                                    options={CITIES.map(c => ({ value: c, label: c }))}
                                    placeholder="Select City"
                                    error={errors.city}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Fuel Type</label>
                            <div className="chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {FUEL_TYPES.map(f => (
                                    <div
                                        key={f}
                                        className={`chip ${selection.fuel === f ? 'active' : ''}`}
                                        onClick={() => handleSelect('fuel', f)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: selection.fuel === f ? 'var(--primary)' : 'var(--bg-surface)',
                                            color: selection.fuel === f ? 'white' : 'var(--text-main)',
                                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                        }}
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Transmission</label>
                            <div className="chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {TRANSMISSIONS.map(t => (
                                    <div
                                        key={t}
                                        className={`chip ${selection.transmission === t ? 'active' : ''}`}
                                        onClick={() => handleSelect('transmission', t)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: selection.transmission === t ? 'var(--primary)' : 'var(--bg-surface)',
                                            color: selection.transmission === t ? 'white' : 'var(--text-main)',
                                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                        }}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleNextStep(4)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="wizard-form animate-in">
                        <div className="form-group">
                            <label className="form-label">Kilometers Driven</label>
                            <input
                                type="number"
                                className={`form-control premium-input ${errors.kms ? 'error' : ''}`}
                                placeholder="e.g. 45000"
                                value={selection.kms}
                                onChange={e => handleSelect('kms', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ownership Status</label>
                            <div className="chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {OWNERS.map(o => (
                                    <div
                                        key={o}
                                        className={`chip ${selection.owner === o ? 'active' : ''}`}
                                        onClick={() => handleSelect('owner', o)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: selection.owner === o ? 'var(--primary)' : 'var(--bg-surface)',
                                            color: selection.owner === o ? 'white' : 'var(--text-main)',
                                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                        }}
                                    >
                                        {o}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="wizard-actions">
                            <button className="btn btn-outline" onClick={() => setStep(3)}>Back</button>
                            <button
                                className="btn btn-primary btn-glow"
                                onClick={calculateValuation}
                            >
                                {loading ? 'Analyzing Market...' : 'Get Instant Valuation'}
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <ValuationResult
                        selection={selection}
                        result={result}
                        onReset={handleReset}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="valuation-wizard-container">
            <div className={`wizard-card glass-panel ${step === 5 ? 'result-view' : ''}`}>
                {step < 5 && (
                    <div className="wizard-header">
                        <button className="exit-btn" onClick={() => setShowCancelModal(true)} title="Exit Valuation">×</button>
                        <div className="wizard-progress">
                            {steps.slice(0, 4).map(s => (
                                <div key={s.id} className={`progress-step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                                    <div className="step-circle">{step > s.id ? '✓' : s.id}</div>
                                    <span className="step-label">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="wizard-body" style={{ padding: step === 5 ? 0 : 'clamp(20px, 5vw, 40px)' }}>
                    {step < 5 && <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--secondary)', marginBottom: '32px', textAlign: 'center' }}>{steps[step - 1].title}</h2>}
                    {renderStep()}
                </div>
            </div>

            <ConfirmModal
                isOpen={showCancelModal}
                title="Cancel Valuation?"
                message="Your progress will be lost. Are you sure you want to exit?"
                onConfirm={() => navigate('/')}
                onCancel={() => setShowCancelModal(false)}
                type="warning"
                confirmText="Yes, Exit"
                cancelText="Stay"
            />
        </div>
    );
};

export default ValuationWizard;
