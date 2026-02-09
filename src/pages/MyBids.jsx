import React, { useState, useEffect } from 'react';
import { getMyBids } from '../api/mockApi';
import { useAuth } from '../components/AuthContext';
import { formatPriceINR } from '../utils/formatters';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const MyBids = () => {
    const { currentUser } = useAuth();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getMyBids(currentUser.email).then(data => {
                setBids(data);
                setLoading(false);
            });
        }
    }, [currentUser]);

    if (!currentUser) return <div className="container" style={{ paddingTop: '100px' }}>Please login to view your bids.</div>;
    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading bids...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'winning': return '#10b981'; // Green
            case 'outbid': return '#f59e0b'; // Amber
            case 'won': return '#059669'; // Dark Green
            case 'lost': return '#ef4444'; // Red
            default: return '#64748b';
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '120px 0 60px' }}>
            <div className="container">
                <h1 className="section-title">My Bids</h1>

                {bids.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
                        <h3>No active bids</h3>
                        <p style={{ margin: '16px 0', color: '#64748b' }}>Start bidding on premium cars today!</p>
                        <Link to="/listings?isAuction=true" className="btn btn-primary">Browse Auctions</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {bids.map((bid, index) => (
                            <div key={bid.id || index} style={{
                                background: 'white',
                                padding: '24px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img
                                        src={bid.car?.images?.[0]?.src}
                                        alt={bid.car?.model}
                                        style={{ width: '120px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
                                    />
                                    <div>
                                        <h3 style={{ marginBottom: '4px' }}>{bid.car?.year} {bid.car?.make} {bid.car?.model}</h3>
                                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                            Bid Amount: <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatPriceINR(bid.amount)}</span>
                                        </div>
                                        <div style={{ marginTop: '4px', fontSize: '0.85rem' }}>
                                            {new Date(bid.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        background: `${getStatusColor(bid.status)}15`,
                                        color: getStatusColor(bid.status),
                                        fontWeight: '700',
                                        display: 'inline-block',
                                        marginBottom: '12px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem'
                                    }}>
                                        {bid.status}
                                    </div>
                                    <br />
                                    {bid.carId ? (
                                        <Link to={`/car/${bid.carId}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                            View Auction
                                        </Link>
                                    ) : (
                                        <span className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}>
                                            Unavailable
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBids;
