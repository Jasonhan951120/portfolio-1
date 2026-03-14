import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Check, ShieldCheck, MapPin, ChevronDown, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardHeaderProps {
    clinic: any;
    isAdmin: boolean;
    multiBranchMode: boolean;
    selectedBranch: string;
    setSelectedBranch: (branch: string) => void;
    isBranchDropdownOpen: boolean;
    setIsBranchDropdownOpen: (open: boolean) => void;
    branches: string[];
    onOpenSettings?: () => void;
    focusMode: string;
    setFocusMode: (mode: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    clinic,
    isAdmin,
    multiBranchMode,
    selectedBranch,
    setSelectedBranch,
    isBranchDropdownOpen,
    setIsBranchDropdownOpen,
    branches,
    onOpenSettings,
    focusMode,
    setFocusMode,
}) => {
    const focusOptions = ["All", "Implants", "Orthodontics", "Cosmetic"];

    return (
        <div className="flex items-center gap-6 relative">
            <div className="flex items-center gap-4 flex-1">
                {/* Clinic Logo Placeholder */}
                <div className="w-14 h-14 rounded-full bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden shadow-[inner_0_2px_4px_rgba(0,0,0,0.02)]">
                    {clinic?.logo_url ? (
                        <img src={clinic.logo_url} alt={clinic?.name} className="w-full h-full object-cover" />
                    ) : (
                        <Building className="w-6 h-6 text-gray-300" strokeWidth={1} />
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
                            <ArrowLeft className="w-3 h-3" strokeWidth={2} /> Back to Site
                        </Link>
                        {isAdmin && (
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                    <ShieldCheck className="w-2.5 h-2.5" /> High-Level Admin
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border-[0.5px] border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-500">Bank-Grade Protection Active</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                        <h1 className="text-3xl font-display font-medium text-gray-900 tracking-[0.05em] uppercase tabular-nums">
                            {clinic?.name || "Hanlan OC"}{" "}
                            <span className="font-light text-slate-400 lowercase tracking-normal italic">Dashboard</span>
                        </h1>
                        <div className="flex items-center justify-center p-1 bg-blue-500/10 rounded-full border border-blue-500/20" title="Verified Revenue Partner">
                            <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Focus Mode Selector */}
                <div className="flex items-center gap-2 bg-slate-50 border-[0.5px] border-slate-200/60 p-1 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    {focusOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFocusMode(opt)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${focusMode === opt
                                ? "bg-slate-900 text-white shadow-lg scale-[1.05]"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className="flex items-center justify-center w-10 h-10 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl transition-all group shadow-[0_2px_10px_rgb(0,0,0,0.1)] backdrop-blur-md"
                    title="Clinic Settings"
                >
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" strokeWidth={2} />
                </button>

                {/* Branch Selector */}
                {multiBranchMode && (
                    <div className="relative">
                        <button
                            onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                            className="flex items-center gap-2 bg-black/5 hover:bg-black/5 border border-black/10 px-4 py-2 rounded-xl text-sm font-bold transition-all text-gray-900/80 group"
                        >
                            <MapPin className="w-4 h-4 text-gray-500 group-hover:text-[#87A96B]" strokeWidth={1.5} />
                            {selectedBranch}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isBranchDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {isBranchDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute top-full left-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl p-2 z-[2000] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                                >
                                    {branches.map(branch => (
                                        <button
                                            key={branch}
                                            onClick={() => { setSelectedBranch(branch); setIsBranchDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedBranch === branch
                                                ? "bg-[#87A96B]/10 text-[#87A96B] font-bold"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                                                }`}
                                        >
                                            {branch}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
