import React, { useMemo } from 'react';

interface Props { data: any }

export const CustomerExperienceFeedbackCard: React.FC<Props> = ({ data }) => {
  const { rating, total, breakdown, noRatings } = useMemo(() => {
    const summary = data?.data?.overall_summary ?? data?.overall_summary;
    const avgRating = data?.data?.average_customer_rating?.rating
      ?? data?.average_customer_rating?.rating
      ?? data?.data?.snapshot?.average_customer_rating?.rating
      ?? 0;
    const totalCount = summary
      ? Object.values(summary).reduce((acc: number, v: any) => acc + (v?.count ?? 0), 0)
      : 0;

    const order = ['excellent', 'good', 'average', 'bad', 'poor'] as const;
    const bd = order.map((k) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      count: summary?.[k]?.count ?? 0,
      percent: parseFloat(String(summary?.[k]?.percentage ?? '0')),
    }));

    return {
      rating: Number(avgRating) || 0,
      total: totalCount,
      breakdown: bd,
      noRatings: totalCount === 0,
    };
  }, [data]);

  const stars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="bg-white rounded-xl p-5 h-full">
      <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
        Customer Rating
      </h3>

      <div className="flex flex-col gap-3">
        {/* Big rating */}
        <div className="flex items-end gap-1">
          <span className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            {rating.toFixed(1)}
          </span>
          <span className="text-xl text-gray-400 mb-1">/5</span>
        </div>

        <p className="text-xs text-gray-500">Total Average Customer Rating</p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <svg key={i} className="w-6 h-6" viewBox="0 0 24 24" fill={i < filledStars ? '#F59E0B' : '#D1D5DB'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {noRatings ? (
          <p className="text-xs text-gray-400 italic">No ratings submitted this week</p>
        ) : (
          <div className="space-y-1.5 mt-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span className="w-16 text-gray-600 text-right">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: '#9EC8BA' }}
                  />
                </div>
                <span className="w-8 text-gray-500 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerExperienceFeedbackCard;
