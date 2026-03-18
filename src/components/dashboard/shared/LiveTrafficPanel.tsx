import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrafficStats } from '../../../lib/useTrafficStats';
import { Wifi, Loader2 } from 'lucide-react';

// Clinical Luxury palette: Sage Green + Soft Gold + supporting tones
const SOURCE_COLORS: Record<string, string> = {
    "Google": "#4285F4", // Google Blue
    "Social": "#87A96B", // Soft Gold
    "Google (Organic)": "#87A96B", // Sage Green
    "Direct": "#B0B8C4", // Cool Grey
};

function getColor(source: string): string {
    return SOURCE_COLORS[source] ?? "#D1D5DB";
}

/** Framer Motion animated counter */
function AnimatedCount({ value }: { value: number }) {
    return (
        <AnimatePresence mode="popLayout">
            <motion.span
                key={value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="tabular-nums"
            >
                {value.toLocaleString()}
            </motion.span>
        </AnimatePresence>
    );
}

interface LiveTrafficPanelProps {
    clinicId: string | undefined;
}

export function LiveTrafficPanel({ clinicId }: LiveTrafficPanelProps) {
    const { stats, isLoading } = useTrafficStats(clinicId);
    const totalVisits = stats.reduce((s, d) => s + d.count, 0);

    const chartData = stats?.map(s => ({
        name: s.source,
        value: s.count,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-black/[0.04] rounded-[32px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_8px_24px_-4px_rgba(0,0,0,0.04)]"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#87A96B] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#87A96B] uppercase tracking-widest">Live</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight">Traffic by Source</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Updates in real-time via Supabase Realtime</p>
                </div>
                {isLoading && <Loader2 className="w-4 h-4 text-gray-300 animate-spin mt-1" />}
                {!isLoading && (
                    <Wifi className="w-4 h-4 text-[#87A96B] mt-1" strokeWidth={1.5} />
                )}
            </div>

            {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 text-gray-200 animate-spin" />
                        <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Connecting…</span>
                    </div>
                </div>
            ) : totalVisits === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-3">📡</div>
                    <p className="text-sm font-medium text-gray-500">No visits tracked yet</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-[180px]">
                        Send traffic to <code className="bg-gray-100 px-1 rounded text-[#87A96B]">/visit/[clinicId]</code> to start tracking
                    </p>
                </div>
            ) : (
                <>
                    {/* Doughnut Chart */}
                    <div className="h-[200px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                >
                                    {chartData?.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={getColor(entry.name)} stroke="white" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Source Breakdown */}
                    <div className="space-y-3">
                        {stats?.map((stat, i) => {
                            const pct = totalVisits > 0 ? Math.round((stat.count / totalVisits) * 100) : 0;
                            return (
                                <motion.div
                                    key={stat.source}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ background: getColor(stat.source) }}
                                        />
                                        <span className="text-xs font-medium text-gray-600">{stat.source}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Mini progress bar */}
                                        <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: getColor(stat.source) }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 w-6 text-right">
                                            <AnimatedCount value={stat.count} />
                                        </span>
                                        <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Total Footer */}
                    <div className="mt-6 pt-5 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Tracked Visits</span>
                        <span className="text-lg font-bold text-gray-900 tabular-nums">
                            <AnimatedCount value={totalVisits} />
                        </span>
                    </div>
                </>
            )}
        </motion.div>
    );
}
