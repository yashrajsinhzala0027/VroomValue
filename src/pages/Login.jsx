
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
            const user = await login(email, password);
            addToast("Logged in successfully!", "success");
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Login component error:", err);
            // Show the actual error message from Supabase if available
            addToast(err.message || "Failed to login", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper page-enter">
            <div className="auth-bg-glow-1"></div>
            <div className="auth-bg-glow-2"></div>

            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="auth-logo-text-1">VROOM</span>
                        <span className="auth-logo-text-2">VALUE</span>
                    </Link>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Access your premium automotive dashboard</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label>Identity</label>
                        <input
                            type="email"
                            className={`auth-input ${errors.email ? 'error' : ''}`}
                            placeholder="Email Address"
                            value={email}
                            autoComplete="new-password"
                            onChange={e => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: false });
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label style={{ marginBottom: 0 }}>Secret Key</label>
                            <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
                        </div>
                        <input
                            type="password"
                            className={`auth-input ${errors.password ? 'error' : ''}`}
                            placeholder="Password"
                            value={password}
                            autoComplete="new-password"
                            onChange={e => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: false });
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}
                    </button>

                    <div className="auth-footer">
                        <p>
                            New to the platform? <Link to="/signup">Initialize Account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
