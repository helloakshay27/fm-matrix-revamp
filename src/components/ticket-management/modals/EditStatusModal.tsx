import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

const statusSchema = z.object({
  name: z.string().min(1, 'Status name is required'),
  fixedState: z.string().min(1, 'Fixed state is required'),
  colorCode: z.string().min(1, 'Color code is required'),
  position: z.number().min(1, 'Order must be positive'),
  email: z.boolean().default(false),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface StatusType {
  id: number;
  name: string;
  fixed_state: string;
  color_code: string;
  position: number;
  email: boolean;
}

interface EditStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: StatusType | null;
  onUpdate: () => void;
}

const fixedStates = [
  { value: 'closed', label: 'Closed' },
  { value: 'reopen', label: 'Reopen' },
  { value: 'complete', label: 'Complete' },
];

export const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onOpenChange,
  status,
  onUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      name: '',
      fixedState: '',
      colorCode: '#000000',
      position: 1,
      email: false,
    },
  });

  useEffect(() => {
    const loadStatusData = async () => {
      if (status && open) {
        setIsLoading(true);
        try {
          // Fetch the specific status data from the API
          const response = await fetch(getFullUrl('/pms/admin/complaint_statuses.json'), {
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch status data');
          }

          const statusData = await response.json();
          const currentStatus = statusData.find((s: any) => s.id === status.id);
          
          if (currentStatus) {
            form.reset({
              name: currentStatus.name || status.name,
              fixedState: currentStatus.fixed_state || status.fixed_state,
              colorCode: currentStatus.color_code || status.color_code,
              position: currentStatus.position || status.position,
              email: currentStatus.email || status.email || false,
            });
          } else {
            // Fallback to provided status data
            form.reset({
              name: status.name,
              fixedState: status.fixed_state,
              colorCode: status.color_code,
              position: status.position,
              email: status.email || false,
            });
          }
        } catch (error) {
          console.error('Error loading status data:', error);
          // Fallback to provided status data
          form.reset({
            name: status.name,
            fixedState: status.fixed_state,
            colorCode: status.color_code,
            position: status.position,
            email: status.email || false,
          });
          toast.error('Failed to load status details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadStatusData();
  }, [status, open, form]);

  const handleSubmit = async (data: StatusFormData) => {
    if (!status) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('id', status.id.toString());
      formData.append('position', data.position.toString());
      formData.append('name', data.name);
      formData.append('color_code', data.colorCode);
      formData.append('fixed_state', data.fixedState);
      formData.append('email', data.email ? '1' : '0');
      formData.append('active', '1');

      const response = await fetch(getFullUrl('/pms/admin/modify_complaint_status.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading status data...</div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter status name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter order"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fixedState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed State<span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fixed state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fixedStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
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
                name="colorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          placeholder="#000000"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Email Notification</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for this status
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLoading}
                  className="bg-[#C72030] hover:bg-[#C72030]/90"
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
