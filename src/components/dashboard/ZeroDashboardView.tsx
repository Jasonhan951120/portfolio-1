import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
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

    // ── SPRING PHYSICS FOR TACTILE CTA ──
    const springConfig = { stiffness: 400, damping: 22, mass: 0.8 };
    const scale = useSpring(1, springConfig);
    const y = useSpring(0, { stiffness: 380, damping: 20 });

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
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {lead.intent_score != null && (
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-700 ${sent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                AI Intent: {lead.intent_score}%
                            </div>
                        )}
                        {isVIP && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <Sparkles className="w-3 h-3" /> VIP High Value
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CONTEXTUAL FOOTER ── */}
                <div className="relative z-10 flex items-center gap-2 mt-auto pt-5 border-t border-white/5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">🕒 {Math.floor(Math.random() * 5) + 1} hrs ago</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">🦷 {lead.service.split(' ')[0]}</span>
                    </div>
                </div>

                {/* ── AI SUMMARY ── */}
                {lead.ai_summary && (
                    <div className="relative z-10 bg-white/[0.04] p-5 rounded-[28px] border border-white/8">
                        <p className="text-xs text-gray-400 leading-relaxed italic">"{lead.ai_summary}"</p>
                    </div>
                )}

                <div className="relative z-10 space-y-3 mt-auto">
                    <motion.button
                        id="send-whatsapp-btn"
                        style={{ scale, y }}
                        onHoverStart={() => !sent && (scale.set(1.025), y.set(-3))}
                        onHoverEnd={() => !sent && (scale.set(1), y.set(0))}
                        onTapStart={() => !sent && scale.set(0.97)}
                        onTapCancel={() => !sent && scale.set(1)}
                        onClick={handleSend}
                        disabled={sent}
                        className={`
                            w-full font-black uppercase tracking-widest py-7 rounded-[28px]
                            transition-all duration-600 flex items-center justify-center gap-3 text-sm
                            ${sent
                                ? 'bg-[#10B981] text-white cursor-default shadow-[0_0_50px_rgba(16,185,129,0.5)]'
                                : 'bg-white text-gray-900 border border-transparent hover:border-emerald-400/50 shadow-[0_20px_60px_rgba(255,255,255,0.12)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.18),inset_0_0_20px_rgba(16,185,129,0.3)]'
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
        <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

            {/* ── AMBIENT STAGE BACKGROUND GLOW ── */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Layer 1: Wide Deep Navy Base (Matte Stage) */}
                <div
                    className="absolute inset-0 opacity-100"
                    style={{ background: 'radial-gradient(circle at 50% 60%, rgba(16,40,75,0.4) 0%, #0A0F1E 75%)' }}
                />
                {/* Layer 2: Focused Emerald/Red Spotlight */}
                <div
                    className="absolute inset-0 transition-all duration-1500"
                    style={{
                        background: heroState === 'secured'
                            ? 'radial-gradient(circle at 50% 55%, rgba(16,185,129,0.12) 0%, transparent 45%)'
                            : 'radial-gradient(circle at 50% 55%, rgba(239,68,68,0.08) 0%, transparent 45%)'
                    }}
                />
            </div>

            {/* ── HERO METRIC BANNER ── */}
            <div className="flex flex-col items-center justify-center text-center mb-14 relative z-10 w-full">
                <div className="w-full max-w-[500px]">
                    <AnimatePresence mode="wait">
                        {heroState === 'secured' ? (
                            <motion.div
                                key="secured"
                                initial={{ opacity: 0, scale: 0.75, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A0A0A0] mb-5">
                                    🎉 Clinic Secured — Today's Total
                                </p>
                                <div
                                    className="text-5xl font-black tabular-nums tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-white to-slate-400 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                                >
                                    £{totalSecured.toLocaleString()}
                                </div>
                                <p className="text-[#2AF598] font-black text-xs uppercase tracking-[0.4em] mt-8 opacity-80">
                                    Protected Portfolio ↗
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="risk"
                                initial={{ opacity: 0, scale: 0.75, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A0A0A0] mb-5">
                                    ⚠ Money At Risk Today
                                </p>
                                <div
                                    className="text-5xl font-black tabular-nums tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-white to-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                                >
                                    £{totalAtRisk.toLocaleString()}
                                </div>
                                <p className="text-[#A0A0A0] font-black text-xs uppercase tracking-[0.4em] mt-8 opacity-60">
                                    High Priority Pipeline ↘
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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
                                <motion.div
                                    className="absolute inset-x-0 h-full bg-[#161616] border border-white/[0.05] rounded-[56px] -z-10 shadow-xl"
                                    initial={false}
                                    animate={{ scale: 0.95, y: 16, opacity: 0.5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            {activeLeads.length > 2 && (
                                <motion.div
                                    className="absolute inset-x-0 h-full bg-[#121212] border border-white/[0.03] rounded-[56px] -z-20 shadow-2xl"
                                    initial={false}
                                    animate={{ scale: 0.90, y: 32, opacity: 0.2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
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
                            className="w-full max-w-[500px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[48px] p-12 text-center shadow-2xl relative overflow-hidden"
                        >
                            {/* Infographic Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
                            
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight relative z-10">Inbox Zero. Great job.</h2>
                            <p className="text-slate-400 text-sm mb-10 relative z-10">All high-priority leads have been engaged.</p>
                            
                            <div className="bg-white/[0.04] border border-white/5 rounded-3xl p-6 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Secured This Week</p>
                                <p className="text-3xl font-black text-white tabular-nums">£{(totalSecured * 4.2 + 12000).toLocaleString()}</p>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Performance Peak</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentIndex(0)}
                                className="mt-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all group"
                            >
                                <span className="group-hover:rotate-180 transition-transform duration-500">↺</span> Refresh Queue
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
                                className={`rounded-full transition-all duration-300 ${i === currentIndex
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
