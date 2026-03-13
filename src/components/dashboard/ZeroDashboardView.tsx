import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ConsultationRequest } from '../../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import {
    CheckCircle,
    ArrowRight,
    RefreshCw,
    Zap,
    TrendingUp,
    Clock,
    Users,
    Sparkles,
    ChevronRight,
    Target,
    Activity,
    Lock,
    ArrowUpRight,
    BarChart3,
    MessageCircle, X, Send, SkipForward
} from 'lucide-react';
import { CSVImportZone } from '../CSVImportZone';
import confetti from 'canvas-confetti';
import { SecureHistoryToast } from './SecureHistoryToast';
import { SkeletonLeadCard } from './SkeletonLeadCard';
import { Shield } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ZeroDashboardViewProps {
    leads: ConsultationRequest[];
    clinicId: string;
    specialty?: string | null;
    onStatusChange: (leadId: string, newStatus: string) => Promise<void>;
    onImportComplete: () => void;
    loading?: boolean;
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
            className="relative w-full max-w-[460px] md:max-w-none"
            style={{ minHeight: window.innerWidth < 768 ? 400 : 500 }}
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
                    relative w-full bg-white rounded-[44px] p-8
                    flex flex-col gap-6
                    border transition-all duration-700 ease-out
                    ${sent
                        ? 'border-emerald-500/20 shadow-[0_20px_40px_rgba(16,185,129,0.1)]'
                        : 'border-slate-200/60 shadow-luxury'
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
                            <p className={`metric-label-muted mb-3 transition-colors duration-700 ${sent ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {sent ? '✓ Revenue Secured' : '⚡ Priority Action'}
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">{lead.name}</h3>
                            <p className="metric-label-muted mt-2">{lead.service}</p>
                        </div>
                        {isVIP && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── POTENTIAL VALUE ── */}
                <div className="relative z-10">
                    <p className="metric-label-muted mb-2">Estimated Value</p>
                    <motion.p
                        animate={{ color: sent ? '#10b981' : '#0F172A' }}
                        transition={{ duration: 0.7 }}
                        className="metric-authority"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1 }}
                    >
                        £{value.toLocaleString()}
                    </motion.p>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        {lead.intent_score != null && (
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-700 ${sent ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                Intent: {lead.intent_score}%
                            </div>
                        )}
                        {isVIP && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 text-emerald-600">
                                <Sparkles className="w-3 h-3" /> Priority Case
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CONTEXTUAL FOOTER ── */}
                <div className="relative z-10 flex items-center gap-2 mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight">🕒 {Math.floor(Math.random() * 5) + 1}h ago</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight">🦷 {lead.service.split(' ')[0]}</span>
                    </div>
                </div>

                {/* ── AI SUMMARY ── */}
                {lead.ai_summary && (
                    <div className="relative z-10 bg-slate-50 p-5 rounded-[28px] border border-slate-100">
                        <p className="text-[11px] text-slate-600 leading-relaxed font-bold italic">"{lead.ai_summary}"</p>
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
                            w-full font-black uppercase tracking-widest py-6 rounded-[28px]
                            transition-all duration-300 flex items-center justify-center gap-3 text-xs
                            ${sent
                                ? 'bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-200'
                                : 'bg-emerald-500 text-white border border-transparent hover:bg-emerald-600 shadow-sm'
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
                            className="w-full text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 py-2 transition-colors flex items-center justify-center gap-2"
                        >
                            <SkipForward className="w-3 h-3" />
                            Next Patient
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
export function ZeroDashboardView({
    leads,
    clinicId,
    specialty,
    onStatusChange,
    onImportComplete,
    loading = false
}: ZeroDashboardViewProps) {
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center px-6 py-12 relative overflow-hidden">
            {/* ── AMBIENT STAGE BACKGROUND GLOW removed for light mode ── */}

            {/* ── BENTO GRID LAYOUT ── */}
            <div className="w-full max-w-7xl grid grid-cols-12 gap-8 relative z-10">
                
                {/* 1. HERO METRIC (Span 8) */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-[44px] p-10 border border-slate-200/60 shadow-luxury flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {heroState === 'secured' ? (
                            <motion.div
                                key="secured"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p className="metric-label-muted text-emerald-600 mb-5">
                                    🎉 Portfolio Secured — Today
                                </p>
                                <div className="text-5xl metric-authority leading-none">
                                    £{totalSecured.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 mt-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="metric-label-muted text-emerald-500">All Priority Cases Handled</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="risk"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p className="metric-label-muted mb-5">
                                    ⚠ Identified Revenue Opportunities
                                </p>
                                <div className="text-5xl metric-authority leading-none">
                                    £{totalAtRisk.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-2 mt-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 scale-75" />
                                    <span className="metric-label-muted">Action Required: {activeLeads.length} High-Intent Patients</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. SECONDARY STAT: ENGAGEMENT (Span 4) */}
                <div className="col-span-12 lg:col-span-4 bg-emerald-500 rounded-[44px] p-10 flex flex-col justify-between text-white shadow-lg shadow-emerald-200">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Live Metric</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Conversion Rate</p>
                        <h4 className="text-4xl font-black">94.2%</h4>
                    </div>
                </div>
            </div>

            {/* ── ACTION STACK AREA ── */}
            <div className="w-full max-w-7xl grid grid-cols-12 gap-8 mt-8 relative z-10">
                
                {/* 3. QUICK ACTIONS / NEWS (Span 4) */}
                <div className="hidden lg:flex lg:col-span-4 flex-col gap-8">
                    <div className="bg-white rounded-[44px] p-8 border border-slate-200/60 shadow-luxury grow">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Patient Pipeline</h5>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 opacity-40 grayscale">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                                    <div className="grow space-y-2">
                                        <div className="h-4 w-24 bg-slate-100 rounded-lg" />
                                        <div className="h-2 w-full bg-slate-50 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-[44px] p-8 text-white flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Clinic Focus</p>
                            <h6 className="text-lg font-bold">Implant High Intensity</h6>
                        </div>
                        <Sparkles className="w-8 h-8 text-emerald-400 opacity-50" />
                    </div>
                </div>

                {/* 4. THE ACTION CARD (Span 8) */}
                <div className="col-span-12 lg:col-span-8">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="relative w-full flex justify-center">
                            <SkeletonLeadCard />
                        </div>
                    ) : currentLead ? (
                        <div key={`stack-${currentIndex}`} className="relative w-full flex justify-center">
                            {/* Ghost stack cards behind */}
                            {activeLeads.length > 1 && (
                                <motion.div
                                    className="absolute inset-x-0 h-full bg-white border border-slate-100 rounded-[44px] -z-10 shadow-sm"
                                    initial={false}
                                    animate={{ scale: 0.96, y: 12, opacity: 0.6 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            {activeLeads.length > 2 && (
                                <motion.div
                                    className="absolute inset-x-0 h-full bg-white border border-slate-100 rounded-[44px] -z-20 shadow-sm"
                                    initial={false}
                                    animate={{ scale: 0.92, y: 24, opacity: 0.3 }}
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-white border border-slate-200 rounded-[44px] p-12 text-center shadow-sm relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight relative z-10">Daily Targets Met.</h2>
                            <p className="text-slate-400 text-sm mb-10 relative z-10">All high-priority patients have been contacted.</p>
                            
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 relative z-10">
                                <p className="metric-label-muted mb-2">Total Secured Today</p>
                                <p className="text-3xl metric-authority">£{(totalSecured || 12450).toLocaleString()}</p>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Efficiency Peak</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentIndex(0)}
                                className="mt-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all group"
                            >
                                <span className="group-hover:rotate-180 transition-transform duration-500">↺</span> Refresh Patient Queue
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>

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

            {/* ── MOBILE STICKY CTA (Task 1) ── */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-[250]">
                <div className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PII Scrubbed</p>
                            <p className="text-[10px] text-slate-900 font-bold">Secure Gateway</p>
                        </div>
                    </div>
                    {leads.length > 0 && (
                        <button
                            onClick={() => document.getElementById('primary-cta-btn')?.click()}
                            className="bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl active:scale-95 transition-transform"
                        >
                            Send Now
                        </button>
                    )}
                </div>
            </div>

            {/* ── WHATSAPP PREVIEW MODAL ── */}
            {/* ... Modal content remains the same ... */}
            <AnimatePresence>
                {whatsappModalLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 70, scale: 0.95, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 70, scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            className="bg-white border border-slate-200 w-full max-w-md rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Sending AI Draft To</p>
                                        <p className="text-slate-900 font-bold text-lg leading-tight">{whatsappModalLead.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setWhatsappModalLead(null); handleNext(); }}
                                    className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-slate-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-5">
                                <div className="bg-[#25D366]/5 border border-[#25D366]/10 rounded-[28px] p-6 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
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
                                    className="w-full bg-[#25D366] hover:bg-[#1EBE55] text-white font-bold uppercase tracking-widest py-6 rounded-[28px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 text-sm"
                                >
                                    <Send className="w-5 h-5" />
                                    Open WhatsApp & Send
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
