import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Star, TrendingUp, MessageSquare, Clock, Zap, Target } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const ReviewCorrelationWidget: React.FC = () => {
    const { isGoogleConnected, googleProfile, currency } = useDashboardStore();

    // Mock Correlation Data
    const correlationData = useMemo(() => [
        { day: 'Mon', reviews: 2, revenue: 12000, rating: 4.8 },
        { day: 'Tue', reviews: 1, revenue: 8500, rating: 4.8 },
        { day: 'Wed', reviews: 5, revenue: 28000, rating: 4.9 }, // 5-star spike
        { day: 'Thu', reviews: 2, revenue: 15000, rating: 4.9 },
        { day: 'Fri', reviews: 4, revenue: 32000, rating: 5.0 }, // Rating increase spike
        { day: 'Sat', reviews: 1, revenue: 9000, rating: 5.0 },
        { day: 'Sun', reviews: 3, revenue: 18000, rating: 5.0 },
    ], []);

    if (!isGoogleConnected) {
        return (
            <div className="h-full rounded-[44px] bg-slate-50/50 border border-slate-200 border-dashed flex flex-col items-center justify-center p-12 text-center group transition-all hover:bg-white hover:border-emerald-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Star className="w-8 h-8 text-slate-300 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Reputation ROI Engine</h3>
                <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
                    Connect your Google Profile to visualize how reputation directly fuels your high-value pipeline.
                </p>
            </div>
        );
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full rounded-[44px] bg-white/90 backdrop-blur-xl border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 flex flex-col"
        >
            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        Reputation Correlation
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">AI Verified</span>
                    </h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Revenue Flow vs Review Velocity</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                        <span className="text-2xl font-black text-slate-900">{googleProfile?.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Rating ({googleProfile?.reviewCount} Reviews)</span>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] mb-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={correlationData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '20px', 
                                border: '1px solid rgba(0,0,0,0.05)', 
                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                padding: '16px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, marginBottom: '8px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            name="Pipeline Rev"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="reviews" 
                            stroke="#F59E0B" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }}
                            name="5-Star Reviews"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Freshness Index</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">4 New</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">+100% Volume</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Response KPIs</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">100%</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Speed: 42m</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Target className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Impact Multiplier</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">1.42x</div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Trust Effect</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
