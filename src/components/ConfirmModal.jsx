
import React, { useEffect, useState } from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "OK", cancelText = "Cancel", type = "danger" }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onCancel}>
            <div className={`modal-content ${isOpen ? 'active' : ''} type-${type}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">
                    {type === 'danger' ? '⚠️' : type === 'warning' ? '🔔' : '✔️'}
                </div>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="btn btn-outline" onClick={onCancel}>{cancelText}</button>
                    <button className={`btn ${type === 'danger' ? 'btn-primary' : 'btn-success'}`} onClick={onConfirm} style={{ minWidth: '100px' }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
