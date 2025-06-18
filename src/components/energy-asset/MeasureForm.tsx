
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface MeasureFormProps {
  index: number;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const MeasureForm: React.FC<MeasureFormProps> = ({
  index,
  onRemove,
  showRemove = false
}) => {
  return (
    <div className="mb-6 p-4 border border-sidebar-border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-sidebar-foreground">Measure {index + 1}</h4>
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Name</Label>
          <Input placeholder="Enter Text" />
        </div>
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Unit Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Unit Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kwh">kWh</SelectItem>
              <SelectItem value="units">Units</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Min</Label>
          <Input placeholder="Enter Number" />
        </div>
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Max</Label>
          <Input placeholder="Enter Number" />
        </div>
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Below Val.</Label>
          <Input placeholder="Enter Value" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Above Val.</Label>
          <Input placeholder="Enter Value" />
        </div>
        <div>
          <Label className="text-sm font-medium text-sidebar-foreground mb-2">Multiplier Factor</Label>
          <Input placeholder="Enter Text" />
        </div>
      </div>
      <div className="flex items-center">
        <Checkbox className="mr-2" />
        <Label className="text-sm text-sidebar-foreground">Check Previous Reading</Label>
      </div>
    </div>
  );
};
