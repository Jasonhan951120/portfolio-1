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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                    className="relative group bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                >
                    <div className="flex justify-between items-start mb-6">
                        <card.icon className="w-5 h-5 text-slate-400" strokeWidth={1.2} />
                        <div className={`uppercase tracking-[0.2em] text-[10px] font-bold px-2 py-1 rounded-md flex items-center justify-center ${card.trend.includes('%') || card.trend === 'PRIORITY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            {card.trend.toUpperCase()}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{card.title}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-semibold text-slate-900 tracking-tight">
                                {typeof card.value === 'number' && card.title !== "Reputation Power" ? (
                                    <SlotNumber value={card.value} prefix={card.prefix} />
                                ) : (
                                    <>
                                        <span className="text-2xl text-slate-400 font-medium mr-1">{card.prefix}</span>
                                        {card.value}
                                        <span className="text-xl text-slate-400 font-medium ml-1">{card.suffix}</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">{card.description}</p>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" strokeWidth={1.5} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
