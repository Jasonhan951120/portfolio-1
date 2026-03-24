import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, UploadCloud, Settings, List, HelpCircle, Save, Globe, ShieldCheck, MessageSquare, Briefcase, Zap, Database } from 'lucide-react';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';
import { useDashboardStore } from '../../store/useDashboardStore';

const INDUSTRY_TEMPLATES = {
    Dental: {
        friendly: "Dear {PatientName}, it was a true pleasure meeting you today to discuss your smile transformation. I've prepared a bespoke plan to bring back your confident smile. We use the most advanced, gentle techniques to ensure your journey is as comfortable as it is transformative.",
        professional: "Dear {PatientName}, thank you for visiting us today. Based on our clinical assessment, I have finalized your bespoke dental treatment proposal. This plan is designed to deliver optimal long-term outcomes while prioritizing your unique dental health needs."
    },
    Aesthetic: {
        friendly: "Dear {PatientName}, we are excited to help you achieve your skin goals at {ClinicName}! I've designed a specialized plan tailored just for you to enhance your natural beauty. We can't wait to see your radiant results.",
        professional: "Dear {PatientName}, thank you for your consultation today. I have prepared a comprehensive aesthetic treatment plan tailored specifically to your unique skin profile and desired outcomes. Please review the clinical details below."
    },
    Wellness: {
        friendly: "Dear {PatientName}, it was wonderful connecting with you today. I've designed a specialized wellness plan to support your holistic journey. We are dedicated to helping you find balance, rejuvenation, and optimal vitality.",
        professional: "Dear {PatientName}, following our consultation, I have developed a bespoke wellness protocol. This comprehensive plan is meticulously designed to optimize your health outcomes and overall well-being. Please find the proposed intervention below."
    }
};

interface ClinicSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    currency?: string;
}

