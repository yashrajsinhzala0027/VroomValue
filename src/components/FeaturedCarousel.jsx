
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../api/mockApi';
import CarCard from './CarCard';
import SkeletonCard from './SkeletonCard';

const FeaturedCarousel = () => {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const all = await getCars();
                const approved = Array.isArray(all) ? all.filter(c => c.status === 'approved') : [];
                // Pick 4 random
                const shuffled = [...approved].sort(() => 0.5 - Math.random()).slice(0, 4);
                setFeaturedCars(shuffled);
            } catch (err) {
                console.error("Failed to load featured cars:", err);
                setFeaturedCars([]);
            } finally {
                setLoading(false);
            }
        };
        loadFeatured();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Featured Cars</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                </div>
            </div>
        );
    }

    return (
        <section className="container" style={{ margin: '40px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Trending This Week</h2>
                    <p style={{ color: '#666' }}>Handpicked quality cars for you</p>
                </div>
                <Link to="/listings" className="text-primary" style={{ fontWeight: 600 }}>View All &rarr;</Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {featuredCars.map(car => (
                    <CarCard key={car.id} car={{ ...car, featured: true }} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCarousel;
