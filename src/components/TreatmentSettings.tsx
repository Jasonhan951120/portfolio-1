import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import {
    GripVertical, Plus, Trash2, Check,
    Palette, Save, AlertCircle, Sparkles,
    ArrowRight, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Treatment {
    id: string;
    clinic_id: string;
    service_name: string;
    color: string;
    order_index: number;
}

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

    const handleAddTreatment = async () => {
        const newTreatment = {
            clinic_id: clinicId,
            service_name: 'New Treatment',
            color: CURATED_COLORS[0],
            order_index: treatments.length,
        };

        const { data, error } = await supabase
            .from('clinic_treatments')
            .insert([newTreatment])
            .select()
            .single();

        if (error) {
            console.error('Error adding treatment:', error);
            setError('Failed to add treatment');
        } else if (data) {
            setTreatments([...treatments, data]);
            onUpdate?.();
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
                    className="btn-primary-crisp px-6 py-3 text-xs"
                >
                    <Plus className="w-4 h-4" /> Add Treatment
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

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
                                    className="w-1.5 h-10 rounded-full"
                                    style={{ backgroundColor: treatment.color }}
                                />
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
        </div>
    );
};
