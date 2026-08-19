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
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { EmailRule, TRIGGER_TYPES, PERIOD_TYPES } from '@/types/emailRule';
import { roleService, ApiRole } from '@/services/roleService';
import { emailRuleService } from '@/services/emailRuleService';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const emailRuleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  triggerType: z.enum(['PPM', 'AMC','Asset Breakdown', 'Asset InUse', 'Asset Breakdown Reminder']),
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

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

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

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<EmailRuleFormData>({
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

      const roleNames = data.role
        .map(id => roles.find(r => r.id.toString() === id)?.name)
        .filter(Boolean)
        .join(', ');

      const onSubmitData = {
        ruleName: data.ruleName,
        triggerType: data.triggerType,
        triggerTo: data.triggerTo,
        role: roleNames || 'N/A',
        periodValue: data.periodValue,
        periodType: data.periodType,
      };

      try {
        await emailRuleService.createEmailRule(apiData, roleNames);
        toast.success('Email rule created successfully!');
      } catch (apiError) {
        console.warn('API rule creation failed, saving locally:', apiError);
        emailRuleService.saveRuleLocally(apiData, undefined);
        toast.success('Email rule created successfully (saved locally)!');
      }

      // Call the onSubmit prop to immediately update local state
      if (onSubmit) {
        onSubmit(onSubmitData);
      }
      
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
    // modal={false} lets portaled MUI Select menus receive clicks/scroll
    // (Radix modal mode otherwise traps pointer events outside DialogContent).
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="w-[95vw] max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col bg-white"
        onPointerDownOutside={(e) => {
          // Keep dialog open when interacting with the MUI select menu
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
            e.preventDefault();
          }
        }}
      >
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
            <Controller
              name="ruleName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="ruleName"
                  label="Rule Name"
                  placeholder="Enter rule name"
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  error={!!errors.ruleName}
                  helperText={errors.ruleName?.message}
                />
              )}
            />
          </div>

          {/* Trigger Type */}
          <div className="space-y-1">
            <FormControl fullWidth variant="outlined" error={!!errors.triggerType}>
              <InputLabel id="trigger-type-label">Trigger Type</InputLabel>
              <Controller
                name="triggerType"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    {...field}
                    labelId="trigger-type-label"
                    label="Trigger Type"
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    {TRIGGER_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                )}
              />
            </FormControl>
            {errors.triggerType && (
              <p className="text-sm text-red-500">{errors.triggerType.message}</p>
            )}
          </div>

          {/* Trigger To */}
          <div className="space-y-1">
            <FormControl fullWidth variant="outlined" error={!!errors.triggerTo}>
              <InputLabel id="trigger-to-label">Trigger To</InputLabel>
              <Controller
                name="triggerTo"
                control={control}
                render={({ field }) => (
                  <MuiSelect
                    {...field}
                    labelId="trigger-to-label"
                    label="Trigger To"
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    {[
                      ['Site Admin', 'Site Admin'],
                      ['Occupant Admin', 'Occupant Admin'],
                      ['Supplier', 'Supplier']
                    ].map(([label, value]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                )}
              />
            </FormControl>
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
              <Controller
                name="periodValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="periodValue"
                    label="Period Value"
                    type="number"
                    placeholder="Enter value"
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    error={!!errors.periodValue}
                    helperText={errors.periodValue?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                )}
              />
            </div>
            
            <div className="space-y-1">
              <FormControl fullWidth variant="outlined" error={!!errors.periodType}>
                <InputLabel id="period-type-label">Period Type</InputLabel>
                <Controller
                  name="periodType"
                  control={control}
                  render={({ field }) => (
                    <MuiSelect
                      {...field}
                      labelId="period-type-label"
                      label="Period Type"
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      {PERIOD_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  )}
                />
              </FormControl>
              {errors.periodType && (
                <p className="text-sm text-red-500">{errors.periodType.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-brand text-brand px-8">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand hover:bg-brand-hover text-white px-8">
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
