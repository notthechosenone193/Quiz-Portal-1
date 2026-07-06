import React from 'react';
import { BackgroundFlares } from '../ui/BackgroundFlares';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background flares */}
      <BackgroundFlares />

      {/* Content with higher z-index */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">{children}</div>
    </div>
  );
};
