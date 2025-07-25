
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InventoryData {
  assetName: string;
  inventoryName: string;
  inventoryCode: string;
  serialNumber: string;
  quantity: string;
  cost: string;
  unit: string;
  expiryDate: string;
  category: string;
  vendor: string;
  maxStockLevel: string;
  minStockLevel: string;
  minOrderLevel: string;
  inventoryType: string;
  criticality: string;
  ecoFriendly: boolean;
  taxApplicable: boolean;
  sacHsnCode: string;
  sgstRate: string;
  cgstRate: string;
  igstRate: string;
}

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryData: InventoryData;
}

export const EditInventoryModal = ({ isOpen, onClose, inventoryData }: EditInventoryModalProps) => {
  const [formData, setFormData] = useState<InventoryData>(inventoryData);
  const [inventoryDetailsExpanded, setInventoryDetailsExpanded] = useState(true);
  const [taxDetailsExpanded, setTaxDetailsExpanded] = useState(true);

  const handleInputChange = (field: keyof InventoryData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof InventoryData) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    console.log('Updating inventory:', formData);
    onClose();
  };

  // Consistent field styling for MUI components with rounded corners and larger labels
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px', // rounded-md equivalent
      backgroundColor: '#FFFFFF',
      height: 45,
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
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
      color: '#1A1A1A',
      fontWeight: 500,
      fontSize: '16px', // Increased from default 14px
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px',
      '&::placeholder': {
        color: '#999',
        opacity: 1,
      },
    },
  };

  const selectStyles = {
    ...fieldStyles,
    '& .MuiSelect-select': {
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1a1a] uppercase">EDIT INVENTORY</DialogTitle>
        </DialogHeader>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Inventory Details Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setInventoryDetailsExpanded(!inventoryDetailsExpanded)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[#C72030] uppercase">INVENTORY DETAILS</h2>
              </div>
              {inventoryDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {inventoryDetailsExpanded && (
              <div className="p-6 pt-0 space-y-6">
                {/* Inventory Type */}
                <div>
                  <div className="text-sm font-medium mb-3 text-black">
                    Inventory Type<span className="text-red-500">*</span>
                  </div>
                  <RadioGroup
                    row
                    value={formData.inventoryType}
                    onChange={(e) => handleInputChange('inventoryType', e.target.value)}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: '#1A1A1A',
                        fontSize: '14px',
                      },
                      '& .MuiRadio-root': {
                        color: '#C72030',
                        '&.Mui-checked': {
                          color: '#C72030',
                        },
                      },
                    }}
                  >
                    <FormControlLabel value="spares" control={<Radio />} label="Spares" />
                    <FormControlLabel value="consumable" control={<Radio />} label="Consumable" />
                  </RadioGroup>
                </div>

                {/* Criticality */}
                <div>
                  <div className="text-sm font-medium mb-3 text-black">
                    Criticality<span className="text-red-500">*</span>
                  </div>
                  <RadioGroup
                    row
                    value={formData.criticality}
                    onChange={(e) => handleInputChange('criticality', e.target.value)}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: '#1A1A1A',
                        fontSize: '14px',
                      },
                      '& .MuiRadio-root': {
                        color: '#C72030',
                        '&.Mui-checked': {
                          color: '#C72030',
                        },
                      },
                    }}
                  >
                    <FormControlLabel value="critical" control={<Radio />} label="Critical" />
                    <FormControlLabel value="non-critical" control={<Radio />} label="Non-Critical" />
                  </RadioGroup>
                </div>

                {/* Eco-friendly Inventory */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="eco-friendly" 
                    checked={formData.ecoFriendly}
                    onCheckedChange={(checked) => handleInputChange('ecoFriendly', checked === true)}
                  />
                  <label htmlFor="eco-friendly" className="text-sm font-medium text-black">Eco-friendly Inventory</label>
                </div>

                {/* Form Grid - First Row */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <FormControl fullWidth variant="outlined" sx={selectStyles}>
                      <InputLabel shrink>Select Asset Name</InputLabel>
                      <MuiSelect
                        value={formData.assetName}
                        onChange={handleSelectChange('assetName')}
                        label="Select Asset Name"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="" sx={{ color: '#C72030' }}>
                          Select an Option...
                        </MenuItem>
                        <MenuItem value="asset1">Asset 1</MenuItem>
                        <MenuItem value="asset2">Asset 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      label={<>Inventory Name<span style={{ color: '#C72030' }}>*</span></>}
                      placeholder="Name"
                      value={formData.inventoryName}
                      onChange={(e) => handleInputChange('inventoryName', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      label={<>Inventory Code<span style={{ color: '#C72030' }}>*</span></>}
                      placeholder="code"
                      value={formData.inventoryCode}
                      onChange={(e) => handleInputChange('inventoryCode', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      label="Serial Number"
                      placeholder="Serial Number"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      label={<>Quantity<span style={{ color: '#C72030' }}>*</span></>}
                      placeholder="Qty"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>
                </div>

                {/* Form Grid - Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <TextField
                      label="Cost"
                      placeholder="Cost"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <FormControl fullWidth variant="outlined" sx={selectStyles}>
                      <InputLabel shrink>Select Unit</InputLabel>
                      <MuiSelect
                        value={formData.unit}
                        onChange={handleSelectChange('unit')}
                        label="Select Unit"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">Select Unit</MenuItem>
                        <MenuItem value="pcs">Pieces</MenuItem>
                        <MenuItem value="kg">Kilograms</MenuItem>
                        <MenuItem value="liters">Liters</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      label="Expiry Date"
                      type="date"
                      placeholder="Date of Expiry"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <FormControl fullWidth variant="outlined" sx={selectStyles}>
                      <InputLabel shrink>Select Category</InputLabel>
                      <MuiSelect
                        value={formData.category}
                        onChange={handleSelectChange('category')}
                        label="Select Category"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="" sx={{ color: '#C72030' }}>
                          Select an Option...
                        </MenuItem>
                        <MenuItem value="category1">Category 1</MenuItem>
                        <MenuItem value="category2">Category 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl fullWidth variant="outlined" sx={selectStyles}>
                      <InputLabel shrink>Vendor</InputLabel>
                      <MuiSelect
                        value={formData.vendor}
                        onChange={handleSelectChange('vendor')}
                        label="Vendor"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">Select Vendor</MenuItem>
                        <MenuItem value="vendor1">Vendor 1</MenuItem>
                        <MenuItem value="vendor2">Vendor 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>

                {/* Form Grid - Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextField
                      label="Max.Stock Level"
                      placeholder="Max Stock"
                      value={formData.maxStockLevel}
                      onChange={(e) => handleInputChange('maxStockLevel', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      label={<>Min.Stock Level<span style={{ color: '#C72030' }}>*</span></>}
                      placeholder="Min Stock"
                      value={formData.minStockLevel}
                      onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>

                  <div>
                    <TextField
                      label="Min.Order Level"
                      placeholder="Min order"
                      value={formData.minOrderLevel}
                      onChange={(e) => handleInputChange('minOrderLevel', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tax Details Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setTaxDetailsExpanded(!taxDetailsExpanded)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[#C72030] uppercase">TAX DETAILS</h2>
              </div>
              {taxDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {taxDetailsExpanded && (
              <div className="p-6 pt-0 space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tax-applicable" 
                    checked={formData.taxApplicable}
                    onCheckedChange={(checked) => handleInputChange('taxApplicable', checked === true)}
                  />
                  <label htmlFor="tax-applicable" className="text-sm font-medium text-black">Tax Applicable</label>
                </div>

                {/* Tax Rate Fields - Only show when Tax Applicable is checked */}
                {formData.taxApplicable && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <FormControl fullWidth variant="outlined" sx={selectStyles}>
                        <InputLabel shrink>SAC/HSN Code</InputLabel>
                        <MuiSelect
                          value={formData.sacHsnCode}
                          onChange={handleSelectChange('sacHsnCode')}
                          label="SAC/HSN Code"
                          notched
                          displayEmpty
                        >
                          <MenuItem value="">Select SAC/HSN Code</MenuItem>
                          <MenuItem value="sac001">SAC 001</MenuItem>
                          <MenuItem value="hsn001">HSN 001</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>

                    <div>
                      <TextField
                        label="SGST Rate"
                        placeholder="SGST Rate"
                        value={formData.sgstRate}
                        onChange={(e) => handleInputChange('sgstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyles}
                      />
                    </div>

                    <div>
                      <TextField
                        label="CGST Rate"
                        placeholder="CGST Rate"
                        value={formData.cgstRate}
                        onChange={(e) => handleInputChange('cgstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyles}
                      />
                    </div>

                    <div>
                      <TextField
                        label="IGST Rate"
                        placeholder="IGST Rate"
                        value={formData.igstRate}
                        onChange={(e) => handleInputChange('igstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyles}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 flex justify-end gap-3">
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
