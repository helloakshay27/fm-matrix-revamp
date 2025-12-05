
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ticketManagementAPI, UserAccountResponse } from '@/services/ticketManagementAPI';
import { EditStatusModal } from './modals/EditStatusModal';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatuses, createStatus, updateStatus, deleteStatus, fetchAccounts } from '@/store/slices/statusesSlice';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

const statusSchema = z.object({
  name: z.string().min(1, 'Status is required'),
  fixedState: z.enum(['closed', 'reopen', 'complete']).optional(),
  colorCode: z.string().min(1, 'Color code is required'),
  position: z.number().min(1, 'Order must be positive'),
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

const fixedStates = [
  { value: 'closed', label: 'Closed' },
  { value: 'reopen', label: 'Reopen' },
  { value: 'complete', label: 'Complete' },
];

export const StatusTab: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { data: statusess = [], loading, fetchLoading, error } = useSelector((state: any) => state.statuses) || {};
  const { accounts = [] } = useSelector((state: any) => state.complaintModes) || {}; // adjust if you have a separate accounts slice
  const [statuses, setStatuses] = useState<StatusType[]>(statusess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allowReopen, setAllowReopen] = useState(false);
  const [periodType, setPeriodType] = useState<'days' | 'hours' | 'minutes'>('days');
  const [timePeriod, setTimePeriod] = useState('');
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const currentSiteId =
    accounts && accounts.length > 0
      ? accounts[0].site_id || accounts[0].society_id || '15'
      : '15';

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      name: '',
      fixedState: '' as any,
      colorCode: '#000000',
      position: 1,
    },
  });

  useEffect(() => {
    fetchStatuses();
    loadUserAccount();
    fetchReopenData();
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

  const fetchReopenData = async () => {
    try {
      const url = getFullUrl('/pms/admin/reopen_data.json');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if data exists and populate the form
        if (data && data.period_type && data.time_period) {
          setAllowReopen(true);
          setPeriodType(data.period_type as 'days' | 'hours' | 'minutes');
          setTimePeriod(data.time_period.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching reopen data:', error);
      // Don't show error toast as this might be expected if no data exists yet
    }
  };

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const data = await ticketManagementAPI.getStatuses();
      setStatuses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch statuses');
      console.error('Error fetching statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    // Get form values directly from the form inputs
    const statusNameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const colorCodeInput = document.querySelector('input[placeholder="#000000"]') as HTMLInputElement;
    const positionInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    const fixedStateValue = form.getValues('fixedState');
    
    // Check for required fields with specific messages
    if (!statusNameInput?.value?.trim()) {
      toast.error('Please enter a status name');
      return;
    }
    
    if (!colorCodeInput?.value?.trim()) {
      toast.error('Please enter a color code');
      return;
    }
    
    if (!positionInput?.value?.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    // Get the form data
    const data: StatusFormData = {
      name: statusNameInput.value.trim(),
      fixedState: fixedStateValue as 'closed' | 'reopen' | 'complete',
      colorCode: colorCodeInput.value.trim(),
      position: parseInt(positionInput.value) || 0,
    };

    // Continue with the rest of the validation and submission logic
    await handleSubmit(data);
  };

  const handleSubmit = async (data: StatusFormData) => {
    if (!userAccount?.company_id) {
      toast.error('Unable to determine company ID. Please refresh and try again.');
      return;
    }

    // Check if position already exists
    const positionExists = statuses.some(status => status.position === data.position);
    if (positionExists) {
      toast.error('Order already exists. Please enter a different order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const statusData = {
        name: data.name,
        fixed_state: data.fixedState,
        color_code: data.colorCode,
        position: data.position,
        of_phase: 'pms',
        society_id: userAccount.company_id.toString(),
      };

      await ticketManagementAPI.createStatus(statusData);
      toast.success('Status created successfully!');
      form.reset();
      fetchStatuses();
    } catch (error) {
      toast.error('Failed to create status');
      console.error('Error creating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAllowReopenChange = async (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setAllowReopen(isChecked);
    
    // If unchecking, clear the period values
    if (!isChecked) {
      setPeriodType('days');
      setTimePeriod('');
    }
  };

  const handleSaveReopen = async () => {
    if (!timePeriod || parseInt(timePeriod) <= 0) {
      toast.error('Please enter a valid time period');
      return;
    }

    try {
      const url = getFullUrl('/pms/admin/create_reopen.json');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period_type: periodType,
          time_period: timePeriod,
        }),
      });

      if (response.ok) {
        toast.success('Reopen settings saved successfully!');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Failed to save reopen settings');
      }
    } catch (error) {
      console.error('Error saving reopen settings:', error);
      toast.error('Failed to save reopen settings');
    }
  };

  const handleEdit = (status: StatusType) => {
    setSelectedStatus(status);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedStatus(null);
  };

  const handleStatusUpdated = () => {
    fetchStatuses();
    handleEditModalClose();
  };

  const handleDelete = async (status: StatusType) => {
    if (!confirm('Are you sure you want to delete this status?')) {
      return;
    }
    
    try {
      // Use apiConfig for baseURL and token
      const url = getFullUrl('/pms/admin/modify_complaint_status.json');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: status.id,
          active: 0
        }),
      });

      if (response.ok) {
        setStatuses(statuses.filter(s => s.id !== status.id));
        toast.success('Status deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Failed to delete status');
      }
    } catch (error) {
      console.error('Error deleting status:', error);
      toast.error('Failed to delete status');
    }
  };


  const columns = [
    { key: 'position', label: 'Order', sortable: true },
    { key: 'name', label: 'Status', sortable: true },
    { key: 'fixed_state', label: 'Fixed State', sortable: true },
    { key: 'color_code', label: 'Color', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'color_code':
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: item.color_code }}
            />
            <span>{item.color_code}</span>
          </div>
        );
      case 'email':
        return item.email ? 'Yes' : 'No';
      case 'fixed_state':
        return fixedStates.find(state => state.value === item.fixed_state)?.label || item.fixed_state;
      default:
        return item[columnKey];
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter status" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixed State</FormLabel>
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
                      <FormLabel>Color Code <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            className="w-16 h-10 p-1 border rounded"
                            {...field}
                          />
                          <Input
                            placeholder="#000000"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Order <span className="text-red-500">*</span></FormLabel>
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

              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateSubmit}
                  disabled={isSubmitting || loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  {isSubmitting || loading ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </div>
          </Form>

          <div className="mt-6 pt-6 border-t">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowReopen"
                  checked={allowReopen}
                  onCheckedChange={handleAllowReopenChange}
                />
                <label htmlFor="allowReopen" className="text-sm font-medium">
                  Allow User to reopen ticket after closure
                </label>
              </div>

              {allowReopen && (
                <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Period Type <span className="text-red-500">*</span>
                      </label>
                      <Select value={periodType} onValueChange={(value: 'days' | 'hours' | 'minutes') => {
                        setPeriodType(value);
                        setTimePeriod(''); // Reset time period when period type changes
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Time Period <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter time period"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveReopen}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save Reopen Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading statuses...</div>
            </div>
          ) : (
            <EnhancedTable
              data={statuses}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="status-table"
            />
          )}
        </CardContent>
      </Card>

      <EditStatusModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        status={selectedStatus}
        onUpdate={handleStatusUpdated}
      />
    </div>
  );
};