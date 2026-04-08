import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Star, ArrowUpRight } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { SlotNumber } from '../SlotNumber';
import { fetchGMBMetrics } from '../../lib/gmb-service';

export const NorthStarSummaryCards: React.FC<{ currency?: string }> = ({ currency: propCurrency }) => {
    const { leads, getStats, googleProfile, setGoogleProfile, region, googlePlaceId } = useDashboardStore();
    const { pipelineValue } = getStats();
    const currency = propCurrency || (region === 'UK' ? '£' : '$');

    // Fetch Google My Business Metrics on Mount
    useEffect(() => {
        const loadGMBData = async () => {
            try {
                const metrics = await fetchGMBMetrics(googlePlaceId);
                setGoogleProfile(metrics);
            } catch (error) {
                console.error("GMB Fetch Error:", error);
            }
        };
        loadGMBData();
    }, [setGoogleProfile, googlePlaceId]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {cards.map((card, idx) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="group bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between min-h-[220px]"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-50 transition-colors group-hover:border-emerald-100 group-hover:bg-emerald-50/30 shrink-0">
                            <card.icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" strokeWidth={1} />
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${card.trend.includes('%') || card.trend === 'PRIORITY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {card.trend.toUpperCase()}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-sans mb-1.5">{card.title}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter font-serif">
                                {typeof card.value === 'number' && card.title !== "Reputation Power" ? (
                                    <SlotNumber value={card.value} prefix={card.prefix} />
                                ) : (
                                    <>
                                        <span className="text-xl text-slate-300 font-medium mr-0.5 font-sans">{card.prefix}</span>
                                        {card.value}
                                        <span className="text-lg text-slate-300 font-medium ml-0.5 font-sans">{card.suffix}</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors font-sans">{card.description}</p>
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                             <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
