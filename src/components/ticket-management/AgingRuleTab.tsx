
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const agingRuleSchema = z.object({
  ruleType: z.string().min(1, 'Rule type is required'),
  ruleUnit: z.string().min(1, 'Rule unit is required'),
});

type AgingRuleFormData = z.infer<typeof agingRuleSchema>;

interface AgingRuleType {
  id: string;
  srNo: number;
  rule: string;
}

const mockAgingRules: AgingRuleType[] = [
  {
    id: '1',
    srNo: 1,
    rule: 'Critical - 1 Day',
  },
  {
    id: '2',
    srNo: 2,
    rule: 'High - 3 Days',
  },
  {
    id: '3',
    srNo: 3,
    rule: 'Medium - 5 Days',
  },
  {
    id: '4',
    srNo: 4,
    rule: 'Low - 7 Days',
  },
];

const ruleTypes = ['Critical', 'High', 'Medium', 'Low'];
const ruleUnits = ['Hours', 'Days', 'Weeks'];

export const AgingRuleTab: React.FC = () => {
  const [agingRules, setAgingRules] = useState<AgingRuleType[]>(mockAgingRules);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AgingRuleFormData>({
    resolver: zodResolver(agingRuleSchema),
    defaultValues: {
      ruleType: '',
      ruleUnit: '',
    },
  });

  const handleSubmit = async (data: AgingRuleFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAgingRule: AgingRuleType = {
        id: (agingRules.length + 1).toString(),
        srNo: agingRules.length + 1,
        rule: `${data.ruleType} - ${data.ruleUnit}`,
      };
      setAgingRules([...agingRules, newAgingRule]);
      console.log('Aging Rule Data:', data);
      toast.success('Aging rule created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create aging rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'srNo', label: 'Sr.No', sortable: true },
    { key: 'rule', label: 'Rule', sortable: true },
  ];

  const renderCell = (item: AgingRuleType, columnKey: string) => {
    return item[columnKey as keyof AgingRuleType];
  };

  const renderActions = (item: AgingRuleType) => (
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
          <CardTitle>Add Aging Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ruleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rule type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ruleTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                  name="ruleUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rule unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ruleUnits.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aging Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            data={agingRules}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="aging-rules-table"
          />
        </CardContent>
      </Card>
    </div>
  );
};
