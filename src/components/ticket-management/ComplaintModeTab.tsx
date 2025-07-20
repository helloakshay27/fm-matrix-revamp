
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { EditComplaintModeModal } from './modals/EditComplaintModeModal';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const complaintModeSchema = z.object({
  complaintMode: z.string().min(1, 'Complaint mode is required'),
});

type ComplaintModeFormData = z.infer<typeof complaintModeSchema>;

interface ComplaintModeType {
  id: number;
  name: string;
  of_phase: string;
  society_id: number;
}

export const ComplaintModeTab: React.FC = () => {
  const [complaintModes, setComplaintModes] = useState<ComplaintModeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComplaintMode, setEditingComplaintMode] = useState<ComplaintModeType | null>(null);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });

  useEffect(() => {
    fetchComplaintModes();
  }, []);

  const fetchComplaintModes = async () => {
    setIsLoading(true);
    try {
      const data = await ticketManagementAPI.getComplaintModes();
      setComplaintModes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch complaint modes');
      console.error('Error fetching complaint modes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ComplaintModeFormData) => {
    setIsSubmitting(true);
    try {
      const complaintModeData = {
        name: data.complaintMode,
        of_phase: 'pms',
        society_id: '15', // Default society ID
      };

      await ticketManagementAPI.createComplaintMode(complaintModeData);
      toast.success('Complaint mode created successfully!');
      form.reset();
      fetchComplaintModes();
    } catch (error) {
      toast.error('Failed to create complaint mode');
      console.error('Error creating complaint mode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (complaintMode: ComplaintModeType) => {
    setEditingComplaintMode(complaintMode);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedComplaintMode: ComplaintModeType) => {
    setComplaintModes(complaintModes.map(mode => 
      mode.id === updatedComplaintMode.id ? updatedComplaintMode : mode
    ));
  };

  const handleDelete = (complaintMode: ComplaintModeType) => {
    setComplaintModes(complaintModes.filter(mode => mode.id !== complaintMode.id));
    toast.success('Complaint mode deleted successfully!');
  };

  const columns = [
    { key: 'id', label: 'Sr.No', sortable: true },
    { key: 'name', label: 'Complaint Mode', sortable: true },
  ];

  const renderCell = (item: ComplaintModeType, columnKey: string) => {
    return item[columnKey as keyof ComplaintModeType];
  };

  const renderActions = (item: ComplaintModeType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Complaint Mode</CardTitle>
        </CardHeader>
        <CardContent>
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

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Modes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading complaint modes...</div>
            </div>
          ) : (
            <EnhancedTable
              data={complaintModes}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="complaint-modes-table"
            />
          )}
        </CardContent>
      </Card>

      <EditComplaintModeModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        complaintMode={editingComplaintMode}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
