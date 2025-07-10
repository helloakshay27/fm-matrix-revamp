
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TaskEscalationPage = () => {
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
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            <span>⏰</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Task Escalations</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-8 font-medium text-gray-700 text-base border-b border-gray-200 pb-4">
              <div>Level</div>
              <div>Days</div>
              <div>Escalation To</div>
            </div>

            {/* E1 Level */}
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="bg-gray-100 px-4 py-3 rounded-md border text-base font-medium">E1</div>
              <Input
                type="number"
                value={escalationData.E1.days}
                onChange={(e) => handleDaysChange('E1', e.target.value)}
                className="h-12 text-base"
              />
              <Select
                value={escalationData.E1.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E1', value)}
              >
                <SelectTrigger className="h-12 text-base">
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
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="bg-gray-100 px-4 py-3 rounded-md border text-base font-medium">E2</div>
              <Input
                type="number"
                value={escalationData.E2.days}
                onChange={(e) => handleDaysChange('E2', e.target.value)}
                className="h-12 text-base"
              />
              <Select
                value={escalationData.E2.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E2', value)}
              >
                <SelectTrigger className="h-12 text-base">
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
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="bg-gray-100 px-4 py-3 rounded-md border text-base font-medium">E3</div>
              <Input
                type="number"
                value={escalationData.E3.days}
                onChange={(e) => handleDaysChange('E3', e.target.value)}
                className="h-12 text-base"
              />
              <Select
                value={escalationData.E3.escalationTo}
                onValueChange={(value) => handleEscalationToChange('E3', value)}
              >
                <SelectTrigger className="h-12 text-base">
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
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white px-12 py-3 text-base font-medium"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
