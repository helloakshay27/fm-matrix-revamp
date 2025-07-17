import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { EmailRule, TRIGGER_TYPES, PERIOD_TYPES } from '@/types/emailRule';
import { roleService, ApiRole } from '@/services/roleService';
import { emailRuleService } from '@/services/emailRuleService';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const emailRuleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  triggerType: z.enum(['PPM', 'AMC']),
  triggerTo: z.enum(['Site Admin', 'Occupant Admin', 'Supplier']),
  role: z.array(z.string()).min(1, 'At least one role is required'),
  periodValue: z.number().min(1, 'Period value must be at least 1'),
  periodType: z.enum(['days', 'weeks', 'months']),
});

type EmailRuleFormData = z.infer<typeof emailRuleSchema>;

interface CreateEmailRuleDialogNewProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'>) => void;
  onSuccess?: () => void; // Add callback for successful API call
}

export const CreateEmailRuleDialogNew: React.FC<CreateEmailRuleDialogNewProps> = ({
  open,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<EmailRuleFormData>({
    resolver: zodResolver(emailRuleSchema),
    defaultValues: {
      ruleName: '',
      triggerType: 'PPM',
      triggerTo: 'Site Admin',
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

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    let newSelectedRoles;
    if (checked) {
      newSelectedRoles = [...selectedRoles, roleId];
    } else {
      newSelectedRoles = selectedRoles.filter(id => id !== roleId);
    }
    setSelectedRoles(newSelectedRoles);
    setValue('role', newSelectedRoles);
  };

  const onSubmitForm = async (data: EmailRuleFormData) => {
    try {
      setIsSubmitting(true);
      
      // Map form data to API format
      const apiData = {
        ruleName: data.ruleName,
        triggerType: data.triggerType,
        triggerTo: data.triggerTo,
        roleIds: data.role, // Already an array of role IDs from selected roles
        periodValue: data.periodValue,
        periodType: data.periodType,
      };

      await emailRuleService.createEmailRule(apiData);
      
      toast.success('Email rule created successfully!');
      reset();
      setSelectedRoles([]);
      onClose();
      
      // Call the success callback to refresh the table
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create email rule:', error);
      toast.error('Failed to create email rule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Email Rule</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Configure email notification rules for maintenance schedules.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3 p-1">
          {/* Rule Name */}
          <div className="space-y-1">
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
          <div className="space-y-1">
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
          <div className="space-y-1">
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
                    {[
                      ['Site Admin', 'Site Admin'],
                      ['Occupant Admin', 'Occupant Admin'], 
                      ['Supplier', 'Supplier']
                    ].map(([label, value]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
          <div className="space-y-1">
            <Label>Roles (Select multiple)</Label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1">
              {loadingRoles ? (
                <p className="text-sm text-gray-500">Loading roles...</p>
              ) : (
                roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id.toString())}
                      onCheckedChange={(checked) => handleRoleToggle(role.id.toString(), checked as boolean)}
                    />
                    <Label htmlFor={`role-${role.id}`} className="text-sm">
                      {role.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
            {selectedRoles.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected: {selectedRoles.map(id => roles.find(r => r.id.toString() === id)?.name).filter(Boolean).join(', ')}
              </p>
            )}
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Period Value and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
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
            
            <div className="space-y-1">
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

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};