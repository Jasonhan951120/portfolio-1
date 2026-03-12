import React from "react";
import { motion } from "motion/react";
import { TrendingUp, AlertCircle, BarChart3, ArrowUpRight, Ghost } from "lucide-react";
import { AnimatedNumber } from "../common/AnimatedNumber";

interface RevenueMetricsProps {
    systemGeneratedRevenue: number;
    marketingROAS: number;
    revenueAtRisk: number;
    className?: string;
}

export function RevenueMetrics({ systemGeneratedRevenue, marketingROAS, revenueAtRisk, className = "" }: RevenueMetricsProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
            {/* System Generated Revenue - Focus: Mint */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden group shadow-sm"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <TrendingUp className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Generated Revenue</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <AnimatedNumber
                        value={systemGeneratedRevenue}
                        className="text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tighter"
                        prefix="£"
                    />
                </div>

                <p className="text-[11px] text-slate-400 mt-4 font-medium tracking-tight">Revenue recovered purely via AI automations and logic.</p>
            </motion.div>

            {/* Marketing ROAS Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden group shadow-sm"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all duration-700" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                        <BarChart3 className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Marketing ROAS (Meta/Google)</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <AnimatedNumber
                        value={marketingROAS}
                        className="text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tighter"
                        prefix=""
                        suffix="x"
                    />
                    <div className="flex items-center text-[10px] font-bold text-amber-600 mb-2 px-2 py-1 bg-amber-50 rounded-lg">
                        Ad Spend vs. Closed Revenue
                    </div>
                </div>

                <p className="text-[11px] text-gray-400 mt-4 font-medium tracking-tight">Return on Ad Spend based on deterministic attribution.</p>
            </motion.div>

            {/* Revenue at Risk - Focus: Vibrant Red */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden group shadow-sm"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all duration-700" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                        <Ghost className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Revenue at Risk</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <AnimatedNumber
                        value={revenueAtRisk}
                        className="text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tighter"
                        prefix="£"
                    />
                    <AlertCircle className="w-5 h-5 text-red-500 mb-3 animate-pulse" />
                </div>

                <p className="text-[11px] text-gray-400 mt-4 font-medium tracking-tight">Potential value of neglected leads sitting idle in the pipeline.</p>
            </motion.div>
        </div>
    );
}
