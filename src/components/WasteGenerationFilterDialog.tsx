
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { FormSearchSelect } from '@/components/FormSearchSelect';
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

  const commodityOptions = useMemo(
    () =>
      commodities.map((c) => ({
        value: c.id.toString(),
        label: c.category_name,
      })),
    [commodities]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id.toString(),
        label: c.category_name,
      })),
    [categories]
  );

  const operationalLandlordOptions = useMemo(
    () =>
      operationalLandlords.map((l) => ({
        value: l.id.toString(),
        label: l.category_name,
      })),
    [operationalLandlords]
  );

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
      <DialogContent className="flex max-h-[65vh] w-[75vw] max-w-3xl flex-col overflow-visible p-0 sm:w-[900px] [&>button]:hidden">
        <DialogHeader className="border-b border-gray-200 px-8 py-5">
          <div className="flex items-center justify-between">
            <DialogTitle>FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-none p-1 text-white shadow-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="min-h-[420px] flex-1 space-y-8 overflow-visible px-8 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormSearchSelect
              label="Commodity/Source"
              value={filters.commodity}
              onChange={(v) => handleInputChange('commodity', v)}
              options={commodityOptions}
              placeholder="Select Commodity"
              isLoading={loadingCommodities}
              disabled={loadingCommodities}
            />

            <FormSearchSelect
              label="Category"
              value={filters.category}
              onChange={(v) => handleInputChange('category', v)}
              options={categoryOptions}
              placeholder="Select Category"
              isLoading={loadingCategories}
              disabled={loadingCategories}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative z-20">
              <FormSearchSelect
                label="Operational Name"
                value={filters.operationalName}
                onChange={(v) => handleInputChange('operationalName', v)}
                options={operationalLandlordOptions}
                placeholder="Select Operational Name"
                isLoading={loadingOperationalLandlords}
                disabled={loadingOperationalLandlords}
              />
            </div>

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

          <div className="flex justify-center gap-4 border-t border-gray-200 px-8 py-6">
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="rounded-none px-8 text-white shadow-none hover:bg-[#A01B26]"
          >
            Submit
          </Button>
          <Button
            onClick={handleExport}
            style={{ backgroundColor: '#C72030' }}
            className="rounded-none px-8 text-white shadow-none hover:bg-[#A01B26]"
          >
            Export
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-none px-8 shadow-none"
          >
            Reset
          </Button>
        </div>

          {/* Reserve space so open dropdowns do not overlap action buttons */}
          <div className="min-h-[200px]" aria-hidden />
        </div>

        
      </DialogContent>
    </Dialog>
  );
};
