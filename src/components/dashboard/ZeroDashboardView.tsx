import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConsultationRequest } from '../../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import { MessageCircle, Send, X, Cloud, Sparkles, AlertTriangle, ArrowUp, ChevronDown } from 'lucide-react';
import { CSVImportZone } from '../CSVImportZone';

interface ZeroDashboardViewProps {
    leads: ConsultationRequest[];
    clinicId: string;
    specialty?: string | null;
    onStatusChange: (leadId: string, newStatus: string) => Promise<void>;
    onImportComplete: () => void;
}

// ──────────────────────────────────────────────────────────
// 1. FORCED WORKFLOW CARD (Instagram/Tinder Style)
// ──────────────────────────────────────────────────────────
function DecisionCard({ 
    lead, 
    onAction, 
    onNext 
}: { 
    lead: ConsultationRequest, 
    onAction: (l: ConsultationRequest) => void, 
    onNext: () => void 
}) {
    const value = lead.potential_value || SERVICE_CONVERSION_VALUES[lead.service] || 1000;
    const isVIP = lead.intent_score && lead.intent_score >= 80;

    return (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9, transition: { duration: 0.3 } }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, info) => {
                if (info.offset.y < -100) {
                    onNext(); // Swipe up for next
                }
            }}
            className="w-full max-w-[450px] aspect-[3/4] bg-[#1E1E1E] rounded-[48px] p-10 relative cursor-grab active:cursor-grabbing select-none shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col justify-between"
        >
            {/* Urgency Pulse */}
            <div className="absolute inset-0 rounded-[48px] border-2 border-red-500/30 animate-pulse pointer-events-none" />

            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FFA3]">Action Required</p>
                        <h3 className="text-3xl font-black text-white tracking-tight leading-tight">{lead.name}</h3>
                    </div>
                    {isVIP && (
                        <span className="px-3 py-1.5 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FFD700]/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> VIP
                        </span>
                    )}
                </div>

                <div className="mb-8">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{lead.service}</p>
                    <p className="text-[#00FFA3] font-black text-5xl tabular-nums drop-shadow-[0_0_20px_rgba(0,255,163,0.2)]">
                        £{value.toLocaleString()}
                    </p>
                </div>
                
                {lead.ai_summary && (
                    <div className="bg-white/5 p-5 rounded-[28px] border border-white/10">
                        <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                            "{lead.ai_summary}"
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => onAction(lead)}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-black uppercase tracking-widest py-6 rounded-[24px] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(37,211,102,0.3)]"
                >
                    <MessageCircle className="w-6 h-6" /> Message on WhatsApp
                </button>
                <div className="flex justify-center flex-col items-center opacity-40 gap-1 pt-2">
                    <ArrowUp className="w-4 h-4 animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Swipe up to Skip</span>
                </div>
            </div>
        </motion.div>
    );
}

