import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, BarChart2, Users, Settings, 
  Target, Zap, Shield, PieChart, Database, Sparkles,
  ArrowDownCircle, Clock, CheckCircle, TrendingDown
} from 'lucide-react';
import { StaffROILeaderboard } from './tabs/StaffROILeaderboard';
import { ReputationROIChart } from './ReputationROIChart';
import { RevenueForecastChart } from './RevenueForecastChart';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function SalesFunnel() {
  const data = [
    { name: 'New Leads', value: 120, color: '#3b82f6' },
    { name: 'WhatsApp Sent', value: 85, color: '#8b5cf6' },
    { name: 'Consultations', value: 42, color: '#00FFA3' }
  ];

  return (
    <div className="h-48 w-full mt-6 flex items-center justify-around gap-2 px-4">
      {data.map((item, idx) => (
        <div key={item.name} className="flex flex-col items-center gap-4 relative w-full">
          <div 
            className="w-full bg-white/10 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 group hover:bg-white/[0.15] transition-all"
            style={{ height: `${100 - idx * 25}%` }}
          >
            <span className="text-2xl font-black text-white">{item.value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.name}</span>
          </div>
          {idx < data.length - 1 && (
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

export function ExpertModeContent({ 
  onOpenPMSLogs, 
  onOpenClinicMeta 
}: { 
  onOpenPMSLogs?: () => void; 
  onOpenClinicMeta?: () => void; 
}) {
  const [selectedTone, setSelectedTone] = React.useState('Professional');

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
                onClick={() => setSelectedTone(tone)}
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

      {/* Sales ROI Dashboard (Task 2) */}
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
          <button 
            onClick={onOpenPMSLogs}
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
            onClick={onOpenClinicMeta}
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
    </div>
  );
}
