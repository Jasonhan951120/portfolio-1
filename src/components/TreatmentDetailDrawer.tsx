import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Stethoscope, Save, Sparkles, CreditCard, Info } from 'lucide-react';

interface Treatment {
    id: string;
    service_name: string;
    description?: string;
    benefit_text?: string;
    price: number;
    image_url?: string | null;
    category?: string;
}

interface TreatmentDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    treatment: Treatment | null;
    onSave: (updatedTreatment: Treatment) => Promise<void>;
    isSaving?: boolean;
}

export const TreatmentDetailDrawer: React.FC<TreatmentDetailDrawerProps> = ({
    isOpen,
    onClose,
    treatment,
    onSave,
    isSaving = false
}) => {
    const [formData, setFormData] = useState<Treatment | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (treatment) {
            setFormData({ ...treatment });
            setImageError(false);
        }
    }, [treatment]);

    if (!treatment) return null;

    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
    };

    const hasImage = formData?.image_url && !imageError && formData.image_url !== 'null' && formData.image_url !== '';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[6000] bg-black/40 backdrop-blur-sm"
                    />
 
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white shadow-2xl z-[6001] flex flex-col rounded-l-[3rem] overflow-hidden border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start border-b border-slate-50">
                            <div className="flex-1">
                                <h2 className="text-slate-900 text-3xl font-black tracking-tight mb-1 uppercase">
                                    {formData?.service_name}
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue Impact</span>
                                    <span className="tabular-nums font-black text-3xl tracking-tighter text-emerald-500">
                                        £{formData?.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                                aria-label="Close drawer"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
 
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 custom-scrollbar py-8">
                            {/* Asset Image HERO */}
                            <div className="relative w-full h-64 rounded-[32px] overflow-hidden mb-8 ring-1 ring-slate-200 shadow-sm bg-slate-50">
                                {hasImage ? (
                                    <img
                                        src={formData?.image_url!}
                                        alt={formData?.service_name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex flex-col items-center justify-center gap-4"
                                        style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, transparent 70%)' }}
                                    >
                                        <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                            <Stethoscope strokeWidth={2} className="text-slate-300 w-8 h-8" />
                                        </div>
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Clinical Asset Pending</span>
                                    </div>
                                )}
                            </div>
 
                            {/* Editing Form */}
                            <div className="space-y-8 pb-32">
                                {/* Marketing Hook */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <Sparkles className="w-3 h-3 text-emerald-500" /> Marketing Hook
                                    </label>
                                    <textarea
                                        value={formData?.benefit_text || ''}
                                        onChange={(e) => setFormData(f => f ? { ...f, benefit_text: e.target.value } : null)}
                                        placeholder="E.g., Transform your smile with robotic precision..."
                                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                                    />
                                </div>
 
                                {/* Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <Info className="w-3 h-3 text-emerald-500" /> Clinical Details
                                    </label>
                                    <textarea
                                        value={formData?.description || ''}
                                        onChange={(e) => setFormData(f => f ? { ...f, description: e.target.value } : null)}
                                        placeholder="Detailed clinical explanation..."
                                        className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                                    />
                                </div>
 
                                {/* Pricing Helper */}
                                <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-emerald-100 flex items-center justify-center shadow-sm">
                                        <CreditCard className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Impact Analysis</p>
                                        <p className="text-sm font-black text-slate-900 uppercase">Base Price: £{formData?.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        {/* Sticky Action Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full relative overflow-hidden bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-slate-800 disabled:opacity-50 shadow-sm"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isSaving ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        >
                                            <Save className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSaving ? 'Syncing...' : 'Save Clinical Asset'}
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
