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
            <div className="bg-[#1A1C1E] rounded-3xl p-8 border border-white/5 animate-pulse min-h-[400px]">
                <div className="h-6 w-48 bg-white/5 rounded-full mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1A1C1E] rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#87A96B]/5 blur-[100px] rounded-full group-hover:bg-[#87A96B]/10 transition-colors duration-1000" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-[#87A96B]" strokeWidth={2.5} />
                        Staff ROI Leaderboard
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Live conversion Efficiency Feed</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#87A96B]/10 border border-[#87A96B]/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#87A96B] animate-pulse" />
                    <span className="text-[9px] font-black text-[#87A96B] uppercase tracking-widest">LIVE</span>
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
                                    ? 'bg-gradient-to-r from-[#87A96B]/10 to-transparent border-[#87A96B]/30 shadow-[0_0_20px_rgba(135,169,107,0.1)]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-[#141517] ${isTop ? 'border-[#87A96B]' : 'border-white/10'}`}>
                                                {staff.avatar_url ? (
                                                    <img src={staff.avatar_url} alt={staff.full_name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            {isTop && (
                                                <div className="absolute -top-2.5 -right-2.5 transform rotate-12">
                                                    <Crown className="w-5 h-5 text-[#E9F11E] drop-shadow-[0_0_8px_rgba(233,241,30,0.5)] fill-[#E9F11E]" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{staff.full_name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    {staff.total_assigned} Leads
                                                </span>
                                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                <span className="text-[9px] font-bold text-[#87A96B] uppercase tracking-widest flex items-center gap-1">
                                                    <ChevronUp className="w-3 h-3" />
                                                    <Counter value={staff.conversion_rate} />% CR
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg font-black text-white tracking-tight">
                                            <Counter value={staff.total_revenue} prefix="£" />
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 mt-1">
                                            <Clock className="w-2.5 h-2.5 text-gray-500" />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
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
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                        <TrendingUp className="w-8 h-8 text-white/5 mx-auto mb-3" strokeWidth={1} />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Awaiting conversion data...</p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#87A96B]/20" />
                    <div className="w-2 h-2 rounded-full bg-white/5" />
                    <div className="w-2 h-2 rounded-full bg-white/5" />
                </div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Updated 30s ago</span>
            </div>
        </div>
    );
};
