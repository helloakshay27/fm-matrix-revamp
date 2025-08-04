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
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 font-medium text-gray-700 text-sm">
            <div>Levels</div>
            <div>Escalation To</div>
            <div className="text-center">P1</div>
            <div></div>
            <div></div>
          </div>

          <div className="grid grid-cols-5 gap-4 font-medium text-gray-700 text-sm">
            <div></div>
            <div></div>
            <div className="text-center">Days</div>
            <div className="text-center">Hrs</div>
            <div className="text-center">Min</div>
          </div>

          {/* Escalation Levels */}
          {escalationData.map((item, index) => (
            <div key={item.level} className="grid grid-cols-5 gap-4 items-center">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm font-medium">
                {item.level}
              </div>
              
              <Select
                value={item.escalationTo}
                onValueChange={(value) => handleFieldChange(index, 'escalationTo', value)}
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

              <Input
                type="number"
                value={item.days}
                onChange={(e) => handleFieldChange(index, 'days', e.target.value)}
                placeholder="0"
                className="text-center"
              />

              <Input
                type="number"
                value={item.hours}
                onChange={(e) => handleFieldChange(index, 'hours', e.target.value)}
                placeholder="0"
                className="text-center"
              />

              <Input
                type="number"
                value={item.minutes}
                onChange={(e) => handleFieldChange(index, 'minutes', e.target.value)}
                placeholder="0"
                className="text-center"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      {savedRules.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Rule</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6 font-medium text-gray-700 text-sm">
              <div>Levels</div>
              <div>Escalation To</div>
              <div>P1</div>
            </div>

            {savedRules.map((rule, index) => (
              <div key={index} className="grid grid-cols-3 gap-6 text-sm">
                <div className="font-medium">{rule.level}</div>
                <div>{rule.escalationTo}</div>
                <div>{rule.timing}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};