
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
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const statusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  fixedState: z.string().min(1, 'Fixed state is required'),
  colorCode: z.string().min(1, 'Color code is required'),
  order: z.number().min(1, 'Order must be positive'),
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
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allowReopen, setAllowReopen] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: '',
      fixedState: '',
      colorCode: '#000000',
      order: 1,
    },
  });

  useEffect(() => {
    fetchStatuses();
  }, []);

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

  const handleSubmit = async (data: StatusFormData) => {
    setIsSubmitting(true);
    try {
      const statusData = {
        name: data.status,
        fixed_state: data.fixedState,
        color_code: data.colorCode,
        position: data.order,
        of_phase: 'pms',
        society_id: '15', // Default society ID
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

  const handleAllowReopenChange = (checked: boolean | "indeterminate") => {
    setAllowReopen(checked === true);
  };

  const handleDelete = async (status: StatusType) => {
    if (!confirm('Are you sure you want to delete this status?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');
      
      const response = await fetch(`https://${baseUrl}/pms/admin/modify_complaint_status.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const renderCell = (item: StatusType, columnKey: string) => {
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
        return item[columnKey as keyof StatusType];
    }
  };

  const renderActions = (item: StatusType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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
                      <FormLabel>Color Code</FormLabel>
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
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t">
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
    </div>
  );
};
