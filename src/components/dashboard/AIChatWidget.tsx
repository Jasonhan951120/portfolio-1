import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Minus, Maximize2 } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const AIChatWidget: React.FC = () => {
    const { isAIChatOpen, setIsAIChatOpen, clinicName } = useDashboardStore();
    const [message, setMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleChat = () => {
        setIsAIChatOpen(!isAIChatOpen);
        if (isMinimized) setIsMinimized(false);
    };

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="fixed bottom-8 right-8 z-[9999] w-14 h-14 bg-slate-950 text-white rounded-full shadow-2xl flex items-center justify-center group border border-white/10 hover:border-emerald-500/50 transition-colors"
                title="Hanlan AI Concierge"
            >
                <AnimatePresence mode="wait">
                    {isAIChatOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="relative"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isAIChatOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }}
                        className="fixed bottom-24 right-8 z-[9998] w-[360px] h-[520px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col overflow-hidden font-inter"
                    >
                        {/* Header */}
                        <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-tight">AI Concierge</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active & Secure</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Minus className="w-4 h-4 opacity-50" />
                                </button>
                                <button 
                                    onClick={() => setIsAIChatOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 opacity-50" />
                                </button>
                            </div>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hanlan AI</span>
                                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                                    <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                                        Welcome back to {clinicName || 'Hanlan OC'}. I am your VIP Clinical Concierge. How can I assist you with patient pipeline optimization or global settings today?
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/5 transition-all"
                                />
                                <button className="absolute right-2 w-8 h-8 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-3 opacity-50">
                                Protected by Hanlan Security Layer
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
