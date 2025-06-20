
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SnaggingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterValues) => void;
}

interface FilterValues {
  tower: string;
  floor: string;
  flat: string;
  stage: string;
}

export const SnaggingFilterDialog = ({ open, onOpenChange, onApplyFilters }: SnaggingFilterDialogProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    tower: '',
    floor: '',
    flat: '',
    stage: ''
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = { tower: '', floor: '', flat: '', stage: '' };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tower</label>
            <Select value={filters.tower} onValueChange={(value) => handleFilterChange('tower', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Snag Entity" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="A">Tower A</SelectItem>
                <SelectItem value="B">Tower B</SelectItem>
                <SelectItem value="C">Tower C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Floor</label>
            <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Flat</label>
            <Select value={filters.flat} onValueChange={(value) => handleFilterChange('flat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Flat" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="101">101</SelectItem>
                <SelectItem value="103">103</SelectItem>
                <SelectItem value="301">301</SelectItem>
                <SelectItem value="501">501</SelectItem>
                <SelectItem value="601">601</SelectItem>
                <SelectItem value="801">801</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stage</label>
            <Select value={filters.stage} onValueChange={(value) => handleFilterChange('stage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Units Snagging">Units Snagging</SelectItem>
                <SelectItem value="Common Area Snagging">Common Area Snagging</SelectItem>
                <SelectItem value="Pre-handover Snagging">Pre-handover Snagging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleApply}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-8"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
