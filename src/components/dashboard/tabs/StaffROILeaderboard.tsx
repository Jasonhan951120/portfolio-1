import React, { useEffect, useState, useMemo } from 'react';
import { supabase, type StaffPerformance } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    TrendingUp,
    Clock,
    Target,
    Crown,
    ChevronUp,
    User
} from 'lucide-react';

interface StaffROILeaderboardProps {
    clinicId: string;
}

const Counter = ({ value, prefix = "" }: { value: number | null | undefined; prefix?: string }) => {
    if (value === null || value === undefined) return <span className="font-bold tabular-nums text-gray-500">{prefix}0</span>;
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
            className="font-bold tabular-nums"
        >
            {prefix}{Number(value).toLocaleString(undefined, { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}
        </motion.span>
    );
};

export const StaffROILeaderboard: React.FC<StaffROILeaderboardProps> = ({ clinicId }) => {
    const [performance, setPerformance] = useState<StaffPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPerformance = async () => {
        try {
            const { data, error } = await supabase
                .from('staff_performance')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('total_revenue', { ascending: false });

            if (error) throw error;
            setPerformance(data || []);
        } catch (err) {
            console.error('Error fetching staff performance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();

        // Subscribe to underlying table changes for real-time updates
        const channel = supabase
            .channel('staff_roi_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'consultation_requests', filter: `clinic_id=eq.${clinicId}` },
                () => {
                    console.log('ROI Update: Lead status changed, refreshing leaderboard...');
                    fetchPerformance();
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `clinic_id=eq.${clinicId}` },
                () => {
                    console.log('ROI Update: New message sent, refreshing response metrics...');
                    fetchPerformance();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [clinicId]);

    if (loading && performance.length === 0) {
        return (
            <div className="bg-white rounded-[44px] p-8 border border-slate-200 animate-pulse min-h-[400px]">
                <div className="h-6 w-48 bg-slate-50 rounded-full mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-50 rounded-2xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-8 border-[0.5px] border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02),_0_12px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-1000" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                        <Trophy className="w-5 h-5 text-emerald-500" strokeWidth={3} />
                        ROI Leaderboard
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Live conversion Efficiency Feed</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">LIVE</span>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <AnimatePresence mode="popLayout">
                    {performance.map((staff, index) => {
                        const isTop = index === 0;
                        return (
                            <motion.div
                                key={staff.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`p-5 rounded-2xl border transition-all duration-500 ${isTop
                                    ? 'bg-emerald-50/50 border-emerald-200 shadow-[0_10px_20px_rgba(16,185,129,0.05)]'
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-white ${isTop ? 'border-emerald-500' : 'border-slate-100'}`}>
                                                {staff.avatar_url ? (
                                                    <img src={staff.avatar_url} alt={staff.full_name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            {isTop && (
                                                <div className="absolute -top-2.5 -right-2.5 transform rotate-12">
                                                    <Crown className="w-5 h-5 text-emerald-500 fill-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black tracking-tight text-slate-900 leading-none">{staff.full_name}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {staff.total_assigned} Leads
                                                </span>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                                    <ChevronUp className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                                    <Counter value={staff.conversion_rate} />% CR
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-900 tracking-tighter tabular-nums leading-none mb-1">
                                            <Counter value={staff.total_revenue} prefix="£" />
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Clock className="w-2.5 h-2.5 text-slate-300" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Counter value={staff.avg_response_mins} />m AVG RESP
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {performance.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[32px]">
                        <TrendingUp className="w-8 h-8 text-slate-100 mx-auto mb-3" strokeWidth={1} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting conversion data...</p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-100" />
                    <div className="w-2 h-2 rounded-full bg-slate-100" />
                    <div className="w-2 h-2 rounded-full bg-slate-100" />
                </div>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Updated 30s ago</span>
            </div>
        </div>
    );
};
