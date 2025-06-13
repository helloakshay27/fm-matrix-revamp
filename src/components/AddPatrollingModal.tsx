
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface AddPatrollingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatrollingModal = ({ isOpen, onClose }: AddPatrollingModalProps) => {
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [graceTime, setGraceTime] = useState('');
  const [dateValidity, setDateValidity] = useState(false);
  const [startTime, setStartTime] = useState('12:00 AM');
  const [endTime, setEndTime] = useState('11:00 PM');
  const [frequency, setFrequency] = useState('every');
  const [hours, setHours] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const timeSlots = [
    '00', '01', '02', '03', '04', '05',
    '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17',
    '18', '19', '20', '21', '22', '23'
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleSubmit = () => {
    console.log('Patrolling added:', {
      building,
      wing,
      floor,
      room,
      graceTime,
      dateValidity,
      startTime,
      endTime,
      frequency,
      hours,
      selectedTimes
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Add</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* Location Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building" className="text-sm font-medium">
                Building*
              </Label>
              <Select value={building} onValueChange={setBuilding}>
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
              <Select value={wing} onValueChange={setWing}>
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
              <Select value={floor} onValueChange={setFloor}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="room" className="text-sm font-medium">
              Room
            </Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="na">NA</SelectItem>
                <SelectItem value="room1">Room 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grace Time */}
          <div className="space-y-2">
            <Label htmlFor="graceTime" className="text-sm font-medium">
              Grace Time (Hours)
            </Label>
            <Select value={graceTime} onValueChange={setGraceTime}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="2">2 Hours</SelectItem>
                <SelectItem value="3">3 Hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Select grace period in hours (1 to 12)</p>
          </div>

          {/* Frequency Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Frequency</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dateValidity" 
                checked={dateValidity}
                onCheckedChange={setDateValidity}
              />
              <Label htmlFor="dateValidity" className="text-sm">Date Validity</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium">
                  Start Time*
                </Label>
                <Input
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium">
                  End Time*
                </Label>
                <Input
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="every"
                    name="frequency"
                    checked={frequency === 'every'}
                    onChange={() => setFrequency('every')}
                  />
                  <Label htmlFor="every" className="text-sm">Every</Label>
                  <Input
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="border-gray-300 w-20"
                    placeholder="hours"
                    disabled={frequency !== 'every'}
                  />
                  <span className="text-sm">hour(s)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific"
                  name="frequency"
                  checked={frequency === 'specific'}
                  onChange={() => setFrequency('specific')}
                />
                <Label htmlFor="specific" className="text-sm">Specific Time</Label>
              </div>
            </div>

            {/* Time Grid */}
            {frequency === 'specific' && (
              <div className="grid grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimes.includes(time) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className={`h-8 text-xs ${
                      selectedTimes.includes(time) 
                        ? 'bg-[#8B4B8C] hover:bg-[#7A4077]' 
                        : 'border-gray-300'
                    }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
