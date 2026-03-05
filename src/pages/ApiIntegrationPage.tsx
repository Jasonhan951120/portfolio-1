import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft, Globe, Zap, CheckCircle2,
    Shield, RefreshCw, AlertCircle, ExternalLink,
    Terminal, Lock, Smartphone, Camera, Share2, ClipboardList,
    AlertTriangle, HelpCircle, Monitor, Link as LinkIcon, MoreHorizontal, PlugZap
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useGoogleLogin } from "@react-oauth/google";
// @ts-ignore
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { supabase } from "../lib/supabase";
import { saveTokenToBackend } from "../lib/integrations";

// ─── Platform Config ───────────────────────────────────────────────────────────
const PLATFORMS = [
    {
        id: "google",
        name: "Google Ads",
        description: "Google 광고 캠페인의 최종 도착 URL을 자동으로 추적 링크로 교체합니다.",
        color: "#4285F4",
        bgColor: "#EBF1FF",
        borderColor: "#BFCFFF",
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="1.5" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#4285F4" strokeWidth="1.5" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="#4285F4" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "meta",
        name: "Instagram / Meta Ads",
        description: "Meta 광고 및 인스타그램 스토리 링크를 자동으로 추적 링크로 연동합니다.",
        color: "#E1306C",
        bgColor: "#FFF0F5",
        borderColor: "#FFBFD6",
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
    },
];

// ─── 3-Step Process ────────────────────────────────────────────────────────────
const STEPS = [
    {
        number: "01",
        icon: <PlugZap className="w-6 h-6" />,
        title: "원장님은\n[Connect] 버튼만",
        desc: "복잡한 설정은 없습니다. 아래 버튼을 한 번 누르시면 모든 절차가 시작됩니다.",
        color: "#C5A059",
    },
    {
        number: "02",
        icon: <Shield className="w-6 h-6" />,
        title: "공식 시스템이\n안전하게 연동",
        desc: "Google / Meta 공식 보안 인증 창이 열립니다. 원장님의 계정 정보는 저희 서버에 저장되지 않습니다.",
        color: "#87A96B",
    },
    {
        number: "03",
        icon: <Zap className="w-6 h-6" />,
        title: "로봇이 광고 주소를\n자동 최적화",
        desc: "이후 모든 광고의 추적 링크 설정은 자동으로 처리됩니다. 대시보드에서 실시간으로 확인하실 수 있습니다.",
        color: "#6366F1",
    },
];

