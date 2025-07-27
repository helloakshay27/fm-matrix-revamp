import React from 'react';
import { Loader2 } from 'lucide-react';

interface AnalyticsGridProps {
  children: React.ReactNode;
  loading?: boolean;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({ children, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-analytics-muted">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
      {children}
    </div>
  );
};