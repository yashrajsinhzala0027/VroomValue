
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '180px', height: '60px', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
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
                        </div>
                        <p style={{ maxWidth: '250px' }}>India's most trusted destination for buying and selling quality used cars.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <Link to="/listings">Buy a Car</Link>
                        <Link to="/sell">Sell Your Car</Link>
                        <Link to="/saved">Shortlisted</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/faq">FAQs</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p>1800-123-4567</p>
                        <p>support@vroomvalue.in</p>
                    </div>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                    &copy; {new Date().getFullYear()} VroomValue India Pvt Ltd. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
