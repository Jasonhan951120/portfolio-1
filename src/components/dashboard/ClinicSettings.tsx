import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, Settings, List, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, User, ArrowRight, Calendar, Save, Info, RefreshCw, Star, ChevronRight, Sparkles, Palette } from 'lucide-react';
import Autocomplete from 'react-google-autocomplete';
import { useDashboardStore } from '../../store/useDashboardStore';
import { ReviewCard } from './ReviewCard';

interface TreatmentTemplate {
    id: string;
    name: string;
    price: number;
    emailContents?: string;
    beforeImg?: string;
    afterImg?: string;
    bookingUrl?: string;
    status?: string;
}

interface ClinicSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    currency?: string;
    templates: TreatmentTemplate[];
    setTemplates: React.Dispatch<React.SetStateAction<TreatmentTemplate[]>>;
}

export function ClinicSettings({ 
    isOpen, 
    onClose, 
    currency = '£',
    templates = [],
    setTemplates 
}: ClinicSettingsProps) {
    const { 
        clinicType, setClinicType, 
        clinicName, setClinicName, 
        clinicLogo, setClinicLogo, 
        clinicSignatureImage, setClinicSignatureImage,
        googlePlaceId, setGooglePlaceId
    } = useDashboardStore();
    const [activeTab, setActiveTab] = useState<'menu' | 'general' | 'reputation' | 'support'>('menu');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'synced'>(googlePlaceId ? 'synced' : 'idle');
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null);
    const [activeTheme, setActiveTheme] = useState<'white' | 'dark'>('white');
    const [communicationTone, setCommunicationTone] = useState<'Warm & Empathetic' | 'Refined & Professional'>('Refined & Professional');
    const [locale, setLocale] = useState('en-GB');
    const [editingTreatmentId, setEditingTreatmentId] = useState<string| null>(null);
    const [liveReviews, setLiveReviews] = useState<any[]>([]);

    const GOOGLE_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : '')) as string;

    // DEBUG: Force Recognition Check
    useEffect(() => {
        console.log("GOOGLE_API_KEY_LOAD_CHECK:", GOOGLE_API_KEY ? "DETECTED" : "MISSING");
        if (!GOOGLE_API_KEY) {
            console.warn("CRITICAL: Google Maps API key is not being recognized by the bundler. Check Vercel/Local environment variables.");
        }
    }, [GOOGLE_API_KEY]);


    // Persistence Logic
    useEffect(() => {
        const savedTheme = localStorage.getItem('clinic-theme');
        const savedTab = localStorage.getItem('clinic-active-tab');
        if (savedTheme === 'dark' || savedTheme === 'white') setActiveTheme(savedTheme as 'white' | 'dark');
        if (savedTab) setActiveTab(savedTab as any);
    }, []);

    useEffect(() => {
        localStorage.setItem('clinic-theme', activeTheme);
        localStorage.setItem('clinic-active-tab', activeTab);
    }, [activeTheme, activeTab]);



    const handleSaveTemplate = () => {
        if (!editingTemplate || !editingTemplate.name) return;
        // [FIX]: Update parent state directly
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        setEditingTreatmentId(null);
        setEditingTemplate(null);
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm("Are you sure you want to delete this treatment?")) {
            // [FIX]: Update parent state directly
            setTemplates(prev => prev.filter(t => t.id !== id));
            if (editingTreatmentId === id) setEditingTreatmentId(null);
        }
    };

    // Theme Engine: Luxury Wellness Edition
    const isDark = activeTheme === 'dark';
    const bgColor = isDark ? 'bg-[#0A0F1E]' : 'bg-white';
    const cardBg = isDark ? 'bg-[#151C2F]/60 backdrop-blur-xl' : 'bg-[#fdfcfb]';
    const textColor = isDark ? 'text-white' : 'text-[#0f172a]';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const accentColor = isDark ? 'text-[#2AF598]' : 'text-[#78dcca]';
    const accentBg = isDark ? 'bg-[#2AF598]' : 'bg-[#78dcca]';
    const borderColor = isDark ? 'border-white/10' : 'border-black/5';
    const sageGreen = '#87A96B';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#000000]/80 backdrop-blur-2xl p-4 transition-all duration-1000">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 40 }}
                        className={`w-full max-w-6xl h-full max-h-[85vh] ${bgColor} rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border ${borderColor} transition-all duration-700 font-inter tracking-tight`}
                    >
                        {/* Luxury Header */}
                        <div className={`flex-shrink-0 px-8 py-5 flex items-center justify-between border-b ${borderColor} relative overflow-hidden`}>
                            {isDark && <div className="absolute inset-0 bg-gradient-to-r from-[#2AF598]/5 via-transparent to-[#2AF598]/5" />}
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${borderColor} flex items-center justify-center shadow-inner group transition-transform duration-500 hover:rotate-90`}>
                                    <Settings className={`w-6 h-6 ${textColor}`} strokeWidth={1.2} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-black ${textColor} uppercase tracking-tight text-inter`}>Lounge Settings</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sageGreen }} />
                                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em]`} style={{ color: sageGreen }}>System Operational</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-50'} border ${borderColor} flex items-center justify-center transition-all hover:rotate-90 text-slate-400 hover:text-white shadow-xl group relative z-10`}>
                                <X className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Navigation Sidebar */}
                            <div className={`w-64 flex-shrink-0 border-r ${borderColor} p-6 flex flex-col gap-2 ${isDark ? 'bg-[#0A0F1E]/50' : 'bg-slate-50/50'} backdrop-blur-xl`}>
                                {[
                                    { id: 'menu', icon: List, label: 'Treatment Menu' },
                                    { id: 'general', icon: Globe, label: 'Bespoke Identities' },
                                    { id: 'reputation', icon: Star, label: 'Reputation' },
                                    { id: 'support', icon: ShieldCheck, label: 'Support & Help' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-500 group relative ${
                                            activeTab === tab.id 
                                                ? tab.id === 'support' 
                                                    ? 'bg-white text-[#0f172a] shadow-sm border border-gray-100 p-4' 
                                                    : `${isDark ? 'bg-white/10' : 'bg-white shadow-lg'} ${textColor} border ${borderColor}` 
                                                : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? (isDark ? 'text-[#2AF598]' : 'text-[#78dcca]') : 'text-slate-400'}`} strokeWidth={2.5} />
                                            <span className="font-bold text-xs uppercase tracking-widest">{tab.label}</span>
                                        </div>
                                        {activeTab === tab.id && tab.id !== 'support' && <motion.div layoutId="nav-glow" className={`absolute inset-0 rounded-xl ${isDark ? 'bg-[#2AF598]/5 shadow-[inset_0_0_20px_rgba(42,245,152,0.1)]' : 'bg-sky-500/5'} border ${isDark ? 'border-[#2AF598]/30' : 'border-sky-500/30'}`} />}
                                        <ArrowRight className={`w-3 h-3 transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                                    </button>
                                ))}
                            </div>

                            {/* Main Configuration Panel */}
                            <div className={`flex-1 overflow-y-auto p-8 custom-scrollbar relative transition-colors duration-500`}>
                                <div className={`${activeTab === 'reputation' ? 'max-w-none w-full !px-4' : 'max-w-4xl mx-auto'}`}>
                                    
                                    {activeTab === 'menu' && (
                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
                                            {/* Treatment Editor Inline [DYNAMIC STATE] */}
                                            <AnimatePresence>
                                                {editingTreatmentId && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className={`${cardBg} border-2 border-[#78dcca]/50 p-8 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden`}
                                                    >
                                                        <div className="flex items-center justify-between mb-8">
                                                            <div className="flex items-center gap-3">
                                                                 <div className={`w-10 h-10 rounded-full bg-[#78dcca]/10 flex items-center justify-center`}>
                                                                    <Settings className={`w-5 h-5 ${accentColor}`} strokeWidth={2} />
                                                                </div>
                                                                <h3 className={`text-xl font-black ${textColor} uppercase tracking-tight text-inter text-nowrap`}>Edit Clinical Protocol</h3>
                                                            </div>
                                                            <button onClick={() => setEditingTreatmentId(null)} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                                                        </div>
                                                        
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div>
                                                                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-2 tracking-widest text-inter">Protocol Name</label>
                                                                    <input 
                                                                        type="text" 
                                                                        value={editingTemplate?.name || ''} 
                                                                        onChange={e => setEditingTemplate({...editingTemplate!, name: e.target.value})}
                                                                        className={`w-full ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'} border rounded-2xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none focus:ring-2 focus:ring-[#78dcca]/20 transition-all font-inter`}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-2 tracking-widest text-inter">Global Fee ({currency})</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={editingTemplate?.price || 0} 
                                                                        onChange={e => setEditingTemplate({...editingTemplate!, price: Number(e.target.value)})}
                                                                        className={`w-full ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'} border rounded-2xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none focus:ring-2 focus:ring-[#78dcca]/20 transition-all font-inter`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button onClick={handleSaveTemplate} className={`mt-8 w-full py-4 ${isDark ? 'bg-[#78dcca] text-[#0f172a]' : 'bg-[#0f172a] text-white'} rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-all text-inter`}>
                                                            <Save className="w-4 h-4" /> Save Clinical Protocol
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className={`${cardBg} border ${borderColor} p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all duration-500`}>
                                                <div className="flex items-center justify-between mb-4 text-inter">
                                                    <div>
                                                        <h3 className={`text-xl font-black ${textColor} mb-1 uppercase tracking-tight`}>Practice Identity</h3>
                                                        <p className={`text-xs ${subTextColor} font-medium tracking-tight`}>Engineered precision for your specific field.</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500"><Briefcase className={`w-5 h-5 ${accentColor}`} strokeWidth={2} /></div>
                                                </div>
                                                <div className="relative max-w-sm">
                                                    <select 
                                                        value={clinicType}
                                                        onChange={(e) => setClinicType(e.target.value as any)}
                                                        className={`w-full bg-white/5 border ${borderColor} rounded-xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none transition-all appearance-none cursor-pointer backdrop-blur-md font-inter tracking-tight`}
                                                    >
                                                        <option value="Dental">Elite Dental Protocol</option>
                                                        <option value="Aesthetic">Bespoke Aesthetics</option>
                                                        <option value="Wellness">Holistic Transformation</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={`flex items-center p-6 ${cardBg} border ${borderColor} rounded-[2rem] hover:scale-[1.01] transition-all duration-500`}>
                                                <h3 className={`text-xl font-black ${textColor} uppercase tracking-tight text-inter`}>Signature Menu Builder</h3>
                                            </div>

                                            {/* [FIXED]: Mapping strictly from parent props 'templates' with CALIBRATED LUXURY UI */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {templates.map(template => (
                                                    <div key={template.id} className={`${cardBg} rounded-[2rem] border ${borderColor} p-10 shadow-luxury hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 group relative overflow-visible flex flex-col h-full bg-gradient-to-br from-white to-slate-50/50`}>
                                                        
                                                        {/* Top Branding & Subtle Actions */}
                                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                                            <div className="flex-1 pr-6">
                                                                <h4 className={`text-[#111827] font-serif font-bold text-2xl tracking-tight leading-tight capitalize truncate`}>
                                                                    {template.name.toLowerCase()}
                                                                </h4>
                                                                <div className={`mt-2 flex items-center gap-2`}>
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${template.price > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{template.price > 0 ? 'Verified Clinical' : 'Draft Protocol'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 relative z-30">
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); setEditingTreatmentId(template.id); setEditingTemplate(template); }} 
                                                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                                                >
                                                                    <Settings className="w-5 h-5" />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }} 
                                                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mb-10 pt-2 relative z-10">
                                                            <p className="text-[#111827] font-bold text-4xl tracking-tighter flex items-center gap-1">
                                                                <span className="text-sm font-medium text-slate-300 align-top mt-1">{currency}</span>
                                                                {template.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Calibrated Symmetry: Pre/Post Slot Logic */}
                                                        <div className="grid grid-cols-2 gap-6 mt-auto relative z-10">
                                                            {/* Pre Section */}
                                                            <div className="flex flex-col gap-3">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center w-full">PRE</span>
                                                                <div 
                                                                    onClick={() => document.getElementById(`upload-before-${template.id}`)?.click()}
                                                                    className={`aspect-square h-32 w-full rounded-2xl border-2 border-dashed border-slate-100 hover:border-emerald-200 bg-white flex items-center justify-center shadow-inner cursor-pointer transition-all overflow-hidden group/box`}
                                                                >
                                                                    {template.beforeImg ? (
                                                                        <img src={template.beforeImg} className="w-full h-full object-cover group-hover/box:scale-110 transition-transform duration-700" alt="" />
                                                                    ) : (
                                                                        <div className="flex flex-col items-center gap-2">
                                                                            <Camera className="w-6 h-6 text-slate-200 stroke-[1.2]" />
                                                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Upload</span>
                                                                        </div>
                                                                    )}
                                                                    <input 
                                                                        id={`upload-before-${template.id}`} 
                                                                        type="file" className="hidden" 
                                                                        accept="image/*"
                                                                        onMouseDown={(e) => e.stopPropagation()}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onload = (revet) => {
                                                                                    const updated = { ...template, beforeImg: revet.target?.result as string };
                                                                                    setTemplates(prev => prev.map(t => t.id === template.id ? updated : t));
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Post Section */}
                                                            <div className="flex flex-col gap-3">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center w-full">POST</span>
                                                                <div 
                                                                    onClick={() => document.getElementById(`upload-after-${template.id}`)?.click()}
                                                                    className={`aspect-square h-32 w-full rounded-2xl border-2 border-dashed border-slate-100 hover:border-emerald-200 bg-white flex items-center justify-center shadow-inner cursor-pointer transition-all overflow-hidden group/box`}
                                                                >
                                                                    {template.afterImg ? (
                                                                        <img src={template.afterImg} className="w-full h-full object-cover group-hover/box:scale-110 transition-transform duration-700" alt="" />
                                                                    ) : (
                                                                        <div className="flex flex-col items-center gap-2">
                                                                            <Camera className="w-6 h-6 text-slate-200 stroke-[1.2]" />
                                                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Upload</span>
                                                                        </div>
                                                                    )}
                                                                    <input 
                                                                        id={`upload-after-${template.id}`} 
                                                                        type="file" className="hidden" 
                                                                        accept="image/*"
                                                                        onMouseDown={(e) => e.stopPropagation()}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                const reader = new FileReader();
                                                                                reader.onload = (revet) => {
                                                                                    const updated = { ...template, afterImg: revet.target?.result as string };
                                                                                    setTemplates(prev => prev.map(t => t.id === template.id ? updated : t));
                                                                                };
                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Luxury Verification Footer */}
                                                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between opacity-60">
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol Secured</span>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-emerald-500/20 fill-emerald-500/20" />)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                                            <div className={`${cardBg} border ${borderColor} p-8 rounded-[2.5rem] relative overflow-hidden group`}>
                                                <div className="flex items-center gap-6 mb-8 text-inter">
                                                    <div className={`w-16 h-16 rounded-[1.5rem] bg-[#78dcca]/5 border ${borderColor} flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700`}>
                                                        <Zap className={`w-8 h-8 ${accentColor}`} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-2xl font-black ${textColor} uppercase tracking-tighter text-inter`}>Bespoke Branding Identity</h3>
                                                        <p className={`text-sm ${subTextColor} font-medium tracking-tight text-inter`}>Synchronise your global presence and visual personality.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                                    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] transition-all hover:scale-[1.02] shadow-inner`}>
                                                        <label className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} mb-3 block text-inter`}>Practice / Clinic Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={clinicName} 
                                                            onChange={e => setClinicName(e.target.value)}
                                                            placeholder="e.g. The Harley Elite"
                                                            className={`w-full bg-transparent border-b ${borderColor} pb-2 text-sm font-bold ${textColor} focus:outline-none focus:border-[#78dcca] transition-colors font-inter`}
                                                        />
                                                    </div>
                                                    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] transition-all hover:scale-[1.02] shadow-inner col-span-1 lg:col-span-2`}>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-center justify-between">
                                                                <label className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} block text-inter`}>Signature Clinic Photo (Follow-up Background)</label>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-[#78dcca] animate-pulse" />
                                                                    <span className="text-[10px] font-bold text-[#78dcca] uppercase tracking-widest">Premium Visual</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div 
                                                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#78dcca"; }}
                                                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = ""; }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    const file = e.dataTransfer.files[0];
                                                                    if (file && file.type.startsWith('image/')) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (event) => setClinicSignatureImage(event.target?.result as string);
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                                className={`w-full h-40 border-2 border-dashed ${borderColor} rounded-3xl flex flex-col items-center justify-center gap-3 group transition-all hover:border-[#78dcca]/50 relative overflow-hidden`}
                                                            >
                                                                {clinicSignatureImage ? (
                                                                    <>
                                                                        <img src={clinicSignatureImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                                                                        <div className="relative z-10 flex flex-col items-center gap-2">
                                                                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20"><Camera className="w-6 h-6 text-white" /></div>
                                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">Click to Replace Signature Image</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="p-4 rounded-full bg-[#78dcca]/10 border border-[#78dcca]/20 group-hover:scale-110 transition-transform duration-500">
                                                                            <Camera className={`w-8 h-8 ${accentColor}`} />
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <p className={`text-xs font-bold ${textColor} uppercase tracking-[0.2em] mb-1 font-inter`}>Drag & Drop Hospital Photo</p>
                                                                            <p className={`text-[10px] ${subTextColor} uppercase tracking-widest font-inter font-medium`}>Instantly sync with patient follow-ups</p>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <input 
                                                                    type="file" 
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (event) => setClinicSignatureImage(event.target?.result as string);
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-4">
                                                        <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] shadow-inner`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest text-inter">Global Locale Sync</span>
                                                            <select value={locale} onChange={e => setLocale(e.target.value)} className={`w-full bg-transparent border-none text-sm font-bold ${textColor} focus:ring-0 cursor-pointer p-0 font-inter tracking-tight`}>
                                                                <option value="en-GB">UK Private Protocol (GMT)</option>
                                                                <option value="ko-KR">Korea Standard Protocol (KST)</option>
                                                                <option value="en-US">US Clinical Protocol (EST/PST)</option>
                                                            </select>
                                                        </div>
                                                        <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] shadow-inner`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest text-inter">AI Communication Tone</span>
                                                            <select value={communicationTone} onChange={e => setCommunicationTone(e.target.value as any)} className={`w-full bg-transparent border-none text-sm font-bold ${textColor} focus:ring-0 cursor-pointer p-0 font-inter tracking-tight`}>
                                                                <option value="Refined & Professional">Refined & Professional</option>
                                                                <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* REMOVED: Social Proof section moved to its own tab */}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'reputation' && (
                                            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col overflow-visible">
                                                <div className="text-center">
                                                    <h3 className={`text-6xl font-serif italic ${textColor} tracking-tight mb-4`}>Clinical Reputation Engine</h3>
                                                    <p className="text-xl text-slate-500 font-medium tracking-tight">Elevate your practice through AI-curated authentic patient reviews.</p>
                                                </div>

                                                {/* ROW 1: MISSION CONTROL (Search Hero) */}
                                                <div className="w-full flex flex-col items-center gap-12 overflow-visible">
                                                    {/* EXACT 560x48px Centered Search Bar */}
                                                    <div className="w-full flex justify-center overflow-visible">
                                                        <div className="relative group shadow-2xl hover:shadow-[#34A853]/10 transition-all duration-700 rounded-[2rem] bg-white p-1" style={{ width: '560px' }}>
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
                                                                <Globe className="w-5 h-5 text-slate-300 group-focus-within:text-[#4285F4] transition-colors" />
                                                            </div>
                                                            {GOOGLE_API_KEY ? (
                                                                <Autocomplete
                                                                    apiKey={GOOGLE_API_KEY}
                                                                    onPlaceSelected={(place: any) => {
                                                                        if (place && place.place_id) {
                                                                            setGooglePlaceId(place.place_id);
                                                                            if (place.name) setClinicName(place.name);
                                                                            setSyncStatus('synced');
                                                                            if (place.reviews) {
                                                                                const mappedReviews = place.reviews.map((r: any) => ({
                                                                                    author: r.author_name,
                                                                                    raw: r.text,
                                                                                    ai: r.text, // Will be prefixed in ReviewCard
                                                                                    date: r.relative_time_description,
                                                                                    rating: r.rating
                                                                                }));
                                                                                setLiveReviews(mappedReviews);
                                                                            }
                                                                        }
                                                                    }}
                                                                    options={{
                                                                        types: [],
                                                                        componentRestrictions: { country: ['gb', 'us', 'ca'] },
                                                                        fields: ['name', 'formatted_address', 'place_id', 'reviews', 'rating', 'user_ratings_total', 'types', 'geometry'],
                                                                        strictBounds: false
                                                                    }}
                                                                    placeholder="Search for your clinic to unlock AI reputation..."
                                                                    className={`w-full block opacity-100 relative ${isDark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-transparent'} pl-16 pr-8 rounded-[1.8rem] text-sm font-bold ${textColor} focus:ring-0 outline-none transition-all placeholder:text-slate-300`}
                                                                    style={{ width: '560px', height: '48px' }}
                                                                />
                                                            ) : (
                                                                <div className="w-full bg-red-50 border-2 border-dashed border-red-200 p-3 rounded-[2rem] text-center">
                                                                    <span className="text-red-500 font-bold text-[10px] uppercase">API Error</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Integrated Reputation Status Area (Centered) */}
                                                    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                                                        {googlePlaceId ? (
                                                            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
                                                                <div className="flex items-center gap-2">
                                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />)}
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Reputation Synced</span>
                                                                    </div>
                                                                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Protocol Verified</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <p className="text-slate-400 font-serif italic text-lg tracking-wide">Enter your practice identity above to begin optimization.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ROW 2: THE REPUTATION SHOWCASE (Expanded Side-by-Side Cards) */}
                                                <div className="w-full space-y-12 overflow-visible">
                                                    {googlePlaceId && (
                                                        <div className="grid grid-cols-1 gap-12 animate-in fade-in duration-1000">
                                                            {liveReviews.map((rev: any, i: number) => (
                                                                <ReviewCard 
                                                                    key={i}
                                                                    rev={rev}
                                                                    isDark={isDark}
                                                                    cardBg={cardBg}
                                                                    borderColor={borderColor}
                                                                    textColor={textColor}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ROW 3 (Optional / Footer): Dental Smile Preview */}
                                                <div className="w-full pt-20 border-t border-slate-100 flex flex-col items-center">
                                                    <div className="w-full max-w-5xl">
                                                        <div className={`h-full p-12 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'} border ${borderColor} rounded-[3rem] shadow-inner relative overflow-hidden flex flex-col`}>
                                                            <div className="absolute top-0 right-0 p-12">
                                                                <div className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center font-serif italic text-xl shadow-sm">H</div>
                                                            </div>
                                                            
                                                            <div className="mb-12">
                                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-8">Patient Proposal Preview</span>
                                                                <h4 className={`text-5xl font-serif italic ${textColor} mb-6`}>{clinicName || 'The Signature Experience'}</h4>
                                                                <div className="h-[2px] w-16 bg-[#c5a059] mb-10" />
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
                                                                {/* Hero Review (Left) */}
                                                                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-black/5 space-y-8 transform hover:scale-[1.02] transition-transform duration-500">
                                                                    <div className="flex gap-1 mb-2">
                                                                        {[...Array(liveReviews[0]?.rating ? Math.floor(liveReviews[0].rating) : 5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />)}
                                                                    </div>
                                                                    <p className="text-2xl font-serif italic text-slate-800 leading-relaxed">
                                                                        "{liveReviews[0]?.ai || liveReviews[0]?.raw || 'Awaiting Google Review connection...'}"
                                                                    </p>
                                                                    <div className="flex items-center gap-5 pt-6 border-t border-slate-100">
                                                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 shadow-inner">
                                                                           {liveReviews[0]?.author?.substring(0,2)?.toUpperCase() || '--'}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-black text-slate-900 tracking-tight uppercase">{liveReviews[0]?.author || 'Pending'}</p>
                                                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{liveReviews[0]?.date || 'Awaiting Verification'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* AI Insights (Right) */}
                                                                <div className="bg-white/40 p-10 rounded-[2.5rem] border border-white/60 space-y-8 h-full flex flex-col">
                                                                    <div className="flex items-center gap-3">
                                                                        <Sparkles className="w-6 h-6 text-[#c5a059]" />
                                                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">AI Trust Insight</span>
                                                                    </div>
                                                                    <div className="flex-1 space-y-6">
                                                                        <div className="h-5 w-full bg-slate-200/50 rounded-full animate-pulse" />
                                                                        <div className="h-5 w-5/6 bg-slate-200/50 rounded-full animate-pulse" />
                                                                        <div className="h-5 w-4/6 bg-slate-200/50 rounded-full animate-pulse" />
                                                                    </div>
                                                                    <div className="pt-6 mt-auto">
                                                                        <div className="px-5 py-3 bg-emerald-50 rounded-full inline-flex items-center gap-3">
                                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Growth Factor: +24%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-16 pt-10 border-t border-slate-200/40">
                                                                <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">
                                                                    Powered by Hanlan Clinical AI Engine
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    
                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="text-center mb-10 text-inter">
                                                <h3 className={`text-3xl font-black ${textColor} tracking-tighter text-inter`}>Wellness Concierge</h3>
                                                <p className="text-base text-slate-500 font-medium tracking-tight text-inter">Dedicated optimization support.</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                                                {[
                                                    { 
                                                        icon: MessageSquare, 
                                                        label: '24/7 AI HEALTH CONCIERGE', 
                                                        desc: 'Instant clinical & growth insights powered by Hanlan.',
                                                        isAction: true,
                                                        actionLabel: 'Launch AI Chat',
                                                        onClick: () => {
                                                            const { setIsAIChatOpen } = useDashboardStore.getState();
                                                            setIsAIChatOpen(true);
                                                            onClose();
                                                        }
                                                    },
                                                    { 
                                                        icon: ShieldCheck, 
                                                        label: 'Compliance Vault', 
                                                        desc: 'Isolated data encryption & protocol logs.',
                                                        isAction: true,
                                                        actionLabel: 'Open Vault',
                                                        onClick: () => window.open('/security', '_blank')
                                                    },
                                                    { 
                                                        icon: Zap, 
                                                        label: 'Strategic Insights', 
                                                        desc: 'Market analysis & growth acceleration.',
                                                        isAction: false 
                                                    }
                                                ].map((card, i) => (
                                                    <div key={i} className={`${cardBg} border border-[#c5a059]/20 p-8 rounded-[2.5rem] hover:scale-[1.03] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group h-full shadow-lg hover:shadow-xl shadow-inner bg-gradient-to-b from-white to-[#88b399]/10`}>
                                                        <div className="w-16 h-16 rounded-full bg-[#88b399]/20 border border-[#88b399]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-inner">
                                                            <card.icon className={`w-7 h-7 text-[#004d40]`} strokeWidth={1.5} />
                                                        </div>
                                                        <h4 className={`text-base font-black ${textColor} mb-3 uppercase tracking-tight text-inter`}>{card.label}</h4>
                                                        <p className={`text-[10px] ${subTextColor} leading-[1.6] font-bold mb-8 flex-1 text-inter uppercase tracking-[0.05em]`}>{card.desc}</p>
                                                        
                                                        {card.isAction && (
                                                            <button 
                                                               onClick={card.onClick}
                                                               className={`w-full py-4 bg-transparent border-2 border-[#c5a059] text-[#1a1a1a] hover:bg-[#c5a059] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.05] transition-all active:scale-95 text-inter`}>
                                                                {card.actionLabel}
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Subtle Branding Bottom */}
                                            <div className="flex justify-end pr-4 opacity-40 mt-8">
                                                <div className="text-right">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${textColor} text-inter`}>{clinicName || 'Hanlan OC'}</span>
                                                    <div className={`h-[1px] w-14 bg-[#c5a059] mt-2 ml-auto shadow-inner`} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}