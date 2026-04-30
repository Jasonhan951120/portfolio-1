import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft, Globe, Zap, CheckCircle2,
    Shield, RefreshCw, AlertCircle, ExternalLink,
    Terminal, Lock, Smartphone, Camera, Share2, ClipboardList,
    AlertTriangle, HelpCircle, Monitor, Link as LinkIcon, MoreHorizontal, PlugZap, MessageCircle, MessageSquare
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useGoogleLogin } from "@react-oauth/google";
import { supabase } from "../lib/supabase";
import { saveTokenToBackend } from "../lib/integrations";

// ─── Shared UI Components ───────────────────────────────────────────────────

function IPhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full max-w-[220px] mx-auto my-4 select-none">
            <div className="bg-slate-200 rounded-[36px] p-[7px] shadow-lg">
                <div className="absolute left-[-6px] top-24 w-[5px] h-8 bg-slate-300 rounded-l-md" />
                <div className="absolute left-[-6px] top-36 w-[5px] h-12 bg-slate-300 rounded-l-md" />
                <div className="absolute left-[-6px] top-[200px] w-[5px] h-12 bg-slate-300 rounded-l-md" />
                <div className="absolute right-[-6px] top-28 w-[5px] h-16 bg-slate-300 rounded-r-md" />
                <div className="bg-white rounded-[30px] overflow-hidden min-h-[340px]">
                    <div className="bg-white flex justify-center pt-3 pb-0">
                        <div className="w-[72px] h-[22px] bg-slate-200 rounded-full" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

function BrowserFrame({ children, url = "ads.google.com" }: { children: React.ReactNode; url?: string }) {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden my-4 select-none">
            <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-3 border-b border-slate-100">
                <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-slate-400 font-medium border border-slate-100 truncate">
                    🔒 {url}
                </div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function MockupPCDashboard() {
    return (
        <BrowserFrame url="app.hanlanoc.com/admin/integrations">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-emerald-500/10" />
                    <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="h-2.5 w-20 rounded bg-slate-200 mb-2" />
                    <div className="h-8 w-full rounded-lg bg-white border border-slate-200 flex items-center px-3">
                        <div className="h-2 flex-1 rounded bg-slate-100" />
                        <div className="ml-2 px-3 py-1 bg-slate-100 rounded-md text-[9px] text-slate-500 font-bold">Copy Link</div>
                    </div>
                </div>
            </div>
        </BrowserFrame>
    );
}

function MockupQRScan() {
    return (
        <IPhoneFrame>
            <div className="px-4 py-4 flex flex-col items-center">
                <div className="text-[10px] font-bold text-slate-400 mb-3 tracking-wider uppercase">Camera</div>
                <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center mb-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-md" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-md" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-md" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-md" />
                    <div className="w-16 h-16 bg-white/90 rounded grid grid-cols-4 gap-0.5 p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`rounded-[1px] ${[0, 1, 4, 2, 5, 8, 10, 14, 15, 11].includes(i) ? "bg-slate-900" : "bg-white"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </IPhoneFrame>
    );
}

function MockupSafariCopy() {
    return (
        <IPhoneFrame>
            <div className="px-3 py-3">
                <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    <p className="text-[8px] text-slate-600 truncate font-medium">hanlanoc.com/visit/30bea…</p>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-slate-900 text-[9px] font-semibold text-center">hanlanoc.com/visit/...</p>
                    </div>
                </div>
            </div>
        </IPhoneFrame>
    );
}

function MockupIGEditProfile() {
    return (
        <IPhoneFrame>
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between py-2 mb-2">
                    <div className="text-[10px] font-black text-slate-900 tracking-tight">Edit Profile</div>
                </div>
                <div className="relative border-b-2 border-emerald-500/30 py-2 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-emerald-600">Website / Links</p>
                    <p className="text-[9px] text-slate-900 mt-0.5 font-medium truncate">hanlanoc.com/visit/30bea…</p>
                </div>
            </div>
        </IPhoneFrame>
    );
}

function MockupIGLinkSaved() {
    return (
        <IPhoneFrame>
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between py-2 mb-3">
                    <div className="text-[10px] font-black text-slate-900 tracking-tight">Edit Profile</div>
                    <div className="relative">
                        <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Done</div>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 justify-center bg-emerald-50 rounded-xl p-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-[9px] text-emerald-600 font-bold">Saved — syncing live</p>
                </div>
            </div>
        </IPhoneFrame>
    );
}

function MockupFinalURL() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads/edit">
            <div className="space-y-3">
                <div className="relative">
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mb-1">Final URL ★</p>
                    <div className="h-9 bg-white rounded-xl border-2 border-emerald-500/40 px-3 flex items-center shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
                        <p className="text-[8px] text-slate-700 font-mono truncate">hanlanoc.com/visit/30beae42?utm_source=google</p>
                    </div>
                </div>
            </div>
        </BrowserFrame>
    );
}

