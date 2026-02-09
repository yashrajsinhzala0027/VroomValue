
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/Toasts';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { addToast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!email) newErrors.email = true;
        if (!phone) newErrors.phone = true;
        if (!dob) newErrors.dob = true;
        if (!password) newErrors.password = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const user = await signup({ email, password, name, dob, phone });
            addToast("Account created! You can now login.", "success");
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to sign up";
            addToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper page-enter">
            <div className="auth-bg-glow-1"></div>
            <div className="auth-bg-glow-2"></div>

            <div className="auth-card glass-panel" style={{ maxWidth: '520px' }}>
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="auth-logo-text-1">VROOM</span>
                        <span className="auth-logo-text-2">VALUE</span>
                    </Link>
                    <h1 className="auth-title">Join the Elite</h1>
                    <p className="auth-subtitle">Start your journey with India's most intelligent marketplace</p>
                </div>

                <form className="auth-form grid-2" onSubmit={handleSubmit}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            className={`auth-input ${errors.name ? 'error' : ''}`}
                            placeholder="e.g. Yashraj Zala"
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: false });
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            className={`auth-input ${errors.email ? 'error' : ''}`}
                            placeholder="name@nexus.com"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: false });
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mobile</label>
                        <input
                            type="tel"
                            className={`auth-input ${errors.phone ? 'error' : ''}`}
                            placeholder="+91 ...."
                            value={phone}
                            onChange={e => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({ ...errors, phone: false });
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Birth Date</label>
                        <input
                            type="date"
                            className={`auth-input ${errors.dob ? 'error' : ''}`}
                            value={dob}
                            onChange={e => {
                                setDob(e.target.value);
                                if (errors.dob) setErrors({ ...errors, dob: false });
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: '12px' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            className={`auth-input ${errors.password ? 'error' : ''}`}
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: false });
                            }}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <button
                            type="submit"
                            className="btn btn-primary auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                        </button>
                    </div>

                    <div className="auth-footer" style={{ gridColumn: 'span 2' }}>
                        <p>
                            Already part of the network? <Link to="/login">Authenticate Here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
