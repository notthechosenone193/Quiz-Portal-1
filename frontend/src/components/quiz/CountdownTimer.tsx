import React from 'react';
import { useTimer } from '../../hooks/useTimer';

interface CountdownTimerProps {
  seconds: number;
  onExpire: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, onExpire }) => {
  const remaining = useTimer(seconds, onExpire);

  // Calculate time remaining percentage
  const percentageRemaining = (remaining / seconds) * 100;

  // Color transitions: Green (>33%) → Yellow (33-10%) → Red (<10%)
  let timerColor = '#2B8000'; // Green (Accessible Green)
  let textColor = 'text-green-600';
  let shouldPulse = false;

  if (percentageRemaining <= 33) {
    if (percentageRemaining <= 10) {
      timerColor = '#EF4444'; // Red
      textColor = 'text-red-600';
      shouldPulse = true;
    } else {
      timerColor = '#FFA500'; // Yellow
      textColor = 'text-yellow-600';
    }
  }

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (remaining / seconds) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative w-32 h-32 ${shouldPulse ? 'animate-timer-pulse' : ''}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={timerColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s linear, stroke 300ms ease-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold transition-colors duration-300 ${textColor}`}>
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
};
