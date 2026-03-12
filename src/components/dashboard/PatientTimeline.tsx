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
    conversion: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    booking: <Calendar className="w-5 h-5 text-purple-500" />,
    engagement: <Eye className="w-5 h-5 text-sky-500" />,
    communication: <MessageCircle className="w-5 h-5 text-slate-400" />,
    touchpoint: <MousePointerClick className="w-5 h-5 text-slate-400" />
};

export function PatientTimeline({ events }: { events: TimelineEvent[] }) {
    if (!events || events.length === 0) return null;

    return (
        <div className="p-8 bg-white rounded-[44px] shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-slate-900 text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                        Journey Timeline
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Journey tracking & conversion touchpoints</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Live LTV
                </span>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-emerald-500/20 before:via-slate-100 before:to-transparent">
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
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm shrink-0 z-10 group-hover:border-emerald-400 transition-colors duration-500">
                            {iconMap[event.type] || <CheckCircle2 className="w-5 h-5 text-slate-300" />}
                        </div>

                        {/* Content Card (Bento Style) */}
                        <div className="flex-1 p-5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-emerald-200 transition-all duration-500 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{event.title}</span>
                                <span className="text-[10px] font-black tabular-nums text-slate-400 tracking-wider">
                                    {event.date}
                                </span>
                            </div>
                            {event.description && (
                                <p className="text-xs text-slate-500 leading-relaxed font-bold">
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
