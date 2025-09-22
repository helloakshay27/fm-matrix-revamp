import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { toast } from 'sonner';
import { inventoryTypeService } from '@/services/inventoryTypeService';
import { gateNumberService } from '@/services/gateNumberService'; // Reusing for company fetch
import { useSelector } from 'react-redux';

interface InventoryTypeFormValues {
  name: string;
  company_id: number | null;
  material_type_code: string;
  material_type_description: string;
  category: string;
  active: boolean;
}

interface DropdownOption {
  id: number;
  name: string;
}

const AddInventoryTypePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const selectedCompany = useSelector((state: any) => state.project.selectedCompany);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InventoryTypeFormValues>({
    defaultValues: {
      company_id: selectedCompany?.id || null,
    }
  });

  // Determine base path from current location or referrer
  const isSettingsRoute = location.pathname.includes('/settings/inventory-management');
  const basePath = isSettingsRoute ? '/settings/inventory-management/inventory-type' : '/master/inventory-type';

  useEffect(() => {
    gateNumberService.getCompanies().then(setCompanies).catch(() => toast.error("Failed to load companies."));
    
    // Set company_id when selectedCompany changes
    if (selectedCompany?.id) {
      setValue('company_id', selectedCompany.id);
    }
  }, [selectedCompany, setValue]);

  const onSubmit = async (data: InventoryTypeFormValues) => {
    try {
      const payload = {
        pms_inventory_type: { 
          ...data, 
          deleted: false, 
          active: true,
          // Ensure description is properly formatted
          material_type_description: data.material_type_description?.trim() || ''
        },
      };
      await inventoryTypeService.createInventoryType(payload);
      toast.success("Inventory type created successfully");
      navigate(basePath);
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create inventory type";
      toast.error(errorMessage);
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
            rules={{ required: 'Material Code is required' }}
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
                    {...field}
                    label="Company"
                    notched
                    displayEmpty
                    value={selectedCompany?.id || ''}
                    disabled
                  >
                    <MenuItem value="">Select Company</MenuItem>
                    {selectedCompany && <MenuItem value={selectedCompany.id}>{selectedCompany.name}</MenuItem>}
                  </Select>
                </FormControl>
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
              rules={{ 
                maxLength: {
                  value: 1000,
                  message: "Description cannot exceed 1000 characters"
                }
              }}
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
                  maxRows={8}
                  error={!!errors.material_type_description}
                  helperText={
                    errors.material_type_description?.message || 
                    `${field.value?.length || 0}/1000 characters`
                  }
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
          <Button type="button" variant="outline" className="w-32" onClick={() => navigate(basePath)}>Cancel</Button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};

export default AddInventoryTypePage;
