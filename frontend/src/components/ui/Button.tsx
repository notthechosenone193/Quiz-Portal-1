import React from 'react';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'secondary' | 'primary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      size = 'medium',
      isLoading = false,
      icon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base TELUS DS styles — Helvetica Neue, pill shape
    const baseStyles =
      'inline-flex items-center justify-center gap-3 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden';

    // Size variants
    const sizeStyles = {
      small: 'px-3 py-2 min-h-[36px] text-label-md',
      medium: 'px-6 py-3 min-h-[44px] text-body-md',
      large: 'px-8 py-4 min-h-[48px] text-body-lg',
    };

    // TELUS Design System button variants — full pill radius (#radius-full)
    const variantStyles = {
      filled:
        'bg-[#2B8000] text-white border-2 border-[#2B8000] rounded-full hover:bg-[#1e5c00] hover:border-[#1e5c00] hover:shadow-md active:bg-[#153700] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
      tonal:
        'bg-[#F4F9F2] text-[#2B8000] border-2 border-[#2B8000] rounded-full hover:bg-[#E8F5E9] hover:shadow-sm active:bg-[#D4EDDA] focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
      outlined:
        'bg-white text-[#2B8000] border-2 border-[#2B8000] rounded-full hover:bg-[#F4F9F2] hover:shadow-sm active:bg-[#E8F5E9] focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
      text:   'bg-transparent text-[#4B286D] underline border-2 border-transparent rounded-full hover:bg-[#F2EFF4] focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
      secondary: 'bg-[#F2EFF4] text-[#4B286D] border-2 border-[#4B286D] rounded-full hover:bg-[#E0D6E9] hover:shadow-sm focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
      danger: 'bg-[#C12335] text-white border-2 border-[#C12335] rounded-full hover:bg-[#a01c2c] hover:shadow-md focus-visible:shadow-[0_0_0_3px_rgba(193,35,53,0.35)]',
      primary: 'bg-[#2B8000] text-white border-2 border-[#2B8000] rounded-full hover:bg-[#1e5c00] hover:shadow-md focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]',
    };

    // Width
    const widthStyle = fullWidth ? 'w-full' : '';

    // Combine classes
    const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={combinedClassName}
        {...props}
      >
        {icon && <span className="flex items-center justify-center">{icon}</span>}
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
