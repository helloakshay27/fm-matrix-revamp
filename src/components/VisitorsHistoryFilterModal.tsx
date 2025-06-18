
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface VisitorsHistoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorsHistoryFilterModal: React.FC<VisitorsHistoryFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [personToMeet, setPersonToMeet] = useState('');
  const [purposeCategory, setPurposeCategory] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleApply = () => {
    // Handle filter application logic here
    console.log('Applying filters:', { personToMeet, purposeCategory, dateRange });
    onClose();
  };

  const handleReset = () => {
    setPersonToMeet('');
    setPurposeCategory('');
    setDateRange('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Person To Meet */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Person To Meet
            </label>
            <Select value={personToMeet} onValueChange={setPersonToMeet}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Person To Meet" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="abdul-ghaffar">Abdul Ghaffar</SelectItem>
                <SelectItem value="arun">Arun</SelectItem>
                <SelectItem value="aryan">Aryan</SelectItem>
                <SelectItem value="vinayak-mane">Vinayak Mane</SelectItem>
                <SelectItem value="sohail-ansari">Sohail Ansari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Purpose/Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Purpose/Category
            </label>
            <Select value={purposeCategory} onValueChange={setPurposeCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Purpose/Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="guest">Guest</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Date Range
            </label>
            <Input
              type="text"
              placeholder="Select Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="flex-1 text-white hover:bg-[#C72030]/90"
          >
            Apply
          </Button>
          <Button
            onClick={handleReset}
            style={{ backgroundColor: '#C72030' }}
            className="flex-1 text-white hover:bg-[#C72030]/90"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
