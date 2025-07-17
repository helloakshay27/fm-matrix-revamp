import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { EmailRule, TRIGGER_TYPES, TRIGGER_TO_OPTIONS, PERIOD_TYPES } from '@/types/emailRule';
import { roleService, ApiRole } from '@/services/roleService';
import { Checkbox } from '@/components/ui/checkbox';

const emailRuleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  triggerType: z.enum(['PPM', 'AMC']),
  triggerTo: z.enum(['Supplier', 'Occupant Admin', 'Other']),
  role: z.array(z.string()).min(1, 'At least one role is required'),
  periodValue: z.number().min(1, 'Period value must be at least 1'),
  periodType: z.enum(['days', 'weeks', 'months']),
});

type EmailRuleFormData = z.infer<typeof emailRuleSchema>;

interface CreateEmailRuleDialogNewProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'>) => void;
}

export const CreateEmailRuleDialogNew: React.FC<CreateEmailRuleDialogNewProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<EmailRuleFormData>({
    resolver: zodResolver(emailRuleSchema),
    defaultValues: {
      ruleName: '',
      triggerType: 'PPM',
      triggerTo: 'Supplier',
      role: [],
      periodValue: 1,
      periodType: 'days',
    },
  });

  useEffect(() => {
    if (open) {
      const fetchRoles = async () => {
        try {
          setLoadingRoles(true);
          const roleData = await roleService.fetchRoles();
          setRoles(roleData);
        } catch (error) {
          console.error('Failed to fetch roles:', error);
        } finally {
          setLoadingRoles(false);
        }
      };

      fetchRoles();
      setSelectedRoles([]);
    }
  }, [open]);

  const handleRoleToggle = (roleName: string, checked: boolean) => {
    let newSelectedRoles;
    if (checked) {
      newSelectedRoles = [...selectedRoles, roleName];
    } else {
      newSelectedRoles = selectedRoles.filter(role => role !== roleName);
    }
    setSelectedRoles(newSelectedRoles);
    setValue('role', newSelectedRoles);
  };

  const onSubmitForm = (data: EmailRuleFormData) => {
    const submissionData: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'> = {
      ruleName: data.ruleName,
      triggerType: data.triggerType,
      triggerTo: data.triggerTo,
      role: data.role.join(', '), // Convert array to comma-separated string
      periodValue: data.periodValue,
      periodType: data.periodType,
    };
    
    onSubmit(submissionData);
    reset();
    setSelectedRoles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Create Email Rule</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 mt-4">
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Controller
              name="ruleName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="ruleName"
                  placeholder="Enter rule name"
                  className={errors.ruleName ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.ruleName && (
              <p className="text-sm text-red-500">{errors.ruleName.message}</p>
            )}
          </div>

          {/* Trigger Type */}
          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <Controller
              name="triggerType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.triggerType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.triggerType && (
              <p className="text-sm text-red-500">{errors.triggerType.message}</p>
            )}
          </div>

          {/* Trigger To */}
          <div className="space-y-2">
            <Label>Trigger To</Label>
            <Controller
              name="triggerTo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.triggerTo ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select trigger to" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TO_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.triggerTo && (
              <p className="text-sm text-red-500">{errors.triggerTo.message}</p>
            )}
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <Label>Roles (Select multiple)</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
              {loadingRoles ? (
                <p className="text-sm text-gray-500">Loading roles...</p>
              ) : (
                roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.name)}
                      onCheckedChange={(checked) => handleRoleToggle(role.name, checked as boolean)}
                    />
                    <Label htmlFor={`role-${role.id}`} className="text-sm">
                      {role.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
            {selectedRoles.length > 0 && (
              <p className="text-sm text-gray-600">Selected: {selectedRoles.join(', ')}</p>
            )}
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Period Value and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodValue">Period Value</Label>
              <Controller
                name="periodValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="periodValue"
                    type="number"
                    min="1"
                    placeholder="Enter value"
                    className={errors.periodValue ? 'border-red-500' : ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                )}
              />
              {errors.periodValue && (
                <p className="text-sm text-red-500">{errors.periodValue.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Period Type</Label>
              <Controller
                name="periodType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.periodType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIOD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.periodType && (
                <p className="text-sm text-red-500">{errors.periodType.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Rule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};