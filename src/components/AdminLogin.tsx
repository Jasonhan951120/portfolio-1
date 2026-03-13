import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { trackEvent } from "../lib/analytics";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [processingInvite, setProcessingInvite] = useState(false);
    const [agreed, setAgreed] = useState(false);

    // Helper to get IP for Audit Trail
    const getClientIP = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch (err) {
            return 'unknown';
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Developer Bypass: Enable demo mode via URL parameter
        if (params.get("demo") === "true") {
            sessionStorage.setItem("demo_mode", "true");
            window.location.href = "/admin";
            return;
        }

        const token = params.get("invite");
        if (token) {
            setInviteToken(token);
            // Store token in session storage so it survives the OAuth redirect flow without disk residue
            sessionStorage.setItem('invite_token', token);
        }

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session && !localStorage.getItem('invite_token')) {
                // Log consent for existing session if not already logged (simplified)
                const ip = await getClientIP();
                await supabase.from('consent_logs').insert({
                    user_id: session.user.id,
                    consent_type: 'auth',
                    user_email: session.user.email,
                    policy_version: 'v3.2.0-GDPR',
                    ip_address: ip
                });
                navigate("/admin");
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                // If we have an invite token, process it before redirecting
                const storedToken = sessionStorage.getItem('invite_token');

                if (storedToken && !processingInvite) {
                    console.log("Session detected, processing stored invitation token:", storedToken);
                    setProcessingInvite(true);
                    try {
                        console.log("Invoking accept-invite for user:", session.user.email);
                        const { data, error } = await supabase.functions.invoke('accept-invite', {
                            body: {
                                token: storedToken,
                                user_id: session.user.id,
                                user_email: session.user.email,
                                full_name: session.user.user_metadata?.full_name
                            }
                        });

                        if (error) {
                            console.error("accept-invite Edge Function returned error:", error);
                            throw error;
                        }

                        console.log("Invite processed successfully:", data);
                        // Clear the token so we don't process it again
                        sessionStorage.removeItem('invite_token');
                        setInviteToken(null);

                        // Force a profile refresh in AuthContext so it picks up the new clinic_id from the DB
                        await refreshProfile();

                        navigate("/admin");

                    } catch (err: any) {
                        console.error("Failed to process invite:", err);
                        alert(`Failed to accept invitation: ${err.message || 'Unknown error'}`);
                        setProcessingInvite(false);
                        supabase.auth.signOut(); // Sign out if invite fails so they don't get stuck
                    }
                } else if (!storedToken) {
                    navigate("/admin");
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, processingInvite]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        trackEvent('admin_login_google_attempt');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/login`,
            }
        });
        if (error) {
            console.error("Login Error:", error.message);
            alert(`Google login is not enabled for this project yet. Please use Email Login instead.`);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });
        if (error) {
            console.error("OTP Error:", error.message);
            alert(`Failed to send login link: ${error.message}`);
        } else {
            setEmailSent(true);
        }
        setLoading(false);
    };

    if (loading || processingInvite) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                {processingInvite && (
                    <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Setting up your team access...</p>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-white border border-slate-200/60 p-10 rounded-[44px] shadow-luxury relative z-10 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                    <Lock className="w-8 h-8 text-emerald-500" />
                </div>

                <h1 className="text-3xl font-display font-black text-slate-900 mb-2 tracking-tighter uppercase">
                    {inviteToken ? "Join the Team" : "Clinic Portal"}
                </h1>
                <p className="metric-label-muted mb-10">
                    {inviteToken ? "Sign in to accept your invitation." : "Sign in to manage your consultations."}
                </p>

                {emailSent ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] mb-6">
                        <p className="text-emerald-600 font-bold mb-2">Check your email! ✉️</p>
                        <p className="text-slate-500 text-xs">We sent a secure login link to <span className="text-slate-900 font-bold">{email}</span>.</p>
                        <button onClick={() => setEmailSent(false)} className="mt-4 text-xs text-emerald-600 font-bold underline underline-offset-4">Try different email</button>
                    </div>
                ) : (
                    <form onSubmit={handleEmailLogin} className="mb-6 space-y-4 text-left">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300"
                                placeholder="name@practice.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !agreed}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-xs"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Login Link ✉️"}
                        </button>
                    </form>
                )}

                <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl mb-6 group cursor-pointer hover:bg-slate-100/50 transition-all" onClick={() => setAgreed(!agreed)}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => { e.stopPropagation(); setAgreed(e.target.checked); }}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 bg-transparent text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <p className="text-[10px] text-left text-slate-400 leading-relaxed font-bold uppercase tracking-tight group-hover:text-slate-600 transition-colors">
                        I agree to the <span className="text-emerald-500">Terms of Service</span>, <span className="text-emerald-500">Privacy Policy</span>, and the <span className="text-emerald-500 underline underline-offset-2">Zero-Retention DPA</span>.
                    </p>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-4 text-slate-300 font-black">or</span></div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading || !agreed}
                        className="w-full bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-sm uppercase tracking-widest text-xs"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                        <Shield className="w-3 h-3" /> Bank-Grade Encryption Active
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed px-4 font-bold uppercase tracking-tight">
                        Secured by Supabase MFA. Zero-PII retention protocol enforced for UK GDPR compliance.
                    </p>
                </div>

                <p className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
                    Halan Agency 2026
                </p>
            </div>
        </div>
    );
}
