
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { API_CONFIG } from '@/config/apiConfig';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface PermitFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filteredPermits: any[], paginationInfo?: any, filterString?: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  onReset?: () => void;
}

interface FilterData {
  permitId: string;
  permitType: string;
  vendorName: string;
}

export const PermitFilterModal: React.FC<PermitFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onLoadingChange,
  onReset
}) => {
  const [filterData, setFilterData] = useState<FilterData>({
    permitId: '',
    permitType: '',
    vendorName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // API function to fetch filtered permits
  const fetchFilteredPermits = async (filters: FilterData) => {
    const queryParams = new URLSearchParams();

    // Add non-empty filters as query parameters
    if (filters.permitId.trim()) {
      queryParams.append('q[id_eq]', filters.permitId.trim());
    }
    if (filters.permitType.trim()) {
      queryParams.append('q[permit_type_name_cont]', filters.permitType.trim());
    }
    if (filters.vendorName.trim()) {
      queryParams.append('q[vender_company_name_cont]', filters.vendorName.trim());
    }

    const queryString = queryParams.toString();
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMITS}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch filtered permits');
    }

    const data = await response.json();
    return { data, queryString };
  };

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = async () => {
    try {
      setIsLoading(true);
      onLoadingChange?.(true);

      const { data: response, queryString } = await fetchFilteredPermits(filterData);
      onApply(response.permits || [], response.pagination, queryString);
      onClose();
    } catch (error) {
      console.error('Error fetching filtered permits:', error);
      // You might want to show an error message to the user here
      // For now, we'll just pass an empty array
      onApply([]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleReset = () => {
    setFilterData({
      permitId: '',
      permitType: '',
      vendorName: ''
    });
    onReset?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Permit Id"
              name="q[reference_number_eq]"
              value={filterData.permitId}
              onChange={(e) => handleInputChange('permitId', e.target.value)}
              placeholder="Search By Permit Id"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Permit Type"
              name="q[permit_type_name_cont]"
              value={filterData.permitType}
              onChange={(e) => handleInputChange('permitType', e.target.value)}
              placeholder="Search By Permit Type"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <TextField
            label="Vendor Name"
            name="q[vender_company_name_cont]"
            value={filterData.vendorName}
            onChange={(e) => handleInputChange('vendorName', e.target.value)}
            placeholder="Search By Vender Name"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleApply}
              disabled={isLoading}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8"
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
