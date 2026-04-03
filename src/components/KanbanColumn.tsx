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
        <div className="flex-shrink-0 w-84 flex flex-col h-full transition-all duration-300">
            <div className="flex items-center justify-between px-3 pb-4 mb-4 border-b border-slate-100/80">
                <div className="flex items-center gap-3">
                    <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.15em] leading-none">
                        {title}
                    </h3>
                    <div className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-200/50 text-[10px] font-bold tabular-nums">
                        {leads.length}
                    </div>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex-grow bg-slate-50/20 backdrop-blur-sm rounded-[32px] p-2 min-h-[500px] space-y-4 transition-colors border border-transparent"
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
