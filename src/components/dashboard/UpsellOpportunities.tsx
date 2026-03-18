import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Lead {
    id: string;
    name: string;
    service: string;
    status: string;
    phone?: string;
}

interface UpsellOpportunitiesProps {
    leads: Lead[];
    className?: string;
}

export function UpsellOpportunities({ leads, className = "" }: UpsellOpportunitiesProps) {
    const [triggeredIds, setTriggeredIds] = useState<Set<string>>(new Set());

    const opportunities = useMemo(() => {
        return leads
            ?.filter((l) => l.status === "Sale Closed" || l.status === "Consultation Done")
            ?.map((l) => {
                let recommendation = "";
                let value = 0;
                let rationale = "";

                const serviceLower = l.service.toLowerCase();

                if (serviceLower.includes("invisalign") || serviceLower.includes("aligner")) {
                    recommendation = "Teeth Whitening";
                    value = 350;
                    rationale = "Post-alignment brightness";
                } else if (serviceLower.includes("implant")) {
                    recommendation = "6-Month Checkup & Hygiene";
                    value = 150;
                    rationale = "Implant maintenance";
                } else if (serviceLower.includes("whitening")) {
                    recommendation = "Composite Bonding";
                    value = 500;
                    rationale = "Enhance new shade";
                } else {
                    recommendation = "Routine Hygiene";
                    value = 90;
                    rationale = "Ongoing care";
                }

                return { ...l, recommendation, upsellValue: value, rationale };
            })
            .slice(0, 4); // Show top 4
    }, [leads]);

    const handleTrigger = async (id: string) => {
        try {
            // Actual Edge Function Invocation to WhatsApp Twilio Webhook
            const { error } = await supabase.functions.invoke('webhook-whatsapp', {
                body: { leadId: id }
            });

            if (error) throw error;

            setTriggeredIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
        } catch (err) {
            console.error("Failed to trigger WhatsApp promo:", err);
        }
    };

    if (opportunities.length === 0) return null;

    return (
        <div className={`bg-[#1C1C1E] border border-white/5 rounded-[32px] p-8 ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#2AF598]" />
                        AI Upsell Engine
                    </h3>
                    <p className="text-[12px] text-gray-400 mt-1 font-medium">Logical next steps based on treatment history</p>
                </div>
            </div>

            <div className="space-y-3">
                {opportunities?.map((opp, idx) => {
                    const isTriggered = triggeredIds.has(opp.id);
                    return (
                        <motion.div
                            key={opp.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-4 rounded-2xl border border-white/5 bg-[#121212]/50 hover:bg-[#2AF598]/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[13px] font-bold text-white">{opp.name}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2AF598] bg-[#2AF598]/10 px-2 py-0.5 rounded-full">
                                            {opp.rationale}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-gray-500">
                                        <span className="line-through opacity-50">{opp.service}</span>
                                        <ArrowRight className="w-3 h-3 text-gray-600" />
                                        <span className="text-white/80">{opp.recommendation}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="block text-[10px] uppercase tracking-wider text-gray-600 font-bold mb-0.5">Pot. Value</span>
                                        <span className="text-[14px] font-black text-[#2AF598]">£{opp.upsellValue.toLocaleString()}</span>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isTriggered ? (
                                            <motion.button
                                                key="triggered"
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-[#2AF598]" />
                                                Sent
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                key="trigger"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleTrigger(opp.id)}
                                                className="h-9 px-4 rounded-xl bg-[#00A1FF]/10 text-[#00A1FF] hover:bg-[#00A1FF]/20 border border-[#00A1FF]/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Trigger
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
