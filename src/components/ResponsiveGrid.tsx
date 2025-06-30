
import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  spacing = 'normal',
}) => {
  const spacingClass = {
    tight: 'component-spacing',
    normal: 'space-y-6 md:space-y-8 xl:space-y-10',
    loose: 'space-y-8 md:space-y-12 xl:space-y-16',
  }[spacing];

  return (
    <div className={`grid-responsive ${spacingClass} ${className}`}>
      {children}
    </div>
  );
};
