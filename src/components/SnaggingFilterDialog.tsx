
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface SnaggingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const SnaggingFilterDialog = ({ open, onOpenChange, onApply }: SnaggingFilterDialogProps) => {
  const [filters, setFilters] = useState({
    tower: '',
    floor: '',
    flat: '',
    stage: ''
  });

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      tower: '',
      floor: '',
      flat: '',
      stage: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tower</label>
            <Select value={filters.tower} onValueChange={(value) => setFilters({...filters, tower: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Snag Entity" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="A">Tower A</SelectItem>
                <SelectItem value="B">Tower B</SelectItem>
                <SelectItem value="C">Tower C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Floor</label>
            <Select value={filters.floor} onValueChange={(value) => setFilters({...filters, floor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="1st">1st Floor</SelectItem>
                <SelectItem value="2nd">2nd Floor</SelectItem>
                <SelectItem value="3rd">3rd Floor</SelectItem>
                <SelectItem value="4th">4th Floor</SelectItem>
                <SelectItem value="5th">5th Floor</SelectItem>
                <SelectItem value="6th">6th Floor</SelectItem>
                <SelectItem value="7th">7th Floor</SelectItem>
                <SelectItem value="8th">8th Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Flat</label>
            <Select value={filters.flat} onValueChange={(value) => setFilters({...filters, flat: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Flat" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="101">101</SelectItem>
                <SelectItem value="102">102</SelectItem>
                <SelectItem value="103">103</SelectItem>
                <SelectItem value="301">301</SelectItem>
                <SelectItem value="501">501</SelectItem>
                <SelectItem value="601">601</SelectItem>
                <SelectItem value="801">801</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Stage</label>
            <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="units-snagging">Units Snagging</SelectItem>
                <SelectItem value="pre-handover">Pre Handover</SelectItem>
                <SelectItem value="post-handover">Post Handover</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            APPLY
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
