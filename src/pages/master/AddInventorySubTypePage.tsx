import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { toast } from 'sonner';
import { inventorySubTypeService } from '@/services/inventorySubTypeService';
import { inventoryTypeService } from '@/services/inventoryTypeService';

interface InventorySubTypeFormValues {
  name: string;
  material_sub_type_code: string;
  pms_inventory_type_id: number | null;
  description: string;
  active: boolean;
}

interface DropdownOption {
  id: number;
  name: string;
}

const AddInventorySubTypePage = () => {
  const navigate = useNavigate();
  const [inventoryTypes, setInventoryTypes] = useState<DropdownOption[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InventorySubTypeFormValues>({
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    inventoryTypeService.getInventoryTypes().then(data => {
        setInventoryTypes(data.map(d => ({ id: d.id, name: d.name })));
    }).catch(() => toast.error("Failed to load inventory types."));
  }, []);

  const onSubmit = async (data: InventorySubTypeFormValues) => {
    try {
      const payload = {
        pms_inventory_sub_type: { ...data, deleted: false },
      };
      await inventorySubTypeService.createInventorySubType(payload);
      toast.success("Inventory sub-type created successfully");
      navigate("/master/inventory-sub-type");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add</h1>

        {/* Basic Configuration Section - Match AddGateNumberPage styling */}
        <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Sub-Type Name <span style={{ color: 'red' }}>*</span></InputLabel>
                  <TextField
                    {...field}
                    label="Sub-Type Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </FormControl>
              </Box>
            )}
          />
          {/* Sub-Type Code Field */}
          <Controller
            name="material_sub_type_code"
            control={control}
            rules={{ required: 'Code is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Sub-Type Code <span style={{ color: 'red' }}>*</span></InputLabel>
                  <TextField
                    {...field}
                    label="Sub-Type Code"
                    variant="outlined"
                    fullWidth
                    error={!!errors.material_sub_type_code}
                    helperText={errors.material_sub_type_code?.message}
                  />
                </FormControl>
              </Box>
            )}
          />
          {/* Inventory Type Dropdown */}
          <Controller
            name="pms_inventory_type_id"
            control={control}
            rules={{ required: 'Inventory Type is required' }}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Inventory Type <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Inventory Type"
                    notched
                    displayEmpty
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  >
                    <MenuItem value="">Select Inventory Type</MenuItem>
                    {inventoryTypes.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.pms_inventory_type_id && (
                  <Typography variant="caption" color="error">{errors.pms_inventory_type_id.message}</Typography>
                )}
              </Box>
            )}
          />
          {/* Status Dropdown */}
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Status <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Status"
                    notched
                    displayEmpty
                    value={field.value === true ? 'true' : field.value === false ? 'false' : ''}
                    onChange={e => field.onChange(e.target.value === 'true')}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          />
          {/* Description Textarea */}
          <div className="md:col-span-2">
            <Controller
              name="description"
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
                      display: "block",
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

export default AddInventorySubTypePage;
