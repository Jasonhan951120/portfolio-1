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
        <div className="p-8 bg-white border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-gray-900 text-xl font-bold tracking-tight uppercase">Revenue Forecast</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">AI-driven projection based on current pipeline</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Predicted</span>
                    </div>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#cbd5e1"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            className="font-bold uppercase tracking-widest"
                        />
                        <YAxis
                            stroke="#cbd5e1"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `£${val / 1000}k`}
                            className="font-bold tabular-nums"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(12px)',
                                borderColor: 'rgba(0,0,0,0.05)',
                                borderRadius: '1.5rem',
                                border: '1px solid rgba(0,0,0,0.05)',
                                padding: '1rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                            }}
                            itemStyle={{ color: '#111827', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#6b7280', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                        />
                        {/* Actual Confirmed Revenue */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#94a3b8"
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
