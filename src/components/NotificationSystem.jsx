
import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const mockEvents = [
        { type: 'BID', user: 'Ananya', car: 'BMW M340i', action: 'placed a new bid' },
        { type: 'VERIFY', city: 'Mumbai', action: 'New vehicle verified in' },
        { type: 'WISH', user: 'Rahul', car: 'Porsche 911', action: 'added to wishlist' },
        { type: 'SALE', user: 'Vikram', car: 'Audi RS5', action: 'just booked for inspection' }
    ];

    useEffect(() => {
        const showNext = () => {
            const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
            setNotification(event);
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        const interval = setInterval(() => {
            showNext();
        }, 15000); // Every 15 seconds

        // Initial delay
        const initial = setTimeout(showNext, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(initial);
        };
    }, []);

    if (!notification) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 9999,
            transform: isVisible ? 'translateX(0)' : 'translateX(-120%)',
            transition: 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
            pointerEvents: isVisible ? 'auto' : 'none'
        }}>
            <div className="glass-panel" style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                minWidth: '280px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}>
                    {notification.type === 'BID' ? '🎯' : notification.type === 'VERIFY' ? '✅' : notification.type === 'WISH' ? '❤️' : '⚡'}
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>
                        {notification.user || notification.city}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {notification.action} <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{notification.car}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSystem;
