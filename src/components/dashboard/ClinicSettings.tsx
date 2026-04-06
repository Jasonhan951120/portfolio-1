import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, Settings, List, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, User, ArrowRight, Calendar, Save, Info, RefreshCw, Star, ChevronRight, Sparkles, Palette } from 'lucide-react';
import Autocomplete from 'react-google-autocomplete';
import { useDashboardStore } from '../../store/useDashboardStore';

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
                                <div className="max-w-4xl mx-auto">
                                    
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

                                            {/* [FIXED]: Mapping strictly from parent props 'templates' */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                {templates.map(template => (
                                                    <div key={template.id} className={`${cardBg} rounded-[2rem] border ${borderColor} p-6 shadow-inner hover:scale-[1.03] transition-all duration-500 group relative overflow-hidden flex flex-col h-full`}>
                                                        <div className="flex justify-between items-start mb-4 text-inter">
                                                            <div className="flex-1">
                                                                <h4 className={`${textColor} font-black text-sm truncate uppercase tracking-widest`}>{template.name}</h4>
                                                                <p className={`${accentColor} font-black text-xl mt-1 tracking-tight`}>{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                                <button onClick={() => { setEditingTreatmentId(template.id); setEditingTemplate(template); }} className={`w-9 h-9 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-[#78dcca]/10' : 'bg-white hover:bg-slate-50'} rounded-xl border ${borderColor} shadow-sm transition-all shadow-inner`}><Settings className="w-4 h-4 text-slate-400" /></button>
                                                                <button onClick={() => handleDeleteTemplate(template.id)} className={`w-9 h-9 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-red-500/10' : 'bg-white hover:bg-red-50'} rounded-xl border ${borderColor} shadow-sm transition-all shadow-inner`}><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className={`mt-auto pt-6 border-t ${borderColor} flex items-center justify-between`}>
                                                            <div className="flex items-center gap-x-4">
                                                                {[template.beforeImg, template.afterImg].map((img, i) => (
                                                                    <div key={i} className={`w-9 h-9 rounded-full border-2 ${isDark ? 'border-[#0A0F1E]' : 'border-white'} ${isDark ? 'bg-[#151C2F]' : 'bg-white'} flex items-center justify-center shadow-lg overflow-hidden transition-transform group-hover:scale-110 shadow-inner`}>
                                                                        {img ? <img src={img} className="w-full h-full object-cover" alt="" /> : <Camera className="w-4 h-4 text-slate-400" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border ${borderColor} backdrop-blur-md shadow-inner`}>
                                                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(135,169,107,0.5)]" style={{ backgroundColor: template.price > 0 ? sageGreen : '#fbbf24' }} />
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-inter">{template.price > 0 ? 'Active' : 'Draft'}</span>
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
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                                            <div className="mb-10 text-inter">
                                                <h3 className={`text-5xl font-serif italic ${textColor} tracking-tight mb-2`}>Clinical Reputation Engine</h3>
                                                <p className="text-lg text-slate-500 font-medium tracking-tight">Elevate your practice through AI-curated authentic patient reviews.</p>
                                            </div>

                                            <div className="grid grid-cols-12 gap-8 flex-1">
                                                {/* Left side: Implementation & Search */}
                                                <div className="col-span-12 lg:col-span-7 space-y-8">
                                                    <div className={`p-10 ${cardBg} border ${borderColor} rounded-[3rem] shadow-luxury relative overflow-hidden`}>
                                                        <div className="absolute top-0 right-0 p-6">
                                                            {syncStatus === 'synced' && (
                                                                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Connection Strength: High</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-8">
                                                            <div className="space-y-4">
                                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Search Your Global Clinic Identity</label>
                                                                <div className="relative group">
                                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                                                                        <Globe className="w-6 h-6 text-slate-300 group-focus-within:text-[#4285F4] transition-colors" />
                                                                    </div>
                                                                    {GOOGLE_API_KEY ? (
                                                                        <Autocomplete
                                                                            apiKey={GOOGLE_API_KEY}
                                                                            onPlaceSelected={(place: any) => {
                                                                                console.log("PLACE_SELECTED_NAME:", place?.name);
                                                                                if (place && place.place_id) {
                                                                                    console.log(`SUCCESS: CAPTURED BRANCH_ID = ${place.place_id}`);
                                                                                    setGooglePlaceId(place.place_id);
                                                                                    if (place.name) setClinicName(place.name);
                                                                                    setSyncStatus('synced');
                                                                                    if (place.reviews) {
                                                                                        const mappedReviews = place.reviews.map((r: any) => ({
                                                                                            author: r.author_name,
                                                                                            raw: r.text,
                                                                                            ai: `AI formalised: ${r.text.substring(0, 80)}...`,
                                                                                            date: r.relative_time_description,
                                                                                            rating: r.rating
                                                                                        }));
                                                                                        setLiveReviews(mappedReviews);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            options={{
                                                                                // Senior Engineer Note: Empty types array prevents Google from filtering out GPs 
                                                                                // or clinics that aren't strictly categorized as 'establishment' or 'dentist'.
                                                                                types: [],
                                                                                componentRestrictions: { country: ['gb', 'us', 'ca'] },
                                                                                fields: ['name', 'formatted_address', 'place_id', 'reviews', 'rating', 'user_ratings_total', 'types', 'geometry'],
                                                                                strictBounds: false
                                                                            }}
                                                                            placeholder="Search for a clinic or hospital (e.g., London Dermatology)..."
                                                                            className={`w-full block opacity-100 relative z-[9999] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'} border pl-16 pr-8 py-6 rounded-[2rem] text-lg font-bold ${textColor} focus:ring-4 focus:ring-[#4285F4]/10 focus:border-[#4285F4]/40 outline-none transition-all shadow-inner`}
                                                                        />
                                                                    ) : (
                                                                        <div className={`w-full ${isDark ? 'bg-white/5' : 'bg-slate-50'} border-2 border-dashed border-red-500/50 p-6 rounded-[2rem] flex flex-col items-center gap-2`}>
                                                                            <span className="text-red-500 font-black text-xs uppercase tracking-widest">Environment Engine Error</span>
                                                                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">VITE_GOOGLE_MAPS_API_KEY not recognized. Check Vercel project settings.</p>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <AnimatePresence>
                                                                        {!GOOGLE_API_KEY && showResults && (
                                                                            <motion.div 
                                                                                initial={{ opacity: 0, y: 15 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: 15 }}
                                                                                className={`absolute top-full left-0 right-0 z-50 mt-4 ${isDark ? 'bg-[#151C2F]' : 'bg-white'} border border-red-500 rounded-[2.5rem] shadow-2xl overflow-hidden`}
                                                                            >
                                                                                <div className="w-full p-6 flex flex-col items-center gap-2 text-center">
                                                                                    <span className="text-red-500 font-bold">API Key Missing</span>
                                                                                    <p className="text-[11px] text-slate-400 font-medium">Please provide a valid Google Maps API Key to enable search.</p>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>

                                                            {googlePlaceId && (
                                                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                                                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Reputation Optimization Status</h4>
                                                                        <div className="flex gap-2">
                                                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                                        {liveReviews.map((rev: any, i: number) => (
                                                                            <div key={i} className={`p-6 ${isDark ? 'bg-white/5' : 'bg-slate-50'} border ${borderColor} rounded-[2rem] space-y-4`}>
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <span className={`text-xs font-black ${textColor}`}>{rev.author}</span>
                                                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{rev.date}</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-2 gap-6">
                                                                                    <div>
                                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Original Review</p>
                                                                                        <p className="text-[11px] text-slate-400 font-medium italic">"{rev.raw}"</p>
                                                                                    </div>
                                                                                    <div className="border-l border-slate-200 pl-6">
                                                                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                                                            <Sparkles className="w-2.5 h-2.5" /> AI formalised
                                                                                        </p>
                                                                                        <p className={`text-[11px] ${textColor} font-bold`}>{rev.ai}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side: Live Preview Mockup */}
                                                <div className="col-span-12 lg:col-span-5 h-full">
                                                    <div className={`h-full p-8 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'} border ${borderColor} rounded-[3rem] shadow-inner relative overflow-hidden flex flex-col`}>
                                                        <div className="absolute top-0 right-0 p-8">
                                                            <div className="w-10 h-10 rounded-full border border-black/5 bg-white flex items-center justify-center font-serif italic text-lg shadow-sm">H</div>
                                                        </div>
                                                        
                                                        <div className="mb-10">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-6">Patient Proposal Preview</span>
                                                            <h4 className={`text-4xl font-serif italic ${textColor} mb-4`}>{clinicName || 'The Signature Experience'}</h4>
                                                            <div className="h-[2px] w-12 bg-[#c5a059] mb-8" />
                                                        </div>

                                                        <div className="space-y-6 flex-1">
                                                            {/* Review Card Mockup */}
                                                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 space-y-6 transform hover:scale-[1.02] transition-transform duration-500">
                                                                <div className="flex gap-1 mb-2">
                                                                    {[...Array(liveReviews[0]?.rating ? Math.floor(liveReviews[0].rating) : 5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" />)}
                                                                </div>
                                                                <p className="text-xl font-serif italic text-slate-800 leading-relaxed">
                                                                    "{liveReviews[0]?.ai || liveReviews[0]?.raw || 'Awaiting Google Review connection...'}"
                                                                </p>
                                                                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">{liveReviews[0]?.author?.substring(0,2)?.toUpperCase() || '--'}</div>
                                                                    <div>
                                                                        <p className="text-xs font-black text-slate-900 tracking-tight uppercase">{liveReviews[0]?.author || 'Pending'}</p>
                                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{liveReviews[0]?.date || 'Awaiting Verification'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white/40 p-8 rounded-[2.5rem] border border-white/60 space-y-4 blur-[0.5px]">
                                                                <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse" />
                                                                <div className="h-4 w-full bg-slate-200 rounded-full animate-pulse" />
                                                                <div className="h-4 w-2/3 bg-slate-200 rounded-full animate-pulse" />
                                                            </div>
                                                        </div>

                                                        <div className="mt-auto pt-8 border-t border-slate-200/40">
                                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">
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