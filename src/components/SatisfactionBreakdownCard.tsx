import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface SatisfactionItem {
  // Emoji character to render (e.g., "😫", "😕", "😐", "🙂", "😍")
  emoji: string;
  // Display label (optional, for accessibility or tooltip)
  label?: string;
  // Count of responses for this emoji bucket
  count: number;
}

interface SatisfactionBreakdownCardProps {
  title?: string;
  // Exactly 5 items expected in the order of worst -> best
  items: SatisfactionItem[];
  className?: string;
}

const SatisfactionBreakdownCard: React.FC<SatisfactionBreakdownCardProps> = ({
  title = 'Satisfaction Breakdown',
  items,
  className = '',
}) => {
  const { total, percents, avgScore } = useMemo(() => {
    const totalCount = items?.reduce((sum, it) => sum + (it?.count || 0), 0) || 0;
    const percents = (items || []).map((it) => {
      if (!totalCount) return 0;
      return (it.count / totalCount) * 100;
    });
    // map scores 1..5 to the 5 emojis respectively
    const avg = totalCount
      ? (items || []).reduce((acc, it, idx) => acc + it.count * (idx + 1), 0) / totalCount
      : 0;
    return { total: totalCount, percents, avgScore: avg };
  }, [items]);

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#1A1A1A]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header row */}
        <div className="grid grid-cols-7 gap-4 items-center border rounded-lg p-4">
          <div className="col-span-1">
            <div className="text-sm font-semibold text-gray-700">Option</div>
            <div className="text-xs text-gray-500">Option</div>
          </div>

          {/* 5 emoji columns */}
          {(items || []).slice(0, 5).map((it, idx) => (
            <div key={idx} className="col-span-1 flex flex-col items-center justify-center gap-1">
              <div className="text-2xl" title={it.label || ''}>{it.emoji}</div>
              <div className="text-xs text-gray-700">
                {percents[idx].toFixed(2)}% ({it.count})
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="col-span-1 text-center">
            <div className="text-sm font-semibold text-gray-700">Total</div>
            <div className="text-sm text-gray-900">{total}</div>
          </div>
          <div className="col-span-1 text-center">
            <div className="text-sm font-semibold text-gray-700">Avg. Score</div>
            <div className="text-sm text-gray-900">{avgScore.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SatisfactionBreakdownCard;
