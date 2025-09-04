
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { 
  fetchCommodities, 
  fetchCategories, 
  fetchOperationalLandlords,
  Commodity,
  Category,
  OperationalLandlord
} from '@/services/wasteGenerationAPI';

interface Filters {
  commodity: string;
  category: string;
  operationalName: string;
  dateRange: string;
}

interface WasteGenerationFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WasteGenerationFilterDialog: React.FC<WasteGenerationFilterDialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    commodity: '',
    category: '',
    operationalName: '',
    dateRange: ''
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

  const handleSelectChange = (field: keyof Filters) => (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    console.log(`Updating ${field} with value:`, value);
    setFilters(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  const handleInputChange = (field: keyof Filters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    console.log('Applying filters:', filters);
    toast({
      title: 'Success',
      description: 'Filters applied successfully!',
    });
    onClose();
  };

  const handleExport = () => {
    console.log('Exporting filtered data');
    toast({
      title: 'Success',
      description: 'Data exported successfully!',
    });
    onClose();
  };

  const handleReset = () => {
    setFilters({
      commodity: '',
      category: '',
      operationalName: '',
      dateRange: ''
    });
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="commodity-select-label" shrink>Commodity/Source</InputLabel>
                <MuiSelect
                  labelId="commodity-select-label"
                  label="Commodity/Source"
                  value={filters.commodity}
                  onChange={handleSelectChange('commodity')}
                  displayEmpty
                  disabled={loadingCommodities}
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{loadingCommodities ? 'Loading commodities...' : 'Select Commodity'}</em>
                  </MenuItem>
                  {Array.isArray(commodities) && commodities.map((commodity) => (
                    <MenuItem 
                      key={`commodity-${commodity.id}`} 
                      value={commodity.id.toString()}
                    >
                      {commodity.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="category-select-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-select-label"
                  label="Category"
                  value={filters.category}
                  onChange={handleSelectChange('category')}
                  displayEmpty
                  disabled={loadingCategories}
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{loadingCategories ? 'Loading categories...' : 'Select Category'}</em>
                  </MenuItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <MenuItem 
                      key={`category-${category.id}`} 
                      value={category.id.toString()}
                    >
                      {category.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="operational-name-select-label" shrink>Operational Name</InputLabel>
                <MuiSelect
                  labelId="operational-name-select-label"
                  label="Operational Name"
                  value={filters.operationalName}
                  onChange={handleSelectChange('operationalName')}
                  displayEmpty
                  disabled={loadingOperationalLandlords}
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{loadingOperationalLandlords ? 'Loading operational names...' : 'Select Operational Name'}</em>
                  </MenuItem>
                  {Array.isArray(operationalLandlords) && operationalLandlords.map((landlord) => (
                    <MenuItem 
                      key={`landlord-${landlord.id}`} 
                      value={landlord.id.toString()}
                    >
                      {landlord.category_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <TextField
                label="Date Range"
                type="date"
                value={filters.dateRange}
                onChange={handleInputChange('dateRange')}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
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
