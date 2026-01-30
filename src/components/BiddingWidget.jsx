import React, { useState, useEffect } from 'react';
import { placeBid, getBidHistory } from '../api/mockApi';
import { useAuth } from './AuthContext';
import { useToast } from './Toasts';
import { formatPriceINR } from '../utils/formatters';
import '../styles/components.css';

const BiddingWidget = ({ car, onBidPlaced }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [bidAmount, setBidAmount] = useState('');
    const [bidHistory, setBidHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    const auction = car.auction;
    const minBid = (auction.currentBid || auction.startingBid) + auction.minIncrement;
    const isHighestBidder = currentUser && auction.highestBidder === currentUser.email;

    // Load bid history
    useEffect(() => {
        if (auction?.bids) {
            setBidHistory(auction.bids);
        }
    }, [auction]);

    // Countdown timer
    useEffect(() => {
        const updateTimer = () => {
            const end = new Date(auction.endTime);
            const now = new Date();
            const diff = end - now;

            if (diff <= 0) {
                setTimeRemaining('Auction Ended');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
            } else if (hours > 0) {
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeRemaining(`${minutes}m ${seconds}s`);
            }
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

            // Re-fetch history explicitly
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
        if (increment === 0) {
            setBidAmount(minBid);
            return;
        }

        // Cumulative logic: Add to current input, or start from current bid if empty
        const currentInput = parseInt(bidAmount);
        const base = !isNaN(currentInput) ? currentInput : (auction.currentBid || auction.startingBid);
        setBidAmount(base + increment);
    };

    const isReserveMet = !auction.reservePrice || (auction.currentBid >= auction.reservePrice);

    return (
        <div className="bidding-widget">
            <div className="bidding-header">
                <div>
                    <div className="bid-label">Current Bid</div>
                    <div className="bid-amount">{formatPriceINR(auction.currentBid || auction.startingBid)}</div>
                    <div className="bid-count">{auction.bidCount || 0} bids</div>
                    {!isReserveMet && (
                        <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                            Reserve not met
                        </div>
                    )}
                </div>
                <div className={`countdown-timer ${parseInt(timeRemaining) < 5 ? 'pulse-red' : ''}`}>
                    <div className="timer-icon">⏱️</div>
                    <div className="timer-text">{timeRemaining}</div>
                </div>
            </div>

            {isHighestBidder && (
                <div className="highest-bidder-badge">
                    🏆 You're the highest bidder!
                </div>
            )}

            {!auction.ended && new Date(auction.endTime) > new Date() && (
                <div className="bid-input-section">
                    <div className="bid-input-group">
                        <span className="currency-symbol">₹</span>
                        <input
                            type="number"
                            className="bid-input"
                            placeholder={`Min: ${minBid.toLocaleString()}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="quick-bid-buttons">
                        <button onClick={() => quickBid(0)} className="quick-bid-btn">Min Bid</button>
                        <button onClick={() => quickBid(25000)} className="quick-bid-btn">+25K</button>
                        <button onClick={() => quickBid(50000)} className="quick-bid-btn">+50K</button>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handlePlaceBid}
                        disabled={loading}
                        style={{ width: '100%', marginTop: '12px' }}
                    >
                        {loading ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                </div>
            )}

            {bidHistory.length > 0 && (
                <div className="bid-history">
                    <h4>Bid History</h4>
                    <div className="bid-history-list">
                        {bidHistory.slice(0, 5).map((bid, index) => (
                            <div key={bid.id} className="bid-history-item">
                                <div className="bid-rank">#{index + 1}</div>
                                <div className="bid-details">
                                    <div className="bid-user">{bid.userId.split('@')[0]}</div>
                                    <div className="bid-time">{new Date(bid.timestamp).toLocaleString()}</div>
                                </div>
                                <div className="bid-amount-history">{formatPriceINR(bid.amount)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiddingWidget;
