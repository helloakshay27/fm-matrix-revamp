import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TopOverdueChecklistMatrix = {
  categories: string[];
  siteRows: Array<{
    site_name: string;
    categories: Array<{ category: string; overdue_percentage: number }>;
  }>;
};

export interface TopOverdueChecklistsCenterwiseCardProps {
  title?: string;
  matrix: TopOverdueChecklistMatrix;
  loading?: boolean;
}

const fmtPct = (n: number) => `${Number(n || 0).toFixed(0)}%`;

export const TopOverdueChecklistsCenterwiseCard: React.FC<TopOverdueChecklistsCenterwiseCardProps> = ({
  title = 'Top 10 Overdue Checklists – Center-wise Contribution Comparison',
  matrix,
  loading = false,
}) => {
  const categories = Array.isArray(matrix?.categories) ? matrix.categories : [];
  const rows = Array.isArray(matrix?.siteRows) ? matrix.siteRows : [];

  return (
    <Card className="border border-gray-300">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-[#DAD6C9] text-[#C72030] text-left">
                <th className="py-3 px-4">Site Name</th>
                {categories.map((cat, idx) => (
                  <th key={idx} className="py-3 px-2 text-center">{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={(categories.length || 0) + 1} className="py-6 text-center text-gray-500">
                    Loading top overdue checklists...
                  </td>
                </tr>
              ) : !categories.length || !rows.length ? (
                <tr>
                  <td colSpan={(categories.length || 0) + 1} className="py-6 text-center text-gray-500">
                    No overdue checklist data available
                  </td>
                </tr>
              ) : (
                rows.map((site, i) => {
                  const byCat = new Map<string, number>();
                  if (Array.isArray(site.categories)) {
                    site.categories.forEach((c: any) => {
                      if (c && typeof c.category === 'string') {
                        byCat.set(c.category, Number(c.overdue_percentage ?? 0));
                      }
                    });
                  }
                  return (
                    <tr key={site.site_name + i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-4 px-4 bg-[#F6F4EE]">{site.site_name ?? '-'}</td>
                      {categories.map((cat, j) => (
                        <td key={j} className="py-4 px-2 text-center">{fmtPct(byCat.get(cat) ?? 0)}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopOverdueChecklistsCenterwiseCard;
