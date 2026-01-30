
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/Toasts';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const { addToast } = useToast();

    const addToCompare = (car) => {
        if (compareList.find(c => c.id === car.id)) {
            addToast('Car already in compare list', 'info');
            return;
        }
        if (compareList.length >= 3) {
            addToast('You can compare max 3 cars', 'warning');
            return;
        }
        setCompareList([...compareList, car]);
        addToast('Added to compare', 'success');
    };

    const removeFromCompare = (carId) => {
        setCompareList(compareList.filter(c => c.id !== carId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
