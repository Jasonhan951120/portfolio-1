import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, BarChart2, Users, Settings, 
  Target, Zap, Shield, PieChart, Database, Sparkles,
  CircleArrowDown, Clock, CircleCheck, TrendingDown
} from 'lucide-react';
import { StaffROILeaderboard } from './tabs/StaffROILeaderboard';
import { ReputationROIChart } from './ReputationROIChart';
import { RevenueForecastChart } from './RevenueForecastChart';
import { 
  RefreshCw, Sliders, Eye, Share2, 
  ChevronRight, Circle, Check
} from 'lucide-react';

function SalesFunnel() {
  const data = [
    { name: 'New Leads', value: 120, color: '#3b82f6' },
    { name: 'WhatsApp Sent', value: 85, color: '#8b5cf6' },
    { name: 'Consultations', value: 42, color: '#2AF598' }
  ];

  return (
    <div className="h-48 w-full mt-6 flex items-center justify-around gap-2 px-4">
      {(data || [])?.map?.((item, idx) => (
        <div key={item?.name} className="flex flex-col items-center gap-4 relative w-full">
          <div 
            className="w-full bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 group hover:bg-white/10 transition-all duration-200 hover:scale-[1.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            style={{ height: `${100 - idx * 25}%` }}
          >
            <span className="text-2xl font-black text-white">{item?.value}</span>
            <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-tighter">{item?.name}</span>
          </div>
          {idx < data?.length - 1 && (
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <Zap className="w-4 h-4 text-[#2AF598] animate-pulse" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SalesROIDashboard({ targetROI = 35 }: { targetROI?: number }) {
  const currentLevel = 35; // Mock actual conversion rate
  const isMeetingTarget = currentLevel >= targetROI;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#2AF598]" /> Conversion Analytics (ROI)
        </h3>
        <span className="px-3 py-1 bg-[#2AF598]/10 text-[#2AF598] text-[9px] font-bold rounded-full border border-[#2AF598]/20 animate-pulse">Live Tracking</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-200 hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#2AF598]/5 blur-3xl rounded-full" />
          <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest mb-1">Total Pipeline Value</p>
          <p className="text-3xl font-black text-[#2AF598] tracking-tighter">£142.5k</p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#2AF598] font-bold">
            <TrendingUp className="w-3 h-3" /> +14.2% (7d)
          </div>
        </div>
        <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-200 hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest mb-1">Avg Response Speed</p>
          <p className="text-3xl font-black text-white tracking-tighter">4.2m</p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-bold">
            <Clock className="w-3 h-3" /> Industry Leading
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-[40px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-white font-bold text-lg">Sales Funnel</h4>
            <p className="text-[10px] text-[#A0A0A0] uppercase tracking-widest">Lead to Consultation booked</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#2AF598] uppercase tracking-widest">Conversion Rate</p>
            <div className="flex items-center justify-end gap-2">
              <p className={`text-2xl font-black transition-colors ${isMeetingTarget ? 'text-[#2AF598]' : 'text-orange-400'}`}>
                {currentLevel}%
              </p>
              {isMeetingTarget ? (
                 <CircleCheck className="w-5 h-5 text-[#2AF598]" />
              ) : (
                 <TrendingDown className="w-5 h-5 text-orange-400 animate-bounce" />
              )}
            </div>
            <p className="text-[8px] text-[#A0A0A0] font-bold uppercase mt-1 tracking-widest">Target: {targetROI}%</p>
          </div>
        </div>
        <SalesFunnel />
      </div>
    </section>
  );
}

function RevenueOptimizationGrid({ settings, handlers }: { 
  settings?: { syncInterval: string; targetROI: number; insightVerbosity: string; leadDistribution: string };
  handlers?: { 
    handleSyncChange: (val: string) => void;
    handleROIChange: (val: number) => void;
    handleVerbosityChange: (val: string) => void;
    handleStrategyChange: (val: string) => void;
  };
}) {
  const { syncInterval = 'Hourly', targetROI = 35, insightVerbosity = 'Detailed', leadDistribution = 'Balanced' } = settings || {};

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2AF598]" /> Revenue Optimization Matrix
        </h3>
        <span className="text-[9px] font-black uppercase tracking-[3px] text-[#A0A0A0]">Experimental Beta 🧪</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sync Interval */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4 group hover:border-[#2AF598]/30 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Data Sync Interval</p>
          </div>
          <div className="flex gap-2 p-1 bg-black/60 rounded-2xl border border-white/5">
            {['Real-time', 'Hourly', 'Daily'].map((val) => (
              <button
                key={val}
                onClick={() => handlers?.handleSyncChange?.(val)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] ${
                  syncInterval === val ? 'bg-[#2AF598] text-black shadow-lg shadow-[#2AF598]/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Target ROI Slider */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4 group hover:border-[#2AF598]/30 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2AF598]/10 rounded-xl">
                <Sliders className="w-4 h-4 text-[#2AF598]" />
              </div>
              <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Target ROI Goal</p>
            </div>
            <span className="text-xl font-black text-white tabular-nums tracking-tight">{targetROI}%</span>
          </div>
          <div className="relative pt-2">
            <input 
              type="range"
              min="0"
              max="100"
              value={targetROI}
              onChange={(e) => handlers?.handleROIChange?.(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[#2AF598] border border-white/5"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Conservative</span>
              <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Aggressive</span>
            </div>
          </div>
        </div>

        {/* AI Insight Verbosity */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4 group hover:border-[#2AF598]/30 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Insight Verbosity</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Summary', 'Detailed', 'Data'].map((val) => (
              <button
                key={val}
                onClick={() => handlers?.handleVerbosityChange?.(val)}
                className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all active:scale-[0.98] ${
                  insightVerbosity === val ? 'bg-[#2AF598]/20 border-[#2AF598]/40 text-[#2AF598] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-gray-500 hover:bg-white/5'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Distribution Strategy */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4 group hover:border-[#2AF598]/30 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Share2 className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Lead Distribution</p>
          </div>
          <div className="space-y-2">
            {['Balanced', 'Top Performers Only'].map((val) => (
              <button
                key={val}
                onClick={() => handlers?.handleStrategyChange?.(val)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group/item active:scale-[0.98] ${
                  leadDistribution === val ? 'bg-[#2AF598]/10 border-[#2AF598]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/10'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest ${leadDistribution === val ? 'text-white' : 'text-gray-500'}`}>{val}</span>
                {leadDistribution === val ? (
                  <Check className="w-4 h-4 text-[#2AF598]" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-700" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const [selectedTone, setSelectedTone] = useState('Professional');
  const { insightVerbosity = 'Detailed', targetROI = 35 } = settings || {};

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">Expert Centre</h2>
        <p className="text-xs font-bold text-[#A0A0A0] uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3 text-[#2AF598]" /> Advanced Analytics & Governance
        </p>
      </div>

      {/* AI Persona Presets */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2AF598]" /> AI Analytics Personality
        </h3>
        <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-6 group hover:bg-white/10 transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex gap-2 p-1 bg-black/60 rounded-2xl border border-white/5">
            {['Professional', 'Friendly', 'Direct'].map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone?.(tone)}
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: tone === selectedTone ? '#2AF598' : 'transparent',
                  boxShadow: tone === selectedTone ? '0 4px 20px rgba(42,245,152,0.2)' : 'none',
                  color: tone === selectedTone ? 'black' : '#A0A0A0'
                }}
              >
                {tone}
              </button>
            ))}
          </div>
          <div className="px-2 space-y-4">
            <p className="text-[11px] text-[#A0A0A0] italic font-medium">
              "{selectedTone}" mode {
                selectedTone === 'Professional' ? 'uses clinical terminology and authoritative tone for executive reporting.' :
                selectedTone === 'Friendly' ? 'uses warm, empathetic language to encourage team collaboration.' :
                'uses sharp, direct-response prompts to drive immediate staff action.'
              }
            </p>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
               <p className="text-[9px] font-black text-[#2AF598] uppercase tracking-widest mb-2 select-none">Verbosity Preview ({insightVerbosity})</p>
               <p className="text-[11px] text-white/90 leading-relaxed font-light">
                  {insightVerbosity === 'Summary' ? 'Brief executive summaries highlighting critical KPIs and immediate growth opportunities.' :
                   insightVerbosity === 'Data' ? 'Granular low-level data points filtered for deep-dive technical audits and validation.' :
                   'High-fidelity strategic breakdowns with deep lead-by-lead contextual analysis and staff performance benchmarks.'}
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sales ROI Dashboard */}
      <SalesROIDashboard targetROI={targetROI} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 hover:scale-[1.02] transition-all duration-200 hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <p className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest mb-1">Clinic Efficiency</p>
          <p className="text-2xl font-black text-white">88.4%</p>
        </div>
        <div className="p-6 bg-[#2AF598]/5 rounded-[32px] border border-[#2AF598]/20 hover:scale-[1.02] transition-all duration-200 hover:bg-[#2AF598]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <p className="text-[10px] font-black text-[#2AF598] uppercase tracking-widest mb-1">Growth Forecast</p>
          <p className="text-2xl font-black text-[#2AF598]">+12.5%</p>
        </div>
      </div>

      {/* 4 Killer Revenue Optimization Features (Bento Grid) */}
      <RevenueOptimizationGrid settings={settings} handlers={handlers} />

      {/* Governance & Settings */}
      <section className="p-8 bg-white/5 rounded-[48px] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="space-y-1">
          <h4 className="text-xl font-black text-white tracking-tight">System Governance</h4>
          <p className="text-sm font-light text-[#A0A0A0]">Advanced HIPAA compliance and data stream synchronization.</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => { if (typeof onOpenPMSLogs === 'function') onOpenPMSLogs?.(); }}
            className="w-full p-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:scale-[1.02] border border-white/10 active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                <Database className="w-5 h-5 text-[#A0A0A0] group-hover:text-white" />
              </div>
              <span className="text-sm font-bold text-white">PMS Sync Analysis Logs</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#2AF598] transition-colors" />
          </button>
          
          <Link 
            to="/admin/security"
            className="w-full p-5 bg-[#2AF598]/5 hover:bg-[#2AF598]/10 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:scale-[1.02] border border-[#2AF598]/20 active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#2AF598]/10 rounded-xl">
                <Shield className="w-5 h-5 text-[#2AF598]" />
              </div>
              <span className="text-sm font-bold text-[#2AF598]">🛡️ Security & Encryption Center</span>
            </div>
            <Zap className="w-4 h-4 text-[#2AF598] animate-pulse" />
          </Link>

          <button 
            onClick={() => { if (typeof onOpenClinicMeta === 'function') onOpenClinicMeta?.(); }}
            className="w-full p-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:scale-[1.02] border border-white/10 active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5 text-[#A0A0A0] group-hover:text-white" />
              </div>
              <span className="text-sm font-bold text-white">Clinic Metadata Architecture</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#2AF598] transition-colors" />
          </button>
        </div>
      </section>

      <p className="mt-12 text-center text-[10px] text-[#A0A0A0] uppercase tracking-[8px] font-black opacity-30 select-none">
        End of Expert Console
      </p>
    </div>
  );
}
