import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
    GripVertical, Plus, Trash2, Check,
    Palette, Save, AlertCircle, Sparkles,
    ArrowRight
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

export const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({ clinicId }) => {
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
        }
    };

    const handleUpdateTreatment = async (id: string, updates: Partial<Treatment>) => {
        // Optimistic Update
        setTreatments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        const { error } = await supabase
            .from('clinic_treatments')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating treatment:', error);
            setError('Failed to update treatment');
            fetchTreatments(); // Rollback
        }
    };

    const handleDeleteTreatment = async (id: string) => {
        // Optimistic Update
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
        }
    };

    const handleReorder = async (newOrder: Treatment[]) => {
        setTreatments(newOrder);

        // Update indices in DB
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
        }
    };

    if (loading) return <div className="p-10 text-white/20 uppercase font-black tracking-widest text-xs animate-pulse">Initializing UI Engine...</div>;

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight mb-2 flex items-center gap-3">
                        Treatment Logic <Sparkles className="w-6 h-6 text-blue-400" />
                    </h2>
                    <p className="text-white/40 text-sm font-medium">Define your clinical offerings, custom color coding, and visual sorting logic.</p>
                </div>
                <button
                    onClick={handleAddTreatment}
                    className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Treatment
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <Reorder.Group axis="y" values={treatments} onReorder={handleReorder} className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {treatments.map((treatment) => (
                        <Reorder.Item
                            key={treatment.id}
                            value={treatment}
                            initial={{ height: 0, opacity: 0, y: 10 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ x: 100, opacity: 0 }}
                            whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-[#1E1E1E] border border-white/[0.03] rounded-3xl p-5 group flex items-center gap-6 cursor-default"
                        >
                            <div className="cursor-grab active:cursor-grabbing p-2 text-white/10 hover:text-white/30 transition-colors">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1 flex items-center gap-4">
                                <div
                                    className="w-4 h-12 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                                    style={{ backgroundColor: treatment.color }}
                                />
                                <input
                                    type="text"
                                    value={treatment.service_name}
                                    onChange={(e) => handleUpdateTreatment(treatment.id, { service_name: e.target.value })}
                                    className="bg-transparent border-none text-white font-bold text-lg focus:ring-0 w-full placeholder:text-white/10"
                                    placeholder="Treatment Name"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                                    {CURATED_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleUpdateTreatment(treatment.id, { color })}
                                            className={`w-6 h-6 rounded-full transition-all hover:scale-125 mx-1 border-2 ${treatment.color === color ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleDeleteTreatment(treatment.id)}
                                    className="p-3 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {treatments.length === 0 && !loading && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                    <Palette className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-xs">No treatments defined</p>
                </div>
            )}
        </div>
    );
};
