import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';

interface TimeSlotData {
  id: number;
  slotName: string;
  startTime: string;
  endTime: string;
  active: boolean;
  createdOn: string;
}

export const TimeSlotSetupPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    slotName: true,
    startTime: true,
    endTime: true,
    active: true,
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

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);
  
  // Sample data for time slots
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([
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
    },
    {
      id: 3,
      slotName: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      active: false,
      createdOn: '10/11/2023'
    },
    {
      id: 4,
      slotName: 'Weekend Slot',
      startTime: '08:00',
      endTime: '20:00',
      active: true,
      createdOn: '08/10/2023'
    }
  ]);

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

  const handleCreateTimeSlot = () => {
    if (!slotName || !startTime || !endTime) {
      toast.error('Please fill all fields');
      return;
    }
    
    const newTimeSlot = {
      id: Math.max(...timeSlotData.map(item => item.id)) + 1,
      slotName,
      startTime,
      endTime,
      active: true,
      createdOn: new Date().toLocaleDateString('en-GB')
    };
    
    setTimeSlotData(prevData => [...prevData, newTimeSlot]);
    toast.success('Time slot created successfully');
    
    // Reset form
    setSlotName('');
    setStartTime('');
    setEndTime('');
    setIsCreateModalOpen(false);
  };

  const handleUpdateTimeSlot = () => {
    if (!editSlotName || !editStartTime || !editEndTime || !editingSlot) {
      toast.error('Please fill all fields');
      return;
    }
    
    setTimeSlotData(prevData => 
      prevData.map(item => 
        item.id === editingSlot.id 
          ? { ...item, slotName: editSlotName, startTime: editStartTime, endTime: editEndTime }
          : item
      )
    );
    
    toast.success('Time slot updated successfully');
    
    // Reset form
    setEditingSlot(null);
    setEditSlotName('');
    setEditStartTime('');
    setEditEndTime('');
    setIsEditModalOpen(false);
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
    { key: 'slotName', label: 'Slot Name', visible: visibleColumns.slotName },
    { key: 'startTime', label: 'Start Time', visible: visibleColumns.startTime },
    { key: 'endTime', label: 'End Time', visible: visibleColumns.endTime },
    { key: 'active', label: 'Active/Inactive', visible: visibleColumns.active },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn }
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleAdd}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

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
              {visibleColumns.slotName && <TableHead>Slot Name</TableHead>}
              {visibleColumns.startTime && <TableHead>Start Time</TableHead>}
              {visibleColumns.endTime && <TableHead>End Time</TableHead>}
              {visibleColumns.active && <TableHead className="text-center">Active/Inactive</TableHead>}
              {visibleColumns.createdOn && <TableHead>Created On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
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
                {visibleColumns.slotName && <TableCell className="font-medium">{item.slotName}</TableCell>}
                {visibleColumns.startTime && <TableCell>{item.startTime}</TableCell>}
                {visibleColumns.endTime && <TableCell>{item.endTime}</TableCell>}
                {visibleColumns.active && (
                  <TableCell className="text-center">
                    <Switch
                      checked={item.active}
                      onCheckedChange={() => handleStatusToggle(item.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                )}
                {visibleColumns.createdOn && <TableCell>{item.createdOn}</TableCell>}
              </TableRow>
            ))}
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
          
          <div className="space-y-6">
            {/* Slot Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Slot Name</label>
              <Input
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder="Enter slot name"
                className="w-full"
              />
            </div>

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

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleCreateTimeSlot}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Submit
              </Button>
            </div>
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
          
          <div className="space-y-6">
            {/* Slot Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Slot Name</label>
              <Input
                value={editSlotName}
                onChange={(e) => setEditSlotName(e.target.value)}
                placeholder="Enter slot name"
                className="w-full"
              />
            </div>

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

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateTimeSlot}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};