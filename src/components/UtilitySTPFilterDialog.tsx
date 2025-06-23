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
      <DialogContent className="w-[755px] h-[560px] md:w-[530px] md:h-[300px] sm:w-[310px] sm:h-[230px] max-w-none rounded-none shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] border-[#E4E4E4] [&>button]:hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#1F2937]">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Asset Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#C72030]">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-[#374151]">Asset Name</Label>
                <Input placeholder="Enter Asset Name" className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#374151]">Date Range*</Label>
                <Input placeholder="Select Date Range" className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Group</Label>
                <Select>
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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
                  <SelectTrigger className="rounded-none">
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

        <div className="flex justify-center gap-4 px-6 pb-6">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01B26] text-white rounded-none px-8 py-2 h-10 text-sm font-medium shadow-none border-none"
          >
            Submit
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-[#C72030] hover:bg-[#A01B26] text-white rounded-none px-8 py-2 h-10 text-sm font-medium shadow-none border-none"
          >
            Export
          </Button>
          <Button 
            onClick={handleReset}
            className="bg-[#C72030] hover:bg-[#A01B26] text-white rounded-none px-8 py-2 h-10 text-sm font-medium shadow-none border-none"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
