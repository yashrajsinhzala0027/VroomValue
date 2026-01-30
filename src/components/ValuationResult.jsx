import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../utils/formatters';

const ValuationResult = ({ selection, result, onReset }) => {
    const navigate = useNavigate();

    if (!result) return null;

    const handleSellNow = () => {
        // Pass all gathered data to the sell form
        navigate('/sell', {
            state: {
                prefill: {
                    ...selection,
                    // Map owner string to expected format if needed, but SellCarForm handles it
                    priceINR: result.fairPrice // Suggest fair price as starting point
                }
            }
        });
    };

    return (
        <div className="valuation-result-card animate-in">
            <div className="result-header">
                <span className="car-name-large">
                    {selection.year} {selection.make} {selection.model}
                </span>
                <p className="car-subtitle">
                    {selection.fuel} • {selection.transmission} • {selection.kms?.toLocaleString()} KMs • {selection.owner}
                </p>
                <div className="valuation-badge">Estimated Market Value</div>
            </div>

            <div className="price-display-box">
                <div className="price-item">
                    <span className="price-label">VroomValue Range</span>
                    <div className="price-range-large">
                        <span className="price-val">{formatPriceINR(result.fairPrice)}</span>
                        <span className="price-sep">-</span>
                        <span className="price-val highlight">{formatPriceINR(result.goodPrice)}</span>
                    </div>
                </div>
            </div>

            <div className="valuation-insights">
                <div className="insight-item">
                    <span className="icon">⚡</span>
                    <p>Demand for <strong>{selection.model}</strong> is high in <strong>{selection.city}</strong>. You can get a great deal today!</p>
                </div>
                <div className="insight-item">
                    <span className="icon">🛡️</span>
                    <p>Price includes <strong>VroomValue Assurance</strong> and free doorstep documentation.</p>
                </div>
            </div>

            <p className="result-disclaimer">
                *Final offer price depends on physical inspection by our experts.
            </p>

            <div className="result-actions">
                <button
                    className="btn btn-primary btn-xl btn-glow"
                    onClick={handleSellNow}
                >
                    Sell to VroomValue at This Price
                </button>
                <div className="secondary-actions">
                    <button className="btn btn-outline" onClick={onReset}>
                        Check Another Car
                    </button>
                    <button className="btn btn-link" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValuationResult;
