
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload } from 'lucide-react';

interface AddPatrollingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatrollingModal = ({ isOpen, onClose }: AddPatrollingModalProps) => {
  const [formData, setFormData] = useState({
    building: '',
    wing: '',
    floor: '',
    room: '',
    description: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
    recurring: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, recurring: checked }));
  };

  const handleSubmit = () => {
    console.log('Patrolling data:', formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      building: '',
      wing: '',
      floor: '',
      room: '',
      description: '',
      priority: '',
      assignedTo: '',
      dueDate: '',
      recurring: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Add New Patrolling Task</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Location Details */}
          <div>
            <div className="text-sm text-orange-600 font-medium mb-4">Location Details</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building" className="text-sm font-medium">
                  Building *
                </Label>
                <Select value={formData.building} onValueChange={(value) => handleInputChange('building', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jyoti-tower">Jyoti Tower</SelectItem>
                    <SelectItem value="nirvana-tower">Nirvana Tower</SelectItem>
                    <SelectItem value="hay">Hay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wing" className="text-sm font-medium">
                  Wing
                </Label>
                <Select value={formData.wing} onValueChange={(value) => handleInputChange('wing', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A Wing</SelectItem>
                    <SelectItem value="b">B Wing</SelectItem>
                    <SelectItem value="na">NA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor" className="text-sm font-medium">
                  Floor
                </Label>
                <Select value={formData.floor} onValueChange={(value) => handleInputChange('floor', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Floor</SelectItem>
                    <SelectItem value="2nd">2nd Floor</SelectItem>
                    <SelectItem value="na">NA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room" className="text-sm font-medium">
                  Room
                </Label>
                <Select value={formData.room} onValueChange={(value) => handleInputChange('room', value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="na">NA</SelectItem>
                    <SelectItem value="room1">Room 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div>
            <div className="text-sm text-orange-600 font-medium mb-4">Task Details</div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter task description"
                  className="border-gray-300"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority *
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-sm font-medium">
                    Assigned To
                  </Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff1">Staff 1</SelectItem>
                      <SelectItem value="staff2">Staff 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={formData.recurring}
                      onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
                    />
                    <Label htmlFor="recurring" className="text-sm">
                      Recurring Task
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2"
            >
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
