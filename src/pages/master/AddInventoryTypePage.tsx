import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { toast } from 'sonner';
import { inventoryTypeService } from '@/services/inventoryTypeService';
import { gateNumberService } from '@/services/gateNumberService'; // Reusing for company fetch

interface InventoryTypeFormValues {
  name: string;
  company_id: number | null;
  material_type_code: string;
  material_type_description: string;
  category: string;
}

interface DropdownOption {
  id: number;
  name: string;
}

const AddInventoryTypePage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryTypeFormValues>();

  useEffect(() => {
    gateNumberService.getCompanies().then(setCompanies).catch(() => toast.error("Failed to load companies."));
  }, []);

  const onSubmit = async (data: InventoryTypeFormValues) => {
    try {
      const payload = {
        pms_inventory_type: { ...data, deleted: false },
      };
      await inventoryTypeService.createInventoryType(payload);
      toast.success("Inventory type created successfully");
      navigate("/master/inventory-type");
    } catch (error) {
      console.error(error);
    }
  };

  return (
   <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Inventory Type</h1>
      <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Name <span style={{ color: 'red' }}>*</span></InputLabel>
                  <TextField
                    {...field}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </FormControl>
              </Box>
            )}
          />
          {/* Material Code Field */}
          <Controller
            name="material_type_code"
            control={control}
            rules={{ required: 'Code is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Material Code <span style={{ color: 'red' }}>*</span></InputLabel>
                  <TextField
                    {...field}
                    label="Material Code"
                    variant="outlined"
                    fullWidth
                    error={!!errors.material_type_code}
                    helperText={errors.material_type_code?.message}
                  />
                </FormControl>
              </Box>
            )}
          />
          {/* Company Dropdown */}
          <Controller
            name="company_id"
            control={control}
            rules={{ required: 'Company is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Company <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Company"
                    notched
                    displayEmpty
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  >
                    <MenuItem value="">Select Company</MenuItem>
                    {companies.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {false && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading companies...
                  </Typography>
                )}
                {errors.company_id && (
                  <Typography variant="caption" color="error">{errors.company_id.message}</Typography>
                )}
              </Box>
            )}
          />
          {/* Category Field */}
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
                  <TextField
                    {...field}
                    label="Category"
                    variant="outlined"
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                </FormControl>
              </Box>
            )}
          />
          {/* Description Textarea */}
          <div className="md:col-span-2">
            <Controller
              name="material_type_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    <span style={{ fontSize: '16px' }}>
                      Description <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  placeholder="Enter Description/SOP"
                  fullWidth
                  multiline
                  minRows={4}
                  sx={{
                    mb: 3,
                    "& textarea": {
                      width: "100% !important",
                      resize: "both",
                      overflow: "auto",
                      boxSizing: "border-box",
                      border:'1px solid #c4c4c4',
                      display: "block",
                      bgcolor:'transparent'
                    },
                    "& textarea[aria-hidden='true']": {
                      display: "none !important",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <Button type="submit" className="w-32">Save</Button>
          <Button type="button" variant="outline" className="w-32" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};

export default AddInventoryTypePage;
