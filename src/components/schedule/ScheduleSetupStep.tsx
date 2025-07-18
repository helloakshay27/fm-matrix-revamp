
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScheduleSetupStepProps {
  data: {
    scheduleType: string;
    timeSlots: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ScheduleSetupStep = ({ 
  data, 
  onChange, 
  isCompleted = false,
  isCollapsed = false,
  onToggleCollapse 
}: ScheduleSetupStepProps) => {
  const addTimeSlot = () => {
    const newSlots = [...data.timeSlots, { day: '', startTime: '', endTime: '' }];
    onChange('timeSlots', newSlots);
  };

  const removeTimeSlot = (index: number) => {
    const newSlots = data.timeSlots.filter((_, i) => i !== index);
    onChange('timeSlots', newSlots);
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    const newSlots = [...data.timeSlots];
    newSlots[index][field] = value;
    onChange('timeSlots', newSlots);
  };

  if (isCompleted && isCollapsed) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader 
          className="cursor-pointer"
          onClick={onToggleCollapse}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <CardTitle className="text-lg">Schedule Setup</CardTitle>
            </div>
            <ChevronDown className="w-5 h-5 text-green-600" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`mb-6 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-[#C72030]'}`}>
      <CardHeader className={onToggleCollapse ? 'cursor-pointer' : ''} onClick={onToggleCollapse}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm text-white ${
              isCompleted ? 'bg-green-600' : 'bg-[#C72030]'
            }`}>
              2
            </div>
            <CardTitle className="text-lg">Schedule Setup</CardTitle>
          </div>
          {isCompleted && onToggleCollapse && (
            <ChevronUp className="w-5 h-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Schedule Type</Label>
          <RadioGroup 
            value={data.scheduleType} 
            onValueChange={(value) => onChange('scheduleType', value)}
            className="flex gap-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="text-sm">Fixed Schedule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible" className="text-sm">Flexible Schedule</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Slots</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Time Slot
            </Button>
          </div>

          {data.timeSlots.map((slot, index) => (
            <div key={index} className="flex gap-4 items-center p-4 border rounded-lg">
              <div className="flex-1">
                <Select value={slot.day} onValueChange={(value) => updateTimeSlot(index, 'day', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                  placeholder="Start Time"
                />
              </div>
              
              <div className="flex-1">
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                  placeholder="End Time"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTimeSlot(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
