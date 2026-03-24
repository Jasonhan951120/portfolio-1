import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, Settings, List, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, User, ArrowRight } from 'lucide-react';
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

    // Theme Engine: VVIP Luxury Edition
    const isDark = activeTheme === 'dark';
    const bgColor = isDark ? 'bg-[#0A0F1E]' : 'bg-white';
    const cardBg = isDark ? 'bg-[#151C2F]/60 backdrop-blur-xl' : 'bg-[#f8f9fa]';
    const textColor = isDark ? 'text-white' : 'text-[#0f172a]';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const accentColor = isDark ? 'text-[#2AF598]' : 'text-[#0ea5e9]';
    const accentBg = isDark ? 'bg-[#2AF598]' : 'bg-[#0ea5e9]';
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
                        className={`w-full max-w-6xl h-full max-h-[85vh] ${bgColor} rounded-[1.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden border ${borderColor} transition-all duration-700 font-inter tracking-tight`}
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
                            <button onClick={onClose} className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center transition-all hover:rotate-90 text-slate-400 hover:text-white shadow-xl group relative z-10`}>
                                <X className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Private Lounge Navigation */}
                            <div className={`w-64 flex-shrink-0 border-r ${borderColor} p-6 flex flex-col gap-2 ${isDark ? 'bg-[#0A0F1E]/50' : 'bg-slate-50/50'} backdrop-blur-xl`}>
                                {[
                                    { id: 'menu', icon: List, label: 'Treatment Menu' },
                                    { id: 'general', icon: Globe, label: 'Bespoke Identities' },
                                    { id: 'support', icon: ShieldCheck, label: 'Executive Lounges' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-500 group relative ${
                                            activeTab === tab.id 
                                                ? `${isDark ? 'bg-white/10' : 'bg-white shadow-lg'} ${textColor} border ${borderColor}` 
                                                : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? (isDark ? 'text-[#2AF598]' : 'text-[#0ea5e9]') : 'text-slate-400'}`} strokeWidth={2.5} />
                                            <span className="font-bold text-xs uppercase tracking-widest">{tab.label}</span>
                                        </div>
                                        {activeTab === tab.id && <motion.div layoutId="nav-glow" className={`absolute inset-0 rounded-xl ${isDark ? 'bg-[#2AF598]/5 shadow-[inset_0_0_20px_rgba(42,245,152,0.1)]' : 'bg-sky-500/5'} border ${isDark ? 'border-[#2AF598]/30' : 'border-sky-500/30'}`} />}
                                        <ArrowRight className={`w-3 h-3 transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                                    </button>
                                ))}
                            </div>

                            {/* Bento Grid Configuration Panel */}
                            <div className={`flex-1 overflow-y-auto p-8 custom-scrollbar relative transition-colors duration-500`}>
                                {isDark && <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2AF598]/5 blur-[120px] rounded-full pointer-events-none" />}
                                
                                <div className="max-w-4xl mx-auto space-y-4">
                                    
                                    {activeTab === 'menu' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-700">
                                            {/* Clinic Industry Bento Card */}
                                            <div className={`col-span-full ${cardBg} border ${borderColor} p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all duration-500`}>
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
                                                        className={`w-full bg-white/5 border ${borderColor} rounded-xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none focus:ring-2 focus:ring-[#2AF598]/20 transition-all appearance-none cursor-pointer backdrop-blur-md`}
                                                    >
                                                        <option value="Dental">Elite Dental Protocol</option>
                                                        <option value="Aesthetic">Bespoke Aesthetics</option>
                                                        <option value="Wellness">Holistic Transformation</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Treatment Builder Header Card */}
                                            <div className={`col-span-full flex items-center justify-between p-6 ${cardBg} border ${borderColor} rounded-[2rem] hover:scale-[1.01] transition-all duration-500`}>
                                                <h3 className={`text-xl font-black ${textColor}`}>Signature Menu Builder</h3>
                                                <button 
                                                    onClick={() => { setEditingTemplate({ id: '', name: '', price: 0 }); setIsEditing(true); }}
                                                    className={`px-6 py-3 ${isDark ? 'bg-white text-black' : 'bg-[#0f172a] text-white'} rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-xl hover:shadow-[#2AF598]/20 active:scale-95 flex items-center gap-2`}
                                                >
                                                    <Plus className={`w-4 h-4 ${accentColor}`} strokeWidth={4} /> Add Masterpiece
                                                </button>
                                            </div>

                                            {/* Treatment Cards */}
                                            {templates.map(template => (
                                                <div key={template.id} className={`${cardBg} rounded-[2rem] border ${borderColor} p-5 shadow-inner hover:scale-[1.05] transition-all duration-500 group relative overflow-hidden`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <h4 className={`${textColor} font-black text-sm truncate uppercase tracking-widest`}>{template.name}</h4>
                                                            <p className={`${accentColor} font-black text-lg`}>{currency}{template.price.toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                            <button onClick={() => { setEditingTemplate(template); setIsEditing(true); }} className={`w-8 h-8 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-[#2AF598]/10' : 'bg-white hover:bg-slate-50'} rounded-lg border ${borderColor}`}><Settings className="w-4 h-4 text-slate-400" /></button>
                                                            <button onClick={() => handleDeleteTemplate(template.id)} className={`w-8 h-8 flex items-center justify-center ${isDark ? 'bg-white/5 hover:bg-red-500/10' : 'bg-white hover:bg-red-50'} rounded-lg border ${borderColor}`}><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t ${borderColor} flex items-center justify-between">
                                                        <div className="flex -space-x-2">
                                                            {[template.beforeImg, template.afterImg].map((img, i) => (
                                                                <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-[#0A0F1E]' : 'border-white'} ${cardBg} flex items-center justify-center shadow-lg overflow-hidden`}>
                                                                    {img ? <img src={img} className="w-full h-full object-cover" /> : <Camera className="w-3 h-3 text-slate-400" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border ${borderColor}">
                                                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sageGreen }} />
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                                            {/* Branding Suite Card */}
                                            <div className={`col-span-full ${cardBg} border ${borderColor} p-8 rounded-[2.5rem] relative overflow-hidden group`}>
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#2AF598]/5 border ${borderColor} flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700">
                                                        <Zap className={`w-8 h-8 ${accentColor}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-2xl font-black ${textColor} uppercase tracking-tighter`}>Bespoke Branding Identity</h3>
                                                        <p className={`text-sm ${subTextColor}`}>Synchronise your global presence and visual personality.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Theme Toggle Bento */}
                                                    <div className={`p-6 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[2rem] transition-all hover:scale-[1.02]`}>
                                                        <h4 className={`text-xs font-black uppercase tracking-widest ${subTextColor} mb-4`}>Aesthetic Override</h4>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setActiveTheme('white')}
                                                                className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                                                                    activeTheme === 'white' 
                                                                        ? `${isDark ? 'bg-[#2AF598] text-black shadow-[0_0_30px_rgba(42,245,152,0.3)]' : 'bg-[#0f172a] text-white shadow-xl'} border-transparent` 
                                                                        : 'bg-white/5 text-slate-500 border border-white/5'
                                                                }`}
                                                            >
                                                                Executive White
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveTheme('dark')}
                                                                className={`flex-1 py-4 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                                                                    activeTheme === 'dark' 
                                                                        ? 'bg-[#2AF598] text-black shadow-[0_0_30px_rgba(42,245,152,0.3)]' 
                                                                        : 'bg-white/5 text-slate-500 border border-white/5'
                                                                }`}
                                                            >
                                                                Matte Dark
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Locale & Tone */}
                                                    <div className="space-y-4">
                                                        <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[1.5rem]`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Global Locale Sync</span>
                                                            <select value={locale} onChange={e => setLocale(e.target.value)} className={`w-full bg-transparent border-none text-xs font-bold ${textColor} focus:ring-0 cursor-pointer`}>
                                                                <option value="en-GB">UK Private Protocol (GMT)</option>
                                                                <option value="ko-KR">South Korean Executive (KST)</option>
                                                            </select>
                                                        </div>
                                                        <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white'} border ${borderColor} rounded-[1.5rem]`}>
                                                            <span className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">AI Communication Tone</span>
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-left-4 duration-700 pb-8">
                                            {[
                                                { icon: User, label: 'Success Concierge', desc: 'Direct uplink to your private success manager.' },
                                                { icon: ShieldCheck, label: 'Trust Vault', desc: 'Sovereign encryption for all patient assets.' },
                                                { icon: Zap, label: 'Strategic Partnership', desc: 'Shape the roadmap of our elite software.' }
                                            ].map((card, i) => (
                                                <div key={i} className={`${cardBg} border ${borderColor} p-6 rounded-[2rem] hover:scale-[1.05] transition-all duration-500 relative group overflow-hidden`}>
                                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity"><card.icon className={`w-12 h-12 ${textColor}`} /></div>
                                                    <div className={`w-12 h-12 rounded-xl bg-white/5 border ${borderColor} flex items-center justify-center mb-6 shadow-inner ring-1 ring-[#2AF598]/20`}><card.icon className={`w-6 h-6 ${accentColor}`} strokeWidth={2.5} /></div>
                                                    <h4 className={`text-base font-black ${textColor} mb-3 uppercase tracking-widest`}>{card.label}</h4>
                                                    <p className={`text-[10px] ${subTextColor} leading-relaxed font-semibold`}>{card.desc}</p>
                                                </div>
                                            ))}
                                            <div className="col-span-full p-10 bg-gradient-to-tr from-[#0f172a] to-[#1e293b] rounded-[3rem] text-center shadow-3xl relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-[#2AF598]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                                <div className="relative z-10">
                                                    <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Request Elite Induction</h4>
                                                    <p className="text-white/40 text-[11px] mb-8 max-w-lg mx-auto font-bold tracking-widest uppercase">Deepen your strategic advantage with our lead architects.</p>
                                                    <button className="px-12 py-4 bg-[#2AF598] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(42,245,152,0.3)]">Book Private Session</button>
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
