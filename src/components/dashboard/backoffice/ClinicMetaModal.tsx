import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Globe, CreditCard, ShieldCheck, MapPin, Clock, Info, Check } from 'lucide-react';

interface ClinicMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: any;
}

export function ClinicMetaModal({ isOpen, onClose, clinic }: ClinicMetaModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const metaItems = [
    {
      label: 'Financial Configuration',
      value: clinic?.currency || 'GBP',
      subValue: 'Base Currency: British Pound',
      icon: CreditCard,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Regional Settings',
      value: 'Europe/London',
      subValue: 'Auto-sync with GMT',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Regulatory Compliance',
      value: 'Live & Active',
      subValue: 'UK GDPR / CQC Verified',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Clinic Tier',
      value: 'Enterprise',
      subValue: 'Unlimited PMS Syncing',
      icon: Building2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[210] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden pointer-events-auto border border-slate-100"
            >
              {/* Header */}
              <div className="p-10 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    <Info className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tabular-nums">Clinic Meta Data</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Immutable Governance Records 🛡️</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                </button>
              </div>

              {/* Grid Content */}
              <div className="px-10 pb-10">
                {loading ? (
                  // Skeleton Grid
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-40 rounded-[32px] bg-slate-50 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metaItems.map((item, idx) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={item.label}
                        className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-default"
                      >
                        <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.value}</h4>
                        <p className="text-[10px] font-medium text-slate-500">{item.subValue}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Info Bar */}
                <div className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">System Integrity Verified</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Last heartbeat check: Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Live</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer/Legal */}
              <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[9px] font-medium text-slate-400 italic">Reference ID: {clinic?.id?.substring(0, 8) || 'SYSTEM-RE-001'}</p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
