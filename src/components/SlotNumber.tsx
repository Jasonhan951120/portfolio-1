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
    <div className={className}>
      {prefix !== undefined ? prefix : currencySymbol}
      <span>{displayValue}</span>
    </div>
  );
};
