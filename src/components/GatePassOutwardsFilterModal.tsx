import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { FormControl, InputLabel, Select as MuiSelect, TextField, MenuItem } from '@mui/material';
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { toast } from 'sonner';

interface GatePassOutwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const GatePassOutwardsFilterModal = ({ isOpen, onClose, filters, setFilters }: GatePassOutwardsFilterModalProps) => {
  const defaultFilters = {
    gateNumber: '',
    createdBy: '',
    supplierName: '',
    expectedReturnDate: '',
    goodsType: '',
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
      height: { xs: '36px', md: '45px' },
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666666',
      fontSize: '14px',
      '&.Mui-focused': {
        color: '#C72030',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#FFFFFF',
        padding: '0 4px',
      },
    },
    '& .MuiOutlinedInput-input, & .MuiSelect-select': {
      color: '#1A1A1A',
      fontSize: '14px',
      padding: { xs: '8px 14px', md: '12px 14px' },
      height: 'auto',
      '&::placeholder': {
        color: '#999999',
        opacity: 1,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white [&>button]:hidden max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 ">
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 rounded-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div>
          {/* Goods Type */}
          <div className="py-4">
          <FormControl variant="outlined" sx={fieldStyles} className="mb-4">
            <InputLabel id="goodsType-label" shrink>Goods Type</InputLabel>
            <MuiSelect
              native
              labelId="goodsType-label"
              label="Goods Type"
              displayEmpty
              value={localFilters.goodsType}
              onChange={e => handleChange('goodsType', e.target.value)}
            >
              <option value="">Select Goods Type</option>
              <option value="true">Returnable</option>
              <option value="false">Non Returnable</option>
            </MuiSelect>
          </FormControl>
          </div>
          {/* Gate Pass Type */}
          <div className="py-4">
          <FormControl variant="outlined" sx={fieldStyles} className="mb-4">
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
          <div className="py-4">
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

          {/* Gate Pass Date */}
          <div className="py-4">
          <TextField
            label="Gate Pass Date"
            type="date"
            fullWidth
            variant="outlined"
            value={localFilters.gatePassDate}
            onChange={e => handleChange('gatePassDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Gate Pass No. */}
          <div className="py-4">
          <TextField
            label="Gate Pass No."
            fullWidth
            variant="outlined"
            value={localFilters.gatePassNo}
            onChange={e => handleChange('gatePassNo', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Vehicle Number */}
          <div className="py-4">
          <TextField
            label="Vehicle Number"
            fullWidth
            variant="outlined"
            value={localFilters.vehicleNo}
            onChange={e => handleChange('vehicleNo', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Visitor Name */}
          <div className="py-4">
          <TextField
            label="Visitor Name"
            fullWidth
            variant="outlined"
            value={localFilters.visitorName}
            onChange={e => handleChange('visitorName', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Visitor Contact */}
          <div className="py-4">
          <TextField
            label="Visitor Contact"
            fullWidth
            variant="outlined"
            value={localFilters.visitorContact}
            onChange={e => handleChange('visitorContact', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Vendor Company */}
          <div className="py-4">
          <TextField
            label="Vendor Company"
            fullWidth
            variant="outlined"
            value={localFilters.vendorCompany}
            onChange={e => handleChange('vendorCompany', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
          />
          </div>
          {/* Gate Number Input */}
          <div className="py-4">
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
            className="mb-4"
          />
          </div>
          {/* Created By */}
          <div className="py-4">
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
            className="mb-4"
          />
          </div>
          {/* Supplier Name (Vendor Dropdown) */}
          <div className="py-4">
          <FormControl variant="outlined" sx={fieldStyles} className="mb-4">
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
          {/* Expected Return Date */}
          <div className="py-4">
          <TextField
            label="Expected Return Date"
            type="date"
            value={localFilters.expectedReturnDate}
            onChange={e => handleChange('expectedReturnDate', e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
            className="mb-4"
            inputProps={{
              min: '',
              max: '',
            }}
          />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-none"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
