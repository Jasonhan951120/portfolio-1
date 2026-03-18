import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, BarChart2, Users, Settings, 
  Target, Zap, Shield, PieChart, Database
} from 'lucide-react';
import { StaffROILeaderboard } from './tabs/StaffROILeaderboard';
import { ReputationROIChart } from './ReputationROIChart';
import { RevenueForecastChart } from './RevenueForecastChart';
import { useAuth } from '../../contexts/AuthContext';

interface ExpertModeContentProps {
  onOpenPMSLogs?: () => void;
  onOpenClinicMeta?: () => void;
}

export function ExpertModeContent({ onOpenPMSLogs, onOpenClinicMeta }: ExpertModeContentProps) {
  const { profile } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Brief mount delay to prevent flash-of-crash before auth context resolves
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm animate-pulse">Loading Expert Centre...</p>
      </div>
    );
  }

  // Safe clinic ID with optional chaining
  const clinicId = profile?.clinic_id ?? '';

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Expert Centre</h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-3 text-[#87A96B]" /> Advanced Analytics &amp; Governance
        </p>
      </div>

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
            {/* Optional chaining: render only when clinicId is available */}
            {clinicId ? (
              <StaffROILeaderboard clinicId={clinicId} />
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">
                Clinic profile not yet loaded.
              </p>
            )}
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
