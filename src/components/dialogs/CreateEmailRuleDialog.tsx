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
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  TextField, 
  MenuItem, 
  FormControl as MuiFormControl,
  Select as MuiSelect,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { EmailRule, TRIGGER_TYPES, TRIGGER_TO_OPTIONS, PERIOD_TYPES } from '@/types/emailRule';
import { roleService, ApiRole } from '@/services/roleService';

const emailRuleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  triggerType: z.enum(['PPM', 'AMC']),
  triggerTo: z.enum(['Supplier', 'Occupant Admin', 'Other']),
  role: z.array(z.string()).min(1, 'At least one role is required'),
  periodValue: z.number().min(1, 'Period value must be at least 1'),
  periodType: z.enum(['days', 'weeks', 'months']),
});

type EmailRuleFormData = z.infer<typeof emailRuleSchema>;

interface CreateEmailRuleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'>) => void;
}

export const CreateEmailRuleDialog: React.FC<CreateEmailRuleDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EmailRuleFormData>({
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
    }
  }, [open]);

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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
          <Controller
            name="ruleName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Rule Name"
                variant="outlined"
                fullWidth
                error={!!errors.ruleName}
                helperText={errors.ruleName?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="triggerType"
            control={control}
            render={({ field }) => (
              <MuiFormControl fullWidth variant="outlined" error={!!errors.triggerType}>
                <InputLabel shrink>Trigger Type</InputLabel>
                <MuiSelect
                  {...field}
                  label="Trigger Type"
                  notched
                >
                  {TRIGGER_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.triggerType && (
                  <FormHelperText>{errors.triggerType.message}</FormHelperText>
                )}
              </MuiFormControl>
            )}
          />

          <Controller
            name="triggerTo"
            control={control}
            render={({ field }) => (
              <MuiFormControl fullWidth variant="outlined" error={!!errors.triggerTo}>
                <InputLabel shrink>Trigger To</InputLabel>
                <MuiSelect
                  {...field}
                  label="Trigger To"
                  notched
                >
                  {TRIGGER_TO_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.triggerTo && (
                  <FormHelperText>{errors.triggerTo.message}</FormHelperText>
                )}
              </MuiFormControl>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <MuiFormControl fullWidth variant="outlined" error={!!errors.role}>
                <InputLabel shrink>Role</InputLabel>
                <MuiSelect
                  {...field}
                  multiple
                  label="Role"
                  notched
                  disabled={loadingRoles}
                  value={field.value || []}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(typeof value === 'string' ? value.split(',') : value);
                  }}
                  renderValue={(selected) => {
                    if (Array.isArray(selected)) {
                      return selected.join(', ');
                    }
                    return selected;
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
                {loadingRoles && (
                  <FormHelperText>Loading roles...</FormHelperText>
                )}
              </MuiFormControl>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="periodValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Period Value"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={!!errors.periodValue}
                  helperText={errors.periodValue?.message}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="periodType"
              control={control}
              render={({ field }) => (
                <MuiFormControl fullWidth variant="outlined" error={!!errors.periodType}>
                  <InputLabel shrink>Period Type</InputLabel>
                  <MuiSelect
                    {...field}
                    label="Period Type"
                    notched
                  >
                    {PERIOD_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                  {errors.periodType && (
                    <FormHelperText>{errors.periodType.message}</FormHelperText>
                  )}
                </MuiFormControl>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};