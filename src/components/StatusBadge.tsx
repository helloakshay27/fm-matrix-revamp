import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Status badge variants using class-variance-authority
const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        'in-use': 'bg-green-100 text-green-800 border border-green-200',
        'in-store': 'bg-blue-100 text-blue-800 border border-blue-200',
        'breakdown': 'bg-red-100 text-red-800 border border-red-200',
        'disposed': 'bg-gray-100 text-gray-800 border border-gray-200',
        'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        'maintenance': 'bg-orange-100 text-orange-800 border border-orange-200',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'pending',
      size: 'default',
    },
  }
);

// Define the status variant type
type StatusVariant = 'in-use' | 'in-store' | 'breakdown' | 'disposed' | 'pending' | 'maintenance';

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string;
}

// Function to convert status string to variant
const getVariantFromStatus = (statusValue?: string): StatusVariant => {
  if (!statusValue) return 'pending';
  
  const normalizedStatus = statusValue.toLowerCase().replace(/\s+/g, '-');
  
  // Map common status values to variants
  const statusMap: Record<string, StatusVariant> = {
    'in-use': 'in-use',
    'in-store': 'in-store',
    'breakdown': 'breakdown',
    'disposed': 'disposed',
    'pending': 'pending',
    'maintenance': 'maintenance',
  };
  
  return statusMap[normalizedStatus] || 'pending';
};

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, status, children, ...props }, ref) => {
    const effectiveVariant = status ? getVariantFromStatus(status) : variant;
    
    return (
      <div
        className={cn(statusBadgeVariants({ variant: effectiveVariant, size, className }))}
        ref={ref}
        {...props}
      >
        {children || status}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };