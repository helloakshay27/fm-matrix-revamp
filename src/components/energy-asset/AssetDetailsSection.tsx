
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AssetDetailsSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

export const AssetDetailsSection: React.FC<AssetDetailsSectionProps> = ({
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
          2
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground">ASSET DETAILS</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Asset Name*</Label>
              <Input placeholder="Enter Text" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Asset No.*</Label>
              <Input placeholder="Enter Number" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Equipment ID*</Label>
              <Input placeholder="Enter Number" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Model No.</Label>
              <Input placeholder="Enter Number" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Serial No.</Label>
              <Input placeholder="Enter Number" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Consumer No.</Label>
              <Input placeholder="Enter Number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchase Cost*</Label>
              <Input placeholder="Enter Numeric value" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Capacity</Label>
              <Input placeholder="Enter Text" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Unit</Label>
              <Input placeholder="Enter Text" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Group*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Group 1</SelectItem>
                  <SelectItem value="group2">Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Subgroup*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select SubGroup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                  <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchased ON Date</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Expiry date</Label>
              <Input type="date" />
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Manufacturer</Label>
              <Input placeholder="Enter Manufacturer Name" />
            </div>
          </div>

          {/* Radio Button Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-3">Location Type</Label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="locationType" value="commonArea" className="mr-2" />
                  <span className="text-sidebar-foreground">Common Area</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="locationType" value="customer" className="mr-2" />
                  <span className="text-sidebar-foreground">Customer</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="locationType" value="na" className="mr-2" />
                  <span className="text-sidebar-foreground">NA</span>
                </label>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-3">Asset Type</Label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="assetType" value="parent" className="mr-2" />
                  <span className="text-sidebar-foreground">Parent</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="assetType" value="sub" className="mr-2" />
                  <span className="text-sidebar-foreground">Sub</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-3">Status</Label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="status" value="inUse" className="mr-2" />
                  <span className="text-sidebar-foreground">In Use</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="status" value="breakdown" className="mr-2" />
                  <span className="text-sidebar-foreground">Breakdown</span>
                </label>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-3">Critical:</Label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="critical" value="yes" className="mr-2" />
                  <span className="text-sidebar-foreground">Yes</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="critical" value="no" className="mr-2" />
                  <span className="text-sidebar-foreground">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <Checkbox className="mr-2" />
              <span className="text-sidebar-foreground">Meter Applicable</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
