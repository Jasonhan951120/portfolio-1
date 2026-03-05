import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Link as LinkIcon, CheckCircle2,
    Monitor, Smartphone, Camera, Share2, ClipboardList,
    AlertTriangle, HelpCircle, Globe
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabase";

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

// ─── Mockup: Step 1 Instagram (Dashboard on PC) ───────────────────────────────
function MockupPCDashboard() {
    return (
        <BrowserFrame url="app.hanlanoc.com/admin/campaign-setup">
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
                <div className="bg-gray-50 rounded-xl p-3 border border-black/5">
                    <div className="h-2.5 w-28 rounded bg-gray-200 mb-2" />
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

// ─── Mockup: Step 2 (Phone QR Scan) ──────────────────────────────────────────
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

// ─── Mockup: Step 3 (Safari Link Copy) ───────────────────────────────────────
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

// ─── Mockup: Step 4 Instagram Edit Profile (KEY — with pulsing ring) ─────────
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
                {/* Website field — KEY with pulsing ring */}
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
                <p className="text-[7px] text-red-400 font-bold mt-2 animate-pulse">← Paste your tracking link here</p>
            </div>
        </IPhoneFrame>
    );
}

// ─── Mockup: Step 5 IG (Link Saved) ──────────────────────────────────────────
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
                {["Name", "Username", "Bio"].map(f => (
                    <div key={f} className="border-b border-black/5 py-2">
                        <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">{f}</p>
                        <div className="h-2 w-20 bg-gray-100 rounded mt-1" />
                    </div>
                ))}
                <div className="border-b-2 border-[#87A96B] py-2 mt-1 bg-[#87A96B]/5 -mx-1 px-1 rounded-lg">
                    <p className="text-[7px] font-black uppercase tracking-widest text-[#87A96B]">Website / Links ✓</p>
                    <p className="text-[9px] text-[#87A96B] mt-0.5 font-bold truncate">hanlanoc.com/visit/30bea…</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 justify-center bg-[#87A96B]/10 rounded-xl p-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                    <p className="text-[9px] text-[#87A96B] font-bold">Saved — syncing to dashboard</p>
                </div>
            </div>
        </IPhoneFrame>
    );
}

// ─── Google Ads Mockups ───────────────────────────────────────────────────────
function MockupGoogleLogin() {
    return (
        <BrowserFrame url="ads.google.com">
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex items-center gap-1 mb-1">
                    {["G", "o", "o", "g", "l", "e"].map((l, i) => (
                        <span key={i} className={`text-lg font-black ${["text-blue-500", "text-red-400", "text-yellow-400", "text-blue-500", "text-green-500", "text-red-400"][i]}`}>{l}</span>
                    ))}
                    <span className="text-lg font-black text-gray-600 ml-1">Ads</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">Sign in to Google Ads</p>
                <div className="w-full bg-[#F8F9FA] rounded-xl border border-black/10 px-4 py-3">
                    <p className="text-[9px] text-gray-400 font-medium mb-1">Email or phone</p>
                    <div className="h-2 w-32 bg-gray-200 rounded" />
                </div>
                <div className="w-full bg-blue-500 rounded-xl py-3 text-center">
                    <p className="text-[10px] text-white font-bold">Next</p>
                </div>
            </div>
        </BrowserFrame>
    );
}

function MockupCampaignList() {
    return (
        <BrowserFrame url="ads.google.com/aw/campaigns">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-24 h-3 rounded bg-gray-200" />
                    <div className="ml-auto px-3 py-1 bg-blue-500 rounded text-[8px] text-white font-bold">+ New Campaign</div>
                </div>
                {["London Smile — Implants Campaign", "Cavity Treatment — Ad Group A", "Invisalign Summer Promo"].map((name, i) => (
                    <div key={name} className={`flex items-center gap-3 p-2.5 rounded-xl border ${i === 0 ? "border-blue-200 bg-blue-50" : "border-black/5 bg-gray-50"}`}>
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-green-400" : "bg-gray-300"}`} />
                        <p className="text-[9px] text-gray-700 font-medium flex-1">{name}</p>
                        <div className="text-[8px] text-gray-400">▶</div>
                    </div>
                ))}
            </div>
        </BrowserFrame>
    );
}

