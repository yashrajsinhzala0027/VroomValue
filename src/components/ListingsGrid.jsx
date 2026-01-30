
import React from 'react';
import CarCard from './CarCard';
import SkeletonCard from './SkeletonCard';

const ListingsGrid = ({ cars, loading }) => {
    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
        );
    }

    if (!cars || cars.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px' }}>
                <h3>No cars found</h3>
                <p style={{ color: '#666' }}>Try adjusting your filters to see more results.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {cars.map(car => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
};

export default ListingsGrid;
