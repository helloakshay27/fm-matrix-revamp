import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface Holiday {
  id: string;
  holidayName: string;
  date: string;
  recurring: boolean;
  applicableLocation: string;
  holidayType: string;
  applicableFor: string;
}

const holidayData: Holiday[] = [
  {
    id: '1',
    holidayName: 'Republic Day',
    date: '26 January 2025',
    recurring: true,
    applicableLocation: 'Location1 +4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '2',
    holidayName: 'Maha Shivani',
    date: '26 February 2025',
    recurring: false,
    applicableLocation: 'Location1 +4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  },
  {
    id: '3',
    holidayName: 'Holi',
    date: '14 March 2025',
    recurring: false,
    applicableLocation: 'Location1 +4',
    holidayType: 'Maintenance',
    applicableFor: 'FM'
  },
  {
    id: '4',
    holidayName: 'Mahavishu Day/Labour Day',
    date: '1 May 2025',
    recurring: true,
    applicableLocation: 'Location1 +4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '5',
    holidayName: 'Independence Day',
    date: '15 August 2025',
    recurring: true,
    applicableLocation: 'Location1 +4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  }
];

const columns: ColumnConfig[] = [
  { key: 'holidayName', label: 'Holiday Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'date', label: 'Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'recurring', label: 'Recurring', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'applicableLocation', label: 'Applicable Location', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'holidayType', label: 'Holiday Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'applicableFor', label: 'Applicable for', sortable: true, hideable: true, draggable: true, defaultVisible: true }
];

export const HolidayCalendarPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const renderRow = (item: Holiday) => ({
    ...item,
    recurring: item.recurring ? 'Yes' : 'No'
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(holidayData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Holiday Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage Holidays</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button 
              className="flex items-center gap-2 bg-[#C72030] hover:bg-[#A91B29] text-white"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left side - Table */}
          <div className="flex-1 p-6">
            <EnhancedTable
              data={holidayData}
              columns={columns}
              renderRow={renderRow}
              enableSearch={true}
              enableSelection={true}
              enableExport={true}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              searchPlaceholder="Search holidays..."
              exportFileName="holidays"
            />
          </div>
          
          {/* Right side - Empty space as shown in image */}
          <div className="w-80 bg-gray-100 border-l border-border">
            {/* Intentionally left empty as per the image */}
          </div>
        </div>
      </div>
    </div>
  );
};