function MockupAdEdit() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads">
            <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-700 mb-2">Ad List</p>
                {["Responsive Search Ad #1", "Responsive Search Ad #2"].map((ad, i) => (
                    <div key={ad} className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                        <div className="flex-1">
                            <p className="text-[9px] font-semibold text-gray-800">{ad}</p>
                            <p className="text-[7px] text-gray-400 mt-0.5">london-smile.com</p>
                        </div>
                        <div className={`relative flex items-center gap-1 px-2 py-1 rounded-lg ${i === 0 ? "bg-blue-50 border border-blue-200" : "bg-gray-100"}`}>
                            <span className="text-[9px]">✏️</span>
                            <span className="text-[8px] font-bold text-blue-600">Edit</span>
                            {i === 0 && (
                                <div className="absolute -top-2 -right-2">
                                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 items-center justify-center text-white text-[6px] font-black">←</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </BrowserFrame>
    );
}

function MockupFinalURL() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads/edit">
            <div className="space-y-3">
                {[{ label: "Headline", w: "w-28" }, { label: "Display URL", w: "w-20" }].map(f => (
                    <div key={f.label}>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">{f.label}</p>
                        <div className="h-7 bg-gray-50 rounded-lg border border-black/8 px-2 flex items-center">
                            <div className={`h-2 ${f.w} bg-gray-200 rounded`} />
                        </div>
                    </div>
                ))}
                {/* Final URL — KEY FIELD */}
                <div className="relative">
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#C5A059] mb-1">Final URL ★</p>
                    <div className="h-9 bg-white rounded-xl border-2 border-[#C5A059]/60 px-3 flex items-center shadow-[0_0_0_3px_rgba(197,160,89,0.15)]">
                        <p className="text-[8px] text-gray-700 font-mono truncate">hanlanoc.com/visit/30beae42?utm_source=google</p>
                    </div>
                    <div className="absolute -inset-1.5 rounded-2xl pointer-events-none border-2 border-red-500 animate-pulse" />
                    <div className="absolute -top-3 -right-3">
                        <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-5 w-5 rounded-full bg-red-500 items-center justify-center text-white text-[8px] font-black">!</span>
                    </div>
                    <p className="text-[8px] text-red-400 font-bold mt-2 animate-pulse">← Paste your tracking link here</p>
                </div>
            </div>
        </BrowserFrame>
    );
}

function MockupGoogleSave() {
    return (
        <BrowserFrame url="ads.google.com/aw/ads/edit">
            <div className="space-y-2">
                <div className="space-y-2 opacity-40">
                    {["Headline", "Display URL", "Final URL"].map(f => (
                        <div key={f}>
                            <p className="text-[7px] text-gray-400 mb-1">{f}</p>
                            <div className="h-6 bg-gray-50 rounded border border-black/5" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-black/5">
                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-[8px] text-gray-600 font-bold">Cancel</div>
                    <div className="relative">
                        <div className="px-5 py-2 bg-blue-500 rounded-lg text-[8px] text-white font-black shadow-md">Save</div>
                        <div className="absolute -top-2 -right-2">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#87A96B] opacity-75" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#87A96B] items-center justify-center text-white text-[7px] font-black">✓</span>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 justify-center bg-[#87A96B]/10 rounded-xl p-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#87A96B]" />
                    <p className="text-[9px] text-[#87A96B] font-bold">Saved — visitors now appear live on your dashboard</p>
                </div>
            </div>
        </BrowserFrame>
    );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
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
export default function CampaignSetupPage() {
    const [clinicId, setClinicId] = useState<string | null>(null);
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
    const [guideTab, setGuideTab] = useState<"instagram" | "google">("instagram");

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

    const handleCopy = (platform: string, utmSource: string) => {
        if (!clinicId) return;
        navigator.clipboard.writeText(`https://hanlanoc.com/visit/${clinicId}?utm_source=${utmSource}`).then(() => {
            setCopiedPlatform(platform);
            setTimeout(() => setCopiedPlatform(null), 2000);
        });
    };

    const platforms = [
        { id: "google", name: "Google Ads", utm: "google", instruction: "Paste this link into the 'Final URL' field of your Google Ads campaign.", icon: <Globe className="w-5 h-5 text-gray-400" strokeWidth={1.5} /> },
        {
            id: "instagram", name: "Instagram / Meta", utm: "instagram", instruction: "Paste this link into your Instagram profile bio or as a Story link sticker.",
            icon: <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
        },
        {
            id: "tiktok", name: "TikTok", utm: "tiktok", instruction: "Paste this link into the 'Website' field on your TikTok profile or as your ad landing URL.",
            icon: <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
        }
    ];

    const instagramUrl = clinicId ? `https://hanlanoc.com/visit/${clinicId}?utm_source=instagram` : "";

    if (!clinicId) return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <p className="text-gray-400 font-medium text-sm">Loading clinic data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans relative overflow-x-hidden">
            <div className="absolute -top-[400px] -right-[400px] w-[900px] h-[900px] bg-[#C5A059]/[0.025] blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <div className="mb-14">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-[#C5A059]" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl font-display font-medium text-gray-900 tracking-tight">Campaign Setup</h1>
                    </div>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">Paste these links into your ad platforms. Every visit will be tracked in real-time on your Dashboard.</p>
                </div>

                {/* Tracking Link Cards */}
                <div className="space-y-5 mb-16">
                    {platforms.map((p, i) => {
                        const isCopied = copiedPlatform === p.id;
                        const url = `https://hanlanoc.com/visit/${clinicId}?utm_source=${p.utm}`;
                        return (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="bg-white p-8 rounded-[28px] border border-black/5 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
                                <div className="flex items-center gap-3 mb-4">{p.icon}<h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">{p.name}</h3></div>
                                <div className="relative">
                                    <input type="text" readOnly value={url} className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl py-4 pl-4 pr-36 text-sm text-gray-900 font-mono tracking-tight focus:outline-none" />
                                    <AnimatePresence mode="wait">
                                        {isCopied ? (
                                            <motion.button key="c1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="absolute right-2 top-2 bottom-2 px-5 flex items-center gap-2 bg-[#87A96B] text-white rounded-lg text-xs font-bold uppercase tracking-widest">
                                                <CheckCircle2 className="w-4 h-4" /> Copied
                                            </motion.button>
                                        ) : (
                                            <motion.button key="c2" onClick={() => handleCopy(p.id, p.utm)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="absolute right-2 top-2 bottom-2 px-5 bg-black/5 hover:bg-black/10 text-gray-900 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                                                Copy Link
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[13px] text-[#888] tracking-wide mt-3 leading-relaxed">{p.instruction}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Guide Section */}
                <div className="flex items-center gap-4 mb-10"><div className="h-px flex-1 bg-black/5" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Setup Guide</span><div className="h-px flex-1 bg-black/5" /></div>

                <div className="text-center mb-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-3">Premium Manual</p>
                    <h2 className="text-3xl md:text-[2.5rem] font-display font-medium text-gray-900 tracking-tight leading-tight">
                        See exactly where every patient<br />comes from — starting today.
                    </h2>
                    <p className="text-gray-400 mt-4 text-[15px] leading-relaxed max-w-lg mx-auto">Select a platform to see the step-by-step setup guide.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white border border-black/5 rounded-2xl p-1.5 mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    {([{ key: "instagram", label: "📱  Instagram Setup", sub: "Mobile app workflow" }, { key: "google", label: "💻  Google Ads Setup", sub: "PC admin workflow" }] as const).map(tab => (
                        <button key={tab.key} onClick={() => setGuideTab(tab.key)}
                            className={`flex-1 flex flex-col items-center py-3.5 px-4 rounded-xl transition-all duration-300 ${guideTab === tab.key ? "bg-[#F9FAFB] shadow-sm border border-black/5" : "hover:bg-black/[0.02]"}`}>
                            <span className={`text-[13px] font-bold tracking-tight ${guideTab === tab.key ? "text-gray-900" : "text-gray-400"}`}>{tab.label}</span>
                            <span className={`text-[10px] mt-0.5 font-medium tracking-wide ${guideTab === tab.key ? "text-[#87A96B]" : "text-gray-300"}`}>{tab.sub}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {guideTab === "instagram" ? (
                        <motion.div key="ig" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            <div className="grid md:grid-cols-5 gap-6 mb-4 items-start">
                                <div className="md:col-span-2">
                                    <div className="bg-white rounded-[28px] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-7 flex flex-col items-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-5 text-center">Instagram Tracking QR</p>
                                        {instagramUrl && <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-inner mb-5"><QRCodeSVG value={instagramUrl} size={160} bgColor="#FFFFFF" fgColor="#111111" level="H" includeMargin={false} /></div>}
                                        <p className="text-center text-[12px] text-gray-400 leading-relaxed mb-4">Scan with your phone camera<br />then copy the link</p>
                                        <AnimatePresence mode="wait">
                                            {copiedPlatform === "instagram-qr" ? (
                                                <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full py-3 rounded-xl bg-[#87A96B] flex items-center justify-center gap-2 text-white text-xs font-bold tracking-widest"><CheckCircle2 className="w-4 h-4" /> Copied</motion.div>
                                            ) : (
                                                <motion.button key="b" onClick={() => handleCopy("instagram-qr", "instagram")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full py-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold uppercase tracking-widest transition-colors">Copy Link</motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-4">
                                    <StepCard number="01" title="Open the Dashboard on Your PC" delay={0.05} icon={<Monitor className="w-4 h-4" />} desc="Keep this screen open on your computer while you pick up your smartphone."><MockupPCDashboard /></StepCard>
                                    <StepCard number="02" title="Scan the QR Code with Your Phone Camera" delay={0.1} icon={<Camera className="w-4 h-4" />} desc="Open your default camera app and point it at the QR code on the left. No additional app required."><MockupQRScan /></StepCard>
                                </div>
                            </div>
                            <StepCard number="03" title="Tap the Link to Copy It" delay={0.15} icon={<Share2 className="w-4 h-4" />} desc="After scanning, tap the link that appears at the top of the screen. Long-press the URL bar and select 'Copy'."><MockupSafariCopy /></StepCard>
                            <StepCard number="04" title="Go to Edit Profile on Instagram" delay={0.2} icon={<Smartphone className="w-4 h-4" />} desc="Open Instagram → tap [Edit Profile] → tap the 'Website / Links' field highlighted in red below."><MockupIGEditProfile /></StepCard>
                            <StepCard number="05" title="Paste the Link & Tap Done" delay={0.25} icon={<ClipboardList className="w-4 h-4" />} desc="Long-press the Website field, select 'Paste', then tap [Done] in the top-right. Your dashboard will update instantly."><MockupIGLinkSaved /></StepCard>
                        </motion.div>
                    ) : (
                        <motion.div key="ga" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            <StepCard number="01" title="Sign in to Google Ads" delay={0.05} icon={<Monitor className="w-4 h-4" />} desc="Open ads.google.com in your browser and sign in with your Google account."><MockupGoogleLogin /></StepCard>
                            <StepCard number="02" title="Select Your Campaign" delay={0.1} icon={<Monitor className="w-4 h-4" />} desc="Click 'Campaigns' in the left menu and select the campaign you want to set up tracking for."><MockupCampaignList /></StepCard>
                            <StepCard number="03" title="Click the Edit (Pencil) Icon" delay={0.15} icon={<Monitor className="w-4 h-4" />} desc="In the ad list, click the pencil icon (marked in red below) next to the ad you want to update."><MockupAdEdit /></StepCard>
                            <StepCard number="04" title="Paste Your Link into 'Final URL'" delay={0.2} icon={<Monitor className="w-4 h-4" />} desc="Clear the 'Final URL' field (highlighted in red below) and paste your Google Ads tracking link from the top of this page."><MockupFinalURL /></StepCard>
                            <StepCard number="05" title="Click Save" delay={0.25} icon={<Monitor className="w-4 h-4" />} desc="Click the [Save] button to publish. All future visitors from this ad will appear as 'Google / Search' on your dashboard in real time."><MockupGoogleSave /></StepCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Warning Box */}
                <div className="bg-[#FFF8F0] border border-[#F5C27A]/40 rounded-2xl p-7 mt-4 mb-4">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-5 h-5 text-[#D4860A] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-[15px] font-semibold text-gray-900 mb-3">⚠️ Important Reminders</p>
                            <ul className="space-y-2 text-[13px] text-[#9C6100] leading-relaxed">
                                <li>• Do not manually edit or shorten the link. Modifying the URL may prevent tracking data from being recorded correctly.</li>
                                <li>• When sharing the link via messaging apps or SMS, copy and paste it exactly as shown — do not retype it.</li>
                                <li>• Instagram profiles can only hold one website link. If you already have a link set, it will be replaced.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Troubleshooting Box */}
                <div className="bg-[#F5F7FF] border border-[#C7D2FE]/60 rounded-2xl p-7 mb-16">
                    <div className="flex items-start gap-4">
                        <HelpCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-[15px] font-semibold text-gray-900 mb-3">💡 Having trouble with the setup?</p>
                            <ul className="space-y-2 text-[13px] text-[#5149A0] leading-relaxed">
                                <li>• <strong>QR code not scanning?</strong> — Move to a brighter area and hold your camera 15–20cm away from the QR code.</li>
                                <li>• <strong>Dashboard numbers not updating?</strong> — Paste the tracking link directly into a browser address bar to test it first.</li>
                                <li>• <strong>Still stuck?</strong> — Use the chat button in the bottom-right corner to reach your dedicated support manager instantly.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
