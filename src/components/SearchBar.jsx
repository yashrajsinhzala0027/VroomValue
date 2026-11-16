import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, MAKES } from '../utils/constants';
import CustomSelect from './CustomSelect';
import AnimatedPrice from './AnimatedPrice';
import { Search } from 'lucide-react';

const SearchBar = ({ className = '', vertical = false }) => {
    const navigate = useNavigate();
    const cityId    = useId();
    const makeId    = useId();
    const minPriceId = useId();
    const maxPriceId = useId();

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
        ? { gridTemplateColumns: '1fr', gap: '20px' }
        : { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' };

    return (
        <form
            className={`search-widget ${className}`}
            onSubmit={handleSearch}
            style={{ ...gridStyles, background: 'transparent', padding: 0, boxShadow: 'none' }}
            role="search"
            aria-label="Car search"
        >
            {/* City */}
            <div className="search-field">
                <label htmlFor={cityId} className="search-field-label">Search City</label>
                <CustomSelect
                    id={cityId}
                    name="city"
                    value={search.city}
                    options={CITIES}
                    onChange={handleChange}
                    placeholder="All India"
                    searchable={true}
                />
            </div>

            {/* Brand */}
            <div className="search-field">
                <label htmlFor={makeId} className="search-field-label">Brand Preference</label>
                <CustomSelect
                    id={makeId}
                    name="make"
                    value={search.make}
                    options={MAKES}
                    onChange={handleChange}
                    placeholder="All Brands"
                    searchable={true}
                />
            </div>

            {/* Budget Range */}
            <div className="search-field">
                <div className="budget-header">
                    <label className="search-field-label">Budget</label>
                    <div className="budget-display">
                        <AnimatedPrice value={search.minPrice} />
                        <span className="budget-sep">–</span>
                        <AnimatedPrice value={search.maxPrice} />
                    </div>
                </div>

                <div className="dual-slider-container">
                    <div className="slider-track-active-area">
                        <div className="slider-track-bg" />
                        <div
                            className="slider-track-fill"
                            style={{
                                left:  `${(search.minPrice / 7000000) * 100}%`,
                                width: `${((search.maxPrice - search.minPrice) / 7000000) * 100}%`
                            }}
                        />
                    </div>

                    <input
                        id={minPriceId}
                        type="range"
                        name="minPrice"
                        min="0"
                        max="7000000"
                        step="10000"
                        value={search.minPrice}
                        aria-label="Minimum budget"
                        aria-valuemin={0}
                        aria-valuemax={7000000}
                        aria-valuenow={search.minPrice}
                        onChange={(e) => handlePriceChange('minPrice', Math.min(Number(e.target.value), search.maxPrice - 100000))}
                        className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-2' : 'thumb-z-index-1'}`}
                    />
                    <input
                        id={maxPriceId}
                        type="range"
                        name="maxPrice"
                        min="0"
                        max="7000000"
                        step="10000"
                        value={search.maxPrice}
                        aria-label="Maximum budget"
                        aria-valuemin={0}
                        aria-valuemax={7000000}
                        aria-valuenow={search.maxPrice}
                        onChange={(e) => handlePriceChange('maxPrice', Math.max(Number(e.target.value), search.minPrice + 100000))}
                        className={`dual-range-thumb ${search.minPrice > 3500000 ? 'thumb-z-index-1' : 'thumb-z-index-2'}`}
                    />
                </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary search-submit-btn">
                <Search size={18} />
                Explore Now
            </button>
        </form>
    );
};

export default SearchBar;
