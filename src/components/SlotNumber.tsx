import React from 'react';
import CountUp from 'react-countup';

interface SlotNumberProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const SlotNumber: React.FC<SlotNumberProps> = ({ value, prefix = "", className = "" }) => {
  return (
    <div className={className}>
      {prefix}
      <CountUp
        start={0}
        end={value}
        duration={0.8}
        separator=","
        decimals={0}
      />
    </div>
  );
};
