
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';

interface AddAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAreaAdded: () => void;
}

export const AddAreaDialog = ({ open, onOpenChange, onAreaAdded }: AddAreaDialogProps) => {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [areaName, setAreaName] = useState('');
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchBuildings();
    }
  }, [open]);

  useEffect(() => {
    if (selectedBuilding) {
      fetchWings();
    } else {
      setWings([]);
      setSelectedWing('');
    }
  }, [selectedBuilding]);

  const fetchBuildings = async () => {
    try {
      const response = await apiClient.get('/buildings.json?order=name');
      setBuildings(response.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to fetch buildings');
    }
  };

  const fetchWings = async () => {
    try {
      const response = await apiClient.get(`/pms/wings.json?building_id=${selectedBuilding}`);
      setWings(response.data.wings || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      toast.error('Failed to fetch wings');
    }
  };

  const handleSubmit = async () => {
    if (!selectedBuilding) {
      toast.error('Please select a building');
      return;
    }
    if (!selectedWing) {
      toast.error('Please select a wing');
      return;
    }
    if (!areaName.trim()) {
      toast.error('Please enter area name');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/pms/areas.json', {
        pms_area: {
          name: areaName,
          building_id: selectedBuilding,
          wing_id: selectedWing,
          active: true,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Area added successfully');
        handleClose();
        onAreaAdded();
      } else {
        toast.error('Failed to add area');
      }
    } catch (error) {
      console.error('Error adding area:', error);
      toast.error('Failed to add area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedBuilding('');
    setSelectedWing('');
    setAreaName('');
    onOpenChange(false);
  };

  const handleSampleFormat = () => {
    const sampleData = [
      ['Area Name', 'Building ID', 'Wing ID', 'Status'],
      ['Reception Area', '1', '1', 'active'],
      ['Conference Room', '1', '2', 'active'],
      ['Lobby', '2', '3', 'active'],
    ];

    const csvContent = sampleData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'areas_sample_format.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Sample format downloaded');
  };

  const handleImport = () => {
    // This would trigger the existing import functionality
    toast.info('Import functionality - please use the Import button in the main interface');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-0">
          <DialogTitle>Add Area</DialogTitle>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          <div>
            <Label htmlFor="building" className="text-sm font-medium mb-2 block">
              Select Building
            </Label>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="wing" className="text-sm font-medium mb-2 block">
              Select Wing
            </Label>
            <Select value={selectedWing} onValueChange={setSelectedWing} disabled={!selectedBuilding}>
              <SelectTrigger className="focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {wings.map((wing) => (
                  <SelectItem key={wing.id} value={wing.id.toString()}>
                    {wing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="areaName" className="text-sm font-medium mb-2 block">
              Area Name
            </Label>
            <Input
              id="areaName"
              placeholder="Enter Area Name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="focus:ring-[#C72030] focus:border-[#C72030]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#C72030] hover:bg-[#B01E2E] text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
