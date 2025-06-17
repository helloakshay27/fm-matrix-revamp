
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const InventoryFilterDialog: React.FC<InventoryFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    category: '',
    criticality: '',
    inventoryType: ''
  });

  const handleApply = () => {
    console.log('Applying Inventory filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      code: '',
      category: '',
      criticality: '',
      inventoryType: ''
    });
  };

  const handleExport = () => {
    console.log('Exporting with filters:', filters);
    alert('Export functionality executed with current filters');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                placeholder="Enter Name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Code</label>
              <Input
                placeholder="Search by code"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Criticality</label>
              <Select value={filters.criticality} onValueChange={(value) => setFilters({ ...filters, criticality: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Criticality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="non-critical">Non-Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Inventory Type</label>
              <Select value={filters.inventoryType} onValueChange={(value) => setFilters({ ...filters, inventoryType: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Inventory Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="spare-part">Spare Part</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleExport}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-6"
          >
            Export
          </Button>
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-6"
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="px-6"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
