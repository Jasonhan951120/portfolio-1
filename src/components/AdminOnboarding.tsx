import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Building, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function AdminOnboarding() {
    const navigate = useNavigate();
    const { session, profile, refreshProfile, signOut: authSignOut } = useAuth();
    const [clinicName, setClinicName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateClinic = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleCreateClinic triggered", { clinicName, profileId: profile?.id });

        if (!clinicName) {
            alert("Please enter a clinic name");
            return;
        }

        if (!profile) {
            console.error("No profile found for current user.", { userId: session?.user?.id });
            alert(`Error: User profile not found for ${session?.user?.email || 'unknown user'}.\nPlease try logging out and back in.`);
            return;
        }

        setLoading(true);

        try {
            console.log("Inserting clinic...");
            const { data: clinic, error: clinicError } = await supabase
                .from('clinics')
                .insert([{ name: clinicName }])
                .select()
                .single();

            if (clinicError) {
                console.error("Clinic Insert Error:", clinicError);
                throw new Error(`Failed to create clinic: ${clinicError.message}`);
            }

            console.log("Clinic created successfully:", clinic);

            console.log("Updating profile...");
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    clinic_id: clinic.id,
                    role: 'admin'
                })
                .eq('id', profile.id);

            if (profileError) {
                console.error("Profile Update Error:", profileError);
                throw new Error(`Failed to update your profile: ${profileError.message}`);
            }

            console.log("Profile updated. Refreshing...");
            await refreshProfile();
            console.log("Navigating to /admin");
            navigate("/admin");
        } catch (error: any) {
            console.error("Onboarding Exception:", error);
            alert(error.message || "An unexpected error occurred during setup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-12 rounded-[48px] shadow-2xl relative z-10"
            >
                <div className="w-20 h-20 bg-blue-400/20 rounded-3xl flex items-center justify-center mb-10 border border-blue-400/30">
                    <Building className="w-10 h-10 text-blue-400" />
                </div>

                {!profile ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Setting up your account...</h2>
                        <p className="text-white/60 mb-8">
                            We are verifying your access. If you just accepted an invitation, this might take a few seconds.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await refreshProfile();
                                    setLoading(false);
                                }}
                                disabled={loading}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                Reload Profile
                            </button>
                            <button
                                onClick={authSignOut}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-2xl transition-all"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-400/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-400/20">
                                Step 1: Identity
                            </span>
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        </div>

                        <h1 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">Create Your Clinic</h1>
                        <p className="text-white/40 text-lg font-medium mb-12 leading-relaxed">
                            Welcome to the Enterprise Dental Platform. Let's start by naming your hospital or practice.
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
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-sm uppercase tracking-widest font-black">Initialize Dashboard</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                        {session?.user && (
                            <div className="mt-12 text-center pt-8 border-t border-white/5">
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono mb-2">
                                    Session: <span className="text-blue-400">{session.user.email}</span>
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        authSignOut();
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                                >
                                    Log Out & Start Fresh
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
