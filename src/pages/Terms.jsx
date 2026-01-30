import React from 'react';

const Terms = () => {
    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-main)' }}>
                    Terms & Conditions
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            1. Acceptance of Terms
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            By accessing and using VroomValue platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms & Conditions, please do not use our services.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            2. Vehicle Listings
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            All vehicle listings on VroomValue are subject to the following conditions:
                        </p>
                        <ul style={{ lineHeight: '1.8', color: 'var(--text-muted)', paddingLeft: '24px' }}>
                            <li>All vehicles undergo a 150-point inspection before listing</li>
                            <li>Vehicle information is provided to the best of our knowledge and is subject to verification</li>
                            <li>Prices are subject to change without prior notice</li>
                            <li>Vehicle availability is not guaranteed until payment is confirmed</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            3. Purchase Agreement
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            When you purchase a vehicle through VroomValue:
                        </p>
                        <ul style={{ lineHeight: '1.8', color: 'var(--text-muted)', paddingLeft: '24px' }}>
                            <li>A binding purchase agreement is created upon payment confirmation</li>
                            <li>All sales are final unless covered under our 7-day return policy</li>
                            <li>Buyer is responsible for registration transfer and associated costs</li>
                            <li>Vehicle must be collected within 15 days of payment confirmation</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            4. Return Policy
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            We offer a 7-day money-back guarantee from the date of delivery. To be eligible for a return, the vehicle must be in the same condition as received, with no additional mileage beyond 100 km, and all original documents must be intact. Refunds will be processed within 10-15 business days.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            5. Warranty
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            All vehicles come with a 6-month/10,000 km warranty (whichever comes first) covering major mechanical and electrical components. The warranty does not cover wear and tear items, accidents, misuse, or modifications made after purchase.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            6. Selling Your Car
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            When selling your car through VroomValue:
                        </p>
                        <ul style={{ lineHeight: '1.8', color: 'var(--text-muted)', paddingLeft: '24px' }}>
                            <li>You must be the registered owner of the vehicle</li>
                            <li>All information provided must be accurate and truthful</li>
                            <li>Vehicle must be free from any legal disputes or pending loans</li>
                            <li>VroomValue reserves the right to reject any listing</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            7. User Conduct
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            Users must not engage in fraudulent activities, provide false information, attempt to circumvent our platform, or use our services for any illegal purposes. Violation of these terms may result in account suspension or legal action.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            8. Privacy & Data Protection
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            We are committed to protecting your privacy. All personal information collected is used solely for providing our services and is not shared with third parties without your consent, except as required by law.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            9. Limitation of Liability
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            VroomValue shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our platform or services. Our total liability shall not exceed the purchase price of the vehicle in question.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            10. Modifications to Terms
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            VroomValue reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            11. Contact Information
                        </h2>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            For any questions regarding these Terms & Conditions, please contact us at:
                        </p>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-main)', fontWeight: 600, marginTop: '12px' }}>
                            Email: legal@VroomValue.in<br />
                            Phone: 1800-123-4567
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
