import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import { bookTestDrive } from '../api/mockApi';
import CustomSelect from './CustomSelect';

const ScheduleTestDrive = ({ carId, carTitle }) => {
    const { addToast } = useToast();
    const { user } = useAuth();

    // Pre-fill if user is logged in
    const [name, setName] = useState(user ? user.name : '');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState(user ? user.phone : '');

    // Update state if user logs in while component is mounted
    React.useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
        }
    }, [user]);

    const timeOptions = [
        { label: "10:00 AM", value: "10:00 AM" },
        { label: "12:00 PM", value: "12:00 PM" },
        { label: "02:00 PM", value: "02:00 PM" },
        { label: "04:00 PM", value: "04:00 PM" },
        { label: "06:00 PM", value: "06:00 PM" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !date || !time || !phone) {
            addToast("Please fill all fields", "error");
            return;
        }

        try {
            await bookTestDrive({
                carId,
                userId: user?.id || null,
                carTitle,
                name,
                date,
                time,
                phone
            });
            addToast("Test drive requested! We will call you at " + time, "success");
            // Clear form but keep name/phone if logged in
            setDate('');
            setTime('');
            if (!user) {
                setName('');
                setPhone('');
            }
        } catch (err) {
            addToast("Failed to book test drive", "error");
        }
    };

    return (
        <div className="test-drive-widget">
            <h3>Schedule Test Drive</h3>
            <form onSubmit={handleSubmit}>
                <div className="test-drive-field">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <input
                            type="text" className="form-control with-icon"
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Preferred Date</label>
                    <div style={{ position: 'relative' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <input
                            type="date" className="form-control with-icon"
                            value={date} onChange={e => setDate(e.target.value)}
                            min={new Date().toLocaleDateString('en-CA')}
                            required
                        />
                    </div>
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Preferred Time</label>
                    <div style={{ position: 'relative' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <CustomSelect
                            name="time"
                            value={time}
                            options={timeOptions}
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="Select Time"
                            className="with-icon"
                        />
                    </div>
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Contact Number</label>
                    <div style={{ position: 'relative' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <input
                            type="tel" className="form-control with-icon" placeholder="e.g. +91 9876543210"
                            value={phone} onChange={e => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="test-drive-btn">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default ScheduleTestDrive;
