import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsultationRequest } from '../../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import { MessageCircle, Send, X, Sparkles, CheckCircle } from 'lucide-react';
import { CSVImportZone } from '../CSVImportZone';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ZeroDashboardViewProps {
    leads: ConsultationRequest[];
    clinicId: string;
    specialty?: string | null;
    onStatusChange: (leadId: string, newStatus: string) => Promise<void>;
    onImportComplete: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOT LEAD CARD  (Loss Aversion → Dopamine Reward state machine)
// ─────────────────────────────────────────────────────────────────────────────
function HotLeadCard({
    lead,
    onSend,
    onSkip,
}: {
    lead: ConsultationRequest;
    onSend: (l: ConsultationRequest) => void;
    onSkip: () => void;
}) {
    const [sent, setSent] = useState(false);
    const value = lead.potential_value || SERVICE_CONVERSION_VALUES[lead.service] || 1000;
    const isVIP = (lead.intent_score ?? 0) >= 80;

    const handleSend = () => {
        if (sent) return;

        // 1. CONFETTI – full-screen explosion
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.55 }, colors: ['#10b981', '#34d399', '#ffffff', '#fde047'] });
        setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors: ['#10b981', '#6ee7b7'] }), 300);

        // 2. Flip state → reward
        setSent(true);
        onSend(lead);
    };

    return (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -60, filter: 'blur(12px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className={`
                relative w-full max-w-[440px] bg-[#1E1E1E] rounded-[52px] p-10
                flex flex-col justify-between
                border-2 transition-all duration-700
                ${sent
                    ? 'border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
                    : 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.35),0_40px_80px_rgba(0,0,0,0.6)]'
                }
            `}
            style={{ minHeight: 480 }}
        >
            {/* Red urgency pulse ring – disappears when sent */}
            {!sent && (
                <div className="absolute inset-0 rounded-[52px] border-2 border-red-500/30 animate-pulse pointer-events-none" />
            )}
            {/* Green success glow ring */}
            {sent && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-[52px] border-2 border-emerald-500/50 pointer-events-none"
                />
            )}

            {/* ── HEADER ── */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className={`text-[9px] font-black uppercase tracking-[0.35em] mb-2 ${sent ? 'text-emerald-400' : 'text-red-400'}`}>
                            {sent ? '✓ Action Taken' : '⚡ Urgent Action Required'}
                        </p>
                        <h3 className="text-3xl font-black text-white tracking-tight leading-tight">{lead.name}</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{lead.service}</p>
                    </div>
                    {isVIP && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                    )}
                </div>

                {/* ── POTENTIAL VALUE ── */}
                <div className="mb-8">
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.25em] mb-1">Potential Revenue</p>
                    <p className={`font-black text-5xl tabular-nums tracking-tighter transition-colors duration-700 ${sent ? 'text-emerald-400' : 'text-white'}`}>
                        £{value.toLocaleString()}
                    </p>
                    {lead.intent_score != null && (
                        <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-700 ${sent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            AI Intent: {lead.intent_score}%
                        </div>
                    )}
                </div>

                {lead.ai_summary && (
                    <div className="bg-white/5 p-5 rounded-[28px] border border-white/8">
                        <p className="text-xs text-gray-400 leading-relaxed italic">"{lead.ai_summary}"</p>
                    </div>
                )}
            </div>

            {/* ── CTA ── */}
            <div className="space-y-3 relative z-10 mt-8">
                <motion.button
                    whileHover={!sent ? { scale: 1.02 } : {}}
                    whileTap={!sent ? { scale: 0.97 } : {}}
                    onClick={handleSend}
                    disabled={sent}
                    className={`
                        w-full font-black uppercase tracking-widest py-6 rounded-[28px]
                        transition-all duration-500 flex items-center justify-center gap-3 text-sm
                        ${sent
                            ? 'bg-emerald-500 text-white cursor-default shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                            : 'bg-white text-gray-900 hover:bg-gray-100 shadow-[0_20px_50px_rgba(255,255,255,0.1)]'
                        }
                    `}
                >
                    {sent ? (
                        <><CheckCircle className="w-5 h-5" /> Sent Successfully</>
                    ) : (
                        <><MessageCircle className="w-5 h-5" /> Send WhatsApp AI Draft</>
                    )}
                </motion.button>

                {!sent && (
                    <button
                        onClick={onSkip}
                        className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 py-2 transition-colors"
                    >
                        Skip to Next →
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function ZeroDashboardView({ leads, clinicId, specialty, onStatusChange, onImportComplete }: ZeroDashboardViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sentLeads, setSentLeads] = useState<Set<string>>(new Set());
    const [whatsappModalLead, setWhatsappModalLead] = useState<ConsultationRequest | null>(null);

    const activeLeads = useMemo(() =>
        leads
            .filter(l => l.status === 'New Lead')
            .sort((a, b) => (b.intent_score ?? 0) - (a.intent_score ?? 0)),
        [leads]
    );

    // Loss aversion metric
    const totalAtRisk = useMemo(() =>
        activeLeads.reduce((sum, l) => sum + (l.potential_value || SERVICE_CONVERSION_VALUES[l.service] || 1000), 0),
        [activeLeads]
    );

    const totalSecured = useMemo(() =>
        activeLeads
            .filter(l => sentLeads.has(l.id))
            .reduce((sum, l) => sum + (l.potential_value || SERVICE_CONVERSION_VALUES[l.service] || 1000), 0),
        [activeLeads, sentLeads]
    );

    const allSent = sentLeads.size > 0 && sentLeads.size >= activeLeads.length;
    const currentLead = activeLeads[currentIndex];

    const handleSend = (lead: ConsultationRequest) => {
        setSentLeads(prev => new Set([...prev, lead.id]));
        setWhatsappModalLead(lead);
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < activeLeads.length - 1 ? prev + 1 : 0));
    };

    const heroState = allSent ? 'secured' : totalSecured > 0 ? 'partial' : 'risk';

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

            {/* Ambient gradient */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${heroState === 'secured' ? 'bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_65%)]' : 'bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.07),transparent_65%)]'}`} />

            {/* ── HERO METRIC ── */}
            <motion.div
                layout
                className="text-center mb-14 relative z-10"
            >
                <AnimatePresence mode="wait">
                    {heroState === 'secured' ? (
                        <motion.div
                            key="secured"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        >
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">
                                🎉 Pipeline Clear
                            </p>
                            <div className="font-black tabular-nums leading-none text-emerald-400"
                                style={{ fontSize: 'clamp(3rem, 12vw, 7rem)' }}>
                                £{totalSecured.toLocaleString()}
                            </div>
                            <p className="text-emerald-500/70 font-black text-sm uppercase tracking-widest mt-3">
                                Revenue Secured
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="risk"
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                        >
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-400/80 mb-4">
                                ⚠️ Money At Risk Today
                            </p>
                            <div className="font-black tabular-nums leading-none text-white"
                                style={{ fontSize: 'clamp(3rem, 12vw, 7rem)' }}>
                                £{totalAtRisk.toLocaleString()}
                            </div>
                            {totalSecured > 0 && (
                                <p className="text-emerald-400/70 font-bold text-sm mt-3">
                                    £{totalSecured.toLocaleString()} secured so far ↗
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── CARD STACK ── */}
            <div className="relative z-10 flex flex-col items-center w-full">
                <AnimatePresence mode="wait">
                    {currentLead ? (
                        <div key={`stack-${currentIndex}`} className="relative">
                            {/* Ghost cards behind */}
                            {activeLeads.length > 1 && (
                                <div className="absolute inset-x-4 -bottom-4 h-full bg-white/5 rounded-[52px] -z-10 scale-95" />
                            )}
                            {activeLeads.length > 2 && (
                                <div className="absolute inset-x-8 -bottom-8 h-full bg-white/3 rounded-[52px] -z-20 scale-90" />
                            )}
                            <HotLeadCard
                                lead={currentLead}
                                onSend={handleSend}
                                onSkip={handleNext}
                            />
                        </div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white">All Clear.</h2>
                            <p className="text-gray-500 mt-3">No new leads require action right now.</p>
                            <button
                                onClick={() => setCurrentIndex(0)}
                                className="mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-colors"
                            >
                                Refresh Queue
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Queue counter */}
                {activeLeads.length > 0 && (
                    <p className="mt-8 text-[9px] font-black uppercase tracking-[0.25em] text-gray-700">
                        {currentIndex + 1} of {activeLeads.length} leads
                    </p>
                )}
            </div>

            {/* ── WHATSAPP MODAL ── */}
            <AnimatePresence>
                {whatsappModalLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 60, scale: 0.93 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 60, scale: 0.93 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-[#1A1A1A] border border-white/10 w-full max-w-lg rounded-[44px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/8 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Sending to</p>
                                        <p className="text-white font-black text-lg leading-tight">{whatsappModalLead.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setWhatsappModalLead(null); handleNext(); }} className="p-2 hover:bg-white/8 rounded-full transition-all">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="bg-[#25D366]/8 border border-[#25D366]/20 rounded-[28px] p-7 text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-medium">
                                    {`Hi ${whatsappModalLead.name.split(' ')[0]},\n\nI noticed you were interested in ${whatsappModalLead.service}. ${whatsappModalLead.ai_summary ? `\n\n"${whatsappModalLead.ai_summary}"\n` : ''}\nWould you like me to send over our 0% finance options or book a quick chat?`}
                                </div>

                                <button
                                    onClick={() => {
                                        const phone = whatsappModalLead.phone || '';
                                        const text = encodeURIComponent(`Hi ${whatsappModalLead.name.split(' ')[0]}, I noticed you were interested in ${whatsappModalLead.service}...`);
                                        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                        setWhatsappModalLead(null);
                                        handleNext();
                                    }}
                                    className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-black uppercase tracking-widest py-7 rounded-[28px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,211,102,0.35)] text-base"
                                >
                                    <Send className="w-5 h-5" /> Open WhatsApp & Send
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
