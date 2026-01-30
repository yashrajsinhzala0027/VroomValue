
import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="car-card skeleton" style={{ pointerEvents: 'none' }}>
            <div className="card-img-wrapper" style={{ background: '#eee' }}></div>
            <div className="card-content">
                <div style={{ height: '24px', background: '#eee', marginBottom: '10px', width: '70%' }}></div>
                <div style={{ height: '16px', background: '#eee', marginBottom: '8px', width: '40%' }}></div>
                <div style={{ height: '20px', background: '#eee', marginTop: 'auto', width: '50%' }}></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
