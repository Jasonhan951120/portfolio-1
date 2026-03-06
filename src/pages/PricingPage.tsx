import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Zap, LogOut, ArrowRight, Sparkles, TrendingUp, Shield, BarChart3, Users, Clock, MessageCircle, Star, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PricingPage() {
    const navigate = useNavigate();
    const { signOut, profile } = useAuth();

    const handleSubscribe = async () => {
        alert("Connecting to our secure payment gateway...\n(Clinical Premium Plan selected)");
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    const dashboardBenefits = [
        { title: "AI-Powered Lead Kanban", desc: "Zero-leakage patient management", icon: <TrendingUp className="w-4 h-4" /> },
        { title: "15-Min Golden Time Alert", desc: "Guaranteed immediate lead response", icon: <Zap className="w-4 h-4" /> },
        { title: "Smart Waitlist", desc: "Automatic gap filling for calendars", icon: <Sparkles className="w-4 h-4" /> },
        { title: "Clinical ROI Analytics", desc: "Revenue growth performance dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#121212] text-white selection:bg-[#2AF598] selection:text-[#121212] overflow-hidden relative font-sans">
            {/* Ambient Background Glimmer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#2AF598]/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#00D2FF]/5 rounded-full blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#2AF598] to-[#00D2FF] flex items-center justify-center shadow-lg shadow-[#2AF598]/10 text-[#121212]">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Hanlan<span className="opacity-30">OC</span></span>
                </div>

                <button
                    onClick={handleSignOut}
                    className="px-5 py-2 rounded-full border-[1.5px] border-white/5 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
                >
                    <LogOut className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    Logout
                </button>
            </header>

            <main className="relative z-10 pt-32 pb-32 px-6 flex flex-col items-center max-w-7xl mx-auto">
                {/* 1. Value Proposition (ROI Anchoring) */}
                <div className="max-w-4xl text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1E1E] border-[1.5px] border-white/10 text-[#2AF598] text-[9px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> Recovered value by saving just one high-intent client
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white"
                    >
                        Recovering 1 Implant Client = <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2AF598] to-[#00D2FF]">£3,500 REVENUE Generated.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-[#A0A0A0] max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        {profile?.full_name?.split(' ')[1] || "Clinical Director"}, your conversion engine for high-value client recovery is ready. This is the most certain investment for your clinic's growth.
                    </motion.p>
                </div>

                {/* ROI Calculator Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl mb-24 p-12 rounded-[40px] bg-[#1E1E1E] border-[1.5px] border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2AF598]/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-10 text-center flex items-center justify-center gap-3">
                            <TrendingUp className="w-6 h-6 text-[#2AF598]" /> Interactive ROI Calculator
                        </h2>

                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-12">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Lost high-value leads / month</label>
                                        <span className="text-[#2AF598] font-bold text-lg">2</span>
                                    </div>
                                    <input type="range" min="1" max="10" defaultValue="2" className="w-full accent-[#2AF598] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Avg. Treatment Value (Implant/Invisalign)</label>
                                        <span className="text-[#2AF598] font-bold text-lg">£3,500</span>
                                    </div>
                                    <input type="range" min="1000" max="10000" step="500" defaultValue="3500" className="w-full accent-[#2AF598] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>

                            <div className="p-8 bg-[#121212]/50 border border-white/5 rounded-3xl text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A0A0A0] mb-4">Potential Monthly Revenue Recovered</p>
                                <div className="text-6xl font-bold text-white mb-6">£7,000</div>
                                <div className="h-px bg-white/10 w-12 mx-auto mb-6"></div>
                                <p className="text-xs text-[#2AF598] font-medium leading-relaxed italic">
                                    "Hanlan OC pays for itself 10x by recovering just ONE lost client."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Main Value & Social Proof Card */}
                <div className="w-full grid lg:grid-cols-12 gap-8 items-start relative mb-24">
                    {/* Left: Social Proof (Testimonials / Trust) */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#1E1E1E] p-8 rounded-[24px] border-[1.5px] border-white/5 relative"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#2AF598] fill-[#2AF598]" />)}
                            </div>
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-[#2AF598]/5" />
                            <p className="text-sm font-medium leading-relaxed text-white/90 mb-6 italic">
                                "I struggled with lead management, but after adopting this system, my high-value treatment acceptance rate rose by over 35%. It's much more than just a dashboard."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/10" />
                                <div>
                                    <h4 className="text-xs font-bold">Dr. Oliver Chen</h4>
                                    <p className="text-[10px] text-[#A0A0A0]">London Dental Studio</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="bg-[#1E1E1E] p-8 rounded-[24px] border-[1.5px] border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">Recent Recovery Performance</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-[#A0A0A0]">Leads Generated Today</span>
                                    <span className="text-xs font-bold text-white">12 Units</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-[#A0A0A0]">Potential Value</span>
                                    <span className="text-sm font-black text-[#2AF598]">£14,200</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-gradient-to-r from-[#2AF598] to-[#00D2FF]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle & Right: Pricing Card (Decision Area) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 bg-[#1E1E1E] rounded-[32px] border-[1.5px] border-white/10 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative"
                    >
                        <div className="grid md:grid-cols-2">
                            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/5 bg-[#121212]/30">
                                <h2 className="text-xl font-bold flex items-center gap-3 mb-10">
                                    <Zap className="w-5 h-5 text-[#2AF598]" /> Clinical-Exclusive Premium Pack
                                </h2>
                                <div className="space-y-6">
                                    {dashboardBenefits.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-[12px] bg-[#1E1E1E] border-[1.5px] border-white/5 flex items-center justify-center text-[#2AF598] shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-bold text-white mb-0.5">{item.title}</h4>
                                                <p className="text-[11px] text-[#A0A0A0] font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/5 text-[10px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                                    All Features included <br /> UK GDPR & ICO COMPLIANT
                                </div>
                            </div>

                            <div className="p-10 md:p-14 bg-[#0A0F1E] flex flex-col justify-center items-center text-center">
                                <div className="px-4 py-1 rounded-full bg-[#2AF598]/10 border border-[#2AF598]/20 text-[#2AF598] text-[9px] font-black uppercase tracking-widest mb-10">
                                    Enterprise License
                                </div>
                                <div className="mb-12">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-7xl font-bold tracking-tight text-white">£649</span>
                                        <span className="text-white/40 text-xl font-bold tracking-widest uppercase mb-1">/mo</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest">(excl. VAT)</p>
                                    <p className="text-[10px] text-[#2AF598] mt-6 font-black uppercase tracking-[0.2em] italic">"An investment that protects the value of every single client"</p>
                                </div>

                                {/* Thumb Zone & Pulsing CTA */}
                                <div className="w-full mt-auto">
                                    <motion.button
                                        animate={{
                                            boxShadow: ["0 0 0px rgba(42,245,152,0)", "0 0 30px rgba(42,245,152,0.3)", "0 0 0px rgba(42,245,152,0)"]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        onClick={handleSubscribe}
                                        className="w-[168px] h-[44px] bg-[#2AF598] text-[#121212] rounded-[12px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all mx-auto shadow-2xl relative"
                                    >
                                        Activate Premium
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>

                                    <div className="mt-8 space-y-3">
                                        <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                            <span>Secure Billing</span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                                            <span>Stripe Verified</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 text-[10px] text-[#2AF598]/60 font-black uppercase tracking-widest">
                                            <Check className="w-3 h-3" /> Cancel anytime
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale"
                >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Shield className="w-4 h-4" /> ICO Registered
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Check className="w-4 h-4" /> GDC Standard
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Users className="w-4 h-4" /> 50+ Clinics Trust Us
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
