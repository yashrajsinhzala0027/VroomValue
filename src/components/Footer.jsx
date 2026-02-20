
import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import '../styles/layout.css';

const Footer = () => {
    return (
        <footer className="app-footer" style={{ background: 'var(--secondary)', color: 'white', padding: '80px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container">
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', marginBottom: '60px' }}>
                    <div className="footer-col brand-col" style={{ gridColumn: 'span 2' }}>
                        <Link to="/" className="footer-logo-link" style={{ display: 'inline-block', marginBottom: '24px', textDecoration: 'none' }}>
                            <BrandLogo size={160} className="footer-logo-invert" />
                        </Link>
                        <p className="footer-description" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontSize: '1.05rem', maxWidth: '400px' }}>
                            India's most authoritative AI-driven marketplace for certified pre-owned vehicles. Building the future of automotive trust and transparency.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700 }}>Marketplace</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/listings" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Browse Inventory</Link>
                            <Link to="/listings?isAuction=true" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Live Auctions</Link>
                            <Link to="/valuation" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>AI Valuation Engine</Link>
                            <Link to="/sell" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Instant Sale Tool</Link>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700 }}>Engagement</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/contact" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Support Center</Link>
                            <Link to="/faq" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Safety & Trust</Link>
                            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}>Governance & Privacy</Link>
                        </div>
                    </div>

                    <div className="footer-col contact-col">
                        <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700 }}>Concierge</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>1800-VROOM-VV</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>concierge@vroomvalue.pro</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>DLF CyberCity, Gurgaon</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                    <div className="copyright">
                        &copy; {new Date().getFullYear()} VroomValue Automotive Pro (India).
                    </div>
                    <div className="footer-socials" style={{ display: 'flex', gap: '24px' }}>
                        <span>LinkedIn</span>
                        <span>Twitter</span>
                        <span>Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
