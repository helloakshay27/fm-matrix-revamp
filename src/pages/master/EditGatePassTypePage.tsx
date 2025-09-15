import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { toast } from 'sonner';
import { gatePassTypeService } from '@/services/gatePassTypeService';

interface GatePassTypeFormValues {
  name: string;
  value: string;
  // active: boolean;
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
        // Map API response to form fields
        reset({
          name: data.name || '',
          value: data.value || '',
          active: data.active === true,
        });
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
   <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Gate Pass Type</h1>
      <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
        {/* <Controller
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
        /> */}
        </div>
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
      </div>
    </div>
  );
};

export default EditGatePassTypePage;
