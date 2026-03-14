import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Zap, AlertCircle, ChevronDown, Table } from 'lucide-react';
import { ColumnMapping, ColumnType } from '../../../lib/utils/csvHeuristics';

interface SmartMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: string[];
  data: any[]; // Preview data
  initialMappings: ColumnMapping[];
  onConfirm: (mappings: ColumnMapping[], saveTemplate: boolean) => void;
}

const COLUMN_TYPES: { value: ColumnType; label: string; icon: string }[] = [
  { value: 'patientName', label: 'Patient Name', icon: '👤' },
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'potentialValue', label: 'Potential Value', icon: '£' },
  { value: 'appointmentDate', label: 'Appointment Date', icon: '📅' },
  { value: 'service', label: 'Service/Treatment', icon: '🏥' },
  { value: 'status', label: 'Lead Status', icon: '📊' },
  { value: 'unknown', label: 'Ignore / Unknown', icon: '🚫' },
];

export function SmartMappingModal({ isOpen, onClose, headers, data, initialMappings, onConfirm }: SmartMappingModalProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>(initialMappings);
  const [saveTemplate, setSaveTemplate] = useState(true);

  const handleMappingChange = (header: string, type: ColumnType) => {
    setMappings(prev => prev.map(m => m.header === header ? { ...m, type, confidence: 1 } : m));
  };

  const getMappingForHeader = (header: string) => mappings.find(m => m.header === header);

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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[210] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-5xl bg-white rounded-[44px] shadow-[0_40px_80px_rgba(0,0,0,0.15)] pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/60"
            >
              {/* Header section */}
              <div className="p-8 pb-4 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 py-1 px-3 rounded-full border border-emerald-100/50">Smart Mapping Active</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify & Match Data</h2>
                  <p className="text-sm text-slate-500 font-medium">Verify how we've mapped your PMS columns. Zero-Retention local processing enabled.</p>
                </div>
                <button onClick={onClose} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-[20px] transition-all text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Content Area: Scrollable Mapping Table */}
              <div className="flex-1 overflow-auto p-8 pt-2 custom-scrollbar">
                <div className="inline-block min-w-full align-middle">
                  <div className="border border-slate-100 rounded-[32px] overflow-hidden bg-slate-50/30">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead>
                        <tr className="bg-white/50">
                          {headers.map(header => {
                            const mapping = getMappingForHeader(header);
                            const isLowConfidence = mapping && mapping.confidence < 0.8 && mapping.type !== 'unknown';
                            
                            return (
                              <th key={header} className="p-5 text-left align-top min-w-[200px]">
                                <div className="space-y-3">
                                  {/* Header Label */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block truncate max-w-[140px]">{header}</span>
                                    {isLowConfidence && (
                                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" title="Low Confidence Detection" />
                                    )}
                                  </div>

                                  {/* Select Input Styling */}
                                  <div className={`relative group transition-all duration-300 ${isLowConfidence ? 'ring-2 ring-orange-200 ring-offset-2 rounded-2xl' : ''}`}>
                                    <select
                                      value={mapping?.type || 'unknown'}
                                      onChange={(e) => handleMappingChange(header, e.target.value as ColumnType)}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                                    >
                                      {COLUMN_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                          {type.label}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white/40">
                        {data.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            {headers.map(header => (
                              <td key={header} className="px-6 py-4 text-[13px] text-slate-600 font-medium truncate max-w-[200px]">
                                {String(row[header] || '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="mt-8 p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50 flex items-start gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-1.5">
                        Privacy First Architecture
                      </h4>
                      <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                        We use local Regex heuristics to detect data types. No patient data is sent to our servers or AI APIs for mapping. Your CSV never leaves this browser instance in plain text.
                      </p>
                   </div>
                </div>
              </div>

              {/* Footer section */}
              <div className="p-8 pt-0 flex items-center justify-between bg-white border-t border-slate-50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${saveTemplate ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={saveTemplate} 
                      onChange={() => setSaveTemplate(!saveTemplate)} 
                    />
                    <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${saveTemplate ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Save this mapping for future uploads</span>
                </label>

                <div className="flex gap-4">
                  <button onClick={onClose} className="px-8 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[13px] font-bold text-slate-400 transition-all">Cancel</button>
                  <button 
                    onClick={() => onConfirm(mappings, saveTemplate)}
                    className="px-10 py-4 bg-slate-900 hover:bg-black rounded-2xl text-[13px] font-black text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
                  >
                    Confirm & Start Sync
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
