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
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    {title} <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded-full border border-slate-200/60">{leads.length}</span>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="flex-grow bg-white/50 backdrop-blur-md rounded-[32px] p-3 border border-slate-200/60 shadow-sm min-h-[500px] space-y-3 transition-colors"
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
