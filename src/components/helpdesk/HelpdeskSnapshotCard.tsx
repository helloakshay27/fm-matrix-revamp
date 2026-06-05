import React from 'react';

interface Props { data: any }

const getCount = (obj: any): number | undefined => {
  if (obj == null) return undefined;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'string') {
    const n = Number(obj);
    return Number.isNaN(n) ? undefined : n;
  }
  if (typeof obj === 'object') {
    if (obj.count != null) return Number(obj.count);
    if (obj.value != null) return Number(obj.value);
  }
  return undefined;
};

export const HelpdeskSnapshotCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const snapshot = root.snapshot ?? undefined;
  const summary = root.summary ?? root;

  const totalTickets  = getCount(snapshot?.total_tickets)   ?? getCount(summary.total_tickets)   ?? 0;
  const closedTickets = getCount(snapshot?.closed_tickets)  ?? getCount(summary.total_closed)    ?? getCount(summary.closed_tickets)   ?? 0;
  const openTickets   = getCount(snapshot?.open_tickets)    ?? getCount(summary.total_open)      ?? getCount(summary.open_tickets)     ?? 0;
  const customerTickets = getCount(snapshot?.customer_tickets);
  const fmTickets       = getCount(snapshot?.fm_tickets);

  const total = totalTickets > 0 ? totalTickets : 1;
  const closedPct = ((closedTickets / total) * 100).toFixed(1);
  const openPct   = ((openTickets   / total) * 100).toFixed(1);

  const title = root.title ?? 'Ticket Summary';

  type CardItem = {
    label: string;
    value: number | string;
    sub: string;
    bg: string;
    numColor: string;
  };

  const cards: CardItem[] = [
    {
      label: 'Total Tickets',
      value: totalTickets,
      sub: 'This week',
      bg: '#EFEFFB',
      numColor: '#1a1a1a',
    },
    {
      label: 'Closed Tickets',
      value: closedTickets,
      sub: `${closedPct}% resolved`,
      bg: 'rgba(183,220,212,0.30)',
      numColor: '#2E7D6B',
    },
    {
      label: 'Open Tickets',
      value: openTickets,
      sub: `${openPct}% pending`,
      bg: 'rgba(227,144,144,0.15)',
      numColor: '#D97655',
    },
    ...(typeof customerTickets !== 'undefined' ? [{
      label: 'Customer Tickets',
      value: customerTickets,
      sub: 'From clients',
      bg: 'rgba(133,189,246,0.20)',
      numColor: '#85BDF6',
    }] : []),
    ...(typeof fmTickets !== 'undefined' ? [{
      label: 'FM Tickets',
      value: fmTickets,
      sub: 'Facility mgmt.',
      bg: '#EFEFFB',
      numColor: '#6B5EA8',
    }] : []),
  ];

  return (
    <div className="bg-white rounded-xl p-5">
      <h3
        className="mb-5 text-base font-semibold text-gray-900"
        style={{ fontFamily: 'Work Sans, system-ui, sans-serif' }}
      >
        {title}
      </h3>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl px-4 py-5 flex flex-col items-center justify-center gap-1.5 text-center"
            style={{ backgroundColor: card.bg }}
          >
            {/* Label on top */}
            <span
              className="text-sm font-medium text-gray-500"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {card.label}
            </span>

            {/* Big number */}
            <span
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 700,
                fontSize: '2rem',
                lineHeight: 1,
                color: card.numColor,
              }}
            >
              {card.value}
            </span>

            {/* Sub-text */}
            <span
              className="text-xs text-gray-500"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {card.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpdeskSnapshotCard;
