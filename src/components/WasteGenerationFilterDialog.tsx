
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { FormSearchSelect } from '@/components/FormSearchSelect';
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
  onExport: (filters: WasteGenerationFilters) => void;
}

const USER_TYPE_OPTIONS = [
  { value: 'FM', label: 'FM' },
  { value: 'Client', label: 'Client' },
];


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
  onExport,
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

  const handleExport = () => {
    onExport(buildApiFilters());
    toast.success('Data exported successfully!');
    onClose();
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setSubcategories([]);
  };

  const categoryOptions = useMemo(
    () => categories.map(c => ({ value: c.id.toString(), label: c.category_name })),
    [categories]
  );

  const subcategoryOptions = useMemo(
    () => subcategories.map(s => ({ value: s.id.toString(), label: s.category_name })),
    [subcategories]
  );

  const entityOptions = useMemo(
    () => entities.map(e => ({ value: e.id.toString(), label: e.name })),
    [entities]
  );

  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': { borderColor: '#999' },
      '&:hover fieldset': { borderColor: '#1976d2' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
    },
    '& .MuiInputLabel-root': { '&.Mui-focused': { color: '#1976d2' } },
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
                sx={fieldStyles}
              />
              <TextField
                label="To Date"
                type="date"
                value={filters.toDate}
                onChange={e => set('toDate', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldStyles}
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
                sx={fieldStyles}
              />
              <FormSearchSelect
                label="Customer"
                value={filters.customerId}
                onChange={v => set('customerId', v)}
                options={entityOptions}
                placeholder="Select Customer"
                isLoading={loadingEntities}
                disabled={loadingEntities}
              />
            </div>

            {/* Row 3: User Type + Status */}
            <div className="grid grid-cols-2 gap-6">
              <FormSearchSelect
                label="User Type"
                value={filters.userType}
                onChange={v => set('userType', v)}
                options={USER_TYPE_OPTIONS}
                placeholder="Select User Type"
                isLoading={false}
                disabled={false}
              />
              <TextField
                label="Status"
                value={filters.status}
                onChange={e => set('status', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter status"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldStyles}
              />
            </div>

            {/* Row 4: Waste Category + Waste Subcategory */}
            <div className="grid grid-cols-2 gap-6">
              <FormSearchSelect
                label="Waste Category"
                value={filters.categoryId}
                onChange={v => {
                  set('categoryId', v);
                  set('subcategoryId', '');
                }}
                options={categoryOptions}
                placeholder="Select Waste Category"
                isLoading={loadingCategories}
                disabled={loadingCategories}
              />
              <FormSearchSelect
                label="Waste Subcategory"
                value={filters.subcategoryId}
                onChange={v => set('subcategoryId', v)}
                options={subcategoryOptions}
                placeholder={filters.categoryId ? 'Select Waste Subcategory' : 'Select a category first'}
                isLoading={loadingSubcategories}
                disabled={!filters.categoryId || loadingSubcategories}
              />
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
                sx={fieldStyles}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-6">
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

          {/* Space so open dropdowns don't hide behind footer */}
          <div className="min-h-[180px]" aria-hidden />
        </div>
      </DialogContent>
    </Dialog>
  );
};
