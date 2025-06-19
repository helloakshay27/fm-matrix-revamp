
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AddRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddRegionDialog = ({ open, onOpenChange }: AddRegionDialogProps) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [regionName, setRegionName] = useState('');

  const handleSubmit = () => {
    if (!selectedCountry) {
      toast.error('Please select a country');
      return;
    }
    if (!regionName.trim()) {
      toast.error('Please enter a region name');
      return;
    }
    
    toast.success('Region added successfully');
    setSelectedCountry('');
    setRegionName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ADD REGION</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="france">France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Region
            </label>
            <Input
              placeholder="Enter Region Name"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
            />
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
