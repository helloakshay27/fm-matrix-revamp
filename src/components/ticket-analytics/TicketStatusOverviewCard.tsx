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

const STATUS_ICONS: Record<string, React.ReactNode> = {
  total_issues: <ListTodo className="ticket-analytics-kpi-icon-svg" />,
  total_open: <AlertCircle className="ticket-analytics-kpi-icon-svg" />,
  Pending: <Clock className="ticket-analytics-kpi-icon-svg" />,
  Closed: <CheckCircle className="ticket-analytics-kpi-icon-svg" />,
  Open: <AlertCircle className="ticket-analytics-kpi-icon-svg" />,
  'On Hold': <CircleDot className="ticket-analytics-kpi-icon-svg" />,
  'Reopen 1': <RotateCcw className="ticket-analytics-kpi-icon-svg" />,
  Received: <FileText className="ticket-analytics-kpi-icon-svg" />,
  Reopen: <RotateCcw className="ticket-analytics-kpi-icon-svg" />,
  Completed: <CheckCircle className="ticket-analytics-kpi-icon-svg" />,
  critical_issues_p1: <AlertTriangle className="ticket-analytics-kpi-icon-svg" />,
};

const StatusCard: React.FC<{ label: string; value: number; cardKey: string }> = ({ label, value, cardKey }) => {
  return (
    <div className="ticket-analytics-kpi">
      <div className="ticket-analytics-kpi-icon">
        {STATUS_ICONS[cardKey] ?? <CircleDot className="ticket-analytics-kpi-icon-svg" />}
      </div>
      <div className="ticket-analytics-kpi-value">{value.toLocaleString()}</div>
      <div className="ticket-analytics-kpi-label">{label}</div>
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
          <div className="ticket-analytics-kpi-grid">
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
      <div className="ticket-analytics-kpi-grid">
        {cards.map(c => <StatusCard key={c.key} cardKey={c.key} label={c.label} value={c.value} />)}
      </div>
    </div>
  );
};
