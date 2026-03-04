import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Building, ArrowRight, Loader2, Sparkles, Instagram, Globe, Link2, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminOnboarding() {
    const navigate = useNavigate();
    const { profile, refreshProfile } = useAuth();
    const [clinicName, setClinicName] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [createdClinicId, setCreatedClinicId] = useState<string | null>(null);

    const handleCreateClinic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinicName || !profile) return;

        setLoading(true);
        try {
            const { data: clinic, error: clinicError } = await supabase
                .from('clinics')
                .insert([{ name: clinicName }])
                .select()
                .single();

            if (clinicError) throw new Error(clinicError.message);

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ clinic_id: clinic.id, role: 'admin' })
                .eq('id', profile.id);

            if (profileError) throw new Error(profileError.message);

            await refreshProfile();
            setCreatedClinicId(clinic.id);
            setStep(2);
        } catch (error: any) {
            alert(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const META_APP_ID = import.meta.env.VITE_META_APP_ID;
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const metaOAuthUrl = META_APP_ID && createdClinicId
        ? `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(`${SUPABASE_URL}/functions/v1/meta-oauth-callback`)}&state=${createdClinicId}&scope=ads_read,ads_management`
        : null;

    const googleOAuthUrl = GOOGLE_CLIENT_ID && createdClinicId
        ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${SUPABASE_URL}/functions/v1/google-oauth-callback`)}&state=${createdClinicId}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords.readonly&access_type=offline&prompt=consent`
        : null;

    const visitLink = createdClinicId ? `${window.location.origin}/visit/${createdClinicId}` : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-12 rounded-[48px] shadow-2xl relative z-10"
                >
                    {step === 1 ? (
                        <>
                            <div className="w-20 h-20 bg-blue-400/20 rounded-3xl flex items-center justify-center mb-10 border border-blue-400/30">
                                <Building className="w-10 h-10 text-blue-400" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-400/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-400/20">
                                    Step 1: Clinic Identity
                                </span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">Setup Your Portal</h1>
                            <p className="text-white/40 text-lg font-medium mb-12 leading-relaxed">
                                Enter the name of your practice to initialize your secure clinical dashboard.
                            </p>

                            <form onSubmit={handleCreateClinic} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Hospital / Clinic Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={clinicName}
                                        onChange={(e) => setClinicName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 px-8 text-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium placeholder:text-white/10"
                                        placeholder="e.g. London Smile Hospital"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !clinicName}
                                    className="w-full group bg-white hover:bg-blue-400 hover:text-white text-black font-bold py-6 px-8 rounded-[24px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <><span className="text-sm uppercase tracking-widest font-black">Continue Setup</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-purple-400/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-400/20">
                                    Step 2: Marketing Integration
                                </span>
                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">Growth Acceleration</h1>
                            <p className="text-white/40 text-lg font-medium mb-10 leading-relaxed">
                                Connect your ad accounts to enable real-time tracking and patient acquisition analytics.
                            </p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] group">
                                        <Instagram className="w-8 h-8 text-blue-400 mb-4" />
                                        <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Meta Ads</h3>
                                        <p className="text-white/40 text-[11px] mb-6">Sync FB & Instagram spend</p>
                                        <button
                                            onClick={() => metaOAuthUrl && (window.location.href = metaOAuthUrl)}
                                            className="w-full py-3 bg-white/10 hover:bg-blue-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                                        >
                                            {META_APP_ID ? 'Connect Meta' : 'Config Required'}
                                        </button>
                                    </div>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] group">
                                        <Globe className="w-8 h-8 text-green-400 mb-4" />
                                        <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Google Ads</h3>
                                        <p className="text-white/40 text-[11px] mb-6">Track Search performance</p>
                                        <button
                                            onClick={() => googleOAuthUrl && (window.location.href = googleOAuthUrl)}
                                            className="w-full py-3 bg-white/10 hover:bg-green-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                                        >
                                            {GOOGLE_CLIENT_ID ? 'Connect Google' : 'Config Required'}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 text-center">Your Anonymous Tracking Link</p>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={`${visitLink}?utm_source=instagram`}
                                            className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-mono text-blue-400 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${visitLink}?utm_source=instagram`);
                                                alert("Link copied!");
                                            }}
                                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/admin")}
                                    className="w-full bg-white text-black font-black py-6 rounded-[24px] uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all shadow-2xl"
                                >
                                    Finish & Go to Dashboard
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
