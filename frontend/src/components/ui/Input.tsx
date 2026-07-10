import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, icon, fullWidth = true, className = '', ...props },
    ref
  ) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`flex flex-col gap-sm ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface px-sm">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-lg top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`
              w-full px-lg py-md
              min-h-[44px]
              rounded-lg
              border border-outline
              bg-surface
              text-body-md text-on-surface
              transition-all duration-200
              placeholder:text-outline
              focus:outline-none
              focus:border-primary
              focus:bg-primary-container
              focus:ring-1
              focus:ring-primary
              focus:shadow-elevation-1
              disabled:opacity-38
              disabled:cursor-not-allowed
              ${error ? 'border-error focus:border-error focus:bg-white focus:ring-error' : ''}
              ${icon ? 'pl-12' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-label-md text-error px-sm">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-label-md text-outline px-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
