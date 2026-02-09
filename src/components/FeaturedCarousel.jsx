
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
                if (Array.isArray(all)) {
                    // Prioritize Auctions and Certified cars for "Trending"
                    const auctions = all.filter(c => c.auction && c.auction.isAuction && c.status === 'approved');
                    const certified = all.filter(c => c.certified === 1 && !auctions.includes(c) && c.status === 'approved');
                    const others = all.filter(c => !auctions.includes(c) && !certified.includes(c) && c.status === 'approved').slice(0, 5);

                    setTrendingCars([...auctions, ...certified, ...others].slice(0, 8)); // Show top 8
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
                        <div key={n}>
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
