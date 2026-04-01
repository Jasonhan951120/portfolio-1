import React from 'react';
// Static rendering only - AntiGravity removal of performance-heavy animations
import { useDashboardStore } from '../store/useDashboardStore';

interface SlotNumberProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const SlotNumber: React.FC<SlotNumberProps> = ({ value, prefix, className = "" }) => {
  const region = useDashboardStore(state => state.region);
  const currencySymbol = region === 'UK' ? '£' : '$';
  
  const displayValue = Math.floor(value).toLocaleString();

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className="text-2xl text-slate-400 font-semibold mr-1">{prefix !== undefined ? prefix : currencySymbol}</span>
      <span>{displayValue}</span>
    </div>
  );
};
