import React, { useState } from 'react';
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
  });

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      code: '',
      category: '',
      criticality: '',
    });
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
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6}>
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink id="category-label">
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
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} sm={6}>
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel shrink id="criticality-label">
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
            </Grid>
          </Grid>
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