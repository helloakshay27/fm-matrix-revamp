import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  countriesDropdown: any[];
  companiesDropdown: any[];
  organizationsDropdown: any[];
  canEdit: boolean;
}

const fieldStyles = {
  height: '45px',
  '& .MuiInputBase-root': { height: '45px' },
  '& .MuiInputBase-input': { padding: '12px 14px' },
  '& .MuiSelect-select': { padding: '12px 14px' },
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

export const AddCountryModal: React.FC<AddCountryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  countriesDropdown,
  companiesDropdown,
  organizationsDropdown,
  canEdit
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization_id: '',
    company_setup_id: '',
    country_id: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to create headquarters');
      return;
    }

    if (!formData.company_setup_id || !formData.country_id) {
      toast.error('Please fill in all required fields (Company and Country)', { duration: 5000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody: any = {
        pms_headquarter: {
          name: formData.name,
          company_setup_id: parseInt(formData.company_setup_id),
          country_id: parseInt(formData.country_id),
        }
      };

      if (formData.organization_id) {
        requestBody.pms_headquarter.organization_id = parseInt(formData.organization_id);
      }

      const response = await fetch(getFullUrl('/headquarters.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success('Headquarter created successfully');
        resetForm();
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Failed to create headquarter:', errorData);
        toast.error('Failed to create headquarter');
      }
    } catch (error) {
      console.error('Error creating headquarter:', error);
      toast.error('Error creating headquarter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', organization_id: '', company_setup_id: '', country_id: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">ADD NEW HEADQUARTER</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new headquarter by selecting organization, company and country.
        </DialogDescription>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Organization</InputLabel>
              <MuiSelect
                value={formData.organization_id}
                onChange={(e) => handleInputChange('organization_id', e.target.value)}
                label="Organization"
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
                disabled={isSubmitting}
              >
                <MenuItem value=""><em>Select Organization</em></MenuItem>
                {organizationsDropdown.map((org) => (
                  <MenuItem key={org.id} value={org.id.toString()}>{org.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" required>
              <InputLabel shrink sx={{ '& .MuiFormLabel-asterisk': { color: '#C72030' } }}>Company</InputLabel>
              <MuiSelect
                value={formData.company_setup_id}
                onChange={(e) => handleInputChange('company_setup_id', e.target.value)}
                label="Company"
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
                disabled={isSubmitting}
              >
                <MenuItem value=""><em>Select Company</em></MenuItem>
                {companiesDropdown.map((company) => (
                  <MenuItem key={company.id} value={company.id.toString()}>{company.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormControl fullWidth variant="outlined" required>
              <InputLabel shrink sx={{ '& .MuiFormLabel-asterisk': { color: '#C72030' } }}>Country Name</InputLabel>
              <MuiSelect
                value={formData.country_id}
                onChange={(e) => handleInputChange('country_id', e.target.value)}
                label="Country Name"
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
                disabled={isSubmitting}
              >
                <MenuItem value=""><em>Select Country</em></MenuItem>
                {countriesDropdown.map((country) => (
                  <MenuItem key={country.id} value={country.id.toString()}>{country.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
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
            {isSubmitting ? 'Creating...' : 'Create Headquarter'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
