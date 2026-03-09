import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, MousePointerClick, Calendar, MessageCircle } from 'lucide-react';

export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description?: string;
    type: 'touchpoint' | 'engagement' | 'conversion' | 'communication' | 'booking';
    isPositive: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
    conversion: <CheckCircle2 className="w-5 h-5 text-[#87A96B]" />,
    booking: <Calendar className="w-5 h-5 text-purple-400" />,
    engagement: <Eye className="w-5 h-5 text-sky-400" />,
    communication: <MessageCircle className="w-5 h-5 text-indigo-400" />,
    touchpoint: <MousePointerClick className="w-5 h-5 text-slate-400" />
};

export function PatientTimeline({ events }: { events: TimelineEvent[] }) {
    if (!events || events.length === 0) return null;

    return (
        <div className="p-6 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5">
            <h3 className="text-slate-900 text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                Patient Journey <span className="text-[10px] font-black uppercase tracking-widest text-[#87A96B] bg-[#87A96B]/10 px-2 py-0.5 rounded-md">LTV Track</span>
            </h3>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-black/10 before:to-transparent">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15, type: 'spring' }}
                        className="relative flex items-start gap-4"
                    >
                        {/* Timeline Node Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 shadow-[0_4px_10px_rgb(0,0,0,0.05)] shrink-0 z-10 mt-1">
                            {iconMap[event.type] || <CheckCircle2 className="w-5 h-5 text-slate-400" />}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 p-4 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-black/5 hover:border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-gray-900 text-sm">{event.title}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{event.date}</span>
                            </div>
                            {event.description && <p className="text-xs text-gray-500 leading-relaxed mt-1">{event.description}</p>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
