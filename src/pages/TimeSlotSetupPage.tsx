import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { TextField } from '@mui/material';
import { Plus, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthHeader } from '../config/apiConfig';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface TimeSlotData {
  id: number;
  slotName: string;
  timings: string;
  startTime: string;
  endTime: string;
  active: boolean;
  createdOn: string;
  company_id?: number;
  start_hour?: number;
  start_min?: number;
  end_hour?: number;
  end_min?: number;
  created_at?: string;
  updated_at?: string;
}

const columns: ColumnConfig[] = [
  { key: 'timings', label: 'Timings', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
];

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
  },
};

export const TimeSlotSetupPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotData | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchTimeSlots();
  }, [setCurrentSection]);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.PARKING_SLOT_DETAILS), {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch time slots: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const transformedData = data.parking_slot_details.map((slot: any) => {
        const start = formatTime(slot.start_hour, slot.start_min);
        const end = formatTime(slot.end_hour, slot.end_min);
        const timings = `${formatTo12Hour(start)} to ${formatTo12Hour(end)}`;

        return {
          id: slot.id,
          slotName: timings,
          timings,
          startTime: start,
          endTime: end,
          active: slot.active,
          createdOn: new Date(slot.created_at).toLocaleDateString('en-GB'),
          company_id: slot.company_id,
          start_hour: slot.start_hour,
          start_min: slot.start_min,
          end_hour: slot.end_hour,
          end_min: slot.end_min,
          created_at: slot.created_at,
          updated_at: slot.updated_at,
        };
      });

      setTimeSlotData(transformedData);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load time slots');
      setTimeSlotData([
        {
          id: 1,
          slotName: '6:00 AM to 2:00 PM',
          timings: '6:00 AM to 2:00 PM',
          startTime: '06:00',
          endTime: '14:00',
          active: true,
          createdOn: '12/12/2023',
        },
        {
          id: 2,
          slotName: '2:00 PM to 10:00 PM',
          timings: '2:00 PM to 10:00 PM',
          startTime: '14:00',
          endTime: '22:00',
          active: true,
          createdOn: '12/12/2023',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const tableData = useMemo(() => timeSlotData, [timeSlotData]);

  const handleCloseCreateModal = () => {
    setStartTime('');
    setEndTime('');
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditingSlot(null);
    setEditStartTime('');
    setEditEndTime('');
    setIsEditModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const slotToEdit = timeSlotData.find((item) => item.id === id);
    if (slotToEdit) {
      setEditingSlot(slotToEdit);
      setEditStartTime(slotToEdit.startTime);
      setEditEndTime(slotToEdit.endTime);
      setIsEditModalOpen(true);
    }
  };

  const handleCreateTimeSlot = async () => {
    if (!startTime || !endTime) {
      toast.error('Please fill all time fields');
      return;
    }

    setIsCreating(true);

    try {
      const startTimeObj = parseTime(startTime);
      const endTimeObj = parseTime(endTime);

      const requestBody = {
        parking_slot_detail: {
          start_hour: startTimeObj.hours,
          start_min: startTimeObj.minutes,
          end_hour: endTimeObj.hours,
          end_min: endTimeObj.minutes,
          active: true,
        },
      };

      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.PARKING_SLOT_DETAILS), {
        method: 'POST',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to create time slot: ${response.status} ${response.statusText}`);
      }

      await fetchTimeSlots();
      toast.success('Time slot created successfully');
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating time slot:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create time slot');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTimeSlot = async () => {
    if (!editStartTime || !editEndTime || !editingSlot) {
      toast.error('Please fill all time fields');
      return;
    }

    setIsUpdating(true);

    try {
      const startTimeObj = parseTime(editStartTime);
      const endTimeObj = parseTime(editEndTime);

      const requestBody = {
        parking_slot_detail: {
          start_hour: startTimeObj.hours,
          start_min: startTimeObj.minutes,
          end_hour: endTimeObj.hours,
          end_min: endTimeObj.minutes,
          active: editingSlot.active,
        },
      };

      const response = await fetch(
        `${getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_PARKING_SLOT_DETAILS)}/${editingSlot.id}.json`,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to update time slot: ${response.status} ${response.statusText}`);
      }

      await fetchTimeSlots();
      toast.success('Time slot updated successfully');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update time slot');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCell = (item: TimeSlotData, columnKey: string) => {
    switch (columnKey) {
      case 'timings':
        return <span className="font-medium">{item.timings}</span>;
      case 'createdOn':
        return <span className="text-sm text-gray-600">{item.createdOn}</span>;
      default:
        return item[columnKey as keyof TimeSlotData] ?? '-';
    }
  };

  const renderActions = (item: TimeSlotData) => {
    if (!shouldShow('Time Slot Setup', 'update')) return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleEdit(item.id)}
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  const leftActions = shouldShow('Time Slot Setup', 'create') ? (
    <Button
      onClick={() => setIsCreateModalOpen(true)}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  return (
    <div className="p-6 min-h-screen">
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="time-slot-setup-table"
        emptyMessage={
          searchTerm ? 'No time slots found matching your search' : 'No time slots found'
        }
        loading={isLoading}
        loadingMessage="Loading..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
      />

      {/* Create Time Slot Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && handleCloseCreateModal()}>
        <DialogContent className="w-full sm:max-w-[500px] !bg-white overflow-visible">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Create Time Slot</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseCreateModal}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <TextField
              label="Start Time *"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
            <TextField
              label="End Time *"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              onClick={handleCreateTimeSlot}
              disabled={isCreating}
              variant="ghost"
              className="fm-button-fix fm-button-brand px-8 w-full sm:w-auto"
            >
              {isCreating ? 'Creating...' : 'CREATE'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseCreateModal}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Time Slot Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent className="w-full sm:max-w-[500px] !bg-white overflow-visible">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Edit Time Slot</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEditModal}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <TextField
              label="Start Time *"
              type="time"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
            <TextField
              label="End Time *"
              type="time"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              onClick={handleUpdateTimeSlot}
              disabled={isUpdating}
              variant="ghost"
              className="fm-button-fix fm-button-brand px-8 w-full sm:w-auto"
            >
              {isUpdating ? 'Updating...' : 'UPDATE'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseEditModal}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
