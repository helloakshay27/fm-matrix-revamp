import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextField, Dialog, DialogContent } from '@mui/material';
import { DialogHeader } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface PlantDetail {
  id: string;
  plant_name: string;
  site_name: string;
  valuation_area: string;
  plant_category: string;
  company_name: string;
  company_code: string;
  sale_org_code: string;
  created_at?: string;
  updated_at?: string;
}

interface EditPlantDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlantDetail) => void;
  plantDetail: PlantDetail | null;
}

export const EditPlantDetailDialog: React.FC<EditPlantDetailDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  plantDetail,
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<PlantDetail>({
    id: '',
    plant_name: '',
    site_name: '',
    valuation_area: '',
    plant_category: '',
    company_name: '',
    company_code: '',
    sale_org_code: '',
  });

  useEffect(() => {
    if (plantDetail) {
      setFormData(plantDetail);
    }
  }, [plantDetail]);

  const handleInputChange = (field: keyof PlantDetail, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.plant_name ||
      !formData.site_name ||
      !formData.company_name ||
      !formData.company_code ||
      !formData.sale_org_code
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 mb-4">
          <h1 className="text-lg font-semibold">Edit Plant Detail</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Plant Name*"
              value={formData.plant_name}
              onChange={(e) => handleInputChange('plant_name', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Site Name*"
              value={formData.site_name}
              onChange={(e) => handleInputChange('site_name', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Plant Category"
              value={formData.plant_category}
              onChange={(e) => handleInputChange('plant_category', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Valuation Area"
              value={formData.valuation_area}
              onChange={(e) => handleInputChange('valuation_area', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Company Name*"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Company Code*"
              value={formData.company_code}
              onChange={(e) => handleInputChange('company_code', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Sale Org Code*"
              value={formData.sale_org_code}
              onChange={(e) => handleInputChange('sale_org_code', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Update Plant Detail
          </Button>
          <Button
            onClick={handleClose}
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
