
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface KRCCFormFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const KRCCFormFilterDialog = ({ isOpen, onClose, onApplyFilters }: KRCCFormFilterDialogProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [email, setEmail] = useState('');
  const [circle, setCircle] = useState('');

  const handleSubmit = () => {
    const filters = {
      startDate,
      endDate,
      email,
      circle
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setEmail('');
    setCircle('');
  };

  const handleExport = () => {
    // Export functionality with current filters
    const filters = {
      startDate,
      endDate,
      email,
      circle
    };
    // Here you would typically call an export API
    console.log('Exporting with filters:', filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Circle</label>
            <select
              value={circle}
              onChange={(e) => setCircle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="">-- Select Circle --</option>
              <option value="north">North Circle</option>
              <option value="south">South Circle</option>
              <option value="east">East Circle</option>
              <option value="west">West Circle</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit}
              className="flex-1 text-white"
              style={{ backgroundColor: '#C72030' }}
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              className="flex-1 text-white"
              style={{ backgroundColor: '#C72030' }}
            >
              Export
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
