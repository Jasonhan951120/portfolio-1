import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import {
    GripVertical, Plus, Trash2, Check,
    Palette, Save, AlertCircle, Sparkles,
    ArrowRight, RefreshCw, Camera, Loader2, Stethoscope
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Treatment {
    id: string;
    clinic_id: string;
    service_name: string;
    color: string;
    order_index: number;
    image_url?: string;
    potential_revenue?: number;
    marketing_copy?: string;
}

// ── Premium Toast Notification (Clinical Luxury) ─────────────────────────
interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] flex items-center gap-3 px-6 py-4 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
            <div className={`p-2 rounded-xl ${type === 'success' ? 'bg-[#00FFA3]/20 text-[#00FFA3]' : 'bg-[#FF3B30]/20 text-[#FF3B30]'}`}>
                {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
            <p className="text-[13px] font-medium text-white/90 tracking-tight">{message}</p>
            <button onClick={onClose} className="ml-4 text-white/40 hover:text-white/70 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-0.5 ${type === 'success' ? 'bg-[#00FFA3]' : 'bg-[#FF3B30]'}`}
            />
        </motion.div>
    );
};

interface TreatmentSettingsProps {
    clinicId: string;
    onUpdate?: () => void;
}

const CURATED_COLORS = [
    '#2AF598', // Electric Mint
    '#00D2FF', // Neon Blue
    '#87A96B', // Sage Green
    '#C084FC', // Purple Neon
    '#FF6B6B', // Coral
    '#F4D03F', // Gold
    '#60A5FA', // Soft Blue
    '#22D3EE', // Cyan
    '#FB923C', // Orange
    '#F472B6', // Pink
];

