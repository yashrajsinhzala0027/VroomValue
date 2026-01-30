
import React, { useState, useEffect } from 'react';

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toastCount = React.useRef(0);

    const addToast = React.useCallback((message, type = 'info') => {
        const id = `${Date.now()}-${toastCount.current++}`;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container" style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`} style={{
                        padding: '12px 20px',
                        background: t.type === 'error' ? '#dc3545' : t.type === 'success' ? '#28a745' : '#333',
                        color: 'white',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '0.9rem',
                        animation: 'fadeIn 0.3s'
                    }}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => React.useContext(ToastContext);
