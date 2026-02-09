import React, { useState } from 'react';
import { useToast } from '../components/Toasts';

const Contact = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addToast("Thank you! We'll get back to you within 24 hours.", "success");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container" style={{ padding: 'clamp(80px, 12vw, 120px) 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3rem)', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1 }}>
                    Contact Us
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: 'var(--text-muted)', marginBottom: 'clamp(32px, 8vw, 50px)' }}>
                    Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: 'clamp(32px, 8vw, 60px)' }}>
                    <div style={{ padding: '24px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📞 Phone</h3>
                        <p style={{ color: 'var(--text-main)', fontWeight: 700 }}>1800-123-4567</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mon-Sat, 9 AM - 7 PM</p>
                    </div>
                    <div style={{ padding: '24px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✉️ Email</h3>
                        <p style={{ color: 'var(--text-main)', fontWeight: 700 }}>support@VroomValue.in</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>We reply within 24 hours</p>
                    </div>
                    <div style={{ padding: '24px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Address</h3>
                        <p style={{ color: 'var(--text-main)', fontWeight: 700 }}>Ahmedabad, Gujarat</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>India</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 900, marginBottom: '24px', color: 'var(--secondary)' }}>Send us a Message</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ padding: '14px', borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ padding: '14px', borderRadius: '12px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={{ padding: '14px', borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="form-control"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={{ padding: '14px', borderRadius: '12px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label className="form-label">Message</label>
                        <textarea
                            name="message"
                            className="form-control"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={{ resize: 'vertical', padding: '16px', borderRadius: '16px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '1.1rem', fontWeight: 800 }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
