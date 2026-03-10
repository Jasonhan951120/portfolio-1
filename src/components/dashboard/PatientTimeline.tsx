import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, MousePointerClick, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description?: string;
    type: 'touchpoint' | 'engagement' | 'conversion' | 'communication' | 'booking';
    isPositive: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
    conversion: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    booking: <Calendar className="w-5 h-5 text-purple-400" />,
    engagement: <Eye className="w-5 h-5 text-sky-400" />,
    communication: <MessageCircle className="w-5 h-5 text-slate-400" />,
    touchpoint: <MousePointerClick className="w-5 h-5 text-slate-400" />
};

export function PatientTimeline({ events }: { events: TimelineEvent[] }) {
    if (!events || events.length === 0) return null;

    return (
        <div className="p-8 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-white text-xl font-medium tracking-tight flex items-center gap-2">
                        Intelligence Timeline
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Journey tracking & conversion touchpoints</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    Live LTV
                </span>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-emerald-400/20 before:via-slate-800 before:to-transparent">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            delay: index * 0.1
                        }}
                        className="relative flex items-start gap-6 group"
                    >
                        {/* Apple Health Style Node */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 shadow-xl shrink-0 z-10 group-hover:border-emerald-400/50 transition-colors duration-500">
                            {iconMap[event.type] || <CheckCircle2 className="w-5 h-5 text-slate-400" />}
                        </div>

                        {/* Content Card (Bento Style) */}
                        <div className="flex-1 p-5 rounded-2xl bg-slate-800/20 border border-slate-700/50 group-hover:bg-slate-800/30 group-hover:border-slate-700 transition-all duration-500 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-slate-200 text-sm">{event.title}</span>
                                <span className="text-[10px] font-bold tabular-nums text-slate-500 tracking-wider">
                                    {event.date}
                                </span>
                            </div>
                            {event.description && (
                                <p className="text-xs text-slate-400 leading-relaxed font-light">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
