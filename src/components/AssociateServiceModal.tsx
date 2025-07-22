import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Button } from "@/components/ui/button";
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 0' }}>
        <DialogTitle style={{ padding: 0, fontSize: '1.25rem', fontWeight: 600, color: '#C72030' }}>
          Associate Services To Asset
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <X style={{ width: '16px', height: '16px' }} />
        </IconButton>
      </div>
      
      <DialogContent style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
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

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            onClick={handleAssociate}
            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
          >
            Associate Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};