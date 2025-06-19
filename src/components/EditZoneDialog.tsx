
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface EditZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditZoneDialog = ({ open, onOpenChange }: EditZoneDialogProps) => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const zones = ['Maharashtra', 'South Zone', 'East Zone', 'West Zone'];

  const handleZoneSelect = (zone: string, checked: boolean) => {
    if (checked) {
      setSelectedZones([...selectedZones, zone]);
    } else {
      setSelectedZones(selectedZones.filter(z => z !== zone));
    }
  };

  const handleSubmit = () => {
    if (selectedZones.length === 0) {
      toast.error('Please select at least one zone to edit');
      return;
    }
    
    toast.success(`${selectedZones.length} zone(s) selected for editing`);
    setSelectedZones([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Zone to Edit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone} className="flex items-center space-x-2">
              <Checkbox
                id={zone}
                checked={selectedZones.includes(zone)}
                onCheckedChange={(checked) => handleZoneSelect(zone, checked as boolean)}
              />
              <label htmlFor={zone} className="text-sm text-gray-700">
                {zone}
              </label>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit Selected Zone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
