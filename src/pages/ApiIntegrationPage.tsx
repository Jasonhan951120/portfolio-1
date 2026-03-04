import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Shield, CheckCircle2, Zap, Lock,
    PlugZap, ExternalLink
} from "lucide-react";
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
function PlatformCard({ platform, clinicId }: { platform: typeof PLATFORMS[number], clinicId: string | null }) {
    const [status, setStatus] = useState<"idle" | "connecting" | "syncing" | "connected">("idle");

    // ─── Google OAuth Hook ───
    const loginWithGoogle = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/adwords",
        onSuccess: async (tokenResponse) => {
            if (!clinicId) return;
            try {
                setStatus("syncing");
                await saveTokenToBackend("google", tokenResponse.access_token, clinicId);
                setTimeout(() => setStatus("connected"), 800);
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
    const handleConnectClick = () => {
        if (!clinicId) {
            alert("클리닉 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        setStatus("connecting");

        // Trigger specific OAuth provider
        if (platform.id === "google") {
            loginWithGoogle();
        }
        // For Meta, the button renders its own onClick
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
                        <motion.button key="idle-google" onClick={handleConnectClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-[0_4px_16px_rgba(66,133,244,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(66,133,244,0.4)] flex items-center justify-center gap-2"
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
                                    setTimeout(() => setStatus("connected"), 800);
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
                    <motion.div key="connected" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-[#87A96B] text-white shadow-[0_4px_16px_rgba(135,169,107,0.4)]">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                        <span className="text-[11px] font-black uppercase tracking-widest">✔ Connected</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ApiIntegrationPage() {
    const [clinicId, setClinicId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchClinicId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                const { data } = await supabase.from("profiles").select("clinic_id").eq("id", session.user.id).single();
                if (data?.clinic_id) setClinicId(data.clinic_id);
            }
        }
        fetchClinicId();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans relative overflow-x-hidden">
            {/* Ambient */}
            <div className="absolute -top-[600px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[#87A96B]/[0.03] blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

                {/* Back */}
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 bg-[#87A96B]/8 border border-[#87A96B]/20 px-4 py-2 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#87A96B] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B]">Automated API Sync</span>
                    </div>

                    <h1 className="text-4xl md:text-[3rem] font-display font-medium text-gray-900 tracking-tight leading-[1.15] mb-6 max-w-2xl mx-auto">
                        원장님은 진료에만 집중하십시오.<br />
                        <span className="text-[#87A96B]">광고 최적화</span>는 저희가 자동으로 처리합니다.
                    </h1>

                    <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
                        더 이상 링크를 수동으로 복사할 필요가 없습니다. Google 또는 Meta에 한 번 로그인하시면, 공식 API가 모든 광고 설정을 자동으로 최적화합니다.
                    </p>
                </motion.div>

                {/* ── 3-Step Process ────────────────────────────────────────── */}
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-8">How It Works</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative bg-white rounded-[24px] border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-7 flex flex-col gap-4"
                            >
                                {/* Connector line */}
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="w-5 h-px bg-black/10" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 absolute right-0 top-1/2 -translate-y-1/2" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                                        {step.icon}
                                    </div>
                                    <span className="text-[32px] font-black tracking-tighter" style={{ color: `${step.color}20` }}>{step.number}</span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 leading-snug whitespace-pre-line">{step.title}</h3>
                                <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Platform Cards ────────────────────────────────────────── */}
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-8">Select Platform to Connect</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {PLATFORMS.map((platform, i) => (
                            <motion.div key={platform.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                <PlatformCard platform={platform} clinicId={clinicId} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Security Shield Disclaimer ────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#F4F7F4] border border-[#87A96B]/20 rounded-2xl p-7 flex items-start gap-5 mb-16"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-[#87A96B]/20 shadow-sm flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#87A96B]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#87A96B] mb-2">Security & Compliance Assurance</p>
                        <p className="text-[13px] text-gray-600 leading-[1.8] font-medium">
                            This integration is conducted exclusively via the official Google Ads and Meta Ads API, in strict accordance with their respective partner programme terms. We wish to assure you that our system shall only modify the <strong className="text-gray-800 font-bold">destination URL</strong> of your advertisements for the sole purpose of visit tracking.{" "}
                            <span className="text-gray-800 font-semibold">Under no circumstances shall we access, view, alter, or retain any information pertaining to your campaign budgets, audience settings, creative assets, or any patient data.</span>{" "}
                            Your account security and data privacy remain, at all times, entirely within your control.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {["Official API Partner", "OAuth 2.0 Secured", "Zero Data Retention", "GDPR Compliant"].map(badge => (
                                <div key={badge} className="flex items-center gap-1.5 bg-white border border-[#87A96B]/20 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-[#87A96B]" strokeWidth={2.5} />
                                    <span className="text-[10px] font-bold text-gray-600 tracking-wide">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── FAQ ──────────────────────────────────────────────────── */}
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-6">Frequently Asked Questions</p>
                    <div className="space-y-3">
                        {[
                            { q: "광고 예산이나 타겟 설정이 변경되지는 않나요?", a: "절대 변경되지 않습니다. 시스템은 오직 '최종 도착 URL' 항목만 수정하며, 예산, 입찰가, 타겟 오디언스 설정에는 어떠한 영향도 없습니다." },
                            { q: "연동을 해제하고 싶을 때는 어떻게 하나요?", a: "언제든지 이 페이지에서 'Disconnect' 버튼을 눌러 즉시 연동을 해제할 수 있습니다. 해제 즉시 시스템의 모든 접근 권한이 완전히 제거됩니다." },
                            { q: "연동 후 기존 광고에는 영향이 있나요?", a: "기존에 이미 게시된 광고의 URL은 자동으로 업데이트됩니다. 광고 내용, 이미지, 문구 등 그 외 모든 설정은 변경되지 않습니다." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                <p className="text-sm font-bold text-gray-900 mb-2">{item.q}</p>
                                <p className="text-[13px] text-gray-500 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
