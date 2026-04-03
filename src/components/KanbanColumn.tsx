import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { ConsultationRequest } from '../lib/supabase';

interface KanbanColumnProps {
    id: string;
    title: string;
    leads: ConsultationRequest[];
    onLeadClick: (lead: ConsultationRequest) => void;
}

export function KanbanColumn({ id, title, leads, onLeadClick }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex-shrink-0 w-80 flex flex-col h-full transition-all duration-300">
            <div className="flex items-center justify-between mb-5 px-2">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    {title} 
                    <div className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200/60 text-[9px]">
                        {leads.length}
                    </div>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="flex-grow bg-slate-50/30 backdrop-blur-sm rounded-[32px] p-2 min-h-[500px] space-y-3 transition-colors border border-transparent hover:border-slate-200/30"
            >
                <SortableContext items={(leads ?? []).map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {(leads ?? []).map((lead) => (
                        <KanbanCard
                            key={lead.id}
                            lead={lead}
                            onClick={() => onLeadClick(lead)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
