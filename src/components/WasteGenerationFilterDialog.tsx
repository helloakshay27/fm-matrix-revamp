
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface WasteGenerationFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WasteGenerationFilterDialog = ({ isOpen, onClose }: WasteGenerationFilterDialogProps) => {
  const [filters, setFilters] = useState({
    commodity: '',
    category: '',
    operationalName: '',
    dateRange: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleExport = () => {
    console.log('Exporting filtered data');
    onClose();
  };

  const handleReset = () => {
    setFilters({
      commodity: '',
      category: '',
      operationalName: '',
      dateRange: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 [&>button]:hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-1 bg-[#C72030] text-white hover:bg-[#C72030]/90 rounded-none shadow-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Commodity/Source</Label>
              <Select value={filters.commodity} onValueChange={(value) => handleFilterChange('commodity', value)}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select Commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recyclable">Recyclable</SelectItem>
                  <SelectItem value="non-recyclable">Non-Recyclable</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Operational Name of Landlord/ Tenant</Label>
              <Select value={filters.operationalName} onValueChange={(value) => handleFilterChange('operationalName', value)}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select Operational Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abc-corp">ABC Corp</SelectItem>
                  <SelectItem value="xyz-inc">XYZ Inc</SelectItem>
                  <SelectItem value="def-ltd">DEF Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range*</Label>
              <Input
                type="date"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                placeholder="Select Date Range"
                className="rounded-none"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#A01B26] px-8 rounded-none shadow-none"
            >
              Submit
            </Button>
            <Button
              onClick={handleExport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#A01B26] px-8 rounded-none shadow-none"
            >
              Export
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8 rounded-none shadow-none"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
