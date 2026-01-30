
import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ name, value, onChange, options, placeholder = "Select...", className = "", searchable = false, prefix = "", error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropUp, setDropUp] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) setSearchTerm("");
    }, [isOpen]);

    const toggleDropdown = () => {
        if (!isOpen) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setDropUp(spaceBelow < 280);
        }
        setIsOpen(!isOpen);
    };

    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt =>
        (typeof opt === 'object' ? opt.value : opt) === value
    );

    const displayLabel = selectedOption
        ? `${prefix}${typeof selectedOption === 'object' ? selectedOption.label : selectedOption}`
        : placeholder;

    const filteredOptions = options.filter(opt => {
        const label = typeof opt === 'object' ? opt.label : opt;
        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={`custom-select-container ${className}`} ref={containerRef}>
            <div
                className={`custom-select-header ${isOpen ? 'active' : ''} ${error ? 'error' : ''}`}
                onClick={toggleDropdown}
            >
                <span className={!value ? 'placeholder' : ''}>{displayLabel}</span>

                <div className="custom-select-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className={`custom-select-dropdown ${dropUp ? 'drop-up' : ''}`}>
                    {searchable && (
                        <div className="custom-select-search-wrapper">
                            <input
                                type="text"
                                className="custom-select-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="custom-select-options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => {
                                const optValue = typeof opt === 'object' ? opt.value : opt;
                                const optLabel = typeof opt === 'object' ? opt.label : opt;
                                const isSelected = value === optValue;

                                return (
                                    <div
                                        key={idx}
                                        className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelect(optValue)}
                                    >
                                        {optLabel}
                                        {isSelected && <span className="check-circle">✓</span>}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="custom-select-no-results">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
