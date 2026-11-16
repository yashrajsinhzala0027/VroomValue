import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import { bookTestDrive } from '../api/mockApi';
import CustomSelect from './CustomSelect';
import { User, Calendar, Clock, Phone, Car } from 'lucide-react';

const ScheduleTestDrive = ({ carId, carTitle }) => {
    const { addToast } = useToast();
    const { user, currentUser } = useAuth();
    const activeUser = user || currentUser;

    const [name, setName] = useState(activeUser ? activeUser.name : '');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phone, setPhone] = useState(activeUser ? activeUser.phone : '');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (activeUser) {
            setName(activeUser.name || '');
            setPhone(activeUser.phone || '');
        }
    }, [activeUser]);

    const timeOptions = [
        { label: "10:00 AM – 12:00 PM", value: "10:00 AM" },
        { label: "12:00 PM – 02:00 PM", value: "12:00 PM" },
        { label: "02:00 PM – 04:00 PM", value: "02:00 PM" },
        { label: "04:00 PM – 06:00 PM", value: "04:00 PM" },
        { label: "06:00 PM – 08:00 PM", value: "06:00 PM" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !date || !time || !phone) {
            addToast("Please fill all fields to schedule your test drive.", "error");
            return;
        }

        try {
            setSubmitting(true);
            await bookTestDrive({
                carId,
                userId: activeUser?.id || null,
                carTitle,
                name,
                date,
                time,
                phone
            });
            addToast(`Test drive scheduled for ${date} at ${time}! We will contact you shortly.`, "success");
            setDate('');
            setTime('');
            if (!activeUser) {
                setName('');
                setPhone('');
            }
        } catch (err) {
            addToast("Failed to book test drive. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="details-section-card test-drive-card" aria-labelledby="test-drive-heading">
            <div className="section-card-header">
                <div>
                    <h3 id="test-drive-heading" className="section-card-title">Schedule Doorstep Test Drive</h3>
                    <p className="section-card-subtitle">Experience this vehicle at your home or nearest VV-Hub with zero obligation.</p>
                </div>
                <div className="test-drive-badge">
                    <Car size={16} />
                    <span>Free Doorstep Trial</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="test-drive-form">
                <div className="form-grid-2">
                    {/* Full Name */}
                    <div className="test-drive-field">
                        <label className="form-label">Full Name</label>
                        <div className="input-with-icon-wrap">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your full name"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div className="test-drive-field">
                        <label className="form-label">Phone Number</label>
                        <div className="input-with-icon-wrap">
                            <Phone size={18} className="input-icon" />
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Preferred Date */}
                    <div className="test-drive-field">
                        <label className="form-label">Preferred Date</label>
                        <div className="input-with-icon-wrap">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                min={new Date().toLocaleDateString('en-CA')}
                                required
                            />
                        </div>
                    </div>

                    {/* Preferred Time */}
                    <div className="test-drive-field">
                        <label className="form-label">Preferred Time Slot</label>
                        <div className="input-with-icon-wrap select-wrap">
                            <Clock size={18} className="input-icon" style={{ zIndex: 2 }} />
                            <CustomSelect
                                name="time"
                                value={time}
                                options={timeOptions}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Choose convenient slot"
                                className="with-icon"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary test-drive-submit-btn"
                    disabled={submitting}
                >
                    {submitting ? 'Requesting Test Drive...' : 'Confirm Doorstep Test Drive'}
                </button>
            </form>
        </section>
    );
};

export default ScheduleTestDrive;
