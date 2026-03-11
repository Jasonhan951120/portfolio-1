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
            <div className="bg-white/95 border border-black/5 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
                <p className="text-gray-900 font-bold mb-2 text-sm uppercase tracking-widest">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm font-medium mb-1">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">{entry.name}:</span>
                        <span className="text-gray-900 font-black tabular-nums">
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
        <div className={`bg-white border border-black/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight uppercase flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#87A96B]" strokeWidth={2.5} />
                        Reputation vs. Revenue
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">
                        Correlation between Google Business rating and monthly closed revenue
                    </p>
                </div>
            </div>


            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={mockData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            className="uppercase tracking-widest"
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `£${(value / 1000)}k`}
                            className="tabular-nums"
                            dx={-10}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `${value.toFixed(1)} ★`}
                            className="tabular-nums"
                            dx={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
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
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#ffffff', stroke: '#cbd5e1', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#cbd5e1', stroke: '#ffffff' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
