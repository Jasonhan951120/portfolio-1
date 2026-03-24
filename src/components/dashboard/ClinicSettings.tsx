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
        console.log('Theme Engine: Loading from storage...', savedTheme);
        if (savedTheme === 'dark' || savedTheme === 'white') {
            setActiveTheme(savedTheme as 'white' | 'dark');
        }
    }, []);

    useEffect(() => {
        console.log('Theme Engine: Saving to storage...', activeTheme);
        localStorage.setItem('clinic-theme', activeTheme);
    }, [activeTheme]);

    // Theme Variables (Wellness & Spa)
    const isDark = activeTheme === 'dark';
    const bgColor = isDark ? 'bg-[#fcfdfd]' : 'bg-[#ffffff]';
    const textColor = isDark ? 'text-[#1a2b3c]' : 'text-[#0f172a]';
    const accentColor = 'text-[#78dcca]';
    const mintBorder = 'border-[#78dcca]';
    const softShadow = isDark ? 'shadow-[0_20px_60px_rgba(120,220,202,0.12)]' : 'shadow-xl';

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-xl p-4 md:p-6 transition-all duration-700">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`w-full max-w-6xl h-full max-h-[85vh] ${bgColor} rounded-[2rem] ${softShadow} flex flex-col overflow-hidden border border-white/40 ring-1 ring-black/5 transition-all duration-500`}
                    >
                        {/* Header - Compact */}
                        <div className="flex-shrink-0 px-8 py-5 flex items-center justify-between border-b border-black/[0.03]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-black/[0.03] flex items-center justify-center shadow-sm relative">
                                    <Settings className={`w-6 h-6 ${textColor}`} strokeWidth={1.2} />
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="font-inter tracking-tight">
                                    <h2 className={`text-2xl font-black ${textColor}`}>Clinic Settings</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${accentColor}`}>Executive Protocol</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 border border-black/[0.03] flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar - Compact */}
                            <div className="w-64 flex-shrink-0 border-r border-black/[0.03] p-6 flex flex-col gap-2 font-inter tracking-tight">
                                {[
                                    { id: 'menu', icon: List, label: 'Treatment Menu' },
                                    { id: 'general', icon: Globe, label: 'General Preferences' },
                                    { id: 'support', icon: User, label: 'Support & Help' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                                            activeTab === tab.id 
                                                ? 'bg-white text-[#0f172a] shadow-md border border-black/[0.02]' 
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#78dcca]' : 'text-slate-300'}`} strokeWidth={2.5} />
                                            <span className="font-bold text-sm">{tab.label}</span>
                                        </div>
                                        {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                    </button>
                                ))}
                            </div>

                            {/* Main Panel - Compact */}
                            <div className={`flex-1 overflow-y-auto p-10 custom-scrollbar ${isDark ? 'bg-[#78dcca]/5' : 'bg-white/40'} transition-all duration-500`}>
                                <div className="max-w-3xl mx-auto font-inter tracking-tight">
                                    
                                    {activeTab === 'menu' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="mb-8 p-8 bg-white border border-black/[0.03] rounded-[1.5rem] shadow-sm relative overflow-hidden group">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className={`text-xl font-black ${textColor}`}>Clinic Industry</h3>
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 mb-6">Tailor AI messaging for your specific field.</p>
                                                <div className="relative max-w-sm">
                                                    <select 
                                                        value={clinicType}
                                                        onChange={(e) => setClinicType(e.target.value as any)}
                                                        className={`w-full bg-[#f8f9fa] border border-black/[0.06] rounded-xl py-3 px-5 text-sm font-bold ${textColor} focus:outline-none focus:ring-4 focus:ring-[#78dcca]/10 focus:border-[#78dcca] transition-all appearance-none cursor-pointer`}
                                                    >
                                                        <option value="Dental">Dental Clinic</option>
                                                        <option value="Aesthetic">Aesthetic Clinic</option>
                                                        <option value="Wellness">Wellness & Spa</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#78dcca]">
                                                        <Plus className="w-4 h-4 rotate-45" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className={`text-xl font-black ${textColor}`}>Treatment Menu Builder</h3>
                                                <button onClick={() => { setEditingTemplate({ id: '', name: '', price: 0 }); setIsEditing(true); }} className="px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-lg flex items-center gap-2">
                                                    <Plus className="w-4 h-4 text-[#78dcca]" strokeWidth={3} /> Add New
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {templates.map(template => (
                                                    <div key={template.id} className="bg-white rounded-[1.5rem] border border-black/[0.03] p-6 shadow-sm hover:shadow-md transition-all">
                                                        <div className="flex justify-between mb-4">
                                                            <div>
                                                                <h4 className={`${textColor} font-black text-base truncate`}>{template.name}</h4>
                                                                <p className="text-[#78dcca] font-black text-lg">{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button onClick={() => { setEditingTemplate(template); setIsEditing(true); }} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#78dcca]"><Settings className="w-4 h-4" /></button>
                                                                <button onClick={() => setTemplates(templates.filter(t => t.id !== template.id))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t border-black/[0.03] flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Template</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                                            <h3 className={`text-2xl font-black ${textColor}`}>Branding Identity</h3>
                                            
                                            {/* Theme Toggle - image_8.png style */}
                                            <div className="p-8 bg-white border border-black/[0.03] rounded-[1.5rem] shadow-sm">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-[#78dcca]/10 flex items-center justify-center">
                                                        <Zap className="w-6 h-6 text-[#78dcca]" />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-black ${textColor}`}>Brand Aesthetics</h4>
                                                        <p className="text-sm text-slate-500">Select your preferred visual personality.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => {
                                                            console.log('Action: Switch to White');
                                                            setActiveTheme('white');
                                                        }}
                                                        className={`flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                                                            activeTheme === 'white' 
                                                                ? 'bg-[#0f172a] text-white shadow-xl' 
                                                                : 'bg-[#f8f9fa] text-slate-400'
                                                        }`}
                                                    >
                                                        Executive White
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log('Action: Switch to Wellness (Dark)');
                                                            setActiveTheme('dark');
                                                        }}
                                                        className={`flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                                                            activeTheme === 'dark' 
                                                                ? `bg-white text-[#78dcca] border-[#78dcca] shadow-lg` 
                                                                : 'bg-[#f8f9fa] text-slate-400 border-transparent'
                                                        }`}
                                                    >
                                                        Matte Dark
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Locale & Tone - Compact */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-white border border-black/[0.03] rounded-[1.5rem]">
                                                    <h4 className={`text-sm font-black ${textColor} mb-3 uppercase tracking-widest`}>Sync Locale</h4>
                                                    <select 
                                                        value={locale} 
                                                        onChange={(e) => setLocale(e.target.value)}
                                                        className="w-full bg-[#f8f9fa] border-none rounded-xl py-3 px-4 text-xs font-bold"
                                                    >
                                                        <option value="en-GB">United Kingdom (GMT)</option>
                                                        <option value="ko-KR">South Korea (KST)</option>
                                                    </select>
                                                </div>
                                                <div className="p-6 bg-white border border-black/[0.03] rounded-[1.5rem]">
                                                    <h4 className={`text-sm font-black ${textColor} mb-3 uppercase tracking-widest`}>AI Tone</h4>
                                                    <select 
                                                        value={communicationTone} 
                                                        onChange={(e) => setCommunicationTone(e.target.value as any)}
                                                        className="w-full bg-[#f8f9fa] border-none rounded-xl py-3 px-4 text-xs font-bold"
                                                    >
                                                        <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                        <option value="Refined & Professional">Refined & Professional</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                                            <div className="text-center mb-10">
                                                <h3 className={`text-3xl font-black ${textColor}`}>Wellness Concierge</h3>
                                                <p className="text-sm text-slate-500 mt-2">Dedicated care for your practice optimization.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { icon: User, label: '24/7 Concierge', desc: 'Dedicated success manager for your practice.' },
                                                    { icon: ShieldCheck, label: 'Trust Vault', desc: 'Secure encryption for patient data.' },
                                                    { icon: Zap, label: 'Insights', desc: 'Strategic marketing analytics and support.' }
                                                ].map((card, i) => (
                                                    <div key={i} className="bg-white border border-black/5 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all">
                                                        <div className="w-10 h-10 rounded-lg bg-[#78dcca]/10 flex items-center justify-center mb-4"><card.icon className="w-5 h-5 text-[#78dcca]" /></div>
                                                        <h4 className={`text-base font-black ${textColor} mb-2`}>{card.label}</h4>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-8 bg-[#0f172a] rounded-[2rem] text-center shadow-lg">
                                                <h4 className="text-xl font-black text-white mb-2">Private Strategy Session</h4>
                                                <button className="mt-4 px-8 py-3 bg-white text-[#0f172a] rounded-xl font-black text-xs uppercase tracking-widest">Book Now</button>
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