// ─── Connect Card ─────────────────────────────────────────────────────────────
function PlatformCard({
    platform,
    clinicId,
    initialStatus = "idle",
    onConnectionSuccess
}: {
    platform: typeof PLATFORMS[number],
    clinicId: string | null,
    initialStatus?: "idle" | "connecting" | "syncing" | "connected",
    onConnectionSuccess?: () => void
}) {
    const [status, setStatus] = useState<"idle" | "connecting" | "syncing" | "connected">(initialStatus);

    useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    // ─── Google OAuth Hook ───
    const loginWithGoogle = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/adwords",
        onSuccess: async (tokenResponse) => {
            if (!clinicId) return;
            try {
                setStatus("syncing");
                await saveTokenToBackend("google", tokenResponse.access_token, clinicId);
                setTimeout(() => {
                    setStatus("connected");
                    if (onConnectionSuccess) onConnectionSuccess();
                }, 800);
            } catch (err) {
                console.error(err);
                setStatus("idle");
            }
        },
        onError: (err) => {
            console.error("Google Login Failed", err);
            setStatus("idle");
        },
        onNonOAuthError: () => setStatus("idle")
    });

    // ─── Shared Trigger ───
    const handleConnectClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!clinicId) {
            console.error("Cannot connect: Clinic ID is missing.");
            return;
        }

        setStatus("connecting");

        // Trigger specific OAuth provider
        if (platform.id === "google") {
            loginWithGoogle();
        }
    };

    const handleDisconnect = async () => {
        if (!clinicId) return;
        if (!confirm(`${platform.name} 연동을 해제하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from("clinic_ad_connections")
                .delete()
                .eq("clinic_id", clinicId)
                .eq("platform", platform.id);

            if (error) throw error;

            setStatus("idle");
            if (onConnectionSuccess) onConnectionSuccess();
        } catch (err) {
            console.error("Failed to disconnect:", err);
            alert("연동 해제에 실패했습니다.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[28px] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 flex flex-col gap-6"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: platform.bgColor, border: `1px solid ${platform.borderColor}` }}>
                        {platform.icon}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{platform.name}</h3>
                        <p className="text-[12px] text-gray-400 font-medium mt-0.5">API Integration</p>
                    </div>
                </div>
                {status === "connected" && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 bg-[#87A96B]/10 border border-[#87A96B]/20 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#87A96B] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#87A96B]">Connected</span>
                    </motion.div>
                )}
            </div>

            <p className="text-[13px] text-gray-500 leading-relaxed">{platform.description}</p>

            <div className="space-y-2 text-[12px] text-gray-500">
                {[
                    "최종 도착 URL 자동 업데이트",
                    "실시간 클릭 수 대시보드 반영",
                    "캠페인 예산 및 설정 영향 없음",
                ].map(f => (
                    <div key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B] flex-shrink-0" strokeWidth={2} />
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {status === "idle" && (
                    platform.id === "google" ? (
                        <motion.button
                            key="idle-google"
                            onClick={handleConnectClick}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            disabled={!clinicId}
                            className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-[0_4px_16px_rgba(66,133,244,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(66,133,244,0.4)] flex items-center justify-center gap-2 ${!clinicId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ backgroundColor: platform.color }}>
                            <ExternalLink className="w-4 h-4" /> Connect {platform.name}
                        </motion.button>
                    ) : (
                        <FacebookLogin
                            key="idle-meta"
                            appId={import.meta.env.VITE_META_APP_ID || "23861273895"}
                            autoLoad={false}
                            fields="name,email"
                            scope="ads_management,business_management"
                            onClick={() => { if (clinicId) setStatus("connecting"); }}
                            callback={async (response: any) => {
                                if (response.accessToken && clinicId) {
                                    setStatus("syncing");
                                    await saveTokenToBackend("meta", response.accessToken, clinicId);
                                    setTimeout(() => {
                                        setStatus("connected");
                                        if (onConnectionSuccess) onConnectionSuccess();
                                    }, 800);
                                } else {
                                    setStatus("idle");
                                }
                            }}
                            render={(renderProps: any) => (
                                <motion.button onClick={renderProps.onClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-[0_4px_16px_rgba(225,48,108,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(225,48,108,0.4)] flex items-center justify-center gap-2"
                                    style={{ backgroundColor: platform.color }}>
                                    <ExternalLink className="w-4 h-4" /> Connect {platform.name}
                                </motion.button>
                            )}
                        />
                    )
                )}

                {status === "connecting" && (
                    <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-[#F9FAFB] border border-black/5">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin" />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Awaiting Authorization…</span>
                    </motion.div>
                )}

                {status === "syncing" && (
                    <motion.div key="syncing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-[#87A96B]/5 border border-[#87A96B]/10">
                        <div className="w-4 h-4 border-2 border-[#87A96B]/30 border-t-[#87A96B] rounded-full animate-spin" />
                        <span className="text-[11px] font-bold text-[#87A96B] uppercase tracking-widest">Login Successful! Syncing in progress...</span>
                    </motion.div>
                )}

                {status === "connected" && (
                    <div className="flex flex-col gap-3">
                        <motion.div key="connected" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-[#87A96B] text-white shadow-[0_4px_16px_rgba(135,169,107,0.4)]">
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-widest">✔ Connected</span>
                        </motion.div>
                        <button
                            onClick={handleDisconnect}
                            className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 py-1"
                        >
                            연동 해제하기 (Disconnect)
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── iPhone Frame ─────────────────────────────────────────────────────────────
function IPhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full max-w-[220px] mx-auto my-4 select-none">
            <div className="bg-gray-900 rounded-[36px] p-[7px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <div className="absolute left-[-6px] top-24 w-[5px] h-8 bg-gray-700 rounded-l-md" />
                <div className="absolute left-[-6px] top-36 w-[5px] h-12 bg-gray-700 rounded-l-md" />
                <div className="absolute left-[-6px] top-[200px] w-[5px] h-12 bg-gray-700 rounded-l-md" />
                <div className="absolute right-[-6px] top-28 w-[5px] h-16 bg-gray-700 rounded-r-md" />
                <div className="bg-white rounded-[30px] overflow-hidden min-h-[340px]">
                    <div className="bg-white flex justify-center pt-3 pb-0">
                        <div className="w-[72px] h-[22px] bg-gray-900 rounded-full" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── Browser Frame ────────────────────────────────────────────────────────────
function BrowserFrame({ children, url = "ads.google.com" }: { children: React.ReactNode; url?: string }) {
    return (
        <div className="w-full bg-white rounded-2xl border border-black/8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden my-4 select-none">
            <div className="bg-[#F3F4F6] px-4 py-2.5 flex items-center gap-3 border-b border-black/5">
                <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 font-medium border border-black/5 truncate">
                    🔒 {url}
                </div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

// ─── Mockups ────────────────────────────────────────────────────────────
function MockupPCDashboard() {
    return (
        <BrowserFrame url="app.hanlanoc.com/admin/integrations">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#C5A059]/20" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-black/5">
                    <div className="h-2.5 w-20 rounded bg-gray-200 mb-2" />
                    <div className="h-8 w-full rounded-lg bg-white border border-black/5 flex items-center px-3">
                        <div className="h-2 flex-1 rounded bg-gray-100" />
                        <div className="ml-2 px-3 py-1 bg-black/5 rounded-md text-[9px] text-gray-500 font-bold">Copy Link</div>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <div className="inline-block text-[9px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">← Keep this screen open</div>
                </div>
            </div>
        </BrowserFrame>
    );
}

function MockupQRScan() {
    return (
        <IPhoneFrame>
            <div className="px-4 py-4 flex flex-col items-center">
                <div className="text-[10px] font-bold text-gray-500 mb-3 tracking-wider">Camera</div>
                <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden flex items-center justify-center mb-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-md" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-md" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-md" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-md" />
                    <div className="w-16 h-16 bg-white/90 rounded grid grid-cols-4 gap-0.5 p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`rounded-[1px] ${[0, 1, 4, 2, 5, 8, 10, 14, 15, 11].includes(i) ? "bg-gray-900" : "bg-white"}`} />
                        ))}
                    </div>
                    <div className="absolute top-1/2 w-full h-0.5 bg-[#87A96B]/80 shadow-[0_0_8px_rgba(135,169,107,0.8)]" />
                </div>
                <div className="w-full bg-[#1C1C1E]/90 rounded-xl p-3 border border-white/10 mt-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#87A96B] flex items-center justify-center flex-shrink-0">
                            <Globe className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-white text-[9px] font-bold">Open hanlanoc.com</p>
                            <p className="text-gray-400 text-[8px]">Tap the link to copy</p>
                        </div>
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
                <div className="bg-[#F2F2F7] rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-[#28C840] flex-shrink-0" />
                    <p className="text-[8px] text-gray-600 truncate font-medium">hanlanoc.com/visit/30bea…</p>
                </div>
                <div className="bg-[#F9FAFB] rounded-xl p-3 border border-black/5 mb-3">
                    <p className="text-[8px] text-gray-500 font-medium text-center">Redirecting...</p>
                </div>
                <div className="bg-[#1C1C1E] rounded-xl overflow-hidden border border-white/10 shadow-xl">
                    <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-white text-[9px] font-semibold text-center">hanlanoc.com/visit/...</p>
                    </div>
                    {["Copy", "Share", "Add Bookmark"].map((item, i) => (
                        <div key={item} className={`px-4 py-2.5 flex items-center justify-between ${i === 0 ? "bg-[#87A96B]/20" : ""} ${i < 2 ? "border-b border-white/5" : ""}`}>
                            <p className={`text-[9px] font-bold ${i === 0 ? "text-[#87A96B]" : "text-white/70"}`}>{item}</p>
                            {i === 0 && <CheckCircle2 className="w-3 h-3 text-[#87A96B]" />}
                        </div>
                    ))}
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
                    <div className="text-[10px] font-black text-gray-900 tracking-tight">Edit Profile</div>
                    <div className="text-[10px] font-bold text-blue-500">Done</div>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 mb-1 shadow-md" />
                    <p className="text-[8px] text-blue-500 font-semibold">Change photo or avatar</p>
                </div>
                {[{ label: "Name", value: "London Smile Dental" }, { label: "Username", value: "@londonsmile" }, { label: "Bio", value: "Premium dental care" }].map(f => (
                    <div key={f.label} className="border-b border-black/5 py-2">
                        <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">{f.label}</p>
                        <p className="text-[9px] text-gray-900 mt-0.5">{f.value}</p>
                    </div>
                ))}
                <div className="relative border-b-2 border-[#87A96B] py-2 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-[#87A96B]">Website / Links</p>
                    <p className="text-[9px] text-gray-900 mt-0.5 font-medium truncate">hanlanoc.com/visit/30bea…</p>
                    <div className="absolute -inset-1.5 rounded-xl pointer-events-none">
                        <div className="absolute inset-0 rounded-xl border-2 border-red-500 animate-pulse" />
                        <div className="absolute -top-2.5 -right-2.5">
                            <div className="relative w-5 h-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                                    <span className="text-white text-[7px] font-black">↙</span>
                                </span>
                            </div>
                        </div>
                    </div>
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
                    <div className="text-[10px] font-black text-gray-900 tracking-tight">Edit Profile</div>
                    <div className="relative">
                        <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Done</div>
                        <div className="absolute -top-1.5 -right-1.5">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#87A96B] opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#87A96B]" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-md" />
                </div>
                <div className="border-b-2 border-[#87A96B] py-2 mt-1 bg-[#87A96B]/5 -mx-1 px-1 rounded-lg">
                    <p className="text-[7px] font-black uppercase tracking-widest text-[#87A96B]">Website / Links ✓</p>
                    <p className="text-[9px] text-[#87A96B] mt-0.5 font-bold truncate">hanlanoc.com/visit/30bea…</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 justify-center bg-[#87A96B]/10 rounded-xl p-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                    <p className="text-[9px] text-[#87A96B] font-bold">Saved — syncing live</p>
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
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#C5A059] mb-1">Final URL ★</p>
                    <div className="h-9 bg-white rounded-xl border-2 border-[#C5A059]/60 px-3 flex items-center shadow-[0_0_0_3px_rgba(197,160,89,0.15)]">
                        <p className="text-[8px] text-gray-700 font-mono truncate">hanlanoc.com/visit/30beae42?utm_source=google</p>
                    </div>
                    <div className="absolute -inset-1.5 rounded-2xl pointer-events-none border-2 border-red-500 animate-pulse" />
                </div>
                <p className="text-[8px] text-red-400 font-bold mt-2 animate-pulse">← Paste tracking link here</p>
            </div>
        </BrowserFrame>
    );
}

function MockupGoogleSave() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads/edit">
            <div className="space-y-2">
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-black/5">
                    <div className="px-5 py-2 bg-blue-500 rounded-lg text-[8px] text-white font-black shadow-md">Save</div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 justify-center bg-[#87A96B]/10 rounded-xl p-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                    <p className="text-[9px] text-[#87A96B] font-bold">Saved — syncing live</p>
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
            className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 mb-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#F9FAFB] border border-black/5 flex items-center justify-center">
                    <span className="text-[11px] font-black tracking-widest text-[#C5A059]">{number}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {icon && <span className="text-gray-400">{icon}</span>}
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">{title}</h4>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
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

    const loginWithGoogle = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/adwords",
        onSuccess: async (tokenResponse) => {
            if (!clinicId) return;
            try {
                setIsGoogleConnecting(true);
                await saveTokenToBackend("google", tokenResponse.access_token, clinicId);
                // Refresh the connections after successful save
                fetchClinicInfo();
            } catch (err) {
                console.error("Failed to save token to backend:", err);
                alert("연동 정보를 저장하는 데 실패했습니다.");
            } finally {
                setIsGoogleConnecting(false);
            }
        },
        onError: (err) => {
            console.error("Google Login Failed", err);
            setIsGoogleConnecting(false);
        },
        onNonOAuthError: () => setIsGoogleConnecting(false)
    });

    useEffect(() => {
        fetchClinicInfo();
    }, []);

    const fetchClinicInfo = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error("No active session");

            const { data: profile } = await supabase
                .from("profiles")
                .select("clinic_id")
                .eq("id", session.user.id)
                .single();

            if (profile?.clinic_id) {
                setClinicId(profile.clinic_id);
                // Fetch persistent connections
                const { data: connections } = await supabase
                    .from("clinic_ad_connections")
                    .select("*")
                    .eq("clinic_id", profile.clinic_id);

                if (connections) {
                    setAdConnections(connections);
                    // If connected, default to automatic view (status)
                    if (connections.length > 0) {
                        setSetupMode("automatic");
                    }
                }
            }
        } catch (err: any) {
            console.error("fetchClinicInfo error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (id: string) => {
        if (!confirm("Are you sure you want to disconnect this platform? All sync data will be stopped.")) return;
        setDisconnectingId(id);
        try {
            const { error } = await supabase
                .from("clinic_ad_connections")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setAdConnections(prev => prev.filter(c => c.id !== id));
            if (adConnections.length <= 1) {
                setSetupMode("choice");
            }
        } catch (err: any) {
            alert("Disconnect failed: " + err.message);
        } finally {
            setDisconnectingId(null);
        }
    };

    const handleCopy = (platform: string, utmSource: string) => {
        if (!clinicId) return;
        const url = `https://hanlanoc.com/visit/${clinicId}?utm_source=${utmSource}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedPlatform(platform);
            setTimeout(() => setCopiedPlatform(null), 2000);
        });
    };

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (loading) return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-[#C5A059] animate-spin" />
                <p className="text-gray-400 font-medium text-sm">Initializing Enterprise Data Stream...</p>
            </div>
        </div>
    );

    const isGoogleConnected = adConnections.some(c => c.platform === 'google');
    const instagramUrl = clinicId ? `https://hanlanoc.com/visit/${clinicId}?utm_source=instagram` : "";

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans relative overflow-x-hidden p-6 md:p-12">
            <div className="absolute -top-[400px] -right-[400px] w-[900px] h-[900px] bg-[#C5A059]/[0.025] blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                {/* --- Choice Screen: Only show if not connected and in choice mode --- */}
                {adConnections.length === 0 && setupMode === "choice" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 mb-16">
                        <button
                            onClick={() => setSetupMode("automatic")}
                            className="group bg-white p-10 rounded-[40px] border border-black/5 shadow-xl hover:shadow-2xl transition-all text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Zap className="w-32 h-32 text-[#C5A059]" />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center mb-8">
                                <Zap className="w-8 h-8 text-[#C5A059]" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 tracking-tight">자동 연동 (권장)</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                                Google Ads 계정을 원클릭으로 연결합니다. 모든 광고 성과와 비용 데이터가 대시보드에 실시간으로 자동 동기화됩니다.
                            </p>
                            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C5A059]">
                                Start Auto-Integration <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>

                        <button
                            onClick={() => setSetupMode("manual")}
                            className="group bg-white p-10 rounded-[40px] border border-black/5 shadow-xl hover:shadow-2xl transition-all text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <LinkIcon className="w-32 h-32 text-gray-400" />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8">
                                <LinkIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 tracking-tight">수동 설정</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                                인스타그램, 틱톡 등 개별 링크를 생성하여 수동으로 붙여넣습니다. API 연동 없이 즉시 시작할 수 있습니다.
                            </p>
                            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                View Manual Guide <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>
                    </motion.div>
                )}

                {/* --- Automatic Flow --- */}
                {(adConnections.length > 0 || setupMode === "automatic") && (
                    <div className="space-y-12">
                        {adConnections.length === 0 && (
                            <button onClick={() => setSetupMode("choice")} className="text-xs font-bold text-gray-400 hover:text-gray-900 underline underline-offset-4">
                                ← 선택 화면으로 돌아가기
                            </button>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Connection Card: Google */}
                            <div className={`p-10 rounded-[40px] transition-all border ${isGoogleConnected ? 'bg-white border-[#87A96B]/20 shadow-xl' : 'bg-white border-black/5 shadow-sm'}`}>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isGoogleConnected ? 'bg-[#87A96B]/10 text-[#87A96B]' : 'bg-blue-50 text-blue-600'}`}>
                                            <Globe className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-gray-900">Google Ads</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Search Intelligence</p>
                                        </div>
                                    </div>
                                    {isGoogleConnected ? (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-[#87A96B]/10 text-[#87A96B] rounded-full text-[9px] font-black uppercase tracking-widest">
                                            <CheckCircle2 className="w-3 h-3" /> Connected
                                        </div>
                                    ) : (
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Disconnected</span>
                                    )}
                                </div>

                                {isGoogleConnected ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#87A96B]" />
                                                <span className="text-xs font-bold text-gray-600">실시간 데이터 스트림 활성</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">최근 동기화: 방금 전</span>
                                        </div>
                                        <button
                                            disabled={!!disconnectingId}
                                            onClick={() => handleDisconnect(adConnections.find(c => c.platform === 'google')?.id)}
                                            className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-red-100"
                                        >
                                            {disconnectingId ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Disconnect Google Ads Account"}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!clinicId) return;
                                            loginWithGoogle();
                                        }}
                                        disabled={isGoogleConnecting}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 transition-all focus:outline-none active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isGoogleConnecting ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin text-white/70" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                Connect Google Ads <ExternalLink className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Connection Card: Meta (Placeholder) */}
                            <div className="p-10 rounded-[40px] bg-white border border-black/5 shadow-sm opacity-50">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                                            <Smartphone className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-gray-900">Meta / Instagram</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Social Intelligence</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Coming Soon</span>
                                </div>
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-black/5 rounded-[32px]">
                                    <Lock className="w-6 h-6 text-gray-200 mb-3" />
                                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Module under certification</p>
                                </div>
                            </div>
                        </div>

                        {/* Automatic How It Works (Hidden if connected) */}
                        {adConnections.length === 0 && (
                            <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-black/5">
                                <div className="flex flex-col gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-black">01</div>
                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight text-sm">Secure Authorization</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Link your account via official OAuth 2.0. No password storage required.</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-black">02</div>
                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight text-sm">Automated Tagging</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">We automatically cross-reference parameters with our attribution engine.</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-black">03</div>
                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight text-sm">ROI Analysis</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">View exact revenue attributed directly to your ad spend.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Manual Flow (QR, Links, Guides) --- */}
                {adConnections.length === 0 && setupMode === "manual" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                        <button onClick={() => setSetupMode("choice")} className="text-xs font-bold text-gray-400 hover:text-gray-900 underline underline-offset-4 mb-4">
                            ← 선택 화면으로 돌아가기
                        </button>

                        {/* Tracking Link Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-16">
                            {(['instagram', 'tiktok'] as const).map((p, i) => {
                                const isCopied = copiedPlatform === p;
                                const url = `https://hanlanoc.com/visit/${clinicId}?utm_source=${p}`;
                                return (
                                    <motion.div key={p} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        className="bg-white p-8 rounded-[28px] border border-black/5 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            {p === 'instagram' ? <Smartphone className="w-5 h-5 text-[#C5A059]" /> : <Zap className="w-5 h-5 text-[#C5A059]" />}
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 capitalize">{p} Tracking</h3>
                                        </div>
                                        <div className="relative">
                                            <input type="text" readOnly value={url} className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl py-4 pl-4 pr-36 text-[10px] text-gray-900 font-mono tracking-tight focus:outline-none" />
                                            <AnimatePresence mode="wait">
                                                {isCopied ? (
                                                    <motion.button key="c1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                        className="absolute right-2 top-2 bottom-2 px-5 flex items-center gap-2 bg-[#87A96B] text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 className="w-4 h-4" /> Copied
                                                    </motion.button>
                                                ) : (
                                                    <motion.button key="c2" onClick={() => handleCopy(p, p)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                        className="absolute right-2 top-2 bottom-2 px-5 bg-black/[0.03] hover:bg-black/[0.06] text-gray-900 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors">
                                                        Copy Link
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Guide Section */}
                        <div className="flex items-center gap-4 mb-10"><div className="h-px flex-1 bg-black/5" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Setup Guide</span><div className="h-px flex-1 bg-black/5" /></div>

                        <div className="text-center mb-16">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-3">Premium Manual</p>
                            <h2 className="text-3xl md:text-[2.5rem] font-display font-medium text-gray-900 tracking-tight leading-tight">
                                수동 연결 가이드
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white border border-black/5 rounded-[32px] p-2 mb-12 shadow-xl max-w-lg mx-auto">
                            {([{ key: "instagram", label: "📱  Instagram Setup" }, { key: "google", label: "💻  Google Ads Setup" }] as const).map(tab => (
                                <button key={tab.key} onClick={() => setManualTab(tab.key)}
                                    className={`flex-1 flex flex-col items-center py-4 px-6 rounded-[24px] transition-all duration-300 ${manualTab === tab.key ? "bg-[#F9FAFB] shadow-inner border border-black/5" : "hover:bg-black/[0.02]"}`}>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${manualTab === tab.key ? "text-gray-900" : "text-gray-400"}`}>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {manualTab === "instagram" ? (
                                <motion.div key="ig" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="grid md:grid-cols-5 gap-8 items-start">
                                        <div className="md:col-span-2">
                                            <div className="bg-white rounded-[40px] border border-black/5 shadow-2xl p-10 flex flex-col items-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-8 text-center text-nowrap">Scan to Track</p>
                                                {instagramUrl && <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-inner mb-8"><QRCodeSVG value={instagramUrl} size={180} /></div>}
                                                <button onClick={() => handleCopy("instagram-qr", "instagram")} className="w-full py-4 rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-black uppercase tracking-widest transition-colors">Copy Link</button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3 space-y-6">
                                            <StepCard number="01" title="PC Dashboard" desc="Keep this screen open on your computer." icon={<Monitor className="w-4 h-4" />}><MockupPCDashboard /></StepCard>
                                            <StepCard number="02" title="Scan QR" desc="Open your phone camera and scan the code." icon={<Camera className="w-4 h-4" />}><MockupQRScan /></StepCard>
                                            <StepCard number="03" title="Copy URL" desc="Tap the link that appears to copy it." icon={<Share2 className="w-4 h-4" />}><MockupSafariCopy /></StepCard>
                                            <StepCard number="04" title="Paste in IG" desc="Go to Instagram > Edit Profile > Paste in Website." icon={<Smartphone className="w-4 h-4" />}><MockupIGEditProfile /></StepCard>
                                            <StepCard number="05" title="Verify Sync" desc="Tap Done to start tracking visitors live." icon={<ClipboardList className="w-4 h-4" />}><MockupIGLinkSaved /></StepCard>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="ga" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="max-w-3xl mx-auto space-y-6">
                                        <StepCard number="01" title="Google Ads" desc="ads.google.com에 접속하여 로그인합니다." icon={<Monitor className="w-4 h-4" />} />
                                        <StepCard number="02" title="Select Ad" desc="추적할 캠페인과 광고를 선택합니다." icon={<Globe className="w-4 h-4" />} />
                                        <StepCard number="03" title="Edit Link" desc="광고 수정 화면에서 '최종 도착 URL'을 찾습니다." icon={<Monitor className="w-4 h-4" />} />
                                        <StepCard number="04" title="Paste URL" desc="상단의 구글 트래킹 링크를 붙여넣습니다." icon={<Zap className="w-4 h-4" />}><MockupFinalURL /></StepCard>
                                        <StepCard number="05" title="Save & Sync" desc="저장 버튼을 누르면 실시간 동기화가 시작됩니다." icon={<CheckCircle2 className="w-4 h-4" />}><MockupGoogleSave /></StepCard>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* --- Protection & Support --- */}
                <div className="grid md:grid-cols-2 gap-8 mt-24">
                    <div className="bg-[#FFF8F0] border border-[#F5C27A]/20 rounded-[32px] p-8">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-[#D4860A] shrink-0 mt-1" />
                            <div>
                                <p className="text-lg font-bold text-gray-900 mb-2">데이터 보안 안내</p>
                                <p className="text-sm text-[#9C6100] leading-relaxed mb-4 font-medium">
                                    공식 API를 통한 안전한 연동만을 지원합니다. 계정의 예산 설정이나 오디언스 데이터에는 접근하지 않습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F5F7FF] border border-[#C7D2FE]/20 rounded-[32px] p-8">
                        <div className="flex items-start gap-4">
                            <HelpCircle className="w-6 h-6 text-[#6366F1] shrink-0 mt-1" />
                            <div>
                                <p className="text-lg font-bold text-gray-900 mb-2">도움이 필요하신가요?</p>
                                <p className="text-sm text-[#5149A0] leading-relaxed mb-4 font-medium">
                                    설정 과정에 어려움이 있으시면 우측 하단 채팅 아이콘을 통해 담당 전문가에게 문의해 주세요.
                                </p>
                                <button className="text-[10px] font-black text-[#6366F1] uppercase tracking-widest flex items-center gap-2 group">
                                    Contact Support <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
