import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

interface DailyInsightProps {
    metrics: {
        spend: number;
        leads: number;
        roi: number;
        topPlatform: string;
    };
    currency?: string;
}

/**
 * DailyInsight - A high-end analytics card featuring Matte Dark Mode and Glassmorphism.
 */
export default function DailyInsight({ metrics, currency = '£' }: DailyInsightProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors duration-500" />

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-[0.2em] leading-none mb-2">Automated Intelligence</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">High-Intent Acquisition Forecast</p>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-slate-300 text-[15px] leading-relaxed font-medium">
                    Automated performance auditing confirms that <span className="text-emerald-400 font-bold">{metrics.topPlatform} Channels</span> are exhibiting exceptional conversion efficiency.
                    With a strategic allocation of <span className="text-slate-100 font-bold tabular-nums tracking-tighter">{currency}{metrics.spend}</span> yesterday, the system identified
                    <span className="text-slate-100 font-bold tabular-nums tracking-tighter"> {metrics.leads} high-value procedural leads</span>.
                    The verified conversion efficiency (ROI) is currently optimized at <span className="text-emerald-400 font-bold tabular-nums tracking-tighter">{metrics.roi}x</span>.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-800/50 rounded-[2rem] border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
                        </div>
                        <div className="text-lg font-bold text-slate-100">Optimal Velocity</div>
                    </div>
                    <div className="p-5 bg-slate-800/50 rounded-[2rem] border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Maintain Velocity</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                    <span>Real-time Sync Active</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    System Verified
                </div>
            </div>
        </motion.div>
    );
}

