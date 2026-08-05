
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/apiClient';

interface AddAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAreaAdded: () => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

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
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="max-w-2xl bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
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
            <FormControl fullWidth variant="outlined">
              <InputLabel id="add-area-building-label">Select Building</InputLabel>
              <MuiSelect
                labelId="add-area-building-label"
                label="Select Building"
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select Building</em></MenuItem>
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="add-area-wing-label">Select Wing</InputLabel>
              <MuiSelect
                labelId="add-area-wing-label"
                label="Select Wing"
                value={selectedWing}
                onChange={(e) => setSelectedWing(e.target.value)}
                disabled={!selectedBuilding}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select Wing</em></MenuItem>
                {wings.map((wing) => (
                  <MenuItem key={wing.id} value={wing.id.toString()}>
                    {wing.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div>
            <TextField
              label="Area Name"
              variant="outlined"
              fullWidth
              placeholder="Enter Area Name"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              sx={fieldStyles}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-brand"
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
