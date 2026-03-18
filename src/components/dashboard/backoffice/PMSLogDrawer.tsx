import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, FileText, CheckCircle, AlertCircle, Clock, Database, Search, Shield, ArrowUpRight } from 'lucide-react';

interface PMSLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  filename: string;
  validRows: number;
  skippedRows: number;
  status: 'Success' | 'Warning' | 'Pending';
  processedBy: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '2026-03-14 10:45', filename: 'Patient_List_March.csv', validRows: 124, skippedRows: 3, status: 'Success', processedBy: 'Dr. Sarah Smith' },
  { id: '2', timestamp: '2026-03-13 15:20', filename: 'Waitlist_Export.csv', validRows: 45, skippedRows: 12, status: 'Warning', processedBy: 'Reception_Lead' },
  { id: '3', timestamp: '2026-03-12 09:12', filename: 'Clinic_Internal_Sync.csv', validRows: 312, skippedRows: 0, status: 'Success', processedBy: 'System_Auto' },
  { id: '4', timestamp: '2026-03-11 17:05', filename: 'Invisalign_leads_Feb.csv', validRows: 88, skippedRows: 2, status: 'Success', processedBy: 'Marketing_Bot' },
];

export function PMSLogDrawer({ isOpen, onClose }: PMSLogDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.processedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-[210] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">PMS Sync Logs</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enforcing Zero-Retention Protocol</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Records Processed</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">1,042</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sync Success Rate</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">99.8%</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search by filename or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all"
                />
              </div>

              {/* Logs List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Sync Events</h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500">
                    <Database className="w-2.5 h-2.5" /> Live
                  </div>
                </div>

                {loading ? (
                  // Skeleton State
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-slate-200 rounded-full" />
                          <div className="h-3 w-24 bg-slate-100 rounded-full" />
                        </div>
                        <div className="h-6 w-16 bg-slate-200 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <div className="h-3 w-20 bg-slate-100 rounded-full" />
                        <div className="h-3 w-20 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  ))
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={log.id}
                      className="p-6 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            log.status === 'Success' ? 'bg-emerald-500' : 
                            log.status === 'Warning' ? 'bg-amber-500' : 'bg-blue-500'
                          } ${log.status === 'Pending' ? 'animate-pulse' : ''}`} />
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{log.filename}</h4>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                          log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 
                          log.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] text-slate-500 font-medium">{log.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] text-slate-500 font-medium">{log.validRows} valid rows</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] text-slate-500 font-medium font-mono">{log.processedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[11px] text-slate-500 font-medium">{log.skippedRows} skipped</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">No logs found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search query</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                <ArrowUpRight className="w-4 h-4" />
                Trigger Manual Sync
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
