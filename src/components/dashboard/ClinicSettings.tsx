import React, { useState } from 'react';
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
    const [theme, setTheme] = useState<'Executive White' | 'Matte Dark'>('Executive White');
    const [communicationTone, setCommunicationTone] = useState<'Warm & Empathetic' | 'Refined & Professional'>('Refined & Professional');
    const [locale, setLocale] = useState('en-GB');

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

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        if (e.target.files && e.target.files[0] && editingTemplate) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const val = event.target?.result as string;
                setEditingTemplate({
                    ...editingTemplate,
                    [type === 'before' ? 'beforeImg' : 'afterImg']: val
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-xl p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                        className="w-full max-w-6xl h-full max-h-[88vh] bg-[#f8f9fa] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/40 ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 px-10 py-8 flex items-center justify-between border-b border-black/[0.03]">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.03] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative">
                                    <Settings className="w-7 h-7 text-[#1e293b]" strokeWidth={1.2} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                                </div>
                                <div className="font-inter tracking-tight">
                                    <h2 className="text-3xl font-black text-[#0f172a] mb-1">Clinic Settings</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78dcca]">Executive Protocol</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.03] flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Sidebar (Tabs) - Image 6 Style */}
                            <div className="w-72 flex-shrink-0 border-r border-black/[0.03] p-8 flex flex-col gap-3 font-inter tracking-tight">
                                <button 
                                    onClick={() => setActiveTab('menu')}
                                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                                        activeTab === 'menu' 
                                            ? 'bg-white text-[#0f172a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <List className={`w-5 h-5 ${activeTab === 'menu' ? 'text-[#78dcca]' : 'text-slate-300'}`} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
                                        <span className="font-bold text-base">Treatment Menu</span>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${activeTab === 'menu' ? 'bg-red-500' : 'bg-transparent'}`} />
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab('general')}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                                        activeTab === 'general' 
                                            ? 'bg-white text-[#0f172a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <Globe className={`w-5 h-5 ${activeTab === 'general' ? 'text-[#78dcca]' : 'text-slate-300'}`} strokeWidth={activeTab === 'general' ? 2.5 : 2} />
                                    <span className="font-bold text-base">General Preferences</span>
                                </button>

                                <button 
                                    onClick={() => setActiveTab('support')}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                                        activeTab === 'support' 
                                            ? 'bg-white text-[#0f172a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <User className={`w-5 h-5 ${activeTab === 'support' ? 'text-[#78dcca]' : 'text-slate-300'}`} strokeWidth={activeTab === 'support' ? 2.5 : 2} />
                                    <span className="font-bold text-base">Support & Help</span>
                                </button>
                            </div>

                            {/* Main Configuration Panel */}
                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white/20">
                                <div className="max-w-4xl mx-auto font-inter tracking-tight">
                                    
                                    {activeTab === 'menu' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="mb-12 p-10 bg-white border border-black/[0.03] rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                                    <Briefcase className="w-32 h-32 text-slate-900" />
                                                </div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-black text-[#0f172a]">Clinic Industry</h3>
                                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                </div>
                                                <p className="text-base font-medium text-slate-500 mb-8 max-w-xl">Tailor the AI messaging and default templates for your specific field.</p>
                                                <div className="relative max-w-sm group">
                                                    <select 
                                                        value={clinicType}
                                                        onChange={(e) => setClinicType(e.target.value as any)}
                                                        className="w-full bg-white border border-black/[0.06] rounded-2xl py-4 px-6 text-base font-bold text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-[#78dcca]/10 focus:border-[#78dcca] transition-all appearance-none cursor-pointer shadow-sm"
                                                    >
                                                        <option value="Dental">Dental Clinic</option>
                                                        <option value="Aesthetic">Aesthetic Clinic</option>
                                                        <option value="Wellness">Wellness & Spa</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#78dcca]">
                                                        <Plus className="w-5 h-5 rotate-45" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-10">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-2xl font-black text-[#0f172a]">Treatment Menu Builder</h3>
                                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                    </div>
                                                    <p className="text-base font-medium text-slate-500">Configure standard offerings and premium visuals.</p>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setEditingTemplate({ id: '', name: '', price: 0, emailContents: '', bookingUrl: '' });
                                                        setIsEditing(true);
                                                    }}
                                                    className="px-8 py-4 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-full text-sm font-black tracking-[0.1em] uppercase transition-all active:scale-[0.98] shadow-xl hover:shadow-[#0f172a]/20 flex items-center gap-3"
                                                >
                                                    <Plus className="w-5 h-5 text-[#78dcca]" strokeWidth={3} /> Add New Treatment
                                                </button>
                                            </div>

                                            {/* Cards Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {templates.map(template => (
                                                    <div key={template.id} className="group bg-white rounded-[2rem] border border-black/[0.03] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-[#78dcca]/40 transition-all duration-500 p-8 relative overflow-hidden flex flex-col h-full ring-1 ring-black/[0.01]">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="flex-1">
                                                                <h4 className="text-[#0f172a] font-black text-lg truncate mb-1 pr-8">{template.name}</h4>
                                                                <p className="text-[#78dcca] font-black text-xl tracking-tight">{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6 translate-y-2 group-hover:translate-y-0">
                                                                <button 
                                                                    onClick={() => { setEditingTemplate(template); setIsEditing(true); }}
                                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#78dcca] bg-slate-50 hover:bg-[#78dcca]/5 rounded-xl transition-all"
                                                                >
                                                                    <Settings className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-black/[0.03]">
                                                            <div className="flex -space-x-3">
                                                                {[template.beforeImg, template.afterImg].map((img, i) => (
                                                                    <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center shadow-sm overflow-hidden ring-1 ring-black/5">
                                                                        {img ? <img src={img} className="w-full h-full object-cover" /> : <Camera className="w-4 h-4 text-slate-300" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ready</span>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                <button 
                                                    onClick={() => { setEditingTemplate({ id: '', name: '', price: 0, emailContents: '', bookingUrl: '' }); setIsEditing(true); }}
                                                    className="bg-white/50 hover:bg-white border-2 border-dashed border-black/[0.05] rounded-[2rem] flex flex-col items-center justify-center p-10 transition-all group min-h-[180px] hover:border-[#78dcca]/40 hover:shadow-xl"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-black/[0.02] flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                                                        <Plus className="w-6 h-6 text-[#78dcca]" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Add Treatment</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-3xl font-black text-[#0f172a]">Branding Identity Suite</h3>
                                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            </div>

                                            <div className="grid grid-cols-1 gap-10">
                                                {/* Locale */}
                                                <div className="p-10 bg-white border border-black/[0.03] rounded-[2.5rem] shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all">
                                                    <div className="flex items-start gap-6 mb-10">
                                                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#78dcca]/5 border border-[#78dcca]/10 flex items-center justify-center shadow-inner">
                                                            <Globe className="w-8 h-8 text-[#78dcca]" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-black text-[#0f172a] mb-2">Global Synchronisation & Locale</h4>
                                                            <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                                Align your practice with the global standard. Seamlessly synchronise your operational timezone and bespoke language preferences for international clientele.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative max-w-sm">
                                                        <select 
                                                            value={locale}
                                                            onChange={(e) => setLocale(e.target.value)}
                                                            className="w-full bg-[#f8f9fa] border border-black/[0.04] rounded-2xl py-[1.125rem] px-6 text-base font-bold text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-[#78dcca]/10 focus:border-[#78dcca] transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="en-GB">English (United Kingdom) - GMT</option>
                                                            <option value="en-US">English (United States) - EST</option>
                                                            <option value="ko-KR">Korean (South Korea) - KST</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#78dcca]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#78dcca]" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Theme - Image 8 Style */}
                                                <div className="p-10 bg-white border border-black/[0.03] rounded-[2.5rem] shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all">
                                                    <div className="flex items-start gap-6 mb-10">
                                                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#78dcca]/5 border border-[#78dcca]/10 flex items-center justify-center shadow-inner">
                                                            <Zap className="w-8 h-8 text-[#78dcca]" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-black text-[#0f172a] mb-2">Brand Aesthetics & Interface</h4>
                                                            <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                                Select the visual palette that best reflects your clinic's atmosphere. Choose between our light 'Executive White' or modern 'Matte Dark' modes.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setTheme('Executive White')}
                                                            className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                                                                theme === 'Executive White' 
                                                                    ? 'bg-[#0f172a] text-white shadow-2xl' 
                                                                    : 'bg-[#f8f9fa] text-slate-400'
                                                            }`}
                                                        >
                                                            Executive White
                                                        </button>
                                                        <button
                                                            onClick={() => setTheme('Matte Dark')}
                                                            className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 border-2 ${
                                                                theme === 'Matte Dark' 
                                                                    ? 'bg-white text-[#78dcca] border-[#78dcca] shadow-lg' 
                                                                    : 'bg-[#f8f9fa] text-slate-400 border-transparent'
                                                            }`}
                                                        >
                                                            Matte Dark
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tone */}
                                                <div className="p-10 bg-white border border-black/[0.03] rounded-[2.5rem] shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all">
                                                    <div className="flex items-start gap-6 mb-10">
                                                        <div className="w-16 h-16 rounded-[1.5rem] bg-[#78dcca]/5 border border-[#78dcca]/10 flex items-center justify-center shadow-inner">
                                                            <MessageSquare className="w-8 h-8 text-[#78dcca]" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-black text-[#0f172a] mb-2">Patient Communication Tone</h4>
                                                            <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                                Define how our AI agents interact with your leads. From warm hospitality to refined clinical excellence, ensure every message feels authentic.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative max-w-sm">
                                                        <select 
                                                            value={communicationTone}
                                                            onChange={(e) => setCommunicationTone(e.target.value as any)}
                                                            className="w-full bg-[#f8f9fa] border border-black/[0.04] rounded-2xl py-[1.125rem] px-6 text-base font-bold text-[#0f172a] focus:outline-none focus:ring-4 focus:ring-[#78dcca]/10 focus:border-[#78dcca] transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                            <option value="Refined & Professional">Refined & Professional</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#78dcca]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#78dcca]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-10">
                                            <div className="text-center max-w-2xl mx-auto mb-16">
                                                <div className="flex items-center justify-center gap-4 mb-4">
                                                    <h3 className="text-4xl font-black text-[#0f172a] tracking-tight">Executive Wellness Concierge</h3>
                                                </div>
                                                <p className="text-lg text-slate-500 font-medium">Experience an unparalleled level of dedicated care and practice optimization.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {/* Card A: Concierge */}
                                                <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                                        <User className="w-24 h-24 text-[#0f172a]" />
                                                    </div>
                                                    <div className="w-14 h-14 rounded-2xl bg-[#78dcca]/10 flex items-center justify-center mb-8 shadow-inner ring-1 ring-[#78dcca]/20">
                                                        <User className="w-7 h-7 text-[#78dcca]" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-[#0f172a] mb-5">24/7 Executive Concierge</h4>
                                                    <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                        Experience uninterrupted peace of mind. Your dedicated success manager is available 24/7 to ensure your practice runs flawlessly, allowing you to focus entirely on premium patient care.
                                                    </p>
                                                </div>

                                                {/* Card B: Trust Vault */}
                                                <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                                        <ShieldCheck className="w-24 h-24 text-[#0f172a]" />
                                                    </div>
                                                    <div className="w-14 h-14 rounded-2xl bg-[#78dcca]/10 flex items-center justify-center mb-8 shadow-inner ring-1 ring-[#78dcca]/20">
                                                        <ShieldCheck className="w-7 h-7 text-[#78dcca]" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-[#0f172a] mb-5">Trust & Compliance Vault</h4>
                                                    <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                        Bank-grade encryption meets healthcare excellence. Your patient data is shielded within an isolated, zero-retention digital vault, ensuring total privacy.
                                                    </p>
                                                </div>

                                                {/* Card C: Strategic Partnership */}
                                                <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                                        <Zap className="w-24 h-24 text-[#0f172a]" />
                                                    </div>
                                                    <div className="w-14 h-14 rounded-2xl bg-[#78dcca]/10 flex items-center justify-center mb-8 shadow-inner ring-1 ring-[#78dcca]/20">
                                                        <Zap className="w-7 h-7 text-[#78dcca]" strokeWidth={2.5} />
                                                    </div>
                                                    <h4 className="text-xl font-black text-[#0f172a] mb-5">Strategic Partnership & Insights</h4>
                                                    <p className="text-base text-slate-500 leading-relaxed font-medium">
                                                        Shape the future of your software. Access bespoke marketing insights or book a private strategy session with our lead architects.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-12 bg-[#0f172a] rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#78dcca]/10 to-transparent group-hover:scale-110 transition-transform duration-1000" />
                                                <div className="relative z-10">
                                                    <h4 className="text-3xl font-black text-white mb-3 tracking-tight">Request Private Induction</h4>
                                                    <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto font-medium">Deepen your expertise with a 1-on-1 walkthrough of our advanced analytics engine.</p>
                                                    <button className="px-12 py-5 bg-white text-[#0f172a] rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Book Strategy Session</button>
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
