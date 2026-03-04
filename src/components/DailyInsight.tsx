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
}

export default function DailyInsight({ metrics }: DailyInsightProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#C5A059]/10 transition-colors duration-500" />

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none mb-1">Yesterday's Insight</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">AI-Generated Intelligence</p>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                    Your <span className="text-[#C5A059] font-bold">{metrics.topPlatform} Ads</span> are performing exceptionally well.
                    With a spend of <span className="text-gray-900 font-bold">£{metrics.spend}</span> yesterday, you generated
                    <span className="text-gray-900 font-bold"> {metrics.leads} high-intent leads</span>.
                    The estimated ROI stands at <span className="text-[#87A96B] font-bold">{metrics.roi}x</span>.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">High Performance</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommendation</span>
                        </div>
                        <div className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">Maintain Budget</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                <span>Real-time Sync Active</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#87A96B] animate-pulse" />
                    Live
                </div>
            </div>
        </motion.div>
    );
}
