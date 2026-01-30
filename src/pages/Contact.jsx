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
        <div className="container" style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>
                    Contact Us
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>📞 Phone</h3>
                        <p style={{ color: 'var(--text-main)' }}>1800-123-4567</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mon-Sat, 9 AM - 7 PM</p>
                    </div>
                    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>✉️ Email</h3>
                        <p style={{ color: 'var(--text-main)' }}>support@VroomValue.in</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We reply within 24 hours</p>
                    </div>
                    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>📍 Address</h3>
                        <p style={{ color: 'var(--text-main)' }}>Ahmedabad, Gujarat</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>India</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Send us a Message</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
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
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                required
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
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label className="form-label">Message</label>
                        <textarea
                            name="message"
                            className="form-control"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px', fontSize: '1rem', fontWeight: 700 }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
