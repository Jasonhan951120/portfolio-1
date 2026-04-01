import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Star, ArrowUpRight } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { SlotNumber } from '../SlotNumber';
import { fetchGMBMetrics } from '../../lib/gmb-service';

export const NorthStarSummaryCards: React.FC<{ currency?: string }> = ({ currency: propCurrency }) => {
    const { leads, getStats, googleProfile, setGoogleProfile, region } = useDashboardStore();
    const { pipelineValue } = getStats();
    const currency = propCurrency || (region === 'UK' ? '£' : '$');

    // Fetch Google My Business Metrics on Mount
    useEffect(() => {
        const loadGMBData = async () => {
            try {
                const metrics = await fetchGMBMetrics();
                setGoogleProfile(metrics);
            } catch (error) {
                console.error("GMB Fetch Error:", error);
            }
        };
        loadGMBData();
    }, [setGoogleProfile]);

    const highIntentCount = useMemo(() => {
        return leads.filter(l => (l.intent_score || 0) >= 80).length;
    }, [leads]);


    const cards = [
        {
            title: "Pipeline Potential",
            value: pipelineValue,
            prefix: currency,
            icon: TrendingUp,
            trend: "+12.5%",
            description: "Active high-ticket value"
        },
        {
            title: "High Intent Leads",
            value: highIntentCount,
            prefix: "",
            icon: Users,
            trend: "PRIORITY",
            description: "Patients ready to book"
        },
        {
            title: "Reputation Power",
            value: googleProfile?.rating || 4.9,
            prefix: "",
            suffix: "/5.0",
            icon: Star,
            trend: googleProfile?.reviewCount ? `${googleProfile.reviewCount} Reviews` : "Authority",
            description: "Google verification active"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {cards.map((card, idx) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="relative group overflow-hidden bg-white/80 backdrop-blur-md border border-slate-50 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)]"
                >
                    {/* Animated Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-transparent group-hover:scale-110 transition-transform duration-300">
                            <card.icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <div className="bg-transparent border border-slate-200 text-slate-500 uppercase tracking-[0.15em] text-[9px] px-2 py-1 rounded-md flex items-center justify-center shadow-sm">
                            {card.trend.toUpperCase()}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-400">{card.title}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extralight text-slate-800 tracking-tight">
                                {typeof card.value === 'number' && card.title !== "Reputation Power" ? (
                                    <SlotNumber value={card.value} prefix={card.prefix} />
                                ) : (
                                    <>
                                        <span className="text-3xl text-slate-400 font-extralight mr-1">{card.prefix}</span>
                                        {card.value}
                                        <span className="text-2xl text-slate-400 font-extralight ml-1">{card.suffix}</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors italic">{card.description}</p>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
