import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { ConsultationRequest } from '../lib/supabase';
import { STATUS_COLORS, SERVICE_CONVERSION_VALUES } from '../lib/constants';

interface KanbanCardProps {
    lead: ConsultationRequest;
    onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    const value = SERVICE_CONVERSION_VALUES[lead.service] || 1000;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#87A96B]/30 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-[#87A96B] transition-colors">{lead.name}</h4>
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-400'}`}>
                    {lead.status}
                </div>
            </div>

            <p className="text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-tighter line-clamp-1">{lead.service}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        £{value.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Hover visual cue */}
            <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-[#87A96B]" />
            </div>
        </div>
    );
}
