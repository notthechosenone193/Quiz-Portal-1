import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  autoClose?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, autoClose = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [onClose, autoClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div
      role={type === 'success' ? 'status' : 'alert'}
      aria-live={type === 'success' ? 'polite' : 'assertive'}
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} ${textColor}`}
    >
      <Icon size={20} aria-hidden="true" />
      <p>{message}</p>
      <button onClick={onClose} aria-label="Dismiss notification" className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
};
