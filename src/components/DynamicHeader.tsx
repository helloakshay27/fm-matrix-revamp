import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

export const DynamicHeader: React.FC = () => {
  const { currentSection } = useLayout();

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="px-6 py-3">
        <h1 className="text-xl font-semibold text-foreground">
          {currentSection || 'Dashboard'}
        </h1>
      </div>
    </div>
  );
};