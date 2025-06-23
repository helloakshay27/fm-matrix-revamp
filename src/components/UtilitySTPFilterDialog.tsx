
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

interface UtilitySTPFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilitySTPFilterDialog = ({ isOpen, onClose }: UtilitySTPFilterDialogProps) => {
  const handleSubmit = () => {
    console.log('Filtering STP assets...');
    onClose();
  };

  const handleExport = () => {
    // Create and download CSV file for filtered results
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      "Sample STP Asset,STP001,STP-001,001,In Use,EQ001,Main Site,Building A,East Wing,Ground Floor,Treatment Area,Room 101,Flow Meter,STP Equipment";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stp_filtered_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting filtered STP assets...');
    onClose();
  };

  const handleReset = () => {
    console.log('Resetting STP filters...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Asset Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#C72030]">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input placeholder="Enter Asset Name" />
              </div>
              <div className="space-y-2">
                <Label>Date Range*</Label>
                <Input placeholder="Select Date Range" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stp">STP Equipment</SelectItem>
                    <SelectItem value="water">Water Treatment</SelectItem>
                    <SelectItem value="waste">Waste Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subgroup</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Treatment</SelectItem>
                    <SelectItem value="secondary">Secondary Treatment</SelectItem>
                    <SelectItem value="tertiary">Tertiary Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#C72030]">Location Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Building</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a">Building A</SelectItem>
                    <SelectItem value="building-b">Building B</SelectItem>
                    <SelectItem value="building-c">Building C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Wing</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East Wing</SelectItem>
                    <SelectItem value="west">West Wing</SelectItem>
                    <SelectItem value="north">North Wing</SelectItem>
                    <SelectItem value="south">South Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Area</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treatment">Treatment Area</SelectItem>
                    <SelectItem value="storage">Storage Area</SelectItem>
                    <SelectItem value="maintenance">Maintenance Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="first">First Floor</SelectItem>
                    <SelectItem value="second">Second Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room-101">Room 101</SelectItem>
                    <SelectItem value="room-102">Room 102</SelectItem>
                    <SelectItem value="room-103">Room 103</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Submit
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Export
          </Button>
          <Button 
            onClick={handleReset}
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
