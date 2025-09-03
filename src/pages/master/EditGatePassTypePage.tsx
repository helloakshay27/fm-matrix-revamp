import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
import { toast } from 'sonner';
import { gatePassTypeService } from '@/services/gatePassTypeService';

interface GatePassTypeFormValues {
  name: string;
  value: string;
  active: boolean;
}

const EditGatePassTypePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const gatePassTypeId = Number(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GatePassTypeFormValues>();

  useEffect(() => {
    if (gatePassTypeId) {
      gatePassTypeService.getGatePassTypeById(gatePassTypeId).then(data => {
        reset(data);
      });
    }
  }, [gatePassTypeId, reset]);

  const onSubmit = async (data: GatePassTypeFormValues) => {
    try {
      const payload = {
        gate_pass_type: {
          ...data,
        },
      };
      await gatePassTypeService.updateGatePassType(gatePassTypeId, payload);
      toast.success("Gate pass type updated successfully");
      navigate("/master/gate-pass-type");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Gate Pass Type</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="value"
          control={control}
          rules={{ required: 'Value is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Value"
              variant="outlined"
              fullWidth
              error={!!errors.value}
              helperText={errors.value?.message}
            />
          )}
        />
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={[
                { label: 'Active', value: true },
                { label: 'Inactive', value: false },
              ]}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onChange={(_, data) => field.onChange(data ? data.value : null)}
              value={field.value ? { label: 'Active', value: true } : { label: 'Inactive', value: false }}
              renderInput={(params: TextFieldProps) => (
                <TextField
                  {...params}
                  label="Status"
                  variant="outlined"
                />
              )}
            />
          )}
        />
        <div className="flex justify-center space-x-4 pt-4">
          <Button type="submit" className="w-32">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-32"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditGatePassTypePage;
