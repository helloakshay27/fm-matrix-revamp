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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

const escalationSchema = z.object({
  serviceType: z.string().min(1, 'Please select a service type'),
  e1Days: z.number().min(1, 'Days must be at least 1'),
  e1EscalateTo: z.string().min(1, 'Please select escalation target'),
  e2Days: z.number().min(1, 'Days must be at least 1'),
  e2EscalateTo: z.string().min(1, 'Please select escalation target'),
  e3Days: z.number().min(1, 'Days must be at least 1'),
  e3EscalateTo: z.string().min(1, 'Please select escalation target'),
});

type EscalationFormData = z.infer<typeof escalationSchema>;

interface User {
  id: number;
  full_name: string;
}

const SERVICE_OPTIONS = [
  'PPM',
  'AMC', 
  'Routine',
  'Preparedness'
];

export const TaskEscalationPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({ users: false });

  const form = useForm<EscalationFormData>({
    resolver: zodResolver(escalationSchema),
    defaultValues: {
      serviceType: '',
      e1Days: 1,
      e1EscalateTo: '',
      e2Days: 2,
      e2EscalateTo: '',
      e3Days: 3,
      e3EscalateTo: '',
    },
  });

  const loadUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESCALATION_USERS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users loaded successfully:', data);

      // Extract users array from response
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error("Failed to load users. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      // Keep fallback mock data
      const mockUsers = [
        { id: 1, full_name: 'Manager' },
        { id: 2, full_name: 'Senior Manager' },
        { id: 3, full_name: 'Department Head' },
        { id: 4, full_name: 'Director' },
        { id: 5, full_name: 'VP Operations' },
        { id: 6, full_name: 'CEO' }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

  const renderEscalationSelect = (fieldName: keyof EscalationFormData, label: string) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} disabled={loading.users}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loading.users ? "Loading users..." : "Select escalation target"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Escalation</h1>
        <Button 
          variant="outline" 
          onClick={loadUsers}
          disabled={loading.users}
        >
          {loading.users ? 'Loading...' : 'Refresh Users'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Levels Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Service Type Dropdown */}
              <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Service Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICE_OPTIONS.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                {renderEscalationSelect('e1EscalateTo', 'Escalation To')}
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
                {renderEscalationSelect('e2EscalateTo', 'Escalation To')}
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
                {renderEscalationSelect('e3EscalateTo', 'Escalation To')}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || loading.users}>
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
