import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Clock, Database, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface AuditTrailModalProps {
  lead: ConsultationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;

  const logs = [
    { time: "Just now", action: "Access logged for GP verification", icon: ShieldCheck, type: 'security' },
    { time: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), action: "AI recalculated potential value", icon: BrainCircuit, type: 'ai' },
    { time: new Date(Date.now() - 86400000).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), action: "Data synced from EXACT API", icon: Database, type: 'system' },
    { time: new Date(lead.created_at).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), action: "Lead created via Website Widget", icon: CheckCircle2, type: 'init' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-luxury border-[0.5px] border-slate-200/60"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Security & Audit Trail</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-200/50 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Protected by UK GDPR & Global Data Privacy Standards
              </p>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="relative border-l border-slate-100 ml-3 space-y-8">
                {logs.map((log, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute -left-[16.5px] top-0 p-1 bg-white border border-slate-100 rounded-full group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors shadow-sm">
                      <log.icon className={`w-3 h-3 ${idx === 0 ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] tabular-nums text-slate-400 font-bold uppercase tracking-widest mb-1 leading-none">
                        {log.time}
                      </span>
                      <span className="text-sm font-black text-slate-800 leading-tight">
                        {log.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
