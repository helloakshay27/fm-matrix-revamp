
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
    checklistType: string;
    assetType?: string;
    assetGroup?: string;
    branch?: string;
    department?: string;
    location?: string;
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
          <Label className="text-sm font-medium">Checklist Type</Label>
          <RadioGroup 
            value={data.checklistType} 
            onValueChange={(value) => onChange('checklistType', value)}
            className="flex gap-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="text-sm">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="assetGroup" id="assetGroup" />
              <Label htmlFor="assetGroup" className="text-sm">Asset Group</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="branching" id="branching" />
              <Label htmlFor="branching" className="text-sm">Branching</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
