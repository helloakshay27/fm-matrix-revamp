import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FormGroup, FormField as SchemaField } from '@/config/assetFormSchema';
import { DynamicField } from './DynamicField';
import { CustomFieldModal } from './CustomFieldModal';

interface CustomField {
  field_name: string;
  field_label: string;
  field_value: string;
  input_type: string;
  group_name: string;
  field_description: string;
  _destroy: boolean;
}

interface DynamicFormGroupProps {
  group: FormGroup;
  values: Record<string, any>;
  customFields: CustomField[];
  errors: Record<string, string>;
  onChange: (fieldName: string, value: any) => void;
  onCustomFieldAdd: (field: CustomField) => void;
  onCustomFieldRemove: (fieldName: string) => void;
  onCustomFieldChange: (fieldName: string, value: any) => void;
}

export const DynamicFormGroup: React.FC<DynamicFormGroupProps> = ({
  group,
  values,
  customFields,
  errors,
  onChange,
  onCustomFieldAdd,
  onCustomFieldRemove,
  onCustomFieldChange
}) => {
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);

  const handleCustomFieldAdd = (field: any) => {
    const customField: CustomField = {
      ...field,
      group_name: group.group_name,
      field_description: field.field_label,
      _destroy: false
    };
    onCustomFieldAdd(customField);
  };

  const groupCustomFields = customFields.filter(
    field => field.group_name === group.group_name && !field._destroy
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{group.group_label}</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCustomFieldModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Custom Field
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schema-defined fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {group.fields.map((field: SchemaField) => (
            <DynamicField
              key={field.field_name}
              field={field}
              value={values[field.field_name]}
              onChange={(value) => onChange(field.field_name, value)}
              error={errors[field.field_name]}
            />
          ))}
        </div>

        {/* Custom fields */}
        {groupCustomFields.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Custom Fields</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupCustomFields.map((customField) => (
                <div key={customField.field_name} className="relative">
                  <DynamicField
                    field={{
                      group_name: customField.group_name,
                      field_name: customField.field_name,
                      field_label: customField.field_label,
                      input_type: customField.input_type as any,
                      required: false
                    }}
                    value={customField.field_value}
                    onChange={(value) => onCustomFieldChange(customField.field_name, value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                    onClick={() => onCustomFieldRemove(customField.field_name)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CustomFieldModal
        isOpen={showCustomFieldModal}
        onClose={() => setShowCustomFieldModal(false)}
        onAdd={handleCustomFieldAdd}
        groupName={group.group_label}
      />
    </Card>
  );
};