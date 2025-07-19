import React, { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatuses, createStatus, updateStatus, deleteStatus, fetchAccounts } from '@/store/slices/statusesSlice';

const statusSchema = z.object({
  name: z.string().min(1, 'Status is required'),
  fixedState: z.enum(['closed', 'reopen', 'complete'], { errorMap: () => ({ message: 'Fixed state is required' }) }),
  colorCode: z.string().min(1, 'Color code is required'),
  position: z.number().min(1, 'Order must be positive'),
});

type StatusFormData = z.infer<typeof statusSchema>;


const fixedStates = [
  { value: 'closed', label: 'Closed' },
  { value: 'reopen', label: 'Reopen' },
  { value: 'complete', label: 'Complete' },
];

export const StatusTab: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { data: statuses = [], loading, fetchLoading, error } = useSelector((state: any) => state.statuses) || {};
  const { accounts = [] } = useSelector((state: any) => state.complaintModes) || {}; // adjust if you have a separate accounts slice
  const [allowReopen, setAllowReopen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    dispatch(fetchStatuses());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleSubmit = async (data: StatusFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        complaint_status: {
          of_phase: 'pms',
          society_id: currentSiteId, // Use dynamic value here
          name: data.name,
          fixed_state: data.fixedState,
          color_code: data.colorCode,
          position: data.position.toString(),
        },
      };
      const resultAction = await dispatch(createStatus(payload));
      if (createStatus.fulfilled.match(resultAction)) {
        toast.success('Status created successfully!');
        form.reset();
        dispatch(fetchStatuses());
      } else {
        toast.error(
          (resultAction.payload as any)?.message || 'Failed to create status'
        );
      }
    } catch (error) {
      toast.error('Failed to create status');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAllowReopenChange = (checked: boolean | "indeterminate") => {
    setAllowReopen(checked === true);
  };

  const columns = [
    { key: 'position', label: 'Order', sortable: true },
    { key: 'name', label: 'Status', sortable: true },
    { key: 'fixed_state', label: 'Fixed State', sortable: true },
    { key: 'color_code', label: 'Color', sortable: false },
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
      default:
        return item[columnKey];
    }
  };

  const renderActions = (item: any) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
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
                  name="name"
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
                  name="position"
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
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? 'Saving...' : 'Submit'}
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
          <EnhancedTable
            data={statuses}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="status-table"
            loading={fetchLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};