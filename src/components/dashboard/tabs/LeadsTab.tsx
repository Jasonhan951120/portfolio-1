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

    // Revenue at Risk Calculation (Strict 48h stale rule)
    const atRiskLeads = activeLeads.filter(l => {
        if (l.status === 'Closed Won' || l.status === 'Abandoned' || l.status === 'Treated') return false;
        const updatedAt = l.updated_at || l.created_at;
        const diffHours = (Date.now() - new Date(updatedAt).getTime()) / 3600000;
        return diffHours > 48;
    });
    const atRiskValue = atRiskLeads.reduce((sum, l) => sum + (Number(l.potential_value) || 1000), 0);

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

                    {/* LEADS AT RISK PULSE UI */}
                    <AnimatePresence>
                        {atRiskLeads.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 bg-red-50/80 rounded-2xl border border-red-100/50 flex flex-col gap-4 relative overflow-hidden group hover:bg-red-50 transition-colors shadow-[0_2px_8px_rgba(239,68,68,0.02),_0_12px_32px_rgba(239,68,68,0.04)]"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <TrendingUp className="w-32 h-32 text-red-500 rotate-180" />
                                </div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-2xl bg-red-100/80 flex items-center justify-center flex-shrink-0 border border-red-200/50 relative">
                                        <div className="absolute inset-0 rounded-2xl border-2 border-red-400/30 animate-ping"></div>
                                        <Clock className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5 flex items-center gap-2">
                                            Revenue at Risk
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                        </h4>
                                        <div className="text-2xl font-black text-red-900 tabular-nums tracking-tighter leading-none">
                                            £{atRiskValue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-red-800/80 font-medium relative z-10 leading-relaxed border-t border-red-200/50 pt-3">
                                    <span className="font-bold text-red-700">{atRiskLeads.length} Patients</span> stagnant for &gt;48h. Action required to prevent revenue decay.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Revenue Potential Card */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.02),_0_12px_32px_rgba(0,0,0,0.04)]">
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

            <DragOverlay
                dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.4',
                            },
                        },
                    }),
                }}
            >
                {activeLead ? (
                    <motion.div
                        initial={{ scale: 1.05, rotate: 2 }}
                        animate={{ scale: 1.05, rotate: 2 }}
                        className="w-[300px] pointer-events-none"
                        style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.18))" }}
                    >
                        <div className="bg-white p-5 rounded-[24px] border border-black/8 shadow-2xl relative overflow-hidden">
                            {/* Shimmer accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#87A96B]/60 to-transparent" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-900 text-sm tracking-tight" data-hj-suppress>{activeLead.name}</h4>
                                <span className="text-[10px] font-black text-[#87A96B] tabular-nums bg-[#87A96B]/10 px-2 py-0.5 rounded-lg border border-[#87A96B]/20">
                                    £{(SERVICE_CONVERSION_VALUES[activeLead.service] || 1000).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">{activeLead.service}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#87A96B] animate-pulse" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Dragging...</span>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </DragOverlay>

        </DndContext>
    );
}
