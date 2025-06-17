
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskRescheduleDialog = ({ open, onOpenChange }: TaskRescheduleDialogProps) => {
  const [formData, setFormData] = useState({
    scheduleDate: '06/17/2025',
    time: '',
    selectUsers: '',
    emailNotification: false,
    smsNotification: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rescheduling task:', formData);
    toast.success('Task rescheduled successfully!');
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0">
        <div className="flex items-center justify-between p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Task Reschedule</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* New Schedule Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">New Schedule</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date
                </label>
                <Input
                  type="text"
                  value={formData.scheduleDate}
                  onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  placeholder="Time"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Notify Users Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Notify Users</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Users
                </label>
                <Select
                  value={formData.selectUsers}
                  onValueChange={(value) => handleInputChange('selectUsers', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vinayak">Vinayak Mane</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="all">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={formData.emailNotification}
                      onCheckedChange={(checked) => handleInputChange('emailNotification', checked as boolean)}
                    />
                    <label htmlFor="email" className="text-sm text-gray-700">
                      Email
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={formData.smsNotification}
                      onCheckedChange={(checked) => handleInputChange('smsNotification', checked as boolean)}
                    />
                    <label htmlFor="sms" className="text-sm text-gray-700">
                      SMS
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              style={{ backgroundColor: '#C72030' }}
              className="text-white px-6 py-2 hover:bg-[#C72030]/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
