import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, TrendingUp, Zap, Globe, Sparkles, Activity } from 'lucide-react';

interface LiveTrackingHeaderProps {
    metrics: {
        activeUsers: number;
        dailyRevenue: number;
        conversionRate: number;
        liveLeads: number;
    };
}

export function LiveTrackingHeader({ metrics }: LiveTrackingHeaderProps) {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            label: "Live Traffic",
            value: metrics.activeUsers,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
            sub: "Active now"
        },
        {
            label: "Revenue Potential",
            value: `£${metrics.dailyRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-[#87A96B]",
            bg: "bg-[#87A96B]/10",
            sub: "Today's stream"
        },
        {
            label: "Conversion",
            value: `${metrics.conversionRate}%`,
            icon: Zap,
            color: "text-purple-500",
            bg: "bg-purple-50",
            sub: "Efficiency"
        },
        {
            label: "Hot Leads",
            value: metrics.liveLeads,
            icon: Activity,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            sub: "Awaiting sync"
        }
    ];

    return (
        <div className="mb-10">
            <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/50 to-purple-50/50 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:opacity-75 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg shadow-black/10">
                                <Globe className="w-8 h-8 text-white" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                                <div className={`w-1.5 h-1.5 bg-white rounded-full ${pulse ? 'scale-150' : 'scale-100'} transition-transform duration-1000`} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Clinic Live Tracking</h3>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100 flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" /> Real-time
                                </span>
                            </div>
                            <p className="text-[12px] text-gray-500 font-medium leading-none">Automated intelligence stream for HQ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="px-6 py-4 bg-white/60 border border-white/60 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all group/stat"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center group-hover/stat:scale-110 transition-transform`}>
                                        <stat.icon className="w-4 h-4" strokeWidth={2} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-gray-900 tracking-tight">{stat.value}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{stat.sub}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="hidden xl:flex items-center gap-3 px-6 py-4 bg-gray-900 rounded-2xl shadow-xl shadow-black/5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#87A96B]">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">AI Suggestion</p>
                            <p className="text-[11px] text-white font-medium pr-4">Increase Meta spend by 15%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
