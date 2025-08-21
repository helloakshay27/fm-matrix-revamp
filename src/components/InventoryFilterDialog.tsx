import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Box,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InventoryFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const InventoryFilterDialog: React.FC<InventoryFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    category: '',
    criticality: '',
    groupId: '',
    subGroupId: '',
  });

  const [groups, setGroups] = useState<any[]>([]);
  const [subGroups, setSubGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubGroups, setLoadingSubGroups] = useState(false);

  // Fetch groups when dialog opens
  useEffect(() => {
    const fetchGroups = async () => {
      if (!open) return;
      setLoadingGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const res = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
            if (Array.isArray(data?.asset_groups)) {
              setGroups(data.asset_groups);
            }
        }
      } catch (e) {
        console.error('Failed to load groups', e);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [open]);

  // Fetch sub groups when group changes
  useEffect(() => {
    const fetchSubGroups = async () => {
      if (!filters.groupId) { setSubGroups([]); setFilters(f => ({ ...f, subGroupId: '' })); return; }
      setLoadingSubGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const res = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${filters.groupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.asset_groups)) {
            setSubGroups(data.asset_groups);
          } else {
            setSubGroups([]);
          }
        }
      } catch (e) {
        console.error('Failed to load sub groups', e);
      } finally {
        setLoadingSubGroups(false);
      }
    };
    fetchSubGroups();
  }, [filters.groupId]);

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const empty = {
      name: '',
      code: '',
      category: '',
      criticality: '',
      groupId: '',
      subGroupId: '',
    };
    // Clear local state
    setFilters(empty);
    setSubGroups([]);
    // Propagate empty filters to parent so table resets
    onApply(empty);
    // Close dialog after reset
    onOpenChange(false);
  };

  const handleChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const fieldHeightSx = {
    height: 48,
    '& .MuiInputBase-input': {
      padding: '12px 14px',
    },
    '& .MuiSelect-select': {
      padding: '12px 14px',
    },
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        FILTER BY
        <IconButton size="small" onClick={() => onOpenChange(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Row 1 */}
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="Name"
                placeholder="Enter Name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldHeightSx }}
              />
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="category-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Category
                </InputLabel>
                <Select
                  labelId="category-label"
                  value={filters.category}
                  onChange={handleChange('category')}
                  displayEmpty
                  sx={fieldHeightSx}

                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  <MenuItem value="Non Technical">Non Technical</MenuItem>
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                  <MenuItem value="Stationary">Stationary</MenuItem>
                  <MenuItem value="Pantry">Pantry</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Row 2 */}
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="Code"
                placeholder="Find Code"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldHeightSx }}
              />
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="criticality-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Criticality
                </InputLabel>
                <Select
                  labelId="criticality-label"
                  value={filters.criticality}
                  onChange={handleChange('criticality')}
                  displayEmpty
                  sx={fieldHeightSx}

                >
                  <MenuItem value="">
                    <em>Select Criticality</em>
                  </MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="non-critical">Non-Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Row 3: Group / Sub Group */}
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth>
                <InputLabel shrink id="group-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Group
                </InputLabel>
                <Select
                  labelId="group-label"
                  value={filters.groupId}
                  onChange={(e) => setFilters({ ...filters, groupId: e.target.value as string, subGroupId: '' })}
                  displayEmpty
                  sx={fieldHeightSx}
                >
                  <MenuItem value="">
                    <em>{loadingGroups ? 'Loading...' : 'Select Group'}</em>
                  </MenuItem>
                  {groups.map((g: any) => (
                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth disabled={!filters.groupId || loadingSubGroups}>
                <InputLabel shrink id="subgroup-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Sub Group
                </InputLabel>
                <Select
                  labelId="subgroup-label"
                  value={filters.subGroupId}
                  onChange={(e) => setFilters({ ...filters, subGroupId: e.target.value as string })}
                  displayEmpty
                  sx={fieldHeightSx}
                >
                  <MenuItem value="">
                    <em>{loadingSubGroups ? 'Loading...' : 'Select Sub Group'}</em>
                  </MenuItem>
                  {subGroups.map((sg: any) => (
                    <MenuItem key={sg.id} value={sg.id}>{sg.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleApply}
          startIcon={<span style={{ fontSize: 18, fontWeight: 'bold' }}>+</span>}
          sx={{
            height: '45px',
            backgroundColor: '#F7F3F0',
            color: '#C72030',
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '16px',
            padding: '0 20px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#eee7e3',
              boxShadow: 'none',
            },
          }}
        >
          Apply
        </Button>

        <Button
          onClick={handleReset}
          sx={{
            height: '45px',
            backgroundColor: '#F7F3F0',
            color: '#C72030',
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '16px',
            padding: '0 20px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#eee7e3',
              boxShadow: 'none',
            },
          }}
        >
          Reset
        </Button>
      </DialogActions>

    </Dialog>
  );
};