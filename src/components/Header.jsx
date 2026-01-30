
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useWishlist } from './WishlistContext';
import BrandLogo from './BrandLogo';
import '../styles/layout.css';

const Header = () => {
    const { currentUser, logout, login } = useAuth();
    const { wishlist } = useWishlist();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogin = () => {
        // Simple mock login for demo
        const email = prompt("Enter email to login (use 'admin' in email for admin role):", "user@example.com");
        if (email) login(email);
    };

    return (
        <header className="app-header">
            <div className="container header-inner">
                <Link to="/" className="logo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 0,
                    height: '60px',
                    width: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img
                        src="/assets/logo.png"
                        alt="VroomValue"
                        style={{
                            height: '240px',
                            width: 'auto',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'contain'
                        }}
                    />
                </Link>

                <nav className={`header__nav ${isMobileMenuOpen ? 'mobile-active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/listings" className={`header__link ${isActive('/listings') && !location.search.includes('isAuction')}`}>Buy Car</Link>
                    <Link to="/listings?isAuction=true" className={`header__link ${location.search.includes('isAuction') ? 'active' : ''}`}>Auctions <span className="header__badge-hot">🔥</span></Link>
                    <Link to="/valuation" className={`header__link ${isActive('/valuation')}`}>Check Valuation</Link>
                    <Link to="/sell" className={`header__link ${isActive('/sell')}`}>Sell Car</Link>
                    <Link to="/saved" className={`header__link header__link-with-badge ${isActive('/saved')}`}>
                        Saved {wishlist.length > 0 && <span className="header__badge">{wishlist.length}</span>}
                    </Link>

                    {currentUser ? (
                        <>
                            {currentUser.role === 'admin' && <Link to="/admin" className={`header__link admin-link ${isActive('/admin')}`}>Admin Area</Link>}
                            <Link to="/my-bids" className={`header__link bids-link ${isActive('/my-bids')}`} style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>My Bids</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '10px' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Hi, {currentUser.name}</span>
                                <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', borderRadius: '50px' }} onClick={logout}>LOGOUT</button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px', marginLeft: '12px' }}>
                            <Link to="/login" className="header__link">Login</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    style={{ display: 'none' }} /* Visible via CSS in responsive.css usually */
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    Menu
                </button>
            </div>
        </header>
    );
};

export default Header;
