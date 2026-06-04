import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, ListTodo, AlertTriangle, FileText, RotateCcw, CircleDot } from 'lucide-react';

interface DetailedSummary {
  total_issues: number;
  statuses: {
    [key: string]: number;
  };
  critical_issues_p1: number;
}

interface TicketStatusOverviewCardProps {
  openTickets?: number;
  closedTickets?: number;
  detailedSummary?: DetailedSummary | null;
  className?: string;
}

const statusLabels: Record<string, string> = {
  Open: 'Open',
  Pending: 'Pending',
  Closed: 'Closed',
  'Reopen 1': 'Reopen 1',
  'On Hold': 'On Hold',
  Received: 'Received',
  Reopen: 'Reopen',
  Completed: 'Completed',
};

const getCardColors = (key: string): { bg: string; numColor: string } => {
  const openKeys = ['total_open', 'Open', 'Reopen 1', 'Reopen', 'critical_issues_p1'];
  const closedKeys = ['Closed', 'Completed'];
  if (openKeys.includes(key)) return { bg: 'rgba(227,144,144,0.15)', numColor: '#D97655' };
  if (closedKeys.includes(key)) return { bg: 'rgba(183,220,212,0.30)', numColor: '#2E7D6B' };
  return { bg: '#EFEFFB', numColor: '#6B5EA8' };
};

const getStatusIcon = (key: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    total_issues: <ListTodo className="w-6 h-6 text-[#C72030]" />,
    total_open: <AlertCircle className="w-6 h-6 text-[#C72030]" />,
    Pending: <Clock className="w-6 h-6 text-[#C72030]" />,
    Closed: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
    Open: <AlertCircle className="w-6 h-6 text-[#C72030]" />,
    'On Hold': <CircleDot className="w-6 h-6 text-[#C72030]" />,
    'Reopen 1': <RotateCcw className="w-6 h-6 text-[#C72030]" />,
    Received: <FileText className="w-6 h-6 text-[#C72030]" />,
    Reopen: <RotateCcw className="w-6 h-6 text-[#C72030]" />,
    Completed: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
    critical_issues_p1: <AlertTriangle className="w-6 h-6 text-[#C72030]" />,
  };
  return icons[key] || <ListTodo className="w-6 h-6 text-[#C72030]" />;
};

export const TicketStatusOverviewCard: React.FC<TicketStatusOverviewCardProps> = ({
  openTickets,
  closedTickets,
  detailedSummary,
  className = ""
}) => {
  if (!detailedSummary) {
    if (openTickets !== undefined && closedTickets !== undefined) {
      return (
        <Card className={`bg-card border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-bold text-[#1A1A1A]">
              Ticket Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Card className="border border-gray-100 rounded-lg flex-1" style={{ backgroundColor: 'rgba(227,144,144,0.15)' }}>
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(227,144,144,0.15)' }}>
                      <AlertCircle className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold" style={{ color: '#D97655' }}>{openTickets}</div>
                      <div className="text-sm text-gray-700 mt-1">Open</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-100 rounded-lg flex-1" style={{ backgroundColor: 'rgba(183,220,212,0.30)' }}>
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(183,220,212,0.30)' }}>
                      <CheckCircle className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold" style={{ color: '#2E7D6B' }}>{closedTickets}</div>
                      <div className="text-sm text-gray-700 mt-1">Closed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  const { total_issues, statuses, critical_issues_p1 } = detailedSummary;

  const cards = [
    { key: 'total_issues', label: 'Total Issues', value: total_issues },
    ...(openTickets != null ? [{ key: 'total_open', label: 'Total Open Tickets', value: openTickets }] : []),
    ...(statuses
      ? Object.entries(statuses)
          .filter(([_, value]) => value > 0)
          .map(([key, value]) => ({
            key,
            label: statusLabels[key] || key,
            value,
          }))
      : []),
    { key: 'critical_issues_p1', label: 'Critical Issues (P1)', value: critical_issues_p1 },
  ].filter(card => card.value != null && card.value > 0);

  return (
    <Card className={`bg-card border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#1A1A1A]">
          Ticket Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {cards.map(card => {
            const { bg, numColor } = getCardColors(card.key);
            return (
            <Card key={card.key} className="border border-gray-100 rounded-lg" style={{ backgroundColor: bg }}>
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                    {getStatusIcon(card.key)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold" style={{ color: numColor }}>{card.value}</div>
                    <div className="text-sm text-gray-700 mt-1">{card.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
