import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ label, min = 0, max = 100, value, onChange, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-secondary"
          {...props}
        />
        {value && <span className="text-sm text-gray-600 text-center">{value}</span>}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
