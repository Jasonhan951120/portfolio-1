import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Settings2, Info } from 'lucide-react';

interface AutoTaggingModalProps {
    isOpen: boolean;
    platform: 'meta' | 'google' | null;
    onClose: () => void;
}

export function AutoTaggingModal({ isOpen, platform, onClose }: AutoTaggingModalProps) {
    if (!isOpen || !platform) return null;

    const isMeta = platform === 'meta';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative w-full max-w-[500px] bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                <Settings2 className="w-5 h-5 text-[#87A96B]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-gray-900">
                                    Enable Auto-tracking
                                </h3>
                                <p className="text-sm font-medium text-gray-500 capitalize">{platform} Ads Native Settings</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-4 mb-8 flex gap-3 border border-blue-100">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900 leading-relaxed font-medium">
                            API security scopes restrict programmatic URL modification.
                            To automatically sync traffic sources, simply enable auto-tagging in your Ads Manager.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 mb-8">
                        <div className="relative">
                            <div className="absolute top-4 left-[15px] bottom-[-24px] w-[2px] bg-gray-100" />

                            <div className="relative flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#87A96B] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_4px_12px_rgba(135,169,107,0.3)]">
                                    1
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-900 mb-1 tracking-tight">Open your Account Settings</h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Navigate to {isMeta ? "Business Settings > Data Sources" : "Settings > Account Settings"}.
                                    </p>
                                    <a
                                        href={isMeta ? "https://business.facebook.com/settings" : "https://ads.google.com/aw/settings/"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#B38D46] transition-colors"
                                    >
                                        Open {isMeta ? "Meta Business" : "Google Ads"}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#87A96B] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-[0_4px_12px_rgba(135,169,107,0.3)]">
                                2
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-gray-900 mb-1 tracking-tight">Toggle Auto-tagging</h4>
                                <p className="text-sm text-gray-500 font-medium">
                                    {isMeta
                                        ? "Turn on URL Parameters (utm_source={{site_source_name}})"
                                        : "Check the box next to 'Tag the URL that people click through from my ad'."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold tracking-tight transition-all active:scale-[0.98]"
                    >
                        I've enabled it
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
