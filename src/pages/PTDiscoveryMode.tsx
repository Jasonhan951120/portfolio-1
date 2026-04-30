import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronRight, ArrowRight, ShieldCheck,
    Calendar, CheckCircle2, Star, CreditCard,
    Lock as LockIcon, ArrowLeft, Play, Sparkles, MessageCircle
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEMO_LEADS } from "../lib/demoData";
import { getTreatmentTemplate, INDUSTRY_TEMPLATES } from "../lib/treatmentTemplates";
import { useDashboardStore } from "../store/useDashboardStore";

const bentoBoxClass = "bg-white border border-black/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]";
const glassBoxClass = "bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden";

const PTDiscoveryMode: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { clinicName, clinicLogo, clinicType } = useDashboardStore();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [timeLeft, setTimeLeft] = useState(47 * 3600 + 59 * 60 + 59);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

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
            document.title = `${lead.name}'s Bespoke Smile Protocol | ${clinicName || 'Elite Clinic'}`;
        }
    }, [lead?.name, clinicName]);

    const activeTreatment = getTreatmentTemplate(clinicType, lead?.treatment_name || lead?.service || Object.keys(INDUSTRY_TEMPLATES[clinicType] || {})[0] || 'Dental Implants');
    
    // Dynamic content from PT Engine (Backoffice)
    const displayBeforeImg = lead?.pt_before_image || null;
    const displayAfterImg = lead?.pt_after_image || null;
    const displayBookingUrl = lead?.pt_booking_url;

    const dynamicTotalValue = lead?.pt_price_override ? Number(lead.pt_price_override) : (lead?.potential_value ? Number(lead.potential_value) : parseInt(activeTreatment.investment.replace(/[^0-9]/g, ''), 10));
    const dynamicMonthly = Math.round(dynamicTotalValue / 24);

    const personalizedNote = lead?.pt_personalized_note;
    const masterDescription = activeTreatment.description;

    const isPlaceholder = (url: string | null | undefined) => {
        if (!url) return true;
        const lowUrl = url.toLowerCase();
        return lowUrl.includes('dummy') || 
               lowUrl.includes('placeholder') || 
               lowUrl.includes('example.com') ||
               url.length < 10;
    };

    const hasValidImages = !isPlaceholder(displayBeforeImg) && !isPlaceholder(displayAfterImg);
    const hasTestimonial = !!activeTreatment.testimonial;

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-8 h-8 text-[#87A96B]" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#87A96B]/20">
            {/* Minimal Header */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-gray-100 bg-white sticky top-0 z-[100]">
                <div className="flex items-center gap-3">
                    {clinicLogo ? (
                        <img src={clinicLogo} alt={clinicName} className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-gray-200" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                            <span className="text-white font-bold text-lg">{clinicName ? clinicName.charAt(0) : 'E'}</span>
                        </div>
                    )}
                    <span className="font-bold tracking-tight uppercase text-sm">{clinicName || 'Elite Clinic'}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#87A96B]">
                    <ShieldCheck className="w-4 h-4" /> Clinical Gold Standard | Harley Street Excellence
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-88px)] pb-40">
                
                {/* 1. The Hero Visual (Slider) - BENTO BOX */}
                {hasValidImages && (
                    <div className={`col-span-1 lg:col-span-8 ${bentoBoxClass} flex flex-col justify-center bg-gray-50/30`}>
                        <div className="w-full max-w-2xl mx-auto">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] mb-2 block">
                                    {lead?.name ? `Prepared Exclusively for ${lead.name}` : 'Your Tailored Transformation'}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-950 tracking-tight leading-tight">
                                    Visualising Your <br />New Smile
                                </h1>
                            </motion.div>

                            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl shadow-gray-200/50 group border border-black/5 ring-1 ring-white/50">
                                <img src={displayAfterImg!} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 w-full h-full object-cover overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                                    <img src={displayBeforeImg!} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize group z-20" style={{ left: `${sliderPosition}%` }}>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100">
                                        <div className="flex gap-1 items-center">
                                            <div className="w-0.5 h-3 rounded-full bg-slate-300" />
                                            <div className="w-0.5 h-3 rounded-full bg-slate-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[9px] font-bold uppercase tracking-widest">Initial</div>
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#87A96B]/90 backdrop-blur-md rounded-full text-white text-[9px] font-bold uppercase tracking-widest">Predicted</div>
                                <input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Personal Note & Clinical Overview - BENTO BOX */}
                <div className={`col-span-1 ${hasValidImages ? 'lg:col-span-4' : 'lg:col-span-12'} ${bentoBoxClass} flex flex-col justify-center bg-gradient-to-br from-white to-[#f8f9fa]`}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl mx-auto">
                        {!hasValidImages && (
                            <div className="mb-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] mb-2 block">
                                    {lead?.name ? `Prepared Exclusively for ${lead.name}` : 'Your Tailored Transformation'}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-950 tracking-tight leading-tight">
                                    {lead?.treatment_name || lead?.service}
                                </h1>
                            </div>
                        )}

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#87A96B]/10 rounded-full text-[#87A96B] text-[10px] font-black uppercase tracking-widest mb-6 border border-[#87A96B]/20">
                            Clinical Overview
                        </div>
                        
                        {personalizedNote ? (
                           <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm mb-6 relative">
                               <div className="absolute -top-3 -left-2 text-4xl text-[#87A96B]/20 font-serif">"</div>
                               <p className="text-sm text-slate-700 italic font-medium leading-relaxed relative z-10">
                                   {personalizedNote}
                               </p>
                           </div>
                        ) : null}

                        <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight mb-1">
                            {lead?.name ? `${lead.name}'s Personalized Smile Transformation: A New Standard of Confidence` : 'Personalized Smile Transformation: A New Standard of Confidence'}
                        </h3>
                        <p className="text-sm text-slate-500 italic mb-6 border-b border-black/5 pb-4">Crafted with Harley Street Excellence</p>

                        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                            {masterDescription}
                        </p>

                        <div className="space-y-3">
                            {activeTreatment.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-start gap-4 py-3 border-b border-black/5 last:border-0">
                                    <div className="w-6 h-6 rounded-full bg-[#87A96B]/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-slate-800">{feature}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Lifetime durability and premium bio-compatibility.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 3. Smart Trust & Testimonial - BENTO BOX */}
                <div className={`col-span-1 lg:col-span-5 ${bentoBoxClass} flex flex-col justify-center items-center text-center`}>
                    {hasTestimonial ? (
                        <div className="max-w-xs mx-auto">
                            <Star className="w-8 h-8 text-[#87A96B] fill-[#87A96B] mx-auto mb-6" />
                            <p className="text-lg text-slate-800 font-serif italic leading-relaxed mb-4">
                                "{activeTreatment.testimonial}"
                            </p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#87A96B]">— Verified Patient</span>
                        </div>
                    ) : (
                        <div className="max-w-xs mx-auto">
                            <div className="flex items-center justify-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">5.0 Google Rating</h3>
                            <p className="text-sm font-medium text-slate-500 max-w-[200px] mx-auto">Trusted Harley Street Excellence & Clinical Precision</p>
                            <div className="mt-8 flex -space-x-3 justify-center">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold shadow-md">
                                        {["JD", "MK", "SL", "TW"][i]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Clinical Value & Expert Access (Glassmorphism) - BENTO/GLASS BOX */}
                <div className={`col-span-1 lg:col-span-7 ${glassBoxClass} flex flex-col justify-between group hover:border-[#87A96B]/30 transition-all duration-500`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#87A96B]/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-[#87A96B]/20" />
                    
                    <div className="relative z-10 w-full max-w-lg mx-auto">
                        <div className="flex flex-col items-center justify-center mb-8 text-center border-b border-black/5 pb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#87A96B] mb-2">All-Inclusive Treatment Value</p>
                            <div className="flex items-baseline gap-2 mb-1 justify-center">
                                <span className="text-5xl font-display font-bold text-slate-900 tracking-tight">£{dynamicTotalValue.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-center flex-wrap gap-3 mb-10">
                            <div className="px-3 py-1.5 bg-[#87A96B]/5 border border-[#87A96B]/20 rounded-full text-[10px] font-bold text-[#87A96B] uppercase tracking-widest">Premium Material</div>
                            <div className="px-3 py-1.5 bg-[#87A96B]/5 border border-[#87A96B]/20 rounded-full text-[10px] font-bold text-[#87A96B] uppercase tracking-widest">Digital Simulation</div>
                            <div className="px-3 py-1.5 bg-[#87A96B]/5 border border-[#87A96B]/20 rounded-full text-[10px] font-bold text-[#87A96B] uppercase tracking-widest">Aftercare Suite</div>
                        </div>

                        {/* Ultimate Conversion CTA - WhatsApp Concierge */}
                        <motion.button
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                window.open('https://wa.me/447700900000', '_blank');
                            }}
                            className="w-full py-5 bg-slate-950 rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <MessageCircle className="w-5 h-5 text-[#25D366]" fill="#25D366" stroke="none" /> OPEN MY PRIVATE CLINICAL LINE
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#87A96B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                        <div className="text-center mt-6">
                            <p className="text-center text-xs text-slate-500 font-medium tracking-wide">Connect directly with your dedicated specialist to finalize your smile transformation.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PTDiscoveryMode;
