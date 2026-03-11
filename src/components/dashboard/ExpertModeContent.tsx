import React from 'react';
import { motion } from 'motion/react';
import { 
    Users, TrendingUp, RefreshCw, FileText, Globe, Star, UserCheck, Calendar, 
    X, Filter, List, BarChart2, Presentation, Play, 
    MessageSquare, Send, Sparkles, Layout, ShieldCheck, Zap, 
    Settings, Building, Save, Clock, Copy, AlertTriangle, Monitor,
    Instagram, MessageCircle, UserPlus, Trash2, Shield, Loader2, Plus, ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { StaffROILeaderboard } from './tabs/StaffROILeaderboard';
import { RevenueForecastChart } from './RevenueForecastChart';
import { ReputationROIChart } from './ReputationROIChart';
import { DashboardKPIs } from '../DashboardKPIs';
import { UpsellOpportunities } from './UpsellOpportunities';
import { ActivityLog } from '../ActivityLog';
import { TreatmentSettings } from '../TreatmentSettings';
import { TreatmentCard } from '../TreatmentCard';
import { CSVImportZone } from '../CSVImportZone';

interface ExpertModeContentProps {
    activeTab: string;
    profile: any;
    leads: any[];
    clinic: any;
    stats: any; // staffROI
    omniThreads: any[];
    selectedThreadId: string | null;
    setSelectedThreadId: (id: string | null) => void;
    replyText: string;
    setReplyText: (text: string) => void;
    handleSendMessage: () => void;
    teamMembers: any[];
    setTeamMembers: React.Dispatch<React.SetStateAction<any[]>>;
    invitations: any[];
    handleRevokeInvite: (id: string) => void;
    setIsInviteModalOpen: (open: boolean) => void;
    setEditingProfile: (profile: any) => void;
    treatments: any[];
    setTreatments: React.Dispatch<React.SetStateAction<any[]>>;
    setEditingTreatment: (treatment: any) => void;
    isSaving: boolean;
    setIsSaving: (saving: boolean) => void;
    loadDashboardData: () => void;
    updateStatus: (id: string, status: string) => void;
    analyticsMonth: number;
    setAnalyticsMonth: (month: number) => void;
    analyticsYear: number;
    setAnalyticsYear: (year: number) => void;
    dynamicRevenueData: any[];
    treatmentDistribution: any[];
    forecastData: any[];
    marketingROI: any[];
    adConnections: any[];
    setSelectedPlatform: (platform: 'meta' | 'google') => void;
    setIsAutoTagMenuOpen: (open: boolean) => void;
}

export function ExpertModeContent(props: ExpertModeContentProps) {
    const { 
        activeTab, profile, leads, clinic, stats, 
        omniThreads, selectedThreadId, setSelectedThreadId, replyText, setReplyText, handleSendMessage,
        teamMembers, setTeamMembers, invitations, handleRevokeInvite, setIsInviteModalOpen, setEditingProfile,
        treatments, setTreatments, setEditingTreatment, isSaving, setIsSaving, loadDashboardData,
        updateStatus, analyticsMonth, setAnalyticsMonth, analyticsYear, setAnalyticsYear,
        dynamicRevenueData, treatmentDistribution, forecastData, marketingROI, adConnections,
        setSelectedPlatform, setIsAutoTagMenuOpen
    } = props;
    
    const isAdmin = profile?.role === 'admin';
    const setClinic = (c: any) => { /* mock for now since it wasn't passed, ideally should be passed */ };

    return (
        <div className="space-y-12 pb-20 p-8">
            {activeTab === "analytics" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Revenue Analysis</h3>
                                <div className="flex gap-2">
                                    <select 
                                        value={analyticsYear}
                                        onChange={(e) => setAnalyticsYear(Number(e.target.value))}
                                        className="bg-black/5 border border-black/10 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-900 uppercase tracking-widest"
                                    >
                                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dynamicRevenueData}>
                                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `£${value/1000}k`} />
                                        <Tooltip />
                                        <Bar dataKey="Implants" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="Invisalign" stackId="a" fill="#c084fc" />
                                        <Bar dataKey="Veneers" stackId="a" fill="#87A96B" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 text-left">Treatment Distribution</h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={treatmentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {treatmentDistribution.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <RevenueForecastChart data={forecastData} />
                    <StaffROILeaderboard clinicId={profile?.clinic_id || ""} />
                </motion.div>
            )}

            {activeTab === "inbox" && (
                <div className="grid lg:grid-cols-12 gap-6 h-[720px]">
                    <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border border-black/10 rounded-[40px] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-black/10 bg-white/50">
                            <h3 className="text-xl font-bold text-gray-900">VIP Inquiries</h3>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Omnichannel Sync Active</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {omniThreads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => setSelectedThreadId(thread.id)}
                                    className={`w-full p-6 flex gap-4 text-left border-b border-black/5 transition-all ${selectedThreadId === thread.id ? 'bg-[#87A96B]/5' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center font-bold text-gray-900">{thread.avatar}</div>
                                    <div className="flex-1 truncate">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold text-gray-900 uppercase truncate mr-2">{thread.recipient}</span>
                                            <span className="text-[10px] text-gray-400">{thread.time}</span>
                                        </div>
                                        <p className="text-xs truncate text-gray-500">{thread.lastMsg}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-xl border border-black/10 rounded-[40px] overflow-hidden flex flex-col">
                        {selectedThreadId ? (
                            <div className="flex flex-col h-full">
                                <div className="p-8 border-b border-black/10 bg-white/50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-900">{omniThreads.find(t => t.id === selectedThreadId)?.recipient}</h4>
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {omniThreads.find(t => t.id === selectedThreadId)?.messages?.map((m: any) => (
                                        <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-5 rounded-3xl text-sm ${m.direction === 'outbound' ? 'bg-gray-900 text-white' : 'bg-white border border-black/5 text-gray-900'}`}>{m.content}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-8 border-t border-black/10 bg-white/30">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="w-full bg-white border border-black/10 rounded-2xl py-5 pl-6 pr-16 text-sm"
                                            placeholder="Write a message..."
                                        />
                                        <button onClick={handleSendMessage} className="absolute right-2 top-2 bottom-2 aspect-square bg-gray-900 text-white rounded-xl flex items-center justify-center"><Send className="w-5 h-5 ml-1" /></button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50"><MessageSquare className="w-10 h-10 text-gray-400 mb-8" /><p className="text-xl font-bold uppercase">Select a Conversation</p></div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === "staff" && (
                <div className="space-y-8">
                    <div className="bg-white border border-black/5 rounded-[40px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Staff Performance</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live conversion efficiency feed</p>
                            </div>
                            <div className="p-3 bg-black/5 rounded-2xl"><TrendingUp className="w-5 h-5 text-green-500" /></div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats}>
                                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `£${v/1000}k`} />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "team" && (
                <div className="space-y-8">
                    <div className="bg-white border border-black/10 rounded-[40px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Team Management</h2>
                            <p className="text-sm text-gray-500 mt-2">Manage clinic specialists and permissions.</p>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(true)} className="px-8 py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all flex items-center gap-3">
                            <UserPlus className="w-4 h-4" /> Invite Specialist
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-black/10 rounded-[32px] overflow-hidden">
                            <div className="p-8 border-b border-black/5"><h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Active Team</h3></div>
                            <div className="divide-y divide-black/5">
                                {teamMembers.map(member => (
                                    <div key={member.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-bold">{member.full_name?.charAt(0)}</div>
                                            <div><p className="font-bold text-gray-900">{member.full_name}</p><p className="text-[10px] text-gray-400">{member.email}</p></div>
                                        </div>
                                        <button onClick={() => setEditingProfile(member)} className="p-2 bg-black/5 rounded-lg text-gray-400 hover:text-gray-900"><Settings className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white border border-black/10 rounded-[32px] overflow-hidden">
                            <div className="p-8 border-b border-black/5"><h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Pending Invites</h3></div>
                            <div className="p-6 space-y-4">
                                {invitations.map(invite => (
                                    <div key={invite.id} className="p-4 bg-black/5 rounded-2xl flex justify-between items-center">
                                        <div><p className="text-xs font-bold text-gray-900">{invite.email}</p><span className="text-[9px] text-[#87A96B] font-bold">SENT</span></div>
                                        <button onClick={() => handleRevokeInvite(invite.id)} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === "treatments" && (
                <div className="space-y-8">
                    <div className="bg-white border border-black/10 rounded-[40px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
                        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-6">Treatments & Assets</h2>
                        <div className="space-y-4">
                            {treatments.map(t => (
                                <TreatmentCard key={t.id} treatment={t} onClick={() => setEditingTreatment(t)} />
                            ))}
                            <button onClick={() => {/* add logic if needed */}} className="w-full py-6 border-2 border-dashed border-black/5 rounded-3xl hover:border-black/10 transition-all text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" /> Add Treatment
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === "settings" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-12 space-y-6">
                        <div className="bg-white border border-black/10 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-[#87A96B]/10 rounded-2xl"><Building className="w-6 h-6 text-[#87A96B]" /></div>
                                <div><h2 className="text-xl font-bold text-gray-900">Clinic Profile</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Core SaaS Identity</p></div>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Practice Name</label>
                                    <input type="text" value={clinic?.name || ""} disabled className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 px-6 text-sm text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Clinic Slug (URL Key)</label>
                                    <input type="text" value={clinic?.slug || ""} readOnly className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 px-6 text-sm text-gray-400 cursor-not-allowed" />
                                </div>
                                <div className="flex justify-end pt-4">
                                     <button className="py-4 px-8 bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                                         Settings moved to Dedicated Settings Drawer <ArrowRight className="w-4 h-4"/>
                                     </button>
                                </div>
                            </div>
                        </div>
                        {isAdmin && profile?.clinic_id && (
                            <div className="mt-8"><ActivityLog clinicId={profile.clinic_id} /></div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
