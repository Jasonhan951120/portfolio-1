import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronRight, ArrowRight, ShieldCheck,
    Calendar, CheckCircle2, Star, CreditCard,
    Lock as LockIcon, ArrowLeft, Play, Sparkles
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEMO_LEADS } from "../lib/demoData";

const ClientPTPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sliderPosition, setSliderPosition] = useState(50);

    const treatmentDetails: Record<string, any> = {
        "Dental Implants": {
            title: "Precision Implantology",
            investment: "£3,500",
            monthly: "£145.83",
            term: "24 Months",
            features: ["Custom Abutment", "Premium Titanium Post", "Hand-crafted Porcelain Crown", "Lifetime Guarantee"],
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1606811841660-1b51e9ed27ff?auto=format&fit=crop&q=80&w=1200"
            }
        },
        "Invisalign / Aligners": {
            title: "SmartSmile Simulation",
            investment: "£3,000",
            monthly: "£125.00",
            term: "24 Months",
            features: ["Full 3D Simulation", "Set of Clear Aligners", "Retainers Included", "Post-treatment Whitening"],
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1516012828019-06ad1742de8a?auto=format&fit=crop&q=80&w=1200"
            }
        }
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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    const activeTreatment = treatmentDetails[lead?.service || 'Dental Implants'] || treatmentDetails["Dental Implants"];
    const dynamicTotalValue = lead?.potential_value ? Number(lead.potential_value) : parseInt(activeTreatment.investment.replace(/[^0-9]/g, ''), 10);
    const dynamicMonthly = Math.round(dynamicTotalValue / 24);

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
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <span className="font-bold tracking-tight uppercase text-sm">Hanlan OC</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#87A96B]">
                    <ShieldCheck className="w-4 h-4" /> Secure Proposal Terminal - UK Compliance Active
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto min-h-[calc(100vh-88px)] flex flex-col lg:flex-row">
                {/* Left Side: Transformation Visual (The Hero) */}
                <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 bg-white">
                    <div className="max-w-xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-12"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] mb-2 block">
                                {lead?.name ? `Prepared Exclusively for ${lead.name}` : 'Your Tailored Transformation'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-950 leading-tight">
                                Visualising Your <br />New Smile
                            </h1>
                        </motion.div>

                        {/* Interactive Before/After Slider */}
                        <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200 group border border-gray-100">
                            <img src={activeTreatment.beforeAfter.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                            <div
                                className="absolute inset-0 w-full h-full object-cover overflow-hidden"
                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                            >
                                <img src={activeTreatment.beforeAfter.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                            </div>

                            {/* Comparison Line */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize group z-20"
                                style={{ left: `${sliderPosition}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-1 h-3 rounded-full bg-gray-200" />
                                        <div className="w-1 h-3 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Label Overlays */}
                            <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest">Initial State</div>
                            <div className="absolute top-6 right-6 px-4 py-2 bg-[#87A96B]/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest">Predicted Result</div>

                            {/* Range Hidden Input for Interactivity */}
                            <input
                                type="range"
                                min="0" max="100"
                                value={sliderPosition}
                                onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                            />
                        </div>

                        <div className="mt-8 flex items-center gap-6 justify-center">
                            <div className="flex -space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                        {["JS", "OD", "TW"][i]}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium italic">
                                "This simulation accurately reflects the desired outcome."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Investment Plan (The Closer) */}
                <div className="w-full lg:w-[550px] bg-[#FDFDFD] p-8 lg:p-16 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#87A96B]/10 rounded-full text-[#87A96B] text-[10px] font-black uppercase tracking-widest mb-6">
                            Exclusive Proposal
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gray-950 mb-8 uppercase tracking-tight">Investment Plan</h2>

                        <div className="space-y-4 mb-12">
                            {activeTreatment.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 text-[13px] font-medium text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-[#87A96B]/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        {/* Financing Focus Card */}
                        <div className="bg-white border border-gray-200 rounded-[40px] p-10 shadow-sm mb-12 relative overflow-hidden group hover:border-[#87A96B]/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#87A96B]/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Monthly Investment from</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-6xl font-display font-bold text-gray-950">£{dynamicMonthly.toLocaleString()}</span>
                                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">/mo</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#87A96B] bg-[#87A96B]/5 px-5 py-4 rounded-2xl border border-[#87A96B]/10">
                                <span className="flex items-center gap-2 rotate-0">0% Interest Options Available <Sparkles className="w-3 h-3" /></span>
                                <Star className="w-3.5 h-3.5 fill-[#87A96B] text-[#87A96B]" />
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Total Investment</span>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-gray-950">£{dynamicTotalValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-6 bg-gray-900 group rounded-[24px] text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 relative overflow-hidden shadow-2xl transition-all"
                            >
                                <span className="relative z-10">Confirm & Pay via Stripe</span>
                                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#87A96B] to-[#769b59] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>

                            <div className="flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 pt-4">
                                <div className="flex items-center gap-1.5"><LockIcon className="w-3.5 h-3.5" /> Encrypted</div>
                                <div className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Stripe Verified</div>
                                <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> UK GDPR</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Sticky Footer for Trust */}
            <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] md:w-auto px-8 py-5 bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-full shadow-2xl z-50 flex items-center gap-8 justify-center">
                <div className="hidden md:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Harley Street Standard</span>
                </div>
                <div className="h-4 w-px bg-gray-200 hidden md:block" />
                <p className="text-[10px] text-gray-500 font-medium tracking-wide">
                    This bespoke proposal is valid for the next 48 hours to secure your priority surgical slot.
                </p>
                <div className="h-4 w-px bg-gray-200 hidden md:block" />
                <button className="text-[10px] font-black text-gray-900 uppercase tracking-widest hover:text-[#87A96B] transition-colors">
                    Download PDF
                </button>
            </footer>
        </div>
    );
};

export default ClientPTPage;
