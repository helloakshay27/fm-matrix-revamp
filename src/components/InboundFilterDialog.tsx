
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface InboundFilterDialogProps {
  onClose: () => void;
}

export const InboundFilterDialog: React.FC<InboundFilterDialogProps> = ({ onClose }) => {
  const [filters, setFilters] = useState({
    status: '',
    vendor: '',
    receivedOn: '',
    collectedOn: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      status: '',
      vendor: '',
      receivedOn: '',
      collectedOn: ''
    });
  };

  return (
    <div>
      <DialogHeader className="flex flex-row items-center justify-between">
        <DialogTitle>FILTER BY</DialogTitle>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </DialogHeader>
      
      <div className="mt-6 space-y-4">
        <div className="text-sm font-medium text-gray-700 mb-4">Asset Details</div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">Select Status</option>
            <option value="collected">Collected</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <Label htmlFor="vendor">Select Vendor</Label>
          <select
            id="vendor"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filters.vendor}
            onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
          >
            <option value="">Select Vendor</option>
            <option value="bluedart">Bluedart</option>
            <option value="magic-enterprise">Magic Enterprise</option>
            <option value="dhl">DHL</option>
          </select>
        </div>

        <div>
          <Label htmlFor="receivedOn">Received On</Label>
          <Input
            id="receivedOn"
            type="date"
            placeholder="Select Received On"
            value={filters.receivedOn}
            onChange={(e) => setFilters(prev => ({ ...prev, receivedOn: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="collectedOn">Collected On</Label>
          <Input
            id="collectedOn"
            type="date"
            placeholder="Select Received On"
            value={filters.collectedOn}
            onChange={(e) => setFilters(prev => ({ ...prev, collectedOn: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
        <Button
          onClick={handleApply}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Apply
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="px-8"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
