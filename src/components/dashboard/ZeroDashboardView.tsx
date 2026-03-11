import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsultationRequest } from '../../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import { MessageCircle, Send, X, Cloud, Sparkles, AlertTriangle, ArrowUp, ChevronDown } from 'lucide-react';
import { CSVImportZone } from '../CSVImportZone';
import confetti from 'canvas-confetti';

const Shield = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.856.12-1.685.344-2.47" />
    </svg>
);

const CheckCircle2 = ({ className, strokeWidth = 3 }: { className?: string; strokeWidth?: number }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface ZeroDashboardViewProps {
    leads: ConsultationRequest[];
    clinicId: string;
    specialty?: string | null;
    onStatusChange: (leadId: string, newStatus: string) => Promise<void>;
    onImportComplete: () => void;
}

// ──────────────────────────────────────────────────────────
// 1. FORCED WORKFLOW CARD (Dopamine-Driven Action)
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

    const triggerSuccess = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00FFA3', '#87A96B', '#ffffff']
        });
        onAction(lead);
    };

    return (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)', transition: { duration: 0.4 } }}
            className="w-full max-w-[450px] aspect-[3/4] bg-white rounded-[64px] p-12 relative shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col justify-between overflow-hidden"
        >
            {/* Urgency Pulse */}
            <div className="absolute inset-0 rounded-[64px] border-4 border-[#00FFA3]/20 animate-pulse pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B]">Urgent Opportunity</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{lead.name}</h3>
                    </div>
                    {isVIP && (
                        <div className="p-3 bg-amber-100 rounded-2xl">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                        </div>
                    )}
                </div>

                <div className="mb-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{lead.service}</p>
                    <p className="text-gray-900 font-black text-6xl tabular-nums tracking-tighter">
                        £{value.toLocaleString()}
                    </p>
                    {lead.intent_score && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#00FFA3]/10 text-[#008F5B] rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Shield className="w-3 h-3" /> AI Intent: {lead.intent_score}%
                        </div>
                    )}
                </div>
                
                {lead.ai_summary && (
                    <div className="bg-gray-50 p-6 rounded-[32px] border border-black/5">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                            "{lead.ai_summary}"
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-4 relative z-10">
                <button 
                    onClick={triggerSuccess}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest py-7 rounded-[32px] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                >
                    <MessageCircle className="w-6 h-6 text-[#00FFA3]" /> Send WhatsApp
                </button>
                <button 
                    onClick={onNext}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 py-2 transition-colors"
                >
                    Skip to Next
                </button>
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

    const activeLeads = useMemo(() => {
        return leads
            .filter(l => l.status === "New Lead")
            .sort((a, b) => (b.intent_score || 0) - (a.intent_score || 0));
    }, [leads]);

    const currentLead = activeLeads[currentIndex];

    const handleNext = () => {
        if (currentIndex < activeLeads.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="flex flex-col items-center justify-center space-y-12">
                
                <AnimatePresence mode="wait">
                    {currentLead ? (
                        <div key="card-container" className="relative">
                            {/* Visual Stacking Effect */}
                            {activeLeads.length > 1 && (
                                <div className="absolute top-4 left-4 right-4 bottom-[-16px] bg-gray-200 rounded-[64px] -z-10 opacity-50 scale-95" />
                            )}
                            <DecisionCard 
                                lead={currentLead} 
                                onAction={setWhatsappModalLead} 
                                onNext={handleNext}
                            />
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[64px] p-24 text-center border border-black/5 shadow-xl max-w-lg"
                        >
                            <div className="w-24 h-24 bg-[#00FFA3]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="w-12 h-12 text-[#00FFA3]" strokeWidth={3} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Zero Debt.</h2>
                            <p className="text-gray-500 font-medium mt-4 leading-relaxed">
                                You've processed all urgent leads. <br/> Your pipeline is clean.
                            </p>
                            <button 
                                onClick={() => setCurrentIndex(0)}
                                className="mt-12 text-xs font-black uppercase tracking-[0.2em] text-[#87A96B] hover:text-gray-900 transition-colors"
                            >
                                Refresh Queue
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* WHATSAPP MODAL */}
            <AnimatePresence>
                {whatsappModalLead && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ y: 50, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 50, scale: 0.95 }}
                            className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl border border-black/5"
                        >
                            <div className="p-10 border-b border-black/5 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Draft Response</h3>
                                </div>
                                <button onClick={() => setWhatsappModalLead(null)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            
                            <div className="p-12 space-y-8">
                                <div className="bg-gray-50 rounded-[32px] p-8 text-gray-700 text-lg leading-relaxed border border-black/5 font-medium">
                                    {`Hi ${whatsappModalLead.name.split(' ')[0]},\n\nI saw you were looking at our ${whatsappModalLead.service} options. ${whatsappModalLead.ai_summary ? `\n\nRegarding your interest: ${whatsappModalLead.ai_summary}\n` : ''}\nWould you like me to send over our 0% finance details?`}
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        const phone = whatsappModalLead.phone || '';
                                        const text = encodeURIComponent(`Hi ${whatsappModalLead.name.split(' ')[0]},\n\nI saw you were looking at our ${whatsappModalLead.service} options...`);
                                        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                        setWhatsappModalLead(null);
                                        handleNext();
                                    }}
                                    className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-black uppercase tracking-widest py-8 rounded-[32px] transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(37,211,102,0.2)] text-lg"
                                >
                                    Confirm & Open WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


