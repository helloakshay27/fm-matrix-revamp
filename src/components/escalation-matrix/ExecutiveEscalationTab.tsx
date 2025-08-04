import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EscalationLevel {
  level: string;
  escalationTo: string;
  p1Days: string;
  p1Hours: string;
  p1Minutes: string;
  p2Days: string;
  p2Hours: string;
  p2Minutes: string;
}

interface EscalationRule {
  level: string;
  escalationTo: string;
  timing: string;
}

export const ExecutiveEscalationTab: React.FC = () => {
  const [escalationData, setEscalationData] = useState<EscalationLevel[]>([
    { level: 'E1', escalationTo: '', p1Days: '', p1Hours: '', p1Minutes: '', p2Days: '', p2Hours: '', p2Minutes: '' },
    { level: 'E2', escalationTo: '', p1Days: '', p1Hours: '', p1Minutes: '', p2Days: '', p2Hours: '', p2Minutes: '' },
    { level: 'E3', escalationTo: '', p1Days: '', p1Hours: '', p1Minutes: '', p2Days: '', p2Hours: '', p2Minutes: '' },
    { level: 'E4', escalationTo: '', p1Days: '', p1Hours: '', p1Minutes: '', p2Days: '', p2Hours: '', p2Minutes: '' },
    { level: 'E5', escalationTo: '', p1Days: '', p1Hours: '', p1Minutes: '', p2Days: '', p2Hours: '', p2Minutes: '' }
  ]);

  const [savedRules, setSavedRules] = useState<EscalationRule[]>([]);

  const escalationOptions = [
    'Select an Option...',
    'Abhiraj Gaar, Locktated Customercare',
    'Dinesh Shinde',
    'Devesh Jain',
    'Manager',
    'Senior Manager',
    'Department Head',
    'Director',
    'CEO'
  ];

  const handleFieldChange = (index: number, field: keyof EscalationLevel, value: string) => {
    setEscalationData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    const rules = escalationData
      .filter(item => item.escalationTo && item.escalationTo !== 'Select an Option...')
      .map(item => ({
        level: item.level,
        escalationTo: item.escalationTo,
        timing: `${item.p1Days || 0} Day, ${item.p1Hours || 0} Hour, ${item.p1Minutes || 0} Minute`
      }));
    
    setSavedRules(rules);
    console.log('Executive escalation data:', escalationData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-hidden">
          {/* Header Row 1 */}
          <div className="grid grid-cols-9 gap-0 bg-gray-100 border-b border-gray-300">
            <div className="p-4 border-r border-gray-300 font-medium text-gray-700 text-sm">Levels</div>
            <div className="p-4 border-r border-gray-300 font-medium text-gray-700 text-sm col-span-2">Escalation To</div>
            <div className="p-4 border-r border-gray-300 font-medium text-gray-700 text-sm text-center col-span-3">P1</div>
            <div className="p-4 font-medium text-gray-700 text-sm text-center col-span-3">P2</div>
          </div>

          {/* Header Row 2 */}
          <div className="grid grid-cols-9 gap-0 bg-gray-50 border-b border-gray-300">
            <div className="p-3 border-r border-gray-300"></div>
            <div className="p-3 border-r border-gray-300 col-span-2"></div>
            <div className="p-3 border-r border-gray-300 text-center text-sm text-gray-600">Day</div>
            <div className="p-3 border-r border-gray-300 text-center text-sm text-gray-600">Hrs</div>
            <div className="p-3 border-r border-gray-300 text-center text-sm text-gray-600">Min</div>
            <div className="p-3 border-r border-gray-300 text-center text-sm text-gray-600">Day</div>
            <div className="p-3 border-r border-gray-300 text-center text-sm text-gray-600">Hrs</div>
            <div className="p-3 text-center text-sm text-gray-600">Min</div>
          </div>

          {/* Escalation Levels */}
          {escalationData.map((item, index) => (
            <div key={item.level} className={`grid grid-cols-9 gap-0 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="p-4 border-r border-gray-300 bg-gray-100 font-medium text-gray-800 text-sm">
                {item.level}
              </div>
              
              <div className="col-span-2 p-2 border-r border-gray-300">
                <Select
                  value={item.escalationTo}
                  onValueChange={(value) => handleFieldChange(index, 'escalationTo', value)}
                >
                  <SelectTrigger className="w-full bg-white border-0 shadow-none h-8 text-sm">
                    <SelectValue placeholder="Select up to 15 Options..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                    {escalationOptions.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-gray-100">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2 border-r border-gray-300">
                <Input
                  type="number"
                  value={item.p1Days}
                  onChange={(e) => handleFieldChange(index, 'p1Days', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>

              <div className="p-2 border-r border-gray-300">
                <Input
                  type="number"
                  value={item.p1Hours}
                  onChange={(e) => handleFieldChange(index, 'p1Hours', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>

              <div className="p-2 border-r border-gray-300">
                <Input
                  type="number"
                  value={item.p1Minutes}
                  onChange={(e) => handleFieldChange(index, 'p1Minutes', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>

              <div className="p-2 border-r border-gray-300">
                <Input
                  type="number"
                  value={item.p2Days}
                  onChange={(e) => handleFieldChange(index, 'p2Days', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>

              <div className="p-2 border-r border-gray-300">
                <Input
                  type="number"
                  value={item.p2Hours}
                  onChange={(e) => handleFieldChange(index, 'p2Hours', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>

              <div className="p-2">
                <Input
                  type="number"
                  value={item.p2Minutes}
                  onChange={(e) => handleFieldChange(index, 'p2Minutes', e.target.value)}
                  placeholder="0"
                  className="text-center bg-transparent border-0 shadow-none h-8 text-sm"
                />
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center py-6">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rule</h3>
        
        <div className="space-y-4">
          {/* Rules Header */}
          <div className="grid grid-cols-3 gap-8 font-medium text-gray-700 text-sm border-b border-gray-200 pb-3">
            <div>Levels</div>
            <div>Escalation To</div>
            <div>P1</div>
          </div>

          {/* Static Rules Data */}
          <div className="grid grid-cols-3 gap-8 text-sm py-2">
            <div className="font-medium text-gray-800">E0</div>
            <div className="text-gray-700">Abhiraj Gaar, Locktated Customercare</div>
            <div className="text-gray-700"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-sm py-2">
            <div className="font-medium text-gray-800">E1</div>
            <div className="text-gray-700">Dinesh Shinde</div>
            <div className="text-gray-700">0 Day, 1 Hour, 0 Minute</div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-sm py-2">
            <div className="font-medium text-gray-800">E2</div>
            <div className="text-gray-700">Devesh Jain</div>
            <div className="text-gray-700">0 Day, 2 Hour, 0 Minute</div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-sm py-2">
            <div className="font-medium text-gray-800">E3</div>
            <div className="text-gray-700"></div>
            <div className="text-gray-700">0 Day, 3 Hour, 0 Minute</div>
          </div>
        </div>
      </div>

    </div>
  );
};