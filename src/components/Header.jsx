import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useWishlist } from './WishlistContext';
import BrandLogo from './BrandLogo';
import {
    Menu, X, Heart, ChevronDown, LogOut, LayoutDashboard,
    Gavel, BarChart3, Car, DollarSign, BookMarked, User
} from 'lucide-react';
import '../styles/layout.css';

const NAV_LINKS = [
    { to: '/listings',              label: 'Buy Car',    icon: Car },
    { to: '/listings?isAuction=true', label: 'Auctions', icon: Gavel },
    { to: '/valuation',             label: 'Valuation',  icon: BarChart3 },
    { to: '/sell',                  label: 'Sell',       icon: DollarSign },
];

const Header = () => {
    const { currentUser, logout } = useAuth();
    const { wishlist } = useWishlist();
    const location = useLocation();
    const navigate = useNavigate();

    const [isScrolled,    setIsScrolled]    = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileOpen,  setIsMobileOpen]  = useState(false);

    // ── Scroll listener ──
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── Close dropdown on outside click ──
    useEffect(() => {
        const onOutside = (e) => {
            if (isDropdownOpen && !e.target.closest('.user-nav-dropdown-wrapper')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [isDropdownOpen]);

    // ── Body scroll lock when mobile nav open ──
    useEffect(() => {
        document.body.classList.toggle('nav-open', isMobileOpen);
        return () => document.body.classList.remove('nav-open');
    }, [isMobileOpen]);

    // ── Close mobile nav on route change ──
    useEffect(() => {
        setIsMobileOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname, location.search]);

    const isActive = useCallback((path, exact = false) => {
        if (exact) return location.pathname === path;
        if (path.includes('?')) {
            const [p, q] = path.split('?');
            return location.pathname === p && location.search.includes(q.split('=')[1]);
        }
        return location.pathname === path && !location.search.includes('isAuction');
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsDropdownOpen(false);
            setIsMobileOpen(false);
            window.location.href = '/';
        }
    };

    return (
        <>
            <header className={`app-header ${isScrolled ? 'scrolled' : ''}`} role="banner">
                <div className="container header-inner">
                    {/* ── Logo ── */}
                    <Link to="/" className="header-logo-link" aria-label="VroomValue home">
                        <BrandLogo size={165} />
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="header__nav" aria-label="Main navigation">
                        <div className="header__links-group">
                            {NAV_LINKS.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`header__link ${isActive(to) ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        <div className="header__actions-group">
                            <Link
                                to="/saved"
                                className={`header__link header-shortlist-link ${isActive('/saved', true) ? 'active' : ''}`}
                            >
                                <Heart size={15} />
                                Shortlist
                                {wishlist.length > 0 && (
                                    <span className="header__badge">{wishlist.length}</span>
                                )}
                            </Link>

                            {currentUser ? (
                                <div className="user-nav-dropdown-wrapper">
                                    <button
                                        className="user-profile-trigger-btn"
                                        onClick={() => setIsDropdownOpen(prev => !prev)}
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <div className="user-avatar-circle">
                                            {(currentUser.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="user-name-text">
                                            {(currentUser.name || 'User').split(' ')[0]}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`user-dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                className="user-dropdown-menu"
                                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="dropdown-profile-header">
                                                    <div className="user-dropdown-name">{currentUser.name}</div>
                                                    <div className="user-dropdown-email">{currentUser.email}</div>
                                                </div>
                                                <div className="dropdown-links">
                                                    <Link to="/my-bids" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                                        <Gavel size={15} /> My Bids
                                                    </Link>
                                                    <Link to="/saved" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                                        <BookMarked size={15} /> Shortlist ({wishlist.length})
                                                    </Link>
                                                    {currentUser.role === 'admin' && (
                                                        <Link to="/admin" className="dropdown-item admin-link" onClick={() => setIsDropdownOpen(false)}>
                                                            <LayoutDashboard size={15} /> Admin Dashboard
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="dropdown-footer">
                                                    <button onClick={handleLogout} className="dropdown-logout-btn">
                                                        <LogOut size={14} /> Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="auth-nav-container">
                                    <Link to="/login" className="header__link header-login-btn">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="btn btn-primary header-signup-btn">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* ── Mobile: Shortlist + Hamburger ── */}
                    <div className="mobile-header-actions">
                        <Link to="/saved" className="mobile-heart-btn" aria-label={`Shortlist (${wishlist.length})`}>
                            <Heart size={20} />
                            {wishlist.length > 0 && (
                                <span className="mobile-badge">{wishlist.length}</span>
                            )}
                        </Link>
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileOpen(prev => !prev)}
                            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileOpen}
                            aria-controls="mobile-nav"
                        >
                            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            onClick={() => setIsMobileOpen(false)}
                            aria-hidden="true"
                        />
                        {/* Drawer */}
                        <motion.nav
                            id="mobile-nav"
                            className="mobile-menu-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                            aria-label="Mobile navigation"
                        >
                            <div className="mobile-drawer-header">
                                <Link to="/" onClick={() => setIsMobileOpen(false)}>
                                    <BrandLogo size={140} />
                                </Link>
                                <button
                                    className="mobile-drawer-close"
                                    onClick={() => setIsMobileOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {currentUser && (
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar">
                                        {(currentUser.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="mobile-user-name">{currentUser.name}</div>
                                        <div className="mobile-user-email">{currentUser.email}</div>
                                    </div>
                                </div>
                            )}

                            <div className="mobile-nav-links">
                                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <Icon size={18} />
                                        {label}
                                    </Link>
                                ))}

                                {currentUser && (
                                    <>
                                        <div className="mobile-nav-divider" />
                                        <Link
                                            to="/my-bids"
                                            className="mobile-nav-link"
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            <Gavel size={18} /> My Bids
                                        </Link>
                                        {currentUser.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="mobile-nav-link"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <LayoutDashboard size={18} /> Admin
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mobile-drawer-footer">
                                {currentUser ? (
                                    <button className="btn btn-outline btn-block" onClick={handleLogout}>
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                ) : (
                                    <div className="mobile-auth-btns">
                                        <Link to="/login" className="btn btn-outline btn-block" onClick={() => setIsMobileOpen(false)}>
                                            Login
                                        </Link>
                                        <Link to="/signup" className="btn btn-primary btn-block" onClick={() => setIsMobileOpen(false)}>
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
