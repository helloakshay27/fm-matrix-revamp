import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Switch } from '@/components/ui/switch';
import { MapPin, Building, Globe, Flag, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface AddRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companiesDropdown: Array<{ id: number; name: string }>;
  countriesDropdown: Array<{ id: number; name: string }>;
  canEdit: boolean;
}

interface RegionFormData {
  name: string;
  code: string;
  description: string;
  country_id: string;
  company_id: string;
  active: boolean;
}

const fieldStyles = {
  height: '45px',
  '& .MuiInputBase-root': {
    height: '45px',
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
  },
};

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

export const AddRegionModal: React.FC<AddRegionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  companiesDropdown,
  countriesDropdown,
  canEdit
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<RegionFormData>({
    name: '',
    code: '',
    description: '',
    country_id: '',
    company_id: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Region name is required';
    }

   
    if (!formData.company_id) {
      newErrors.company_id = 'Company is required';
    }

    if (!formData.country_id) {
      newErrors.country_id = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to create regions');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        pms_region: {
          name: formData.name,
          company_id: parseInt(formData.company_id),
          headquarter_id: parseInt(formData.country_id) // Using country_id as headquarter_id based on API requirement
        }
      };

      const response = await fetch(getFullUrl('/pms/regions.json'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create region');
      }

      toast.success('Region created successfully!', {
        duration: 3000,
      });

      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error('Error creating region:', error);
      toast.error(`Failed to create region: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      country_id: '',
      company_id: '',
      active: true
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="add-region-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">ADD NEW REGION</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="add-region-dialog-description" className="sr-only">
            Add region details including name, code, description, company, and country
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Region Name"
                placeholder="Enter region name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                required
                disabled={isSubmitting}
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                label="Region Code"
                placeholder="Enter region code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-6">
              <FormControl fullWidth variant="outlined" error={!!errors.company_id}>
                <InputLabel shrink>Company</InputLabel>
                <MuiSelect
                  value={formData.company_id}
                  onChange={(e) => handleChange('company_id', e.target.value)}
                  label="Company"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Select Company</em>
                  </MenuItem>
                  {companiesDropdown.map((company) => (
                    <MenuItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.company_id && (
                  <div className="text-red-500 text-xs mt-1">{errors.company_id}</div>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" error={!!errors.country_id}>
                <InputLabel shrink>Country</InputLabel>
                <MuiSelect
                  value={formData.country_id}
                  onChange={(e) => handleChange('country_id', e.target.value)}
                  label="Country"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Select Country</em>
                  </MenuItem>
                  {countriesDropdown.map((country) => (
                    <MenuItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.country_id && (
                  <div className="text-red-500 text-xs mt-1">{errors.country_id}</div>
                )}
              </FormControl>
            </div>

            <div className="mt-6">
              <TextField
                label="Description"
                placeholder="Enter region description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                multiline
                rows={3}
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: '80px',
                  },
                }}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-3 mt-6">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                  disabled={isSubmitting}
                />
                <span className={`text-sm font-medium ${formData.active ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !canEdit}
            className="px-6 py-2 bg-[#C72030] text-white hover:bg-[#A61B29] disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Region'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
