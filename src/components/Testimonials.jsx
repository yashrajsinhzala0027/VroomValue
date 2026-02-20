
import React from 'react';

const testimonials = [
    {
        name: "Rahul Sharma",
        location: "Mumbai",
        text: "The 140-point inspection report gave me total peace of mind. Bought a Honda City and it drives like new. Highly recommended!",
        rating: 5
    },
    {
        name: "Priya Patel",
        location: "Ahmedabad",
        text: "Sold my Swift in 2 hours flat. The auction process was transparent and I got a price higher than generic dealers offered.",
        rating: 5
    },
    {
        name: "Vikram Singh",
        location: "Delhi",
        text: "VroomValue's valuation engine is scary accurate. Got the exact fair market price for my Creta without any haggling.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="section" style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>What India Says</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Join 15,000+ happy families moving with VroomValue</p>
                </div>

                <div className="pro-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="rating-stars" style={{ color: '#f59e0b', fontSize: '1.25rem' }}>
                                {"★".repeat(t.rating)}
                            </div>
                            <p className="testimonial-text" style={{ fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic', color: 'var(--text-main)' }}>
                                "{t.text}"
                            </p>
                            <div className="testimonial-user" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                <div className="user-avatar" style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: `hsl(${210 + (i * 30)}, 70%, 90%)`,
                                    color: `hsl(${210 + (i * 30)}, 70%, 40%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '1.2rem'
                                }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div className="user-info">
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{t.name}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
