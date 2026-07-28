import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, X } from 'lucide-react';
import { CreateShiftDialog } from '@/components/CreateShiftDialog';
import { EditShiftDialog } from '@/components/EditShiftDialog';

interface ShiftData {
  id: number;
  timings: string;
  totalHours: number;
  checkInMargin: string;
  createdOn: string;
  createdBy: string;
}

const columns: ColumnConfig[] = [
  { key: 'timings', label: 'Timings', sortable: true, hideable: true, defaultVisible: true },
  { key: 'totalHours', label: 'Total Hour', sortable: true, hideable: true, defaultVisible: true },
  { key: 'checkInMargin', label: 'Check In Margin', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdBy', label: 'Created By', sortable: true, hideable: true, defaultVisible: true },
];

const initialShifts: ShiftData[] = [
  {
    id: 1,
    timings: '08:00 AM to 05:00 PM',
    totalHours: 9,
    checkInMargin: '0h0m',
    createdOn: '19/03/2024',
    createdBy: '',
  },
  {
    id: 2,
    timings: '02:00 AM to 06:00 AM',
    totalHours: 4,
    checkInMargin: '1h0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
  },
  {
    id: 3,
    timings: '10:15 AM to 07:30 PM',
    totalHours: 9,
    checkInMargin: '0h0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
  },
  {
    id: 4,
    timings: '10:00 AM to 07:00 PM',
    totalHours: 9,
    checkInMargin: '0h0m',
    createdOn: '29/11/2022',
    createdBy: '',
  },
  {
    id: 5,
    timings: '09:00 AM to 06:00 PM',
    totalHours: 9,
    checkInMargin: '0h0m',
    createdOn: '28/11/2022',
    createdBy: '',
  },
  {
    id: 6,
    timings: '10:30 AM to 06:30 PM',
    totalHours: 8,
    checkInMargin: '0h0m',
    createdOn: '28/11/2022',
    createdBy: 'Robert Day2',
  },
  {
    id: 7,
    timings: '10:00 AM to 11:00 AM',
    totalHours: 1,
    checkInMargin: '0h0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
  },
  {
    id: 8,
    timings: '01:00 AM to 11:00 PM',
    totalHours: 22,
    checkInMargin: '0h0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
  },
  {
    id: 9,
    timings: '03:15 AM to 11:15 PM',
    totalHours: 20,
    checkInMargin: '0h0m',
    createdOn: '22/06/2022',
    createdBy: 'Robert Day2',
  },
  {
    id: 10,
    timings: '10:00 AM to 08:00 PM',
    totalHours: 10,
    checkInMargin: '3h0m',
    createdOn: '09/08/2021',
    createdBy: 'Robert Day2',
  },
];

export const ShiftDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [createdByFilter, setCreatedByFilter] = useState('all');
  const [draftCreatedByFilter, setDraftCreatedByFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftData | null>(null);
  const [shifts] = useState<ShiftData[]>(initialShifts);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const createdByOptions = Array.from(
    new Set(shifts.map((s) => s.createdBy.trim()).filter(Boolean))
  ).sort();

  const filteredShifts = shifts.filter((shift) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      shift.timings.toLowerCase().includes(q) ||
      String(shift.totalHours).includes(q) ||
      shift.checkInMargin.toLowerCase().includes(q) ||
      shift.createdOn.toLowerCase().includes(q) ||
      shift.createdBy.toLowerCase().includes(q);

    const matchesCreatedBy =
      createdByFilter === 'all' ||
      (createdByFilter === 'blank'
        ? !shift.createdBy.trim()
        : shift.createdBy === createdByFilter);

    return matchesSearch && matchesCreatedBy;
  });

  const handleAddClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (shift: ShiftData) => {
    setSelectedShift(shift);
    setIsEditDialogOpen(true);
  };

  const handleApplyFilters = () => {
    setCreatedByFilter(draftCreatedByFilter);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setDraftCreatedByFilter('all');
    setCreatedByFilter('all');
    setCurrentPage(1);
    setShowFilters(false);
  };

  const renderCell = (shift: ShiftData, columnKey: string) => {
    switch (columnKey) {
      case 'timings':
        return <span className="font-medium text-gray-900">{shift.timings}</span>;
      case 'totalHours':
        return shift.totalHours;
      case 'checkInMargin':
        return shift.checkInMargin;
      case 'createdOn':
        return shift.createdOn;
      case 'createdBy':
        return shift.createdBy || '—';
      default:
        return '—';
    }
  };

  const renderActions = (shift: ShiftData) => (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      title="Edit"
      onClick={() => handleEditClick(shift)}
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Shifts</div>
          <h1 className="text-2xl font-bold text-gray-800">USER SHIFTS</h1>
        </div>

        <div className="w-full min-w-0 max-w-full">
          <EnhancedTable
            data={filteredShifts}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="user-shifts-table"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            disableClientSearch
            searchPlaceholder="Search shifts..."
            onFilterClick={() => {
              setDraftCreatedByFilter(createdByFilter);
              setShowFilters(true);
            }}
            leftActions={
              <Button
                onClick={handleAddClick}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg [&_svg]:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            }
            hideTableExport
            loading={loading}
            emptyMessage="No shifts found"
            pagination
            pageSize={10}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            getItemId={(item) => String(item.id)}
          />
        </div>

        <CreateShiftDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        <EditShiftDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          shift={selectedShift}
          onShiftUpdated={() => {
            console.log('Shift updated successfully');
          }}
        />

        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Filters</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Created By</Label>
                <Select
                  value={draftCreatedByFilter}
                  onValueChange={setDraftCreatedByFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select created by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="blank">Blank</SelectItem>
                    {createdByOptions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="h-9"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                className="h-9 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
