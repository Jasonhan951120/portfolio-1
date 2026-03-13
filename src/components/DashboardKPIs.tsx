import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, AlertCircle, PoundSterling, Sparkles } from 'lucide-react';

const CountUp = ({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count, to, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [count, to]);

    return (
        <React.Fragment>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </React.Fragment>
    );
};

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
    const kpis = [
        {
            title: "Today's Pipeline",
            value: pipelineValue,
            prefix: "£",
            icon: PoundSterling,
            color: "from-emerald-400 to-emerald-600",
            glow: "shadow-luxury",
            progress: "75%"
        },
        {
            title: "Marketing ROAS",
            value: marketingROAS,
            suffix: "x",
            icon: TrendingUp,
            color: "from-blue-400 to-indigo-600",
            glow: "shadow-luxury",
            progress: "60%"
        },
        {
            title: "Revenue at Risk",
            value: revenueAtRisk,
            prefix: "£",
            icon: AlertCircle,
            color: "from-rose-400 to-rose-600",
            glow: "shadow-luxury",
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
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`relative bg-white rounded-3xl p-6 border-[0.5px] border-slate-200/60 shadow-luxury transition-all duration-300 hover:shadow-luxury-hover active:scale-[0.98] ${kpi.glow}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="metric-label-muted">{kpi.title}</span>
                        <div className={`p-2 rounded-xl bg-slate-50 border border-slate-100 ${kpi.alert ? 'text-rose-500' : 'text-emerald-500'}`}>
                            <kpi.icon strokeWidth={2.5} className="w-4 h-4" />
                        </div>
                    </div>

                    <div className={`text-4xl metric-authority ${kpi.alert ? 'text-rose-600' : 'text-slate-900'}`}>
                        <CountUp to={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                    </div>

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
