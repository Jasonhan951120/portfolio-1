import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, Settings, List, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, User, ArrowRight, Calendar, Save } from 'lucide-react';
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
    const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null);
    const [activeTheme, setActiveTheme] = useState<'white' | 'dark'>('white');
    const [communicationTone, setCommunicationTone] = useState<'Warm & Empathetic' | 'Refined & Professional'>('Refined & Professional');
    const [locale, setLocale] = useState('en-GB');
    const [editingTreatmentId, setEditingTreatmentId] = useState<string | null>(null);

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

    const handleAddMasterpiece = () => {
        const newTemplate: TreatmentTemplate = {
            id: `template-${Date.now()}`,
            name: "New Masterpiece",
            price: 0,
            status: "Draft"
        } as any;
        setTemplates([...templates, newTemplate]);
    };

    const handleSaveTemplate = () => {
        if (!editingTemplate || !editingTemplate.name) return;
        setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        setEditingTreatmentId(null);
        setEditingTemplate(null);
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm("Are you sure you want to delete this treatment?")) {
            setTemplates(templates.filter(t => t.id !== id));
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
                                    <h2 className={`text-2xl font-black ${textColor} uppercase tracking-tight`}>Lounge Settings</h2>
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
                                            {/* Treatment Editor Inline */}
                                            <AnimatePresence>
                                                {editingTreatmentId && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        className={`${cardBg} border-2 border-[#78dcca] p-6 rounded-[2rem] shadow-xl mb-4 relative overflow-hidden`}
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className={`text-lg font-black ${textColor}`}>Edit Masterpiece</h3>
                                                            <button onClick={() => setEditingTreatmentId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Treatment Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={editingTemplate?.name || ''} 
                                                                    onChange={e => setEditingTemplate({...editingTemplate!, name: e.target.value})}
                                                                    className="w-full bg-white/5 border border-black/5 rounded-xl py-2 px-4 text-sm font-bold focus:outline-none"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Price ({currency})</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={editingTemplate?.price || 0} 
                                                                    onChange={e => setEditingTemplate({...editingTemplate!, price: Number(e.target.value)})}
                                                                    className="w-full bg-white/5 border border-black/5 rounded-xl py-2 px-4 text-sm font-bold focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button onClick={handleSaveTemplate} className="mt-4 w-full py-3 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                                            <Save className="w-4 h-4" /> Save Changes
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className={`${cardBg} border ${borderColor} p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all duration-500`}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className={`text-xl font-black ${textColor} mb-1`}>Practice Identity</h3>
                                                        <p className={`text-xs ${subTextColor}`}>Engineered precision for your specific field.</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center"><Briefcase className={`w-5 h-5 ${accentColor}`} /></div>
                                                </div>
                                                <div className="relative max-w-sm">
                                                    <select 
                                                        value={clinicType}
                                                        onChange={(e) => setClinicType(e.target.value as any)}
                                                        className={`w-full bg-white/5 border ${borderColor} rounded-xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none transition-all appearance-none cursor-pointer backdrop-blur-md`}
                                                    >
                                                        <option value="Dental">Elite Dental Protocol</option>
                                                        <option value="Aesthetic">Bespoke Aesthetics</option>
                                                        <option value="Wellness">Holistic Transformation</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={`flex items-center justify-between p-6 ${cardBg} border ${borderColor} rounded-[2rem] hover:scale-[1.01] transition-all duration-500`}>
                                                <h3 className={`text-xl font-black ${textColor}`}>Signature Menu Builder</h3>
                                                <button 
                                                    onClick={handleAddMasterpiece}
                                                    className={`px-6 py-3 ${isDark ? 'bg-white text-black' : 'bg-[#0f172a] text-white'} rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-xl hover:shadow-[#78dcca]/20 active:scale-95 flex items-center gap-2`}
                                                >
                                                    <Plus className={`w-4 h-4 ${accentColor}`} strokeWidth={4} /> Add Masterpiece
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {templates.map(template => (
                                                    <div key={template.id} className={`${cardBg} rounded-[2rem] border ${borderColor} p-5 shadow-inner hover:scale-[1.05] transition-all duration-500 group relative overflow-hidden flex flex-col h-full`}>
                                                        <div className="flex justify-between items-start mb-3 text-inter">
                                                            <div className="flex-1">
                                                                <h4 className={`${textColor} font-black text-sm truncate uppercase tracking-widest`}>{template.name}</h4>
                                                                <p className={`${accentColor} font-black text-lg`}>{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                                <button onClick={() => { setEditingTreatmentId(template.id); setEditingTemplate(template); }} className={`w-8 h-8 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-[#78dcca]/10' : 'bg-white hover:bg-slate-50'} rounded-lg border ${borderColor}`}><Settings className="w-4 h-4 text-slate-400" /></button>
                                                                <button onClick={() => handleDeleteTemplate(template.id)} className={`w-8 h-8 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-red-500/10' : 'bg-white hover:bg-red-50'} rounded-lg border ${borderColor}`}><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto pt-4 border-t ${borderColor} flex items-center justify-between">
                                                            <div className="flex items-center gap-x-4">
                                                                {[template.beforeImg, template.afterImg].map((img, i) => (
                                                                    <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-[#0A0F1E]' : 'border-white'} ${isDark ? 'bg-[#151C2F]' : 'bg-white'} flex items-center justify-center shadow-lg overflow-hidden`}>
                                                                        {img ? <img src={img} className="w-full h-full object-cover" /> : <Camera className="w-3 h-3 text-slate-400" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border ${borderColor}">
                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: template.price > 0 ? sageGreen : '#fbbf24' }} />
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{template.price > 0 ? 'Active' : 'Draft'}</span>
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
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#78dcca]/5 border ${borderColor} flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700">
                                                        <Zap className={`w-8 h-8 ${accentColor}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-2xl font-black ${textColor} uppercase tracking-tighter text-inter`}>Bespoke Branding Identity</h3>
                                                        <p className={`text-sm ${subTextColor}`}>Synchronise your global presence and visual personality.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] transition-all hover:scale-[1.02]`}>
                                                        <h4 className={`text-xs font-black uppercase tracking-widest ${subTextColor} mb-4`}>Aesthetic Override</h4>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setActiveTheme('white')}
                                                                className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                                                                    activeTheme === 'white' 
                                                                        ? `${isDark ? 'bg-[#78dcca] text-[#0f172a] shadow-lg' : 'bg-[#0f172a] text-white shadow-xl'} border-transparent` 
                                                                        : 'bg-white/5 text-slate-500 border border-white/5'
                                                                }`}
                                                            >
                                                                Executive White
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveTheme('dark')}
                                                                className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                                                                    activeTheme === 'dark' 
                                                                        ? 'bg-[#78dcca] text-[#0f172a] shadow-lg' 
                                                                        : 'bg-white/5 text-slate-500 border border-white/5'
                                                                }`}
                                                            >
                                                                Matte Dark
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[1.5rem]`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Global Locale Sync</span>
                                                            <select value={locale} onChange={e => setLocale(e.target.value)} className={`w-full bg-transparent border-none text-xs font-bold ${textColor} focus:ring-0 cursor-pointer`}>
                                                                <option value="en-GB">UK Private Protocol (GMT)</option>
                                                                <option value="ko-KR">South Korean Executive (KST)</option>
                                                            </select>
                                                        </div>
                                                        <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[1.5rem]`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest text-inter">AI Communication Tone</span>
                                                            <select value={communicationTone} onChange={e => setCommunicationTone(e.target.value as any)} className={`w-full bg-transparent border-none text-xs font-bold ${textColor} focus:ring-0 cursor-pointer`}>
                                                                <option value="Refined & Professional">Refined & Professional</option>
                                                                <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="text-center mb-10">
                                                <h3 className={`text-3xl font-black ${textColor} tracking-tight`}>Wellness Concierge</h3>
                                                <p className="text-base text-slate-500 font-medium">Dedicated optimization support.</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
                                                {[
                                                    { icon: User, label: '24/7 Concierge', desc: 'Direct access to your manager.' },
                                                    { icon: ShieldCheck, label: 'Compliance Vault', desc: 'Isolated data encryption.' },
                                                    { icon: Zap, label: 'Strategic Insights', desc: 'Market analysis & growth.' },
                                                    { icon: Calendar, label: 'Book Session', desc: 'Dedicated strategy optimization consultation.', isAction: true }
                                                ].map((card, i) => (
                                                    <div key={i} className={`${cardBg} border ${borderColor} p-6 rounded-[2rem] hover:scale-[1.03] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group h-full`}>
                                                        <div className="w-12 h-12 rounded-full bg-[#78dcca]/10 border border-[#78dcca]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                                            <card.icon className={`w-5 h-5 ${accentColor}`} strokeWidth={2.5} />
                                                        </div>
                                                        <h4 className={`text-base font-black ${textColor} mb-2 uppercase tracking-tight`}>{card.label}</h4>
                                                        <p className={`text-[10px] ${subTextColor} leading-relaxed font-semibold mb-6 flex-1 text-inter`}>{card.desc}</p>
                                                        
                                                        {card.isAction && (
                                                            <button className={`w-full py-2.5 ${isDark ? 'bg-[#78dcca] text-[#0f172a]' : 'bg-[#0f172a] text-white'} rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.05] transition-all`}>
                                                                Book Now
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Subtle Branding Bottom */}
                                            <div className="flex justify-end pr-4 opacity-30">
                                                <div className="text-right">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${textColor}`}>Hanlan OC</span>
                                                    <div className={`h-[1px] w-12 ${accentBg} mt-1 ml-auto`} />
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
