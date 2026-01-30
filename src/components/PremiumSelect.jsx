import React, { useState, useRef, useEffect } from 'react';

const PremiumSelect = ({ label, value, options, onChange, placeholder = "Select Option", error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="premium-select-container" ref={dropdownRef}>
            <label className="form-label">{label}</label>
            <div
                className={`premium-select-trigger ${isOpen ? 'active' : ''} ${error ? 'error' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || placeholder}</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`select-arrow ${isOpen ? 'open' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {isOpen && (
                <div className="premium-select-options">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`premium-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PremiumSelect;
