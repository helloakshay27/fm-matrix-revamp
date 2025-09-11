import React, { useMemo } from 'react';

interface Props {
  data: any;
}

const getColorBar = (percent: number) => {
  if (!Number.isFinite(percent)) return '';
  if (percent >= 80) return 'border-b-2 border-green-500';
  if (percent >= 60) return 'border-b-2 border-yellow-500';
  if (percent >= 40) return 'border-b-2 border-orange-500';
  return 'border-b-2 border-red-500';
};

export const SiteWiseAdoptionRateCard: React.FC<Props> = ({ data }) => {
  const rows: any[] = useMemo(() => {
    const arr = data?.data?.adoption_rates ?? data?.adoption_rates ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3 className="font-semibold text-base mb-4">Site Wise Adoption Rate</h3>
      <table className="min-w-full border text-sm text-center">
        <thead className="bg-[#ded9cd] text-[#b62527] font-semibold">
          <tr>
            {['Site Name', 'Helpdesk', 'Assets', 'Checklist Tech', 'Checklist Non-Tech', 'Inventory', 'Meeting Room'].map((h) => (
              <th key={h} className="border border-black p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => {
            const cells = [
              row.site_name || row.site || '-',
              row.helpdesk ?? '0%',
              row.assets ?? '0%',
              row.checklist_tech ?? '0%',
              row.checklist_nontech ?? row.checklist_non_tech ?? '0%',
              row.inventory ?? '0%',
              row.meeting_room ?? '0%',
            ];
            return (
              <tr key={i} className="border-t">
                <td className="border p-2 text-left font-medium">{cells[0]}</td>
                {cells.slice(1).map((val: any, idx: number) => {
                  const pct = Number(String(val).replace(/[^0-9.\-]/g, ''));
                  return (
                    <td key={idx} className="border p-2">
                      <div className={`inline-block ${getColorBar(pct)}`}>{val}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-gray-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SiteWiseAdoptionRateCard;
