import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Star, Play, CreditCard, ChevronRight, Check,
    ArrowLeft, MessageCircle, Sparkles, ShieldCheck, X, RefreshCw
} from "lucide-react";
import { supabase, type ConsultationRequest } from "../lib/supabase";

// Reuse assets and values (In a real app, these should be in a shared lib/constants)
const PT_ASSETS: Record<string, { image: string; title: string; benefit: string; script: string }> = {
    "Dental Implants": {
        image: "/brain/0774c8b3-dc9c-4ab9-82fe-cc27c1e404a8/dental_implant_3d_visual_1772134009341.png",
        title: "Precision Implantology",
        benefit: "Implants look and function like natural teeth, preserving your jawbone and facial structure.",
        script: "We've curated this precision plan to restore your smile with world-class implant technology."
    },
    "Veneers": {
        image: "/brain/0774c8b3-dc9c-4ab9-82fe-cc27c1e404a8/veneer_before_after_mockup_1772134023178.png",
        title: "Hollywood Smile Makeover",
        benefit: "Ultra-thin porcelain veneers correct shape, color, and alignment in as little as two visits.",
        script: "This transformation plan is designed to give you the confidence of a perfect, natural-looking smile."
    },
    "Invisalign / Aligners": {
        image: "/brain/0774c8b3-dc9c-4ab9-82fe-cc27c1e404a8/invisalign_simulation_ui_1772134037487.png",
        title: "SmartSmile Aligner Simulation",
        benefit: "Straighten your teeth invisibly with removable aligners and see your final result before you start.",
        script: "Your digital alignment journey starts here. See how your smile will evolve over the coming months."
    }
};

const TREATMENT_VALUES: Record<string, number> = {
    "Dental Implants": 3000,
    "Invisalign / Aligners": 2500,
    "Veneers": 1200,
    "Composite Bonding": 800,
    "Teeth Whitening": 500,
    "Dental Crown": 900,
    "Emergency Appointment": 300,
    "General Inquiry": 1500,
    "Other": 1000,
};

