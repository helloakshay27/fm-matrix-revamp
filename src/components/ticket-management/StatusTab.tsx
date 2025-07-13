
import React, { useState } from 'react';
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

const statusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  fixedState: z.string().min(1, 'Fixed state is required'),
  colorCode: z.string().min(1, 'Color code is required'),
  order: z.number().min(1, 'Order must be positive'),
  allowReopen: z.boolean(),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface StatusType {
  id: string;
  order: number;
  status: string;
  fixedState: string;
  color: string;
  email: boolean;
}

const mockStatuses: StatusType[] = [
  {
    id: '1',
    order: 1,
    status: 'Open',
    fixedState: 'No',
    color: '#FF0000',
    email: true,
  },
  {
    id: '2',
    order: 2,
    status: 'In Progress',
    fixedState: 'No',
    color: '#FFA500',
    email: false,
  },
  {
    id: '3',
    order: 3,
    status: 'Resolved',
    fixedState: 'Yes',
    color: '#008000',
    email: true,
  },
];

const fixedStates = ['Yes', 'No'];

export const StatusTab: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusType[]>(mockStatuses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowReopen, setAllowReopen] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: '',
      fixedState: '',
      colorCode: '#000000',
      order: 1,
      allowReopen: false,
    },
  });

  const handleSubmit = async (data: StatusFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Status Data:', data);
      toast.success('Status created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'order', label: 'Order', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'fixedState', label: 'Fixed State', sortable: true },
    { key: 'color', label: 'Color', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
  ];

  const renderCell = (item: StatusType, columnKey: string) => {
    switch (columnKey) {
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.color}</span>
          </div>
        );
      case 'email':
        return item.email ? 'Yes' : 'No';
      default:
        return item[columnKey as keyof StatusType];
    }
  };

  const renderActions = (item: StatusType) => (
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
                            <SelectItem key={state} value={state}>
                              {state}
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
                onCheckedChange={setAllowReopen}
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
          />
        </CardContent>
      </Card>
    </div>
  );
};
