import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  countriesDropdown: any[];
  companiesDropdown: any[];
  canEdit: boolean;
}

export const AddCountryModal: React.FC<AddCountryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  countriesDropdown,
  companiesDropdown,
  canEdit
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_setup_id: '',
    country_id: '',
    logo: null as File | null
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to create countries');
      return;
    }

    if (!formData.company_setup_id || !formData.country_id) {
      toast.error('Please select both company and country');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getFullUrl('/headquarters.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_headquarter: {
            company_setup_id: parseInt(formData.company_setup_id),
            country_id: parseInt(formData.country_id)
          }
        }),
      });

      if (response.ok) {
        toast.success('Country created successfully');
        resetForm();
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Failed to create country:', errorData);
        toast.error('Failed to create country');
      }
    } catch (error) {
      console.error('Error creating country:', error);
      toast.error('Error creating country');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company_setup_id: '',
      country_id: '',
      logo: null
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="add-country-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">ADD NEW COUNTRY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="add-country-dialog-description" className="sr-only">
            Add a new country by selecting company and country
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Company *</InputLabel>
              <MuiSelect
                value={formData.company_setup_id}
                onChange={(e) => handleInputChange('company_setup_id', e.target.value)}
                label="Company *"
                displayEmpty
                MenuProps={{
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
                }}
                sx={{
                  height: { xs: 28, sm: 36, md: 45 },
                  '& .MuiInputBase-input, & .MuiSelect-select': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                }}
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
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Country *</InputLabel>
              <MuiSelect
                value={formData.country_id}
                onChange={(e) => handleInputChange('country_id', e.target.value)}
                label="Country *"
                displayEmpty
                MenuProps={{
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
                }}
                sx={{
                  height: { xs: 28, sm: 36, md: 45 },
                  '& .MuiInputBase-input, & .MuiSelect-select': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                }}
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
            </FormControl>
          </div>

          <div>
            <span className="text-sm font-medium mb-2 block">Logo</span>
            <input
              type="file"
              onChange={handleLogoChange}
              accept="image/*"
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.logo && (
              <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {formData.logo.name}
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canEdit}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6 py-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Country'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
