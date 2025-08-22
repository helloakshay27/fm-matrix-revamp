import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { CalendarDays, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  holidayName: string;
  date: string;
  recurring: boolean;
  applicableLocation: string;
  holidayType: string;
  applicableFor: string;
}

const mockHolidays: Holiday[] = [
  {
    id: '1',
    holidayName: 'Republic Day',
    date: '26 January 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '2',
    holidayName: 'Maha Shivratri',
    date: '26 February 2025',
    recurring: false,
    applicableLocation: 'Location 1-4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  },
  {
    id: '3',
    holidayName: 'Holi',
    date: '14 March 2025',
    recurring: false,
    applicableLocation: 'Location 1-4',
    holidayType: 'Maintenance',
    applicableFor: 'FM'
  },
  {
    id: '4',
    holidayName: 'Mahashivratri Day/Labour Day',
    date: '1 May 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '5',
    holidayName: 'Independence Day',
    date: '15 August 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  }
];

const columns: ColumnConfig[] = [
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    hideable: false,
    draggable: false
  },
  {
    key: 'holidayName',
    label: 'Holiday Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'recurring',
    label: 'Recurring',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'applicableLocation',
    label: 'Applicable Location',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'holidayType',
    label: 'Holiday Type',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'applicableFor',
    label: 'Applicable for',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

export const HolidayCalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleView = (id: string) => {
    console.log('View holiday:', id);
    // Navigate to holiday detail page
  };

  const handleEdit = (id: string) => {
    console.log('Edit holiday:', id);
    // Navigate to holiday edit page
  };

  const handleDelete = (id: string) => {
    console.log('Delete holiday:', id);
    // Show delete confirmation modal
  };

  const handleAdd = () => {
    console.log('Add new holiday');
    // Navigate to add holiday page
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Holiday Calendar</h1>
            <p className="text-gray-600">Manage holidays and calendar events</p>
          </div>
        </div>
      </header>

      <div className="">
        <EnhancedTable
          data={mockHolidays}
          columns={columns}
          renderRow={(holiday) => ({
            actions: (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleView(holiday.id)} 
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEdit(holiday.id)} 
                  className="p-1 text-green-600 hover:bg-green-50 rounded" 
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(holiday.id)} 
                  className="p-1 text-red-600 hover:bg-red-50 rounded" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
            holidayName: (
              <div className="font-medium text-gray-900 max-w-xs truncate" title={holiday.holidayName}>
                {holiday.holidayName}
              </div>
            ),
            date: (
              <span className="text-sm text-gray-600">{holiday.date}</span>
            ),
            recurring: (
              <span className="text-sm text-gray-600">
                {holiday.recurring ? 'Yes' : 'No'}
              </span>
            ),
            applicableLocation: (
              <div className="text-sm text-gray-600 max-w-xs truncate" title={holiday.applicableLocation}>
                {holiday.applicableLocation}
              </div>
            ),
            holidayType: (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                holiday.holidayType === 'Public' 
                  ? 'bg-blue-100 text-blue-800' 
                  : holiday.holidayType === 'Festival' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {holiday.holidayType}
              </span>
            ),
            applicableFor: (
              <span className="text-sm text-gray-600">{holiday.applicableFor}</span>
            )
          })}
          storageKey="holiday-calendar-table"
          enableSearch={false}
          searchPlaceholder="Search holidays..."
          onSearchChange={setSearchTerm}
          enableExport={false}
          exportFileName="holiday-data"
          leftActions={
            <Button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </Button>
          }
          pagination={false}
          loading={false}
          emptyMessage="No holidays found. Create your first holiday to get started."
        />
      </div>
    </div>
  );
};