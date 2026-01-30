
import React, { useState, useEffect, useRef } from 'react';
import { getSupportAnswer } from '../utils/supportLogic';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your VroomValue Assistant. Ask me anything about buying or selling cars!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const send = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        setTimeout(() => {
            const botResponse = getSupportAnswer(input);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
        }, 800);
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '25px', right: '25px',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'var(--primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
                    zIndex: 2000, fontSize: '1.8rem',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                className="chat-toggle"
            >
                {isOpen ? '×' : '💬'}
            </div>

            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '100px', right: '25px',
                    width: '350px', height: '480px', background: 'white',
                    borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        color: 'white'
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>VroomValue Support</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online • AI Assistant</div>
                    </div>

                    <div
                        ref={scrollRef}
                        style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                        {messages.map(m => (
                            <div key={m.id} style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%'
                            }}>
                                <div style={{
                                    padding: '12px 16px', borderRadius: m.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: m.sender === 'user' ? 'var(--primary)' : 'white',
                                    color: m.sender === 'user' ? 'white' : 'var(--text-main)',
                                    boxShadow: m.sender === 'user' ? '0 4px 12px rgba(79, 70, 229, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={send} style={{ padding: '15px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                        <input
                            style={{
                                flex: 1, padding: '12px 18px', border: '1px solid #e2e8f0', borderRadius: '30px',
                                outline: 'none', fontSize: '0.95rem', transition: 'all 0.3s'
                            }}
                            className="chat-input"
                            value={input} onChange={e => setInput(e.target.value)}
                            placeholder="Ask about buying, selling..."
                        />
                        <button
                            type="submit"
                            style={{
                                width: '45px', height: '45px', borderRadius: '50%',
                                background: 'var(--primary)', color: 'white',
                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            →
                        </button>
                    </form>

                    <style>{`
                        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                        .chat-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
                        .chat-toggle:hover { transform: scale(1.1) rotate(5deg); }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
