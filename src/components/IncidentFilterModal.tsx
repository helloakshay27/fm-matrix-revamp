import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { incidentService, type Incident } from '@/services/incidentService';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

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

interface IncidentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onApply: (filteredIncidents: Incident[]) => void;
  onReset?: () => void;
}

interface FilterData {
  level: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  assignee: string;
  status: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
}

export const IncidentFilterModal: React.FC<IncidentFilterModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onApply,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    level: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    assignee: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Remote dropdown options
  const [levels, setLevels] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);

  const uniqueOptions = useMemo(() => {
    const getSorted = (values: (string | null | undefined)[]) =>
      Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

    return {
      levels: levels.length ? levels.map(o => o.name) : getSorted(incidents.map(i => i.inc_level_name)),
      categories: categories.length ? categories.map(o => o.name) : getSorted(incidents.map(i => i.category_name)),
      subCategories: subCategories.length ? subCategories.map(o => o.name) : getSorted(incidents.map(i => i.sub_category_name)),
      subSubCategories: subSubCategories.length ? subSubCategories.map(o => o.name) : getSorted(incidents.map(i => i.sub_sub_category_name)),
      assignees: getSorted(incidents.map(i => i.assigned_to_user_name)),
      statuses: statuses.length ? statuses.map(o => o.name) : getSorted(incidents.map(i => i.current_status)),
    };
  }, [incidents, levels, categories, subCategories, subSubCategories, statuses]);

  // Fetch options from API when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    const fetchTagOptions = async (tagType: string): Promise<{ id: number; name: string }[]> => {
      let baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';
      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
      }
      const url = `${baseUrl}/pms/incidence_tags.json?q[tag_type_eq]=${encodeURIComponent(tagType)}`;
      const resp = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) {
        return [];
      }
      const json = await resp.json();
      const data = (json.data || []) as Array<{ id?: number; name?: string }>;
      return data
        .filter(d => d.name && typeof d.id === 'number')
        .map(d => ({ id: d.id as number, name: d.name as string }));
    };

    const loadAll = async () => {
      try {
        setIsOptionsLoading(true);
        const [statusOpts, levelOpts, catOpts, subCatOpts, subSubCatOpts] = await Promise.all([
          fetchTagOptions('IncidenceStatus'),
          fetchTagOptions('IncidenceLevel'),
          fetchTagOptions('IncidenceCategory'),
          fetchTagOptions('IncidenceSubCategory'),
          fetchTagOptions('IncidenceSubSubCategory'),
        ]);
        if (isCancelled) return;
        setStatuses(statusOpts);
        setLevels(levelOpts);
        setCategories(catOpts);
        setSubCategories(subCatOpts);
        setSubSubCategories(subSubCatOpts);
      } finally {
        if (!isCancelled) setIsOptionsLoading(false);
      }
    };

    loadAll();
    return () => { isCancelled = true; };
  }, [isOpen]);

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setFilterData(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = async () => {
    try {
      setIsLoading(true);
      // Build query params mapping selected names to IDs from loaded tag options
      const findIdByName = (arr: { id: number; name: string }[], name: string) => arr.find(o => o.name === name)?.id;
      const params: string[] = [];
      if (filterData.startDate) params.push(`q[inc_time_gteq]=${encodeURIComponent(filterData.startDate)}`);
      if (filterData.endDate) params.push(`q[inc_time_lteq]=${encodeURIComponent(filterData.endDate)}`);
      if (filterData.category) {
        const id = findIdByName(categories, filterData.category);
        if (id) params.push(`q[inc_category_id_eq]=${id}`);
      }
      if (filterData.subCategory) {
        const id = findIdByName(subCategories, filterData.subCategory);
        if (id) params.push(`q[inc_sub_category_id_eq]=${id}`);
      }
      if (filterData.subSubCategory) {
        const id = findIdByName(subSubCategories, filterData.subSubCategory);
        if (id) params.push(`q[inc_sub_sub_category_id_eq]=${id}`);
      }
      if (filterData.level) {
        const id = findIdByName(levels, filterData.level);
        if (id) params.push(`q[inc_level_id_eq]=${id}`);
      }
      if (filterData.status) {
        const id = findIdByName(statuses, filterData.status);
        // API expects status by name or ID? Provided example uses name for current_status
        // Using name as per example
        params.push(`q[current_status_eq]=${encodeURIComponent(filterData.status)}`);
      }

      const query = params.join('&');
      let baseUrl = localStorage.getItem('baseUrl') || '';
      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
      }
      // Fetch filtered incidents from server
      const response = await incidentService.getIncidents(query);
      onApply(response.data.incidents || []);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilterData({
      level: '',
      category: '',
      subCategory: '',
      subSubCategory: '',
      assignee: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    onReset?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white z-50">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="level-label">Level</InputLabel>
              <MuiSelect
                labelId="level-label"
                value={filterData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select level</em></MenuItem>
                {uniqueOptions.levels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="category-label">Category</InputLabel>
              <MuiSelect
                labelId="category-label"
                value={filterData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select category</em></MenuItem>
                {uniqueOptions.categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="sub-category-label">Sub Category</InputLabel>
              <MuiSelect
                labelId="sub-category-label"
                value={filterData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select sub category</em></MenuItem>
                {uniqueOptions.subCategories.map(sub => (
                  <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="sub-sub-category-label">Sub Sub Category</InputLabel>
              <MuiSelect
                labelId="sub-sub-category-label"
                value={filterData.subSubCategory}
                onChange={(e) => handleInputChange('subSubCategory', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select sub sub category</em></MenuItem>
                {uniqueOptions.subSubCategories.map(subsub => (
                  <MenuItem key={subsub} value={subsub}>{subsub}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="assignee-label">Assignees</InputLabel>
              <MuiSelect
                labelId="assignee-label"
                value={filterData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select assignee</em></MenuItem>
                {uniqueOptions.assignees.map(assignee => (
                  <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl> */}

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel shrink id="status-label">Status</InputLabel>
              <MuiSelect
                labelId="status-label"
                value={filterData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                displayEmpty
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select status</em></MenuItem>
                {uniqueOptions.statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={filterData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="End Date"
              type="date"
              value={filterData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleApply}
              disabled={isLoading}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8"
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentFilterModal;


