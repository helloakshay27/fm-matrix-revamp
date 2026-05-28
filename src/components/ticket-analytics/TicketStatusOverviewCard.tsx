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
              <Card className="bg-[#F6F4EE] border border-gray-100 rounded-lg flex-1">
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F6F4EE]">
                      <AlertCircle className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold ">{openTickets}</div>
                      <div className="text-sm text-gray-700 mt-1">Open</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#F6F4EE] border border-gray-100 rounded-lg flex-1">
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F6F4EE]">
                      <CheckCircle className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold ">{closedTickets}</div>
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
          {cards.map(card => (
            <Card key={card.key} className="bg-[#F6F4EE] border border-gray-100 rounded-lg">
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F6F4EE]">
                    {getStatusIcon(card.key)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-sm text-gray-700 mt-1">{card.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
