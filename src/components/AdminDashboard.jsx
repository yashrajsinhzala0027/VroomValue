import React, { useState, useEffect } from 'react';
import { getCars, deleteCarListing, getTestDrives, updateCarListing, getSellRequests, approveSellRequest, rejectSellRequest, resetApp, endAuction, startAuction, unreserveCar } from '../api/mockApi';
import ConfirmModal from './ConfirmModal';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../utils/formatters';
import { useToast } from './Toasts';

const AdminDashboard = () => {
    const { currentUser, isVerifying: isAuthVerifying } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [cars, setCars] = useState([]);
    const [sellRequests, setSellRequests] = useState([]);

    const [testDrives, setTestDrives] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [activeTab, setActiveTab] = useState('inventory');
    const [loading, setLoading] = useState(true);
    const [statusFilter, setActiveStatusFilter] = useState('all');
    const [processingIds, setProcessingIds] = useState(new Set());
    const [isRejectionProcessing, setIsRejectionProcessing] = useState(false);

    const refreshData = async (isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            // OPTIMIZED: Fetch only columns needed for the table
            // This excludes heavy 'description', 'features', 'specs', etc.
            const summaryCols = 'id, make, model, year, variant, priceinr, status, sellertype, city, reserve_details, buyer_details';

            const [carsData, requestsData, drivesData, count] = await Promise.all([
                getCars({}, summaryCols),
                getSellRequests(),
                getTestDrives(),
                getUserCount()
            ]);
            setCars(carsData);
            setSellRequests(requestsData);
            setTestDrives(drivesData);
            setUserCount(count);
        } catch (error) {
            console.error("Error loading admin data:", error);
            addToast("Failed to load dashboard data.", "error");
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        refreshData(true);
        const interval = setInterval(() => refreshData(false), 30000);
        return () => clearInterval(interval);
    }, []);

    const [editingCar, setEditingCar] = useState(null);
    const [editPriceValue, setEditPriceValue] = useState('');

    // Custom Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        type: 'danger',
        onConfirm: () => { }
    });

    const triggerConfirm = (config) => {
        setModal({
            isOpen: true,
            title: config.title || 'Are you sure?',
            message: config.message || 'This action cannot be undone.',
            confirmText: config.confirmText || 'Confirm',
            type: config.type || 'danger',
            onConfirm: async () => {
                try {
                    await config.onConfirm();
                    setModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Confirmation action failed:", error);
                    // Modal stays open to let user know or try again 
                }
            }
        });
    };

    const handleUnreserve = async (carId) => {
        triggerConfirm({
            title: "Unreserve Car?",
            message: "Are you sure you want to unreserve this car? It will go back on sale immediately.",
            confirmText: "Unreserve",
            type: "danger",
            onConfirm: async () => {
                try {
                    await unreserveCar(carId);
                    addToast('Car unreserved successfully', 'success');
                    refreshData();
                } catch (error) {
                    console.error('Error unreserving car:', error);
                    addToast('Failed to unreserve car', 'error');
                }
            }
        });
    };

    const handleDelete = (id) => {
        triggerConfirm({
            title: "Confirm Deletion",
            message: "Are you sure you want to permanently remove this listing? This action cannot be undone.",
            confirmText: "Yes, Delete",
            type: "danger",
            onConfirm: async () => {
                await deleteCarListing(id);
                // Optimistically update local inventory
                setCars(prev => prev.filter(car => car.id !== id));
                await refreshData();
                addToast("Vehicle removed from inventory", "info");
            }
        });
    };

    const handleEditPrice = (car) => {
        setEditingCar(car);
        setEditPriceValue(car.priceINR);
    };

    const confirmEditPrice = async () => {
        if (editingCar && editPriceValue && !isNaN(editPriceValue)) {
            await updateCarListing(editingCar.id, { priceINR: Number(editPriceValue) });
            refreshData();
            addToast("Price updated", "success");
            setEditingCar(null);
        }
    };

    const [selectedRequest, setSelectedRequest] = useState(null); // For detailed view
    const [reviewData, setReviewData] = useState({ price: '', kms: '' });

    const openReviewModal = (request) => {
        setSelectedRequest(request);
        setReviewData({
            price: request.priceINR || '',
            kms: request.kms || ''
        });
    };

    const closeReviewModal = () => {
        setSelectedRequest(null);
    };

    const handleApprove = async () => {
        if (!selectedRequest || processingIds.has(selectedRequest.id)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(selectedRequest.id));

            // PASS FULL DATA: Include all car details from the request
            const approvalData = {
                ...selectedRequest,
                priceINR: Number(reviewData.price),
                kms: Number(reviewData.kms)
            };

            await approveSellRequest(selectedRequest.id, approvalData);

            // Update local state ONLY on success confirmed by backend
            setSellRequests(prev => prev.filter(req => req.id !== selectedRequest.id));

            closeReviewModal();
            addToast("Listing Approved & Published!", "success");

            // Allow DB longer to settle (1.5s)
            setTimeout(() => refreshData(), 1500);
        } catch (err) {
            console.error("Approve Error:", err);
            addToast(err.message || "Failed to approve request", "error");
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(selectedRequest?.id);
                return next;
            });
        }
    };

    const handleReject = async (id) => {
        triggerConfirm({
            title: "Reject Request?",
            message: "Are you sure you want to reject this listing request? it will be permanently deleted.",
            confirmText: "Reject",
            type: "danger",
            onConfirm: async () => {
                setIsRejectionProcessing(true);
                try {
                    setProcessingIds(prev => new Set(prev).add(id));
                    if (selectedRequest?.id === id) closeReviewModal();

                    await rejectSellRequest(id);

                    // Update locally confirmed
                    setSellRequests(prev => prev.filter(req => req.id !== id));

                    addToast("Request rejected and removed", "success");

                    // Delay refresh to allow DB to settle
                    setTimeout(() => refreshData(), 1500);
                } catch (err) {
                    console.error("Rejection error:", err);
                    addToast(err.message || "Failed to reject request", "error");
                    throw err; // Re-throw for triggerConfirm handling
                } finally {
                    setProcessingIds(prev => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                }
            }
        });
    };

    const handleEndAuction = async (carId) => {
        triggerConfirm({
            title: "End Auction?",
            message: "Are you sure you want to end this auction manually? The car will be marked as sold to the highest bidder immediately.",
            confirmText: "End Auction",
            type: "warning",
            onConfirm: async () => {
                try {
                    await endAuction(carId);
                    refreshData();
                    addToast("Auction ended successfully", "success");
                } catch (err) {
                    addToast(err.message, "error");
                }
            }
        });
    };

    const [initiatingAuctionCar, setInitiatingAuctionCar] = useState(null);
    const [auctionConfig, setAuctionConfig] = useState({
        startingBid: '',
        days: '7',
        hours: '0',
        minutes: '0',
        reservePrice: ''
    });

    const openAuctionModal = (car) => {
        setInitiatingAuctionCar(car);
        setAuctionConfig({
            startingBid: Math.round(car.priceINR * 0.8), // Default start at 80%
            days: '7',
            hours: '0',
            minutes: '0',
            reservePrice: car.priceINR
        });
    };

    const confirmStartAuction = async () => {
        if (!initiatingAuctionCar) return;

        try {
            const days = parseInt(auctionConfig.days) || 0;
            const hours = parseInt(auctionConfig.hours) || 0;
            const mins = parseInt(auctionConfig.minutes) || 0;

            if (days === 0 && hours === 0 && mins === 0) {
                addToast("Duration must be at least 1 minute", "error");
                return;
            }

            const endTime = new Date();
            const totalMinutes = (days * 24 * 60) + (hours * 60) + mins;
            endTime.setMinutes(endTime.getMinutes() + totalMinutes);

            await startAuction(initiatingAuctionCar.id, {
                startingBid: auctionConfig.startingBid,
                endTime: endTime,
                reservePrice: auctionConfig.reservePrice
            });
            refreshData();
            addToast("Auction started successfully! 🔨", "success");
            setInitiatingAuctionCar(null);
        } catch (err) {
            addToast(err.message, "error");
        }
    };

    // STRENGTHENED AUTH GUARD: Wait for BACKGROUND verification too
    if (!loading && !isAuthVerifying && currentUser?.role !== 'admin') {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ marginBottom: '16px' }}>Access Restricted</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        This area is reserved for VroomValue administrators. Please log in with an authorized account to continue.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/')} className="btn btn-outline">Go Home</button>
                        <button onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} className="btn btn-primary">Login as Admin</button>
                    </div>
                </div>
            </div>
        );
    }

    // Explicit return for null user while not loading
    if (!loading && !currentUser) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
                    <h2 style={{ marginBottom: '16px' }}>Session Expired</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        Your session has timed out. Please log in again to access the Command Center.
                    </p>
                    <button onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} className="btn btn-primary">Log In Now</button>
                </div>
            </div>
        );
    }

    const auctionCars = cars.filter(c => c.auction && c.auction.isAuction);
    const transactionCars = cars.filter(c => c.status === 'sold' || c.status === 'reserved');
    const inventoryCars = cars.filter(c => {
        if (statusFilter === 'all') return c.status !== 'pending'; // Show all except raw pending
        return c.status === statusFilter;
    });
    const totalValue = cars.reduce((acc, car) => acc + car.priceINR, 0);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '60px', position: 'relative' }}>
            <button
                className="back-btn"
                onClick={() => navigate(-1)}
                style={{ top: '35px', left: '20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                title="Go Back"
            >
                <span>❮</span>
            </button>
            <div className="admin-header" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, #2d3748 100%)', padding: '40px 0', color: 'white' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ marginBottom: '8px', color: 'white' }}>Command Center</h1>
                        <p style={{ opacity: 0.8, fontSize: '1rem' }}>VroomValue Management & Analytics Platform</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => refreshData(true)}
                            className="btn"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                borderRadius: '12px',
                                padding: '10px 20px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Refresh Live Feed
                        </button>
                        <button
                            onClick={() => triggerConfirm({
                                title: "Reset Inventory?",
                                message: "This will clear all current listings and restock from initial data. All auction progress will be lost!",
                                confirmText: "Reset Now",
                                type: "danger",
                                onConfirm: resetApp
                            })}
                            className="btn"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#fecaca',
                                borderRadius: '12px',
                                padding: '10px 20px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Emergency Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-container">
                {/* Stats Cards */}
                <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px', marginTop: '-30px' }}>
                    <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>🏎️</div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Inventory</div>
                        <div className="stat-value" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', color: 'var(--text-main)' }}>{cars.length}</div>
                        <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>↑ 12% from last month</div>
                    </div>

                    <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>🔨</div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Auctions</div>
                        <div className="stat-value" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', color: '#f59e0b' }}>{auctionCars.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Real-time bidding active</div>
                    </div>

                    <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>📝</div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Approvals</div>
                        <div className="stat-value" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', color: sellRequests.length > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{sellRequests.length}</div>
                        <div style={{ color: sellRequests.length > 0 ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{sellRequests.length > 0 ? 'Action Required' : 'All caught up'}</div>
                    </div>

                    <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>🤝</div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Inquiries</div>
                        <div className="stat-value" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', color: 'var(--primary)' }}>{testDrives.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Test drives & leads</div>
                    </div>

                    <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05 }}>👥</div>
                        <div className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</div>
                        <div className="stat-value" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', color: 'var(--text-main)' }}>{userCount}</div>
                        <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>Registered customers</div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard...</div>
                ) : (
                    <div className="admin-panel">
                        <div className="admin-tabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex' }}>
                                <button
                                    className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('inventory')}
                                >
                                    Inventory ({cars.length})
                                </button>
                                <button
                                    className={`admin-tab ${activeTab === 'sell-requests' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('sell-requests')}
                                >
                                    Sell Requests ({sellRequests.length})
                                </button>
                                <button
                                    className={`admin-tab ${activeTab === 'auctions' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('auctions')}
                                >
                                    Auctions ({auctionCars.length})
                                </button>
                                <button
                                    className={`admin-tab ${activeTab === 'test-drives' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('test-drives')}
                                >
                                    Test Drives ({testDrives.length})
                                </button>
                                <button
                                    className={`admin-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('transactions')}
                                >
                                    Transactions ({transactionCars.length})
                                </button>
                            </div>

                            {activeTab === 'inventory' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '20px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>FILTER:</span>
                                    <div className="admin-filter-select-wrapper">
                                        <select
                                            className="admin-filter-select"
                                            onChange={(e) => setActiveStatusFilter(e.target.value)}
                                            value={statusFilter}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="approved">Approved</option>
                                            <option value="sold">Sold</option>
                                            <option value="reserved">Reserved</option>
                                        </select>
                                        <span className="admin-filter-chevron">▼</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeTab === 'inventory' && (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Vehicle Details</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryCars.map(car => (
                                            <tr key={car.id}>
                                                <td>#{String(car.id).padStart(4, '0')}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#32325d' }}>{car.year} {car.make} {car.model}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#8898aa', marginTop: '4px' }}>{car.variant} • {car.city}</div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{formatPriceINR(car.priceINR)}</td>
                                                <td>
                                                    <span className={`badge ${car.sellerType === 'VroomValue Certified' ? 'badge-certified' : ''}`} style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
                                                        {car.status === 'approved' ? car.sellerType : car.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button onClick={() => handleEditPrice(car)} className="action-btn btn-edit">Edit Price</button>
                                                    {!car.auction?.isAuction && (
                                                        <button
                                                            onClick={() => openAuctionModal(car)}
                                                            className="action-btn"
                                                            style={{ background: '#f59e0b', color: 'white' }}
                                                        >
                                                            Start Auction
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(car.id)} className="action-btn btn-delete">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'sell-requests' && (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Requested</th>
                                            <th>Vehicle Check</th>
                                            <th>Client Price</th>
                                            <th>Images</th>
                                            <th style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellRequests.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#8898aa' }}>
                                                    No pending requests.
                                                </td>
                                            </tr>
                                        )}
                                        {sellRequests.filter(r => !processingIds.has(r.id)).map(req => (
                                            <tr key={req.id} style={{ opacity: processingIds.has(req.id) ? 0.5 : 1 }}>
                                                <td>#{String(req.id).padStart(4, '0')}</td>
                                                <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#32325d' }}>{req.year} {req.make} {req.model}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#8898aa', marginTop: '4px' }}>{req.city} • {req.kms} km</div>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{formatPriceINR(req.priceINR)}</td>
                                                <td>{(req.images?.length || 0)} Photos</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => openReviewModal(req)}
                                                        className="btn btn-primary"
                                                        disabled={processingIds.has(req.id)}
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                    >
                                                        {processingIds.has(req.id) ? 'Processing...' : 'Review & Approve'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'test-drives' && (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date Received</th>
                                            <th>Customer Name</th>
                                            <th>Contact Info</th>
                                            <th>Vehicle Interest</th>
                                            <th>Preferred Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testDrives.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#8898aa' }}>
                                                    No test drive requests found.
                                                </td>
                                            </tr>
                                        )}
                                        {testDrives.map(td => (
                                            <tr key={td.id}>
                                                <td>{new Date(td.date).toLocaleDateString()}</td>
                                                <td style={{ fontWeight: 600 }}>{td.name}</td>
                                                <td>{td.phone}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{td.carTitle}</div>
                                                </td>
                                                <td>
                                                    <span style={{ background: '#e0f2ff', color: '#007bff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                        {td.time || 'Flexible'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'auctions' && (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Vehicle</th>
                                            <th>Current Bid</th>
                                            <th>Bids</th>
                                            <th>Highest Bidder</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auctionCars.length === 0 && (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#8898aa' }}>
                                                    No active auctions.
                                                </td>
                                            </tr>
                                        )}
                                        {auctionCars.map(car => {
                                            const timeLeft = new Date(car.auction.endTime) - new Date();
                                            const isEnded = timeLeft <= 0;
                                            return (
                                                <tr key={car.id}>
                                                    <td>#{String(car.id).padStart(4, '0')}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 600, color: '#32325d' }}>{car.year} {car.make} {car.model}</div>
                                                        <Link to={`/car/${car.id}`} target="_blank" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>View Listing</Link>
                                                    </td>
                                                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                                        {formatPriceINR(car.auction.currentBid || car.auction.startingBid)}
                                                    </td>
                                                    <td>{car.auction.bidCount || 0}</td>
                                                    <td>
                                                        {car.auction.highestBidder ? (
                                                            <div style={{ fontSize: '0.85rem' }}>
                                                                <div style={{ fontWeight: 700 }}>{car.auction.highestBidder.split('@')[0]}</div>
                                                                <div style={{ color: 'var(--text-muted)' }}>{car.auction.highestBidder}</div>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: 'var(--text-muted)' }}>No bids</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEnded ? (
                                                            <span className="badge" style={{ background: '#fee2e2', color: '#ef4444' }}>Ended</span>
                                                        ) : (
                                                            <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>
                                                                Live ({Math.ceil(timeLeft / (1000 * 60))}m left)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {!isEnded && (
                                                            <button
                                                                onClick={() => handleEndAuction(car.id)}
                                                                className="action-btn"
                                                                style={{ background: 'var(--primary)', color: 'white' }}
                                                            >
                                                                End & Sell
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'transactions' && (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Vehicle</th>
                                            <th>Amount</th>
                                            <th>Customer Details</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionCars.length === 0 && (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#8898aa' }}>
                                                    No transactions recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                        {transactionCars.map(car => {
                                            // Determine customer details: either from direct purchase/reserve or highest bidder for sold auction cars
                                            let details = car.status === 'sold' ? car.buyerDetails : car.auction;

                                            if (!details && car.status === 'sold' && car.auction?.highestBidder) {
                                                details = {
                                                    name: car.auction.highestBidder.split('@')[0],
                                                    email: car.auction.highestBidder,
                                                    date: car.auction.endTime
                                                };
                                            }

                                            return (
                                                <tr key={car.id}>
                                                    <td>
                                                        <span className={`badge ${car.status === 'sold' ? 'badge-sold' : 'badge-reserved'}`} style={car.status === 'reserved' ? { background: '#fff7ed', color: '#c2410c' } : {}}>
                                                            {car.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 600, color: '#32325d' }}>{car.year} {car.make} {car.model}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#8898aa' }}>#{car.id}</div>
                                                    </td>
                                                    <td style={{ fontWeight: 700, color: car.status === 'sold' ? 'var(--primary)' : 'var(--secondary)' }}>
                                                        {formatPriceINR(car.priceINR)}
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 700, color: '#32325d' }}>{details?.name || 'VroomValue User'}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#8898aa', wordBreak: 'break-all' }}>{details?.email || 'user@example.com'}</div>
                                                    </td>
                                                    <td>
                                                        {details?.date ? new Date(details.date).toLocaleDateString() : 'Recent'}
                                                    </td>
                                                    <td>
                                                        {car.status.toLowerCase() === 'reserved' && (
                                                            <button
                                                                onClick={() => handleUnreserve(car.id)}
                                                                className="action-btn"
                                                                style={{ background: '#dc3545', color: 'white', border: 'none' }}
                                                            >
                                                                Unreserve
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* REVIEW MODAL */}
            {selectedRequest && (
                <div className={`modal-overlay ${selectedRequest ? 'active' : ''}`}>
                    <div className="modal-content">
                        <button onClick={closeReviewModal} className="modal-close-btn">&times;</button>

                        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Review Sell Request</h2>

                        <div className="review-grid">
                            {/* Left: Car Details */}
                            <div>
                                <h3 className="review-section-title">Vehicle Details</h3>
                                <div className="details-grid">
                                    <div><strong>Make:</strong> {selectedRequest.make}</div>
                                    <div><strong>Model:</strong> {selectedRequest.model}</div>
                                    <div><strong>Variant:</strong> {selectedRequest.variant}</div>
                                    <div><strong>Year:</strong> {selectedRequest.year}</div>
                                    <div><strong>City:</strong> {selectedRequest.city}</div>
                                    <div><strong>Fuel:</strong> {selectedRequest.fuel}</div>
                                    <div><strong>Trans:</strong> {selectedRequest.transmission}</div>
                                    <div><strong>Body:</strong> {selectedRequest.bodyType}</div>
                                    <div><strong>Engine:</strong> {selectedRequest.engineCapacity} cc</div>
                                    <div><strong>Mileage:</strong> {selectedRequest.mileageKmpl} kmpl</div>
                                    <div><strong>Seats:</strong> {selectedRequest.seats}</div>
                                    <div><strong>Color:</strong> {selectedRequest.color}</div>
                                    <div><strong>RTO:</strong> {selectedRequest.rto}</div>
                                    <div><strong>Insurance:</strong> {selectedRequest.insuranceValidity}</div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: selectedRequest.accidental ? '#fee2e2' : '#dcfce7', color: selectedRequest.accidental ? '#991b1b' : '#166534' }}>
                                        {selectedRequest.accidental ? 'Accidental' : 'Accident Free'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: selectedRequest.serviceHistory ? '#dcfce7' : '#fef9c3', color: selectedRequest.serviceHistory ? '#166534' : '#854d0e' }}>
                                        {selectedRequest.serviceHistory ? 'Full History' : 'Partial History'}
                                    </span>
                                </div>

                                <h3 className="review-section-title" style={{ marginTop: '20px' }}>Seller Description</h3>
                                <div className="description-box">
                                    {selectedRequest.description || "No description provided."}
                                </div>
                            </div>

                            {/* Right: Images and Admin Actions */}
                            <div>
                                <h3 className="review-section-title">Photos ({(selectedRequest.images?.length || 0)})</h3>
                                <div className="image-grid">
                                    {(selectedRequest.images || []).slice(0, 6).map((img, i) => (
                                        <div key={i} className="image-preview">
                                            <img src={img.src} alt="car" />
                                        </div>
                                    ))}
                                </div>

                                <div className="approval-box">
                                    <h4>Approval Settings</h4>

                                    <div className="form-group">
                                        <label className="form-label">Final Listing Price (INR)</label>
                                        <input
                                            type="number"
                                            value={reviewData.price}
                                            onChange={e => setReviewData({ ...reviewData, price: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Verified Odometer (Kms)</label>
                                        <input
                                            type="number"
                                            value={reviewData.kms}
                                            onChange={e => setReviewData({ ...reviewData, kms: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={handleApprove}
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                            disabled={processingIds.has(selectedRequest.id) || isRejectionProcessing}
                                        >
                                            {processingIds.has(selectedRequest.id) ? 'Publishing...' : 'Approve & Publish'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedRequest.id)}
                                            className="action-btn btn-delete"
                                            style={{ padding: '0 16px' }}
                                            disabled={processingIds.has(selectedRequest.id) || isRejectionProcessing}
                                        >
                                            {isRejectionProcessing ? 'Rejecting...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PRICE MODAL */}
            {editingCar && (
                <div className={`modal-overlay ${editingCar ? 'active' : ''}`}>
                    <div className="modal-content small">
                        <h3 style={{ marginTop: 0 }}>Update Price</h3>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>
                            Set a new price for <strong>{editingCar.make} {editingCar.model}</strong>
                        </p>

                        <input
                            type="number"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(e.target.value)}
                            className="form-input"
                            style={{ marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                            autoFocus
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setEditingCar(null)} className="action-btn" style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }}>Cancel</button>
                            <button onClick={confirmEditPrice} className="btn btn-primary" style={{ flex: 1 }}>Save Price</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL - REMOVED (Replaced by generic ConfirmModal) */}

            {/* START AUCTION MODAL */}
            {initiatingAuctionCar && (
                <div className={`modal-overlay ${initiatingAuctionCar ? 'active' : ''}`}>
                    <div className="modal-content small">
                        <h3 style={{ marginTop: 0 }}>Start Auction 🔨</h3>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>
                            {initiatingAuctionCar.year} {initiatingAuctionCar.make} {initiatingAuctionCar.model}
                        </p>

                        <div className="form-group">
                            <label className="form-label">Starting Bid (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={auctionConfig.startingBid}
                                onChange={e => setAuctionConfig({ ...auctionConfig, startingBid: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Duration</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Days"
                                        min="0"
                                        value={auctionConfig.days}
                                        onChange={e => setAuctionConfig({ ...auctionConfig, days: e.target.value })}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', textAlign: 'center' }}>Days</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Hours"
                                        min="0"
                                        max="23"
                                        value={auctionConfig.hours}
                                        onChange={e => setAuctionConfig({ ...auctionConfig, hours: e.target.value })}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', textAlign: 'center' }}>Hours</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Mins"
                                        min="0"
                                        max="59"
                                        value={auctionConfig.minutes}
                                        onChange={e => setAuctionConfig({ ...auctionConfig, minutes: e.target.value })}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', textAlign: 'center' }}>Mins</div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reserve Price (₹) - Optional</label>
                            <input
                                type="number"
                                className="form-input"
                                value={auctionConfig.reservePrice}
                                onChange={e => setAuctionConfig({ ...auctionConfig, reservePrice: e.target.value })}
                                placeholder="Hidden minimum price"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                            <button onClick={() => setInitiatingAuctionCar(null)} className="action-btn" style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }}>Cancel</button>
                            <button onClick={confirmStartAuction} className="btn btn-primary" style={{ flex: 1 }}>Launch Auction</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                type={modal.type}
                onConfirm={modal.onConfirm}
                onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default AdminDashboard;
