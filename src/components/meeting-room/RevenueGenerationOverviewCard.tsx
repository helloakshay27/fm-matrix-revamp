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
      <div className="px-4 py-3 border-b border-analytics-border">
        <h3 className="font-semibold text-analytics-text">{title}</h3>
      </div>
      <div className="p-6">
        <div className="bg-[#dfd9ce] rounded-md p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm italic text-analytics-muted">Total Revenue from</p>
              <p className="text-xl font-bold">{companyName || '—'}</p>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {totalRevenue ?? '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGenerationOverviewCard;
