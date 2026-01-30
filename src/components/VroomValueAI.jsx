
import React, { useState, useRef, useEffect } from 'react';
import { analyzeRequest } from '../utils/aiLogic';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'; // Ensure we have styles

const VroomValueAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I am VroomValue AI. Tell me what kind of car you are looking for.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        const result = await analyzeRequest(userMsg);

        // Restore simple simulated delay
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { type: 'bot', text: result.message, cars: result.cars }
            ]);
            setIsTyping(false);
        }, 800);
    };

    // Simple Markdown Parser for UI
    const renderText = (text) => {
        if (!text) return null;
        // Split by ** and map to bold tags
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ fontWeight: '800', color: 'var(--primary)' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // Styling for the orb and chat window
    const styles = {
        container: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontFamily: 'var(--font-family)'
        },
        orb: {
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative'
        },
        chatWindow: {
            width: '380px',
            height: '550px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(25px)',
            borderRadius: '24px',
            marginBottom: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'bottom right',
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
            opacity: isOpen ? 1 : 0
        },
        header: {
            padding: '20px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            fontWeight: '800',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        body: {
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.2)'
        },
        inputArea: {
            padding: '16px',
            background: 'white',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            gap: '10px'
        },
        botMsg: {
            alignSelf: 'flex-start',
            background: 'white',
            padding: '12px 16px',
            borderRadius: '20px 20px 20px 4px',
            maxWidth: '85%',
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
        },
        userMsg: {
            alignSelf: 'flex-end',
            background: 'var(--primary)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '20px 20px 4px 20px',
            maxWidth: '85%',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px var(--primary-glow)',
            lineHeight: '1.5'
        },
        carCard: {
            background: 'white',
            padding: '12px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginTop: '10px',
            cursor: 'pointer',
            border: '1px solid #f1f5f9',
            transition: 'all 0.2s ease'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatWindow}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></div>
                        <span style={{ letterSpacing: '0.5px' }}>VROOMVALUE AI</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>

                <div style={styles.body} className="ai-chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={msg.type === 'user' ? styles.userMsg : styles.botMsg}>
                                {renderText(msg.text)}
                            </div>
                            {msg.cars && (
                                <div style={{ width: '100%', marginTop: '8px' }}>
                                    {msg.cars.map(car => (
                                        <div
                                            key={car.id}
                                            style={styles.carCard}
                                            className="ai-car-recommendation"
                                            onClick={() => navigate(`/car/${car.id}`)}
                                        >
                                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>{car.year} {car.make} {car.model}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>₹{car.priceINR.toLocaleString()} • {car.kms} km</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ ...styles.botMsg, display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <div className="dot-typing"></div>
                            <div className="dot-typing"></div>
                            <div className="dot-typing"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form style={styles.inputArea} onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search for your dream car..."
                        style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s' }}
                    />
                    <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--primary-glow)', cursor: 'pointer' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>

            <div
                style={styles.orb}
                className={`ai-trigger-orb ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="orb-icon-wrapper">
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    )}
                </div>
            </div>

            <style>
                {`
                .ai-trigger-orb {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    box-shadow: 0 10px 30px var(--primary-glow);
                }
                .ai-trigger-orb:hover {
                    transform: scale(1.08) translateY(-5px) !important;
                    box-shadow: 0 15px 45px var(--primary-glow);
                }
                .ai-trigger-orb.active {
                    background: var(--text-main);
                    transform: scale(0.9) !important;
                }
                .orb-icon-wrapper {
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   transition: transform 0.4s ease;
                }
                .ai-trigger-orb.active .orb-icon-wrapper {
                    transform: rotate(90deg);
                }
                .dot-typing {
                    width: 6px;
                    height: 6px;
                    background: var(--text-muted);
                    border-radius: 50%;
                    animation: dotPulse 1.5s infinite ease-in-out;
                }
                .dot-typing:nth-child(2) { animation-delay: 0.2s; }
                .dot-typing:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dotPulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.4); opacity: 1; }
                }
                .ai-car-recommendation {
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .ai-car-recommendation:hover {
                    transform: translateX(5px);
                    border-color: var(--primary);
                    background: #f8fafc;
                }
                .ai-chat-body::-webkit-scrollbar {
                    width: 5px;
                }
                .ai-chat-body::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                `}
            </style>
        </div>
    );
};

export default VroomValueAI;
