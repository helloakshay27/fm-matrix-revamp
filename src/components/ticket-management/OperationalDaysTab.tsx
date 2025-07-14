
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const initialSchedule: DaySchedule[] = [
  { day: 'Monday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Tuesday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Wednesday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Thursday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Friday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
];

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export const OperationalDaysTab: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateDay = (index: number, field: keyof DaySchedule, value: boolean | string) => {
    const updated = schedule.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    );
    setSchedule(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Operational Days Schedule:', schedule);
      toast.success('Operational days saved successfully!');
    } catch (error) {
      toast.error('Failed to save operational days');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = () => {
    toast.info('Import functionality not implemented yet');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Operational Days Setup</span>
            <Button onClick={handleImport} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((daySchedule, index) => (
              <div key={daySchedule.day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={daySchedule.enabled}
                    onCheckedChange={(checked) => updateDay(index, 'enabled', !!checked)}
                  />
                  <label className="font-medium">{daySchedule.day}</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <Select
                    value={daySchedule.startTime}
                    onValueChange={(value) => updateDay(index, 'startTime', value)}
                    disabled={!daySchedule.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <Select
                    value={daySchedule.endTime}
                    onValueChange={(value) => updateDay(index, 'endTime', value)}
                    disabled={!daySchedule.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-500">
                  {daySchedule.enabled ? 
                    `${daySchedule.startTime} - ${daySchedule.endTime}` : 
                    'Not operational'
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
