
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WarrantyDetailsSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

export const WarrantyDetailsSection: React.FC<WarrantyDetailsSectionProps> = ({
  expanded,
  onToggle
}) => {
  return (
    <div className="mb-6">
      <div 
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={onToggle}
      >
        <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
          3
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground">Warranty Details</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          <div className="mb-6">
            <Label className="text-sm font-medium text-sidebar-foreground mb-3">Under Warranty:</Label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input type="radio" name="underWarranty" value="yes" className="mr-2" />
                <span className="text-sidebar-foreground">Yes</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="underWarranty" value="no" className="mr-2" />
                <span className="text-sidebar-foreground">No</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Warranty Start Date</Label>
              <Input type="date" placeholder="Select Date" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Warranty expires on</Label>
              <Input type="date" placeholder="Select Date" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Commissioning Date</Label>
              <Input type="date" placeholder="Select Date" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
