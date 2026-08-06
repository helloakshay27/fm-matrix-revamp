import React, { useState, useEffect } from 'react';
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
  TextField,
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Field styles for Material-UI components
const fieldStyles = {
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primary)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-primary)',
  },
};

// Menu selection states use blue, matching the in-menu search box
const DROPDOWN_ACCENT_SELECTED = 'rgba(25, 118, 210, 0.08)';
const DROPDOWN_ACCENT_HOVER = 'rgba(25, 118, 210, 0.16)';

const selectStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& fieldset': {
    borderColor: '#ddd',
  },
  '&:hover fieldset': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused fieldset': {
    borderColor: 'var(--color-primary)',
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      maxHeight: 280,
      // The in-menu search box is injected by globalMUISelectSearchEnhancer and
      // styled blue globally in enhanced-select.css.
      '& .MuiMenuItem-root.Mui-selected': {
        backgroundColor: `${DROPDOWN_ACCENT_SELECTED} !important`,
        '&:hover': { backgroundColor: `${DROPDOWN_ACCENT_HOVER} !important` },
      },
    },
  },
};

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
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MuiFormControl fullWidth size="small" disabled={loading.users} error={!!fieldState.error}>
              <MuiSelect
                displayEmpty
                value={(field.value as string) ?? ''}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                inputRef={field.ref}
                MenuProps={menuProps}
                sx={selectStyles}
              >
                <MenuItem value="" disabled>
                  <em>{loading.users ? 'Loading users...' : 'Select escalation target'}</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </MuiFormControl>
          </FormControl>
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
          onClick={loadUsers}
          disabled={loading.users}
          className="fm-button-fix fm-button-brand px-4 py-2"
          variant="ghost"
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">Service Type</FormLabel>
                      <FormControl>
                        <MuiFormControl fullWidth size="small" error={!!fieldState.error}>
                          <MuiSelect
                            displayEmpty
                            value={field.value ?? ''}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            MenuProps={menuProps}
                            sx={selectStyles}
                          >
                            <MenuItem value="" disabled>
                              <em>Select service type</em>
                            </MenuItem>
                            {SERVICE_OPTIONS.map((service) => (
                              <MenuItem key={service} value={service}>
                                {service}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </MuiFormControl>
                      </FormControl>
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
                        <TextField
                          type="number"
                          placeholder="Enter days"
                          fullWidth
                          inputProps={{ min: 1 }}
                          sx={fieldStyles}
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
                        <TextField
                          type="number"
                          placeholder="Enter days"
                          fullWidth
                          inputProps={{ min: 1 }}
                          sx={fieldStyles}
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
                        <TextField
                          type="number"
                          placeholder="Enter days"
                          fullWidth
                          inputProps={{ min: 1 }}
                          sx={fieldStyles}
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
                <Button type="submit" disabled={isSubmitting || loading.users}
                className="fm-button-fix fm-button-brand px-4 py-2"
          variant="ghost"
                >
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
