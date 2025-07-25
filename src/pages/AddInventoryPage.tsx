import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchInventoryAssets } from '@/store/slices/inventoryAssetsSlice';
import { fetchSuppliersData } from '@/store/slices/suppliersSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent, Radio, RadioGroup, FormControlLabel, Box } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { getUser } from '@/utils/auth';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';

// Validation rules
interface FormErrors {
  inventoryType?: string;
  criticality?: string;
  inventoryName?: string;
  inventoryCode?: string;
  quantity?: string;
  cost?: string;
  minStockLevel?: string;
  maxStockLevel?: string;
  minOrderLevel?: string;
  sacHsnCode?: string;
  sgstRate?: string;
  cgstRate?: string;
  igstRate?: string;
  expiryDate?: string;
}

export const AddInventoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const inventoryAssetsState = useSelector((state: RootState) => state.inventoryAssets);
  const { assets = [], loading = false } = inventoryAssetsState || {};

  const suppliersState = useSelector((state: RootState) => state.suppliers);
  const suppliers = Array.isArray(suppliersState?.data) ? suppliersState.data : [];
  const suppliersLoading = suppliersState?.loading || false;

  const [inventoryType, setInventoryType] = useState('spares');
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
    minOrderLevel: '',
    sacHsnCode: '',
    sgstRate: '',
    cgstRate: '',
    igstRate: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    dispatch(fetchInventoryAssets());
    dispatch(fetchSuppliersData());
  }, [dispatch]);

  // Validation function
  const validateField = (field: string, value: string) => {
    const newErrors: FormErrors = { ...errors };

    // Helper to check if a value is a valid positive number
    const isValidPositiveNumber = (val: string) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    };

    // Helper to check if a value is a valid date
    const isValidDate = (val: string) => {
      if (!val) return true; // Allow empty date
      const date = new Date(val);
      return !isNaN(date.getTime());
    };

    switch (field) {
      case 'inventoryName':
        newErrors.inventoryName = !value ? 'Inventory Name is required' : '';
        break;
      case 'inventoryCode':
        newErrors.inventoryCode = !value ? 'Inventory Code is required' : '';
        break;
      case 'quantity':
        newErrors.quantity = !value
          ? 'Quantity is required'
          : !isValidPositiveNumber(value)
            ? 'Quantity must be a valid number'
            : '';
        break;
      case 'cost':
        newErrors.cost = value && !isValidPositiveNumber(value) ? 'Cost must be a valid number' : '';
        break;
      case 'minStockLevel':
        newErrors.minStockLevel = !value
          ? 'Min Stock Level is required'
          : !isValidPositiveNumber(value)
            ? 'Min Stock Level must be a valid number'
            : '';
        break;
      case 'maxStockLevel':
        newErrors.maxStockLevel = value && !isValidPositiveNumber(value) ? 'Max Stock Level must be a valid number' : '';
        break;
      case 'minOrderLevel':
        newErrors.minOrderLevel = value && !isValidPositiveNumber(value) ? 'Min Order Level must be a valid number' : '';
        break;
      case 'sacHsnCode':
        newErrors.sacHsnCode = taxApplicable && !value ? 'SAC/HSN Code is required when tax is applicable' : '';
        break;
      case 'sgstRate':
        newErrors.sgstRate = taxApplicable && value && !isValidPositiveNumber(value) ? 'SGST Rate must be a valid number' : '';
        break;
      case 'cgstRate':
        newErrors.cgstRate = taxApplicable && value && !isValidPositiveNumber(value) ? 'CGST Rate must be a valid number' : '';
        break;
      case 'igstRate':
        newErrors.igstRate = taxApplicable && value && !isValidPositiveNumber(value) ? 'IGST Rate must be a valid number' : '';
        break;
      case 'expiryDate':
        newErrors.expiryDate = value && !isValidDate(value) ? 'Invalid date format' : '';
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validate all required fields before submission
  const validateForm = () => {
    const newErrors: FormErrors = {};

    newErrors.inventoryType = !inventoryType ? 'Inventory Type is required' : '';
    newErrors.criticality = !criticality ? 'Criticality is required' : '';
    newErrors.inventoryName = !formData.inventoryName ? 'Inventory Name is required' : '';
    newErrors.inventoryCode = !formData.inventoryCode ? 'Inventory Code is required' : '';
    newErrors.quantity = !formData.quantity
      ? 'Quantity is required'
      : !isNaN(parseFloat(formData.quantity)) && parseFloat(formData.quantity) >= 0
        ? ''
        : 'Quantity must be a valid number';
    newErrors.minStockLevel = !formData.minStockLevel
      ? 'Min Stock Level is required'
      : !isNaN(parseFloat(formData.minStockLevel)) && parseFloat(formData.minStockLevel) >= 0
        ? ''
        : 'Min Stock Level must be a valid number';
    newErrors.maxStockLevel = formData.maxStockLevel && (isNaN(parseFloat(formData.maxStockLevel)) || parseFloat(formData.maxStockLevel) < 0)
      ? 'Max Stock Level must be a valid number'
      : '';
    newErrors.minOrderLevel = formData.minOrderLevel && (isNaN(parseFloat(formData.minOrderLevel)) || parseFloat(formData.minOrderLevel) < 0)
      ? 'Min Order Level must be a valid number'
      : '';
    newErrors.cost = formData.cost && (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) < 0)
      ? 'Cost must be a valid number'
      : '';
    newErrors.expiryDate = formData.expiryDate && isNaN(new Date(formData.expiryDate).getTime()) ? 'Invalid date format' : '';

    if (taxApplicable) {
      newErrors.sacHsnCode = !formData.sacHsnCode ? 'SAC/HSN Code is required when tax is applicable' : '';
      newErrors.sgstRate = formData.sgstRate && (isNaN(parseFloat(formData.sgstRate)) || parseFloat(formData.sgstRate) < 0)
        ? 'SGST Rate must be a valid number'
        : '';
      newErrors.cgstRate = formData.cgstRate && (isNaN(parseFloat(formData.cgstRate)) || parseFloat(formData.cgstRate) < 0)
        ? 'CGST Rate must be a valid number'
        : '';
      newErrors.igstRate = formData.igstRate && (isNaN(parseFloat(formData.igstRate)) || parseFloat(formData.igstRate) < 0)
        ? 'IGST Rate must be a valid number'
        : '';
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every(error => !error);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const user = getUser();
    const payload = {
      pms_inventory: {
        user_id: user?.id?.toString() || "",
        inventory_type: inventoryType === 'spares' ? 1 : 2,
        criticality: criticality === 'critical' ? 1 : 2,
        asset_id: parseInt(formData.assetName) || null,
        name: formData.inventoryName,
        code: formData.inventoryCode,
        serial_number: formData.serialNumber,
        quantity: parseInt(formData.quantity) || 0,
        cost: parseFloat(formData.cost) || 0,
        unit: formData.unit,
        expiry_date: formData.expiryDate ? `${formData.expiryDate}T00:00:00Z` : null,
        category: formData.category,
        rate_contract_vendor_code: formData.vendor,
        max_stock_level: parseInt(formData.maxStockLevel) || 0,
        min_stock_level: formData.minStockLevel,
        min_order_level: formData.minOrderLevel,
        green_product: ecoFriendly ? 1 : 0,
        ...(taxApplicable && {
          hsn_id: taxApplicable ? parseInt(formData.sacHsnCode) || null : null,
          sgst_rate: parseFloat(formData.sgstRate) || 0,
          cgst_rate: parseFloat(formData.cgstRate) || 0,
          igst_rate: parseFloat(formData.igstRate) || 0,
        }),
      },
      tax_applicable: taxApplicable ? 1 : 0,
    };

    console.log('Submitting inventory payload:', payload);

    try {
      const response = await fetch(getFullUrl('/pms/inventories.json'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Inventory created successfully:', result);

        toast({
          title: "Inventory Created",
          description: "Inventory has been successfully created.",
        });

        navigate(-1);
      } else {
        console.error('Failed to create inventory:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error response:', errorData);

        toast({
          title: "Error",
          description: "Failed to create inventory. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating inventory:', error);

      toast({
        title: "Error",
        description: "Failed to create inventory. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Consistent field styling for MUI components with rounded corners and larger labels
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
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
      '&.Mui-error fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#C72030',
      },
      '&.Mui-error': {
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
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory List
        </button>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">NEW INVENTORY</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Inventory Details Section */}
        <div className="border-b border-[#D9D9D9] bg-[#F6F7F7]">
          <button
            onClick={() => setInventoryDetailsExpanded(!inventoryDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left bg-[#F6F4EE] mb-3"
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
                  value={inventoryType}
                  onChange={(e) => {
                    setInventoryType(e.target.value);
                    setErrors(prev => ({ ...prev, inventoryType: '' }));
                  }}
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
                {errors.inventoryType && (
                  <p className="text-red-500 text-sm mt-1">{errors.inventoryType}</p>
                )}
              </div>

              {/* Criticality */}
              <div>
                <div className="text-sm font-medium mb-3 text-black">
                  Criticality<span className="text-red-500">*</span>
                </div>
                <RadioGroup
                  row
                  value={criticality}
                  onChange={(e) => {
                    setCriticality(e.target.value);
                    setErrors(prev => ({ ...prev, criticality: '' }));
                  }}
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
                {errors.criticality && (
                  <p className="text-red-500 text-sm mt-1">{errors.criticality}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="eco-friendly" className="text-sm font-medium text-black">
                  Eco-friendly Inventory
                </label>
                <Checkbox
                  id="eco-friendly"
                  checked={ecoFriendly}
                  onCheckedChange={(checked) => setEcoFriendly(checked === true)}
                />
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
                      disabled={loading}
                    >
                      <MenuItem value="" sx={{ color: '#C72030' }}>
                        {loading ? 'Loading...' : 'Select an Option...'}
                      </MenuItem>
                      {assets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id.toString()}>
                          {asset.name}
                        </MenuItem>
                      ))}
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
                    error={!!errors.inventoryName}
                    helperText={errors.inventoryName}
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
                    error={!!errors.inventoryCode}
                    helperText={errors.inventoryCode}
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
                    error={!!errors.quantity}
                    helperText={errors.quantity}
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
                    error={!!errors.cost}
                    helperText={errors.cost}
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
                      <MenuItem value="Ea">Each</MenuItem>
                      <MenuItem value="Piece">Piece</MenuItem>
                      <MenuItem value="Kg">Kilogram</MenuItem>
                      <MenuItem value="Litre">Litre</MenuItem>
                      <MenuItem value="Box">Box</MenuItem>
                      <MenuItem value="Bottle">Bottle</MenuItem>
                      <MenuItem value="Packet">Packet</MenuItem>
                      <MenuItem value="Bag">Bag</MenuItem>
                      <MenuItem value="Qty">Quantity</MenuItem>
                      <MenuItem value="Meter">Meter</MenuItem>
                      <MenuItem value="Sq.Mtr">Square Meter</MenuItem>
                      <MenuItem value="Cu.Mtr">Cubic Meter</MenuItem>
                      <MenuItem value="Feet">Feet</MenuItem>
                      <MenuItem value="Sq.Ft">Square Feet</MenuItem>
                      <MenuItem value="Cu.Ft">Cubic Feet</MenuItem>
                      <MenuItem value="Inches">Inches</MenuItem>
                      <MenuItem value="Sq.Inches">Square Inches</MenuItem>
                      <MenuItem value="Nos">Numbers</MenuItem>
                      <MenuItem value="Pcs">Pieces</MenuItem>
                      <MenuItem value="Mm">Millimeter</MenuItem>
                      <MenuItem value="Size">Size</MenuItem>
                      <MenuItem value="Yards">Yards</MenuItem>
                      <MenuItem value="Sq.Yards">Square Yards</MenuItem>
                      <MenuItem value="Rs">Rupees</MenuItem>
                      <MenuItem value="Acre">Acre</MenuItem>
                      <MenuItem value="Kilometer">Kilometer</MenuItem>
                      <MenuItem value="Miles">Miles</MenuItem>
                      <MenuItem value="Grams">Grams</MenuItem>
                      <MenuItem value="Brass">Brass</MenuItem>
                      <MenuItem value="Tonnes">Tonnes</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div>
                  <TextField
                    label="Expiry Date"
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    InputLabelProps={{
                      shrink: true, // ensures the label floats above the field
                    }}
                    fullWidth
                    error={Boolean(errors.expiryDate)}
                    helperText={errors.expiryDate}
                    sx={{
                      height: '45px',
                      '& .MuiInputBase-root': {
                        height: '45px',
                      },
                    }}
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
                      <MenuItem value="Non Technical">Non Technical</MenuItem>
                      <MenuItem value="Technical">Technical</MenuItem>
                      <MenuItem value="Houskeeping">Houskeeping</MenuItem>
                      <MenuItem value="Stationary">Stationary</MenuItem>
                      <MenuItem value="Pantry">Pantry</MenuItem>
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
                      disabled={suppliersLoading}
                    >
                      <MenuItem value="">
                        {suppliersLoading ? 'Loading...' : 'Select Vendor'}
                      </MenuItem>
                      {suppliers.map((supplier: any) => (
                        <MenuItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.company_name}
                        </MenuItem>
                      ))}
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
                    error={!!errors.maxStockLevel}
                    helperText={errors.maxStockLevel}
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
                    error={!!errors.minStockLevel}
                    helperText={errors.minStockLevel}
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
                    error={!!errors.minOrderLevel}
                    helperText={errors.minOrderLevel}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tax Details Section */}
        <div className="border-b border-[#D9D9D9] bg-[#F6F7F7]">
          <button
            onClick={() => setTaxDetailsExpanded(!taxDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left bg-[#F6F4EE] mb-4"
          >
            <div className="flex items-center gap-3 ">
              <div className="w-8 h8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                  checked={taxApplicable}
                  onCheckedChange={(checked) => {
                    setTaxApplicable(checked === true);
                    if (!checked) {
                      setErrors(prev => ({
                        ...prev,
                        sacHsnCode: '',
                        sgstRate: '',
                        cgstRate: '',
                        igstRate: '',
                      }));
                    }
                  }}
                />
                <label htmlFor="tax-applicable" className="text-sm font-medium text-black">Tax Applicable</label>
              </div>

              {taxApplicable && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <FormControl fullWidth variant="outlined" sx={selectStyles} error={!!errors.sacHsnCode}>
                      <InputLabel shrink>SAC/HSN Code</InputLabel>
                      <MuiSelect
                        value={formData.sacHsnCode}
                        onChange={handleSelectChange('sacHsnCode')}
                        label="SAC/HSN Code"
                        notched
                        displayEmpty
                      >
                        <MenuItem value="">Select SAC/HSN Code</MenuItem>
                        <MenuItem value="19">73021011</MenuItem>
                        <MenuItem value="918">0</MenuItem>
                        <MenuItem value="919">0</MenuItem>
                        <MenuItem value="951">0</MenuItem>
                      </MuiSelect>
                      {errors.sacHsnCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.sacHsnCode}</p>
                      )}
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
                      error={!!errors.sgstRate}
                      helperText={errors.sgstRate}
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
                      error={!!errors.cgstRate}
                      helperText={errors.cgstRate}
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
                      error={!!errors.igstRate}
                      helperText={errors.igstRate}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-6 border-b border-[#D9D9D9] bg-[#F6F7F7]">
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