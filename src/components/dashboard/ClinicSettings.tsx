import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, Settings, List, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, User } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

interface TreatmentTemplate {
    id: string;
    name: string;
    price: number;
    emailContents?: string;
    beforeImg?: string;
    afterImg?: string;
    bookingUrl?: string;
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
    templates,
    setTemplates 
}: ClinicSettingsProps) {
    const { clinicType, setClinicType } = useDashboardStore();
    const [activeTab, setActiveTab] = useState<'menu' | 'general' | 'support'>('menu');
    const [isEditing, setIsEditing] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null);
    const [activeTheme, setActiveTheme] = useState<'white' | 'dark'>('white');
    const [communicationTone, setCommunicationTone] = useState<'Warm & Empathetic' | 'Refined & Professional'>('Refined & Professional');
    const [locale, setLocale] = useState('en-GB');

    // Persistence Logic
    useEffect(() => {
        const savedTheme = localStorage.getItem('clinic-theme');
        if (savedTheme === 'dark' || savedTheme === 'white') {
            setActiveTheme(savedTheme as 'white' | 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('clinic-theme', activeTheme);
    }, [activeTheme]);

    const handleSaveTemplate = () => {
        if (!editingTemplate || !editingTemplate.name) return;
        if (templates.find(t => t.id === editingTemplate.id)) {
            setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        } else {
            setTemplates([...templates, { ...editingTemplate, id: `template-${Date.now()}` }]);
        }
        setIsEditing(false);
        setEditingTemplate(null);
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm("Are you sure you want to delete this treatment?")) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    // Theme-based dynamic styling (Wellness Edition)
    const isDark = activeTheme === 'dark';
    const bgColor = isDark ? 'bg-[#fcfdfd]' : 'bg-[#f8f9fa]';
    const textColor = isDark ? 'text-[#1a2b3c]' : 'text-[#0f172a]';
    const accentColor = 'text-[#78dcca]';
    const mintBorder = 'border-[#78dcca]';
    const softShadow = isDark ? 'shadow-[0_15px_45px_rgba(120,220,202,0.1)]' : 'shadow-xl';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-xl p-4 md:p-6 transition-all duration-700">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 15 }}
                        className={`w-full max-w-6xl h-full max-h-[84vh] ${bgColor} rounded-[2rem] ${softShadow} flex flex-col overflow-hidden border border-white/40 ring-1 ring-black/5 transition-all duration-500`}
                    >
                        {/* Compact Header */}
                        <div className="flex-shrink-0 px-8 py-4 flex items-center justify-between border-b border-black/[0.03]">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white border border-black/[0.03] flex items-center justify-center shadow-sm relative">
                                    <Settings className={`w-5 h-5 ${textColor}`} strokeWidth={1.5} />
                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="font-inter tracking-tight">
                                    <h2 className={`text-xl font-black ${textColor}`}>Clinic Settings</h2>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${accentColor}`}>Wellness Edition</span>
                                        <div className="w-1 h-1 rounded-full bg-red-400" />
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-black/[0.03] flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Condensed Sidebar */}
                            <div className="w-64 flex-shrink-0 border-r border-black/[0.03] p-5 flex flex-col gap-1.5 font-inter tracking-tight">
                                {[
                                    { id: 'menu', icon: List, label: 'Treatment Menu' },
                                    { id: 'general', icon: Globe, label: 'General Preferences' },
                                    { id: 'support', icon: User, label: 'Support & Help' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                            activeTab === tab.id 
                                                ? 'bg-white text-[#0f172a] shadow-md border border-black/[0.02]' 
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#78dcca]' : 'text-slate-300'}`} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                                            <span className="font-bold text-sm">{tab.label}</span>
                                        </div>
                                        {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                    </button>
                                ))}
                            </div>

                            {/* Compact Panel Area */}
                            <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar ${isDark ? 'bg-[#78dcca]/5' : 'bg-white/30'} transition-all duration-500`}>
                                <div className="max-w-3xl mx-auto font-inter tracking-tight">
                                    
                                    {activeTab === 'menu' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            {/* Clinic Industry Card - Compact */}
                                            <div className="mb-6 p-5 bg-white border border-black/[0.03] rounded-2xl shadow-sm relative overflow-hidden group">
                                                <div className="flex items-center gap-2.5 mb-1.5">
                                                    <h3 className={`text-lg font-black ${textColor}`}>Clinic Industry</h3>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 mb-4">Tailor AI messaging for your specific field.</p>
                                                <div className="relative max-w-sm">
                                                    <select 
                                                        value={clinicType}
                                                        onChange={(e) => setClinicType(e.target.value as any)}
                                                        className={`w-full bg-[#fcfdfd] border border-black/[0.05] rounded-xl py-2.5 px-4 text-sm font-bold ${textColor} focus:outline-none focus:ring-4 focus:ring-[#78dcca]/10 focus:border-[#78dcca] transition-all appearance-none cursor-pointer`}
                                                    >
                                                        <option value="Dental">Dental Clinic</option>
                                                        <option value="Aesthetic">Aesthetic Clinic</option>
                                                        <option value="Wellness">Wellness & Spa</option>
                                                    </select>
                                                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${accentColor}`}>
                                                        <Plus className="w-4 h-4 rotate-45" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Header Section - Compact */}
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2.5">
                                                    <h3 className={`text-lg font-black ${textColor}`}>Treatment Menu Builder</h3>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                </div>
                                                <button 
                                                    onClick={() => { setEditingTemplate({ id: '', name: '', price: 0 }); setIsEditing(true); }}
                                                    className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-md flex items-center gap-2"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-[#78dcca]" strokeWidth={3} /> Add New
                                                </button>
                                            </div>

                                            {/* Treatment Cards - Compact */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {templates.map(template => (
                                                    <div key={template.id} className="bg-white rounded-2xl border border-black/[0.03] p-4 shadow-sm hover:shadow-md transition-all group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`${textColor} font-black text-sm truncate pr-2`}>{template.name}</h4>
                                                                <p className={`${accentColor} font-black text-base`}>{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => { setEditingTemplate(template); setIsEditing(true); }} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-[#78dcca] rounded-lg bg-slate-50"><Settings className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => handleDeleteTemplate(template.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-lg bg-slate-50"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>
                                                        <div className="pt-3 border-t border-black/[0.03] flex items-center justify-between">
                                                            <div className="flex -space-x-2">
                                                                {[template.beforeImg, template.afterImg].map((img, i) => (
                                                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm overflow-hidden ring-1 ring-black/5">
                                                                        {img ? <img src={img} className="w-full h-full object-cover" /> : <Camera className="w-3 h-3 text-slate-300" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                                                                <div className="w-1 w-1 rounded-full bg-emerald-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-5">
                                            <div className="flex items-center gap-2.5 mb-1">
                                                <h3 className={`text-xl font-black ${textColor}`}>Branding Identity</h3>
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            </div>
                                            
                                            {/* Theme Suite - Compact */}
                                            <div className="p-6 bg-white border border-black/[0.03] rounded-2xl shadow-sm">
                                                <div className="flex items-center gap-4 mb-5">
                                                    <div className="w-11 h-11 rounded-xl bg-[#78dcca]/5 border border-[#78dcca]/10 flex items-center justify-center shadow-inner">
                                                        <Zap className={`w-5 h-5 ${accentColor}`} />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-base font-black ${textColor}`}>Interface Aesthetics</h4>
                                                        <p className="text-[11px] text-slate-500 font-medium">Global UI personality override.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setActiveTheme('white')}
                                                        className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                                                            activeTheme === 'white' 
                                                                ? 'bg-[#0f172a] text-white shadow-lg' 
                                                                : 'bg-[#fcfdfd] text-slate-400 border border-black/[0.03]'
                                                        }`}
                                                    >
                                                        Executive White
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTheme('dark')}
                                                        className={`flex-1 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border-2 ${
                                                            activeTheme === 'dark' 
                                                                ? `bg-white ${accentColor} border-[#78dcca] shadow-md` 
                                                                : 'bg-[#fcfdfd] text-slate-400 border-transparent'
                                                        }`}
                                                    >
                                                        Matte Dark
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Locale & Tone Side-by-Side - Compact */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-5 bg-white border border-black/[0.03] rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#78dcca]/5 flex items-center justify-center"><Globe className={`w-4 h-4 ${accentColor}`} /></div>
                                                        <h4 className={`text-xs font-black ${textColor} uppercase tracking-widest`}>Sync Locale</h4>
                                                    </div>
                                                    <select 
                                                        value={locale} 
                                                        onChange={(e) => setLocale(e.target.value)}
                                                        className="w-full bg-[#fcfdfd] border-none rounded-xl py-2.5 px-4 text-xs font-bold focus:ring-2 focus:ring-[#78dcca]/10"
                                                    >
                                                        <option value="en-GB">UK (GMT)</option>
                                                        <option value="ko-KR">SK (KST)</option>
                                                        <option value="en-US">US (EST)</option>
                                                    </select>
                                                </div>
                                                <div className="p-5 bg-white border border-black/[0.03] rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#78dcca]/5 flex items-center justify-center"><MessageSquare className={`w-4 h-4 ${accentColor}`} /></div>
                                                        <h4 className={`text-xs font-black ${textColor} uppercase tracking-widest`}>Patient Tone</h4>
                                                    </div>
                                                    <select 
                                                        value={communicationTone} 
                                                        onChange={(e) => setCommunicationTone(e.target.value as any)}
                                                        className="w-full bg-[#fcfdfd] border-none rounded-xl py-2.5 px-4 text-xs font-bold focus:ring-2 focus:ring-[#78dcca]/10"
                                                    >
                                                        <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                        <option value="Refined & Professional">Refined & Professional</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                                            <div className="text-center py-2">
                                                <h3 className={`text-2xl font-black ${textColor} tracking-tight`}>Wellness Concierge</h3>
                                                <p className="text-xs text-slate-500 font-medium">Dedicated optimization support.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {[
                                                    { icon: User, label: '24/7 Concierge', desc: 'Direct access to your manager.' },
                                                    { icon: ShieldCheck, label: 'Compliance Vault', desc: 'Isolated data encryption.' },
                                                    { icon: Zap, label: 'Strategic Insights', desc: 'Market analysis & growth.' }
                                                ].map((card, i) => (
                                                    <div key={i} className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                                        <div className="w-10 h-10 rounded-xl bg-[#78dcca]/10 flex items-center justify-center mb-4 ring-1 ring-[#78dcca]/20">
                                                            <card.icon className={`w-5 h-5 ${accentColor}`} strokeWidth={2.5} />
                                                        </div>
                                                        <h4 className={`text-sm font-black ${textColor} mb-2`}>{card.label}</h4>
                                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-8 bg-[#0f172a] rounded-[2rem] text-center shadow-lg relative overflow-hidden group">
                                                <div className="relative z-10">
                                                    <h4 className="text-lg font-black text-white mb-2">Request Induction</h4>
                                                    <button className="mt-2 px-8 py-3 bg-white text-[#0f172a] rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Book Strategy Session</button>
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
