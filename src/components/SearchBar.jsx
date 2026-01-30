import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, MAKES } from '../utils/constants';
import CustomSelect from './CustomSelect';
import { formatPriceShort } from '../utils/formatters';

const SearchBar = ({ className = "", vertical = false }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState({
        city: '',
        make: '',
        minPrice: 50000,
        maxPrice: 7000000
    });

    const handleChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handlePriceChange = (name, value) => {
        setSearch(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.city) params.append('city', search.city);
        if (search.make) params.append('make', search.make);
        params.append('minPrice', search.minPrice);
        params.append('maxPrice', search.maxPrice);

        navigate(`/listings?${params.toString()}`);
    };

    const gridStyles = vertical
        ? { gridTemplateColumns: '1fr', gap: '24px' }
        : { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' };

    return (
        <form className={`search-widget ${className}`} onSubmit={handleSearch} style={gridStyles}>
            <div className="search-field">
                <label>City</label>
                <CustomSelect
                    name="city"
                    value={search.city}
                    options={CITIES}
                    onChange={handleChange}
                    placeholder="All Cities"
                    searchable={true}
                />
            </div>

            <div className="search-field">
                <label>Make</label>
                <CustomSelect
                    name="make"
                    value={search.make}
                    options={MAKES}
                    onChange={handleChange}
                    placeholder="All Makes"
                    searchable={true}
                />
            </div>

            <div className="search-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ marginBottom: 0, fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Budget</label>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.2px' }}>
                        ₹{formatPriceShort(search.minPrice)} - ₹{formatPriceShort(search.maxPrice)}
                    </span>
                </div>

                <div style={{ marginTop: '4px' }}>
                    <div className="dual-slider-container">
                        <div className="slider-track-active-area">
                            <div className="slider-track-bg"></div>
                            <div className="slider-track-fill" style={{
                                left: `${(search.minPrice / 7000000) * 100}%`,
                                width: `${((search.maxPrice - search.minPrice) / 7000000) * 100}%`
                            }}></div>
                        </div>

                        <input type="range" name="minPrice" min="0" max="7000000" step="50000"
                            value={search.minPrice}
                            onChange={(e) => handlePriceChange('minPrice', Math.min(Number(e.target.value), search.maxPrice - 100000))}
                            className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-2' : 'thumb-z-index-1'}`}
                        />
                        <input type="range" name="maxPrice" min="0" max="7000000" step="50000"
                            value={search.maxPrice}
                            onChange={(e) => handlePriceChange('maxPrice', Math.max(Number(e.target.value), search.minPrice + 100000))}
                            className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-1' : 'thumb-z-index-2'}`}
                        />
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '52px', borderRadius: '12px', width: '100%' }}>
                Search Cars
            </button>
        </form>
    );
};

export default SearchBar;
