import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
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

const EditInventoryTypePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const inventoryTypeId = Number(id);
  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryTypeFormValues>();

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
        pms_inventory_type: { ...data, deleted: false },
      };
      await inventoryTypeService.updateInventoryType(inventoryTypeId, payload);
      toast.success("Inventory type updated successfully");
      navigate("/master/inventory-type");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Inventory Type</h1>
        <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Name" variant="outlined" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
              <Controller
                name="material_type_code"
                control={control}
                rules={{ required: 'Code is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Material Code" variant="outlined" fullWidth error={!!errors.material_type_code} helperText={errors.material_type_code?.message} />
                )}
              />
              <Controller
                name="company_id"
                control={control}
                rules={{ required: 'Company is required' }}
                render={({ field }) => (
                  <Box>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Company <span style={{ color: 'red' }}>*</span></InputLabel>
                      <Select
                        label="Select Company"
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
                  </Box>
                )}
              />
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Category" variant="outlined" fullWidth error={!!errors.category} helperText={errors.category?.message} />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="material_type_description"
                  control={control}
                  render={({ field }) => (
                    // <TextField {...field} label="Description" variant="outlined" fullWidth multiline rows={3} />

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
                          width: "100% !important",   // force full width
                          resize: "both",             // allow resizing
                          overflow: "auto",
                          boxSizing: "border-box",
                          display: "block",
                        },
                        "& textarea[aria-hidden='true']": {
                          display: "none !important", // hide shadow textarea
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

export default EditInventoryTypePage;
