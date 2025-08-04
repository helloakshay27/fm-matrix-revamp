import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EscalationLevel {
  level: string;
  escalationTo: string;
  days: string;
  hours: string;
  minutes: string;
}

interface EscalationRule {
  level: string;
  escalationTo: string;
  timing: string;
}

export const ExecutiveEscalationTab: React.FC = () => {
  const [escalationData, setEscalationData] = useState<EscalationLevel[]>([
    { level: 'E0', escalationTo: '', days: '', hours: '', minutes: '' },
    { level: 'E1', escalationTo: '', days: '', hours: '', minutes: '' },
    { level: 'E2', escalationTo: '', days: '', hours: '', minutes: '' },
    { level: 'E3', escalationTo: '', days: '', hours: '', minutes: '' }
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
        timing: `${item.days || 0} Day, ${item.hours || 0} Hour, ${item.minutes || 0} Minute`
      }));
    
    setSavedRules(rules);
    console.log('Executive escalation data:', escalationData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Header Row 1 */}
          <div className="grid grid-cols-6 gap-6 font-medium text-gray-700 text-sm border-b border-gray-200 pb-3">
            <div>Levels</div>
            <div className="col-span-2">Escalation To</div>
            <div className="col-span-3 text-center">P1</div>
          </div>

          {/* Header Row 2 */}
          <div className="grid grid-cols-6 gap-6 font-medium text-gray-700 text-sm">
            <div></div>
            <div className="col-span-2"></div>
            <div className="text-center">Days</div>
            <div className="text-center">Hrs</div>
            <div className="text-center">Min</div>
          </div>

          {/* Escalation Levels */}
          {escalationData.map((item, index) => (
            <div key={item.level} className="grid grid-cols-6 gap-6 items-center py-2">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm font-medium">
                {item.level}
              </div>
              
              <div className="col-span-2">
                <Select
                  value={item.escalationTo}
                  onValueChange={(value) => handleFieldChange(index, 'escalationTo', value)}
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 z-50">
                    <SelectValue placeholder="Select an Option..." />
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

              <Input
                type="number"
                value={item.days}
                onChange={(e) => handleFieldChange(index, 'days', e.target.value)}
                placeholder="Days"
                className="text-center bg-white border-gray-300"
              />

              <Input
                type="number"
                value={item.hours}
                onChange={(e) => handleFieldChange(index, 'hours', e.target.value)}
                placeholder="Hrs"
                className="text-center bg-white border-gray-300"
              />

              <Input
                type="number"
                value={item.minutes}
                onChange={(e) => handleFieldChange(index, 'minutes', e.target.value)}
                placeholder="Min"
                className="text-center bg-white border-gray-300"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      {savedRules.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-teal-600 mb-6">Rule</h3>
          
          <div className="space-y-4">
            {/* Rules Header */}
            <div className="grid grid-cols-3 gap-8 font-medium text-gray-700 text-sm border-b border-gray-200 pb-3">
              <div>Levels</div>
              <div>Escalation To</div>
              <div>P1</div>
            </div>

            {/* Rules Data */}
            {savedRules.map((rule, index) => (
              <div key={index} className="grid grid-cols-3 gap-8 text-sm py-2">
                <div className="font-medium text-gray-800">{rule.level}</div>
                <div className="text-gray-700">{rule.escalationTo}</div>
                <div className="text-gray-700">{rule.timing}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};