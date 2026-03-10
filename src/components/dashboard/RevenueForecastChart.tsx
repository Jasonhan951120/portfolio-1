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
        <div className="p-8 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-white text-xl font-medium tracking-tight">Revenue Forecast</h3>
                    <p className="text-slate-400 text-xs mt-1">AI-driven projection based on current pipeline</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Predicted</span>
                    </div>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            className="font-medium uppercase tracking-widest"
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `£${val / 1000}k`}
                            className="font-medium tabular-nums"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                backdropFilter: 'blur(12px)',
                                borderColor: 'rgba(51, 65, 85, 0.5)',
                                borderRadius: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem'
                            }}
                            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                        />
                        {/* Actual Confirmed Revenue */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#475569"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            connectNulls
                        />
                        {/* AI Predicted Revenue */}
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            fillOpacity={1}
                            fill="url(#colorPredicted)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
