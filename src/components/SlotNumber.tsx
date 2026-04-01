import React, { useState, useEffect } from 'react';
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
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easing * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className="text-3xl text-slate-400 font-extralight mr-1">{prefix !== undefined ? prefix : currencySymbol}</span>
      <span>{displayValue.toLocaleString()}</span>
    </div>
  );
};
