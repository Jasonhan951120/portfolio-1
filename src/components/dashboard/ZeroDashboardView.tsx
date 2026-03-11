import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsultationRequest } from '../../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import { MessageCircle, CheckCircle, Sparkles, X, Send, SkipForward } from 'lucide-react';
import { CSVImportZone } from '../CSVImportZone';
import confetti from 'canvas-confetti';
import { SecureHistoryToast } from './SecureHistoryToast';

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
// CONFETTI CANNON
// ─────────────────────────────────────────────────────────────────────────────
function fireConfetti() {
    // First burst – emerald + gold
    confetti({
        particleCount: 180,
        spread: 90,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#fde047', '#ffffff'],
        gravity: 0.9,
    });
    // Side cannons
    setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: ['#10b981', '#fff'] });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: ['#10b981', '#fff'] });
    }, 220);
    // Final shimmer
    setTimeout(() => {
        confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, scalar: 0.8, colors: ['#10b981', '#6ee7b7', '#fde047'] });
    }, 480);
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

        // 🎉 DOPAMINE REWARD: Multi-burst confetti
        fireConfetti();

        // Flip to reward state
        setSent(true);
        onSend(lead);
    };

    return (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, scale: 0.82, y: 70 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -70, filter: 'blur(16px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-[460px]"
            style={{ minHeight: 500 }}
        >
            {/* ── URGENCY PULSE RING (loss aversion, disappears when sent) ── */}
            <AnimatePresence>
                {!sent && (
                    <motion.div
                        exit={{ opacity: 0, scale: 1.15 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-[56px] border-2 border-red-500/50 animate-pulse pointer-events-none z-10"
                    />
                )}
            </AnimatePresence>

            {/* ── MAIN CARD ── */}
            <div
                className={`
                    relative w-full bg-[#1E1E1E] rounded-[56px] p-10
                    flex flex-col gap-8
                    border-2 transition-all duration-700 ease-out
                    ${sent
                        ? 'border-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.30),0_40px_90px_rgba(0,0,0,0.7)]'
                        : 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.50),0_40px_90px_rgba(0,0,0,0.7)]'
                    }
                `}
            >
                {/* Success glow overlay */}
                <AnimatePresence>
                    {sent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 rounded-[56px] bg-emerald-500/5 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* ── HEADER ── */}
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-3 transition-colors duration-700 ${sent ? 'text-emerald-400' : 'text-red-400'}`}>
                                {sent ? '✓ Revenue Secured' : '⚡ Urgent — Act Now'}
                            </p>
                            <h3 className="text-[2.2rem] font-black text-white tracking-tight leading-none">{lead.name}</h3>
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{lead.service}</p>
                        </div>
                        {isVIP && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── POTENTIAL VALUE ── */}
                <div className="relative z-10">
                    <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Potential Revenue</p>
                    <motion.p
                        animate={{ color: sent ? '#34d399' : '#ffffff' }}
                        transition={{ duration: 0.7 }}
                        className="font-black tabular-nums tracking-tighter"
                        style={{ fontSize: 'clamp(2.5rem, 9vw, 4.5rem)', lineHeight: 1 }}
                    >
                        £{value.toLocaleString()}
                    </motion.p>
                    {lead.intent_score != null && (
                        <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-700 ${sent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            AI Intent: {lead.intent_score}%
                        </div>
                    )}
                </div>

                {/* ── AI SUMMARY ── */}
                {lead.ai_summary && (
                    <div className="relative z-10 bg-white/[0.04] p-5 rounded-[28px] border border-white/8">
                        <p className="text-xs text-gray-400 leading-relaxed italic">"{lead.ai_summary}"</p>
                    </div>
                )}

                {/* ── GIANT CTA ── */}
                <div className="relative z-10 space-y-3 mt-auto">
                    <motion.button
                        id="send-whatsapp-btn"
                        whileHover={!sent ? { scale: 1.025, y: -2 } : {}}
                        whileTap={!sent ? { scale: 0.97 } : {}}
                        onClick={handleSend}
                        disabled={sent}
                        className={`
                            w-full font-black uppercase tracking-widest py-7 rounded-[28px]
                            transition-all duration-600 flex items-center justify-center gap-3 text-sm
                            ${sent
                                ? 'bg-emerald-500 text-white cursor-default shadow-[0_0_50px_rgba(16,185,129,0.5)]'
                                : 'bg-white text-gray-900 hover:bg-gray-50 shadow-[0_20px_60px_rgba(255,255,255,0.12)] hover:shadow-[0_24px_70px_rgba(255,255,255,0.18)]'
                            }
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {sent ? (
                                <motion.span
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Sent Successfully
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="send"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Send WhatsApp AI Draft
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {!sent && (
                        <button
                            onClick={onSkip}
                            className="w-full text-[9px] font-black uppercase tracking-[0.25em] text-gray-700 hover:text-gray-400 py-2 transition-colors flex items-center justify-center gap-2"
                        >
                            <SkipForward className="w-3 h-3" />
                            Skip to Next
                        </button>
                    )}
                </div>
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

    // ── TOAST STATE ──
    const [toast, setToast] = useState<{ visible: boolean; amount: number; total: number; prevTotal: number } | null>(null);

    const activeLeads = useMemo(() =>
        leads
            .filter(l => l.status === 'New Lead')
            .sort((a, b) => (b.intent_score ?? 0) - (a.intent_score ?? 0)),
        [leads]
    );

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
    const heroState: 'secured' | 'partial' | 'risk' = allSent ? 'secured' : totalSecured > 0 ? 'partial' : 'risk';

    const handleSend = (lead: ConsultationRequest) => {
        const leadValue = lead.potential_value || SERVICE_CONVERSION_VALUES[lead.service] || 1000;
        const prevTotal = activeLeads
            .filter(l => sentLeads.has(l.id))
            .reduce((sum, l) => sum + (l.potential_value || SERVICE_CONVERSION_VALUES[l.service] || 1000), 0);
        const newTotal = prevTotal + leadValue;

        setSentLeads(prev => new Set([...prev, lead.id]));
        setWhatsappModalLead(lead);

        // Trigger toast simultaneously with confetti (confetti fires in HotLeadCard)
        setToast({ visible: true, amount: leadValue, total: newTotal, prevTotal });
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < activeLeads.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

            {/* ── AMBIENT BACKGROUND GLOW ── */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-1500"
                style={{
                    background: heroState === 'secured'
                        ? 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(16,185,129,0.10) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse 80% 50% at 50% 10%, rgba(239,68,68,0.09) 0%, transparent 70%)'
                }}
            />

            {/* ── HERO METRIC ── */}
            <div className="text-center mb-14 relative z-10 w-full max-w-[460px]">
                <AnimatePresence mode="wait">
                    {heroState === 'secured' ? (
                        <motion.div
                            key="secured"
                            initial={{ opacity: 0, scale: 0.75, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        >
                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-5">
                                🎉 Pipeline Clear — Today's Total
                            </p>
                            <div
                                className="font-black tabular-nums leading-none text-emerald-400"
                                style={{ fontSize: 'clamp(3.5rem, 14vw, 8rem)' }}
                            >
                                £{totalSecured.toLocaleString()}
                            </div>
                            <p className="text-emerald-500/60 font-black text-sm uppercase tracking-[0.3em] mt-4">
                                Revenue Secured ↗
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="risk"
                            initial={{ opacity: 0, scale: 0.75, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                        >
                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-400/80 mb-5">
                                ⚠ Money At Risk Today
                            </p>
                            <div
                                className="font-black tabular-nums leading-none text-white"
                                style={{ fontSize: 'clamp(3.5rem, 14vw, 8rem)' }}
                            >
                                £{totalAtRisk.toLocaleString()}
                            </div>
                            {totalSecured > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-emerald-400/70 font-bold text-sm mt-4"
                                >
                                    £{totalSecured.toLocaleString()} secured so far ↗
                                </motion.p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── SECURE HISTORY TOAST (below hero, above card) ── */}
            <div className="relative z-20 mb-6">
                {toast && (
                    <SecureHistoryToast
                        amount={toast.amount}
                        total={toast.total}
                        prevTotal={toast.prevTotal}
                        visible={toast.visible}
                        onDone={() => setToast(prev => prev ? { ...prev, visible: false } : null)}
                    />
                )}
            </div>

            {/* ── CARD AREA ── */}

            <div className="relative z-10 flex flex-col items-center w-full">
                <AnimatePresence mode="wait">
                    {currentLead ? (
                        <div key={`stack-${currentIndex}`} className="relative w-full flex justify-center">
                            {/* Ghost stack cards behind */}
                            {activeLeads.length > 1 && (
                                <div className="absolute inset-x-6 -bottom-3 h-full bg-white/[0.04] rounded-[56px] -z-10 scale-[0.96]" />
                            )}
                            {activeLeads.length > 2 && (
                                <div className="absolute inset-x-12 -bottom-6 h-full bg-white/[0.02] rounded-[56px] -z-20 scale-[0.92]" />
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
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-28"
                        >
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-3">All Clear.</h2>
                            <p className="text-gray-600">No new leads require action right now.</p>
                            <button
                                onClick={() => setCurrentIndex(0)}
                                className="mt-12 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 hover:text-white transition-colors"
                            >
                                Refresh Queue ↺
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Queue indicator dots */}
                {activeLeads.length > 1 && currentLead && (
                    <div className="flex gap-2 mt-8">
                        {activeLeads.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`rounded-full transition-all duration-300 ${
                                    i === currentIndex
                                        ? 'w-6 h-2 bg-white'
                                        : sentLeads.has(activeLeads[i].id)
                                            ? 'w-2 h-2 bg-emerald-500'
                                            : 'w-2 h-2 bg-white/20'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── WHATSAPP PREVIEW MODAL ── */}
            <AnimatePresence>
                {whatsappModalLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 70, scale: 0.91, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 70, scale: 0.91, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-[#161616] border border-white/10 w-full max-w-md rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/8 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)]">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Sending AI Draft To</p>
                                        <p className="text-white font-black text-lg leading-tight">{whatsappModalLead.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setWhatsappModalLead(null); handleNext(); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-600 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-5">
                                <div className="bg-[#25D366]/8 border border-[#25D366]/20 rounded-[28px] p-6 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {`Hi ${whatsappModalLead.name.split(' ')[0]} 👋\n\nI noticed you were interested in ${whatsappModalLead.service}.${whatsappModalLead.ai_summary ? `\n\n"${whatsappModalLead.ai_summary}"\n` : '\n'}\nWould you like me to send over our 0% finance options or book a quick chat?`}
                                </div>

                                <button
                                    id="open-whatsapp-btn"
                                    onClick={() => {
                                        const phone = whatsappModalLead.phone || '';
                                        const text = encodeURIComponent(`Hi ${whatsappModalLead.name.split(' ')[0]} 👋, I noticed you were interested in ${whatsappModalLead.service}. Would you like to know more?`);
                                        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                        setWhatsappModalLead(null);
                                        handleNext();
                                    }}
                                    className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-black uppercase tracking-widest py-6 rounded-[28px] transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,211,102,0.4)] text-sm"
                                >
                                    <Send className="w-5 h-5" />
                                    Open WhatsApp &amp; Send
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
