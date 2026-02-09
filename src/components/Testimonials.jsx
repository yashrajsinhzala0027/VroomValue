
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
        <section className="section" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)' }}>
            <div className="container">
                <div className="features-header">
                    <h2>What India Says</h2>
                    <p>Join 15,000+ happy families moving with VroomValue</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass-panel testimonial-card">
                            <div className="rating-stars">
                                {"★".repeat(t.rating)}
                            </div>
                            <p className="testimonial-text">
                                "{t.text}"
                            </p>
                            <div className="testimonial-user">
                                <div className="user-avatar" style={{
                                    background: `hsl(${210 + (i * 30)}, 70%, 90%)`,
                                    color: `hsl(${210 + (i * 30)}, 70%, 40%)`
                                }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div className="user-info">
                                    <h4>{t.name}</h4>
                                    <span>{t.location}</span>
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
