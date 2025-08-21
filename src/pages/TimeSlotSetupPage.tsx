import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Edit, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';
import { API_CONFIG, getFullUrl, getAuthHeader } from '../config/apiConfig';

interface TimeSlotData {
  id: number;
  slotName: string;
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

export const TimeSlotSetupPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    timings: true,
    createdOn: true
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotData | null>(null);
  const [slotName, setSlotName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editSlotName, setEditSlotName] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchTimeSlots();
  }, [setCurrentSection]);

  // Function to convert hours and minutes to HH:MM format
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Fetch time slots from API
  const fetchTimeSlots = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Fetching time slots from API...');
      
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
      console.log('✅ Time slots fetched successfully:', data);

      // Transform API data to match our interface
      const transformedData = data.parking_slot_details.map((slot: any) => {
        const startTime = formatTime(slot.start_hour, slot.start_min);
        const endTime = formatTime(slot.end_hour, slot.end_min);
        
        return {
          id: slot.id,
          slotName: `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`,
          startTime,
          endTime,
          active: slot.active,
          createdOn: new Date(slot.created_at).toLocaleDateString('en-GB'),
          company_id: slot.company_id,
          start_hour: slot.start_hour,
          start_min: slot.start_min,
          end_hour: slot.end_hour,
          end_min: slot.end_min,
          created_at: slot.created_at,
          updated_at: slot.updated_at
        };
      });

      setTimeSlotData(transformedData);
    } catch (error) {
      console.error('❌ Error fetching time slots:', error);
      toast.error('Failed to load time slots');
      // Keep sample data as fallback
      setTimeSlotData([
        {
          id: 1,
          slotName: 'Morning Shift',
          startTime: '06:00',
          endTime: '14:00',
          active: true,
          createdOn: '12/12/2023'
        },
        {
          id: 2,
          slotName: 'Evening Shift',
          startTime: '14:00',
          endTime: '22:00',
          active: true,
          createdOn: '12/12/2023'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert 24-hour format to 12-hour AM/PM format
  const formatTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Function to convert time (HH:MM) to hours and minutes
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };
  
  // Initialize with empty data - will be populated by API call
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);

  const filteredData = timeSlotData.filter(item =>
    item.slotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.startTime.includes(searchTerm) ||
    item.endTime.includes(searchTerm) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number) => {
    setTimeSlotData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, active: !item.active }
          : item
      )
    );
    
    const updatedItem = timeSlotData.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.active : false;
    toast.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}`);
  };

  const handleEdit = (id: number) => {
    const slotToEdit = timeSlotData.find(item => item.id === id);
    if (slotToEdit) {
      setEditingSlot(slotToEdit);
      setEditSlotName(slotToEdit.slotName);
      setEditStartTime(slotToEdit.startTime);
      setEditEndTime(slotToEdit.endTime);
      setIsEditModalOpen(true);
    }
  };

  const handleAdd = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTimeSlot = async () => {
    if (!startTime || !endTime) {
      toast.error('Please fill all time fields');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Parse start and end times
      const startTimeObj = parseTime(startTime);
      const endTimeObj = parseTime(endTime);
      
      // Create the API request body
      const requestBody = {
        parking_slot_detail: {
          start_hour: startTimeObj.hours,
          start_min: startTimeObj.minutes,
          end_hour: endTimeObj.hours,
          end_min: endTimeObj.minutes,
          active: true
        }
      };
      
      console.log('Creating time slot with data:', requestBody);
      
      // Make API call
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
      
      const responseData = await response.json();
      console.log('✅ Time slot created successfully:', responseData);
      
      // Refresh the data from server instead of updating local state
      await fetchTimeSlots();
      toast.success('Time slot created successfully');
      
      // Reset form
      setStartTime('');
      setEndTime('');
      setIsCreateModalOpen(false);
      
    } catch (error) {
      console.error('❌ Error creating time slot:', error);
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
      // Parse start and end times
      const startTimeObj = parseTime(editStartTime);
      const endTimeObj = parseTime(editEndTime);
      
      // Create the API request body
      const requestBody = {
        parking_slot_detail: {
          start_hour: startTimeObj.hours,
          start_min: startTimeObj.minutes,
          end_hour: endTimeObj.hours,
          end_min: endTimeObj.minutes,
          active: editingSlot.active
        }
      };
      
      console.log('Updating time slot with data:', {
        id: editingSlot.id,
        body: requestBody
      });
      
      // Make PUT API call to specific time slot ID
      const response = await fetch(`${getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_PARKING_SLOT_DETAILS)}/${editingSlot.id}.json`, {
        method: 'PUT',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to update time slot: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Time slot updated successfully:', responseData);
      
      // Refresh the data from server instead of updating local state
      await fetchTimeSlots();
      toast.success('Time slot updated successfully');
      
      // Reset form
      setEditingSlot(null);
      setEditStartTime('');
      setEditEndTime('');
      setIsEditModalOpen(false);
      
    } catch (error) {
      console.error('❌ Error updating time slot:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update time slot');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'timings', label: 'Timings', visible: visibleColumns.timings },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn }
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          {/* <Button 
            onClick={fetchTimeSlots}
            disabled={isLoading}
            variant="outline"
            className="px-4 py-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.actions && <TableHead className="text-center">Actions</TableHead>}
              {visibleColumns.timings && <TableHead className="text-center">Timings</TableHead>}
              {visibleColumns.createdOn && <TableHead>Created On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B4D8]"></div>
                    <span className="ml-2">Loading time slots...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No time slots found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {visibleColumns.actions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.timings && (
                  <TableCell className="text-center font-medium">
                    {formatTo12Hour(item.startTime)} to {formatTo12Hour(item.endTime)}
                  </TableCell>
                )}
                {visibleColumns.createdOn && <TableCell>{item.createdOn}</TableCell>}
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Time Slot Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Create Time Slot</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
  {/* Start Time */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-900">Start Time</label>
    <Input
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      className="w-full"
    />
  </div>

  {/* End Time */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-900">End Time</label>
    <Input
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      className="w-full"
    />
  </div>
</div>

{/* Submit Button */}
<div className="flex justify-end pt-4">
  <Button
    onClick={handleCreateTimeSlot}
    disabled={isCreating}
    className="bg-purple-600 hover:bg-purple-700 text-white px-6 disabled:opacity-50"
  >
    {isCreating ? 'Creating...' : 'Submit'}
  </Button>
</div>

        </DialogContent>
      </Dialog>

      {/* Edit Time Slot Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Edit Time Slot</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Start Time</label>
              <Input
                type="time"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
                className="w-full"
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">End Time</label>
              <Input
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
                className="w-full"
              />
            </div>
             </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateTimeSlot}
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Submit'}
              </Button>
            </div>
         
        </DialogContent>
      </Dialog>
    </div>
  );
};