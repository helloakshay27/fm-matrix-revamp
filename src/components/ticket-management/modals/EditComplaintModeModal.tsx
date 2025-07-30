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
import { fetchComplaintModeById, updateComplaintMode, ComplaintMode } from '@/services/complaintModeAPI';

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiComplaintMode, setApiComplaintMode] = useState<ComplaintMode | null>(null);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });

  useEffect(() => {
    const loadComplaintModeData = async () => {
      if (complaintMode && open) {
        setIsLoading(true);
        try {
          // Fetch the complaint mode data from API using the ID
          const complaintModeId = parseInt(complaintMode.id);
          const apiData = await fetchComplaintModeById(complaintModeId);
          
          if (apiData) {
            setApiComplaintMode(apiData);
            // Reset form with the API data
            form.reset({
              complaintMode: apiData.name,
            });
          } else {
            // Fallback to the passed data if API call fails
            form.reset({
              complaintMode: complaintMode.complaintMode,
            });
          }
        } catch (error) {
          console.error('Error loading complaint mode:', error);
          // Fallback to the passed data if API call fails
          form.reset({
            complaintMode: complaintMode.complaintMode,
          });
          toast.error('Failed to load complaint mode details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadComplaintModeData();
  }, [complaintMode, open, form]);

  const handleSubmit = async (data: ComplaintModeFormData) => {
    if (!complaintMode) return;

    setIsSubmitting(true);
    try {
      // Call the update API
      const complaintModeId = parseInt(complaintMode.id);
      const updatedApiData = await updateComplaintMode(complaintModeId, data.complaintMode);
      
      // Update the local state with the updated data
      const updatedComplaintMode: ComplaintModeType = {
        ...complaintMode,
        complaintMode: data.complaintMode,
      };

      onUpdate(updatedComplaintMode);
      toast.success('Complaint mode updated successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating complaint mode:', error);
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
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-gray-500">Loading complaint mode data...</div>
              </div>
            ) : (
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
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};