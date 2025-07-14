
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const complaintModeSchema = z.object({
  complaintMode: z.string().min(1, 'Complaint mode is required'),
});

type ComplaintModeFormData = z.infer<typeof complaintModeSchema>;

interface ComplaintModeType {
  id: string;
  srNo: number;
  complaintMode: string;
}

const mockComplaintModes: ComplaintModeType[] = [
  {
    id: '1',
    srNo: 1,
    complaintMode: 'Phone Call',
  },
  {
    id: '2',
    srNo: 2,
    complaintMode: 'Email',
  },
  {
    id: '3',
    srNo: 3,
    complaintMode: 'Mobile App',
  },
  {
    id: '4',
    srNo: 4,
    complaintMode: 'Walk-in',
  },
];

export const ComplaintModeTab: React.FC = () => {
  const [complaintModes, setComplaintModes] = useState<ComplaintModeType[]>(mockComplaintModes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplaintModeFormData>({
    resolver: zodResolver(complaintModeSchema),
    defaultValues: {
      complaintMode: '',
    },
  });

  const handleSubmit = async (data: ComplaintModeFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newComplaintMode: ComplaintModeType = {
        id: (complaintModes.length + 1).toString(),
        srNo: complaintModes.length + 1,
        complaintMode: data.complaintMode,
      };
      setComplaintModes([...complaintModes, newComplaintMode]);
      console.log('Complaint Mode Data:', data);
      toast.success('Complaint mode created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create complaint mode');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'srNo', label: 'Sr.No', sortable: true },
    { key: 'complaintMode', label: 'Complaint Mode', sortable: true },
  ];

  const renderCell = (item: ComplaintModeType, columnKey: string) => {
    return item[columnKey as keyof ComplaintModeType];
  };

  const renderActions = (item: ComplaintModeType) => (
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
          <EnhancedTable
            data={complaintModes}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="complaint-modes-table"
          />
        </CardContent>
      </Card>
    </div>
  );
};
