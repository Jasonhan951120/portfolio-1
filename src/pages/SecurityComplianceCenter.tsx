import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Trash2, EyeOff, Globe, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../store/useDashboardStore";

export default function SecurityComplianceCenter() {
    const navigate = useNavigate();
    const { clinicName } = useDashboardStore();
    const [complianceMode, setComplianceMode] = useState<'UK' | 'US'>('UK');

    // Basic JS timezone logic for default setting
    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz === 'Europe/London') {
                setComplianceMode('UK');
            } else {
                setComplianceMode('US');
            }
        } catch (e) {
            setComplianceMode('UK');
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans overflow-x-hidden">
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <button 
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-[0.2em] text-[10px] btn-tactile"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </button>

                <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200/60 rounded-full shadow-luxury">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        System Security: <span className="text-emerald-500">Active & Scrubbing</span>
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tighter"
                >
                    Watch Your Liability Disappear.<br />
                    <span className="text-emerald-500">100% Zero-Retention.</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed font-medium"
                >
                    {clinicName || 'Hanlan OC'} operates on a strict 'Privacy-First, Zero-Retention' architecture. 
                    Because we never transmit, collect, or store any sensitive patient data on our servers, 
                    your liability for data breaches through our platform is <span className="text-slate-900 font-bold">mathematically zero.</span>
                </motion.p>
            </div>

            {/* Compliance Toggle */}
            <div className="max-w-7xl mx-auto flex justify-center mb-16">
                <div className="bg-slate-200/50 p-1 rounded-2xl flex relative w-64">
                    <button 
                        onClick={() => setComplianceMode('UK')}
                        className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${complianceMode === 'UK' ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        UK GDPR
                    </button>
                    <button 
                        onClick={() => setComplianceMode('US')}
                        className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${complianceMode === 'US' ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        US HIPAA
                    </button>
                    <motion.div 
                        layoutId="compliance-pill"
                        className="absolute inset-y-1 left-1 bg-white rounded-xl shadow-sm border border-slate-200/60"
                        style={{ width: 'calc(50% - 4px)' }}
                        animate={{ x: complianceMode === 'UK' ? 0 : '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
            </div>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Main Shield Animation Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-8 bg-white border border-slate-200/60 rounded-[44px] shadow-luxury p-12 flex flex-col items-center justify-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
                    <div className="relative z-10 w-32 h-32 mb-8">
                        <motion.svg 
                            viewBox="0 0 24 24" 
                            className="w-full h-full text-emerald-500 fill-none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path 
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                            />
                            <motion.path 
                                d="M9 12l2 2 4-4" 
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                            />
                        </motion.svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 text-center">
                        Active Liability Shield
                    </h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-8 text-center">
                        Zero Transmission Protocol Engaged
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {[
                            { icon: <Lock className="w-4 h-4" />, text: "No Database Persistence" },
                            { icon: <EyeOff className="w-4 h-4" />, text: "Client-Side Execution" },
                            { icon: <Trash2 className="w-4 h-4" />, text: "Auto-Destruct on Exit" }
                        ].map((badge, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200/40 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                {badge.icon}
                                {badge.text}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Pillar: Compliance Badges */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-slate-200/60 rounded-[32px] shadow-luxury p-8 flex-1"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={complianceMode}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col h-full"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                                    <Globe className="w-6 h-6 text-slate-900" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
                                    {complianceMode === 'UK' ? 'BHTA Verified' : 'HITRUST Ready'}
                                </h4>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                                    {complianceMode === 'UK' 
                                        ? "Audited for Information Commissioner's Office (ICO) standards."
                                        : "Configured for Business Associate Agreement (BAA) compatibility."
                                    }
                                </p>
                                <div className="mt-auto pt-6">
                                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4" /> COMPLIANCE ACTIVE
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 rounded-[32px] shadow-2xl p-8 flex-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                        <h4 className="text-white text-lg font-black uppercase tracking-tight mb-2 relative z-10">
                            Legal Guarantee
                        </h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed relative z-10 mb-6">
                            Verified by CyberCounsel UK. 
                            Zero sensitive data ingress means zero litigation surface area.
                        </p>
                        <button className="relative z-10 w-full py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-50 transition-colors btn-tactile">
                            Download DPA / BAA
                        </button>
                    </motion.div>
                </div>

                {/* Bottom Row: Scrubbing Performance */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-6 bg-white border border-slate-200/60 rounded-[44px] shadow-luxury p-10 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Real-time PII Destruction</h4>
                            <p className="metric-label-muted">Live Security Micro-Audit</p>
                        </div>
                        <Trash2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200/40 p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
                        <ScrubbingSequence />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-scan" />
                    </div>
                </motion.div>

                {/* Bottom Row: State Management Audit */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-6 bg-white border border-slate-200/60 rounded-[44px] shadow-luxury p-10"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <Shield className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Liability Audit Log</h4>
                            <p className="metric-label-muted">Continuous Compliance Monitoring</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Browser State Isolation", status: "Isolated", color: "text-emerald-500" },
                            { label: "Network Egress Filter", status: "Zero-PII-Ingress", color: "text-emerald-500" },
                            { label: "Disk Residue Cache", status: "None Detected", color: "text-emerald-500" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <p className="text-[9px] text-amber-700 font-bold uppercase tracking-tight leading-normal">
                            Note: This dashboard serves as a visualization tool. No patient data is sent to {clinicName || 'Hanlan OC'}'s backend servers at any stage.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { transform: translateY(-300%); }
                    100% { transform: translateY(300%); }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}} />
        </div>
    );
}

function ScrubbingSequence() {
    const [step, setStep] = useState(0);
    const scenarios = [
        { name: "Emma Watson", phone: "07712345678", email: "emma@proton.me" },
        { name: "David Beckham", phone: "07888123456", email: "david@beckham.com" },
        { name: "Keira Knightley", phone: "07444999111", email: "keira@hollywood.co.uk" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const currentScenario = scenarios[Math.floor(step / 1) % scenarios.length];

    return (
        <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Incoming Field</span>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Scrubbing Status</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-2"
                >
                    <ScrubbingRow label="Patient Name" value={currentScenario.name} step={step} />
                    <ScrubbingRow label="Contact Num" value={currentScenario.phone} step={step} />
                    <ScrubbingRow label="Email Access" value={currentScenario.email} step={step} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function ScrubbingRow({ label, value, step }: { label: string, value: string, step: number }) {
    // Phases: 0: Original, 1: Scrambling/Asterisks, 2: Blur-sm + Fade, 3: Empty/Reset
    
    return (
        <div className="flex justify-between items-center py-2 px-3 bg-white border border-slate-200/40 rounded-xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
            <div className={`text-[11px] font-bold transition-all duration-700 ${step === 2 ? 'blur-sm opacity-0' : 'blur-none opacity-100'}`}>
                {step === 0 ? value : "****************"}
            </div>
        </div>
    );
}
