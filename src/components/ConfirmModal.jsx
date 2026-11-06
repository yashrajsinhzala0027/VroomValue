import React, { useEffect, useState } from 'react';
import '../styles/admin_action_modal.css';
import { AlertTriangle, Gavel, CheckCircle2 } from 'lucide-react';

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
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    {type === 'danger' ? (
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={28} color="#ef4444" />
                        </div>
                    ) : type === 'warning' ? (
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Gavel size={28} color="#d97706" />
                        </div>
                    ) : (
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={28} color="#059669" />
                        </div>
                    )}
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
