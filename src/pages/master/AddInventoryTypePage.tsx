import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Inventory Type</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
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
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, data) => field.onChange(data ? data.id : null)}
                value={companies.find((c) => c.id === field.value) || null}
                renderInput={(params: TextFieldProps) => (
                  <TextField {...params} label="Select Company" variant="outlined" error={!!errors.company_id} helperText={errors.company_id?.message} />
                )}
              />
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
                <TextField {...field} label="Description" variant="outlined" fullWidth multiline rows={3} />
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
  );
};

export default AddInventoryTypePage;
