
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const escalationSchema = z.object({
  e1Days: z.number().min(1, 'Days must be at least 1'),
  e1EscalateTo: z.string().min(1, 'Please select escalation target'),
  e2Days: z.number().min(1, 'Days must be at least 1'),
  e2EscalateTo: z.string().min(1, 'Please select escalation target'),
  e3Days: z.number().min(1, 'Days must be at least 1'),
  e3EscalateTo: z.string().min(1, 'Please select escalation target'),
});

type EscalationFormData = z.infer<typeof escalationSchema>;

const escalationTargets = [
  'Manager',
  'Senior Manager',
  'Department Head',
  'Director',
  'VP Operations',
  'CEO'
];

export const TaskEscalationPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EscalationFormData>({
    resolver: zodResolver(escalationSchema),
    defaultValues: {
      e1Days: 1,
      e1EscalateTo: '',
      e2Days: 2,
      e2EscalateTo: '',
      e3Days: 3,
      e3EscalateTo: '',
    },
  });

  const handleSubmit = async (data: EscalationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Task Escalation Configuration:', data);
      toast.success('Task escalation configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save task escalation configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Escalation</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Levels Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* E1 Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-red-50">
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold text-red-700 mb-2">E1 Level</h3>
                </div>
                <FormField
                  control={form.control}
                  name="e1Days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter days"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="e1EscalateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escalation To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select escalation target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escalationTargets.map((target) => (
                            <SelectItem key={target} value={target}>
                              {target}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* E2 Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-yellow-50">
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold text-yellow-700 mb-2">E2 Level</h3>
                </div>
                <FormField
                  control={form.control}
                  name="e2Days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter days"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="e2EscalateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escalation To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select escalation target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escalationTargets.map((target) => (
                            <SelectItem key={target} value={target}>
                              {target}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* E3 Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-green-50">
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">E3 Level</h3>
                </div>
                <FormField
                  control={form.control}
                  name="e3Days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter days"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="e3EscalateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escalation To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select escalation target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escalationTargets.map((target) => (
                            <SelectItem key={target} value={target}>
                              {target}
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
    </div>
  );
};
