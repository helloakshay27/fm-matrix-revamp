import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'sonner';
import { communicationTemplateService } from '@/services/communicationTemplateService';

interface TemplateFormValues {
  identifier: string;
  identifier_action: string;
  body: string;
}

const AddCommunicationTemplatePage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    defaultValues: {
      identifier: '',
      identifier_action: '',
      body: '',
    },
  });

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const payload = {
        communication_template: {
          ...data,
        },
      };
      await communicationTemplateService.createCommunicationTemplate(payload);
      toast.success('Communication template created successfully');
      navigate('/master/communication-template');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD COMMUNICATION TEMPLATE</h1>

        <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="identifier"
                control={control}
                rules={{ required: 'Dropdown is required' }}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined" error={!!errors.identifier}>
                    <InputLabel shrink>
                      Dropdown <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Select
                      {...field}
                      label="Dropdown"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Select an option</MenuItem>
                      <MenuItem value="Root Cause Analysis">Root Cause Analysis</MenuItem>
                      <MenuItem value="Preventive Action">Preventive Action</MenuItem>
                      <MenuItem value="Short-term Impact">Short-term Impact</MenuItem>
                      <MenuItem value="Corrective Action">Corrective Action</MenuItem>
                      <MenuItem value="Long-term Impact">Long-term Impact</MenuItem>
                      <MenuItem value="Internal">Internal</MenuItem>
                      <MenuItem value="Customer">Customer</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="identifier_action"
                control={control}
                rules={{ required: 'Field value is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        Field Value <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter field value"
                    variant="outlined"
                    fullWidth
                    error={!!errors.identifier_action}
                    helperText={errors.identifier_action?.message}
                  />
                )}
              />
            </div>
            <div className="mt-4">
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    placeholder="Enter Description"
                    fullWidth
                    multiline
                    minRows={4}
                    sx={{
                      mb: 0,
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

export default AddCommunicationTemplatePage;
