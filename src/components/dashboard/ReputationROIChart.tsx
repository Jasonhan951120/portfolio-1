import React from "react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface ReputationROIChartProps {
    className?: string;
}

const mockData = [
    { month: "Oct", revenue: 15000, rating: 4.2 },
    { month: "Nov", revenue: 22000, rating: 4.5 },
    { month: "Dec", revenue: 28000, rating: 4.6 },
    { month: "Jan", revenue: 35000, rating: 4.8 },
    { month: "Feb", revenue: 42000, rating: 4.9 },
    { month: "Mar", revenue: 50000, rating: 4.9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-lg">
                <p className="text-slate-900 font-black mb-2 text-xs uppercase tracking-widest">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-slate-400 capitalize">{entry.name}:</span>
                        <span className="text-slate-900 tabular-nums">
                            {entry.name === "revenue"
                                ? `£${entry.value.toLocaleString()}`
                                : `${entry.value} ★`}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function ReputationROIChart({ className = "" }: ReputationROIChartProps) {
    return (
        <div className={`bg-white border border-slate-200 rounded-[44px] p-8 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                        <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                        Reputation Correlation
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                        Correlation between Google Business rating and monthly revenue
                    </p>
                </div>
            </div>


            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={mockData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                            dy={10}
                            className="uppercase tracking-widest"
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                            tickFormatter={(value) => `£${(value / 1000)}k`}
                            dx={-10}
                            className="tabular-nums"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                            tickFormatter={(value) => `${value.toFixed(1)} ★`}
                            dx={10}
                            className="tabular-nums"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            name="revenue"
                            fill="#10B981"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                            opacity={0.85}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="rating"
                            name="rating"
                            stroke="#cbd5e1"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#ffffff', stroke: '#cbd5e1', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#ffffff', stroke: '#cbd5e1' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
