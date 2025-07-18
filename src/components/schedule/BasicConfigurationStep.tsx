
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
    activityType: string;
    activityName: string;
    description: string;
    attachment: File | null;
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
        <div>
          <Label className="text-sm font-medium">Activity Type</Label>
          <RadioGroup 
            value={data.activityType} 
            onValueChange={(value) => onChange('activityType', value)}
            className="flex gap-4 mt-1"
          >
            {['Safety', 'Quality', 'Environment', 'Compliance'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type.toLowerCase()} id={type.toLowerCase()} />
                <Label htmlFor={type.toLowerCase()} className="text-sm">{type}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="activityName" className="text-sm font-medium">Activity Name</Label>
          <Input
            id="activityName"
            value={data.activityName}
            onChange={(e) => onChange('activityName', e.target.value)}
            placeholder="Enter activity name"
            className="mt-1"
          />
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

        <div>
          <Label htmlFor="attachment" className="text-sm font-medium">Add Attachment</Label>
          <Input
            id="attachment"
            type="file"
            onChange={(e) => onChange('attachment', e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};
