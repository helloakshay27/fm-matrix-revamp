import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TicketTypeWiseData } from '@/services/helpdeskAnalyticsAPI';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ALL_TYPES = 'all';

interface TicketTypeWiseCardProps {
  data: TicketTypeWiseData | null;
  title?: string;
  className?: string;
  /** Currently chosen type ("all" or one of `data.types`). Owned by the dashboard so it can filter other cards. */
  selectedType?: string;
  onTypeChange?: (type: string) => void;
}

// "non-technical" / "non_technical" -> "Non-Technical"
const formatTypeLabel = (type: string) =>
  String(type)
    .replace(/_/g, ' ')
    .split(/(\s|-)/)
    .map((part) => (/^[a-z]/i.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join('');

const toCount = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const TicketTypeWiseCard: React.FC<TicketTypeWiseCardProps> = ({
  data,
  title = 'Ticket Type Wise Distribution',
  className = '',
  selectedType: controlledType,
  onTypeChange,
}) => {
  // Tolerate the payload being wrapped in `response` like the sibling chart_* endpoints.
  const source = ((data as any)?.response ?? data) as TicketTypeWiseData | null;
  const types = Array.isArray(source?.types) ? source!.types! : [];

  // Dropdown choices come straight from the API's `types`; "all" shows every type.
  // Controlled by the dashboard when `selectedType` is passed; otherwise local state.
  const [localType, setLocalType] = React.useState<string>(ALL_TYPES);
  const selectedType = controlledType ?? localType;
  const setSelectedType = (type: string) => {
    setLocalType(type);
    onTypeChange?.(type);
  };
  // If the data refreshes (new sites / date range) and the chosen type is gone, fall back to all.
  React.useEffect(() => {
    if (selectedType !== ALL_TYPES && !types.includes(selectedType)) setSelectedType(ALL_TYPES);
  }, [types.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const allRows = types.map((type, index) => {
    const open = toCount(source?.open_tickets?.[index]);
    const closed = toCount(source?.closed_tickets?.[index]);
    return {
      type,
      name: formatTypeLabel(type),
      open,
      closed,
      total: source?.total_tickets?.[index] != null ? toCount(source.total_tickets[index]) : open + closed,
    };
  });

  const chartData = selectedType === ALL_TYPES ? allRows : allRows.filter((row) => row.type === selectedType);

  const hasTickets = chartData.some((row) => row.open > 0 || row.closed > 0 || row.total > 0);

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* pr-14 keeps the dropdown clear of the "+" add-to-My-Dashboard button that sits over the card corner. */}
      <div className="flex items-center justify-between gap-3 pl-5 pr-14 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          {title}
        </h3>
        {types.length > 0 && (
          // Stop the drag-and-resize grid from treating a click on the dropdown as a card drag.
          <div
            data-no-drag="true"
            className="no-drag"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-8 w-[170px] text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES}>All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="w-full overflow-x-auto">
          {hasTickets ? (
            <ResponsiveContainer width="100%" height={280} className="min-w-[320px]">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(value: number, name: string) => [value, name]}
                  labelFormatter={(label, payload) => {
                    const total = payload?.[0]?.payload?.total;
                    return total != null ? `${label} (Total: ${total})` : label;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                <Bar dataKey="open" fill="#E39090" name="Open" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill="#76CDC1" name="Closed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-center text-gray-500">
              {selectedType === ALL_TYPES
                ? 'No tickets found for the selected sites and date range'
                : `No ${formatTypeLabel(selectedType)} tickets found for the selected sites and date range`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
