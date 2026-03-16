import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, ArrowUpRight } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { SlotNumber } from '../SlotNumber';

export const NorthStarSummaryCards: React.FC = () => {
    const { leads, getStats, googleProfile, region } = useDashboardStore();
    const { pipelineValue } = getStats();

    const highIntentCount = useMemo(() => {
        return leads.filter(l => (l.intent_score || 0) >= 80).length;
    }, [leads]);

    const currency = region === 'UK' ? '£' : '$';

    const cards = [
        {
            title: "Pipeline Potential",
            value: pipelineValue,
            prefix: currency,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            trend: "+12.5%",
            description: "Active high-ticket value"
        },
        {
            title: "High Intent Leads",
            value: highIntentCount,
            prefix: "",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            trend: "🔥 Priority",
            description: "Patients ready to book"
        },
        {
            title: "Reputation Power",
            value: googleProfile?.rating || 4.9,
            prefix: "",
            suffix: "/5.0",
            icon: Star,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
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
                    transition={{ delay: idx * 0.1 }}
                    className="relative group overflow-hidden rounded-[32px] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl transition-all hover:border-slate-600 hover:bg-slate-900/90"
                >
                    {/* Animated Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{card.trend}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter">
                                {typeof card.value === 'number' && card.title !== "Reputation Power" ? (
                                    <SlotNumber value={card.value} prefix={card.prefix} />
                                ) : (
                                    <>
                                        {card.prefix}{card.value}{card.suffix}
                                    </>
                                )}
                            </span>
                        </div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.title}</h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-[10px] font-medium text-slate-500 italic">{card.description}</p>
                        <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
