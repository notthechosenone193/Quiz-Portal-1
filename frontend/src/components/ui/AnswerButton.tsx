import React from 'react';

type AnswerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface AnswerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position: AnswerPosition;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  revealed?: boolean;
  index?: number;
}

export const AnswerButton = React.forwardRef<HTMLButtonElement, AnswerButtonProps>(
  (
    {
      position,
      isSelected = false,
      isCorrect = false,
      isIncorrect = false,
      revealed = false,
      index = 0,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // M3 color mapping for 4-option grid
    const colorMap = {
      'top-left': 'from-blue-500 to-blue-600', // Blue
      'top-right': 'from-red-500 to-red-600', // Red
      'bottom-left': 'from-amber-500 to-amber-600', // Yellow
      'bottom-right': 'from-emerald-500 to-emerald-600', // Green
    };

    // Get label for accessibility
    const labelMap = {
      'top-left': 'A',
      'top-right': 'B',
      'bottom-left': 'C',
      'bottom-right': 'D',
    };

    const baseStyles =
      'relative flex flex-col items-center justify-center gap-md aspect-square rounded-lg font-medium transition-all duration-200 min-h-[120px] cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(75,40,109,0.35)]';

    const colorGradient = colorMap[position];
    const label = labelMap[position];

    // State-based styling
    let stateStyles = `bg-gradient-to-br ${colorGradient} text-white shadow-elevation-2 hover:shadow-elevation-3`;

    if (revealed) {
      if (isCorrect) {
        stateStyles = 'bg-success text-white shadow-elevation-3 ring-2 ring-success/50 animate-scale-in';
      } else if (isIncorrect) {
        stateStyles = 'bg-error/20 text-error border-2 border-error opacity-50';
      }
    }

    if (isSelected && !revealed) {
      stateStyles += ' ring-4 ring-tertiary/50 scale-95';
    }

    const ariaLabel = `Option ${label}${
      revealed ? (isCorrect ? ', correct answer' : isIncorrect ? ', incorrect answer' : '') : isSelected ? ', selected' : ''
    }`;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${stateStyles} ${className}`}
        disabled={revealed}
        aria-pressed={isSelected}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Label badge */}
        <span className="absolute top-lg left-lg inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 font-bold text-sm">
          {label}
        </span>

        {/* Persistent non-color "this is my pick" indicator, shown before reveal too */}
        {isSelected && !revealed && (
          <div className="absolute bottom-lg right-lg" aria-hidden="true">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/90 text-current text-sm font-bold">
              ✓
            </span>
          </div>
        )}

        {/* Main content */}
        <span className="text-body-md text-center px-lg max-h-[60px] overflow-y-auto">
          {children}
        </span>

        {/* Reveal indicator */}
        {revealed && (
          <div className="absolute bottom-lg right-lg" aria-hidden="true">
            {isCorrect ? (
              <span className="text-2xl">✓</span>
            ) : isIncorrect ? (
              <span className="text-2xl">✗</span>
            ) : null}
          </div>
        )}

        {/* Ripple effect on click */}
        <style>{`
          @keyframes ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              width: 300px;
              height: 300px;
              opacity: 0;
            }
          }

          .ripple::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 600ms ease-out;
          }
        `}</style>
      </button>
    );
  }
);

AnswerButton.displayName = 'AnswerButton';
