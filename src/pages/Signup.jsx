
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
            await signup({ email, password, name, dob, phone });
            addToast("Account created! You can now login.", "success");
            navigate('/login');
        } catch (err) {
            addToast(err.message || "Failed to sign up", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '10px', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    VroomValue<span style={{ color: 'var(--text-color)' }}>Cars</span>
                </Link>
                <h1 className="auth-title">Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'error' : ''}`}
                            placeholder="John Doe"
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: false });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            placeholder="name@example.com"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: false });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className={`form-control ${errors.phone ? 'error' : ''}`}
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={e => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({ ...errors, phone: false });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className={`form-control ${errors.dob ? 'error' : ''}`}
                            value={dob}
                            onChange={e => {
                                setDob(e.target.value);
                                if (errors.dob) setErrors({ ...errors, dob: false });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'error' : ''}`}
                            placeholder="Create a password"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: false });
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
