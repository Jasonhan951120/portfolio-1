import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Users, ShieldCheck } from 'lucide-react';
import { type ConsultationRequest } from '../../../lib/supabase';

interface WaitlistPanelProps {
    isOpen: boolean;
    onClose: () => void;
    waitlist: ConsultationRequest[];
    onInvite: (id: string) => void;
    onBroadcast: () => void;
    isBroadcasting: boolean;
    timeAgo: (dateStr: string) => string;
    treatmentValues: Record<string, number>;
}

export function WaitlistPanel({
    isOpen,
    onClose,
    waitlist,
    onInvite,
    onBroadcast,
    isBroadcasting,
    timeAgo,
    treatmentValues
}: WaitlistPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    exit={{ x: 400 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-[380px] bg-white border-l border-gray-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-[101] p-8 overflow-y-auto custom-scrollbar"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Smart Waitlist</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gap Filling Automation</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-black/5 hover:bg-black/5 rounded-2xl text-gray-900 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6 mb-24">
                        <div className="p-6 bg-blue-50/30 border border-blue-100/50 rounded-[28px] group">
                            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-2">Intelligence Pack</p>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">Slot Gap Filler</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed mb-6">We found a 2:00 PM slot tomorrow. Shall we notify matching patients?</p>
                            <button
                                onClick={onBroadcast}
                                disabled={isBroadcasting}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : null}
                                {isBroadcasting ? "Broadcasting..." : "Broadcast Availability"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-1 ml-1">
                                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Priority Waitlist</h4>
                                <span className="text-[9px] font-bold text-gray-400 bg-black/5 px-2 py-0.5 rounded-full">{waitlist.length} waiting</span>
                            </div>

                            <AnimatePresence>
                                {waitlist.length === 0 ? (
                                    <p className="text-[10px] text-gray-400 italic pb-4">No patients currently on the waitlist.</p>
                                ) : (
                                    waitlist.map(w => (
                                        <motion.div
                                            key={w.id}
                                            layout
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center group transition-all"
                                        >
                                            <div>
                                                <h5 className="font-bold text-gray-900 text-sm">{w.name}</h5>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{w.service}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="bg-white border border-black/5 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-900">
                                                    £{(treatmentValues[w.service] || 1000).toLocaleString()}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{timeAgo(w.created_at)}</span>
                                                    <button
                                                        onClick={() => onInvite(w.id)}
                                                        className="text-[9px] font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter underline ml-1"
                                                    >
                                                        Invite
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 p-4 bg-black/5 rounded-2xl border border-black/10">
                            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.5} />
                            <p className="text-[9px] text-gray-400 font-medium leading-tight select-none">HIPAA Compliant Automation Protocol active for all patient communications.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
