import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { FormControl, InputLabel, Select as MuiSelect, TextField } from '@mui/material';
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { toast } from 'sonner';

interface GatePassInwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const GatePassInwardsFilterModal = ({ isOpen, onClose, filters, setFilters }: GatePassInwardsFilterModalProps) => {
  // Provide default filters if undefined
  const defaultFilters = {
    gateNumber: '',
    createdBy: '',
    supplierName: '',
    gatePassTypeId: '',
    buildingId: '',
    gatePassDate: '',
    gatePassNo: '',
    vehicleNo: '',
    visitorName: '',
    visitorContact: '',
    vendorCompany: '',
    flagged: undefined,
  };
  const safeFilters = filters || defaultFilters;

  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [gatePassTypes, setGatePassTypes] = useState<{ id: number; name: string }[]>([]);
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [localFilters, setLocalFilters] = useState(safeFilters);

  // Get site id from header (redux or localStorage)
  const siteId = Number(localStorage.getItem('selectedSiteId'));

  useEffect(() => {
    if (isOpen) setLocalFilters(safeFilters);
  }, [isOpen]);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setVendors(data || []))
      .catch(() => setVendors([]));
    gatePassTypeService.getGatePassTypes().then(setGatePassTypes).catch(() => setGatePassTypes([]));
    if (siteId) {
      fetch(`${API_CONFIG.BASE_URL}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => setBuildings(data.buildings || []))
        .catch(() => setBuildings([]));
    }
  }, [siteId]);

  const handleChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const fieldStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: '40px',
      borderRadius: '0px',
      backgroundColor: '#FFFFFF',
      fontSize: '14px',
      '& fieldset': {
        borderColor: '#D1D5DB',
      },
      '&:hover fieldset': {
        borderColor: '#9CA3AF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#6B7280',
      fontSize: '14px',
      fontWeight: '500',
      '&.Mui-focused': {
        color: '#3B82F6',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#FFFFFF',
        padding: '0 4px',
      },
    },
    '& .MuiOutlinedInput-input, & .MuiSelect-select': {
      color: '#374151',
      fontSize: '14px',
      padding: '10px 14px',
      height: 'auto',
      '&::placeholder': {
        color: '#9CA3AF',
        opacity: 1,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white [&>button]:hidden max-h-[80vh] overflow-y-auto p-0 border-l-4 border-l-[#C72030]">
        <div className="p-6">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-medium text-gray-600 uppercase tracking-wider">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 rounded-none hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-10">
                    {/* Gate Pass Type */}
          <div className="mb-4">
          <FormControl variant="outlined" sx={fieldStyles}>
            <InputLabel id="gatePassType-label" shrink>Gate Pass Type</InputLabel>
            <MuiSelect
              native
              labelId="gatePassType-label"
              label="Gate Pass Type"
              displayEmpty
              value={localFilters.gatePassTypeId}
              onChange={e => handleChange('gatePassTypeId', e.target.value)}
            >
              <option value="">Select Gate Pass Type</option>
              {gatePassTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </MuiSelect>
          </FormControl>
          </div>
          {/* Building */}
          <div className="mb-4">
          <FormControl variant="outlined" sx={fieldStyles}>
            <InputLabel id="building-label" shrink>Building</InputLabel>
            <MuiSelect
              native
              labelId="building-label"
              label="Building"
              displayEmpty
              value={localFilters.buildingId}
              onChange={e => handleChange('buildingId', e.target.value)}
            >
              <option value="">Select Building</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </MuiSelect>
          </FormControl>
          </div>
          {/* Gate Pass Date */}
          <div className="mb-4">
          <TextField
            label="Gate Pass Date"
            type="date"
            fullWidth
            variant="outlined"
            value={localFilters.gatePassDate}
            onChange={e => handleChange('gatePassDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Gate Pass No. */}
          <div className="mb-4">
          <TextField
            label="Gate Pass No."
            fullWidth
            variant="outlined"
            value={localFilters.gatePassNo}
            onChange={e => handleChange('gatePassNo', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Vehicle Number */}
          <div className="mb-4">
          <TextField
            label="Vehicle Number"
            fullWidth
            variant="outlined"
            value={localFilters.vehicleNo}
            onChange={e => handleChange('vehicleNo', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Visitor Name */}
          <div className="mb-4">
          <TextField
            label="Visitor Name"
            fullWidth
            variant="outlined"
            value={localFilters.visitorName}
            onChange={e => handleChange('visitorName', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Visitor Contact */}
          <div className="mb-4">
          <TextField
            label="Visitor Contact"
            fullWidth
            variant="outlined"
            value={localFilters.visitorContact}
            onChange={e => handleChange('visitorContact', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Vendor Company */}
          <div className="mb-4">
          <TextField
            label="Vendor Company"
            fullWidth
            variant="outlined"
            value={localFilters.vendorCompany}
            onChange={e => handleChange('vendorCompany', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          </div>
          {/* Gate Number Input */}
          <div className="mb-4">
          <TextField
            label="Gate Number"
            placeholder="Enter Gate Number"
            value={localFilters.gateNumber}
            onChange={e => handleChange('gateNumber', e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={fieldStyles}
          />
          </div>
          {/* Created By */}
          <div className="mb-4">
          <TextField
            label="Created By"
            placeholder="Enter Created Person"
            value={localFilters.createdBy}
            onChange={e => handleChange('createdBy', e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={fieldStyles}
          />
          </div>
          {/* Supplier Name (Vendor Dropdown) */}
          <div className="mb-4">
          <FormControl variant="outlined" sx={fieldStyles}>
            <InputLabel id="supplierName-label" shrink>Vendor</InputLabel>
            <MuiSelect
              native
              labelId="supplierName-label"
              label="Vendor"
              displayEmpty
              value={localFilters.supplierName}
              onChange={e => handleChange('supplierName', e.target.value)}
            >
              <option value="">Select vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
              ))}
            </MuiSelect>
          </FormControl>
          </div>
          {/* Building */}
          
          <FormControl variant="outlined" sx={fieldStyles} className="mb-4">
            <InputLabel id="building-label" shrink>Building</InputLabel>
            <MuiSelect
              native
              labelId="building-label"
              label="Building"
              displayEmpty
              value={localFilters.buildingId}
              onChange={e => handleChange('buildingId', e.target.value)}
            >
              <option value="">Select Building</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </MuiSelect>
          </FormControl>
          </div>
          {/* Action Buttons - span full width */}
          <div className="col-span-2 flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 h-10 rounded-md"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-10 rounded-md"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};