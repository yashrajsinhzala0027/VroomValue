import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
        const arrayFilters = ['make', 'model', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];

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


    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 12;

    useEffect(() => {
        let isCurrent = true;
        setLoading(true);

        const searchParams = new URLSearchParams(location.search);
        const currentSort = searchParams.get('sort') || 'relevance';
        const pageParam = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(pageParam);

        // Build fresh filters directly from URL to avoid stale state
        const freshFilters = {};
        const arrayFilters = ['make', 'model', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];

        arrayFilters.forEach(key => {
            const values = searchParams.getAll(key);
            if (values.length > 0) freshFilters[key] = values;
        });

        searchParams.forEach((val, key) => {
            if (!arrayFilters.includes(key) && !['sort', 'page', 'sort_direction'].includes(key) && val) {
                freshFilters[key] = val;
            }
        });

        getCars(freshFilters)
            .then(data => {
                if (!isCurrent) return;

                let results = Array.isArray(data) ? data : [];

                // Ultra-Robust Number Parser
                const parseNum = (val) => {
                    if (typeof val === 'number') return val;
                    if (!val) return 0;
                    const cleaned = val.toString().replace(/[^0-9.]/g, '');
                    return Number(cleaned) || 0;
                };

                // Apply Sorting
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.error("Failed to fetch cars:", err);
                if (isCurrent) {
                    setCars([]);
                    setLoading(false);
                }
            });

        return () => { isCurrent = false; };
    }, [location.search]);

    const handleFilterChange = React.useCallback((name, value) => {
        const params = new URLSearchParams(location.search);
        if (name === 'reset') {
            navigate('/listings');
            return;
        }

        const arrayFilters = ['make', 'model', 'fuel', 'bodyType', 'transmission', 'color', 'features', 'seats', 'owner', 'maxKms', 'year'];
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

    const startIndex = (currentPage - 1) * carsPerPage;
    const paginatedCars = cars.slice(startIndex, startIndex + carsPerPage);
    const totalPages = Math.ceil(cars.length / carsPerPage);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`/listings?${params.toString()}`, { replace: true });
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isSidebarOpen]);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="filters-overlay active"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1090 }}
                ></div>
            )}

            <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '60px' }} className="page-enter">
                <div className="container listings-layout">
                    <FiltersSidebar
                        className={isSidebarOpen ? 'active' : ''}
                        filters={filters}
                        onChange={handleFilterChange}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    <div className="listings-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
                            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>HOME</Link>
                            <span style={{ color: 'var(--border)' }}>/</span>
                            <span style={{ color: 'var(--primary)' }}>LISTINGS</span>
                        </div>

                        <div className="listings-header">
                            <div>
                                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, color: 'var(--secondary)', marginBottom: '8px', lineHeight: 1 }}>
                                    {filters.isAuction === 'true' ? 'Live Auctions' : 'Premium Inventory'}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {filters.isAuction === 'true'
                                        ? `Showing ${cars.length} vehicles with active bidding`
                                        : `Showing ${cars.length} elite certified vehicles`}
                                </p>
                            </div>
                            <div className="desktop-only" style={{ width: '280px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Sort Logistics</div>
                                <CustomSelect
                                    name="sort"
                                    value={sortBy}
                                    options={sortOptions}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>

                        <ListingsGrid cars={paginatedCars} loading={loading} />

                        {/* Pro Pagination Bar */}
                        {!loading && totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '48px',
                                padding: 'clamp(16px, 4vw, 24px)',
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border)'
                            }}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{ padding: '8px 16px', borderRadius: '8px', flex: '1 1 auto', maxWidth: '120px' }}
                                >
                                    &larr; Prev
                                </button>

                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (totalPages > 5 && Math.abs(p - currentPage) > 1 && p !== 1 && p !== totalPages) {
                                            if (p === 2 || p === totalPages - 1) return <span key={p} style={{ alignSelf: 'center' }}>...</span>;
                                            return null;
                                        }
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                style={{
                                                    minWidth: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: currentPage === p ? 'var(--primary)' : 'var(--border)',
                                                    background: currentPage === p ? 'var(--primary)' : 'transparent',
                                                    color: currentPage === p ? 'white' : 'var(--text-main)',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className="btn btn-outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '8px 16px', borderRadius: '8px', flex: '1 1 auto', maxWidth: '120px' }}
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Listings;
