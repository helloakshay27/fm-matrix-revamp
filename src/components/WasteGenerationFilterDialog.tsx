
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { X } from "lucide-react";
import { toast } from 'sonner';
import { 
  fetchCommodities, 
  fetchCategories, 
  fetchOperationalLandlords,
  Commodity,
  Category,
  OperationalLandlord,
  WasteGenerationFilters
} from '@/services/wasteGenerationAPI';

interface Filters {
  commodity: string;
  category: string;
  operationalName: string;
  fromDate: string;
  toDate: string;
}

interface WasteGenerationFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: WasteGenerationFilters) => void;
  onExport: (filters: WasteGenerationFilters) => void;
}

export const WasteGenerationFilterDialog: React.FC<WasteGenerationFilterDialogProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onExport 
}) => {
  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999, // High z-index to ensure dropdown appears above other elements
      },
    },
    // Prevent focus conflicts with Dialog
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };
  // using sonner toast directly
  const [filters, setFilters] = useState<Filters>({
    commodity: '',
    category: '',
    operationalName: '',
    fromDate: '',
    toDate: ''
  });

  // API data state
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [operationalLandlords, setOperationalLandlords] = useState<OperationalLandlord[]>([]);

  // Loading states
  const [loadingCommodities, setLoadingCommodities] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingOperationalLandlords, setLoadingOperationalLandlords] = useState(false);

  // Fetch all dropdown data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchAllDropdowns();
    }
  }, [isOpen]);

  const fetchAllDropdowns = async () => {
    // Fetch commodities
    setLoadingCommodities(true);
    try {
      const commoditiesData = await fetchCommodities();
      console.log('Fetched commodities:', commoditiesData);
      setCommodities(Array.isArray(commoditiesData) ? commoditiesData : []);
    } catch (error) {
      console.error('Error fetching commodities:', error);
      setCommodities([]);
    } finally {
      setLoadingCommodities(false);
    }

    // Fetch categories
    setLoadingCategories(true);
    try {
      const categoriesData = await fetchCategories();
      console.log('Fetched categories:', categoriesData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }

    // Fetch operational landlords
    setLoadingOperationalLandlords(true);
    try {
      const operationalLandlordsData = await fetchOperationalLandlords();
      console.log('Fetched operational landlords:', operationalLandlordsData);
      setOperationalLandlords(Array.isArray(operationalLandlordsData) ? operationalLandlordsData : []);
    } catch (error) {
      console.error('Error fetching operational landlords:', error);
      setOperationalLandlords([]);
    } finally {
      setLoadingOperationalLandlords(false);
    }
  };

  const handleInputChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Applying filters:', filters);

    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      toast.error('From Date cannot be later than To Date.');
      return;
    }

    if (!filters.commodity && !filters.category && !filters.operationalName && !filters.fromDate && !filters.toDate) {
      toast.error('Please select at least one filter option.');
      return;
    }

    const apiFilters: WasteGenerationFilters = {
      commodity_id_eq: filters.commodity || undefined,
      category_id_eq: filters.category || undefined,
      operational_landlord_id_in: filters.operationalName || undefined,
      date_from: filters.fromDate || undefined,
      date_to: filters.toDate || undefined,
    };
    
    // Remove undefined values
    Object.keys(apiFilters).forEach(key => 
      apiFilters[key as keyof WasteGenerationFilters] === undefined && 
      delete apiFilters[key as keyof WasteGenerationFilters]
    );
    
    console.log('API filters:', apiFilters);
    onApplyFilters(apiFilters);
    
    toast.success('Filters applied successfully!');
    onClose();
  };

  const handleExport = () => {
    console.log('Exporting filtered data');
    
    const apiFilters: WasteGenerationFilters = {
      commodity_id_eq: filters.commodity || undefined,
      category_id_eq: filters.category || undefined,
      operational_landlord_id_in: filters.operationalName || undefined,
      date_from: filters.fromDate || undefined,
      date_to: filters.toDate || undefined,
    };
    
    // Remove undefined values
    Object.keys(apiFilters).forEach(key => 
      apiFilters[key as keyof WasteGenerationFilters] === undefined && 
      delete apiFilters[key as keyof WasteGenerationFilters]
    );
    
    onExport(apiFilters);
    
    toast.success('Data exported successfully!');
    onClose();
  };

  const handleReset = () => {
    setFilters({
      commodity: '',
      category: '',
      operationalName: '',
      fromDate: '',
      toDate: ''
    });
  };

  const fieldStyles = {
    height: "45px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      height: "45px",
      "& fieldset": { borderColor: "#999" },
      "&:hover fieldset": { borderColor: "#1976d2" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": { color: "#1976d2" },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-2xl p-6 [&>button]:hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-1  text-white  rounded-none shadow-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            >
              <InputLabel shrink>Commodity/Source</InputLabel>
              <MuiSelect
                value={filters.commodity}
                onChange={(e) => handleInputChange('commodity', e.target.value)}
                label="Commodity/Source"
                notched
                displayEmpty
                disabled={loadingCommodities}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  {loadingCommodities ? 'Loading commodities...' : 'Select Commodity'}
                </MenuItem>
                {Array.isArray(commodities) && commodities.map((commodity) => (
                  <MenuItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.category_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            >
              <InputLabel shrink>Category</InputLabel>
              <MuiSelect
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Category"
                notched
                displayEmpty
                disabled={loadingCategories}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  {loadingCategories ? 'Loading categories...' : 'Select Category'}
                </MenuItem>
                {Array.isArray(categories) && categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            >
              <InputLabel shrink>Operational Name</InputLabel>
              <MuiSelect
                value={filters.operationalName}
                onChange={(e) => handleInputChange('operationalName', e.target.value)}
                label="Operational Name"
                notched
                displayEmpty
                disabled={loadingOperationalLandlords}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  {loadingOperationalLandlords ? 'Loading operational names...' : 'Select Operational Name'}
                </MenuItem>
                {Array.isArray(operationalLandlords) && operationalLandlords.map((landlord) => (
                  <MenuItem key={landlord.id} value={landlord.id.toString()}>
                    {landlord.category_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="From Date"
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldStyles}
              />
              <TextField
                label="To Date"
                type="date"
                value={filters.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldStyles}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#A01B26] px-8 rounded-none shadow-none"
            >
              Submit
            </Button>
            <Button
              onClick={handleExport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#A01B26] px-8 rounded-none shadow-none"
            >
              Export
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8 rounded-none shadow-none"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
