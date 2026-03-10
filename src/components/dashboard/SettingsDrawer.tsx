import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Save, Check, Loader2, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    clinicId: string;
    currentName: string;
    onNameUpdated: (newName: string) => void;
}

type SaveState = 'idle' | 'saving' | 'saved';

export function SettingsDrawer({ isOpen, onClose, clinicId, currentName, onNameUpdated }: SettingsDrawerProps) {
    const [clinicName, setClinicName] = useState(currentName);
    const [saveState, setSaveState] = useState<SaveState>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!clinicName.trim() || saveState !== 'idle') return;
        setError(null);
        setSaveState('saving');

        try {
            const { error: updateError } = await supabase
                .from('clinics')
                .update({ name: clinicName.trim() })
                .eq('id', clinicId);

            if (updateError) throw updateError;

            onNameUpdated(clinicName.trim());
            setSaveState('saved');
            setTimeout(() => setSaveState('idle'), 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to save. Please try again.');
            setSaveState('idle');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[500]"
                    />

                    {/* Drawer — Slide in from right */}
                    <motion.div
                        key="drawer"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-[420px] z-[600] flex flex-col"
                        style={{
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderLeft: '1px solid rgba(100, 116, 139, 0.2)',
                            boxShadow: '-32px 0 80px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-800/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg tracking-tight">Clinic Settings</h2>
                                    <p className="text-slate-400 text-[11px] font-medium tracking-widest uppercase">Practice Configuration</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 flex items-center justify-center transition-all group"
                            >
                                <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                            {/* Clinic Name Field */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    Clinic Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={clinicName}
                                        onChange={(e) => { setClinicName(e.target.value); setSaveState('idle'); setError(null); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        placeholder="e.g. Hanlan Oral Care"
                                        className="w-full px-5 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 text-sm font-medium tracking-tight transition-all duration-200 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 focus:bg-slate-800/60"
                                    />
                                    {clinicName !== currentName && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400"
                                        />
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    This name appears in your dashboard header and all patient-facing communications.
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-800/60" />

                            {/* Preview */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</p>
                                <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/40">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Header will display as:</p>
                                    <h3 className="text-2xl font-medium text-white tracking-[0.05em] uppercase">
                                        {clinicName || 'Hanlan OC'}{' '}
                                        <span className="font-light text-slate-500 lowercase tracking-normal italic">Dashboard</span>
                                    </h3>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
                                    >
                                        <p className="text-xs text-red-400 font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer — Save Button */}
                        <div className="px-8 pb-8 pt-4 border-t border-slate-800/60">
                            <button
                                onClick={handleSave}
                                disabled={saveState !== 'idle' || !clinicName.trim() || clinicName === currentName}
                                className="relative w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-bold tracking-wide text-sm overflow-hidden group"
                            >
                                {/* Shimmer on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                                <AnimatePresence mode="wait">
                                    {saveState === 'idle' && (
                                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                                            <Save className="w-4 h-4" /> Save Changes
                                        </motion.span>
                                    )}
                                    {saveState === 'saving' && (
                                        <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                        </motion.span>
                                    )}
                                    {saveState === 'saved' && (
                                        <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-emerald-900">
                                            <Check className="w-4 h-4" strokeWidth={3} /> Saved!
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
