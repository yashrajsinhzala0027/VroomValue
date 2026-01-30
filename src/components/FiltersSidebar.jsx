import React, { useState, useMemo, memo } from 'react';
import {
    MAKES, FUEL_TYPES, TRANSMISSIONS, CITIES, BODY_TYPES,
    COLORS, FEATURES, SEATS, OWNERS, YEARS
} from '../utils/constants';
import { formatPriceShort } from '../utils/formatters';

const FilterAccordion = memo(({ title, children, isOpen, onToggle }) => {
    return (
        <div className="filter-group" style={{ marginBottom: 0, borderBottom: '1px solid #f1f5f9' }}>
            <button
                className={`filter-accordion-header ${isOpen ? 'open' : ''}`}
                onClick={onToggle}
            >
                <h4>{title}</h4>
                <span className="filter-accordion-icon">▼</span>
            </button>
            <div className={`filter-accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="accordion-inner-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
});

const FiltersSidebar = ({ filters, onChange, className = "" }) => {
    // State for Accordions (all open by default or specific ones)
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

    // Filter Brands based on search - Memoized for performance
    const filteredMakes = useMemo(() => {
        if (!brandSearch) return MAKES;
        return MAKES.filter(make =>
            make.toLowerCase().includes(brandSearch.toLowerCase())
        );
    }, [brandSearch]);

    return (
        <aside className={`filters-panel ${className}`} style={{ paddingRight: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Filters</h3>
                <button
                    onClick={() => onChange('reset', true)}
                    className="btn-text"
                    style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                    Reset All
                </button>
            </div>

            {/* Price Range (Always Visible) */}
            <div className="filter-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                <h4 style={{ marginBottom: '4px' }}>Price Range</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                    <span>₹{formatPriceShort(filters.minPrice || 50000)}</span>
                    <span>₹{formatPriceShort(filters.maxPrice || 7000000)}</span>
                </div>

                <div style={{ marginTop: '4px' }}>
                    <div className="dual-slider-container">
                        <div className="slider-track-active-area">
                            <div className="slider-track-bg"></div>
                            <div className="slider-track-fill" style={{
                                left: `${((filters.minPrice || 50000) / 7000000) * 100}%`,
                                width: `${(((filters.maxPrice || 7000000) - (filters.minPrice || 50000)) / 7000000) * 100}%`
                            }}></div>
                        </div>

                        <input type="range" name="minPrice" min="0" max="7000000" step="50000"
                            value={filters.minPrice || 50000}
                            onChange={(e) => onChange('minPrice', Math.min(Number(e.target.value), (filters.maxPrice || 7000000) - 100000))}
                            className={`dual-range-thumb ${(filters.minPrice || 50000) > 3500000 ? 'thumb-z-index-2' : 'thumb-z-index-1'}`}
                        />
                        <input type="range" name="maxPrice" min="0" max="7000000" step="50000"
                            value={filters.maxPrice || 7000000}
                            onChange={(e) => onChange('maxPrice', Math.max(Number(e.target.value), (filters.minPrice || 50000) + 100000))}
                            className={`dual-range-thumb ${(filters.minPrice || 50000) > 3500000 ? 'thumb-z-index-1' : 'thumb-z-index-2'}`}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                    <span>Minimum</span>
                    <span>Maximum</span>
                </div>
            </div>

            {/* Brands + Models */}
            <FilterAccordion title="Brands + Models" isOpen={openSections.brands} onToggle={() => toggleSection('brands')}>
                <input
                    type="text"
                    placeholder="Search Brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="filter-search-input"
                />
                <div className="checkbox-group" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                    {filteredMakes.map(make => (
                        <label key={make} className="checkbox-label" style={{ marginBottom: '8px' }}>
                            <input
                                type="checkbox"
                                name="make"
                                checked={(filters.make || []).includes(make)}
                                onChange={() => handleCheckboxChange('make', make)}
                                style={{ display: 'none' }}
                            />
                            <span className="checkbox-premium"></span>
                            {make}
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

        </aside>
    );
};

export default memo(FiltersSidebar);
