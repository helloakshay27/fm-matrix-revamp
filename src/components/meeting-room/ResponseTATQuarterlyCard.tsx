import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLOR_LAST = '#DA7756';
const COLOR_CURRENT = '#9EC8BA';

interface ResponseTATQuarterlyCardProps {
  data: any;
  className?: string;
  dateRange?: { startDate: Date; endDate: Date };
}

// Helper function to get period labels
const getPeriodLabels = (startDate: Date, endDate: Date) => {
  const monthsDiff = Math.abs(
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
  );

  if (monthsDiff <= 1) {
    return {
      periodLabel: 'Weekly',
      periodUnit: 'Week',
      lastLabel: 'Last Week',
      currentLabel: 'Current Week',
    };
  } else if (monthsDiff <= 3) {
    return {
      periodLabel: 'Monthly',
      periodUnit: 'Month',
      lastLabel: 'Last Month',
      currentLabel: 'Current Month',
    };
  } else if (monthsDiff <= 6) {
    return {
      periodLabel: 'Quarterly',
      periodUnit: 'Quarter',
      lastLabel: 'Last Quarter',
      currentLabel: 'Current Quarter',
    };
  } else {
    return {
      periodLabel: 'Yearly',
      periodUnit: 'Year',
      lastLabel: 'Previous',
      currentLabel: 'Current',
    };
  }
};


export const ResponseTATQuarterlyCard: React.FC<ResponseTATQuarterlyCardProps> = ({
  data,
  className,
  dateRange,
}) => {
  const { lastLabel, currentLabel } = useMemo(() => {
    if (dateRange) {
      return getPeriodLabels(dateRange.startDate, dateRange.endDate);
    }
    return {
      periodLabel: 'Quarterly',
      periodUnit: 'Quarter',
      lastLabel: 'Previous Period',
      currentLabel: 'Current Period',
    };
  }, [dateRange]);

  // Transform data based on API response structure
  const chartData = useMemo(() => {
    if (!data) return [];

    // Check for nested data.data.X OR direct data.X
    const performanceArray =
      data?.data?.performance_data ??
      data?.performance_data ??
      data?.data?.response_performance_data ??
      data?.response_performance_data ??
      [];

    console.log('🔍 ResponseTATQuarterlyCard - performanceArray:', performanceArray);

    // Handle new API structure with performance_data array
    if (Array.isArray(performanceArray) && performanceArray.length > 0) {
      return performanceArray
        .filter((item: any) => {
          // Filter out sites with no data in both periods
          const hasCurrentData = item.current_period?.response_tat?.total_tickets > 0;
          const hasPreviousData = item.previous_period?.response_tat?.total_tickets > 0;
          return hasCurrentData || hasPreviousData;
        })
        .map((item: any) => {
          const site = item.center_name || item.site_name || item.site || '';
          return {
            site,
            last: parseFloat(
              item.previous_period?.response_tat?.achieved_percentage || 0
            ),
            current: parseFloat(
              item.current_period?.response_tat?.achieved_percentage || 0
            ),
          };
        });
    }

    // Fallback for old structure
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => ({
        site: item.site || '',
        last: parseFloat(item.responseLast || 0),
        current: parseFloat(item.responseCurrent || 0),
      }));
    }

    return [];
  }, [data]);

  return (
    <Card className={`h-full flex flex-col border-gray-300 bg-white ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-300">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Response Achieved (TAT in Percentage)
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        {!data || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLOR_LAST }} />
                <span className="text-xs" title={lastLabel}>
                  {lastLabel.length > 50 ? 'Previous Period' : lastLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLOR_CURRENT }} />
                <span className="text-xs" title={currentLabel}>
                  {currentLabel.length > 50 ? 'Current Period' : currentLabel}
                </span>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
                barSize={28}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="site"
                  angle={-45}
                  textAnchor="end"
                  height={65}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(v: number, name: string) => [`${v}%`, name]}
                />
                <Bar dataKey="last" fill={COLOR_LAST} name={lastLabel} radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" fill={COLOR_CURRENT} name={currentLabel} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Note section */}
            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> The bar graph represents the
                response TAT achieved in the current and previous quarter.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseTATQuarterlyCard;