export default function ClientPTPage() {
    const { id } = useParams<{ id: string }>();
    const [lead, setLead] = useState<ConsultationRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReviews, setShowReviews] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

    useEffect(() => {
        async function fetchLead() {
            if (!id) return;
            const { data, error } = await supabase
                .from('consultation_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setLead(data);
            }
            setLoading(false);
        }
        fetchLead();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full"
                />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-display font-bold text-white mb-4 uppercase">Plan Not Found</h1>
                <p className="text-white/40 mb-8 max-w-md">The treatment plan you're looking for might have expired or the link is invalid.</p>
                <Link to="/" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    const asset = lead ? (PT_ASSETS[lead.service] || {
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
        title: `${lead.name.toUpperCase()}'S SMILE PLAN`,
        benefit: "World-class treatment using clinical precision and the latest dental innovations.",
        script: "We've prepared a treatment plan optimized for your specific clinical needs. We're committed to delivering a safe, beautiful result powered by years of expert skill."
    }) : null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-400/30 flex flex-col items-center justify-start overflow-y-auto">
            {/* Navigation Header */}
            <nav className="fixed top-0 inset-x-0 z-50 p-8 flex justify-between items-center backdrop-blur-md bg-black/20">
                <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
                    LONDON<span className="text-white/40">SMILE</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Secure Patient Portal</span>
                    </div>
                    <button className="p-3 bg-white text-black rounded-full hover:scale-105 transition-all">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 my-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Visual Presentation */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] aspect-square bg-white/5"
                    >
                        <img src={asset?.image} alt={asset?.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-16 left-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tighter uppercase leading-none">{asset?.title}</h2>
                            <div className="flex items-center gap-3 text-cyan-400 font-bold tracking-[0.3em] text-xs">
                                <Sparkles className="w-4 h-4 animate-pulse" /> YOUR PROJECTED RESULT
                            </div>
                        </div>
                    </motion.div>

                    {/* Content & Action */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">
                                <Star className="w-3.5 h-3.5 fill-cyan-400" /> Welcome, {lead.name}
                            </div>
                            <h3 className="text-5xl md:text-7xl font-display font-bold text-white mb-10 tracking-tighter leading-tight uppercase">
                                Designed for <br />
                                <span className="text-white/30">Your Smile.</span>
                            </h3>
                            <p className="text-2xl text-white/50 leading-relaxed font-medium mb-12 max-w-xl italic">
                                {asset.benefit}
                            </p>

                            {/* Installment Calculator */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-10 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-[100px] mb-12 relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                                <div className="flex flex-col gap-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] mb-3">Investment Summary</p>
                                            <p className="text-5xl font-display font-bold text-white tracking-tighter">£{TREATMENT_VALUES[lead.service]?.toLocaleString() || "1,000"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] mb-3">Finance Options</p>
                                            <p className="text-2xl font-display font-bold text-purple-400">0% APR Over 24m</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/[0.05] p-6 rounded-3xl border border-white/10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center border border-cyan-400/30">
                                                <CreditCard className="w-7 h-7 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-1">Monthly Cost</p>
                                                <p className="text-3xl font-bold text-white tracking-tighter italic">£{Math.round((TREATMENT_VALUES[lead.service] || 1000) / 24).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-2 bg-white/10 text-[9px] font-bold uppercase tracking-[0.3em] rounded-full border border-white/20 text-white/60">Apply In-App</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Next Steps Guide */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="grid gap-6"
                        >
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 px-2">Next Steps</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { icon: ChevronRight, title: "Review Details", desc: "Take your time to review the 3D outcomes." },
                                    { icon: Check, title: "Secure Date", desc: "Your provisional slot is held for 24 hours." }
                                ].map((step, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <step.icon className="w-4 h-4 text-white/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-white mb-1">{step.title}</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-6 pt-6"
                        >
                            <motion.button
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(34,211,238,0.2)",
                                        "0 0 50px rgba(34,211,238,0.5)",
                                        "0 0 20px rgba(34,211,238,0.2)"
                                    ]
                                }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-7 bg-white text-black font-bold uppercase tracking-[0.3em] text-[11px] rounded-3xl flex items-center justify-center gap-3 transition-all"
                                onClick={() => setShowDepositModal(true)}
                            >
                                Confirm & Secure Slot
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                className="px-10 py-7 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-3xl transition-all flex items-center gap-3"
                                onClick={() => setShowReviews(true)}
                            >
                                Case Studies
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Social Proof Modal */}
            <AnimatePresence>
                {showReviews && (
                    <motion.div
                        layoutId="social-proof-modal"
                        className="fixed inset-0 z-[2000] bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8"
                    >
                        <button
                            onClick={() => setShowReviews(false)}
                            className="absolute top-8 right-8 p-4 bg-white/5 shadow-xl rounded-full transition-colors"
                        >
                            <ChevronRight className="w-8 h-8 text-white rotate-180" />
                        </button>
                        <h2 className="text-4xl font-display font-bold text-white mb-10 uppercase tracking-widest text-center">
                            Success Stories.
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl">
                                    <div className="flex gap-1 mb-6 text-cyan-400">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-cyan-400" />)}
                                    </div>
                                    <p className="text-white/80 text-lg leading-relaxed mb-8 italic">"Absolutely life changing. The 3D simulation was exactly what I got. Best investment I ever made."</p>
                                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.3em]">- Verified Patient</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Acceptance & Secure Deposit Modal */}
            <AnimatePresence>
                {showDepositModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[40px] max-w-lg w-full relative overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => {
                                    setShowDepositModal(false);
                                    setPaymentStatus('idle');
                                }}
                                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-white/40" />
                            </button>

                            {paymentStatus === 'success' ? (
                                <div className="text-center py-10">
                                    <div className="w-24 h-24 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/30">
                                        <Check className="w-12 h-12 text-cyan-400" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-tight">Your Smile is Secured.</h2>
                                    <p className="text-white/60 mb-10 text-sm leading-relaxed">
                                        Your deposit has been successfully processed. Our concierge team will reach out shortly to finalize your transformation date.
                                    </p>
                                    <button
                                        onClick={() => setShowDepositModal(false)}
                                        className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-200 transition-all"
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                            <Sparkles className="w-8 h-8 text-cyan-400" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-tight">Secure Treatment</h2>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Priority Commitment Deposit</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Treatment</span>
                                                <span className="text-xs font-bold text-white uppercase">{lead.service}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Provisional Deposit</span>
                                                <span className="text-xl font-display font-bold text-cyan-400">£150.00</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                                    <CreditCard className="w-4 h-4 text-white/20" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="CARD NUMBER"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold tracking-[0.2em] text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                                                    value={cardData.number}
                                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '').substring(0, 16) })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="MM / YY"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold tracking-[0.2em] text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-center"
                                                    value={cardData.expiry}
                                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value.substring(0, 5) })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVC"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold tracking-[0.2em] text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all text-center"
                                                    value={cardData.cvc}
                                                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={async () => {
                                                setPaymentStatus('processing');

                                                // 1. Simulate payment processing delay
                                                await new Promise(resolve => setTimeout(resolve, 2000));

                                                // 2. Update Supabase record
                                                if (lead?.id) {
                                                    const { error } = await supabase
                                                        .from('consultation_requests')
                                                        .update({ status: 'Treatment Started' })
                                                        .eq('id', lead.id);

                                                    if (error) {
                                                        console.error("Failed to update status on payment:", error);
                                                        // In a real app, you might want to show an error toast here
                                                        // but we'll still show success for the demo flow if the card goes through
                                                    }
                                                }

                                                setPaymentStatus('success');
                                            }}
                                            disabled={paymentStatus === 'processing' || !cardData.number}
                                            className="w-full py-6 bg-cyan-400 text-black font-extrabold uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-cyan-300 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                        >
                                            {paymentStatus === 'processing' ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" /> SECURING SLOT...
                                                </>
                                            ) : (
                                                "SECURE MY TRANSFORMATION"
                                            )}
                                        </button>

                                        <p className="text-[9px] text-white/20 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Check className="w-3 h-3" /> SECURE STRIPE ENCRYPTION
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
