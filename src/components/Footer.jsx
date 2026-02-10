
import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import '../styles/layout.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo-link" style={{ display: 'inline-block', marginBottom: '24px', textDecoration: 'none' }}>
                            <BrandLogo size={140} className="footer-logo-invert" />
                        </Link>
                        <p className="footer-description">
                            India's premier digital marketplace for certified pre-owned vehicles. Experience trust, transparency, and high-intelligence commerce.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link to="/listings">Browse Inventory</Link>
                        <Link to="/listings?isAuction=true">Live Auctions</Link>
                        <Link to="/valuation">Valuation Engine</Link>
                        <Link to="/sell">Sell Your Vehicle</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="/contact">Partner with Us</Link>
                        <Link to="/faq">Safety & Trust</Link>
                        <Link to="/terms">Privacy Policy</Link>
                    </div>

                    <div className="footer-col contact-col">
                        <h4>Contact</h4>
                        <p className="contact-phone">1800-VROOM-VV</p>
                        <p className="contact-email">concierge@vroomvalue.pro</p>
                        <p className="contact-hq">HQ: DLF CyberCity, Gurgaon</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} VroomValue Pro (India). Engineered for the future of mobility.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
