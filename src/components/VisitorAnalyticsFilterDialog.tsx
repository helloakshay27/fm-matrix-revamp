import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VisitorAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (dateRange: { startDate: string; endDate: string }) => void;
}

export const VisitorAnalyticsFilterDialog: React.FC<VisitorAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter
}) => {
  // Set default dates: one year ago to current date
  const getDefaultDates = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      start: oneYearAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [quickFilter, setQuickFilter] = useState('');

  const handleQuickFilter = (value: string) => {
    setQuickFilter(value);
    const today = new Date();
    let start = new Date();
    
    switch (value) {
      case 'today':
        start = new Date();
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case 'last30days':
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        return;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onApplyFilter({
        startDate: new Date(startDate).toLocaleDateString('en-GB'),
        endDate: new Date(endDate).toLocaleDateString('en-GB')
      });
      onClose();
    }
  };

  const handleReset = () => {
    const resetDates = getDefaultDates();
    setStartDate(resetDates.start);
    setEndDate(resetDates.end);
    setQuickFilter('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#C72030]">
            Filter Visitor Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Apply Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};