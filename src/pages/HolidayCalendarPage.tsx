import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CalendarDays, Upload, Plus, Filter, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    key: 'holidayName',
    label: 'Holiday Name',
    sortable: true,
    hideable: false,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'recurring',
    label: 'Recurring',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'applicableLocation',
    label: 'Applicable Location',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'holidayType',
    label: 'Holiday Type',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'applicableFor',
    label: 'Applicable for',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  }
];

export const HolidayCalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const renderCell = (holiday: Holiday, columnKey: string) => {
    switch (columnKey) {
      case 'holidayName':
        return <span className="text-gray-900 font-medium">{holiday.holidayName}</span>;
      
      case 'date':
        return <span className="text-gray-900">{holiday.date}</span>;
      
      case 'recurring':
        return (
          <span className="text-gray-900">
            {holiday.recurring ? 'Yes' : 'No'}
          </span>
        );
      
      case 'applicableLocation':
        return <span className="text-gray-900">{holiday.applicableLocation}</span>;
      
      case 'holidayType':
        return (
          <Badge 
            variant={
              holiday.holidayType === 'Public' 
                ? 'default' 
                : holiday.holidayType === 'Festival' 
                ? 'secondary' 
                : 'outline'
            }
            className="bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            {holiday.holidayType}
          </Badge>
        );
      
      case 'applicableFor':
        return <span className="text-gray-900">{holiday.applicableFor}</span>;
      
      default:
        return holiday[columnKey as keyof Holiday];
    }
  };

  const renderActions = (holiday: Holiday) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit Holiday</DropdownMenuItem>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex min-h-screen bg-[#f6f4ee]">
      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-5 w-5 text-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Holiday Calendar</h1>
            </div>
            <p className="text-gray-600">Manage Holidays</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <Button 
                className="bg-[#8B5A3C] hover:bg-[#7A4A2A] text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Holiday
              </Button>
              <Button 
                variant="outline" 
                className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search holidays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <EnhancedTable
                data={mockHolidays}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                storageKey="holiday-calendar-table"
                emptyMessage="No holidays found"
                className="min-w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Empty as shown in image */}
      <div className="w-80 bg-gray-300 border-l border-gray-400">
        {/* Empty sidebar as shown in the reference image */}
      </div>
    </div>
  );
};