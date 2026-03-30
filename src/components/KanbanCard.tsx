import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, ArrowRight, Video, FileText, UserPlus, CalendarCheck, ShieldCheck, Mail, Hand } from 'lucide-react';
import { VirtualConsultModal } from './dashboard/backoffice/VirtualConsultModal';
import { AI_InsightCard } from './dashboard/backoffice/AI_InsightCard';
import { ConsultationRequest } from '../lib/supabase';
import { STATUS_COLORS, SERVICE_CONVERSION_VALUES } from '../lib/constants';
import { useDashboardStore } from '../store/useDashboardStore';

const getActionConfig = (status: string) => {
    switch (status) {
        case "New Lead":
            return { label: "Send Welcome", icon: Hand, color: "bg-[#10B981]" };
        case "Booked":
            return { label: "Confirm Appt", icon: CalendarCheck, color: "bg-[#6366F1]" };
        case "Visited":
        case "Proposal Sent":
            return { label: "Send PT (Plan)", icon: FileText, color: "bg-[#87A96B]" };
        case "Treated":
        case "Closed Won":
            return { label: "Send Care Instructions", icon: ShieldCheck, color: "bg-[#0F172A]" };
        default:
            return { label: "Contact Now", icon: MessageSquare, color: "bg-slate-800" };
    }
};

interface KanbanCardProps {
    lead: ConsultationRequest;
    onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
    const { clinicName } = useDashboardStore();

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
                <h4 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-emerald-600 transition-colors" data-hj-suppress>{lead.name}</h4>
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

            <p className="text-[11px] text-slate-500 font-bold mb-4 uppercase tracking-tighter line-clamp-1">{lead.service}</p>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100/50">
                <div className="flex flex-col gap-2">
                    {/* Primary Context Action: WhatsApp */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            const { label } = getActionConfig(lead.status);
                            console.log(`[ACTION] WhatsApp triggering: ${label}`);
                            
                            const phoneNum = lead.phone || "+447700900000";
                            let message = "";
                            const firstName = lead.name.split(' ')[0];
                            
                            switch (lead.status) {
                                case "New Lead":
                                    message = `Hi ${firstName}, we received your inquiry at ${clinicName || 'Hanlan OC'}. Would you like to schedule a quick consultation?`;
                                    break;
                                case "Booked":
                                    message = `Hi ${firstName}, confirming your appointment. We look forward to seeing you!`;
                                    break;
                                case "Visited":
                                    message = `Hi ${firstName}, here is your personalized Treatment Plan. Let us know if you have any questions!`;
                                    break;
                                case "Treated":
                                case "Closed Won":
                                    message = `Hi ${firstName}, hope you are doing well. Here are your post-op care instructions (주의사항).`;
                                    break;
                                default:
                                    message = `Hi ${firstName}, checking in from ${clinicName || 'Hanlan OC'}. How can we help you today?`;
                            }
                            
                            const whatsappUrl = `https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl ${getActionConfig(lead.status).color} text-white shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all duration-300 group/btn`}
                    >
                        <div className="flex items-center gap-2.5">
                            {React.createElement(getActionConfig(lead.status).icon, { className: "w-3.5 h-3.5", strokeWidth: 2.5 })}
                            <span className="text-[10px] font-black uppercase tracking-widest font-inter">
                                {getActionConfig(lead.status).label}
                            </span>
                        </div>
                        <MessageSquare className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    </button>

                    {/* Secondary Context Action: Email */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            const { label } = getActionConfig(lead.status);
                            console.log(`[ACTION] Email triggering: ${label}`);
                            // Forwarding to specific modal logic if exists, or logging context
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group/email"
                    >
                        <div className="flex items-center gap-2.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/email:text-slate-900 transition-colors" strokeWidth={2} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 font-inter">
                                {getActionConfig(lead.status).label} via Email
                            </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover/email:translate-x-1 transition-all" />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-900 px-2 tabular-nums">
                            £{value.toLocaleString()}
                        </span>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <div className="flex items-center gap-1.5 px-2 py-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                {new Date(lead.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
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
