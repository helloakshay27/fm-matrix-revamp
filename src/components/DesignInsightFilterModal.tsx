
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface DesignInsightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignInsightFilterModal: React.FC<DesignInsightFilterModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('');
  const [zone, setZone] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mustHave, setMustHave] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { dateRange, zone, category, subCategory, mustHave, createdBy });
    toast({
      title: "Success",
      description: "Filter applied successfully!",
    });
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <TextField
            placeholder="Select Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="zone-label" shrink>Zone</InputLabel>
            <MuiSelect
              labelId="zone-label"
              label="Zone"
              displayEmpty
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Zone</em></MenuItem>
              <MenuItem value="mumbai">Mumbai</MenuItem>
              <MenuItem value="ncr">NCR</MenuItem>
              <MenuItem value="bangalore">Bangalore</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="category-label" shrink>Category</InputLabel>
            <MuiSelect
              labelId="category-label"
              label="Category"
              displayEmpty
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              <MenuItem value="landscape">Landscape</MenuItem>
              <MenuItem value="facade">Façade</MenuItem>
              <MenuItem value="security">Security & surveillance</MenuItem>
              <MenuItem value="inside-units">Inside Units</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="sub-category-label" shrink>Sub-category</InputLabel>
            <MuiSelect
              labelId="sub-category-label"
              label="Sub-category"
              displayEmpty
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Sub Category</em></MenuItem>
              <MenuItem value="access-control">Access Control</MenuItem>
              <MenuItem value="cctv">CCTV</MenuItem>
              <MenuItem value="bedroom">Bedroom</MenuItem>
              <MenuItem value="entry-exit">Entry-Exit</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="must-have-label" shrink>Must have</InputLabel>
            <MuiSelect
              labelId="must-have-label"
              label="Must have"
              displayEmpty
              value={mustHave}
              onChange={(e) => setMustHave(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="created-by-label" shrink>Created by</InputLabel>
            <MuiSelect
              labelId="created-by-label"
              label="Created by"
              displayEmpty
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              <MenuItem value="sony-bhosle">Sony Bhosle</MenuItem>
              <MenuItem value="robert-day">Robert Day2</MenuItem>
              <MenuItem value="sanket-patil">Sanket Patil</MenuItem>
              <MenuItem value="devesh-jain">Devesh Jain</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
