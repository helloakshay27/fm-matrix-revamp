import React from 'react';

export interface RevenueGenerationOverviewCardProps {
  title?: string;
  totalRevenue?: number | string | null;
}

export const RevenueGenerationOverviewCard: React.FC<RevenueGenerationOverviewCardProps> = ({
  title = 'Revenue Generation Overview',
  totalRevenue,
}) => {
  const [companyName, setCompanyName] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const name = typeof window !== 'undefined' ? localStorage.getItem('selectedCompany') : null;
      if (name) setCompanyName(name);
    } catch {
      // ignore read errors
    }
  }, []);

  return (
    <div className="bg-white rounded-lg border border-analytics-border">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-analytics-border">
        <h3 className="font-semibold text-analytics-text text-sm sm:text-base truncate">{title}</h3>
      </div>
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-[#dfd9ce] rounded-md p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-0">
            <div className="flex-1">
              <p className="text-xs sm:text-sm italic text-analytics-muted">Total Revenue from</p>
              <p className="text-base sm:text-lg lg:text-xl font-bold truncate">{companyName || '—'}</p>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">
              {totalRevenue ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGenerationOverviewCard;
