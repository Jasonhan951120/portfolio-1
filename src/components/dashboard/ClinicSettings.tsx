import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Camera, UploadCloud, Settings, List, HelpCircle, Save, Check } from 'lucide-react';
import { SERVICE_CONVERSION_VALUES } from '../../lib/constants';

interface ClinicSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    currency?: string;
}

interface TreatmentTemplate {
    id: string;
    name: string;
    price: number;
    description?: string;
    beforeImg?: string;
    afterImg?: string;
    bookingUrl?: string;
    messageTemplates?: string[];
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
    const [isEditing, setIsEditing] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TreatmentTemplate | null>(null);

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
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm border border-slate-100 shadow-sm transition-all">
                                    <List className="w-4 h-4 text-emerald-500" />
                                    Treatment Menu
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm transition-all opacity-50 cursor-not-allowed">
                                    <Settings className="w-4 h-4" />
                                    General Preferences
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm transition-all opacity-50 cursor-not-allowed">
                                    <HelpCircle className="w-4 h-4" />
                                    Support & Help
                                </button>
                            </div>

                            {/* Main Configuration Panel */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="max-w-4xl mx-auto">
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Treatment Menu Builder</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1">Configure standard offerings, default pricing, and premium visual assets.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setEditingTemplate({ id: '', name: '', price: 0, description: '', bookingUrl: '', messageTemplates: [] });
                                                setIsEditing(true);
                                            }}
                                            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold tracking-wide transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add New Treatment
                                        </button>
                                    </div>

                                    {/* Edit form drawer / section */}
                                    <AnimatePresence>
                                        {isEditing && editingTemplate && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 bg-white border border-emerald-500/20 rounded-3xl shadow-xl space-y-6 relative">
                                                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 left-0 rounded-t-3xl opacity-50" />
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                                            {editingTemplate.id ? 'Edit Treatment' : 'New Treatment'}
                                                        </h4>
                                                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Treatment Name</label>
                                                                    <input 
                                                                        type="text" 
                                                                        value={editingTemplate.name}
                                                                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                                                        placeholder="e.g. Premium Implants"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Default Price</label>
                                                                    <div className="relative">
                                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                                                                        <input 
                                                                            type="number" 
                                                                            value={editingTemplate.price || ''}
                                                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, price: Number(e.target.value) })}
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                                                            placeholder="8500"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Default Booking URL (Optional)</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={editingTemplate.bookingUrl || ''}
                                                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, bookingUrl: e.target.value })}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                                                    placeholder="https://booking.clinic.com/implants"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Master Treatment Description</label>
                                                                <textarea 
                                                                    value={editingTemplate.description || ''}
                                                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none h-24"
                                                                    placeholder="Enter a detailed, patient-friendly explanation..."
                                                                />
                                                            </div>

                                                            {/* Message Templates Section */}
                                                            <div>
                                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                                    Message Templates
                                                                    <span className="text-[9px] lowercase italic font-medium normal-case">Use {"{PatientName}"} for auto-name</span>
                                                                </label>
                                                                <div className="space-y-3">
                                                                    {(editingTemplate.messageTemplates || []).map((tmpl, idx) => (
                                                                        <div key={idx} className="flex gap-2">
                                                                            <input 
                                                                                type="text"
                                                                                value={tmpl}
                                                                                onChange={(e) => {
                                                                                    const newTemplates = [...(editingTemplate.messageTemplates || [])];
                                                                                    newTemplates[idx] = e.target.value;
                                                                                    setEditingTemplate({ ...editingTemplate, messageTemplates: newTemplates });
                                                                                }}
                                                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                                                                placeholder="Dear {PatientName}, thank you for visiting..."
                                                                            />
                                                                            <button 
                                                                                onClick={() => {
                                                                                    const newTemplates = (editingTemplate.messageTemplates || []).filter((_, i) => i !== idx);
                                                                                    setEditingTemplate({ ...editingTemplate, messageTemplates: newTemplates });
                                                                                }}
                                                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button 
                                                                        onClick={() => {
                                                                            const newTemplates = [...(editingTemplate.messageTemplates || []), ""];
                                                                            setEditingTemplate({ ...editingTemplate, messageTemplates: newTemplates });
                                                                        }}
                                                                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-500 transition-all"
                                                                    >
                                                                        + Add Template
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Visual Assets */}
                                                        <div>
                                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Default Visual Assets</label>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {/* Before */}
                                                                <label className="relative flex flex-col items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-400 transition-all rounded-xl p-4 text-center cursor-pointer group h-32 overflow-hidden shadow-sm">
                                                                    {editingTemplate.beforeImg ? (
                                                                        <>
                                                                            <img src={editingTemplate.beforeImg} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold shadow-md">Replace</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UploadCloud className="w-6 h-6 text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" />
                                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Before</span>
                                                                        </>
                                                                    )}
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'before')} />
                                                                </label>
                                                                {/* After */}
                                                                <label className="relative flex flex-col items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-400 transition-all rounded-xl p-4 text-center cursor-pointer group h-32 overflow-hidden shadow-sm">
                                                                    {editingTemplate.afterImg ? (
                                                                        <>
                                                                            <img src={editingTemplate.afterImg} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold shadow-md">Replace</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UploadCloud className="w-6 h-6 text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" />
                                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">After</span>
                                                                        </>
                                                                    )}
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'after')} />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                                        <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                                        <button 
                                                            onClick={handleSaveTemplate}
                                                            disabled={!editingTemplate.name}
                                                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            <Save className="w-4 h-4" /> Save Configuration
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {templates.map(template => (
                                            <div key={template.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 p-6 relative overflow-hidden flex flex-col h-full">
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
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template.beforeImg && template.afterImg ? 'Assets Ready' : 'Pending Assets'}</span>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Empty State / Add Card */}
                                        <button 
                                            onClick={() => { setEditingTemplate({ id: '', name: '', price: 0, description: '', bookingUrl: '', messageTemplates: [] }); setIsEditing(true); }}
                                            className="bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 transition-colors group min-h-[160px]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                                                <Plus className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add Treatment</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
