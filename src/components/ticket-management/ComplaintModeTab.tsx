
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
import { ticketManagementAPI, UserAccountResponse } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';
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


interface ComplaintModeType {
  id: number;
  name: string;
  of_phase: string;
  society_id: number;
}

export const ComplaintModeTab: React.FC = () => {
  const dispatch = useDispatch<any>();
  const complaintModesState = useSelector((state: any) => state.complaintModes) || {};
  const { data: complaintModess = [], loading, fetchLoading, error, accounts } = complaintModesState;
  const [complaintModes, setComplaintModes] = useState<ComplaintModeType[]>(complaintModess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingComplaintMode, setEditingComplaintMode] = useState<any>(null);
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });

  useEffect(() => {
    fetchComplaintModes();
    loadUserAccount();
  }, []);

  const loadUserAccount = async () => {
    try {
      const account = await ticketManagementAPI.getUserAccount();
      setUserAccount(account);
    } catch (error) {
      console.error('Error loading user account:', error);
      toast.error('Failed to load user account');
    }
  };

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
    if (!userAccount?.company_id) {
      toast.error('Unable to determine company ID. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const complaintModeData = {
        name: data.complaintMode,
        of_phase: 'pms',
        society_id: userAccount.company_id.toString(),
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

  // Handle edit
  const handleEdit = (complaintMode: any) => {
    setEditingComplaintMode(complaintMode);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedComplaintMode: ComplaintModeType) => {
    setComplaintModes(complaintModes.map(mode => 
      mode.id === updatedComplaintMode.id ? updatedComplaintMode : mode
    ));
  };

  const handleDelete = async (complaintMode: ComplaintModeType) => {
    if (!confirm('Are you sure you want to delete this complaint mode?')) {
      return;
    }
    
    try {
      await ticketManagementAPI.deleteComplaintMode(complaintMode.id);
      setComplaintModes(complaintModes.filter(mode => mode.id !== complaintMode.id));
      toast.success('Complaint mode deleted successfully!');
    } catch (error) {
      console.error('Error deleting complaint mode:', error);
      toast.error('Failed to delete complaint mode');
    }
  };

  const columns = [
    { key: 'id', label: 'Sr.No', sortable: true },
    { key: 'name', label: 'Complaint Mode', sortable: true },
  ];

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === 'srNo') return item.srNo || '';
    return item[columnKey];
  };

  const renderActions = (item: any) => (
    <div className="flex items-center gap-2">
      {/* <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
        <Edit className="h-4 w-4" />
      </Button> */}
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
        complaintMode={editingComplaintMode ? {
          id: editingComplaintMode.id.toString(),
          srNo: editingComplaintMode.id,
          complaintMode: editingComplaintMode.name
        } : null}
        onUpdate={(updatedMode) => {
          if (editingComplaintMode) {
            const updated = {
              ...editingComplaintMode,
              name: updatedMode.complaintMode
            };
            handleUpdate(updated);
          }
        }}
      />
    </div>
  );
};