import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastData {
    date: string;
    actual: number | null;
    predicted: number;
}

interface RevenueForecastChartProps {
    data: ForecastData[];
}

export function RevenueForecastChart({ data }: RevenueForecastChartProps) {
    return (
        <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-800">
            <h3 className="text-white text-lg font-medium mb-1">Projected Revenue</h3>
            <p className="text-slate-400 text-sm mb-6">Based on current pipeline transition probabilities</p>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Sage Green Gradient for Predicted Revenue */}
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#87A96B" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#87A96B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `£${val / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                        />
                        {/* Actual Confirmed Revenue (Solid) */}
                        <Area type="monotone" dataKey="actual" stroke="#2c3e50" strokeWidth={3} fillOpacity={1} fill="#2c3e50" connectNulls />
                        {/* AI Predicted Revenue (Gradient) */}
                        <Area type="monotone" dataKey="predicted" stroke="#87A96B" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
