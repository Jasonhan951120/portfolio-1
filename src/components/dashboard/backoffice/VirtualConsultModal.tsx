import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, ExternalLink, Calendar, Copy, ChevronRight, Zap } from 'lucide-react';

interface VirtualConsultModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadName: string;
    hasAppointment: boolean;
    appointmentTime?: string;
}

export function VirtualConsultModal({ isOpen, onClose, leadName, hasAppointment, appointmentTime }: VirtualConsultModalProps) {
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
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[210] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_4px_16px_rgba(0,0,0,0.03),_0_24px_64px_rgba(0,0,0,0.04)] border-[0.5px] border-slate-200/60 pointer-events-auto overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-8 pb-0 flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <Video className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-100">Virtual Care</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{leadName}</h2>
                                    <p className="text-sm text-slate-500 font-medium">Remote Consultation Hub</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Main Content */}
                            <div className="p-8">
                                {!hasAppointment ? (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Calendar className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mb-1">No scheduled session found</p>
                                            <p className="text-xs text-slate-400">Generate a secure link to invite this lead.</p>
                                        </div>

                                        <button className="w-full py-5 bg-white border-2 border-cyan-500/20 rounded-[24px] text-cyan-600 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 ring-4 ring-cyan-500/10 hover:ring-cyan-500/20 hover:bg-cyan-50/30 transition-all group overflow-hidden relative active:scale-95">
                                            <motion.div 
                                              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent"
                                              animate={{ x: ['-200%', '200%'] }}
                                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                            <Zap className="w-4 h-4" />
                                            비대면 상담 링크 생성
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 text-center pt-4">
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live at</p>
                                          <div className="tabular-nums text-6xl font-black text-slate-900 tracking-tighter">
                                              {appointmentTime || "14:30"}
                                          </div>
                                        </div>

                                        <div className="space-y-3">
                                          <button className="w-full py-6 bg-[#87A96B] hover:bg-[#7a9960] shadow-[0_20px_40px_rgba(135,169,107,0.2)] rounded-[28px] text-white font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                                              상담방 입장하기
                                              <ChevronRight className="w-6 h-6" />
                                          </button>
                                          
                                          <div className="flex justify-center gap-6">
                                              <button className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors">
                                                  <Copy className="w-3.5 h-3.5" />
                                                  링크 복사
                                              </button>
                                              <button className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors">
                                                  <Calendar className="w-3.5 h-3.5" />
                                                  일정 변경
                                              </button>
                                          </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Safety Badge */}
                            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3 justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted Tunnel</span>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
