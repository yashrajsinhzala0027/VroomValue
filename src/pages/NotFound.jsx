
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '16px' }}>404</h1>
            <h2 style={{ marginBottom: '24px' }}>Page Not Found</h2>
            <p style={{ marginBottom: '32px', color: '#666' }}>The page you are looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
    );
};

export default NotFound;
