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
            color: "text-emerald-600",
            bg: "bg-emerald-50 border border-emerald-100",
            trend: "+12.5%",
            description: "Active high-ticket value"
        },
        {
            title: "High Intent Leads",
            value: highIntentCount,
            prefix: "",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50 border border-blue-100",
            trend: "🔥 Priority",
            description: "Patients ready to book"
        },
        {
            title: "Reputation Power",
            value: googleProfile?.rating || 4.9,
            prefix: "",
            suffix: "/5.0",
            icon: Star,
            color: "text-violet-600",
            bg: "bg-violet-50 border border-violet-100",
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
                    className="relative group overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-slate-200/50"
                >
                    {/* Animated Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border 
                            ${card.title === 'High Intent Leads' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                        >
                            <span className="uppercase tracking-widest">{card.trend}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                {typeof card.value === 'number' && card.title !== "Reputation Power" ? (
                                    <SlotNumber value={card.value} prefix={card.prefix} />
                                ) : (
                                    <>
                                        {card.prefix}{card.value}{card.suffix}
                                    </>
                                )}
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
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
