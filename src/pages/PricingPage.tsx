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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-slate-900 overflow-hidden relative font-sans">
            {/* Ambient Background Glimmer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[140px]" />
            </div>

            {/* Navigation Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center shadow-sm text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">Hanlan<span className="opacity-30">OC</span></span>
                </div>

                <button
                    onClick={handleSignOut}
                    className="px-5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group text-slate-900 shadow-sm"
                >
                    <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    Logout
                </button>
            </header>

            <main className="relative z-10 pt-32 pb-32 px-6 flex flex-col items-center max-w-7xl mx-auto">
                {/* 1. Value Proposition (ROI Anchoring) */}
                <div className="max-w-4xl text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> Recovered value by saving just one high-intent patient
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900 uppercase"
                    >
                        Save 1 Patient = <br />
                        <span className="text-emerald-500">£3,500 REVENUE Generated.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed"
                    >
                        {profile?.full_name?.split(' ')[1] || "Clinical Director"}, your conversion engine is ready. This is the most certain investment for your growth.
                    </motion.p>
                </div>

                {/* ROI Calculator Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl mb-24 p-12 rounded-[44px] bg-white border border-slate-200 relative overflow-hidden shadow-sm"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-10 text-center flex items-center justify-center gap-3 text-slate-900 uppercase">
                            <TrendingUp className="w-6 h-6 text-emerald-500" /> ROI Calculator
                        </h2>

                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-12">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Lost patients / month</label>
                                        <span className="text-emerald-500 font-black text-lg">2</span>
                                    </div>
                                    <input type="range" min="1" max="10" defaultValue="2" className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Avg. Treatment Value</label>
                                        <span className="text-emerald-500 font-black text-lg">£3,500</span>
                                    </div>
                                    <input type="range" min="1000" max="10000" step="500" defaultValue="3500" className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Monthly Revenue Recovered</p>
                                <div className="text-6xl font-black text-slate-900 mb-6">£7,000</div>
                                <div className="h-px bg-slate-200 w-12 mx-auto mb-6"></div>
                                <p className="text-xs text-emerald-600 font-black leading-relaxed italic uppercase tracking-widest">
                                    "1 recovered patient pays for the year."
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
                            className="bg-white p-8 rounded-[44px] border border-slate-200 relative shadow-sm"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />)}
                            </div>
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-emerald-500/5" />
                            <p className="text-sm font-bold leading-relaxed text-slate-900 mb-6 italic">
                                "My treatment acceptance rate rose by over 35%. It's much more than just a dashboard."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                                <div>
                                    <h4 className="text-xs font-black uppercase">Dr. Oliver Chen</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">London Dental Studio</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="bg-white p-8 rounded-[44px] border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 font-black uppercase tracking-widest">Performance</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-tight text-slate-400">Leads Today</span>
                                    <span className="text-xs font-black text-slate-900 uppercase">12 Units</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-tight text-slate-400">Value</span>
                                    <span className="text-sm font-black text-emerald-600 uppercase">£14,200</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle & Right: Pricing Card (Decision Area) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 bg-white rounded-[44px] border border-slate-200 overflow-hidden shadow-sm relative"
                    >
                        <div className="grid md:grid-cols-2">
                            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-10 text-slate-900">
                                    <Zap className="w-5 h-5 text-emerald-500" /> Premium Pack
                                </h2>
                                <div className="space-y-6">
                                    {dashboardBenefits.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-[12px] bg-white border border-slate-200 flex items-center justify-center text-emerald-500 shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-black text-slate-900 mb-0.5 uppercase tracking-tight">{item.title}</h4>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-slate-100 text-[10px] text-slate-300 font-black leading-relaxed uppercase tracking-widest">
                                    All Features included <br /> UK GDPR & ICO COMPLIANT
                                </div>
                            </div>

                            <div className="p-10 md:p-14 bg-white flex flex-col justify-center items-center text-center">
                                <div className="px-4 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-10">
                                    Enterprise License
                                </div>
                                <div className="mb-12">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-7xl font-black tracking-tight text-slate-900">£649</span>
                                        <span className="text-slate-300 text-xl font-black tracking-widest uppercase mb-1">/mo</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">(excl. VAT)</p>
                                    <p className="text-[10px] text-emerald-500 mt-6 font-black uppercase tracking-[0.2em] italic">"The definitive standard for clinical growth"</p>
                                </div>

                                {/* Thumb Zone & Pulsing CTA */}
                                <div className="w-full mt-auto">
                                    <motion.button
                                        animate={{
                                            boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 30px rgba(16,185,129,0.2)", "0 0 0px rgba(16,185,129,0)"]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        onClick={handleSubscribe}
                                        className="w-[168px] h-[48px] bg-slate-900 text-white rounded-[12px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all mx-auto shadow-sm relative"
                                    >
                                        Activate Now
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>

                                    <div className="mt-8 space-y-3">
                                        <div className="flex items-center justify-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            <span>Secure Billing</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span>Stripe Verified</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-500 font-black uppercase tracking-widest">
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
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale opacity-40"
                >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <Shield className="w-4 h-4" /> ICO Registered
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <Check className="w-4 h-4" /> GDC Standard
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <Users className="w-4 h-4" /> 50+ Clinics Trust Us
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
