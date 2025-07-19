import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { getAssetFormSchema, PMS_ASSET_FIELDS, FormGroup } from '@/config/assetFormSchema';
import { DynamicFormGroup } from './DynamicFormGroup';

interface CustomField {
  field_name: string;
  field_label: string;
  field_value: string;
  input_type: string;
  group_name: string;
  field_description: string;
  _destroy: boolean;
}

interface DynamicAssetFormProps {
  assetType?: string;
  onSuccess?: () => void;
}

export const DynamicAssetForm: React.FC<DynamicAssetFormProps> = ({
  assetType = 'default',
  onSuccess
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schema, setSchema] = useState<FormGroup[]>([]);

  useEffect(() => {
    const formSchema = getAssetFormSchema(assetType);
    setSchema(formSchema);
  }, [assetType]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleCustomFieldAdd = (field: CustomField) => {
    setCustomFields(prev => [...prev, field]);
  };

  const handleCustomFieldRemove = (fieldName: string) => {
    setCustomFields(prev => 
      prev.map(field => 
        field.field_name === fieldName 
          ? { ...field, _destroy: true }
          : field
      )
    );
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setCustomFields(prev =>
      prev.map(field =>
        field.field_name === fieldName
          ? { ...field, field_value: value }
          : field
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required schema fields
    schema.forEach(group => {
      group.fields.forEach(field => {
        if (field.required && !formData[field.field_name]) {
          newErrors[field.field_name] = `${field.field_label} is required`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const pms_asset: Record<string, any> = {};
    const extra_fields_attributes: any[] = [];

    // Process form data
    Object.entries(formData).forEach(([key, value]) => {
      if (PMS_ASSET_FIELDS.includes(key)) {
        pms_asset[key] = value;
      } else {
        // Find the group for this field
        const group = schema.find(g => 
          g.fields.some(f => f.field_name === key)
        );
        
        if (group && value !== '' && value !== null && value !== undefined) {
          extra_fields_attributes.push({
            field_name: key,
            field_value: value,
            group_name: group.group_name,
            field_description: group.fields.find(f => f.field_name === key)?.field_label || key,
            _destroy: false
          });
        }
      }
    });

    // Add custom fields
    customFields.forEach(field => {
      if (!field._destroy && field.field_value !== '' && field.field_value !== null) {
        extra_fields_attributes.push({
          field_name: field.field_name,
          field_value: field.field_value,
          group_name: field.group_name,
          field_description: field.field_description,
          _destroy: false
        });
      }
    });

    return {
      pms_asset,
      extra_fields_attributes
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload();
      
      console.log('Submitting payload:', payload);
      
      const response = await apiClient.post('/pms/assets.json', payload);
      
      toast({
        title: "Success",
        description: "Asset created successfully",
      });

      // Reset form
      setFormData({});
      setCustomFields([]);
      setErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating asset:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create asset",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.map((group) => (
        <DynamicFormGroup
          key={group.group_name}
          group={group}
          values={formData}
          customFields={customFields}
          errors={errors}
          onChange={handleFieldChange}
          onCustomFieldAdd={handleCustomFieldAdd}
          onCustomFieldRemove={handleCustomFieldRemove}
          onCustomFieldChange={handleCustomFieldChange}
        />
      ))}

      <div className="flex justify-end gap-4 pt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setFormData({});
            setCustomFields([]);
            setErrors({});
          }}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? 'Creating...' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
};