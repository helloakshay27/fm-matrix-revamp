
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { X } from "lucide-react";
import { toast } from 'sonner';
import {
  fetchCategories,
  Category,
  WasteGenerationFilters
} from '@/services/wasteGenerationAPI';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface Filters {
  fromDate: string;
  toDate: string;
  userName: string;
  customerId: string;
  userType: string;
  categoryId: string;
  subcategoryId: string;
  status: string;
  deviceTabId: string;
}

interface Entity {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category_name: string;
}

interface WasteGenerationFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: WasteGenerationFilters) => void;
}

const USER_TYPE_OPTIONS = [
  { value: 'FM', label: 'FM' },
  { value: 'Client', label: 'Client' },
];


const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const EMPTY_FILTERS: Filters = {
  fromDate: '',
  toDate: '',
  userName: '',
  customerId: '',
  userType: '',
  categoryId: '',
  subcategoryId: '',
  status: '',
  deviceTabId: '',
};

export const WasteGenerationFilterDialog: React.FC<WasteGenerationFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Fetch categories and entities when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadEntities();
    }
  }, [isOpen]);

  // Fetch subcategories whenever category changes
  useEffect(() => {
    if (filters.categoryId) {
      loadSubcategories(filters.categoryId);
    } else {
      setSubcategories([]);
      setFilters(prev => ({ ...prev, subcategoryId: '' }));
    }
  }, [filters.categoryId]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadEntities = async () => {
    setLoadingEntities(true);
    try {
      const url = getFullUrl('/entities.json');
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (!response.ok) throw new Error('Failed to fetch entities');
      const data = await response.json();
      const list: Entity[] = Array.isArray(data)
        ? data
        : Array.isArray(data.entities)
        ? data.entities
        : [];
      setEntities(list);
    } catch {
      setEntities([]);
    } finally {
      setLoadingEntities(false);
    }
  };

  const loadSubcategories = async (parentId: string) => {
    setLoadingSubcategories(true);
    try {
      const url = getFullUrl(
        `/pms/generic_tags.json?q[tag_type_eq]=Category&q[parent_id_eq]=${parentId}`
      );
      const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      const list: SubCategory[] = Array.isArray(data)
        ? data
        : Array.isArray(data.generic_tags)
        ? data.generic_tags
        : [];
      setSubcategories(list);
    } catch {
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const set = (field: keyof Filters, value: string) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const buildApiFilters = (): WasteGenerationFilters => {
    const f: WasteGenerationFilters = {};
    if (filters.fromDate && filters.toDate) {
      f.date_range = `${formatDate(filters.fromDate)} - ${formatDate(filters.toDate)}`;
    }
    if (filters.userName) f.created_by_firstname_or_lastname_cont = filters.userName;
    if (filters.customerId) f.entity_id_eq = filters.customerId;
    if (filters.userType) f.resource_type_eq = filters.userType;
    if (filters.categoryId) f.commodity_id_eq = filters.categoryId;
    if (filters.subcategoryId) f.category_id_eq = filters.subcategoryId;
    if (filters.status) f.status_eq = filters.status;
    if (filters.deviceTabId) f.devise_id_cont = filters.deviceTabId;
    return f;
  };

  const handleSubmit = () => {
    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      toast.error('From Date cannot be later than To Date.');
      return;
    }
    const hasAny = Object.values(filters).some(v => v !== '');
    if (!hasAny) {
      toast.error('Please select at least one filter option.');
      return;
    }
    onApplyFilters(buildApiFilters());
    toast.success('Filters applied successfully!');
    onClose();
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setSubcategories([]);
    onApplyFilters({});
    toast.success('Filters reset successfully!');
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="flex max-h-[80vh] w-[75vw] max-w-3xl flex-col overflow-visible p-0 sm:w-[900px] [&>button]:hidden">
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

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Row 1: Date Range */}
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="From Date"
                type="date"
                value={filters.fromDate}
                onChange={e => set('fromDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="To Date"
                type="date"
                value={filters.toDate}
                onChange={e => set('toDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            {/* Row 2: User Name + Customer */}
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="User Name"
                value={filters.userName}
                onChange={e => set('userName', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Search by user name"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth disabled={loadingEntities}>
                <InputLabel shrink id="customer-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Customer
                </InputLabel>
                <Select
                  labelId="customer-label"
                  value={filters.customerId}
                  onChange={(e: SelectChangeEvent<string>) => set('customerId', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>{loadingEntities ? 'Loading...' : 'Select Customer'}</em>
                  </MenuItem>
                  {entities.map((entity) => (
                    <MenuItem key={entity.id} value={entity.id.toString()}>{entity.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Row 3: User Type + Status */}
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth>
                <InputLabel shrink id="user-type-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  User Type
                </InputLabel>
                <Select
                  labelId="user-type-label"
                  value={filters.userType}
                  onChange={(e: SelectChangeEvent<string>) => set('userType', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select User Type</em>
                  </MenuItem>
                  {USER_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Status"
                value={filters.status}
                onChange={e => set('status', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter status"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            {/* Row 4: Waste Category + Waste Subcategory */}
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth disabled={loadingCategories}>
                <InputLabel shrink id="waste-category-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Waste Category
                </InputLabel>
                <Select
                  labelId="waste-category-label"
                  value={filters.categoryId}
                  onChange={(e: SelectChangeEvent<string>) => {
                    set('categoryId', e.target.value);
                    set('subcategoryId', '');
                  }}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>{loadingCategories ? 'Loading...' : 'Select Waste Category'}</em>
                  </MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id.toString()}>{c.category_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!filters.categoryId || loadingSubcategories}>
                <InputLabel shrink id="waste-subcategory-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Waste Subcategory
                </InputLabel>
                <Select
                  labelId="waste-subcategory-label"
                  value={filters.subcategoryId}
                  onChange={(e: SelectChangeEvent<string>) => set('subcategoryId', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>
                      {loadingSubcategories
                        ? 'Loading...'
                        : filters.categoryId
                        ? 'Select Waste Subcategory'
                        : 'Select a category first'}
                    </em>
                  </MenuItem>
                  {subcategories.map((sc) => (
                    <MenuItem key={sc.id} value={sc.id.toString()}>{sc.category_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Row 5: Device / Tab ID */}
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Device / Tab ID"
                value={filters.deviceTabId}
                onChange={e => set('deviceTabId', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Search by device or tab ID"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-2 border-t border-gray-200 pt-6">
            <Button
              onClick={handleSubmit}
              className="fm-button-fix fm-button-brand px-4 py-2"
            >
              Apply Filter
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-brand text-brand hover:bg-brand hover:text-white"
            >
              Reset
            </Button>
          </div>

          {/* Space so open dropdowns don't hide behind footer */}
          <div className="min-h-[180px]" aria-hidden />
        </div>
      </DialogContent>
    </Dialog>
  );
};
