import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface EditRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  regionId: number;
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
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
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

export const EditRegionModal: React.FC<EditRegionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  regionId,
  companiesDropdown,
  countriesDropdown,
  canEdit
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<RegionFormData>({
    name: '',
    code: '',
    description: '',
    country_id: '',
    company_id: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && regionId) {
      fetchRegionDetails();
    }
  }, [isOpen, regionId]);

  const fetchRegionDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getFullUrl(`/pms/regions/${regionId}.json`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const region = result.data || result.region || result;

      setFormData({
        name: region.name || '',
        code: region.code || '',
        description: region.description || '',
        country_id: region.country_id?.toString() || '',
        company_id: region.company_id?.toString() || '',
        active: region.active !== undefined ? region.active : true
      });
    } catch (error: any) {
      console.error('Error fetching region details:', error);
      toast.error(`Failed to load region details: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      toast.error('You do not have permission to update regions');
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

      const response = await fetch(getFullUrl(`/pms/regions/${regionId}.json`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update region');
      }

      toast.success('Region updated successfully!', {
        duration: 3000,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error updating region:', error);
      toast.error(`Failed to update region: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      country_id: '',
      company_id: '',
      active: true
    });
    setErrors({});
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading region details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">EDIT REGION</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Region Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
                sx={fieldStyles}
              />

             

              <FormControl fullWidth error={!!errors.company_id} required>
                <InputLabel>Company</InputLabel>
                <MuiSelect
                  value={formData.company_id}
                  onChange={(e) => handleChange('company_id', e.target.value)}
                  label="Company"
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  {companiesDropdown.map((company) => (
                    <MenuItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth error={!!errors.country_id} required>
                <InputLabel>Country</InputLabel>
                <MuiSelect
                  value={formData.country_id}
                  onChange={(e) => handleChange('country_id', e.target.value)}
                  label="Country"
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  {countriesDropdown.map((country) => (
                    <MenuItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={fieldStyles}
                className="md:col-span-2"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Status:</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                />
                <span className={`text-sm ${formData.active ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !canEdit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? 'Updating...' : 'Update Region'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
