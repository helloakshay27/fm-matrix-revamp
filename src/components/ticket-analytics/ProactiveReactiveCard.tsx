import React from 'react';

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
  const sections = [
    {
      title: 'Proactive',
      items: [
        { label: 'Open', value: proactiveOpenTickets, bg: 'rgba(227,144,144,0.15)', num: '#D97655' },
        { label: 'Closed', value: proactiveClosedTickets, bg: 'rgba(183,220,212,0.30)', num: '#2E7D6B' },
      ],
    },
    {
      title: 'Reactive',
      items: [
        { label: 'Open', value: reactiveOpenTickets, bg: 'rgba(227,144,144,0.15)', num: '#D97655' },
        { label: 'Closed', value: reactiveClosedTickets, bg: 'rgba(183,220,212,0.30)', num: '#2E7D6B' },
      ],
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
        Proactive / Reactive Tickets
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">{section.title}</p>
            <div className="space-y-2">
              {section.items.map(item => (
                <div key={item.label} className="rounded-2xl px-4 py-5 text-center" style={{ backgroundColor: item.bg }}>
                  <div className="text-2xl font-bold" style={{ color: item.num, fontFamily: 'Work Sans, sans-serif' }}>
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
