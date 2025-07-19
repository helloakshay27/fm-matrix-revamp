import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomField {
  field_name: string;
  field_label: string;
  field_value: string;
  input_type: string;
}

interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (field: CustomField) => void;
  groupName: string;
}

export const CustomFieldModal: React.FC<CustomFieldModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  groupName
}) => {
  const [fieldData, setFieldData] = useState<CustomField>({
    field_name: '',
    field_label: '',
    field_value: '',
    input_type: 'text'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldData.field_name && fieldData.field_label) {
      onAdd(fieldData);
      setFieldData({
        field_name: '',
        field_label: '',
        field_value: '',
        input_type: 'text'
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFieldData({
      field_name: '',
      field_label: '',
      field_value: '',
      input_type: 'text'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Field to {groupName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field_label">Field Label *</Label>
            <Input
              id="field_label"
              value={fieldData.field_label}
              onChange={(e) => setFieldData({ ...fieldData, field_label: e.target.value })}
              placeholder="Enter field label"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_name">Field Key *</Label>
            <Input
              id="field_name"
              value={fieldData.field_name}
              onChange={(e) => setFieldData({ 
                ...fieldData, 
                field_name: e.target.value.toLowerCase().replace(/\s+/g, '_') 
              })}
              placeholder="Enter field key (e.g., custom_field_1)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input_type">Field Type</Label>
            <Select 
              value={fieldData.input_type} 
              onValueChange={(value) => setFieldData({ ...fieldData, input_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_value">Default Value</Label>
            <Input
              id="field_value"
              value={fieldData.field_value}
              onChange={(e) => setFieldData({ ...fieldData, field_value: e.target.value })}
              placeholder="Enter default value (optional)"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Field</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};