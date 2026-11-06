
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../api/mockApi';
import CarCard from './CarCard';
import { CarCardSkeleton } from './SkeletonLoader';

const FeaturedCarousel = () => {
    const [trendingCars, setTrendingCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrending = async () => {
            try {
                const all = await getCars();
                if (Array.isArray(all) && all.length > 0) {
                    // Prioritize Auctions and Certified cars for "Trending"
                    const auctions = all.filter(c => c?.auction?.isAuction && (!c.status || c.status === 'approved'));
                    const certified = all.filter(c => (c.certified === 1 || c.certified === true) && !auctions.includes(c) && (!c.status || c.status === 'approved'));
                    const others = all.filter(c => !auctions.includes(c) && !certified.includes(c) && (!c.status || c.status === 'approved'));

                    const curated = [...auctions, ...certified, ...others];
                    setTrendingCars(curated.length > 0 ? curated.slice(0, 8) : all.slice(0, 8));
                }
            } catch (err) {
                console.error("Failed to load trending cars:", err);
            } finally {
                setLoading(false);
            }
        };
        loadTrending();
    }, []);

    if (loading) {
        return (
            <div className="container section">
                <div className="carousel-header">
                    <h2>Hot Deals & Live Auctions</h2>
                </div>
                <div className="trending-slider">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="trending-slider-item">
                            <CarCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="container section">
            <div className="carousel-header">
                <div>
                    <h2>Hot Deals & Live Auctions</h2>
                    <p>Bids ending soon • Certified Fresh Arrivals</p>
                </div>
                <Link to="/listings" className="section-link">
                    View Inventory &rarr;
                </Link>
            </div>

            <div className="trending-slider">
                {trendingCars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCarousel;
