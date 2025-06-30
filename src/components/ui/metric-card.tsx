
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'red' | 'green' | 'blue' | 'yellow';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconColorClasses = {
  red: 'bg-red-500',
  green: 'bg-green-500', 
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500'
};

const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();
  return num.toLocaleString();
};

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'red',
  loading = false,
  onClick,
  className
}: MetricCardProps) => {
  if (loading) {
    return <MetricCardSkeleton className={className} />;
  }

  const cardContent = (
    <div className={cn(
      // Base styles
      "bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200",
      // Shadow styles
      "shadow-[0px_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.15)]",
      // Responsive sizes
      "w-[260px] h-[140px]", // Mobile default
      "md:w-[280px] md:h-[160px]", // Tablet
      "lg:w-[300px] lg:h-[180px]", // Desktop
      // Focus and interaction
      onClick && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      className
    )}
    onClick={onClick}
    tabIndex={onClick ? 0 : undefined}
    role={onClick ? "button" : undefined}
    aria-label={onClick ? `${title}: ${formatNumber(value)}` : undefined}
    onKeyDown={(e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <div className="flex flex-col h-full">
      {/* Icon */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center mb-4",
        iconColorClasses[iconColor]
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Value */}
        <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">
          {formatNumber(value)}
        </div>
        
        {/* Title */}
        <div className="text-sm text-gray-500 font-medium">
          {title}
        </div>
      </div>
    </div>
  </div>
  );

  return cardContent;
};

export const MetricCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-6 animate-pulse",
      "w-[260px] h-[140px]", // Mobile default
      "md:w-[280px] md:h-[160px]", // Tablet
      "lg:w-[300px] lg:h-[180px]", // Desktop
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Icon skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 mb-4" />
        
        {/* Content skeleton */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Value skeleton */}
          <div className="h-8 bg-gray-200 rounded mb-2 w-3/4" />
          
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};
