import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
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

const EditInventorySubTypePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const inventorySubTypeId = Number(id);
  const [inventoryTypes, setInventoryTypes] = useState<DropdownOption[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventorySubTypeFormValues>();

  useEffect(() => {
    inventoryTypeService.getInventoryTypes().then(data => {
        setInventoryTypes(data.map(d => ({ id: d.id, name: d.name })));
    }).catch(() => toast.error("Failed to load inventory types."));

    if (inventorySubTypeId) {
      inventorySubTypeService.getInventorySubTypeById(inventorySubTypeId).then(data => {
        reset(data);
      });
    }
  }, [inventorySubTypeId, reset]);

  const onSubmit = async (data: InventorySubTypeFormValues) => {
    try {
      const payload = {
        pms_inventory_sub_type: { ...data },
      };
      await inventorySubTypeService.updateInventorySubType(inventorySubTypeId, payload);
      toast.success("Inventory sub-type updated successfully");
      navigate("/master/inventory-sub-type");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Inventory Sub-Type</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField {...field} label="Sub-Type Name" variant="outlined" fullWidth error={!!errors.name} helperText={errors.name?.message} />
            )}
          />
          <Controller
            name="material_sub_type_code"
            control={control}
            rules={{ required: 'Code is required' }}
            render={({ field }) => (
              <TextField {...field} label="Sub-Type Code" variant="outlined" fullWidth error={!!errors.material_sub_type_code} helperText={errors.material_sub_type_code?.message} />
            )}
          />
          <Controller
            name="pms_inventory_type_id"
            control={control}
            rules={{ required: 'Inventory Type is required' }}
            render={({ field }) => (
              <Autocomplete
                options={inventoryTypes}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, data) => field.onChange(data ? data.id : null)}
                value={inventoryTypes.find((c) => c.id === field.value) || null}
                renderInput={(params: TextFieldProps) => (
                  <TextField {...params} label="Select Inventory Type" variant="outlined" error={!!errors.pms_inventory_type_id} helperText={errors.pms_inventory_type_id?.message} />
                )}
              />
            )}
          />
           <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={[{ label: 'Active', value: true }, { label: 'Inactive', value: false }]}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  onChange={(_, data) => field.onChange(data ? data.value : false)}
                  value={field.value ? { label: 'Active', value: true } : { label: 'Inactive', value: false }}
                  renderInput={(params: TextFieldProps) => (
                    <TextField {...params} label="Status" variant="outlined" />
                  )}
                />
              )}
            />
          <div className="md:col-span-2">
            <Controller
              name="description"
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

export default EditInventorySubTypePage;
