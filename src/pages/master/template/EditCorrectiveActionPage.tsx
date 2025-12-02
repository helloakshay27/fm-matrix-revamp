import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { toast } from 'sonner';
import { communicationTemplateService } from '@/services/communicationTemplateService';

interface TemplateFormValues {
  identifier_action: string;
  body: string;
}

const EditCorrectiveActionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const templateId = Number(id);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    defaultValues: {
      identifier_action: '',
      body: '',
    },
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const data = await communicationTemplateService.getCommunicationTemplateById(templateId);
        reset({
          identifier_action: data.identifier_action || '',
          body: data.body || '',
        });
      } catch (error) {
        toast.error('Failed to fetch template details');
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, reset]);

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const payload = {
        communication_template: {
          identifier: 'Corrective Action',
          identifier_action: data.identifier_action,
          body: data.body,
        },
      };
      await communicationTemplateService.updateCommunicationTemplate(templateId, payload);
      toast.success('Corrective Action template updated successfully');
      navigate('/master/template/corrective-action');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update template');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT CORRECTIVE ACTION TEMPLATE</h1>

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

export default EditCorrectiveActionPage;
