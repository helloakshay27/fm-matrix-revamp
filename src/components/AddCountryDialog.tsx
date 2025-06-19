
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddCountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCountryDialog = ({ open, onOpenChange }: AddCountryDialogProps) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleSubmit = () => {
    if (selectedCountries.length === 0) {
      toast.error('Please select at least one country');
      return;
    }
    
    toast.success(`${selectedCountries.length} country(ies) added successfully`);
    setSelectedCountries([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ADD ZONE</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="afghanistan">Afghanistan</SelectItem>
                <SelectItem value="albania">Albania</SelectItem>
                <SelectItem value="algeria">Algeria</SelectItem>
                <SelectItem value="andorra">Andorra</SelectItem>
                <SelectItem value="angola">Angola</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
