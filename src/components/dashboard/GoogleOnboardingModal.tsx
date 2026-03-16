import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle2, Globe, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

interface GoogleOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GoogleOnboardingModal: React.FC<GoogleOnboardingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'invite' | 'connecting' | 'success'>('invite');
    const setGoogleConnected = useDashboardStore(state => state.setGoogleConnected);

    const handleConnect = () => {
        // Build the Google OAuth 2.0 URL
        const clientId = 'YOUR_PLACEHOLDER_CLIENT_ID'; // Placeholder for now
        const redirectUri = encodeURIComponent('https://www.hanlanoc.com/admin');
        const scope = encodeURIComponent('email profile https://www.googleapis.com/auth/business.manage');
        const responseType = 'token';
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
        
        // Redirect the user to the official Google login page
        window.location.href = googleAuthUrl;
    };

    // Lock background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative z-[101] bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all"
                >
                    {/* Animated Background Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 animate-gradient-x" />

                    <div className="p-10">
                        {step === 'invite' && (
                            <motion.div
                                key="invite"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                                        <Globe className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                                        Unlock the Financial Value of Your Reputation.
                                    </h2>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        Sync your Google Business Profile to see how <span className="text-emerald-600 font-bold">0.1-star changes</span> impact your high-value treatment pipeline in real-time.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                        <Star className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" />
                                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Review ROI Mapping</div>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">HIPAA Secure Sync</div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button
                                        onClick={handleConnect}
                                        className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
                                    >
                                        <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        Connect Safely with Google
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="flex items-center justify-center gap-2 text-slate-400">
                                        <Lock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            Read-only access. We never store your Google password.
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'connecting' && (
                            <motion.div
                                key="connecting"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 space-y-8 text-center"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin" />
                                    <Globe className="w-12 h-12 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">Establishing Secure Handshake</h3>
                                    <p className="text-slate-400 text-sm font-medium">Verifying clinical credentials with Google API...</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 space-y-8 text-center"
                            >
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-slate-900">Sync Successful</h3>
                                    <p className="text-slate-500 font-medium italic">Redirecting to Reputation Intelligence Hub...</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
