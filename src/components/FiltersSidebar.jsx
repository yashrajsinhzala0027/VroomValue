import React, { useState, useMemo, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPrice from './AnimatedPrice';
import {
    MAKES, FUEL_TYPES, TRANSMISSIONS, CITIES, BODY_TYPES,
    COLORS, FEATURES, SEATS, OWNERS, YEARS
} from '../utils/constants';
import { formatPriceShort } from '../utils/formatters';
import BrandLogo from './BrandLogo';

const FilterAccordion = memo(({ title, children, isOpen, onToggle }) => {
    return (
        <div className="filter-group" style={{ marginBottom: 0, borderBottom: '1px solid var(--border)' }}>
            <button
                className={`filter-accordion-header ${isOpen ? 'open' : ''}`}
                onClick={onToggle}
                style={{ background: 'transparent', transition: 'all 0.2s', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', border: 'none', cursor: 'pointer' }}
            >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h4>
                <span className="filter-accordion-icon" style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>▼</span>
            </button>
            <div className={`filter-accordion-content ${isOpen ? 'open' : ''}`} style={{
                maxHeight: isOpen ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div className="accordion-inner-wrapper" style={{ padding: '0 0 20px 0' }}>
                    {children}
                </div>
            </div>
        </div>
    );
});

const FiltersSidebar = ({ filters, onChange, onClose, className = "" }) => {
    const [localMin, setLocalMin] = useState(filters.minPrice || 0);
    const [localMax, setLocalMax] = useState(filters.maxPrice || 7000000);

    // Sync with prop changes (like reset)
    useEffect(() => {
        setLocalMin(Number(filters.minPrice) || 0);
    }, [filters.minPrice]);

    useEffect(() => {
        setLocalMax(Number(filters.maxPrice) || 7000000);
    }, [filters.maxPrice]);

    const handleCommit = (name, value) => {
        onChange(name, value);
    };

    const [openSections, setOpenSections] = useState({
        price: true,
        kms: true,
        brands: true,
        year: true,
        fuel: true,
        body: true,
        transmission: true,
        color: false,
        features: false,
        seats: false,
        owner: false
    });

    const [brandSearch, setBrandSearch] = useState("");

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckboxChange = (category, value) => {
        const currentValues = filters[category] || [];
        let newValues;
        if (currentValues.includes(value)) {
            newValues = currentValues.filter(item => item !== value);
        } else {
            newValues = [...currentValues, value];
        }
        onChange(category, newValues);
    };

    const filteredMakes = useMemo(() => {
        if (!brandSearch) return MAKES;
        return MAKES.filter(make =>
            make.toLowerCase().includes(brandSearch.toLowerCase())
        );
    }, [brandSearch]);

    return (
        <aside className="filters-panel" style={{ borderRight: '1px solid var(--border)' }}>
            <div className="filters-panel-inner" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }} className="desktop-only">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--secondary)', letterSpacing: '1px' }}>SYSTEM FILTERS</h3>
                    <button
                        onClick={() => onChange('reset', true)}
                        className="btn-text"
                        style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 8px', borderRadius: '4px', background: 'var(--primary-glow)', border: 'none', cursor: 'pointer' }}
                    >
                        Clear All
                    </button>
                </div>

                {/* Price Range */}
                <div className="filter-group" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', fontWeight: 700 }}>Price Range</h4>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 800, color: 'var(--secondary)', fontSize: '1.2rem' }}>
                        <AnimatedPrice value={localMin} />
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem', opacity: 0.7 }}>to</span>
                        <AnimatedPrice value={localMax} />
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <div className="dual-slider-container">
                            <div className="slider-track-active-area">
                                <div className="slider-track-bg" style={{ background: 'var(--border)' }}></div>
                                <div className="slider-track-fill" style={{
                                    background: 'var(--primary)',
                                    left: `${(localMin / 7000000) * 100}%`,
                                    width: `${((localMax - localMin) / 7000000) * 100}%`
                                }}></div>
                            </div>

                            <input type="range" name="minPrice" min="0" max="7000000" step="10000"
                                value={localMin}
                                onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax - 100000))}
                                onMouseUp={() => handleCommit('minPrice', localMin)}
                                onTouchEnd={() => handleCommit('minPrice', localMin)}
                                className={`dual-range-thumb ${localMin > 3500000 ? 'thumb-z-index-2' : 'thumb-z-index-1'}`}
                            />
                            <input type="range" name="maxPrice" min="0" max="7000000" step="10000"
                                value={localMax}
                                onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin + 100000))}
                                onMouseUp={() => handleCommit('maxPrice', localMax)}
                                onTouchEnd={() => handleCommit('maxPrice', localMax)}
                                className={`dual-range-thumb ${localMin > 3500000 ? 'thumb-z-index-1' : 'thumb-z-index-2'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Brands + Models */}
                <FilterAccordion title="Brands + Models" isOpen={openSections.brands} onToggle={() => toggleSection('brands')}>
                    <input
                        type="text"
                        placeholder="Search brand inventory..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="filter-search-input"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 16px', fontSize: '0.85rem', width: '100%', marginBottom: '16px' }}
                    />
                    <div className="checkbox-group" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                        {filteredMakes.map(make => (
                            <label key={make} className="checkbox-label" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="make"
                                    checked={(filters.make || []).includes(make)}
                                    onChange={() => handleCheckboxChange('make', make)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                <BrandLogo make={make} size={28} />
                                <span style={{ fontWeight: (filters.make || []).includes(make) ? 800 : 500, transition: 'all 0.2s' }}>{make}</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* KM Driven */}
                <FilterAccordion title="Kms Driven" isOpen={openSections.kms} onToggle={() => toggleSection('kms')}>
                    <div className="checkbox-group">
                        {[10000, 30000, 50000, 75000, 100000, 125000, 150000].map(km => (
                            <label key={km} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.maxKms || []).includes(km.toString())}
                                    onChange={() => handleCheckboxChange('maxKms', km.toString())}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {km.toLocaleString()} kms or less
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Year */}
                <FilterAccordion title="Year" isOpen={openSections.year} onToggle={() => toggleSection('year')}>
                    <div className="checkbox-group">
                        {YEARS.map(year => (
                            <label key={year} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.year || []).includes(year.toString())}
                                    onChange={() => handleCheckboxChange('year', year.toString())}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {year} & above
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Fuel Type */}
                <FilterAccordion title="Fuel Type" isOpen={openSections.fuel} onToggle={() => toggleSection('fuel')}>
                    <div className="checkbox-group">
                        {FUEL_TYPES.map(fuel => (
                            <label key={fuel} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.fuel || []).includes(fuel)}
                                    onChange={() => handleCheckboxChange('fuel', fuel)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {fuel}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Body Type */}
                <FilterAccordion title="Body Type" isOpen={openSections.body} onToggle={() => toggleSection('body')}>
                    <div className="checkbox-group">
                        {BODY_TYPES.map(type => (
                            <label key={type} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.bodyType || []).includes(type)}
                                    onChange={() => handleCheckboxChange('bodyType', type)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {type}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Transmission */}
                <FilterAccordion title="Transmission" isOpen={openSections.transmission} onToggle={() => toggleSection('transmission')}>
                    <div className="checkbox-group">
                        {TRANSMISSIONS.map(trans => (
                            <label key={trans} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.transmission || []).includes(trans)}
                                    onChange={() => handleCheckboxChange('transmission', trans)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {trans}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Color */}
                <FilterAccordion title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')}>
                    <div className="color-swatch-grid">
                        {COLORS.map(c => (
                            <div
                                key={c.name}
                                className={`color-swatch ${(filters.color || []).includes(c.name) ? 'selected' : ''}`}
                                style={{ backgroundColor: c.code }}
                                title={c.name}
                                onClick={() => handleCheckboxChange('color', c.name)}
                            />
                        ))}
                    </div>
                </FilterAccordion>

                {/* Features */}
                <FilterAccordion title="Features" isOpen={openSections.features} onToggle={() => toggleSection('features')}>
                    <div className="checkbox-group">
                        {FEATURES.map(f => (
                            <label key={f} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.features || []).includes(f)}
                                    onChange={() => handleCheckboxChange('features', f)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {f}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Seats */}
                <FilterAccordion title="Seats" isOpen={openSections.seats} onToggle={() => toggleSection('seats')}>
                    <div className="checkbox-group">
                        {SEATS.map(s => (
                            <label key={s} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.seats || []).includes(s)}
                                    onChange={() => handleCheckboxChange('seats', s)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {s}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Owner */}
                <FilterAccordion title="Owner" isOpen={openSections.owner} onToggle={() => toggleSection('owner')}>
                    <div className="checkbox-group">
                        {OWNERS.map(o => (
                            <label key={o} className="checkbox-label" style={{ marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.owner || []).includes(o)}
                                    onChange={() => handleCheckboxChange('owner', o)}
                                    style={{ display: 'none' }}
                                />
                                <span className="checkbox-premium"></span>
                                {o}
                            </label>
                        ))}
                    </div>
                </FilterAccordion>
            </div> {/* end filters-panel-inner */}
        </aside>
    );
};

export default memo(FiltersSidebar);
