import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Copy, Check, Loader2, Send } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface RecoveryConciergeProps {
    lead: ConsultationRequest;
    potentialValue: number;
    consultationNotes?: string;
}

export function RecoveryConcierge({ lead, potentialValue, consultationNotes }: RecoveryConciergeProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Simulated AI Generation based on strict prompt boundaries
    const handleGenerate = () => {
        setIsGenerating(true);
        setGeneratedMessage(null);
        setIsSent(false);

        setTimeout(() => {
            const firstName = lead.name.split(' ')[0] || 'there';
            const serviceName = lead.service || 'treatment';

            let message = `Good morning ${firstName},\n\nThis is Eleanor, Senior Patient Concierge at Hanlan OC.\n\nI noted your interest in our ${serviceName} procedures and wanted to personally reach out. We recently had a priority consultation slot become available this week, which I have tentatively held for you.`;

            // Incorporate context if notes exist indicating a cost barrier
            if (consultationNotes?.toLowerCase().includes('cost') || consultationNotes?.toLowerCase().includes('부담') || consultationNotes?.toLowerCase().includes('비용')) {
                message += `\n\nI also understand that making an investment in your smile is a significant decision. To ensure this is completely comfortable for you, we do offer 0% financing options that allow you to spread the investment smoothly over time.`;
            } else {
                message += `\n\nI know taking the first step towards your new smile is an important decision, and my role is to ensure your entire journey is comfortable, transparent, and seamlessly tailored to your preferences.`;
            }

            message += `\n\nShall I secure this priority slot for you to discuss your options in person?`;

            setGeneratedMessage(message);
            setIsGenerating(false);
        }, 2500); // Simulate "Thinking..."
    };

    const handleCopy = () => {
        if (generatedMessage) {
            navigator.clipboard.writeText(generatedMessage);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleSend = () => {
        setIsSent(true);
        // In a real app, this would integrate with WhatsApp Business API API via Supabase Edge Function
        setTimeout(() => setIsSent(false), 3000);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">AI Concierge Recovery</h4>
                        <p className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">Revenue at Risk: £{potentialValue.toLocaleString()}</p>
                    </div>
                </div>

                {!generatedMessage && !isGenerating && (
                    <button
                        onClick={handleGenerate}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Generate Message
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-indigo-50"
                    >
                        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        <span className="text-sm text-indigo-900 font-medium">Crafting highly personalized response...</span>
                    </motion.div>
                )}

                {generatedMessage && !isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="p-4 bg-white border border-indigo-100 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative group">
                            {generatedMessage}

                            <button
                                onClick={handleCopy}
                                className="absolute top-3 right-3 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-gray-200"
                                title="Copy to clipboard"
                            >
                                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSend}
                                disabled={isSent}
                                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSent ? (
                                    <><Check className="w-4 h-4" /> Sent to WhatsApp</>
                                ) : (
                                    <><MessageCircle className="w-4 h-4" /> Send via WhatsApp</>
                                )}
                            </button>
                            <button
                                onClick={handleGenerate}
                                className="px-4 py-2.5 bg-white border border-indigo-100 hover:bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Just for the icon that was missing in import
function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );
}
