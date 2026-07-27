import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { Linkedin, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import '../styles/layout.css';

const MARKETPLACE_LINKS = [
    { to: '/listings',                  label: 'Browse Inventory' },
    { to: '/listings?isAuction=true',   label: 'Live Auctions' },
    { to: '/valuation',                  label: 'AI Valuation' },
    { to: '/sell',                       label: 'Sell Your Car' },
];

const SUPPORT_LINKS = [
    { to: '/contact', label: 'Support Center' },
    { to: '/faq',     label: 'Safety & Trust' },
    { to: '/terms',   label: 'Privacy & Terms' },
];

const SOCIALS = [
    { icon: Linkedin,  label: 'LinkedIn',  href: '#' },
    { icon: Twitter,   label: 'Twitter',   href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
];

const Footer = () => (
    <footer className="app-footer" role="contentinfo">
        <div className="container">
            <div className="footer-grid">
                {/* ── Brand Column ── */}
                <div className="footer-col footer-brand-col">
                    <Link to="/" className="footer-logo-link" aria-label="VroomValue home">
                        <BrandLogo size={160} className="footer-logo-invert" />
                    </Link>
                    <p className="footer-description">
                        India's most authoritative AI-driven marketplace for certified pre-owned vehicles.
                        Building the future of automotive trust and transparency.
                    </p>
                    <div className="footer-socials">
                        {SOCIALS.map(({ icon: Icon, label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                className="footer-social-btn"
                                aria-label={label}
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* ── Marketplace Links ── */}
                <div className="footer-col">
                    <h3 className="footer-col-heading">Marketplace</h3>
                    <nav className="footer-link-list" aria-label="Marketplace links">
                        {MARKETPLACE_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className="footer-link">{label}</Link>
                        ))}
                    </nav>
                </div>

                {/* ── Support Links ── */}
                <div className="footer-col">
                    <h3 className="footer-col-heading">Support</h3>
                    <nav className="footer-link-list" aria-label="Support links">
                        {SUPPORT_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className="footer-link">{label}</Link>
                        ))}
                    </nav>
                </div>

                {/* ── Concierge ── */}
                <div className="footer-col">
                    <h3 className="footer-col-heading">Concierge</h3>
                    <div className="footer-contact-list">
                        <div className="footer-contact-item">
                            <Phone size={15} />
                            <span className="footer-phone">1800-VROOM-VV</span>
                        </div>
                        <div className="footer-contact-item">
                            <Mail size={15} />
                            <span>concierge@vroomvalue.pro</span>
                        </div>
                        <div className="footer-contact-item">
                            <MapPin size={15} />
                            <span>DLF CyberCity, Gurgaon</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="footer-bottom">
                <p className="footer-copyright">
                    &copy; {new Date().getFullYear()} VroomValue Automotive Pro (India). All rights reserved.
                </p>
                <div className="footer-bottom-links">
                    <Link to="/terms" className="footer-link">Terms</Link>
                    <Link to="/faq" className="footer-link">Privacy</Link>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
