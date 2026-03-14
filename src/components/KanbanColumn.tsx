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
        <div className="flex-shrink-0 w-80 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {title} <span className="bg-black/5 px-2 py-0.5 rounded-full">{leads.length}</span>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="flex-grow bg-gray-50/50 rounded-[32px] p-3 border border-dashed border-gray-200 min-h-[500px] space-y-3"
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