function MockupGoogleSave() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads/edit">
            <div className="space-y-2">
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div className="px-5 py-2 bg-blue-600 rounded-lg text-[8px] text-white font-black shadow-md">Save</div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 justify-center bg-emerald-50 rounded-xl p-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-[9px] text-emerald-600 font-bold">Saved — syncing live</p>
                </div>
            </div>
        </BrowserFrame>
    );
}

function StepCard({ number, title, desc, children, delay = 0, icon }: {
    number: string; title: string; desc: string; children?: React.ReactNode; delay?: number; icon?: React.ReactNode;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <span className="text-[11px] font-black tracking-widest text-emerald-600">{number}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {icon && <span className="text-slate-400">{icon}</span>}
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ApiIntegrationPage() {
    const [clinicId, setClinicId] = useState<string | null>(null);
    const [adConnections, setAdConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
    const [setupMode, setSetupMode] = useState<"choice" | "automatic" | "manual">("choice");
    const [manualTab, setManualTab] = useState<"instagram" | "google">("instagram");
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
    const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const loginWithGoogle = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/adwords",
        onSuccess: async (tokenResponse) => {
            if (!clinicId) return;
            try {
                setIsGoogleConnecting(true);
                await saveTokenToBackend("google", tokenResponse.access_token, clinicId);
                fetchClinicInfo();
            } catch (err) {
                alert("연동 정보를 저장하는 데 실패했습니다.");
            } finally {
                setIsGoogleConnecting(false);
            }
        },
        onError: (err) => {
            setIsGoogleConnecting(false);
        },
        onNonOAuthError: () => setIsGoogleConnecting(false)
    });

    const fetchClinicInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error("No active session detected.");

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("clinic_id")
                .eq("id", session.user.id)
                .single();

            if (profileError) throw profileError;

            if (profile?.clinic_id) {
                setClinicId(profile.clinic_id);
                const { data: connections, error: connError } = await supabase
                    .from("clinic_ad_connections")
                    .select("*")
                    .eq("clinic_id", profile.clinic_id);

                if (connError) throw connError;

                if (connections) {
                    setAdConnections(connections);
                    if (connections.length > 0) setSetupMode("automatic");
                }
            } else {
                throw new Error("No clinic profile found for your account.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while fetching clinic data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicInfo();
    }, []);

    const handleDisconnect = async (id: string | undefined) => {
        if (!id) return;
        if (!confirm("Are you sure you want to disconnect this platform? All sync data will be stopped.")) return;

        setDisconnectingId(id);
        try {
            const { error } = await supabase.from("clinic_ad_connections").delete().eq("id", id);
            if (error) throw error;
            setAdConnections(prev => prev.filter(c => c.id !== id));
            if (adConnections.length <= 1) setSetupMode("choice");
        } catch (err: any) {
            alert("Disconnect failed: " + err.message);
        } finally {
            setDisconnectingId(null);
        }
    };

    const handleCopy = (platform: string, utmSource: string) => {
        if (!clinicId) return;
        const url = `${window.location.origin}/landing?utm_source=${utmSource}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedPlatform(platform);
            setTimeout(() => setCopiedPlatform(null), 2000);
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-medium text-sm">Initializing Enterprise Data Stream...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <div className="max-w-md bg-white p-10 rounded-[32px] border border-slate-200 shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Error</h3>
                <p className="text-sm text-slate-500 mb-8">{error}</p>
                <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Retry Connection</button>
            </div>
        </div>
    );

    const isGoogleConnected = adConnections.some(c => c.platform === 'google');
    const instagramUrl = clinicId ? `https://hanlanoc.com/visit/${clinicId}?utm_source=instagram` : "";

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden p-6 md:p-12">
            <div className="max-w-5xl mx-auto relative z-10">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                {adConnections.length === 0 && setupMode === "choice" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 mb-16">
                        <button onClick={() => setSetupMode("automatic")} className="group bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
                            <Zap className="w-12 h-12 text-emerald-500 mb-8" />
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 uppercase tracking-tight">Automatic Setup</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Connect your Google Ads account in one click for real-time ROI tracking.</p>
                        </button>
                        <button onClick={() => setSetupMode("manual")} className="group bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
                            <LinkIcon className="w-12 h-12 text-slate-400 mb-8" />
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 uppercase tracking-tight">Manual Tracking</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Generate custom tracking links for Instagram, TikTok, and more.</p>
                        </button>
                    </motion.div>
                )}

                {(adConnections.length > 0 || setupMode === "automatic") && (
                    <div className="space-y-12">
                        {adConnections.length === 0 && (
                            <button onClick={() => setSetupMode("choice")} className="text-xs font-bold text-slate-400 hover:text-slate-900 underline underline-offset-4 mb-4">← Back to choice</button>
                        )}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Google Ads Card */}
                            <div className={`p-8 rounded-[32px] transition-all border ${isGoogleConnected ? 'bg-white border-emerald-500/20 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isGoogleConnected ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'}`}>
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    {isGoogleConnected && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">Active</span>}
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Google Ads</h3>
                                <p className="text-[10px] text-slate-400 mb-6 font-medium">Real-time API Sync</p>

                                {isGoogleConnected ? (
                                    <button onClick={() => handleDisconnect(adConnections.find(c => c.platform === 'google')?.id)} disabled={!!disconnectingId} className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                                        {disconnectingId ? "Wait..." : "Disconnect"}
                                    </button>
                                ) : !googleClientId ? (
                                    <div className="bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                                        <span className="text-[8px] font-bold text-amber-700 uppercase tracking-tighter transition-colors">Setup Failed</span>
                                    </div>
                                ) : (
                                    <button onClick={() => loginWithGoogle()} disabled={isGoogleConnecting} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-colors">
                                        {isGoogleConnecting ? "Syncing..." : "Connect"}
                                    </button>
                                )}
                            </div>

                            {/* Instagram Ads Card */}
                            <div className="p-8 rounded-[32px] bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Instagram Ads</h3>
                                <p className="text-[10px] text-slate-400 mb-6 font-medium">Tracking: utm_source=ig</p>
                                <button onClick={() => {
                                    setManualTab("instagram");
                                    setSetupMode("manual");
                                }} className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Generate Link</button>
                            </div>

                            {/* Facebook Ads Card */}
                            <div className="p-8 rounded-[32px] bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Facebook Ads</h3>
                                <p className="text-[10px] text-slate-400 mb-6 font-medium">Tracking: utm_source=fb</p>
                                <button onClick={() => {
                                    setManualTab("instagram"); 
                                    setSetupMode("manual");
                                }} className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Generate Link</button>
                            </div>

                            {/* Direct Website Card */}
                            <div className="p-8 rounded-[32px] bg-white border border-emerald-500/20 shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <Monitor className="w-6 h-6" />
                                    </div>
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">Active</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Direct Traffic</h3>
                                <p className="text-[10px] text-slate-400 mb-6 font-medium">Native Website Tracking</p>
                                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <Shield className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Protected Stream</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {adConnections.length === 0 && setupMode === "manual" && (
                    <div className="space-y-12">
                        <button onClick={() => setSetupMode("choice")} className="text-xs font-bold text-slate-400 hover:text-slate-900 underline underline-offset-4 mb-4">← Back to choice</button>
                        <div className="flex bg-white border border-slate-200 rounded-[32px] p-2 max-w-md mx-auto mb-12 shadow-sm">
                            {([{ key: "instagram", label: "📱 Instagram" }, { key: "google", label: "💻 Google" }] as const).map(tab => (
                                <button key={tab.key} onClick={() => setManualTab(tab.key)} className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${manualTab === tab.key ? "bg-slate-50 shadow-inner text-slate-900" : "text-slate-400 hover:bg-slate-50/50"}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {manualTab === "instagram" ? (
                                <motion.div key="ig" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-5 gap-8">
                                    <div className="md:col-span-2">
                                         <div className="bg-white rounded-[40px] border border-slate-200 p-10 flex flex-col items-center shadow-sm">
                                            {instagramUrl && <QRCodeSVG value={instagramUrl} size={180} className="mb-8" />}
                                            <button onClick={() => handleCopy("instagram", "instagram")} className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors">{copiedPlatform === "instagram" ? "Copied!" : "Copy Link"}</button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 space-y-4">
                                        <StepCard number="01" title="PC Dashboard" desc="Keep this screen open." icon={<Monitor className="w-4 h-4" />}><MockupPCDashboard /></StepCard>
                                        <StepCard number="02" title="Scan QR" desc="Open phone camera and scan." icon={<Camera className="w-4 h-4" />}><MockupQRScan /></StepCard>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="ga" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-6">
                                    <StepCard number="03" title="Edit Ads" desc="Paste the tracking link in the Final URL field." icon={<Zap className="w-4 h-4" />}><MockupFinalURL /></StepCard>
                                    <StepCard number="04" title="Save" desc="Save changes to start live ROI tracking." icon={<CheckCircle2 className="w-4 h-4" />}><MockupGoogleSave /></StepCard>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div >
    );
}
