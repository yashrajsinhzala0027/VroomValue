import React, { useState, useEffect } from 'react';
import { placeBid, getBidHistory } from '../api/mockApi';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import { formatPriceINR } from '../utils/formatters';

const BiddingWidget = ({ car, onBidPlaced }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [bidAmount, setBidAmount] = useState('');
    const [bidHistory, setBidHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [isEnded, setIsEnded] = useState(false);

    const auction = car.auction;
    const currentBid = auction.currentBid || auction.startingBid || 0;
    const minIncrement = auction.minIncrement || 0;
    const minBid = currentBid + minIncrement;
    const isHighestBidder = currentUser && auction.highestBidder === currentUser.email;

    useEffect(() => {
        const fetchLatestBids = async () => {
            if (isEnded) return;
            try {
                const refreshedCar = await getCarById(car.id);
                if (refreshedCar && refreshedCar.auction) {
                    setBidHistory(refreshedCar.auction.bids.sort((a, b) => b.amount - a.amount));
                    if (onBidPlaced && refreshedCar.auction.currentBid > currentBid) {
                        // Silent update of parent if someone else bid
                        onBidPlaced();
                    }
                }
            } catch (err) {
                console.warn("Poll error:", err);
            }
        };

        const pollInterval = setInterval(fetchLatestBids, 10000); // 10s poll
        return () => clearInterval(pollInterval);
    }, [car.id, isEnded, currentBid, onBidPlaced]);

    useEffect(() => {
        const updateTimer = () => {
            const end = new Date(auction.endTime);
            const now = new Date();
            const diff = end - now;

            if (diff <= 0) {
                setIsEnded(true);
                return;
            }

            setTimeRemaining({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction.endTime]);

    const handlePlaceBid = async () => {
        if (!currentUser) {
            addToast('Please login to place a bid', 'error');
            return;
        }

        const amount = parseInt(bidAmount);
        if (!amount || amount < minBid) {
            addToast(`Minimum bid is ${formatPriceINR(minBid)}`, 'error');
            return;
        }

        setLoading(true);
        try {
            await placeBid(car.id, currentUser.email, amount);
            addToast('Bid placed successfully! 🎉', 'success');
            setBidAmount('');
            const history = await getBidHistory(car.id);
            setBidHistory(history);
            if (onBidPlaced) onBidPlaced();
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const quickBid = (increment) => {
        const base = Math.max(minBid, parseInt(bidAmount) || 0);
        setBidAmount(base + increment);
    };

    const isReserveMet = !auction.reservePrice || (currentBid >= auction.reservePrice);

    return (
        <div className={`glass-panel bidding-card page-enter ${isHighestBidder ? 'winning-glow' : ''}`}>

            {!isEnded && (
                <div className="live-indicator-wrapper">
                    <span className="live-indicator"></span>
                    <span style={{ color: '#ef4444' }}>LIVE AUCTION</span>
                </div>
            )}

            <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Current Bid</div>
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: isHighestBidder ? '#f59e0b' : 'var(--secondary)', lineHeight: 1, letterSpacing: '-2px' }}>
                    {formatPriceINR(currentBid)}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>{auction.bidCount || 0} Participants</span>
                    {!isReserveMet && (
                        <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }}>
                            Reserve Not Met
                        </span>
                    )}
                    {isReserveMet && (
                        <span className="badge" style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5' }}>
                            Reserve Met
                        </span>
                    )}
                </div>
            </div>

            {!isEnded ? (
                <div className="timer-grid">
                    {['d', 'h', 'm', 's'].map((unit, i) => {
                        const isUrgent = !timeRemaining.d && !timeRemaining.h && timeRemaining.m < 5;
                        return (
                            <div key={unit} className="timer-box" style={{ borderColor: isUrgent ? '#ef4444' : 'var(--border)' }}>
                                <div style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 900,
                                    color: isUrgent ? '#ef4444' : 'var(--secondary)',
                                    lineHeight: 1,
                                    textShadow: isUrgent ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none'
                                }}>
                                    {timeRemaining[unit].toString().padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '1px' }}>
                                    {['Days', 'Hours', 'Mins', 'Secs'][i]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ background: 'var(--bg-surface)', padding: '32px', borderRadius: '24px', textAlign: 'center', border: '2px solid var(--border)', marginBottom: '32px' }}>
                    <div className="badge-sold badge-status-large" style={{ display: 'inline-block', marginBottom: '16px' }}>AUCTION CLOSED</div>
                    {auction.highestBidder ? (
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>Winning Bid</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{formatPriceINR(currentBid)}</div>
                            <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                Sold to <span style={{ color: 'var(--primary)' }}>{auction.highestBidder.split('@')[0]}***</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No bids were placed.</div>
                    )}
                </div>
            )}

            {isHighestBidder && (
                <div style={{
                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                    color: '#b45309',
                    padding: '20px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    marginBottom: '24px',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🏆</span> You are currently the leading bidder!
                </div>
            )}

            {!isEnded && (
                <div style={{ background: 'rgba(255,255,255,0.4)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="bid-input-wrapper">
                        <span className="bid-currency-symbol">₹</span>
                        <input
                            type="number"
                            className="bid-input"
                            placeholder={minBid}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        {[
                            { label: 'Min', val: minBid },
                            { label: '+10k', inc: 10000 },
                            { label: '+25k', inc: 25000 }
                        ].map(btn => (
                            <button
                                key={btn.label}
                                onClick={() => btn.inc ? quickBid(btn.inc) : setBidAmount(btn.val)}
                                className="btn btn-outline"
                                style={{ padding: '10px', fontSize: '0.8rem', borderRadius: '12px' }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handlePlaceBid}
                        disabled={loading}
                        style={{ width: '100%', height: '56px', fontSize: '1.1rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                    >
                        {loading ? 'Confirming...' : `Place My Bid`}
                    </button>
                </div>
            )}

            {bidHistory.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Auction History</h4>
                    <div className="bid-timeline">
                        {bidHistory.slice(0, 4).map((bid, index) => (
                            <div key={index} className="bid-timeline-item" style={{ marginBottom: '24px', opacity: index === 0 ? 1 : 0.6 }}>
                                <div className="bid-timeline-dot" style={{ background: index === 0 ? 'var(--primary)' : 'var(--border)' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--secondary)' }}>
                                            {bid.userId.split('@')[0]}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 900, color: index === 0 ? 'var(--primary)' : 'var(--secondary)', fontSize: '1.1rem' }}>
                                        {formatPriceINR(bid.amount)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiddingWidget;