export const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({ clinicId, onUpdate }) => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTreatmentForm, setNewTreatmentForm] = useState({
        service_name: '',
        potential_revenue: 1000,
        marketing_copy: '',
        color: CURATED_COLORS[0]
    });

    useEffect(() => {
        fetchTreatments();
    }, [clinicId]);

    const fetchTreatments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('clinic_treatments')
            .select('*')
            .eq('clinic_id', clinicId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching treatments:', error);
            setError('Failed to load treatments');
        } else {
            setTreatments(data || []);
        }
        setLoading(false);
    };

    const handleAddTreatment = () => {
        setNewTreatmentForm({
            service_name: '',
            potential_revenue: 1000,
            marketing_copy: '',
            color: CURATED_COLORS[Math.floor(Math.random() * CURATED_COLORS.length)]
        });
        setIsModalOpen(true);
    };

    const handleConfirmAdd = async () => {
        if (!newTreatmentForm.service_name.trim()) {
            setToast({ message: "Procedure Name is required.", type: 'error' });
            return;
        }

        setSaving(true);
        try {
            if (!clinicId || clinicId === "default-clinic") throw new Error("Invalid Clinic ID");

            // Unique Name Generation
            let uniqueName = newTreatmentForm.service_name;
            let index = 1;
            while (treatments.some(t => t.service_name.toLowerCase() === uniqueName.toLowerCase())) {
                uniqueName = `${newTreatmentForm.service_name} ${index++}`;
            }

            const newTreatment = {
                clinic_id: clinicId,
                service_name: uniqueName,
                color: newTreatmentForm.color,
                potential_revenue: newTreatmentForm.potential_revenue,
                marketing_copy: newTreatmentForm.marketing_copy,
                order_index: treatments.length,
            };

            const { data, error: insertError } = await supabase
                .from('clinic_treatments')
                .insert([newTreatment])
                .select()
                .single();

            if (insertError) throw insertError;

            if (data) {
                setTreatments(prev => [...prev, data]);
                setToast({ message: "Asset Synchronized successfully.", type: 'success' });
                setIsModalOpen(false);
                onUpdate?.();
            }
        } catch (err: any) {
            console.error('[TREATMENT LOGIC] Runtime Exception:', err);
            setToast({ message: `Sync Failed: ${err.message}`, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateTreatment = async (id: string, updates: Partial<Treatment>) => {
        setTreatments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        const { error } = await supabase
            .from('clinic_treatments')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating treatment:', error);
            setError('Failed to update treatment');
            fetchTreatments(); // Rollback
        } else {
            onUpdate?.();
        }
    };

    const handleImageUpload = async (treatmentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset input so the same file can be selected again if needed
        event.target.value = '';

        setIsUploading(prev => ({ ...prev, [treatmentId]: true }));
        setError(null);

        try {
            // Validate file (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("Image size must be less than 5MB.");
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${treatmentId}_${Date.now()}.${fileExt}`;
            const filePath = `${clinicId}/${fileName}`;

            // 1. Upload the image directly to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('treatment-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw new Error(uploadError.message || "Failed to upload image.");
            }

            // 2. Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('treatment-images')
                .getPublicUrl(filePath);

            // 3. Update the database and local state
            await handleUpdateTreatment(treatmentId, { image_url: publicUrl });

        } catch (err: any) {
            console.error('[IMAGE UPLOAD] Error:', err);
            setError(`Upload failed: ${err.message}`);
        } finally {
            setIsUploading(prev => ({ ...prev, [treatmentId]: false }));
        }
    };

    const handleDeleteTreatment = async (id: string) => {
        const itemToDelete = treatments.find(t => t.id === id);
        setTreatments(prev => prev.filter(t => t.id !== id));

        const { error } = await supabase
            .from('clinic_treatments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting treatment:', error);
            setError('Failed to delete treatment');
            if (itemToDelete) setTreatments(prev => [...prev, itemToDelete].sort((a, b) => a.order_index - b.order_index));
        } else {
            onUpdate?.();
        }
    };

    const handleReorder = async (newOrder: Treatment[]) => {
        setTreatments(newOrder);

        const updates = newOrder.map((t, idx) => ({
            id: t.id,
            clinic_id: clinicId,
            service_name: t.service_name,
            order_index: idx
        }));

        const { error } = await supabase
            .from('clinic_treatments')
            .upsert(updates);

        if (error) {
            console.error('Error reordering treatments:', error);
        } else {
            onUpdate?.();
        }
    };

    if (loading) return <div className="p-10 metric-label text-[10px] text-gray-400 animate-pulse">Initializing Treatment Engine...</div>;

    return (
        <div className="space-y-10 max-w-4xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        Treatment Logic
                    </h2>
                    <p className="text-gray-500 text-[13px] mt-1">Define clinical offerings, color coding, and visual priority.</p>
                </div>
                <button
                    onClick={handleAddTreatment}
                    className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0055FF] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(0,122,255,0.4)] active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Regional Treatment Offering
                </button>
            </div>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <Reorder.Group axis="y" values={treatments} onReorder={handleReorder} className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {treatments.map((treatment) => (
                        <Reorder.Item
                            key={treatment.id}
                            value={treatment}
                            initial={{ height: 0, opacity: 0, y: 10 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ x: 100, opacity: 0 }}
                            whileDrag={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white border border-gray-100 rounded-[28px] p-6 group flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-gray-500 transition-colors">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1 flex items-center gap-6">
                                <div
                                    className="w-1.5 h-10 rounded-full shrink-0"
                                    style={{ backgroundColor: treatment.color }}
                                />

                                {/* Image Placeholder / Uploader */}
                                <div className="relative group shrink-0">
                                    <label className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all cursor-pointer border ${treatment.image_url
                                        ? 'border-gray-100 bg-gray-50 shadow-sm'
                                        : 'border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(treatment.id, e)}
                                            disabled={isUploading[treatment.id]}
                                        />

                                        {treatment.image_url ? (
                                            <motion.img
                                                src={treatment.image_url}
                                                alt={treatment.service_name}
                                                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ background: 'linear-gradient(135deg, #2c3e50, #4ca1af)' }}
                                            >
                                                <Stethoscope className="text-white opacity-40 w-8 h-8" strokeWidth={1.5} />
                                            </div>
                                        )}

                                        {/* Loading Overlay */}
                                        {isUploading[treatment.id] && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm z-10 transition-all">
                                                <Loader2 className="w-5 h-5 text-gray-800 animate-spin" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        {!isUploading[treatment.id] && treatment.image_url && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0">
                                                <Camera className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    value={treatment.service_name}
                                    onChange={(e) => handleUpdateTreatment(treatment.id, { service_name: e.target.value })}
                                    className="bg-transparent border-none text-gray-900 font-bold text-lg focus:ring-0 w-full placeholder:text-gray-200"
                                    placeholder="Procedure Name"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    {CURATED_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleUpdateTreatment(treatment.id, { color })}
                                            className={`w-6 h-6 rounded-full transition-all hover:scale-125 mx-1 border-2 ${treatment.color === color ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleDeleteTreatment(treatment.id)}
                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {treatments.length === 0 && !loading && (
                <div className="py-24 text-center border border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
                    <Palette className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <p className="metric-label text-[10px] text-gray-400">No clinical treatments defined</p>
                </div>
            )}

            {/* Sales Engine Upgrade: Add Treatment Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/5 blur-[60px] rounded-full -mr-16 -mt-16" />

                            <div className="mb-10">
                                <h3 className="text-2xl font-display font-bold text-gray-900 uppercase tracking-tight">Sales Engine Upgrade</h3>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Configure New Clinical Offering</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Procedure Name</label>
                                    <input
                                        type="text"
                                        value={newTreatmentForm.service_name}
                                        onChange={(e) => setNewTreatmentForm(prev => ({ ...prev, service_name: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                        placeholder="e.g. Implant Discovery"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Expected Patient Value (£)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">£</span>
                                            <input
                                                type="number"
                                                value={newTreatmentForm.potential_revenue}
                                                onChange={(e) => setNewTreatmentForm(prev => ({ ...prev, potential_revenue: parseInt(e.target.value) }))}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Brand Accent</label>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {CURATED_COLORS.slice(0, 5).map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setNewTreatmentForm(prev => ({ ...prev, color }))}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all ${newTreatmentForm.color === color ? 'border-[#007AFF] scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Marketing Hook (Sales Trigger)</label>
                                    <textarea
                                        value={newTreatmentForm.marketing_copy}
                                        onChange={(e) => setNewTreatmentForm(prev => ({ ...prev, marketing_copy: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold min-h-[100px] placeholder:text-gray-300 focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                        placeholder="e.g. Transform your smile in 1 day with our robotic guided precision..."
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmAdd}
                                        disabled={saving}
                                        className="flex-2 py-5 bg-[#007AFF] hover:bg-[#0055FF] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(0,122,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Synchronize Asset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
