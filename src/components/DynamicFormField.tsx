
import React from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FieldConfig } from '@/config/assetFieldsConfig';

interface DynamicFormFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'select':
        return (
          <EnhancedSelect
            label={field.label}
            value={value}
            onChange={(e) => onChange(e.target.value as string)}
            options={field.options || []}
            placeholder={field.placeholder || `Select ${field.label}`}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <div>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              className="mt-1"
            />
          </div>
        );
      case 'date':
        return (
          <EnhancedInput
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
      case 'number':
        return (
          <EnhancedInput
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label}`}
            required={field.required}
          />
        );
      default:
        return (
          <EnhancedInput
            label={field.label}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label}`}
            required={field.required}
          />
        );
    }
  };

  return <div className="w-full">{renderField()}</div>;
};
