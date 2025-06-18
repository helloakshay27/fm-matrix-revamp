
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LocationDetailsSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

export const LocationDetailsSection: React.FC<LocationDetailsSectionProps> = ({
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
          1
        </div>
        <h3 className="text-lg font-semibold text-sidebar-foreground">LOCATION DETAILS</h3>
        {expanded ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
      </div>
      
      {expanded && (
        <div className="bg-white p-6 rounded-lg border border-sidebar-border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Site*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="site1">Site 1</SelectItem>
                  <SelectItem value="site2">Site 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Building</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building1">Building 1</SelectItem>
                  <SelectItem value="building2">Building 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Wing</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Wing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wing1">Wing 1</SelectItem>
                  <SelectItem value="wing2">Wing 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Area</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area1">Area 1</SelectItem>
                  <SelectItem value="area2">Area 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Floor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floor1">Floor 1</SelectItem>
                  <SelectItem value="floor2">Floor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-sm font-medium text-sidebar-foreground mb-2">Room</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room1">Room 1</SelectItem>
                  <SelectItem value="room2">Room 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
