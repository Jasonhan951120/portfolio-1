import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';

interface SlotNumberProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const SlotNumber: React.FC<SlotNumberProps> = ({ value, prefix, className = "" }) => {
  const region = useDashboardStore(state => state.region);
  const currencySymbol = region === 'UK' ? '£' : '$';
  
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  });

  const displayValue = useTransform(springValue, (latest) => 
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className={className}>
      {prefix !== undefined ? prefix : currencySymbol}
      <motion.span>{displayValue}</motion.span>
    </div>
  );
};
