import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import { bookTestDrive } from '../api/mockApi';
import CustomSelect from './CustomSelect';

const ScheduleTestDrive = ({ carTitle }) => {
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
                    <input
                        type="text" className="form-control"
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        required
                    />
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Preferred Date</label>
                    <input
                        type="date" className="form-control"
                        value={date} onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Preferred Time</label>
                    <CustomSelect
                        name="time"
                        value={time}
                        options={timeOptions}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Select Time"
                    />
                </div>

                <div className="test-drive-field">
                    <label className="form-label">Contact Number</label>
                    <input
                        type="tel" className="form-control" placeholder="e.g. +91 9876543210"
                        value={phone} onChange={e => setPhone(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="test-drive-btn">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default ScheduleTestDrive;
