
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Dialog, DialogContent } from '@mui/material';
import { DialogHeader } from './ui/dialog';
import { useAppDispatch } from '@/store/hooks';
import { getPlantDetails } from '@/store/slices/materialPRSlice';
import { toast } from 'sonner';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface WBSElement {
  plant_code: string;
  category: string;
  category_wbs_code: string;
  wbs_name: string;
  wbs_code: string;
}

interface AddWBSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<WBSElement, 'id'>) => void;
}

export const AddWBSDialog: React.FC<AddWBSDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [plantDetails, setPlantDetails] = useState([])

  const [formData, setFormData] = useState({
    plantCode: '',
    category: '',
    categoryWBSCode: '',
    wbsName: '',
    wbsCode: ''
  });

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await dispatch(getPlantDetails({ baseUrl, token })).unwrap();
        setPlantDetails(response);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    fetchPlantDetails();
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Adding WBS:', formData);
    onSubmit({
      plant_code: formData.plantCode,
      category: formData.category,
      category_wbs_code: formData.categoryWBSCode,
      wbs_name: formData.wbsName,
      wbs_code: formData.wbsCode,
    });
    onOpenChange(false);
    setFormData({
      plantCode: '',
      category: '',
      categoryWBSCode: '',
      wbsName: '',
      wbsCode: ''
    });
  };

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 mb-3">
          <h1 className="text-lg font-semibold">ADD WBS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Plant Code*</InputLabel>
              <MuiSelect
                label="Plant Code*"
                name="plantCode"
                value={formData.plantCode}
                onChange={(e) => handleSelectChange('plantCode', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Plant Code</em>
                </MenuItem>
                {plantDetails.map((plantDetail) => (
                  <MenuItem key={plantDetail.id} value={plantDetail.plant_name}>
                    {plantDetail.plant_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Category*"
              type="category"
              name="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Category WBS Code*"
              type="categoryWBSCode"
              name="categoryWBSCode"
              value={formData.categoryWBSCode}
              onChange={(e) => handleInputChange('categoryWBSCode', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="WBS Name*"
              type="wbsName"
              name="wbsName"
              value={formData.wbsName}
              onChange={(e) => handleInputChange('wbsName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="WBS Code*"
              type="wbsCode"
              name="wbsCode"
              value={formData.wbsCode}
              onChange={(e) => handleInputChange('wbsCode', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Add WBS
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
