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
            <div className="bg-[#1C1C1E] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                <p className="text-white font-bold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm font-medium mb-1">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-400 capitalize">{entry.name}:</span>
                        <span className="text-white font-black">
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
        <div className={`bg-[#1C1C1E] border border-white/5 rounded-[32px] p-8 ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
                        Reputation vs. Revenue
                    </h3>
                    <p className="text-[12px] text-gray-400 mt-1 font-medium">
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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(value) => `£${(value / 1000)}k`}
                            dx={-10}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(value) => `${value.toFixed(1)} ★`}
                            dx={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            name="revenue"
                            fill="#00FFA3"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            opacity={0.8}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="rating"
                            name="rating"
                            stroke="#C5A059"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#1C1C1E", stroke: "#C5A059", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "#C5A059", stroke: "#1C1C1E" }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
