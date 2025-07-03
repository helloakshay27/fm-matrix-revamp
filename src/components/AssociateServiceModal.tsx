import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface AssociateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssociateServiceModal = ({ isOpen, onClose }: AssociateServiceModalProps) => {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState('');

  const handleAssociate = () => {
    if (!selectedAsset) {
      toast({
        title: "Error",
        description: "Please select an asset first",
        variant: "destructive",
      });
      return;
    }
    console.log('Associating service with asset:', selectedAsset);
    toast({
      title: "Success",
      description: "Service associated successfully!",
    });
    onClose();
  };

  // Responsive styles for Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
    '& .MuiInputBase-root': {
      '& .MuiSelect-select': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Smaller for dropdowns
      },
      '& .MuiMenuItem-root': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Smaller for dropdown menu items
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-[#C72030]">
              Associate Services To Asset
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="asset-select-label" shrink>Asset</InputLabel>
              <MuiSelect
                labelId="asset-select-label"
                label="Asset"
                displayEmpty
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Asset</em></MenuItem>
                <MenuItem value="asset1">Asset 1 - Electrical Panel</MenuItem>
                <MenuItem value="asset2">Asset 2 - HVAC System</MenuItem>
                <MenuItem value="asset3">Asset 3 - Fire Safety System</MenuItem>
                <MenuItem value="asset4">Asset 4 - Water Pump</MenuItem>
                <MenuItem value="asset5">Asset 5 - Generator</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAssociate}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Associate Service
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};