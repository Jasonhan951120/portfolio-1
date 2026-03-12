import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, PoundSterling } from 'lucide-react';

interface DashboardKPIsProps {
    pipelineValue: number;
    marketingROAS: number;
    revenueAtRisk: number;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({
    pipelineValue,
    marketingROAS,
    revenueAtRisk
}) => {
    // KPI 카드 데이터 (상태별 Glow 컬러 지정)
    const kpis = [
        {
            title: "Today's Pipeline",
            value: `£${pipelineValue.toLocaleString()}`,
            icon: PoundSterling,
            color: "from-blue-500 to-cyan-400",
            glow: "shadow-[0_0_20px_rgba(0,210,255,0.15)]",
            progress: "75%" // Placeholder percentage or calculate based on goal
        },
        {
            title: "Marketing ROAS",
            value: `${marketingROAS.toFixed(1)}x`,
            icon: TrendingUp,
            color: "from-emerald-400 to-sage-500",
            glow: "shadow-[0_0_20px_rgba(42,245,152,0.15)]",
            progress: "60%"
        },
        {
            title: "Revenue at Risk",
            value: `£${revenueAtRisk.toLocaleString()}`,
            icon: AlertCircle,
            color: "from-rose-500 to-red-400",
            glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]",
            alert: true,
            progress: "15%"
        }
    ];

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
        >
            {kpis.map((kpi, index) => (
                <motion.div
                    key={kpi.title}
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    className={`relative bg-white rounded-3xl p-6 border border-slate-200 shadow-sm ${kpi.glow}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{kpi.title}</span>
                        <kpi.icon strokeWidth={2.5} className={`w-5 h-5 ${kpi.alert ? 'text-rose-500' : 'text-slate-300'}`} />
                    </div>

                    {/* [CEO 인사이트] tabular-nums로 숫자가 바뀔 때 흔들림 방지 */}
                    <div className={`text-4xl font-black tabular-nums tracking-tighter ${kpi.alert ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                        {kpi.value}
                    </div>

                    {/* [CEO 인사이트] 얇고 세련된 그라데이션 진행률 바 */}
                    <div className="mt-5 w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: kpi.progress }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full bg-gradient-to-r ${kpi.color}`}
                        />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};
