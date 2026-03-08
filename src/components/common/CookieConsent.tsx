import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const CookieConsent: React.FC = () => {
    const { consentStatus, acceptAll, acceptEssential } = useAnalytics();

    if (consentStatus !== 'undecided') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl"
            >
                <div className="bg-[#1A1A1A] backdrop-blur-xl border border-white/5 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Subtle aesthetic gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#87A96B]/5 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                            <ShieldCheck className="w-6 h-6 text-[#87A96B]" strokeWidth={1.5} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5 font-display">Privacy & Experience</h3>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                We use GA4 and Hotjar to refine our clinical workflows and ensure a premium experience.
                                By accepting, you help us optimise the Hanlan OC ecosystem for specialists.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={acceptEssential}
                                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-white/5"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-7 py-3 rounded-xl bg-[#87A96B] hover:bg-[#97B97B] text-white text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-[0_8px_20px_rgba(135,169,107,0.2)] hover:-translate-y-0.5"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
