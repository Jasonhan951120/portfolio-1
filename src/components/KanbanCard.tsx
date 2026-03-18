import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, ArrowRight, Video, FileText } from 'lucide-react';
import { VirtualConsultModal } from './dashboard/backoffice/VirtualConsultModal';
import { AI_InsightCard } from './dashboard/backoffice/AI_InsightCard';
import { ConsultationRequest } from '../lib/supabase';
import { STATUS_COLORS, SERVICE_CONVERSION_VALUES } from '../lib/constants';

interface KanbanCardProps {
    lead: ConsultationRequest;
    onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
    };

    const value = SERVICE_CONVERSION_VALUES[lead.service] || 1000;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.()}
            layout
            whileDrag={{
                scale: 1.05,
                rotate: 2,
                cursor: 'grabbing',
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            animate={isDragging ? { opacity: 0.5 } : { opacity: 1 }}
            className={`group h-full glass-premium p-5 overflow-hidden group transition-all duration-300 cursor-grab active:cursor-grabbing relative
                ${isDragging ? 'ring-2 ring-emerald-500/50' : ''}
                ${lead.intent_score > 90 ? 'glow-high-intent ring-1 ring-emerald-400/30' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-[#87A96B] transition-colors" data-hj-suppress>{lead.name}</h4>
                <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-400'}`}>
                        {lead.status}
                    </div>
                    {lead.intent_score && (
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${lead.intent_score > 70 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' :
                                lead.intent_score > 40 ? 'bg-blue-500/10 text-blue-600 border-blue-200/50' :
                                    'bg-slate-500/10 text-slate-400 border-slate-200/50'
                            }`}>
                            AI: {lead.intent_score}%
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-tighter line-clamp-1">{lead.service}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            const phoneNum = lead.phone || "+447700900000"; // Fallback
                            let message = "";
                            const firstName = lead.name.split(' ')[0];
                            switch (lead.status) {
                                case "New Lead":
                                    message = `Hi ${firstName}, we received your inquiry. Would you like to schedule a quick consultation with Dr. Hanlan?`;
                                    break;
                                case "Visited":
                                    message = `Hi ${firstName}, it was great seeing you! Do you have any further questions regarding your treatment plan?`;
                                    break;
                                case "Treated":
                                case "Closed Won":
                                    message = `Hi ${firstName}, hope you are recovering well! If you loved your experience, we'd appreciate a quick Google review: https://g.page/r/hanlan-oc/review`;
                                    break;
                                default:
                                    message = `Hi ${firstName}, checking in from Hanlan OC. How can we help you today?`;
                            }
                            const whatsappUrl = `https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        <MessageSquare className="w-3 h-3" strokeWidth={3} />
                        WhatsApp
                    </button>
                    <span className="text-[9px] font-black text-gray-900 tabular-nums tracking-tighter uppercase">
                        £{value.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-xl border border-slate-100/50">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-cyan-50 border border-slate-200/60 hover:border-cyan-200 flex items-center justify-center transition-all group/laptop active:scale-90"
                        >
                            <Video className="w-3.5 h-3.5 text-slate-400 group-hover/laptop:text-cyan-500 transition-colors" />
                        </button>
                        <button 
                            onMouseEnter={(e) => {
                                setAnchorRect(e.currentTarget.getBoundingClientRect());
                                setIsPopoverOpen(true);
                            }}
                            onMouseLeave={() => setIsPopoverOpen(false)}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-[#87A96B]/10 border border-slate-200/60 hover:border-[#87A96B]/30 flex items-center justify-center transition-all group/doc active:scale-90"
                        >
                            <FileText className="w-3.5 h-3.5 text-slate-400 group-hover/doc:text-[#87A96B] transition-colors" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <VirtualConsultModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                leadName={lead.name}
                hasAppointment={lead.potential_value >= 2000} // Deterministic mock
                appointmentTime="14:30"
            />

            <AI_InsightCard 
                isOpen={isPopoverOpen} 
                onClose={() => setIsPopoverOpen(false)} 
                anchorRect={anchorRect}
                insight={lead.potential_value >= 1500 ? "Advanced clinical potential identified via procedural interest patterns." : "Standard diagnostic evaluation recommended."}
                treatmentPlan={lead.potential_value >= 1500 ? ["Comprehensive Digital Scan", "Specialist Consultation", "Premium Quote Matrix"] : ["Baseline Diagnostic Imaging", "Clinical Assessment"]}
                potentialValue={value}
            />


            {/* Hover visual cue */}
            <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-[#87A96B]" />
            </div>
        </motion.div>
    );
}
