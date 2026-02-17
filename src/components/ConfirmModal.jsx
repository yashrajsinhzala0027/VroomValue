import React, { useEffect, useState } from 'react';
import '../styles/admin_action_modal.css';

const ConfirmModal = ({ isOpen, title, message, confirmText, type, onConfirm, onCancel }) => {
    // Animation state
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActive(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setActive(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !active) return null;

    return (
        <div className={`admin-action-modal-overlay ${isOpen ? 'active' : ''}`}>
            <div className="admin-action-modal-content">
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                    {type === 'danger' ? '⚠️' : type === 'warning' ? '🔨' : '✨'}
                </div>
                <h3 className="admin-action-modal-title">{title}</h3>
                <p className="admin-action-modal-message">{message}</p>
                <div className="admin-action-modal-buttons">
                    <button onClick={onCancel} className="admin-action-btn cancel">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`admin-action-btn confirm ${type === 'danger' ? 'dangerous' : ''}`}
                    >
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
