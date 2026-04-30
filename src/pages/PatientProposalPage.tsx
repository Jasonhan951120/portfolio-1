import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronRight, ArrowRight, ShieldCheck,
    Calendar, CheckCircle2, Star, CreditCard,
    Lock as LockIcon, ArrowLeft, Play, Sparkles,
    Heart, Stethoscope, Target, TrendingUp
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEMO_LEADS } from "../lib/demoData";
import { TreatmentTemplate as BaseTreatmentTemplate, getTreatmentTemplate, INDUSTRY_TEMPLATES } from "../lib/treatmentTemplates";
import { useDashboardStore, TreatmentTemplate as StoreTreatmentTemplate } from "../store/useDashboardStore";

const bentoBoxClass = "bg-white border border-black/5 rounded-[40px] p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]";
const glassBoxClass = "bg-white/60 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden";

const PatientProposalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { clinicName, clinicLogo, clinicType } = useDashboardStore();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sliderPosition, setSliderPosition] = useState(50);

    useEffect(() => {
        const fetchLead = async () => {
            if (!id) return;
            
            // Check demo data first for instant preview
            const isDemo = id.startsWith('demo-') || id.startsWith('mock-') || id.length <= 8;
            if (isDemo) {
                const demoLead = DEMO_LEADS.find(l => String(l.id).startsWith(id));
                if (demoLead) {
                    setLead(demoLead);
                    setLoading(false);
                    return;
                }
            }

            try {
                const { data, error } = await supabase
                    .from("consultation_requests")
                    .select("*")
                    .ilike("id", `${id}%`)
                    .single();
                if (data) setLead(data);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    useEffect(() => {
        if (lead?.name) {
            document.title = `Exclusive Proposal: ${lead.name} | ${clinicName || 'Hanlanoc'}`;
        }
    }, [lead?.name, clinicName]);

    const { templates } = useDashboardStore();
    const matchedTemplate = (lead && templates?.find((t: StoreTreatmentTemplate) => t.name === (lead.treatment_name || lead.service))) as StoreTreatmentTemplate | undefined;
    const activeTreatmentBase = getTreatmentTemplate(clinicType, lead?.treatment_name || lead?.service || 'Dental Implants') as BaseTreatmentTemplate;
    
    // Chameleon Logic: Determine if images exist in Settings (Signature Menu) or Lead overrides
    const displayBeforeImg = lead?.pt_before_image || matchedTemplate?.beforeImg || null;
    const displayAfterImg = lead?.pt_after_image || matchedTemplate?.afterImg || null;
    const hasImages = (!!displayBeforeImg && displayBeforeImg.length > 10) || (!!displayAfterImg && displayAfterImg.length > 10);
    
    const displayBookingUrl = lead?.pt_booking_url || matchedTemplate?.bookingUrl;

    const dynamicTotalValue = lead?.pt_price_override ? Number(lead.pt_price_override) : (lead?.potential_value || matchedTemplate?.price || 3500);
    const dynamicMonthly = Math.round(dynamicTotalValue / 24);
    const hasPricing = Boolean(lead?.pt_price_override || lead?.potential_value);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                <Sparkles className="w-10 h-10 text-slate-900" strokeWidth={1} />
            </motion.div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Authenticating Secure Proposal...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFB] text-slate-950 font-sans selection:bg-slate-900 selection:text-white">
            {/* Elite Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100 px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {clinicLogo ? (
                        <img src={clinicLogo} alt={clinicName} className="h-10 w-auto" />
                    ) : (
                        <div className="text-xl font-bold tracking-tighter uppercase">{clinicName || 'Hanlanoc Clinic'}</div>
                    )}
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Secure Patient Portal V4.0</span>
                    <div className="px-5 py-2 bg-slate-900 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">Priority Access</div>
                </div>
            </nav>

            <main className="pt-40 max-w-7xl mx-auto px-6 pb-40">
                {/* Hero Header - Unified for both styles */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`mb-24 ${!hasImages ? 'max-w-4xl' : ''}`}
                >
                    <span className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
                        Secure Patient Protocol
                    </span>
                    <h1 className={`text-6xl md:text-8xl font-display font-medium tracking-tighter mb-10 leading-[0.9] text-slate-950`}>
                        Exclusive Clinical Strategy <br />
                        <span className="italic font-serif text-slate-800">For {lead?.name}</span>
                        {lead?.age && <span className="text-3xl font-sans text-slate-200 ml-4 align-top">({lead.age}y)</span>}
                    </h1>
                    <p className="max-w-3xl text-xl text-slate-500 font-medium leading-relaxed tracking-tight">
                        A bespoke treatment protocol meticulously designed by the Hanlan clinical team to achieve your specific {lead?.service || 'transformative'} goals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* [AI-Driven Strategy / Clinical Diagnosis] - Unified */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`col-span-1 lg:col-span-12 ${bentoBoxClass} ${!hasImages ? 'bg-gradient-to-br from-white to-slate-50/50' : ''}`}
                    >
                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-8 text-slate-900">
                                    <Target className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">01. AI-Driven Protocol</h3>
                                </div>
                                <h2 className="text-4xl font-display font-bold mb-8 tracking-tighter leading-none">Diagnostic Case Analysis</h2>
                                <div className="bg-white/50 backdrop-blur-xl p-10 md:p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-100/50 transition-colors" />
                                    <p className="text-2xl text-slate-800 leading-[1.4] font-serif italic relative z-10">
                                        "{lead?.ai_draft_context || lead?.notes || "Based on our comprehensive review, we have identified key opportunities to optimize your results while ensuring absolute clinical safety and comfort."}"
                                    </p>
                                </div>
                            </div>
                            <div className="w-full lg:w-96 flex flex-col gap-6">
                                {[
                                    { label: 'Clinical Match', value: lead?.intent_score || 85, color: 'text-emerald-500' },
                                    { label: 'Strategic Complexity', value: 42, color: 'text-slate-900' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col justify-between h-full group hover:border-indigo-100 transition-colors">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">{stat.label}</div>
                                        <div className="flex items-baseline gap-2">
                                            <div className={`text-4xl font-display font-medium ${stat.color}`}>{stat.value}%</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optimized</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Chameleon Logic Renders Here */}
                    {hasImages ? (
                        /* Case A: Visual Brochure Style */
                        <>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={`col-span-1 lg:col-span-8 ${bentoBoxClass}`}
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3 text-slate-900">
                                        <Play className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">02. Visual Simulation</h3>
                                    </div>
                                    <div className="hidden md:flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                                <div className="group relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl border border-slate-100">
                                     <img src={displayAfterImg!} alt="Predicted Outcome" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                                     <div className="absolute inset-0 w-full h-full object-cover overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                                         <img src={displayBeforeImg!} alt="Initial State" className="absolute inset-0 w-full h-full object-cover" />
                                     </div>
                                     <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize group/slider z-20" style={{ left: `${sliderPosition}%` }}>
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center border border-slate-100 group-hover/slider:scale-110 transition-transform">
                                             <div className="flex gap-2 items-center">
                                                 <div className="w-0.5 h-6 rounded-full bg-slate-200" />
                                                 <div className="w-0.5 h-6 rounded-full bg-slate-200" />
                                             </div>
                                         </div>
                                     </div>
                                     <div className="absolute bottom-10 left-10 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-full text-white text-[11px] font-bold uppercase tracking-widest border border-white/10">Consultation Initial</div>
                                     <div className="absolute bottom-10 right-10 px-6 py-3 bg-indigo-600/90 backdrop-blur-2xl rounded-full text-white text-[11px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">Clinical Simulation</div>
                                     <input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={`col-span-1 lg:col-span-4 ${bentoBoxClass} bg-slate-950 text-white`}
                            >
                                <div className="flex items-center gap-3 mb-10 text-slate-400">
                                     <TrendingUp className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
                                     <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">03. Strategic Values</h3>
                                </div>
                                <div className="space-y-10">
                                    {activeTreatmentBase.features.map((feature: string, i: number) => (
                                        <div key={i} className="group relative">
                                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-indigo-500 transition-all duration-500 rounded-full" />
                                            <h4 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{feature}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Precision Aesthetic Harmony</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        /* Case B: Quiet Luxury Letter Style (No Images) */
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className={`col-span-1 lg:col-span-12 ${bentoBoxClass}`}
                        >
                            <div className="max-w-4xl mx-auto py-10 md:py-20">
                                <div className="flex items-center gap-3 mb-12 text-slate-900 border-b border-slate-100 pb-6 w-fit">
                                     <TrendingUp className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                                     <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">02. Curated Strategic Pillars</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                    {activeTreatmentBase.features.map((feature: string, i: number) => (
                                        <div key={i} className="group border-l-[3px] border-slate-100 hover:border-indigo-500 transition-colors pl-8">
                                            <h4 className="text-2xl font-display font-medium mb-3 tracking-tighter text-slate-900">{feature}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed font-sans font-medium uppercase tracking-widest text-[11px]">
                                                Clinical Excellence & Longevity Protocol
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* [Treatment Plan / Journey] - Unified Enhancement */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`col-span-1 lg:col-span-12 ${bentoBoxClass} ${!hasImages ? 'border-none shadow-none bg-transparent px-0' : ''}`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div>
                                <div className="flex items-center gap-3 mb-10 text-slate-900">
                                    <Calendar className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">04. The Clinical Journey</h3>
                                </div>
                                <h2 className="text-5xl font-display tracking-tighter leading-[0.9] mb-10 italic font-serif">Meticulous Path To <br />Transformative Outcomes</h2>
                                <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium tracking-tight">
                                    {(matchedTemplate as any)?.description || activeTreatmentBase.description}
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                     <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-indigo-100 transition-colors">
                                         <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-2">Category</div>
                                         <div className="text-sm font-bold uppercase tracking-tighter text-slate-900">{clinicType} Elite</div>
                                     </div>
                                     <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-indigo-100 transition-colors">
                                         <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-2">Success Rate</div>
                                         <div className="text-sm font-bold uppercase tracking-widest text-emerald-600">99.8% Certified</div>
                                     </div>
                                </div>
                            </div>

                            <div className={`p-10 md:p-14 flex flex-col justify-center ${glassBoxClass}`}>
                                {hasPricing && (
                                <div className="text-center mb-12">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Secure Investment Overview</h3>
                                    <div className="flex items-baseline justify-center gap-3 mb-3">
                                        <span className="text-7xl font-display font-medium tracking-tighter text-slate-950">£{dynamicMonthly.toLocaleString()}</span>
                                        <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">/mo</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest bg-slate-100 inline-block px-4 py-2 rounded-full border border-slate-200/50">
                                        24 Mo Protocol • 0% Interest Facilitated
                                    </p>
                                </div>
                                )}
                                <div className="flex flex-col gap-5">
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            const patientName = lead?.name || 'a patient';
                                            const treatmentName = lead?.treatment_name || lead?.service || 'treatment';
                                            const message = `Hello Hanlanoc Clinic, this is ${patientName}. ✨\nI have reviewed my clinical strategy for ${treatmentName} at https://www.hanlanoc.com and I am ready to start my transformation! \nPlease let me know the next steps for scheduling my first appointment.`;
                                            window.open(`https://wa.me/447700900000?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        className="w-full py-7 bg-slate-950 hover:bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl transition-all shadow-indigo-200/20"
                                    >
                                        ACCEPT & START TREATMENT
                                    </motion.button>
                                    <button className="w-full py-7 bg-white/50 hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full font-black uppercase tracking-[0.2em] text-[12px] transition-all backdrop-blur-xl">
                                        Consult with Clinical Lead
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 pt-20 border-t border-slate-100 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-8 text-slate-300">
                        <ShieldCheck className="w-8 h-8" strokeWidth={1} />
                        <LockIcon className="w-8 h-8" strokeWidth={1} />
                        <Stethoscope className="w-8 h-8" strokeWidth={1} />
                    </div>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em] text-center">
                        Encrypted Patient Data • Clinical Standard 27001 • Harley Street Excellence
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PatientProposalPage;
