
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BasicConfigurationStepProps {
  data: {
    scheduleName: string;
    description: string;
    frequency: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const BasicConfigurationStep = ({ 
  data, 
  onChange, 
  isCompleted = false,
  isCollapsed = false,
  onToggleCollapse 
}: BasicConfigurationStepProps) => {
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
                1
              </div>
              <CardTitle className="text-lg">Basic Configuration</CardTitle>
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
              1
            </div>
            <CardTitle className="text-lg">Basic Configuration</CardTitle>
          </div>
          {isCompleted && onToggleCollapse && (
            <ChevronUp className="w-5 h-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="scheduleName" className="text-sm font-medium">Schedule Name</Label>
            <Input
              id="scheduleName"
              value={data.scheduleName}
              onChange={(e) => onChange('scheduleName', e.target.value)}
              placeholder="Enter schedule name"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Frequency</Label>
            <RadioGroup 
              value={data.frequency} 
              onValueChange={(value) => onChange('frequency', value)}
              className="flex gap-4 mt-1"
            >
              {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'].map((freq) => (
                <div key={freq} className="flex items-center space-x-2">
                  <RadioGroupItem value={freq} id={freq.toLowerCase()} />
                  <Label htmlFor={freq.toLowerCase()} className="text-sm">{freq}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Enter description"
            className="mt-1 min-h-20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={data.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
