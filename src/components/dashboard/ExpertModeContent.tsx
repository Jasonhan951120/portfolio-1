import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Shield, Sparkles, Check, 
  ChevronRight, Info, AlertTriangle, 
  ArrowRight, Activity, TrendingUp
} from 'lucide-react';

export interface ExpertModeContentProps {
  onOpenPMSLogs?: () => void;
  onOpenClinicMeta?: () => void;
  settings?: {
    syncInterval: string;
    targetROI: number;
    insightVerbosity: string;
    leadDistribution: string;
  };
  handlers?: {
    handleSyncChange: (val: string) => void;
    handleROIChange: (val: number) => void;
    handleVerbosityChange: (val: string) => void;
    handleStrategyChange: (val: string) => void;
  };
}

export function ExpertModeContent({ 
  onOpenPMSLogs = () => {}, 
  onOpenClinicMeta = () => {},
  settings,
  handlers
}: ExpertModeContentProps) {
  const [isAutoPilotOn, setIsAutoPilotOn] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Steady');
  const [showFullInsight, setShowFullInsight] = useState(false);

  const modes = [
    {
      id: 'Booster',
      title: 'Booster Mode',
      desc: 'High aggression, AI assigns leads to Top Performers.',
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      accent: 'border-orange-200 bg-orange-50/30'
    },
    {
      id: 'Steady',
      title: 'Steady Mode',
      desc: 'Balanced growth with standard lead distribution.',
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      accent: 'border-blue-200 bg-blue-50/30'
    },
    {
      id: 'Saver',
      title: 'Saver Mode',
      desc: 'Optimized lead cost, focus on high-intent conversion.',
      icon: <Shield className="w-5 h-5 text-[#2AF598]" />,
      accent: 'border-emerald-200 bg-emerald-50/30'
    }
  ];

  return (
    <div className="space-y-10 font-sans selection:bg-[#2AF598]/30">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expert Centre</h2>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
           <Shield className="w-3.5 h-3.5 text-[#2AF598]" /> Autonomous Clinic Governance
        </p>
      </div>

      {/* Health Status Urgency Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-100 p-5 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-red-100/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>
          <p className="text-red-700 font-bold text-sm tracking-tight flex items-center gap-2">
            £5,200 at risk. 
            <span className="border border-red-300 bg-white/50 px-2.5 py-1 rounded-full text-[10px] text-red-800 uppercase tracking-widest transition-all hover:border-red-400 hover:shadow-sm">
              Click 'Booster Mode' to fix
            </span>
          </p>
        </div>
        <AlertTriangle className="w-5 h-5 text-red-400 group-hover:rotate-12 transition-transform" />
      </motion.div>

      {/* AUTO-PILOT Master Switch */}
      <section className="bg-white p-8 rounded-[40px] border border-black/[0.05] shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest text-xs">System Control</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#2AF598]" /> AI-DRIVEN AUTONOMY
            </p>
          </div>
          
          <button 
            onClick={() => setIsAutoPilotOn?.(!isAutoPilotOn)}
            className={`w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out active:scale-[0.98] ${isAutoPilotOn ? 'bg-[#2AF598]' : 'bg-slate-200'}`}
          >
            <motion.div 
              animate={{ x: isAutoPilotOn ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              {isAutoPilotOn && <Check className="w-4 h-4 text-[#2AF598]" />}
            </motion.div>
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-black/[0.03]">
           <Info className="w-4 h-4 text-slate-400" />
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             {isAutoPilotOn ? "AI is currently optimizing your lead distribution pipelines." : "Manual controls active. AI optimization is paused."}
           </p>
        </div>
      </section>

      {/* Mode Bento Grid */}
      <section className="relative">
        <div className={`transition-all duration-500 ${isAutoPilotOn ? 'opacity-30 grayscale pointer-events-none blur-[2px]' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 gap-4">
            {modes?.map((mode) => (
              <button
                key={mode?.id}
                onClick={() => setSelectedMode(mode?.id)}
                className={`group relative overflow-hidden p-7 rounded-[2rem] border-2 transition-all duration-500 text-left w-full bg-white ${
                  selectedMode === mode?.id
                    ? 'border-slate-900 shadow-lg scale-[1.005]'
                    : 'border-black/[0.03] shadow-sm hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between relative z-10 gap-10">
                  <div className="flex items-center flex-1 gap-8">
                    {/* Icon Container - Minimal Style */}
                    <div className="p-3.5 rounded-2xl border transition-colors duration-500 flex-shrink-0 bg-slate-50 border-black/5">
                      <div className="text-slate-900">
                        {mode?.icon}
                      </div>
                    </div>

                    {/* [MINIMAL HORIZONTAL]: Title & Description Side-by-Side */}
                    <div className="flex flex-row items-center gap-10 flex-1">
                      <h4 className="text-xl font-serif italic tracking-tight whitespace-nowrap flex-shrink-0 text-slate-900">
                        {mode?.title}
                      </h4>
                      <p className="text-lg font-medium leading-relaxed transition-colors duration-500 text-slate-500">
                        {mode?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator (Minimalist) */}
                  {selectedMode === mode?.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-900 text-white p-1.5 rounded-full shadow-lg flex-shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={4} />
                    </motion.div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI IN CONTROL Overlay */}
        {isAutoPilotOn && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-md border border-black/[0.05] px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2AF598]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">AI IN CONTROL</span>
            </motion.div>
          </div>
        )}
      </section>

      {/* Simplified Insights */}
      <section className="p-8 bg-white rounded-[40px] border border-black/[0.05] shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2AF598]" /> Intelligence Insight
          </h3>
          <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">New</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-16 bg-[#2AF598] rounded-full shrink-0 shadow-[0_0_10px_rgba(42,245,152,0.4)]" />
            <div className="space-y-3">
              <p className={`text-sm text-slate-700 leading-relaxed font-medium transition-all duration-300 ${showFullInsight ? '' : 'line-clamp-2'}`}>
                Revenue leakage detected in "Dental Implants" category. Switching to <strong>Booster Mode</strong> could recover approximately <strong>£5,200</strong> in potential revenue by prioritizing top-performing staff for these high-intent leads.
              </p>
              <button 
                onClick={() => setShowFullInsight?.(!showFullInsight)}
                className="text-[10px] font-black text-[#2AF598] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all group"
              >
                {showFullInsight ? "Show Less" : "Read Full Analysis"} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-12 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em] select-none">
          SYSTEM GOVERNANCE v4.2.0
        </p>
      </footer>
    </div>
  );
}
