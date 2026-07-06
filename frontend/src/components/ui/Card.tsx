import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  variant?: 'filled' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ elevated = false, variant = 'filled', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg p-lg transition-all duration-200';

    const variantStyles = {
      filled: `bg-surface border border-outline-variant ${
        elevated ? 'shadow-elevation-3 hover:shadow-elevation-5' : 'shadow-elevation-1 hover:shadow-elevation-2'
      }`,
      outlined: 'border-2 border-outline bg-transparent',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
