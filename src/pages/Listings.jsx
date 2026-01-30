import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FiltersSidebar from '../components/FiltersSidebar';
import ListingsGrid from '../components/ListingsGrid';
import { getCars } from '../api/mockApi';
import CustomSelect from '../components/CustomSelect';

const Listings = () => {
    const location = useLocation();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [sortBy, setSortBy] = useState('relevance');

    const sortOptions = [
        { label: "Relevance", value: "relevance" },
        { label: "Price - Low to High", value: "price_asc" },
        { label: "Price - High to Low", value: "price_desc" },
        { label: "KM Driven - Low to High", value: "km_asc" },
        { label: "Year - New to Old", value: "year_desc" },
        { label: "Newest First", value: "newest" }
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const nextFilters = {};
        const arrayFilters = ['make', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];

        arrayFilters.forEach(key => {
            const values = searchParams.getAll(key);
            if (values.length > 0) nextFilters[key] = values;
        });

        searchParams.forEach((val, key) => {
            if (!arrayFilters.includes(key) && !['sort', 'page'].includes(key) && val) {
                nextFilters[key] = val;
            }
        });

        const sortParam = searchParams.get('sort');
        if (sortParam) setSortBy(sortParam);
        else setSortBy('relevance');

        setFilters(nextFilters);
    }, [location.search]);


    useEffect(() => {
        let isCurrent = true;
        setLoading(true);

        const searchParams = new URLSearchParams(location.search);
        const currentSort = searchParams.get('sort') || 'relevance';

        // Build fresh filters directly from URL to avoid stale state
        const freshFilters = {};
        const arrayFilters = ['make', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];

        arrayFilters.forEach(key => {
            const values = searchParams.getAll(key);
            if (values.length > 0) freshFilters[key] = values;
        });

        searchParams.forEach((val, key) => {
            if (!arrayFilters.includes(key) && !['sort', 'page', 'sort_direction'].includes(key) && val) {
                freshFilters[key] = val;
            }
        });

        getCars(freshFilters).then(data => {
            if (!isCurrent) return;

            // Backend already filters by status and auction
            let results = Array.isArray(data) ? data : [];

            // Ultra-Robust Number Parser (Strips ₹, commas, kms, etc.)
            const parseNum = (val) => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                const cleaned = val.toString().replace(/[^0-9.]/g, '');
                return Number(cleaned) || 0;
            };

            // Apply Sorting - Work on a fresh copy
            const sortedResults = [...results];

            switch (currentSort) {
                case 'price_asc':
                    sortedResults.sort((a, b) => parseNum(a.priceINR) - parseNum(b.priceINR));
                    break;
                case 'price_desc':
                    sortedResults.sort((a, b) => parseNum(b.priceINR) - parseNum(a.priceINR));
                    break;
                case 'km_asc':
                    sortedResults.sort((a, b) => parseNum(a.kms) - parseNum(b.kms));
                    break;
                case 'year_desc':
                    sortedResults.sort((a, b) => parseNum(b.year) - parseNum(a.year));
                    break;
                case 'newest':
                    sortedResults.sort((a, b) => parseNum(b.id) - parseNum(a.id));
                    break;
                default: // relevance
                    sortedResults.sort((a, b) => {
                        if (a.certified !== b.certified) return a.certified ? -1 : 1;
                        return parseNum(b.year) - parseNum(a.year);
                    });
            }

            setCars(sortedResults);
            setLoading(false);
        });

        return () => { isCurrent = false; };
    }, [location.search]); // Simplified: Only depend on location.search

    const handleFilterChange = React.useCallback((name, value) => {
        const params = new URLSearchParams(location.search);
        if (name === 'reset') {
            navigate('/listings');
            return;
        }

        const arrayFilters = ['make', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];
        if (arrayFilters.includes(name)) {
            params.delete(name);
            if (Array.isArray(value)) {
                value.forEach(v => params.append(name, v));
            }
        } else {
            if (value) params.set(name, value);
            else params.delete(name);
        }

        params.delete('page');
        navigate(`/listings?${params.toString()}`, { replace: true });
    }, [location.search, navigate]);

    const handleSortChange = React.useCallback((e) => {
        const params = new URLSearchParams(location.search);
        const val = e.target.value;
        if (val && val !== 'relevance') {
            params.set('sort', val);
        } else {
            params.delete('sort');
        }
        navigate(`/listings?${params.toString()}`, { replace: true });
    }, [location.search, navigate]);

    return (
        <div style={{ background: 'var(--bg-deep)' }}>
            <div className="container listings-layout">
                {/* Mobile Sidebar Toggle */}
                {/* Mobile Sidebar Toggle */}
                <div className="mobile-only" style={{ marginBottom: '20px' }}>
                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? 'Close Filters' : 'Show Filters'} 🌪️
                    </button>
                </div>

                <FiltersSidebar className={isSidebarOpen ? 'active' : ''} filters={filters} onChange={handleFilterChange} />

                <div className="listings-content">
                    {/* Breadcrumb Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}>
                        <a href="/" style={{
                            color: '#1f2937',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#1f2937'}
                        >
                            HOME
                        </a>
                        <span style={{ color: '#9ca3af' }}>›</span>
                        <a href="/listings" style={{
                            color: '#1f2937',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#1f2937'}
                        >
                            USED CARS
                        </a>
                        {filters.city && (
                            <>
                                <span style={{ color: '#9ca3af' }}>›</span>
                                <span style={{ color: '#9ca3af', textTransform: 'uppercase' }}>
                                    USED CARS IN {filters.city}
                                </span>
                            </>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.8rem', marginBottom: 0 }}>Used Cars <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>({cars.length} Found)</span></h2>
                        <div style={{ width: '260px' }}>
                            <CustomSelect
                                name="sort"
                                value={sortBy}
                                options={sortOptions}
                                onChange={handleSortChange}
                                prefix="Sort by : "
                            />
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {Object.keys(filters).length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            marginBottom: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => handleFilterChange('reset', true)}
                                style={{
                                    background: '#7c3aed',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#6d28d9'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#7c3aed'}
                            >
                                <span style={{ fontSize: '1.1rem' }}>↻</span> Clear All
                            </button>

                            {Object.entries(filters).map(([key, value]) => {
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                const values = Array.isArray(value) ? value : [value];
                                return values.map((val, idx) => (
                                    <div
                                        key={`${key}-${idx}`}
                                        style={{
                                            background: '#f3f4f6',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            color: '#1f2937',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>{val}</span>
                                        <button
                                            onClick={() => {
                                                if (Array.isArray(filters[key])) {
                                                    const newValues = filters[key].filter(v => v !== val);
                                                    handleFilterChange(key, newValues);
                                                } else {
                                                    handleFilterChange(key, '');
                                                }
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#6b7280',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                padding: 0,
                                                lineHeight: 1,
                                                fontWeight: 700
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ));
                            })}
                        </div>
                    )}

                    <ListingsGrid cars={cars} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Listings;
