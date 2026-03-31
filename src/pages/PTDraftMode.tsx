import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles, ShieldCheck, CreditCard,
    ArrowRight, Star, PlusCircle, Check
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEMO_LEADS } from "../lib/demoData";
import { useDashboardStore } from "../store/useDashboardStore";

const bentoBoxClass = "bg-white border text-left border-black/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]";

const PTDraftMode: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const treatmentQuery = searchParams.get('treatment') || 'Unknown Treatment';
    const { clinicName, clinicLogo, clinicType, clinicId } = useDashboardStore();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saveToSettings, setSaveToSettings] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            if (!id) return;
            const isDemo = id.startsWith('demo-') || id.startsWith('mock-') || id.length <= 8;
            if (isDemo) {
                const demoLead = DEMO_LEADS.find(l => String(l.id).startsWith(id));
                if (demoLead) {
                    setLead(demoLead);
                } else {
                    setLead({ name: 'Demo Patient', potential_value: 1200 });
                }
                setLoading(false);
                return;
            }

            try {
                const { data } = await supabase.from("consultation_requests").select("*").ilike("id", `${id}%`).single();
                if (data) setLead(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    const dynamicTotalValue = lead?.pt_price_override ? Number(lead.pt_price_override) : (lead?.potential_value ? Number(lead.potential_value) : 2500);
    const dynamicMonthly = Math.round(dynamicTotalValue / 24);

    const handleSave = async () => {
        if (saveToSettings) {
            try {
                const { error } = await supabase.from('clinic_treatments').insert({
                    clinic_id: lead?.clinic_id || clinicId || 'hanlan-clinical-01',
                    service_name: treatmentQuery,
                    potential_revenue: dynamicTotalValue,
                    color: '#F4D03F', // Default Gold for AI injected
                    order_index: 99
                });
                if (error) throw error;
            } catch (err) {
                console.error("Failed to save to global settings:", err);
            }
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Generic Fallback Assets based on Clinic_Type
    const genericAssets = {
        Dental: {
            title: "Advanced Dental Assessment",
            image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200",
            desc: "Our clinical team has prepared a preliminary assessment for your completely tailored dental procedure.",
            testimonial: "A seamless, professional experience from start to finish."
        },
        Aesthetic: {
            title: "Bespoke Aesthetic Protocol",
            image: "https://images.unsplash.com/photo-1512496015851-a1c841103c81?auto=format&fit=crop&q=80&w=1200",
            desc: "Our dermatology experts have designed an individualized protocol to achieve safe, harmonious results.",
            testimonial: "Incredible attention to detail. I look and feel completely revitalized."
        },
        Wellness: {
            title: "Holistic Wellness Plan",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
            desc: "A fully integrated clinical wellness approach targeting your specific physiological needs.",
            testimonial: "The ultimate standard of recovery and wellness care."
        }
    };

    // Fallback logic for TypeScript typing & dynamic injection
    const safeType = ['Dental', 'Aesthetic', 'Wellness'].includes(clinicType as string) ? clinicType : 'Dental';
    const fallback = genericAssets[safeType as keyof typeof genericAssets];

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-8 h-8 text-amber-500" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-amber-500/20">
            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    {clinicLogo ? (
                        <img src={clinicLogo} alt={clinicName} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">{clinicName ? clinicName.charAt(0) : 'E'}</span>
                        </div>
                    )}
                    <span className="font-bold tracking-tight uppercase text-sm">{clinicName || 'Elite Clinic'}</span>
                </div>
                
                {/* Save & Learn CTA for the Doctor */}
                <div className="hidden md:flex flex-col items-end gap-2">
                    <div className="flex items-center gap-4">
                        <AnimatePresence>
                            {saved && (
                                <motion.span 
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200"
                                >
                                    <Check className="w-3.5 h-3.5" /> Template Engine Updated
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <button 
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-amber-50 rounded-full text-amber-700 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" /> Save as New Template
                        </button>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" /> AI Draft Mode
                        </div>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer group mt-1">
                        <input 
                            type="checkbox" 
                            checked={saveToSettings}
                            onChange={(e) => setSaveToSettings(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 transition-colors"
                        />
                        <span className="text-[10px] uppercase font-bold tracking-tight text-slate-500 group-hover:text-amber-700 transition-colors">
                            Add this new treatment & price to global settings
                        </span>
                    </label>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-32">
                
                <div className={`col-span-1 lg:col-span-12 flex flex-col items-center justify-center text-center py-12`}>
                    <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border border-amber-200 shadow-sm mx-auto">
                        <Sparkles className="w-3.5 h-3.5" /> AI Generated Draft
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-950 tracking-tight leading-tight mb-4">
                        {treatmentQuery}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        {lead?.name ? `Prepared Exclusively for ${lead.name}` : 'Your Tailored Transformation'}
                    </p>
                </div>

                {/* Main Visual */}
                <div className={`col-span-1 lg:col-span-7 ${bentoBoxClass} bg-slate-50/50 flex flex-col justify-center min-h-[400px]`}>
                    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg group ring-1 ring-black/5">
                        <img src={fallback.image} alt="Generative Result" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-white text-2xl font-bold tracking-tight mb-1">{fallback.title}</h3>
                            <p className="text-white/80 text-sm font-medium">Standard {safeType} Simulation Config</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className={`col-span-1 lg:col-span-5 ${bentoBoxClass} flex flex-col`}>
                    <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight mb-2">
                        Clinical Overview
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                        {fallback.desc}
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Value</p>
                                <span className="text-2xl font-bold text-slate-900">£{dynamicTotalValue.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Monthly</p>
                                <span className="text-xl font-medium text-[#1E3A8A]">£{dynamicMonthly.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {["Custom Clinical Assessment", "Full Procedural Blueprint", "Post-op Care Protocol"].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{feat}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex items-center gap-4 pt-6 border-t border-slate-100">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 shrink-0">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500 mt-[-2px]" />
                        </div>
                        <p className="text-sm text-slate-700 italic font-medium leading-snug">
                            "{fallback.testimonial}"
                        </p>
                    </div>
                </div>

            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden bg-white border-t border-slate-200 z-50">
                <button 
                    onClick={handleSave}
                    className="w-full py-3 bg-amber-100 rounded-xl text-amber-800 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-amber-200 shadow-sm"
                >
                    <PlusCircle className="w-4 h-4" /> Save Template
                </button>
            </div>
        </div>
    );
};

export default PTDraftMode;
