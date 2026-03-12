import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart2, Users, Settings, 
  Target, Zap, Shield, PieChart, Database, Sparkles
} from 'lucide-react';
import { StaffROILeaderboard } from './tabs/StaffROILeaderboard';
import { ReputationROIChart } from './ReputationROIChart';
import { RevenueForecastChart } from './RevenueForecastChart';

export function ExpertModeContent() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Expert Centre</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3 text-[#87A96B]" /> Advanced Analytics & Governance
        </p>
      </div>

      {/* AI Persona Presets (Task 2) */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#87A96B]" /> AI Analytics Personality
        </h3>
        <div className="bg-white rounded-[32px] p-6 border border-black/5 shadow-sm space-y-4">
          <div className="flex gap-2 p-1 bg-black/5 rounded-2xl">
            {['Professional', 'Friendly', 'Direct'].map((tone) => (
              <button
                key={tone}
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-white/50 active:scale-95"
                style={{
                  backgroundColor: tone === 'Professional' ? 'white' : 'transparent',
                  boxShadow: tone === 'Professional' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tone}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 italic px-2">
            "Professional" mode uses clinical terminology and authoritative tone. (Changes applied to all future AI summaries)
          </p>
        </div>
      </section>

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

      {/* Main Analytics Section */}
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

      {/* Governance & Settings */}
      <section className="p-8 bg-gray-900 rounded-[48px] text-white space-y-6">
        <div className="space-y-1">
          <h4 className="text-xl font-bold">System Governance</h4>
          <p className="text-xs text-gray-400">Manage HIPAA compliance and PMS integration logs.</p>
        </div>
        
        <div className="space-y-2">
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold">PMS Sync Logs</span>
            </div>
            <Zap className="w-4 h-4 text-gray-600 group-hover:text-[#00FFA3]" />
          </button>
          
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between group transition-all">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold">Clinic Meta Data</span>
            </div>
            <Zap className="w-4 h-4 text-gray-600 group-hover:text-[#00FFA3]" />
          </button>
        </div>
      </section>
    </div>
  );
}
