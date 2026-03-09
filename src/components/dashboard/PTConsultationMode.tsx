import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ArrowRight, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import BeforeAfterSlider from "../BeforeAfterSlider";

interface PTConsultationModeProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string;
    treatmentName: string;
    totalPrice: number;
    beforeImage: string;
    afterImage: string;
}

export function PTConsultationMode({
    isOpen,
    onClose,
    patientName,
    treatmentName,
    totalPrice,
    beforeImage,
    afterImage
}: PTConsultationModeProps) {
    const monthlyPayment = Math.round(totalPrice / 24);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[6000] bg-[#0A0A0C] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-10 py-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#007AFF]/10 rounded-2xl flex items-center justify-center border border-[#007AFF]/20">
                                <Sparkles className="w-6 h-6 text-[#007AFF]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">PT Discovery Mode</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consultation for:</span>
                                    <span className="text-[10px] font-bold text-[#007AFF] uppercase tracking-widest">{patientName}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 border border-white/10 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Pane - Visual Proof */}
                        <div className="w-1/2 p-12 border-r border-white/5 bg-[#1C1C1E]/30 flex flex-col justify-center">
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Visual Outcome Projection</h3>
                                <p className="text-xs text-gray-500 font-medium">Interactive comparison for {treatmentName}.</p>
                            </div>
                            <BeforeAfterSlider
                                beforeImage={beforeImage}
                                afterImage={afterImage}
                                beforeLabel="Initial State"
                                afterLabel="Projected Result"
                            />
                        </div>

                        {/* Right Pane - Financial Logic */}
                        <div className="w-1/2 p-12 flex flex-col justify-center">
                            <div className="max-w-md mx-auto w-full space-y-10">
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Treatment Investment</h3>
                                    <p className="text-xs text-gray-500 font-medium">Flexible financial options for your new smile.</p>
                                </div>

                                {/* Investment Card */}
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-[#007AFF]/20 transition-all" />

                                    <div className="flex items-center gap-3 mb-8">
                                        <CreditCard className="w-5 h-5 text-[#007AFF]" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Flexible Monthly Plan</span>
                                    </div>

                                    <div className="space-y-1 mb-8">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-white uppercase">From</span>
                                            <span className="text-7xl font-display font-black text-[#007AFF] tracking-tighter">£{monthlyPayment}</span>
                                            <span className="text-xs font-bold text-gray-500 uppercase">/month</span>
                                        </div>
                                        <p className="text-[10px] text-[#00FFA3] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <ShieldCheck className="w-3 h-3" />
                                            0% Interest-Free Finance Included
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-10">
                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]/50" />
                                            24 Months Term
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]/50" />
                                            Total Investment: £{totalPrice.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
                                            Approval in 30 Seconds
                                        </div>
                                    </div>

                                    <button className="w-full py-6 bg-gradient-to-r from-[#007AFF] to-[#0055FF] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-3xl hover:shadow-[0_0_40px_rgba(0,122,255,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 group">
                                        Confirm Treatment Plan
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>

                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#00FFA3]/10 rounded-full flex items-center justify-center">
                                        <Check className="w-5 h-5 text-[#00FFA3]" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                        "I understand this projection is a clinical target and my actual result may vary based on my biological response."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
