
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

export const AddInventoryPage = () => {
  const navigate = useNavigate();
  const [inventoryType, setInventoryType] = useState('consumable');
  const [criticality, setCriticality] = useState('critical');
  const [taxApplicable, setTaxApplicable] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [inventoryDetailsExpanded, setInventoryDetailsExpanded] = useState(true);
  const [taxDetailsExpanded, setTaxDetailsExpanded] = useState(true);

  const [formData, setFormData] = useState({
    assetName: '',
    inventoryName: '',
    inventoryCode: '',
    serialNumber: '',
    quantity: '',
    cost: '',
    unit: '',
    expiryDate: '',
    category: '',
    vendor: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEcoFriendlyChange = (checked: boolean | "indeterminate") => {
    setEcoFriendly(checked === true);
  };

  const handleTaxApplicableChange = (checked: boolean | "indeterminate") => {
    setTaxApplicable(checked === true);
  };

  const handleSubmit = () => {
    console.log('Submitting inventory:', {
      ...formData,
      inventoryType,
      criticality,
      taxApplicable,
      ecoFriendly
    });
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Consistent field styling for MUI TextFields
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: 0,
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
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Inventory List
          </button>
          <span>&gt;</span>
          <span>Create New Inventory</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">NEW INVENTORY</h1>
      </div>

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
                <Label className="text-sm font-medium mb-3 block">Inventory Type*</Label>
                <RadioGroup value={inventoryType} onValueChange={setInventoryType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spares" id="spares" />
                    <Label htmlFor="spares">Spares</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consumable" id="consumable" />
                    <Label htmlFor="consumable">Consumable</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Criticality */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Criticality*</Label>
                <RadioGroup value={criticality} onValueChange={setCriticality} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical">Critical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-critical" id="non-critical" />
                    <Label htmlFor="non-critical">Non-Critical</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Eco-friendly Inventory */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-friendly" 
                  checked={ecoFriendly}
                  onCheckedChange={handleEcoFriendlyChange}
                />
                <Label htmlFor="eco-friendly">Eco-friendly Inventory</Label>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="assetName" className="text-sm font-medium">Select Asset Name</Label>
                  <Select value={formData.assetName} onValueChange={(value) => handleInputChange('assetName', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Option..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset1">Asset 1</SelectItem>
                      <SelectItem value="asset2">Asset 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <TextField
                    label="Inventory Name*"
                    placeholder="Name"
                    value={formData.inventoryName}
                    onChange={(e) => handleInputChange('inventoryName', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>

                <div className="space-y-2">
                  <TextField
                    label="Inventory Code*"
                    placeholder="code"
                    value={formData.inventoryCode}
                    onChange={(e) => handleInputChange('inventoryCode', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>

                <div className="space-y-2">
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

                <div className="space-y-2">
                  <TextField
                    label="Quantity*"
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

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">Select Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Select Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Option..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category1">Category 1</SelectItem>
                      <SelectItem value="category2">Category 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor" className="text-sm font-medium">Vendor</Label>
                  <Select value={formData.vendor} onValueChange={(value) => handleInputChange('vendor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor1">Vendor 1</SelectItem>
                      <SelectItem value="vendor2">Vendor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <TextField
                    label="Min.Stock Level*"
                    placeholder="Min Stock"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>

                <div className="space-y-2">
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
            <div className="p-6 pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tax-applicable" 
                  checked={taxApplicable}
                  onCheckedChange={handleTaxApplicableChange}
                />
                <Label htmlFor="tax-applicable">Tax Applicable</Label>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-6">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
