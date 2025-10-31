import React, { useMemo } from 'react';

interface Props { data: any }

export const CustomerExperienceFeedbackCard: React.FC<Props> = ({ data }) => {
  const display = useMemo(() => {
    const summary = data?.data?.overall_summary ?? data?.overall_summary;
    if (summary && typeof summary === 'object') {
      const order = ['excellent','good','average','bad','poor'];
      const colors: Record<string,string> = {
        excellent: '#F6F4EE',
        good: '#DAD6C9',
        average: '#C4B89D',
        bad: '#C4AE9D',
        poor: '#D5DBDB',
      };
      return order.map((k) => ({
        label: k.charAt(0).toUpperCase()+k.slice(1),
        value: summary[k]?.count ?? 0,
        percent: summary[k]?.percentage ?? '0%',
        bg: colors[k] || '#fff',
        text: summary[k]?.text || undefined,
      }));
    }
    return [
      { label: 'Excellent', value: 0, percent: '0%', bg: '#F6F4EE' },
      { label: 'Good', value: 0, percent: '0%', bg: '#DAD6C9' },
      { label: 'Average', value: 0, percent: '0%', bg: '#C4B89D' },
      { label: 'Bad', value: 0, percent: '0%', bg: '#C4AE9D' },
      { label: 'Poor', value: 0, percent: '0%', bg: '#D5DBDB' },
    ];
  }, [data]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3  className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}>Customer Experience Feedback</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {display.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center h-[110px]" style={{ backgroundColor: item.bg, color: (item as any).text || '#000' }}>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm">{item.percent}</div>
            <div className="text-sm font-semibold mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerExperienceFeedbackCard;
