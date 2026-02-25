import React, { useState, useMemo, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPrice from './AnimatedPrice';
import {
    MAKES, FUEL_TYPES, TRANSMISSIONS, CITIES, BODY_TYPES,
    COLORS, FEATURES, SEATS, OWNERS, YEARS
} from '../utils/constants';
import { formatPriceShort } from '../utils/formatters';
import BrandLogo from './BrandLogo';
import { MODEL_TO_MAKE_MAP } from '../utils/modelMapping';

// Invert the map for grouping
const MAKE_TO_MODELS_MAP = {};
Object.entries(MODEL_TO_MAKE_MAP).forEach(([model, make]) => {
    if (!MAKE_TO_MODELS_MAP[make]) MAKE_TO_MODELS_MAP[make] = [];
    MAKE_TO_MODELS_MAP[make].push(model);
});

const FilterAccordion = memo(({ title, children, isOpen, onToggle }) => {
    return (
        <div className="filter-group" style={{ marginBottom: 0, borderBottom: '1px solid var(--border)' }}>
            <button
                className={`filter-accordion-header ${isOpen ? 'open' : ''}`}
                onClick={onToggle}
                style={{ background: 'transparent', transition: 'all 0.2s', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', border: 'none', cursor: 'pointer' }}
            >
                <h4 className="filter-accordion-title">{title}</h4>
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
    const [expandedBrands, setExpandedBrands] = useState({});

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
            <div className="filters-panel-inner" style={{ padding: 'clamp(12px, 2vw, 20px)' }}>
                <div className="filter-sidebar-header desktop-only">
                    <h3>System Filters</h3>
                    <button
                        onClick={() => onChange('reset', true)}
                        className="btn-text"
                        style={{
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: 'var(--primary-glow)',
                            border: '1px solid var(--primary-glow)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Clear All
                    </button>
                </div>

                {/* Price Range */}
                <div className="filter-group" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
                    <h4 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>Price Range</h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, color: 'var(--secondary)', fontSize: '1.25rem' }}>
                        <AnimatedPrice value={localMin} />
                        <AnimatedPrice value={localMax} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div className="dual-slider-container">
                            <div className="slider-track-active-area">
                                <div className="slider-track-bg" style={{ background: '#F1F5F9' }}></div>
                                <div className="slider-track-fill" style={{
                                    background: 'var(--primary)',
                                    left: `${(localMin / 7000000) * 100}%`,
                                    width: `${((localMax - localMin) / 7000000) * 100}%`,
                                    height: '3px'
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

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 500 }}>Minimum</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 500 }}>Maximum</span>
                        </div>
                    </div>
                </div>

                {/* Brands + Models */}
                <FilterAccordion title="Brands + Models" isOpen={openSections.brands} onToggle={() => toggleSection('brands')}>
                    <div className="reference-search-wrapper">
                        <input
                            type="text"
                            placeholder="Search"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className="reference-search-input"
                        />
                        <span className="search-icon-right">🔍</span>
                    </div>

                    <span className="category-label">Top Brands</span>

                    <div className="checkbox-group" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                        {filteredMakes.map(make => {
                            const isBrandSelected = (filters.make || []).includes(make);
                            const brandModels = MAKE_TO_MODELS_MAP[make] || [];
                            const isExpanded = expandedBrands[make];
                            const selectedModels = filters.model || [];

                            return (
                                <div key={make}>
                                    <div
                                        className="brand-list-item"
                                        onClick={() => handleCheckboxChange('make', make)}
                                    >
                                        <div className="brand-item-label">
                                            <input
                                                type="checkbox"
                                                name="make"
                                                checked={isBrandSelected}
                                                onChange={() => { }} // Handled by parent div
                                                style={{ display: 'none' }}
                                            />
                                            <span className="minimal-checkbox"></span>
                                            <span className="brand-item-name">{make}</span>
                                        </div>

                                        {brandModels.length > 0 && (
                                            <span
                                                className={`brand-chevron ${isExpanded ? 'expanded' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedBrands(prev => ({ ...prev, [make]: !prev[make] }));
                                                }}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && brandModels.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                style={{ overflow: 'hidden', background: 'var(--bg-main)' }}
                                            >
                                                <div style={{ paddingLeft: '34px', paddingBottom: '12px', display: 'flex', flexDirection: 'column' }}>
                                                    {brandModels.map(model => (
                                                        <div
                                                            key={model}
                                                            className="brand-list-item"
                                                            style={{ borderBottom: 'none', padding: '12px 0' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCheckboxChange('model', model);
                                                            }}
                                                        >
                                                            <div className="brand-item-label">
                                                                <input
                                                                    type="checkbox"
                                                                    name="model"
                                                                    checked={selectedModels.includes(model)}
                                                                    onChange={() => { }} // Handled by parent div
                                                                    style={{ display: 'none' }}
                                                                />
                                                                <span className="minimal-checkbox" style={{ border: '1.5px solid var(--text-muted)', opacity: 0.6 }}></span>
                                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: selectedModels.includes(model) ? 700 : 400 }}>{model}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </FilterAccordion>

                {/* KM Driven */}
                <FilterAccordion title="Kms Driven" isOpen={openSections.kms} onToggle={() => toggleSection('kms')}>
                    <div className="checkbox-group">
                        {[10000, 30000, 50000, 75000, 100000, 125000, 150000].map(km => (
                            <label key={km} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.maxKms || []).includes(km.toString())}
                                    onChange={() => handleCheckboxChange('maxKms', km.toString())}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.maxKms || []).includes(km.toString()) ? 700 : 500 }}>
                                    {km.toLocaleString()} kms or less
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Year */}
                <FilterAccordion title="Year" isOpen={openSections.year} onToggle={() => toggleSection('year')}>
                    <div className="checkbox-group">
                        {YEARS.map(year => (
                            <label key={year} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.year || []).includes(year.toString())}
                                    onChange={() => handleCheckboxChange('year', year.toString())}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.year || []).includes(year.toString()) ? 700 : 500 }}>
                                    {year} & above
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Fuel Type */}
                <FilterAccordion title="Fuel Type" isOpen={openSections.fuel} onToggle={() => toggleSection('fuel')}>
                    <div className="checkbox-group">
                        {FUEL_TYPES.map(fuel => (
                            <label key={fuel} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.fuel || []).includes(fuel)}
                                    onChange={() => handleCheckboxChange('fuel', fuel)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.fuel || []).includes(fuel) ? 700 : 500 }}>{fuel}</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Body Type */}
                <FilterAccordion title="Body Type" isOpen={openSections.body} onToggle={() => toggleSection('body')}>
                    <div className="checkbox-group">
                        {BODY_TYPES.map(type => (
                            <label key={type} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.bodyType || []).includes(type)}
                                    onChange={() => handleCheckboxChange('bodyType', type)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.bodyType || []).includes(type) ? 700 : 500 }}>{type}</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Transmission */}
                <FilterAccordion title="Transmission" isOpen={openSections.transmission} onToggle={() => toggleSection('transmission')}>
                    <div className="checkbox-group">
                        {TRANSMISSIONS.map(trans => (
                            <label key={trans} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.transmission || []).includes(trans)}
                                    onChange={() => handleCheckboxChange('transmission', trans)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.transmission || []).includes(trans) ? 700 : 500 }}>{trans}</span>
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
                            <label key={f} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.features || []).includes(f)}
                                    onChange={() => handleCheckboxChange('features', f)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.features || []).includes(f) ? 700 : 500 }}>{f}</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Seats */}
                <FilterAccordion title="Seats" isOpen={openSections.seats} onToggle={() => toggleSection('seats')}>
                    <div className="checkbox-group">
                        {SEATS.map(s => (
                            <label key={s} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.seats || []).includes(s)}
                                    onChange={() => handleCheckboxChange('seats', s)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.seats || []).includes(s) ? 700 : 500 }}>{s} Seats</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>

                {/* Owner */}
                <FilterAccordion title="Owner" isOpen={openSections.owner} onToggle={() => toggleSection('owner')}>
                    <div className="checkbox-group">
                        {OWNERS.map(o => (
                            <label key={o} className="checkbox-label" style={{ padding: '4px 0' }}>
                                <input
                                    type="checkbox"
                                    checked={(filters.owner || []).includes(o)}
                                    onChange={() => handleCheckboxChange('owner', o)}
                                    style={{ display: 'none' }}
                                />
                                <span className="minimal-checkbox"></span>
                                <span style={{ fontSize: '0.9rem', fontWeight: (filters.owner || []).includes(o) ? 700 : 500 }}>{o}</span>
                            </label>
                        ))}
                    </div>
                </FilterAccordion>
            </div> {/* end filters-panel-inner */}
        </aside>
    );
};

export default memo(FiltersSidebar);
