import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';

interface TrafficSourceChartProps {
    data: {
        date: string;
        metaClicks: number;
        googleClicks: number;
        websiteVisits: number;
    }[];
}

const TrafficSourceChart: React.FC<TrafficSourceChartProps> = ({ data }) => {
    // Calculate aggregate landing rate
    const totalClicks = data.reduce((sum, d) => sum + d.metaClicks + d.googleClicks, 0);
    const totalVisits = data.reduce((sum, d) => sum + d.websiteVisits, 0);
    const landingRate = totalClicks > 0 ? ((totalVisits / totalClicks) * 100).toFixed(1) : "0.0";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Total Traffic Source</h3>
                    <p className="text-sm text-gray-500">Cross-platform ad efficiency & landing performance</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#87A96B] block mb-1">Avg Landing Rate</span>
                    <span className="text-3xl font-display font-light text-gray-900">{landingRate}%</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1877F2" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#87A96B" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#87A96B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                fontSize: '12px'
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }} />
                        <Area
                            type="monotone"
                            name="Meta Clicks"
                            dataKey="metaClicks"
                            stroke="#1877F2"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorMeta)"
                        />
                        <Area
                            type="monotone"
                            name="Google Clicks"
                            dataKey="googleClicks"
                            stroke="#4285F4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorGoogle)"
                        />
                        <Area
                            type="monotone"
                            name="Website Visits"
                            dataKey="websiteVisits"
                            stroke="#87A96B"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                <div className="px-4 border-r border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Ad Clicks</span>
                    <span className="text-lg font-medium text-gray-900">{totalClicks.toLocaleString()}</span>
                </div>
                <div className="px-4 border-r border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#87A96B] block mb-1">Actual Visits</span>
                    <span className="text-lg font-medium text-gray-900">{totalVisits.toLocaleString()}</span>
                </div>
                <div className="px-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Drop-off</span>
                    <span className="text-lg font-medium text-red-400">{totalClicks > 0 ? (100 - (totalVisits / totalClicks * 100)).toFixed(0) : "0"}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default TrafficSourceChart;
