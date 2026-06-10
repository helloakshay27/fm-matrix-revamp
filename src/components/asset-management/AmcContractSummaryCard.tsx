import React, { useMemo } from 'react';
import { Download } from 'lucide-react';

interface Props {
  data: any;
  onDownload?: () => void;
}

const statusConfig: Record<string, { bg: string; color: string }> = {
  on_track:    { bg: '#D1FAE5', color: '#065F46' },
  active:      { bg: '#D1FAE5', color: '#065F46' },
  high:        { bg: '#FEE2E2', color: '#991B1B' },
  critical:    { bg: '#FCE7F3', color: '#9D174D' },
  medium:      { bg: '#FEF3C7', color: '#92400E' },
  low:         { bg: '#F3F4F6', color: '#374151' },
  expired:     { bg: '#FEE2E2', color: '#991B1B' },
  expiring:    { bg: '#FEF3C7', color: '#92400E' },
};

const getStatusStyle = (status: string) => {
  const key = status?.toLowerCase().replace(/\s+/g, '_') ?? '';
  return statusConfig[key] ?? { bg: '#F3F4F6', color: '#374151' };
};

const formatDate = (d: string) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
  } catch {
    return d;
  }
};

const AmcContractSummaryCard: React.FC<Props> = ({ data, onDownload }) => {
  const root = data ?? {};

  const legacy = root?.data?.summary ?? root?.summary ?? null;
  const cards = root?.card_overview ?? root?.data?.card_overview ?? null;

  const summary = legacy
    ? { active: Number(legacy.active_amc_contracts ?? 0), expiry90: Number(legacy.contract_expiry_in_90_days ?? 0), expired: Number(legacy.contract_expired ?? 0) }
    : cards
    ? { active: Number(cards?.active_contracts?.count ?? 0), expiry90: Number(cards?.expiring_soon?.count ?? 0), expired: Number(cards?.expired_contracts?.count ?? 0) }
    : { active: Number(root.active_amc_contracts ?? 0), expiry90: Number(root.contract_expiry_in_90_days ?? 0), expired: Number(root.contract_expired ?? 0) };

  const contracts: any[] = useMemo(() => {
    const arr = root?.data?.contracts ?? root?.contracts ?? root?.data?.active_contracts ?? root?.active_contracts ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          AMC Contracts
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50 flex-shrink-0"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        <div className="rounded-xl py-4 px-3 text-center" style={{ backgroundColor: 'rgba(183,220,212,0.30)' }}>
          <div className="text-2xl font-bold" style={{ color: '#2E7D6B' }}>{summary.active.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Active Contracts</div>
        </div>
        <div className="rounded-xl py-4 px-3 text-center" style={{ backgroundColor: 'rgba(227,144,144,0.15)' }}>
          <div className="text-2xl font-bold" style={{ color: '#D97655' }}>{summary.expiry90.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Expiring in 90 days</div>
        </div>
        <div className="rounded-xl py-4 px-3 text-center" style={{ backgroundColor: '#EFEFFB' }}>
          <div className="text-2xl font-bold" style={{ color: '#6B5EA8' }}>{summary.expired.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Expired</div>
        </div>
      </div>

      {/* Contracts table */}
      {contracts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#4DB6AC' }}>
                {['AMC Name', 'Contract Start', 'Contract End', 'Renewal Reminder', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-white font-semibold text-center whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contracts.map((c: any, i: number) => {
                const name = c.amc_name ?? c.name ?? c.title ?? '-';
                const startDate = formatDate(c.contract_start ?? c.start_date ?? c.started_on ?? '');
                const endDate = formatDate(c.contract_end ?? c.end_date ?? c.ended_on ?? '');
                const renewal = c.renewal_reminder ?? c.expiry_reminder ?? c.days_to_expiry
                  ? `Expires in ${c.days_to_expiry ?? c.days_remaining ?? '?'} days`
                  : (c.renewal_reminder ?? '-');
                const status = c.status ?? c.contract_status ?? 'active';
                const { bg, color } = getStatusStyle(status);
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-left font-medium text-gray-800">{name}</td>
                    <td className="px-4 py-3 text-left text-gray-600">{startDate}</td>
                    <td className="px-4 py-3 text-left text-gray-600">{endDate}</td>
                    <td className="px-4 py-3 text-left text-gray-600">{typeof renewal === 'string' ? renewal : '-'}</td>
                    <td className="px-4 py-3 text-left">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, color }}>
                        {String(status).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AmcContractSummaryCard;
