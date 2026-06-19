import React from 'react';
import { AlertCircle, CheckCircle, Clock, ListTodo, AlertTriangle, FileText, RotateCcw, CircleDot } from 'lucide-react';

interface DetailedSummary {
  total_issues: number;
  statuses: Record<string, number>;
  critical_issues_p1: number;
}

interface TicketStatusOverviewCardProps {
  openTickets?: number;
  closedTickets?: number;
  detailedSummary?: DetailedSummary | null;
  className?: string;
}

const getCardColors = (key: string) => {
  if (['total_open', 'Open', 'Reopen 1', 'Reopen', 'critical_issues_p1'].includes(key))
    return { bg: 'rgba(227,144,144,0.15)', num: '#D97655' };
  if (['Closed', 'Completed'].includes(key))
    return { bg: 'rgba(183,220,212,0.30)', num: '#2E7D6B' };
  return { bg: '#EFEFFB', num: '#6B5EA8' };
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  total_issues: <ListTodo className="w-5 h-5 text-[#6B5EA8]" />,
  total_open: <AlertCircle className="w-5 h-5 text-[#D97655]" />,
  Pending: <Clock className="w-5 h-5 text-[#6B5EA8]" />,
  Closed: <CheckCircle className="w-5 h-5 text-[#2E7D6B]" />,
  Open: <AlertCircle className="w-5 h-5 text-[#D97655]" />,
  'On Hold': <CircleDot className="w-5 h-5 text-[#6B5EA8]" />,
  'Reopen 1': <RotateCcw className="w-5 h-5 text-[#D97655]" />,
  Received: <FileText className="w-5 h-5 text-[#6B5EA8]" />,
  Reopen: <RotateCcw className="w-5 h-5 text-[#D97655]" />,
  Completed: <CheckCircle className="w-5 h-5 text-[#2E7D6B]" />,
  critical_issues_p1: <AlertTriangle className="w-5 h-5 text-[#D97655]" />,
};

const StatusCard: React.FC<{ label: string; value: number; cardKey: string }> = ({ label, value, cardKey }) => {
  const { bg, num } = getCardColors(cardKey);
  return (
    <div className="rounded-2xl px-4 py-5 flex flex-col items-center text-center gap-1" style={{ backgroundColor: bg }}>
      <div className="text-2xl font-bold" style={{ color: num, fontFamily: 'Work Sans, sans-serif' }}>{value.toLocaleString()}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

export const TicketStatusOverviewCard: React.FC<TicketStatusOverviewCardProps> = ({
  openTickets,
  closedTickets,
  detailedSummary,
  className = '',
}) => {
  if (!detailedSummary) {
    if (openTickets !== undefined && closedTickets !== undefined) {
      return (
        <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>Ticket Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatusCard cardKey="Open" label="Open" value={openTickets} />
            <StatusCard cardKey="Closed" label="Closed" value={closedTickets} />
          </div>
        </div>
      );
    }
    return null;
  }

  const { total_issues, statuses, critical_issues_p1 } = detailedSummary;
  const cards = [
    { key: 'total_issues', label: 'Total Issues', value: total_issues },
    ...(openTickets != null ? [{ key: 'total_open', label: 'Total Open', value: openTickets }] : []),
    ...Object.entries(statuses ?? {}).filter(([, v]) => v > 0).map(([k, v]) => ({ key: k, label: k, value: v })),
    ...(critical_issues_p1 > 0 ? [{ key: 'critical_issues_p1', label: 'Critical P1', value: critical_issues_p1 }] : []),
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>Ticket Status Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(c => <StatusCard key={c.key} cardKey={c.key} label={c.label} value={c.value} />)}
      </div>
    </div>
  );
};
