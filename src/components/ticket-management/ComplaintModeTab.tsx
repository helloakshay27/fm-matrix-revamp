import React, { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createComplaintMode,
  fetchComplaintModes,
  updateComplaintMode,
  deleteComplaintMode,
  fetchAccounts
} from '@/store/slices/complaintModeSlice';

const complaintModeSchema = z.object({
  complaintMode: z.string().min(1, 'Complaint mode is required'),
});

type ComplaintModeFormData = z.infer<typeof complaintModeSchema>;

export const ComplaintModeTab: React.FC = () => {
  const dispatch = useDispatch<any>();
 const complaintModesState = useSelector((state: any) => state.complaintModes) || {};
const { data: complaintModes = [], loading, fetchLoading, error, accounts } = complaintModesState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComplaintMode, setEditingComplaintMode] = useState<any>(null);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });


  // Fetch complaint modes on mount
  useEffect(() => {
    dispatch(fetchComplaintModes());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const currentSiteId =
    accounts && accounts.length > 0
      ? accounts[0].site_id || accounts[0].society_id || '111'
      : '111';

  // Handle create
 const handleSubmit = async (data: ComplaintModeFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        complaint_mode: {
          of_phase: 'pms',
          society_id: currentSiteId,
          name: data.complaintMode,
        },
      };
      const resultAction = await dispatch(createComplaintMode(payload));
      if (createComplaintMode.fulfilled.match(resultAction)) {
        toast.success('Complaint mode created successfully!');
        form.reset();
        dispatch(fetchComplaintModes());
      } else {
        toast.error(
          (resultAction.payload as any)?.message || 'Failed to create complaint mode'
        );
      }
    } catch (error) {
      toast.error('Failed to create complaint mode');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
 const handleEdit = (complaintMode: any) => {
    setEditingComplaintMode(complaintMode);
    setEditModalOpen(true);
  };

  // Handle update
   const handleUpdate = async (updatedComplaintMode: any) => {
    try {
      const payload = {
        id: updatedComplaintMode.id,
        name: updatedComplaintMode.name,
        of_phase: 'pms',
        society_id: currentSiteId,
      };
      const resultAction = await dispatch(updateComplaintMode(payload));
      if (updateComplaintMode.fulfilled.match(resultAction)) {
        toast.success('Complaint mode updated successfully!');
        dispatch(fetchComplaintModes());
      } else {
        toast.error(
          (resultAction.payload as any)?.message || 'Failed to update complaint mode'
        );
      }
    } catch {
      toast.error('Failed to update complaint mode');
    }
  };

  // Handle delete
  const handleDelete = async (complaintMode: any) => {
    try {
      const resultAction = await dispatch(deleteComplaintMode(complaintMode.id));
      if (deleteComplaintMode.fulfilled.match(resultAction)) {
        toast.success('Complaint mode deleted successfully!');
        dispatch(fetchComplaintModes());
      } else {
        toast.error(
          (resultAction.payload as any)?.message || 'Failed to delete complaint mode'
        );
      }
    } catch {
      toast.error('Failed to delete complaint mode');
    }
  };
  const getComplaintModeName = (id: number) => {
  return complaintModes?.find(mode => mode.id === id)?.name || 'Unknown Mode';
};

 const columns = [
  { key: 'srNo', label: 'Sr.No', sortable: true },
  { key: 'name', label: 'Complaint Mode', sortable: true },
];

 const renderCell = (item: any, columnKey: string) => {
  if (columnKey === 'srNo') return item.srNo || '';
  return item[columnKey];
};

  const renderActions = (item: any) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  console.log('complaintModes', complaintModes);

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
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </CardContent>
      </Card>

<Card>
  <CardHeader>
    <CardTitle>Complaint Modes</CardTitle>
  </CardHeader>
  <CardContent>
   <EnhancedTable
  data={complaintModes || []}
  columns={columns}
  renderCell={renderCell}
  renderActions={renderActions}
  storageKey="complaint-modes-table"
  loading={fetchLoading}
/>
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