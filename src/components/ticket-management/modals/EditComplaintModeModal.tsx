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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const complaintModeSchema = z.object({
  complaintMode: z.string().min(1, 'Complaint mode is required'),
});

type ComplaintModeFormData = z.infer<typeof complaintModeSchema>;

interface ComplaintModeType {
  id: string;
  srNo: number;
  complaintMode: string;
}

interface EditComplaintModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintMode: ComplaintModeType | null;
  onUpdate: (complaintMode: ComplaintModeType) => void;
}

export const EditComplaintModeModal: React.FC<EditComplaintModeModalProps> = ({
  open,
  onOpenChange,
  complaintMode,
  onUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });

  useEffect(() => {
    if (complaintMode && open) {
      form.reset({
        complaintMode: complaintMode.complaintMode,
      });
    }
  }, [complaintMode, open, form]);

  const handleSubmit = async (data: ComplaintModeFormData) => {
    if (!complaintMode) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedComplaintMode: ComplaintModeType = {
        ...complaintMode,
        complaintMode: data.complaintMode,
      };

      onUpdate(updatedComplaintMode);
      toast.success('Complaint mode updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update complaint mode');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Complaint Mode</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="complaintMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complaint Mode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter complaint mode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};