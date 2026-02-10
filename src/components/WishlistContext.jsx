
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { addToast } = useToast();





    const { currentUser } = useAuth();

    // Load from local storage whenever currentUser changes
    useEffect(() => {
        if (currentUser) {
            // User logged in: Load their specific list
            const userKey = `VroomValue_wishlist_${currentUser.id}`;
            const saved = JSON.parse(localStorage.getItem(userKey) || '[]');
            setWishlist(saved);
        } else {
            // User logged out: Clear list or load guest list (optional, here we clear for security)
            setWishlist([]);
        }
    }, [currentUser]);

    // Sync to local storage whenever wishlist changes
    useEffect(() => {
        if (currentUser) {
            const userKey = `VroomValue_wishlist_${currentUser.id}`;
            localStorage.setItem(userKey, JSON.stringify(wishlist));
        }
    }, [wishlist, currentUser]);

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
