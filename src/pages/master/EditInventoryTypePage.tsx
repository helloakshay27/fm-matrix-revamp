import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { toast } from 'sonner';
import { inventoryTypeService } from '@/services/inventoryTypeService';
import { gateNumberService } from '@/services/gateNumberService'; // Reusing for company fetch
import { Package } from 'lucide-react';

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

const EditInventoryTypePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const inventoryTypeId = Number(id);
  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryTypeFormValues>();

  // Determine base path from current location
  const isSettingsRoute = location.pathname.includes('/settings/inventory-management');
  const basePath = isSettingsRoute ? '/settings/inventory-management/inventory-type' : '/master/inventory-type';

  useEffect(() => {
    gateNumberService.getCompanies().then(setCompanies).catch(() => toast.error("Failed to load companies."));
    if (inventoryTypeId) {
      inventoryTypeService.getInventoryTypeById(inventoryTypeId).then(data => {
        // If API response is wrapped, unwrap it
        const item = data && data.id ? data : (data?.pms_inventory_type || data);
        
        reset({
          name: item.name || '',
          company_id: item.company_id || null,
          material_type_code: item.material_type_code || '',
          material_type_description: item.material_type_description || '',
          category: item.category || '',
        });
      });
    }
  }, [inventoryTypeId, reset]);

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
      await inventoryTypeService.updateInventoryType(inventoryTypeId, payload);
      toast.success("Inventory type updated successfully");
      navigate(basePath);
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update inventory type";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Inventory Type</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-[var(--color-ink-68)]" />
              </span>
              <h3 className="text-sm font-semibold uppercase text-[var(--color-text)]">Basic Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField {...field} label={
                    <span style={{ fontSize: '16px' }}>
                      Name*
                    </span>
                  } variant="outlined" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
              <Controller
                name="material_type_code"
                control={control}
                rules={{ required: 'Material Code is required' }}
                render={({ field }) => (
                  <TextField {...field} label={
                    <span style={{ fontSize: '16px' }}>
                      Material Code*
                    </span>
                  } variant="outlined" fullWidth error={!!errors.material_type_code} helperText={errors.material_type_code?.message} />
                )}
              />
              <Controller
                name="company_id"
                control={control}
                rules={{ required: 'Company is required' }}
                render={({ field }) => (
                  <Box>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Company*</InputLabel>
                      <Select
                        label="Select Company"
                        notched
                        displayEmpty
                        disabled={true}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value || null)}
                      >
                        <MenuItem value="">Select Company*</MenuItem>
                        {companies.map(option => (
                          <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={
                    
                    <span style={{ fontSize: '16px' }}>
                      Category
                    </span>
                  } placeholder="Enter Category" variant="outlined" fullWidth />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="material_type_description"
                  control={control}
                  rules={{ 
                    maxLength: {
                      value: 1000,
                      message: "Description cannot exceed 1000 characters"
                    },
                    required: { value: true, message: "Description is required" }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span style={{ fontSize: '16px' }}>
                          Description
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
                        "& textarea": {
                          resize: "vertical",
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
          </div>
          <div className="fm-action-bar mt-6">
            <button type="button" className="fm-action-secondary" onClick={() => navigate(basePath)}>Cancel</button>
            <button type="submit" className="fm-action-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventoryTypePage;
