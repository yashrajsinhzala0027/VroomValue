import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Rahul Sharma',
        location: 'Mumbai',
        text: 'The 140-point inspection report gave me total peace of mind. Bought a Honda City and it drives like new. Highly recommended!',
        rating: 5,
        hue: 210,
    },
    {
        name: 'Priya Patel',
        location: 'Ahmedabad',
        text: 'Sold my Swift in 2 hours flat. The auction process was transparent and I got a price higher than generic dealers offered.',
        rating: 5,
        hue: 150,
    },
    {
        name: 'Vikram Singh',
        location: 'Delhi',
        text: "VroomValue's valuation engine is scary accurate. Got the exact fair market price for my Creta without any haggling.",
        rating: 5,
        hue: 270,
    },
];

const Testimonials = () => (
    <section className="section testimonials-section" aria-labelledby="testimonials-heading">
        <div className="container">
            <motion.div
                className="section-header-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
                <h2 id="testimonials-heading">What India Says</h2>
                <p className="section-subtitle">
                    Join 15,000+ happy families moving with VroomValue
                </p>
            </motion.div>

            <div className="testimonials-grid">
                {TESTIMONIALS.map(({ name, location, text, rating, hue }, i) => (
                    <motion.div
                        key={name}
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    >
                        <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
                            {Array.from({ length: rating }).map((_, idx) => (
                                <Star key={idx} size={16} fill="#f59e0b" color="#f59e0b" />
                            ))}
                        </div>
                        <blockquote className="testimonial-quote">
                            "{text}"
                        </blockquote>
                        <div className="testimonial-user">
                            <div
                                className="testimonial-avatar"
                                style={{
                                    background: `hsl(${hue}, 70%, 90%)`,
                                    color:      `hsl(${hue}, 70%, 35%)`,
                                }}
                                aria-hidden="true"
                            >
                                {name.charAt(0)}
                            </div>
                            <div>
                                <div className="testimonial-name">{name}</div>
                                <div className="testimonial-location">{location}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
