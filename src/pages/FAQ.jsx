import React, { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I buy a car from VroomValue?",
            answer: "Browse our listings, select a car you like, and click 'Schedule Test Drive'. Our team will contact you to arrange a viewing and test drive. Once you're satisfied, we'll help you with paperwork and financing options."
        },
        {
            question: "Are all cars inspected?",
            answer: "Yes! Every car listed on VroomValue undergoes a comprehensive 150-point inspection by certified mechanics. We provide detailed inspection reports for complete transparency."
        },
        {
            question: "Can I sell my car on VroomValue?",
            answer: "Absolutely! Click on 'Sell Your Car' in the navigation menu, fill out the form with your car details and upload photos. Our team will review and get back to you with a fair valuation within 24 hours."
        },
        {
            question: "Do you offer financing options?",
            answer: "Yes, we partner with leading banks and NBFCs to offer competitive financing options. Our team can help you get pre-approved loans with attractive interest rates."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 7-day money-back guarantee on all purchases. If you're not satisfied with your car within 7 days of purchase, you can return it for a full refund (conditions apply)."
        },
        {
            question: "How long does the buying process take?",
            answer: "Once you've selected a car and completed the test drive, the entire process typically takes 2-3 days. This includes documentation, payment processing, and vehicle handover."
        },
        {
            question: "Can I exchange my old car?",
            answer: "Yes! We accept car exchanges. Our team will evaluate your current car and adjust the price accordingly. This makes upgrading to a better car much easier."
        },
        {
            question: "What documents do I need to buy a car?",
            answer: "You'll need: Valid ID proof (Aadhar/PAN), Address proof, Passport-size photos, and proof of income (for financing). Our team will guide you through the complete documentation process."
        },
        {
            question: "Do you provide warranty?",
            answer: "Yes, all our cars come with a 6-month/10,000 km warranty (whichever comes first) covering major mechanical and electrical components."
        },
        {
            question: "How can I schedule a test drive?",
            answer: "Click on any car listing and use the 'Schedule Test Drive' form. Select your preferred date and time, and our team will confirm the appointment via call or email."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container" style={{ padding: 'clamp(80px, 12vw, 120px) 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)', textAlign: 'center', lineHeight: 1 }}>
                    Frequently Asked Questions
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: 'var(--text-muted)', marginBottom: 'clamp(32px, 8vw, 60px)', textAlign: 'center' }}>
                    Find answers to common questions about buying and selling cars with VroomValue
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'var(--bg-surface)',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                overflow: 'hidden',
                                boxShadow: openIndex === index ? '0 8px 24px rgba(79, 70, 229, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                style={{
                                    width: '100%',
                                    padding: 'clamp(16px, 3vw, 24px)',
                                    background: 'transparent',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                                    fontWeight: 700,
                                    color: openIndex === index ? 'var(--primary)' : 'var(--text-main)',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                <span style={{ paddingRight: '12px' }}>{faq.question}</span>
                                <span style={{
                                    fontSize: '1.5rem',
                                    transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    color: 'var(--primary)',
                                    flexShrink: 0
                                }}>
                                    +
                                </span>
                            </button>
                            {openIndex === index && (
                                <div style={{
                                    padding: '0 clamp(16px, 3vw, 24px) clamp(16px, 3vw, 24px)',
                                    color: 'var(--text-muted)',
                                    lineHeight: '1.7',
                                    fontSize: '1rem',
                                    animation: 'fadeIn 0.3s ease'
                                }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '60px',
                    padding: 'clamp(24px, 5vw, 40px)',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
                    borderRadius: '24px',
                    textAlign: 'center',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>
                        Still have questions?
                    </h3>
                    <p style={{ marginBottom: '24px', opacity: 0.9 }}>
                        Our support team is here to help you
                    </p>
                    <a
                        href="/contact"
                        style={{
                            display: 'inline-block',
                            padding: '14px 40px',
                            background: 'white',
                            color: 'var(--primary)',
                            borderRadius: '50px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
