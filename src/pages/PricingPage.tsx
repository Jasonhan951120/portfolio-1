import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Zap, LogOut, ArrowRight, Sparkles, TrendingUp, Shield, BarChart3, Users, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PricingPage() {
    const navigate = useNavigate();
    const { signOut, profile } = useAuth();

    const handleSubscribe = async () => {
        alert("Initiating Secure Stripe Checkout...\n(Clinical Premium Plan Selected)");
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    // Sage Green for Success, Electric Mint for Accents
    const colors = {
        sage: "#96AD91",
        mint: "#4FFFB0",
        navy: "#0A0E14",
        slate: "#1C2128"
    };

    const dashboardBenefits = [
        { title: "AI-Powered Lead Kanban", icon: <TrendingUp className="w-4 h-4" /> },
        { title: "Real-time 15m SLA Timers", icon: <Zap className="w-4 h-4" /> },
        { title: "Smart Waitlist Gap-Filler", icon: <Sparkles className="w-4 h-4" /> },
        { title: "24/7 Omni-Channel Inbox", icon: <MessageCircle className="w-4 h-4" /> },
        { title: "AI Daily Briefing Reports", icon: <Check className="w-4 h-4" /> },
        { title: "Automated PT Link Sharing", icon: <Zap className="w-4 h-4" /> },
        { title: "Clinical ROI Insights", icon: <BarChart3 className="w-4 h-4" /> },
        { title: "Multi-Staff Collaboration", icon: <Users className="w-4 h-4" /> },
        { title: "GDPR/HIPAA Secure Vault", icon: <Shield className="w-4 h-4" /> }
    ];

    return (
        <div className="min-h-screen bg-[#0A0D11] text-white selection:bg-[#4FFFB0] selection:text-black selection:bg-opacity-90 overflow-hidden relative font-sans">
            {/* Premium Gradient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#96AD91]/5 rounded-full blur-[160px]" />
            </div>

            {/* Navigation */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center">
                <div className="text-xl font-display font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4FFFB0] to-blue-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-black" />
                    </div>
                    <span className="tracking-tight uppercase">Hanlan<span className="opacity-40">OC</span></span>
                </div>

                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group"
                >
                    <LogOut className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    Sign Out
                </button>
            </header>

            <main className="relative z-10 pt-40 pb-32 px-6 flex flex-col items-center">
                {/* CRO Header */}
                <div className="max-w-4xl text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#96AD91]/10 border border-[#96AD91]/20 text-[#96AD91] text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> Activation Required for Your Clinic
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tight leading-[0.95]"
                    >
                        Clinical Performance. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FFFB0] to-blue-400">Unlocked.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-medium"
                    >
                        Dr. {profile?.full_name?.split(' ')[1] || "Administrator"}, your clinical setup is ready. Secure your membership to launch the dashboard and automate your patient growth.
                    </motion.p>
                </div>

                {/* CRO Central Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[1100px] grid lg:grid-cols-12 gap-0 rounded-[48px] border border-white/5 bg-[#0D1117] overflow-hidden shadow-2xl relative group"
                >
                    {/* Subtle Glimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4FFFB0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    {/* Left: Value Proposition (8 cols) */}
                    <div className="lg:col-span-7 p-10 md:p-14 border-r border-white/5">
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                            <Zap className="w-5 h-5 text-[#4FFFB0]" />
                            Premium Clinical Suite
                        </h2>

                        <div className="grid md:grid-cols-2 gap-y-10 gap-x-12">
                            {dashboardBenefits.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    className="flex gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#4FFFB0] shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white/90 mb-1">{item.title}</h4>
                                        <p className="text-[11px] text-white/30 font-medium">Included in Clinical Premium</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-16 pt-10 border-t border-white/5">
                            <p className="text-xs text-white/30 font-medium leading-relaxed">
                                Trusted by 450+ high-performing clinics in the UK. <br />
                                Compliant with GDPR, GDC, and Information Commissioner's Office (ICO) standards.
                            </p>
                        </div>
                    </div>

                    {/* Right: The CTA / Selection (5 cols) */}
                    <div className="lg:col-span-5 p-10 md:p-14 bg-[#141920] flex flex-col justify-center items-center text-center relative">
                        <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 text-[#4FFFB0] text-[8px] font-black uppercase tracking-widest">
                            Limited Intake
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#96AD91]">Clinical Premium Membership</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-7xl font-display font-light tracking-tighter">£299</span>
                                <span className="text-white/20 text-xl font-medium tracking-widest uppercase">/mo</span>
                            </div>
                            <p className="text-[11px] text-white/40 mt-4 font-medium italic">"The definitive dashboard for dental excellence."</p>
                        </div>

                        <button
                            onClick={handleSubscribe}
                            className="w-full py-6 rounded-2xl bg-[#4FFFB0] text-black font-black uppercase tracking-[0.15em] text-[12px] flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.03] transition-all shadow-[0_20px_40px_-5px_rgba(79,255,176,0.3)] active:scale-95 group/btn"
                        >
                            Start Your Membership
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 flex flex-col gap-4 text-center">
                            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                <span>Secure Checkout</span>
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <span>Instant Access</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-[#96AD91] font-bold uppercase tracking-widest">
                                <Check className="w-3 h-3" /> cancel anytime
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security / Trust Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
                >
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest">
                        <Shield className="w-4 h-4" /> HIPAA Certified
                    </div>
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest">
                        GDC Compliant
                    </div>
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest">
                        Stripe Verified
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
