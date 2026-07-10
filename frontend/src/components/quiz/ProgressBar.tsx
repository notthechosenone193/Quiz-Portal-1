import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">
          Question <span style={{ color: '#4B286D' }}>{current}</span> of {total}
        </h2>
        <span className="text-xs font-medium text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: '#2B8000',
            boxShadow: '0 0 8px rgba(43, 128, 0, 0.4)',
          }}
        />
      </div>
    </div>
  );
};
