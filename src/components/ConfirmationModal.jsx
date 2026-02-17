import React from 'react';
import '../styles/admin_action_modal.css';

const ConfirmationModal = ({ isOpen, title, message, confirmText, type, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="admin-action-modal-overlay">
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
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
