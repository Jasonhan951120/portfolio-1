import React, { useState } from 'react';

const ExpertModeDrawer = ({ 
  isOpen, 
  onClose, 
  onOpenPMSLogs, 
  onOpenClinicMeta, 
  onThemeChange 
}: any) => {
  const [isExpertModeActive, setIsExpertModeActive] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);
  const [patientReminders, setPatientReminders] = useState(true);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '400px', height: '100vh', background: 'white', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', zIndex: 9999, padding: '24px', overflowY: 'auto' }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Expert Settings</h2>
        <button 
          onClick={() => onClose?.()}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          Close
        </button>
      </div>

      {/* Main Expert Toggle */}
      <div className="flex items-center justify-between p-5 mb-8 bg-slate-900 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <p className="text-sm font-bold text-slate-100 uppercase tracking-wider">Expert Mode</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase">Global Safety Override</p>
        </div>
        <button
          onClick={() => setIsExpertModeActive?.((prev) => !prev)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
            isExpertModeActive ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
              isExpertModeActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="space-y-8">
        {/* Theme Settings */}
        <section>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Theme Customization</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={(e) => onThemeChange?.('light')}
              className="flex items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all group"
            >
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase">Light Mode</span>
            </button>
            <button 
              onClick={(e) => onThemeChange?.('dark')}
              className="flex items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-black transition-all group"
            >
              <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase">Dark Mode</span>
            </button>
          </div>
        </section>

        {/* System Actions */}
        <section>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">System Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onOpenPMSLogs?.()}
              className="w-full flex items-center justify-between p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg"
            >
              <span className="text-sm font-black uppercase">Open PMS Logs</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">→</div>
            </button>
            <button 
              onClick={() => onOpenClinicMeta?.()}
              className="w-full flex items-center justify-between p-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-all"
            >
              <span className="text-sm font-black uppercase">Clinic Metadata</span>
              <div className="w-8 h-8 bg-slate-900/10 rounded-full flex items-center justify-center">→</div>
            </button>
          </div>
        </section>

        {/* Automation Settings */}
        <section>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Automation Settings</h3>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-700">Auto-assign Leads</span>
              <button 
                onClick={() => setAutoAssign?.(prev => !prev)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoAssign ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoAssign ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm font-bold text-slate-700">Patient Reminders</span>
              <button 
                onClick={() => setPatientReminders?.(prev => !prev)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${patientReminders ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${patientReminders ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <p className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-[3px]">
        End of Expert Console
      </p>
    </div>
  );
};

export default ExpertModeDrawer;
