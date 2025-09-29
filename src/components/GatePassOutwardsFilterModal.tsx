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
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white [&>button]:hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Gate Pass Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Gate Pass Details</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Goods Type */}
              <FormControl variant="outlined" sx={fieldStyles}>
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
              
              {/* Gate Pass Type */}
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
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Gate Pass Date */}
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
              
              {/* Gate Pass No. */}
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

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Vehicle Number */}
              <TextField
                label="Vehicle Number"
                fullWidth
                variant="outlined"
                value={localFilters.vehicleNo}
                onChange={e => handleChange('vehicleNo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              
              {/* Expected Return Date */}
              <TextField
                label="Expected Return Date"
                type="date"
                value={localFilters.expectedReturnDate}
                onChange={e => handleChange('expectedReturnDate', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
                inputProps={{
                  min: '',
                  max: '',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Visitor Name */}
              <TextField
                label="Visitor Name"
                fullWidth
                variant="outlined"
                value={localFilters.visitorName}
                onChange={e => handleChange('visitorName', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              
              {/* Visitor Contact */}
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

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Vendor Company */}
              <TextField
                label="Vendor Company"
                fullWidth
                variant="outlined"
                value={localFilters.vendorCompany}
                onChange={e => handleChange('vendorCompany', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              
              {/* Supplier Name (Vendor Dropdown) */}
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
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Building */}
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
              
              {/* Gate Number Input */}
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

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Created By */}
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
              
              {/* Empty field for alignment */}
              <div></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button onClick={handleApply} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
              Apply
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
