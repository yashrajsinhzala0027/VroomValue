
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/Toasts';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email) newErrors.email = true;
        if (!password) newErrors.password = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            addToast("Logged in successfully!", "success");
            navigate('/');
        } catch (err) {
            addToast(err.message || "Failed to login", "error");
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
                <h1 className="auth-title">Welcome Back</h1>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            placeholder="name@example.com"
                            value={email}
                            autoComplete="new-password"
                            onChange={e => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: false });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'error' : ''}`}
                            placeholder="Enter your password"
                            value={password}
                            autoComplete="new-password"
                            onChange={e => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: false });
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>

                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
