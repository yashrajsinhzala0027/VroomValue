import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, MAKES } from '../utils/constants';
import CustomSelect from './CustomSelect';
import { formatPriceShort } from '../utils/formatters';
import AnimatedPrice from './AnimatedPrice';

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
        <form className={`search-widget ${className}`} onSubmit={handleSearch} style={{ ...gridStyles, background: 'transparent', padding: 0, boxShadow: 'none' }}>
            <div className="search-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Search City</label>
                <CustomSelect
                    name="city"
                    value={search.city}
                    options={CITIES}
                    onChange={handleChange}
                    placeholder="All India"
                    searchable={true}
                />
            </div>

            <div className="search-field">
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Brand Preference</label>
                <CustomSelect
                    name="make"
                    value={search.make}
                    options={MAKES}
                    onChange={handleChange}
                    placeholder="All Brands"
                    searchable={true}
                />
            </div>

            <div className="search-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ marginBottom: 0, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Budget</label>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AnimatedPrice value={search.minPrice} />
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, opacity: 0.6 }}>-</span>
                        <AnimatedPrice value={search.maxPrice} />
                    </div>
                </div>

                <div style={{ marginTop: '4px', marginBottom: '12px' }}>
                    <div className="dual-slider-container">
                        <div className="slider-track-active-area">
                            <div className="slider-track-bg" style={{ background: 'var(--border)' }}></div>
                            <div className="slider-track-fill" style={{
                                background: 'var(--primary)',
                                left: `${(search.minPrice / 7000000) * 100}%`,
                                width: `${((search.maxPrice - search.minPrice) / 7000000) * 100}%`
                            }}></div>
                        </div>

                        <input type="range" name="minPrice" min="0" max="7000000" step="10000"
                            value={search.minPrice}
                            onChange={(e) => handlePriceChange('minPrice', Math.min(Number(e.target.value), search.maxPrice - 100000))}
                            className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-2' : 'thumb-z-index-1'}`}
                        />
                        <input type="range" name="maxPrice" min="0" max="7000000" step="10000"
                            value={search.maxPrice}
                            onChange={(e) => handlePriceChange('maxPrice', Math.max(Number(e.target.value), search.minPrice + 100000))}
                            className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-1' : 'thumb-z-index-2'}`}
                        />
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '56px', borderRadius: '12px', width: '100%', fontSize: '1rem', fontWeight: 800 }}>
                EXPLORE NOW
            </button>
        </form>
    );
};

export default SearchBar;
