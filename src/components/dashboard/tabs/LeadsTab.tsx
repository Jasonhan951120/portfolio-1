import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users,
    Search,
    ChevronRight,
    MessageSquare,
    BarChart3,
    Target,
    Clock,
    Plus,
    ArrowRight,
    TrendingUp,
    Filter,
    ArrowRightCircle
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import { KanbanColumn } from '../../KanbanColumn';
import { ConsultationRequest } from '../../../lib/supabase';
import { DONUT_SEGMENTS, KANBAN_COLUMNS } from '../../../lib/constants';
import { DonutChart } from '../shared/DonutChart';

interface LeadsTabProps {
    leads: ConsultationRequest[];
    loadingLeads: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    activeLeads: ConsultationRequest[];
    todayAppointments: ConsultationRequest[];
    totalValue: number;
    sensors: any;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    activeId: string | null;
    getLeadsForColumn: (status: string) => ConsultationRequest[];
    setIsWaitlistOpen: (open: boolean) => void;
    onLeadClick: (lead: ConsultationRequest) => void;
    onAddLead: () => void;
}

export function LeadsTab({
    leads,
    loadingLeads,
    searchQuery,
    setSearchQuery,
    activeLeads,
    todayAppointments,
    totalValue,
    sensors,
    handleDragStart,
    handleDragEnd,
    activeId,
    getLeadsForColumn,
    setIsWaitlistOpen,
    onLeadClick,
    onAddLead
}: LeadsTabProps) {
    const activeLead = activeId ? (leads.find(l => l.id === activeId) || null) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Kanban Board - Left Column */}
                <div className="lg:col-span-9 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-900 mb-2 uppercase tracking-tight">Control Tower</h2>
                            <p className="text-sm text-gray-500">Live lead distribution and clinic pipeline management.</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Query client name or treatment..."
                                    className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-black/5 transition-all outline-none shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={onAddLead}
                                className="p-4 bg-gray-900 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar min-h-[600px]">
                        {KANBAN_COLUMNS.map((column) => (
                            <KanbanColumn
                                key={column}
                                id={column}
                                title={column}
                                leads={getLeadsForColumn(column)}
                                onLeadClick={onLeadClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Intelligence Sidebar - Right Column */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Revenue Potential Card */}
                    <div className="bg-white border border-[rgba(0,0,0,0.04)] rounded-[40px] p-10 shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_8px_24px_-4px_rgba(0,0,0,0.04)]">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Revenue Distribution</h3>
                        <DonutChart
                            segments={DONUT_SEGMENTS}
                            total={activeLeads.length}
                            totalValue={totalValue}
                        />
                    </div>

                    {/* Smart Waitlist CTA */}
                    <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="w-full card-light p-8 text-left group hover:bg-gray-900 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-blue-50 group-hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors">
                                <Clock className="w-6 h-6 text-blue-500 group-hover:text-blue-200" strokeWidth={1.5} />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 tracking-tight">Open Waitlist</h4>
                        <p className="text-[11px] text-gray-500 group-hover:text-gray-400 leading-relaxed font-medium capitalize">
                            {activeLeads.filter(l => (l.status as string) === "Waitlisted").length} Patients currently in standby for auto-fill.
                        </p>
                    </button>

                    {/* Quick Insights Activity */}
                    <div className="card-light p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-4 h-4 text-[#87A96B]" />
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Focus</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Clinic Appointments</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold text-gray-900">{todayAppointments.length}</span>
                                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mb-1">+12% vs avg</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Avg Contact Time</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold text-gray-900">4.2m</span>
                                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full mb-1">Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
                {activeLead ? (
                    <div className="w-[300px] pointer-events-none rotate-3">
                        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-2xl">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900">{activeLead.name}</h4>
                                <span className="text-[10px] font-black text-[#87A96B] uppercase tracking-tighter">
                                    £{(DONUT_SEGMENTS.find(s => activeLead.service.includes(s.label))?.count || 1000).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{activeLead.service}</p>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
