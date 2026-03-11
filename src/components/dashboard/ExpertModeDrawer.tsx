import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BarChart2, UserCheck, MessageSquare, Users, Palette, Settings, Globe, TrendingUp, Presentation } from 'lucide-react';

interface ExpertModeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    children: React.ReactNode;
}

export function ExpertModeDrawer({ isOpen, onClose, activeTab, onTabChange, children }: ExpertModeDrawerProps) {
    const tabs = [
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'staff', label: 'Staff ROI', icon: UserCheck },
        { id: 'inbox', label: 'Inbox', icon: MessageSquare },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'treatments', label: 'Treatments', icon: Palette },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-[#0A0F1E] border-l border-white/5 shadow-2xl z-[101] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0A0F1E]/50 backdrop-blur-xl">
                            <div>
                                <h2 className="text-2xl font-black text-white italic flex items-center gap-3">
                                    <Globe className="w-8 h-8 text-[#00FFA3] animate-pulse" />
                                    EXPERT COMMAND
                                </h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Advanced Clinical Intelligence • Administrator Level</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-8 py-6 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#0A0F1E]/30">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onTabChange(tab.id)}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
                                            ${isActive 
                                                ? 'bg-[#00FFA3] text-black border-transparent shadow-[0_10px_20px_rgba(0,255,163,0.2)]' 
                                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(0,255,163,0.03),transparent)]">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </div>

                        {/* Footer Status */}
                        <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-700">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Live Metrics SYNC</span>
                                <span className="flex items-center gap-1.5"><Presentation className="w-3 h-3" /> HQ Remote Lock</span>
                            </div>
                            <span>Hanlan OC v2.4.0</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
