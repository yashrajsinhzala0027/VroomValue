import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const CarHealthScore = ({ score = 92, engine = 95, body = 88, interior = 94 }) => {
    const getLevel = (s) => s > 90 ? 'Excellent' : s > 80 ? 'Good' : 'Fair';
    const getColor = (s) => s > 90 ? 'var(--primary)' : s > 80 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div className="glass-panel trust-report-card page-enter">
            <div className="carousel-header" style={{ marginBottom: '24px', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Vehicle Trust Report</h3>
                <span className="badge badge-verified">Verified Score</span>
            </div>

            <div className="health-score-container">
                <div className="health-meter-ring" style={{ borderTopColor: getColor(score), boxShadow: `0 8px 32px ${getColor(score)}15` }}>
                    <span className="health-score-value" style={{ color: getColor(score) }}>{Math.round(score)}</span>
                    <span className="health-score-label">TRUST SCORE</span>
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px', color: 'var(--secondary)' }}>Condition: {getLevel(score)}</p>
                    <p className="overview-text" style={{ fontSize: '0.9rem', opacity: 0.8 }}>Comprehensive 150+ point diagnostic scan completed by VroomValue AI-Inspectors.</p>
                </div>
            </div>

            <div className="health-stat-grid">
                {[
                    { label: 'Power & Drive', val: engine },
                    { label: 'Exterior Shell', val: body },
                    { label: 'Elite Cabin', val: interior }
                ].map(item => (
                    <div key={item.label} className="health-stat-card">
                        <span className="health-stat-label">{item.label}</span>
                        <div className="health-progress-bg">
                            <div className="health-progress-fill" style={{ width: `${item.val}%`, background: `linear-gradient(to right, ${getColor(item.val)}99, ${getColor(item.val)})` }}></div>
                        </div>
                        <span style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '0.9rem' }}>{item.val}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ResalePredictor = ({ currentPrice }) => {
    // Return null if price is not available or invalid to prevent chart errors
    if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) {
        return null;
    }

    const data = [
        { year: 'Now', value: currentPrice },
        { year: '2025', value: Math.round(currentPrice * 0.88) },
        { year: '2026', value: Math.round(currentPrice * 0.78) },
        { year: '2027', value: Math.round(currentPrice * 0.70) }
    ];

    return (
        <div className="glass-panel page-enter" style={{ padding: '32px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px' }}>Value Projection Matrix</h3>

            <div style={{ width: '100%', height: '280px', minHeight: '280px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontWeight: 800, color: 'var(--primary)' }}
                            formatter={(val) => [`₹${(val / 100000).toFixed(2)}L`, 'Est. Market Value']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            dot={{ r: 6, fill: 'white', strokeWidth: 3, stroke: 'var(--primary)' }}
                            activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary)' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--primary-soft)', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>📈</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', margin: 0 }}>
                    High retention asset. This model has a 12% lower depreciation rate than its segment average.
                </p>
            </div>
        </div>
    );
};
