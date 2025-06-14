
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMeterTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMeterTypeModal = ({ open, onOpenChange }: AddMeterTypeModalProps) => {
  const [meterType, setMeterType] = useState('');
  const [meterCategory, setMeterCategory] = useState('');
  const [unitName, setUnitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Meter Type:', meterType);
    console.log('Meter Category:', meterCategory);
    console.log('Unit Name:', unitName);
    onOpenChange(false);
  };

  const handleReset = () => {
    setMeterType('');
    setMeterCategory('');
    setUnitName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Meter Type</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meterType">Meter Type</Label>
            <Select value={meterType} onValueChange={setMeterType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meterCategory">
              Meter Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="meterCategory"
              value={meterCategory}
              onChange={(e) => setMeterCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitName">
              Unit Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unitName"
              placeholder="Enter Unit Name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-purple-700 hover:bg-purple-800 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
