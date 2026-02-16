
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useWishlist } from './WishlistContext';
import BrandLogo from './BrandLogo';
import '../styles/layout.css';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const { wishlist } = useWishlist();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.user-nav-dropdown-wrapper')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <BrandLogo size={165} />
                </Link>

                <nav className="header__nav">
                    <div className="header__links-group">
                        <Link to="/listings" className={`header__link ${isActive('/listings') && !location.search.includes('isAuction')}`}>Buy Car</Link>
                        <Link to="/listings?isAuction=true" className={`header__link ${location.search.includes('isAuction') ? 'active' : ''}`}>Auctions</Link>
                        <Link to="/valuation" className={`header__link ${isActive('/valuation')}`}>Valuation</Link>
                        <Link to="/sell" className={`header__link ${isActive('/sell')}`}>Sell</Link>
                    </div>

                    <div className="header__actions-group">
                        <Link to="/saved" className={`header__link ${isActive('/saved')}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Shortlist {wishlist.length > 0 && <span className="header__badge">{wishlist.length}</span>}
                        </Link>

                        {currentUser ? (
                            <div className="user-nav-dropdown-wrapper">
                                <button
                                    className="user-profile-trigger"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        background: 'var(--bg-main)', border: '1px solid var(--border)', cursor: 'pointer',
                                        padding: '6px 16px', borderRadius: 'var(--radius-full)',
                                        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'var(--primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.85rem',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {(currentUser.name || 'U').charAt(0)}
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                        {(currentUser.name || 'User').split(' ')[0]}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transition: 'transform 0.3s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="user-dropdown-menu fade-in-up">
                                        <div className="dropdown-profile-header">
                                            <div className="user-dropdown-name">{currentUser.name}</div>
                                            <div className="user-dropdown-email">{currentUser.email}</div>
                                        </div>
                                        <div className="dropdown-links">
                                            <Link to="/my-bids" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>My Bids</Link>
                                            <Link to="/saved" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Shortlist ({wishlist.length})</Link>
                                            {currentUser.role === 'admin' && (
                                                <Link to="/admin" className="dropdown-item admin-link" onClick={() => setIsDropdownOpen(false)}>Admin Dashboard</Link>
                                            )}
                                        </div>
                                        <div className="dropdown-footer">
                                            <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="dropdown-logout-btn">
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Link
                                    to="/login"
                                    className="header__link login-btn"
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                        fontWeight: 700,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn btn-primary signup-btn"
                                    style={{
                                        borderRadius: 'var(--radius-md)',
                                        padding: '10px 24px',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                                        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
