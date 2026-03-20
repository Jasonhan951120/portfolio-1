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
    { name: 'Consultations', value: 42, color: '#00FFA3' }
  ];

  return (
    <div className="h-48 w-full mt-6 flex items-center justify-around gap-2 px-4">
      {(data || [])?.map?.((item, idx) => (
        <div key={item?.name} className="flex flex-col items-center gap-4 relative w-full">
          <div 
            className="w-full bg-white/10 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 group hover:bg-white/[0.15] transition-all"
            style={{ height: `${100 - idx * 25}%` }}
          >
            <span className="text-2xl font-black text-white">{item?.value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item?.name}</span>
          </div>
          {idx < data?.length - 1 && (
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <Zap className="w-4 h-4 text-[#00FFA3] animate-pulse" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SalesROIDashboard() {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00FFA3]" /> Conversion Analytics (ROI)
        </h3>
        <span className="px-3 py-1 bg-[#00FFA3]/10 text-[#00FFA3] text-[9px] font-bold rounded-full border border-[#00FFA3]/20 animate-pulse">Live Tracking</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-gray-900 rounded-[32px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FFA3]/10 blur-3xl rounded-full" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pipeline Value</p>
          <p className="text-3xl font-black text-[#00FFA3] tracking-tighter">£142.5k</p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-bold">
            <TrendingUp className="w-3 h-3" /> +14.2% (7d)
          </div>
        </div>
        <div className="p-6 bg-white rounded-[32px] border border-black/5 relative overflow-hidden group">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Response Speed</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">4.2m</p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-bold">
            <Clock className="w-3 h-3" /> Industry Leading
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-[40px] p-8 border border-white/5 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-white font-bold text-lg">Sales Funnel</h4>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Lead to Consultation booked</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#00FFA3] uppercase tracking-widest">Conversion Rate</p>
            <p className="text-2xl font-black text-white">35%</p>
          </div>
        </div>
        <SalesFunnel />
      </div>
    </section>
  );
}

function RevenueOptimizationGrid() {
  const [syncInterval, setSyncInterval] = useState('Hourly');
  const [targetROI, setTargetROI] = useState(35);
  const [verbosity, setVerbosity] = useState('Detailed');
  const [strategy, setStrategy] = useState('Balanced');

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00FFA3]" /> Revenue Optimization Matrix
        </h3>
        <span className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">Experimental Beta 🧪</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sync Interval */}
        <div className="p-6 bg-[#1C1F26] border border-white/5 rounded-[32px] space-y-4 group hover:border-[#00FFA3]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Sync Interval</p>
          </div>
          <div className="flex gap-2 p-1 bg-black/40 rounded-2xl">
            {['Real-time', 'Hourly', 'Daily'].map((val) => (
              <button
                key={val}
                onClick={() => setSyncInterval?.(val)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  syncInterval === val ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-500 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Target ROI Slider */}
        <div className="p-6 bg-[#1C1F26] border border-white/5 rounded-[32px] space-y-4 group hover:border-[#00FFA3]/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Sliders className="w-4 h-4 text-[#00FFA3]" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target ROI Goal</p>
            </div>
            <span className="text-xl font-black text-white tabular-nums">{targetROI}%</span>
          </div>
          <div className="relative pt-2">
            <input 
              type="range"
              min="0"
              max="100"
              value={targetROI}
              onChange={(e) => setTargetROI?.(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[#00FFA3]"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[8px] font-bold text-gray-600">Conservative</span>
              <span className="text-[8px] font-bold text-gray-600">Aggressive</span>
            </div>
          </div>
        </div>

        {/* AI Insight Verbosity */}
        <div className="p-6 bg-[#1C1F26] border border-white/5 rounded-[32px] space-y-4 group hover:border-[#00FFA3]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Insight Verbosity</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Summary', 'Detailed', 'Data'].map((val) => (
              <button
                key={val}
                onClick={() => setVerbosity?.(val)}
                className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all ${
                  verbosity === val ? 'bg-[#00FFA3]/20 border-[#00FFA3]/40 text-[#00FFA3]' : 'text-gray-500 hover:bg-white/5'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Distribution Strategy */}
        <div className="p-6 bg-[#1C1F26] border border-white/5 rounded-[32px] space-y-4 group hover:border-[#00FFA3]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Share2 className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Distribution</p>
          </div>
          <div className="space-y-2">
            {['Balanced', 'Top Performers Only'].map((val) => (
              <button
                key={val}
                onClick={() => setStrategy?.(val)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group/item ${
                  strategy === val ? 'bg-[#00FFA3]/5 border-[#00FFA3]/30' : 'bg-black/20 border-white/5 hover:border-white/10'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest ${strategy === val ? 'text-white' : 'text-gray-500'}`}>{val}</span>
                {strategy === val ? (
                  <Check className="w-4 h-4 text-[#00FFA3]" />
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

export function ExpertModeContent({ 
  onOpenPMSLogs = () => {}, 
  onOpenClinicMeta = () => {} 
}: { 
  onOpenPMSLogs?: () => void; 
  onOpenClinicMeta?: () => void; 
}) {
  const [selectedTone, setSelectedTone] = useState('Professional');

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Expert Centre</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3 text-[#87A96B]" /> Advanced Analytics & Governance
        </p>
      </div>

      {/* AI Persona Presets */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#87A96B]" /> AI Analytics Personality
        </h3>
        <div className="bg-white rounded-[32px] p-6 border border-black/5 shadow-sm space-y-4">
          <div className="flex gap-2 p-1 bg-black/5 rounded-2xl">
            {(['Professional', 'Friendly', 'Direct'] || [])?.map?.((tone) => (
              <button
                key={tone}
                onClick={() => { if (typeof setSelectedTone === 'function') setSelectedTone?.(tone); }}
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                style={{
                  backgroundColor: tone === selectedTone ? 'white' : 'transparent',
                  boxShadow: tone === selectedTone ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                  color: tone === selectedTone ? 'black' : '#A0A0A0'
                }}
              >
                {tone}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 italic px-2">
            "{selectedTone}" mode {
              selectedTone === 'Professional' ? 'uses clinical terminology and authoritative tone.' :
              selectedTone === 'Friendly' ? 'uses warm, empathetic, and conversational language.' :
              'uses concise, action-oriented directives for staff.'
            } (Changes applied to all future AI summaries)
          </p>
        </div>
      </section>

      {/* Sales ROI Dashboard */}
      <SalesROIDashboard />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-black/5 rounded-[32px] border border-black/5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clinic Efficiency</p>
          <p className="text-2xl font-black text-gray-900">88.4%</p>
        </div>
        <div className="p-6 bg-[#87A96B]/10 rounded-[32px] border border-[#87A96B]/20">
          <p className="text-[10px] font-black text-[#87A96B] uppercase tracking-widest mb-1">Growth Forecast</p>
          <p className="text-2xl font-black text-[#87A96B]">+12.5%</p>
        </div>
      </div>

      {/* 4 Killer Revenue Optimization Features (Bento Grid) */}
      <RevenueOptimizationGrid />

      {/* Main Analytics Section */}
      {/* 
      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#87A96B]" /> Revenue Forecasting
          </h3>
          <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm">
            <RevenueForecastChart data={[]} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#87A96B]" /> Reputation ROI
          </h3>
          <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm">
            <ReputationROIChart />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-[#87A96B]" /> Staff Efficiency
          </h3>
          <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm">
             <StaffROILeaderboard clinicId="" />
          </div>
        </section>
      </div>
      */}

      {/* Governance & Settings */}
      <section className="p-8 bg-gray-900 rounded-[48px] text-white space-y-6">
        <div className="space-y-1">
          <h4 className="text-xl font-bold">System Governance</h4>
          <p className="text-xs text-gray-400">Manage HIPAA compliance and PMS integration logs.</p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={() => { if (typeof onOpenPMSLogs === 'function') onOpenPMSLogs?.(); }}
            className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold">PMS Sync Logs</span>
            </div>
            <Zap className="w-4 h-4 text-gray-600 group-hover:text-[#00FFA3]" />
          </button>
          
          <Link 
            to="/admin/security"
            className="w-full p-4 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-2xl flex items-center justify-between group transition-all border border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">🛡️ Security & Compliance</span>
            </div>
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          </Link>

          <button 
            onClick={() => { if (typeof onOpenClinicMeta === 'function') onOpenClinicMeta?.(); }}
            className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold">Clinic Meta Data</span>
            </div>
            <Zap className="w-4 h-4 text-gray-600 group-hover:text-[#00FFA3]" />
          </button>
        </div>
      </section>

      <p className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-[3px]">
        End of Expert Console
      </p>
    </div>
  );
}
