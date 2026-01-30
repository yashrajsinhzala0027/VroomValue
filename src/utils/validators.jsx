
import { EXCLUDED_BRANDS, EXCLUDED_MODELS, MAKES } from './constants';

export const isLuxuryBrand = (make, model = "") => {
    if (!make) return false;
    // Check exact make match
    const isExcludedMake = EXCLUDED_BRANDS.some(
        brand => brand.toLowerCase() === make.toLowerCase()
    );
    if (isExcludedMake) return true;

    // Check excluded models (optional)
    if (model) {
        const isExcludedModel = EXCLUDED_MODELS.some(
            m => m.toLowerCase().includes(model.toLowerCase())
        );
        if (isExcludedModel) return true;
    }

    return false;
};

export const validateListing = (data) => {
    const errors = {};

    if (!data.make) errors.make = "Make is required";
    if (!data.model) errors.model = "Model is required";
    if (!data.variant) errors.variant = "Variant (e.g. VXI) is required";

    if (isLuxuryBrand(data.make, data.model)) {
        errors.make = "We do not list luxury brands or high-end premium models on this platform.";
    }

    if (!data.priceINR || data.priceINR <= 0) errors.priceINR = "Valid price is required";
    if (data.kms === undefined || data.kms === '') errors.kms = "Kms driven is required";
    if (!data.engineCapacity) errors.engineCapacity = "Engine capacity (CC) is required";
    if (!data.year || data.year < 2000 || data.year > new Date().getFullYear()) {
        errors.year = "Please enter a valid year";
    }

    // Check images (At least front photo required for initial validation)
    if (!data.images || data.images.length < 1) {
        errors.images = "Please upload car photos.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
