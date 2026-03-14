import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, ArrowRight, Video, FileText } from 'lucide-react';
import { VirtualConsultModal } from './dashboard/backoffice/VirtualConsultModal';
import { AINotesPopover } from './dashboard/backoffice/AINotesPopover';
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
            onClick={onClick}
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
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#87A96B]/30 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-[#87A96B] transition-colors" data-hj-suppress>{lead.name}</h4>
                <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-400'}`}>
                        {lead.status}
                    </div>
                    {lead.intent_score && (
                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${lead.intent_score > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                lead.intent_score > 40 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-gray-50 text-gray-400 border-gray-100'
                            }`}>
                            AI Intel: {lead.intent_score}%
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-tighter line-clamp-1">{lead.service}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    </div>
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

            <AINotesPopover 
                isOpen={isPopoverOpen} 
                onClose={() => setIsPopoverOpen(false)} 
                anchorRect={anchorRect}
                insight={lead.potential_value >= 1500 ? "임플란트 2개 필요, 예산 고민 중" : "일반 검진 및 스케일링 권장"}
                treatmentPlan={lead.potential_value >= 1500 ? ["Full Arch Scan", "Implant Consultation", "Quote Preparation"] : ["Standard Scaling", "X-Ray Analysis"]}
            />

            {/* Hover visual cue */}
            <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-[#87A96B]" />
            </div>
        </motion.div>
    );
}
