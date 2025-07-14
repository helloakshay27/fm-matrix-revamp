
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { EmailRule, TRIGGER_TYPES, TRIGGER_TO_OPTIONS, PERIOD_TYPES } from '@/types/emailRule';

const emailRuleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  triggerType: z.enum(['PPM', 'AMC']),
  triggerTo: z.enum(['Supplier', 'Occupant Admin', 'Other']),
  role: z.string().min(1, 'Role is required'),
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
  const form = useForm<EmailRuleFormData>({
    resolver: zodResolver(emailRuleSchema),
    defaultValues: {
      ruleName: '',
      triggerType: 'PPM',
      triggerTo: 'Supplier',
      role: '',
      periodValue: 1,
      periodType: 'days',
    },
  });

  const handleSubmit = (data: EmailRuleFormData) => {
    // Ensure all required fields are present and typed correctly
    const submissionData: Omit<EmailRule, 'id' | 'srNo' | 'createdOn' | 'createdBy' | 'active'> = {
      ruleName: data.ruleName,
      triggerType: data.triggerType,
      triggerTo: data.triggerTo,
      role: data.role,
      periodValue: data.periodValue,
      periodType: data.periodType,
    };
    
    onSubmit(submissionData);
    form.reset();
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ruleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Rule Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Trigger Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRIGGER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Trigger To" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRIGGER_TO_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Period Value"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Period Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PERIOD_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
