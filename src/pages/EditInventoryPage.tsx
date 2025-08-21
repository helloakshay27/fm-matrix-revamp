import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchInventoryAssets } from '@/store/slices/inventoryAssetsSlice';
import { fetchSuppliersData } from '@/store/slices/suppliersSlice';
import { fetchInventory, updateInventory, clearError, resetInventoryState } from '@/store/slices/inventoryEditSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
// Removed custom ResponsiveDatePicker in favor of simple MUI date input

export const EditInventoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const inventoryAssetsState = useSelector((state: RootState) => state.inventoryAssets);
  const { assets = [], loading = false } = inventoryAssetsState || {};

  const suppliersState = useSelector((state: RootState) => state.suppliers);
  const suppliers = Array.isArray(suppliersState?.data) ? suppliersState.data : [];
  const suppliersLoading = suppliersState?.loading || false;

  const { loading: editLoading, error, fetchedInventory, updatedInventory } = useSelector((state: RootState) => state.inventoryEdit);

  const [inventoryType, setInventoryType] = useState('spares');
  const [criticality, setCriticality] = useState('critical');
  const [taxApplicable, setTaxApplicable] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [inventoryDetailsExpanded, setInventoryDetailsExpanded] = useState(true);
  const [taxDetailsExpanded, setTaxDetailsExpanded] = useState(true);
  const [sacList, setSacList] = useState([]);
  // Main form data state (moved up so suggestion filtering can reference it)
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
  // Inventory name suggestion state
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]); // raw API suggestions
  const [nameSuggestLoading, setNameSuggestLoading] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false); // actual dropdown visibility (only when filtered matches exist)
  const nameDebounceRef = useRef<number | null>(null);
  const inventoryNameWrapperRef = useRef<HTMLDivElement | null>(null);
  const fetchSAC = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://${baseUrl}/pms/hsns/get_hsns.json`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSacList(data);
      return data;
    } catch (error) {
      console.error('Error fetching SAC:', error);
    }
  };
  // Fetch SAC/HSN codes on mount
  useEffect(() => {
    fetchSAC();
  }, []);

  // Fetch inventory name suggestions (Edit page)
  const fetchNameSuggestions = async (query: string) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) return;
    setNameSuggestLoading(true);
    try {
      const res = await fetch(`https://${baseUrl}/pms/inventories/suggestions.json?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed suggestions');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNameSuggestions(data);
      } else if (Array.isArray(data?.suggestions)) { // fallback shape
        setNameSuggestions(data.suggestions);
      } else {
        setNameSuggestions([]);
      }
    } catch (e) {
      setNameSuggestions([]);
    } finally { setNameSuggestLoading(false); }
  };

  // Filter suggestions client-side against current input so stale unmatched results don't show.
  const filteredNameSuggestions = useMemo(() => {
    const input = formData.inventoryName.trim().toLowerCase();
    if (input.length < 2) return [];
    return nameSuggestions.filter(s => (s?.name || '').toLowerCase().includes(input));
  }, [formData.inventoryName, nameSuggestions]);

  // Control dropdown visibility strictly by presence of filtered matches
  useEffect(() => {
    if (filteredNameSuggestions.length > 0) {
      setShowNameSuggestions(true);
    } else {
      setShowNameSuggestions(false);
    }
  }, [filteredNameSuggestions]);

  // Outside click to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inventoryNameWrapperRef.current) return;
      if (!inventoryNameWrapperRef.current.contains(e.target as Node)) {
        setShowNameSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  // Helper: convert an incoming ISO / zoned date string to YYYY-MM-DD for <input type="date">
  const formatDateForInput = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      // Adjust to local date (strip timezone influence)
      const tzOffset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - tzOffset * 60000);
      return local.toISOString().slice(0, 10); // YYYY-MM-DD
    } catch {
      return '';
    }
  };

  useEffect(() => {
    console.log('Dispatching fetchInventoryAssets...');
    if (id) {
      dispatch(fetchInventory(id));
    }
    dispatch(fetchInventoryAssets());
    dispatch(fetchSuppliersData());

    return () => {
      dispatch(resetInventoryState());
    };
  }, [id, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Assets state:', { assets, loading, inventoryAssetsState });
    console.log('Suppliers state:', { suppliers, suppliersLoading, suppliersState });
  }, [assets, loading, inventoryAssetsState, suppliers, suppliersLoading, suppliersState]);

  // Populate form with fetched inventory data
  useEffect(() => {
    if (fetchedInventory) {
      const normalizedExpiry = fetchedInventory.expiry_date ? formatDateForInput(fetchedInventory.expiry_date) : '';
      // Prefer vendor name over id for display
      const vendorName = (fetchedInventory as any)?.vendor_name || (fetchedInventory as any)?.vendor?.company_name || '';
      setFormData({
        assetName: fetchedInventory.asset_id?.toString() || '',
        inventoryName: fetchedInventory.name || '',
        inventoryCode: fetchedInventory.code || '',
        serialNumber: fetchedInventory.serial_number || '',
        quantity: fetchedInventory.quantity?.toString() || '',
        cost: fetchedInventory.cost?.toString() || '',
        unit: fetchedInventory.unit || '',
        // Store only the date part (YYYY-MM-DD) for the date input field
        expiryDate: normalizedExpiry,
        category: fetchedInventory.category || '',
        // Display vendor name if available; fallback to vendor_id (will be converted later when suppliers list loads)
        vendor: vendorName || fetchedInventory.vendor_id?.toString() || '',
        maxStockLevel: fetchedInventory.max_stock_level?.toString() || '',
        minStockLevel: fetchedInventory.min_stock_level?.toString() || '',
        minOrderLevel: fetchedInventory.min_order_level?.toString() || '',
        // Prefer hsn_id (numeric) for dropdown value; fallback to hsc_hsn_code if API only returns code
        sacHsnCode: ( (fetchedInventory as any)?.hsn_id != null
          ? String((fetchedInventory as any).hsn_id)
          : ((fetchedInventory as any).hsc_hsn_code ? String((fetchedInventory as any).hsc_hsn_code) : '')
        ),
        sgstRate: fetchedInventory.sgst_rate?.toString() || '',
        cgstRate: fetchedInventory.cgst_rate?.toString() || '',
        igstRate: fetchedInventory.igst_rate?.toString() || ''
      });

      // Handle numeric values for radio buttons
      const inventoryTypeValue = (typeof fetchedInventory.inventory_type === 'number' && fetchedInventory.inventory_type === 2) ? 'consumable' :
        (typeof fetchedInventory.inventory_type === 'number' && fetchedInventory.inventory_type === 1) ? 'spares' :
          (typeof fetchedInventory.inventory_type === 'string') ? fetchedInventory.inventory_type : 'spares';

      const criticalityValue = (typeof fetchedInventory.criticality === 'number' && fetchedInventory.criticality === 2) ? 'non-critical' :
        (typeof fetchedInventory.criticality === 'number' && fetchedInventory.criticality === 1) ? 'critical' :
          (typeof fetchedInventory.criticality === 'string') ? fetchedInventory.criticality : 'critical';

      setInventoryType(inventoryTypeValue);
      setCriticality(criticalityValue);
      setTaxApplicable(fetchedInventory.tax_applicable || false);
      setEcoFriendly(fetchedInventory.eco_friendly || false);
    }
  }, [fetchedInventory]);

  // Once suppliers list is loaded, if formData.vendor is still a numeric id string, convert it to the supplier name for display
  useEffect(() => {
    if (!formData.vendor) return;
    if (/^\d+$/.test(formData.vendor) && suppliers.length > 0) {
      const match = suppliers.find((s: any) => String(s.id) === formData.vendor);
      if (match && match.company_name && formData.vendor !== match.company_name) {
        setFormData(prev => ({ ...prev, vendor: match.company_name }));
      }
    }
  }, [suppliers, formData.vendor]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle successful update
  useEffect(() => {
    if (updatedInventory) {
      toast.success('Inventory has been updated successfully.');
      navigate('/maintenance/inventory');
    }
  }, [updatedInventory, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    if (!id) return;

    // Format expiry date without unintended timezone shifts: input already YYYY-MM-DD
    const formatExpiryDate = (dateString: string) => {
      if (!dateString) return null;
      return `${dateString}T00:00:00.000+05:30`;
    };

    // Map criticality: 0 for Non-Critical, 1 for Critical
    const criticalityValue = criticality === 'critical' ? 1 : 0;

    const inventoryData: any = {
      asset_id: formData.assetName ? parseInt(formData.assetName) : null,
      name: formData.inventoryName || "",
      code: formData.inventoryCode || "",
      serial_number: formData.serialNumber || "",
      quantity: parseFloat(formData.quantity) || 0,
      active: true,
      max_stock_level: parseInt(formData.maxStockLevel) || 0,
      min_stock_level: formData.minStockLevel || "0",
      min_order_level: formData.minOrderLevel || "0",
      // Use rate_contract_vendor_code to align with create endpoint (retain legacy key if backend still expects it)
      // Map vendor name back to id
      rate_contract_vendor_code: (() => {
        if (!formData.vendor) return null;
        if (/^\d+$/.test(formData.vendor)) return parseInt(formData.vendor);
        const found = suppliers.find((s: any) => s.company_name === formData.vendor);
        return found ? found.id : null;
      })(),
      criticality: criticalityValue,
      expiry_date: formatExpiryDate(formData.expiryDate),
      unit: formData.unit || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (taxApplicable) {
      inventoryData.hsn_id = formData.sacHsnCode ? parseInt(formData.sacHsnCode) : null;
      inventoryData.sgst_rate = formData.sgstRate ? parseFloat(formData.sgstRate) : 0;
      inventoryData.cgst_rate = formData.cgstRate ? parseFloat(formData.cgstRate) : 0;
      inventoryData.igst_rate = formData.igstRate ? parseFloat(formData.igstRate) : 0;
      inventoryData.tax_applicable = 1;
    } else {
      inventoryData.tax_applicable = 0;
    }

    dispatch(updateInventory({ id, inventoryData }));
  };

  const handleBack = () => {
    navigate(-1);
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

  if (editLoading && !fetchedInventory) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inventory data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory List
        </button>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">EDIT INVENTORY - ID: {id}</h1>
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
                <div className="text-sm font-medium mb-3 text-black">
                  Inventory Type<span className="text-red-500">*</span>
                </div>
                <RadioGroup
                  row
                  value={inventoryType}
                  onChange={(e) => setInventoryType(e.target.value)}
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
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value)}
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
                  <div ref={inventoryNameWrapperRef} className="relative">
                    <TextField
                      label={<>Inventory Name<span style={{ color: '#C72030' }}>*</span></>}
                      placeholder="Name"
                      value={formData.inventoryName}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleInputChange('inventoryName', val);
                        if (nameDebounceRef.current) window.clearTimeout(nameDebounceRef.current);
                        if (val.trim().length < 2) {
                          setNameSuggestions([]); setShowNameSuggestions(false); return;
                        }
                        nameDebounceRef.current = window.setTimeout(() => {
                          fetchNameSuggestions(val.trim());
                        }, 350);
                      }}
                      onFocus={() => {
                        if (filteredNameSuggestions.length > 0) setShowNameSuggestions(true);
                      }}
                      onBlur={() => {
                        // Delay to allow click on option
                        setTimeout(() => setShowNameSuggestions(false), 180);
                      }}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
          {showNameSuggestions && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto text-sm">
                        {nameSuggestLoading && (
                          <div className="px-3 py-2 text-gray-500">Loading...</div>
                        )}
            {!nameSuggestLoading && filteredNameSuggestions.map(s => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, inventoryName: s.name }));
                              setShowNameSuggestions(false);
                            }}
                            className={`block w-full text-left px-3 py-2 hover:bg-red-50 ${s.name === formData.inventoryName ? 'bg-red-50' : ''}`}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
                      // Store vendor name as value
                      onChange={(e) => {
                        const val = e.target.value as string;
                        setFormData(prev => ({ ...prev, vendor: val }));
                      }}
                      label="Vendor"
                      notched
                      displayEmpty
                      disabled={suppliersLoading}
                    >
                      <MenuItem value="">
                        {suppliersLoading ? 'Loading...' : 'Select Vendor'}
                      </MenuItem>
                      {suppliers.map((supplier: any) => (
                        <MenuItem key={supplier.id} value={supplier.company_name}>
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
                  checked={taxApplicable}
                  onCheckedChange={(checked) => setTaxApplicable(checked === true)}
                />
                <label htmlFor="tax-applicable" className="text-sm font-medium text-black">Tax Applicable</label>
              </div>

              {/* Tax Rate Fields - Only show when Tax Applicable is checked */}
              {taxApplicable && (
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
                        {Array.isArray(sacList) && sacList.length > 0 && sacList.map((sac: any) => (
                          <MenuItem key={sac.id} value={sac.id}>{sac.code}</MenuItem>
                        ))}
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
        <div className="p-6">
          <Button
            onClick={handleSubmit}
            disabled={editLoading}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            {editLoading ? 'Updating...' : 'Update Inventory'}
          </Button>
        </div>
      </div>
    </div>
  );
};