// ──────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────
export function ZeroDashboardView({ leads, clinicId, specialty, onStatusChange, onImportComplete }: ZeroDashboardViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [whatsappModalLead, setWhatsappModalLead] = useState<ConsultationRequest | null>(null);

    // 1. Focus ONLY on actionable new leads
    const activeLeads = useMemo(() => {
        return leads
            .filter(l => l.status === "New Lead")
            .sort((a, b) => (b.intent_score || 0) - (a.intent_score || 0));
    }, [leads]);

    const currentLead = activeLeads[currentIndex];

    // 2. Compute Loss Aversion Metric
    const totalPotentialLoss = useMemo(() => {
        return activeLeads.reduce((sum, l) => sum + (l.potential_value || SERVICE_CONVERSION_VALUES[l.service] || 1000), 0);
    }, [activeLeads]);

    const handleNext = () => {
        if (currentIndex < activeLeads.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Cycle back or show completion
            setCurrentIndex(0);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#121212] overflow-hidden selection:bg-[#00FFA3]/30 selection:text-white">
            {/* Depth Gradients */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(0,255,163,0.05),transparent_70%)]" />
            
            <div className="relative z-10 flex flex-col h-screen max-w-[1400px] mx-auto px-6 py-12">
                
                {/* 1. CONCLUSION (Loss Aversion) */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Money To Lose Today</p>
                    <h1 className="text-6xl md:text-8xl font-black text-[#00FFA3] tracking-tighter tabular-nums drop-shadow-[0_0_50px_rgba(0,255,163,0.4)]">
                        £{totalPotentialLoss.toLocaleString()}
                    </h1>
                </motion.div>

                {/* 2. THE DECISION (1 Thing 1 Page) */}
                <div className="flex-1 flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {currentLead ? (
                            <DecisionCard 
                                lead={currentLead} 
                                onAction={setWhatsappModalLead} 
                                onNext={handleNext}
                            />
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-[#00FFA3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-[#00FFA3]" />
                                </div>
                                <h2 className="text-3xl font-black text-white">All Caught Up!</h2>
                                <p className="text-gray-500 font-medium">You've reviewed every high-value opportunity.</p>
                                <button 
                                    onClick={() => setCurrentIndex(0)}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#00FFA3] hover:underline"
                                >
                                    Review Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. THE FUEL (Dropzone) */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-12 max-w-sm mx-auto w-full opacity-60 hover:opacity-100 transition-opacity"
                >
                     <div className="bg-[#1E1E1E] rounded-[32px] p-1 border-2 border-dashed border-white/10 hover:border-[#00FFA3]/30 transition-colors">
                         <CSVImportZone 
                            clinicId={clinicId} 
                            specialty={specialty}
                            onImportComplete={onImportComplete}
                         />
                     </div>
                     <p className="text-center text-[9px] font-black uppercase tracking-widest text-gray-600 mt-4">Feed the System (Drop CSV)</p>
                </motion.div>
            </div>

            {/* WHATSAPP MODAL */}
            <AnimatePresence>
                {whatsappModalLead && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ y: 100, scale: 0.9 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 100, scale: 0.9 }}
                            className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-black text-white flex items-center gap-2 text-xl italic">
                                    <MessageCircle className="w-6 h-6 text-[#25D366]" /> WHATSAPP DRAFT
                                </h3>
                                <button onClick={() => setWhatsappModalLead(null)} className="p-3 text-gray-500 hover:text-white bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-10">
                                <div className="space-y-1 mb-8">
                                    <p className="text-[10px] font-black text-[#00FFA3] uppercase tracking-[0.2em]">Contacting</p>
                                    <p className="text-2xl font-black text-white">{whatsappModalLead.name}</p>
                                </div>

                                <div className="bg-[#242424] rounded-[28px] p-8 text-gray-200 text-lg leading-relaxed border border-white/5 whitespace-pre-wrap font-medium">
                                    {`Hi ${whatsappModalLead.name.split(' ')[0]},\n\nI saw you were looking at our ${whatsappModalLead.service} options. ${whatsappModalLead.ai_summary ? `\nRegarding your interest: ${whatsappModalLead.ai_summary}\n` : ''}\nWould you like me to send over our 0% finance details or check availability for a quick chat?`}
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        const phone = whatsappModalLead.phone || '';
                                        const text = encodeURIComponent(`Hi ${whatsappModalLead.name.split(' ')[0]},\n\nI saw you were looking at our ${whatsappModalLead.service} options...`);
                                        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                        setWhatsappModalLead(null);
                                        handleNext(); // Move to next after action
                                    }}
                                    className="w-full mt-10 bg-[#25D366] hover:bg-[#1EBE55] text-white font-black uppercase tracking-widest py-7 rounded-[28px] transition-colors flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,211,102,0.4)] text-lg"
                                >
                                    <Send className="w-6 h-6" /> Send & Move Next
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper icons missing in imports
const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
