import React, { useState } from 'react';

const ExpertModeDrawer = ({ isOpen, onClose }: any) => {
  const [isExpertModeActive, setIsExpertModeActive] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '300px', height: '100vh', background: 'white', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', zIndex: 9999, padding: '20px' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Expert Settings</h2>
        <button 
          onClick={() => onClose?.()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex items-center justify-between p-4 mt-6 bg-slate-900 rounded-xl border border-white/10 shadow-sm">
        <span className="text-sm font-medium text-slate-200">Enable Expert Mode</span>
        <button
          onClick={() => setIsExpertModeActive?.((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isExpertModeActive ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
              isExpertModeActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <p className="mt-6 text-sm text-slate-500">The drawer is working! We will add features back one by one later.</p>
    </div>
  );
};

export default ExpertModeDrawer;
