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
                        className="fixed inset-0 z-[6000] bg-slate-900/20 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full max-w-[500px] bg-white shadow-2xl z-[6001] flex flex-col rounded-l-3xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-[#2c3e50] text-3xl font-bold tracking-tight mb-1">
                                    {formData?.service_name}
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">From</span>
                                    <span className="tabular-nums font-black text-3xl tracking-tighter text-slate-900">
                                        £{formData?.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                aria-label="Close drawer"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                            {/* Asset Image HERO */}
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8 shadow-inner bg-slate-50">
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
                                        style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
                                    >
                                        <Stethoscope strokeWidth={1.5} className="text-slate-400 opacity-30 w-16 h-16" />
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Clinical Asset Pending</span>
                                    </div>
                                )}
                            </div>

                            {/* Editing Form */}
                            <div className="space-y-8 pb-32">
                                {/* Marketing Hook */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <Sparkles className="w-3 h-3" /> Marketing Hook (Benefit)
                                    </label>
                                    <textarea
                                        value={formData?.benefit_text || ''}
                                        onChange={(e) => setFormData(f => f ? { ...f, benefit_text: e.target.value } : null)}
                                        placeholder="E.g., Transform your smile with robotic precision..."
                                        className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <Info className="w-3 h-3" /> Clinical Description
                                    </label>
                                    <textarea
                                        value={formData?.description || ''}
                                        onChange={(e) => setFormData(f => f ? { ...f, description: e.target.value } : null)}
                                        placeholder="Detailed clinical explanation of the treatment..."
                                        className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Pricing Helper (Read Only in this view for aesthetic) */}
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value-Driven Pricing</p>
                                        <p className="text-sm font-semibold text-slate-600">Base Price: £{formData?.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full group relative overflow-hidden bg-[#2c3e50] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#4ca1af] disabled:opacity-50"
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
                                    {isSaving ? 'Syncing...' : 'Confirm Changes'}
                                </div>

                                {/* Neon Glow Hover Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-400/20 to-emerald-400/20 blur-xl" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
