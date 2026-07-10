import React from 'react';

interface TimerBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  animated?: boolean;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  current,
  total,
  showLabel = true,
  animated = true,
}) => {
  const percentage = (current / total) * 100;

  // M3 color transitions: green (safe) → yellow (warning) → red (critical)
  const getColor = (percent: number) => {
    if (percent > 66) return 'from-success to-success'; // Green
    if (percent > 33) return 'from-warning to-warning'; // Yellow
    return 'from-error to-error'; // Red
  };

  const barColor = getColor(percentage);

  // Seconds remaining
  const secondsRemaining = Math.ceil(current);

  return (
    <div className="flex flex-col gap-md w-full">
      {/* Timer display with label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-label-md text-outline">Timer</span>
          <span className={`text-title-lg font-medium ${percentage > 33 ? 'text-on-surface' : 'text-error animate-pulse'}`}>
            {secondsRemaining}s
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div className="relative w-full h-2 rounded-full bg-surface-dim overflow-hidden shadow-elevation-1">
        {/* Animated progress fill */}
        <div
          className={`h-full rounded-full transition-all duration-200 ease-out bg-gradient-to-r ${barColor} ${
            animated && percentage < 20 ? 'animate-pulse-ring' : ''
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />

        {/* Subtle shine effect */}
        {animated && (
          <div
            className="absolute top-0 left-0 h-full w-1 bg-gradient-to-r from-white/40 to-transparent rounded-full opacity-60"
            style={{
              left: `${percentage}%`,
              animation: percentage > 0 && percentage < 100 ? 'slideRight 2s ease-in-out infinite' : 'none',
            }}
          />
        )}
      </div>

      {/* Percentage text */}
      <div className="flex justify-between items-center">
        <span className="text-label-md text-outline">{Math.round(percentage)}%</span>
        <span className="text-label-md text-outline">{total}s</span>
      </div>

      <style>{`
        @keyframes slideRight {
          0% {
            left: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

TimerBar.displayName = 'TimerBar';
