
import React from 'react';
import ListingsGrid from './ListingsGrid';
import { useWishlist } from './WishlistContext';

const SavedCars = () => {
    const { wishlist, clearWishlist } = useWishlist();

    return (
        <div className="container" style={{ padding: '40px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>My Shortlist</h1>
                {wishlist.length > 0 && <button className="btn btn-outline" onClick={clearWishlist}>Clear All</button>}
            </div>
            <ListingsGrid cars={wishlist} loading={false} />
        </div>
    );
};

export default SavedCars;