interface MessageTemplate {
    title: string;
    body: string;
}

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
                <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/60"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                                    <Settings className="w-6 h-6 text-slate-800" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Clinic Settings</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Executive Protocol</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 flex items-center justify-center transition-all text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex overflow-hidden bg-slate-50/50">
                            {/* Left Sidebar (Tabs) */}
                            <div className="w-64 flex-shrink-0 border-r border-slate-100 bg-white p-6 flex flex-col gap-2">
                                <button 
                                    onClick={() => setActiveTab('menu')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'menu' 
                                            ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <List className={`w-4 h-4 ${activeTab === 'menu' ? 'text-emerald-500' : ''}`} />
                                    Treatment Menu
                                </button>
                                <button 
                                    onClick={() => setActiveTab('general')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'general' 
                                            ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <Settings className={`w-4 h-4 ${activeTab === 'general' ? 'text-emerald-500' : ''}`} />
                                    General Preferences
                                </button>
                                <button 
                                    onClick={() => setActiveTab('support')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        activeTab === 'support' 
                                            ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <HelpCircle className={`w-4 h-4 ${activeTab === 'support' ? 'text-emerald-500' : ''}`} />
                                    Support & Help
                                </button>
                            </div>

                            {/* Main Configuration Panel */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="max-w-4xl mx-auto">
                                    
                                    {activeTab === 'menu' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="mb-10 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-inter">Clinic Industry</h3>
                                                <p className="text-sm font-medium text-slate-500 mt-1 mb-4">Tailor the AI messaging and default templates for your specific field.</p>
                                                <select 
                                                    value={clinicType}
                                                    onChange={(e) => setClinicType(e.target.value as 'Dental' | 'Aesthetic' | 'Wellness')}
                                                    className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="Dental">Dental Clinic</option>
                                                    <option value="Aesthetic">Aesthetic Clinic</option>
                                                    <option value="Wellness">Wellness & Spa</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight font-inter">Treatment Menu Builder</h3>
                                                    <p className="text-sm font-medium text-slate-500 mt-1">Configure standard offerings, default pricing, and premium visual assets.</p>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setEditingTemplate({ id: '', name: '', price: 0, emailContents: '', bookingUrl: '' });
                                                        setIsEditing(true);
                                                    }}
                                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold tracking-wide transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" /> Add New Treatment
                                                </button>
                                            </div>

                                            {/* (Edit form drawer and grid content remain here, wrapped in the activeTab condition) */}
                                            {/* I'll simplify the replacement by keeping the structure but wrapping it */}
                                            {/* Actually, I should just wrap the existing code block */}
                                            
                                            {/* Cards Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {templates.map(template => (
                                                    <div key={template.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 p-6 relative overflow-hidden flex flex-col h-full font-inter tracking-tight">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-slate-900 font-bold text-base truncate pr-6">{template.name}</h4>
                                                                <p className="text-emerald-600 font-black tracking-tight mt-1">{currency}{template.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-white/90 backdrop-blur pb-1 pl-1 rounded-bl-xl">
                                                                <button 
                                                                    onClick={() => { setEditingTemplate(template); setIsEditing(true); }}
                                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Settings className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100/50">
                                                            <div className="flex -space-x-2">
                                                                {template.beforeImg ? (
                                                                    <img src={template.beforeImg} className="w-8 h-8 rounded-full ring-2 ring-white object-cover shadow-sm bg-slate-100" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center shadow-sm">
                                                                        <Camera className="w-3 h-3 text-slate-300" />
                                                                    </div>
                                                                )}
                                                                {template.afterImg ? (
                                                                    <img src={template.afterImg} className="w-8 h-8 rounded-full ring-2 ring-white object-cover shadow-sm bg-slate-100" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center shadow-sm">
                                                                        <Camera className="w-3 h-3 text-slate-300" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                <button 
                                                    onClick={() => { setEditingTemplate({ id: '', name: '', price: 0, emailContents: '', bookingUrl: '' }); setIsEditing(true); }}
                                                    className="bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 transition-colors group min-h-[160px]"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                                                        <Plus className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add Treatment</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'general' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-inter">Branding Identity Suite</h3>
                                                <p className="text-sm font-medium text-slate-500 mt-1">Refine your practice's digital presence and communication style.</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-8">
                                                {/* Locale */}
                                                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                            <Globe className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight font-inter">Global Synchronisation & Locale</h4>
                                                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                                Align your practice with the global standard. Seamlessly synchronise your operational timezone and bespoke language preferences for international clientele.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <select 
                                                        value={locale}
                                                        onChange={(e) => setLocale(e.target.value)}
                                                        className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="en-GB">English (United Kingdom) - GMT</option>
                                                        <option value="en-US">English (United States) - EST</option>
                                                        <option value="ko-KR">Korean (South Korea) - KST</option>
                                                    </select>
                                                </div>

                                                {/* Theme */}
                                                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                            <Zap className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight font-inter">Brand Aesthetics & Interface</h4>
                                                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                                Select the visual palette that best reflects your clinic's atmosphere. Choose between our light 'Executive White' or modern 'Matte Dark' modes.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {['Executive White', 'Matte Dark'].map((t) => (
                                                            <button
                                                                key={t}
                                                                onClick={() => setTheme(t as any)}
                                                                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm border transition-all ${
                                                                    theme === t 
                                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                                                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tone */}
                                                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                            <MessageSquare className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight font-inter">Patient Communication Tone</h4>
                                                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                                Define how our AI agents interact with your leads. From warm hospitality to refined clinical excellence, ensure every message feels authentic.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <select 
                                                        value={communicationTone}
                                                        onChange={(e) => setCommunicationTone(e.target.value as any)}
                                                        className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="Warm & Empathetic">Warm & Empathetic</option>
                                                        <option value="Refined & Professional">Refined & Professional</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'support' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
                                            <div className="text-center max-w-2xl mx-auto mb-12">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-inter mb-4">Executive Support Lounge</h3>
                                                <p className="text-base text-slate-500 font-medium">Experience an unparalleled level of dedicated care and practice optimization.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Card A: Concierge */}
                                                <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Zap className="w-24 h-24 text-slate-900" />
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-lg">
                                                        <Zap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight font-inter mb-4">24/7 Executive Concierge</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed tracking-tight">
                                                        Experience uninterrupted peace of mind. Your dedicated success manager is available 24/7 to ensure your practice runs flawlessly, allowing you to focus entirely on premium patient care.
                                                    </p>
                                                </div>

                                                {/* Card B: Trust Vault */}
                                                <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <ShieldCheck className="w-24 h-24 text-slate-900" />
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 shadow-lg">
                                                        <ShieldCheck className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight font-inter mb-4">Trust & Compliance Vault</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed tracking-tight">
                                                        Bank-grade encryption meets healthcare excellence. Your patient data is shielded within an isolated, zero-retention digital vault, ensuring total privacy and regulatory compliance.
                                                    </p>
                                                </div>

                                                {/* Card C: Strategic Partnership */}
                                                <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all flex flex-col relative group overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Database className="w-24 h-24 text-slate-900" />
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 shadow-lg">
                                                        <Briefcase className="w-6 h-6 text-slate-900" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight font-inter mb-4">Strategic Partnership & Insights</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed tracking-tight">
                                                        Shape the future of your software. Access bespoke marketing insights or book a private strategy session with our lead architects to optimize your clinical throughput.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
                                                <div className="relative z-10">
                                                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight font-inter">Request Private Induction</h4>
                                                    <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto">Deepen your expertise with a 1-on-1 walkthrough of our advanced analytics engine.</p>
                                                    <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-black text-sm tracking-tight hover:scale-105 transition-transform">Book Strategy Session</button>
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
