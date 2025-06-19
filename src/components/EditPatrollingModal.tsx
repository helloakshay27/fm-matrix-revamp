
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface EditPatrollingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patrollingId: number;
}

export const EditPatrollingModal = ({ isOpen, onClose, patrollingId }: EditPatrollingModalProps) => {
  const [formData, setFormData] = useState({
    building: 'HDFC Ergo Bhandup',
    wing: 'Wing 1',
    floor: 'Floor 1',
    room: 'Room 1',
    graceTime: '',
    dateValidity: true,
    startDate: '04/15/2024',
    endDate: '04/30/2024',
    startTime: '08:00 AM',
    endTime: '11:00 PM',
    frequency: 'every',
    hours: '3',
    specificTimes: []
  });

  const timeOptions = [
    '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
  ];

  const handleSubmit = () => {
    console.log('Submitting edit patrolling form:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Edit</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Building*</label>
              <Select value={formData.building} onValueChange={(value) => setFormData({ ...formData, building: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDFC Ergo Bhandup">HDFC Ergo Bhandup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Wing</label>
              <Select value={formData.wing} onValueChange={(value) => setFormData({ ...formData, wing: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wing 1">Wing 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Floor</label>
              <Select value={formData.floor} onValueChange={(value) => setFormData({ ...formData, floor: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Floor 1">Floor 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Room</label>
            <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Room 1">Room 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Grace Time (Hours)</label>
            <Select value={formData.graceTime} onValueChange={(value) => setFormData({ ...formData, graceTime: value })}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select Hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="2">2 Hours</SelectItem>
                <SelectItem value="3">3 Hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Select grace period in hours (1 to 12)</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frequency</h3>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.dateValidity}
                onChange={(e) => setFormData({ ...formData, dateValidity: e.target.checked })}
                className="text-blue-600"
              />
              <label className="text-sm">Date Validity</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Date*</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">End Date*</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Time*</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">End Time*</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="frequency"
                  checked={formData.frequency === 'every'}
                  onChange={() => setFormData({ ...formData, frequency: 'every' })}
                  className="text-[#C72030]"
                />
                <label className="text-sm">Every</label>
                <Input
                  type="number"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-16 text-sm"
                  min="1"
                  max="24"
                />
                <span className="text-sm">hour(s)</span>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="frequency"
                  checked={formData.frequency === 'specific'}
                  onChange={() => setFormData({ ...formData, frequency: 'specific' })}
                  className="text-[#C72030]"
                />
                <label className="text-sm">Specific Time</label>
              </div>

              {formData.frequency === 'specific' && (
                <div className="grid grid-cols-4 gap-2 ml-6">
                  {timeOptions.map((time) => (
                    <div key={time} className="flex items-center gap-1">
                      <input type="checkbox" className="text-[#C72030]" />
                      <span className="text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="px-8 hover:opacity-90 border-0"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
