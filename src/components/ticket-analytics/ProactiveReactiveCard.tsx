import React from 'react';
import { CheckCircle, CircleDot } from 'lucide-react';

interface ProactiveReactiveCardProps {
  proactiveOpenTickets: number;
  proactiveClosedTickets: number;
  reactiveOpenTickets: number;
  reactiveClosedTickets: number;
  className?: string;
}

export const ProactiveReactiveCard: React.FC<ProactiveReactiveCardProps> = ({
  proactiveOpenTickets,
  proactiveClosedTickets,
  reactiveOpenTickets,
  reactiveClosedTickets,
  className = '',
}) => {
  const items = [
    { label: 'Proactive Open', value: proactiveOpenTickets, icon: CircleDot },
    { label: 'Proactive Closed', value: proactiveClosedTickets, icon: CheckCircle },
    { label: 'Reactive Open', value: reactiveOpenTickets, icon: CircleDot },
    { label: 'Reactive Closed', value: reactiveClosedTickets, icon: CheckCircle },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
        Proactive / Reactive Tickets
      </h3>
      <div className="ticket-analytics-kpi-grid">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="ticket-analytics-kpi">
              <div className="ticket-analytics-kpi-icon">
                <Icon className="ticket-analytics-kpi-icon-svg" />
              </div>
              <div className="ticket-analytics-kpi-value">
                {item.value.toLocaleString()}
              </div>
              <div className="ticket-analytics-kpi-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
