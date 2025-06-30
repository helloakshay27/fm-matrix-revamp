
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MetricCardGrid = ({ children, className }: MetricCardGridProps) => {
  return (
    <div className={cn(
      // Container styles
      "w-full max-w-[1200px] mx-auto",
      // Responsive grid
      "grid grid-cols-1 gap-4", // Mobile: 1 column, 16px gaps
      "md:grid-cols-2 md:gap-5", // Tablet: 2 columns, 20px gaps  
      "lg:grid-cols-3 lg:gap-6", // Desktop: 3 columns, 24px gaps
      // Center items for smaller screens
      "place-items-center lg:place-items-stretch",
      className
    )}>
      {children}
    </div>
  );
};
