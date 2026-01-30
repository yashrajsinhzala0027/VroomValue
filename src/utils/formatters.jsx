
/**
 * Formats a number as Indian Currency (INR)
 * e.g., 500000 -> ₹5,00,000
 */
export const formatPriceINR = (price) => {
    if (price === null || price === undefined) return "₹0";
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
};

export const formatPriceShort = (price) => {
    if (price === null || price === undefined) return "0";
    if (price >= 10000000) {
        return `${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (price >= 100000) {
        return `${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
    if (price >= 1000) {
        return `${(price / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `${price}`;
};

/**
 * Formats kilometers with commas
 * e.g., 25000 -> 25,000 km
 */
export const formatKm = (km) => {
    if (km === null || km === undefined) return "0 km";
    return new Intl.NumberFormat('en-IN').format(km) + " km";
};

/**
 * Capitalizes string
 */
export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};
