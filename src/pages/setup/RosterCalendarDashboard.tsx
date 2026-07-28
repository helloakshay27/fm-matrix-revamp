import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { RosterCalendarFilterDialog } from '@/components/RosterCalendarFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

type OccupancyLevel = '0-25' | '25-50' | '50-75' | '75-99' | '100';

interface RosterRow {
  id: string;
  shift: string;
  [key: string]: string;
}

const occupancyLegend: { label: string; level: OccupancyLevel; color: string }[] = [
  { label: '0%-25%', level: '0-25', color: 'bg-[#C7EDDA]' },
  { label: '25%-50%', level: '25-50', color: 'bg-[#CECBF6]' },
  { label: '50%-75%', level: '50-75', color: 'bg-[#F2EBC9]' },
  { label: '75%-99%', level: '75-99', color: 'bg-[#EDC488]' },
  { label: '100%', level: '100', color: 'bg-[#F2C8C4]' },
];

const occupancyColorMap: Record<OccupancyLevel, string> = {
  '0-25': 'bg-[#C7EDDA]',
  '25-50': 'bg-[#CECBF6]',
  '50-75': 'bg-[#F2EBC9]',
  '75-99': 'bg-[#EDC488]',
  '100': 'bg-[#F2C8C4]',
};

const seatTypes = ['Linear WS', 'Angular WS', 'Common', 'PMT', 'test Seat'];

const shifts = [
  '00:30 AM to 01:30 PM',
  '02:45 PM to 11:45 PM',
  '10:00 AM to 07:00 PM',
  '05:15 PM to 07:00 PM',
  '06:30 PM to 10:30 PM',
  '09:00 AM to 01:30 PM',
  '08:00 AM to 12:00 PM',
  '12:45 PM to 03:45 PM',
  '12:00 PM to 04:00 PM',
  '07:00 AM to 12:00 PM',
  '11:30 AM to 05:30 PM',
  '07:00 PM to 11:30 PM',
  '07:00 AM to 12:00 PM',
  '07:30 AM to 12:00 PM',
  '05:00 AM to 11:00 AM',
  '10:30 AM to 02:30 PM',
  '10:45 AM to 02:45 PM',
  '11:45 AM to 02:45 PM',
  '12:30 PM to 05:30 PM',
  '04:00 PM to 11:00 PM',
  '04:30 PM to 11:30 PM',
  '06:00 PM to 10:00 PM',
  '11:00 AM to 01:00 PM',
  '03:45 PM to 06:15 PM',
  '05:30 PM to 07:00 PM',
  '03:15 PM to 06:15 PM',
  '08:00 PM to 11:00 PM',
  '06:45 PM to 11:00 PM',
  '07:15 PM to 11:15 PM',
  '01:45 PM to 04:30 PM',
  '10:00 AM to 11:00 AM',
  '10:00 AM to 02:00 PM',
  '10:00 AM to 07:00 PM',
  '09:00 AM to 06:00 PM',
  '03:30 PM to 11:00 PM',
  '12:15 PM to 09:15 PM',
  '08:00 AM to 07:00 PM',
];

const generateDates = () =>
  Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0'));

export const RosterCalendarDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeatType, setSelectedSeatType] = useState<string | null>(null);

  const dates = useMemo(() => generateDates(), []);

  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        key: 'shift',
        label: 'Shift',
        sortable: true,
        hideable: false,
        draggable: false,
        defaultVisible: true,
      },
      ...dates.map((date) => ({
        key: `day_${date}`,
        label: date,
        sortable: false,
        hideable: true,
        draggable: false,
        defaultVisible: true,
      })),
    ],
    [dates]
  );

  const tableData: RosterRow[] = useMemo(
    () =>
      shifts.map((shift, index) => {
        const row: RosterRow = {
          id: String(index),
          shift,
        };
        dates.forEach((date) => {
          row[`day_${date}`] = '0-25';
        });
        return row;
      }),
    [dates]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const q = searchTerm.toLowerCase();
    return tableData.filter((row) => row.shift.toLowerCase().includes(q));
  }, [tableData, searchTerm]);

  const handleFilterApply = (filters: {
    location: string;
    floor: string;
    startDate: string;
    endDate: string;
  }) => {
    console.log('Applied roster calendar filters:', filters);
  };

  const renderCell = (item: RosterRow, columnKey: string) => {
    if (columnKey === 'shift') {
      return (
        <span className="font-medium text-gray-900 whitespace-nowrap">
          {item.shift}
        </span>
      );
    }

    if (columnKey.startsWith('day_')) {
      const level = (item[columnKey] || '0-25') as OccupancyLevel;
      return (
        <div className="flex items-center justify-center">
          <div
            className={`w-7 h-7 rounded ${occupancyColorMap[level] || 'bg-[#C7EDDA]'}`}
            title={`${columnKey.replace('day_', '')} · ${level}%`}
          />
        </div>
      );
    }

    return item[columnKey] ?? '--';
  };

  return (
    <div className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
      <div className="p-6 w-full min-w-0 max-w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Roster Calendar
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatsCard
            title="Total No. of Seats"
            value="73"
            titleClassName="!whitespace-normal !overflow-visible leading-tight"
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="Employee Schedules"
            value="12"
            titleClassName="!whitespace-normal !overflow-visible leading-tight"
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="Employee Check In"
            value="0"
            titleClassName="!whitespace-normal !overflow-visible leading-tight"
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="No of Requests"
            value="0"
            titleClassName="!whitespace-normal !overflow-visible leading-tight"
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="No of Waiting List"
            value="0"
            titleClassName="!whitespace-normal !overflow-visible leading-tight"
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-800">Occupancy</span>
              {occupancyLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${item.color} border border-gray-200 rounded-sm`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-800 mr-1">Seat Type</span>
            {seatTypes.map((type) => (
              <Badge
                key={type}
                variant="outline"
                onClick={() =>
                  setSelectedSeatType((prev) => (prev === type ? null : type))
                }
                className={`text-xs cursor-pointer px-3 py-1 rounded-full ${
                  selectedSeatType === type
                    ? 'border-[#C72030] bg-[#C72030]/10 text-[#C72030]'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            01 Jun 2025 - 30 Jun 2025
          </h2>
        </div>

        <div className="w-full min-w-0 max-w-full">
          <EnhancedTable
            data={filteredData}
            columns={columns}
            renderCell={renderCell}
            storageKey="roster-calendar-table-v2"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            disableClientSearch
            searchPlaceholder="Search shifts..."
            onFilterClick={() => setIsFilterOpen(true)}
            hideTableExport
            emptyMessage="No roster shifts found"
            pagination
            pageSize={15}
            enableFreeze
            freezeColumnsCount={1}
            className="roster-calendar-table"
          />
        </div>

        <RosterCalendarFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};
