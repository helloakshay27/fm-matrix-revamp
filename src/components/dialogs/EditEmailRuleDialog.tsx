import React, { useEffect, useState } from 'react';
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
  Autocomplete,
  FormHelperText
} from '@mui/material';
import { EmailRule, TRIGGER_TYPES, TRIGGER_TO_OPTIONS, PERIOD_TYPES } from '@/types/emailRule';
import { roleService, ApiRole } from '@/services/roleService';
import { emailRuleService } from '@/services/emailRuleService';
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

interface EditEmailRuleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<EmailRule>) => void;
  emailRule: EmailRule | null;
  onSuccess?: () => void; // Add callback for successful API call
}

export const EditEmailRuleDialog: React.FC<EditEmailRuleDialogProps> = ({
  open,
  onClose,
  onSubmit,
  emailRule,
  onSuccess,
}) => {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EmailRuleFormData>({
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
    }
  }, [open]);

  useEffect(() => {
    if (emailRule && roles.length > 0) {
      // Convert comma-separated role names to role IDs
      const roleNames = emailRule.role ? emailRule.role.split(', ').map(r => r.trim()) : [];
      const roleIds = roleNames.map(name => {
        const role = roles.find(r => r.name === name);
        return role ? role.id.toString() : '';
      }).filter(Boolean);
      
      setSelectedRoleIds(roleIds);
      reset({
        ruleName: emailRule.ruleName,
        triggerType: emailRule.triggerType,
        triggerTo: emailRule.triggerTo,
        role: roleIds,
        periodValue: emailRule.periodValue,
        periodType: emailRule.periodType,
      });
    }
  }, [emailRule, roles, reset]);

  const handleSubmitForm = async (data: EmailRuleFormData) => {
    if (emailRule) {
      try {
        setIsSubmitting(true);
        
        // Map form data to API format
        const apiData = {
          ruleName: data.ruleName,
          triggerType: data.triggerType,
          triggerTo: data.triggerTo,
          roleIds: data.role, // Already an array of role IDs
          periodValue: data.periodValue,
          periodType: data.periodType,
        };

        await emailRuleService.updateEmailRule(emailRule.id, apiData);
        
        toast.success('Email rule updated successfully!');
        onClose();
        
        // Call the success callback to refresh the table
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Failed to update email rule:', error);
        toast.error('Failed to update email rule. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Edit Email Rule</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4 mt-4">
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
              <Autocomplete
                {...field}
                options={TRIGGER_TYPES}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Trigger Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.triggerType}
                    helperText={errors.triggerType?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                disablePortal
              />
            )}
          />

          <Controller
            name="triggerTo"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={TRIGGER_TO_OPTIONS}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Trigger To"
                    variant="outlined"
                    fullWidth
                    error={!!errors.triggerTo}
                    helperText={errors.triggerTo?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                disablePortal
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={roles}
                getOptionLabel={(option) => option.name}
                value={roles.filter(role => field.value?.includes(role.id.toString())) || []}
                onChange={(_, value) => field.onChange(value.map(role => role.id.toString()))}
                disabled={loadingRoles}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    variant="outlined"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message || (loadingRoles && 'Loading roles...')}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                disablePortal
              />
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
                <Autocomplete
                  {...field}
                  options={PERIOD_TYPES}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Period Type"
                      variant="outlined"
                      fullWidth
                      error={!!errors.periodType}
                      helperText={errors.periodType?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  disablePortal
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};