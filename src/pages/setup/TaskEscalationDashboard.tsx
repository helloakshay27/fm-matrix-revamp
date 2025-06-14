
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TaskEscalationDashboard = () => {
  const [escalationData, setEscalationData] = useState({
    E1: { days: '1', escalationTo: '' },
    E2: { days: '2', escalationTo: '' },
    E3: { days: '3', escalationTo: '' }
  });

  const escalationOptions = [
    'Select an Option...',
    'Manager',
    'Senior Manager',
    'Department Head',
    'Director',
    'CEO'
  ];

  const handleDaysChange = (level: string, days: string) => {
    setEscalationData(prev => ({
      ...prev,
      [level]: { ...prev[level], days }
    }));
  };

  const handleEscalationToChange = (level: string, escalationTo: string) => {
    setEscalationData(prev => ({
      ...prev,
      [level]: { ...prev[level], escalationTo }
    }));
  };

  const handleSubmit = () => {
    console.log('Task escalation data:', escalationData);
    // Handle form submission logic here
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            2
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Task Escalations</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6 font-medium text-gray-700 text-sm">
              <div>Level</div>
              <div>Days</div>
              <div>Escalation To</div>
            </div>

            {/* E1 Level */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm">E1</div>
              <Input
                type="number"
                value={escalationData.E1.days}
                onChange={(e) => handleDaysChange('E1', e.target.value)}
                className="w-full"
              />
              <Select
                value={escalationData.E1.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E1', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Option..." />
                </SelectTrigger>
                <SelectContent>
                  {escalationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* E2 Level */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm">E2</div>
              <Input
                type="number"
                value={escalationData.E2.days}
                onChange={(e) => handleDaysChange('E2', e.target.value)}
                className="w-full"
              />
              <Select
                value={escalationData.E2.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E2', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Option..." />
                </SelectTrigger>
                <SelectContent>
                  {escalationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* E3 Level */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm">E3</div>
              <Input
                type="number"
                value={escalationData.E3.days}
                onChange={(e) => handleDaysChange('E3', e.target.value)}
                className="w-full"
              />
              <Select
                value={escalationData.E3.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E3', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an Option..." />
                </SelectTrigger>
                <SelectContent>
                  {escalationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
