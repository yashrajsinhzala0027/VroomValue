
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './Toasts';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { addToast } = useToast();

    // Load from local storage on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('VroomValue_saved') || '[]');
        setWishlist(saved);
    }, []);

    // Sync to local storage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('VroomValue_saved', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (car) => {
        if (wishlist.find(c => c.id === car.id)) return;
        setWishlist([...wishlist, car]);
        addToast('Added to shortlist', 'success');
    };

    const removeFromWishlist = (carId) => {
        setWishlist(wishlist.filter(c => c.id !== carId));
        addToast('Removed from shortlist', 'info');
    };

    const toggleWishlist = (car) => {
        if (wishlist.find(c => c.id === car.id)) {
            removeFromWishlist(car.id);
        } else {
            addToWishlist(car);
        }
    };

    const isInWishlist = (carId) => {
        return wishlist.some(c => c.id === carId);
    };

    const clearWishlist = () => {
        setWishlist([]);
        addToast('Shortlist cleared', 'info');
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
