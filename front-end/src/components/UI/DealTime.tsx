import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface DealTimerProps {
  title?: string;
  subtitle?: string;
  targetDate?: string | Date; 
  className?: string;
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-[#606060] text-white rounded-[0.25rem] w-[3rem] h-[3.5rem]">
      <span className="text-[1.125rem] font-bold leading-none">{value.toString().padStart(2, '0')}</span>
      <span className="text-[0.75rem] font-normal mt-[0.125rem] text-gray-200">{label}</span>
    </div>
  );

export const DealTimer: React.FC<DealTimerProps> = ({
  title = "Deals and offers",
  subtitle = "Hygiene equipments",
  targetDate,
  className
}) => {
  
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 34,
    seconds: 56
  });

  
  useEffect(() => {
    
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval); 
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, [targetDate]);

  
  

  return (
    <div className={cn("p-[1.25rem] h-full flex flex-col min-w-[15rem] items-start justify-items-start ", className)}>
      <h3 className="text-[1.25rem] font-bold text-gray-900 leading-tight mb-1">{title}</h3>
      <p className="text-[1rem] text-gray-500 mb-4">{subtitle}</p>
      
      <div className="flex gap-[0.4rem]">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hour" />
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
};