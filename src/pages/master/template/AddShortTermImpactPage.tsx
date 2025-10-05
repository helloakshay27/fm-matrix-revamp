import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { toast } from 'sonner';
import { communicationTemplateService } from '@/services/communicationTemplateService';

interface TemplateFormValues {
  identifier_action: string;
  body: string;
}

const AddShortTermImpactPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    defaultValues: {
      identifier_action: '',
      body: '',
    },
  });

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const payload = {
        communication_template: {
          identifier: 'Short-term Impact',
          identifier_action: data.identifier_action,
          body: data.body,
        },
      };
      await communicationTemplateService.createCommunicationTemplate(payload);
      toast.success('Short-term Impact template created successfully');
      navigate('/master/template/short-term-impact');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create template');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD SHORT-TERM IMPACT TEMPLATE</h1>

        <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
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

export default AddShortTermImpactPage;
