import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';
import {
  TextField,
  FormControl as MuiFormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Checkbox as MuiCheckbox,
  ListItemText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  APPROVAL_LEVELS, 
  COST_UNITS, 
  CostApprovalFormData, 
  CostApprovalPayload, 
  CostUnit,
  CostApprovalGetResponse
} from '@/types/costApproval';
import { createCostApproval, fetchCostApprovals, deleteCostApproval } from '@/store/slices/costApprovalSlice';
import { AppDispatch, RootState } from '@/store/store';

// Interface for the new API response
interface EscalateToUser {
  id: number;
  full_name: string;
}

interface EscalateToUsersResponse {
  users: EscalateToUser[];
}

// Field styles for Material-UI components
const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const createCostApprovalSchema = (existingRules: CostApprovalGetResponse[], activeTab: string) => 
  z.object({
    costUnit: z.enum(['between', 'greater_than', 'greater_than_equal']),
    costFrom: z.number().positive().optional(),
    costTo: z.number().positive('Cost value must be greater than 0'),
    approvalLevels: z.array(z.object({
      level: z.enum(['L1', 'L2', 'L3', 'L4', 'L5']),
      escalateToUsers: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
    })),
  }).refine((data) => {
    if (data.costUnit === 'between') {
      return data.costFrom !== undefined && data.costFrom > 0 && data.costFrom < data.costTo
    }
    return true
  }, {
    message: 'Cost from must be less than cost to when using between option',
    path: ['costFrom'],
  })

export const CostApprovalPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'project' | 'fm'>('project');
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: number[] }>({});
  const [escalateToUsers, setEscalateToUsers] = useState<EscalateToUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('all');

  const { rules, createLoading, fetchLoading, deleteLoading } = useSelector((state: RootState) => state.costApproval);

  // Options for react-select
  const userOptions = escalateToUsers?.map(user => ({ value: user.id, label: user.full_name })) || [];

  const costApprovalSchema = useMemo(() => 
    createCostApprovalSchema(rules, activeTab), 
    [rules, activeTab]
  )

  // Fetch escalate to users from the new API
  const fetchEscalateToUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await apiClient.get<EscalateToUsersResponse>(API_CONFIG.ENDPOINTS.FM_USERS);
      setEscalateToUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching escalate to users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users for approval',
        variant: 'destructive',
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const createDefaultApprovalLevels = () => {
    return APPROVAL_LEVELS.map(level => ({
      level,
      escalateToUsers: [],
    }));
  };

  const form = useForm<CostApprovalFormData>({
    resolver: zodResolver(costApprovalSchema),
    defaultValues: {
      costUnit: 'between',
      costFrom: undefined,
      costTo: 0,
      approvalLevels: createDefaultApprovalLevels(),
    },
  });

  const costUnit = form.watch('costUnit');

  // Fetch users and cost approvals on component mount
  useEffect(() => {
    fetchEscalateToUsers();
    dispatch(fetchCostApprovals());
  }, [dispatch]);

  // Filter rules based on active tab and only show active rules
  const filteredRules = useMemo(() => {
    let filtered = rules.filter(rule => 
      rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project') && 
      rule.active === true
    );

    // Apply cost filter if not 'all'
    if (selectedCostFilter !== 'all') {
      filtered = filtered.filter(rule => {
        const costRange = rule.cost_unit === 'between' && rule.cost_from !== null
          ? `₹${rule.cost_from} - ₹${rule.cost_to}`
          : `> ₹${rule.cost_to}`;
        return costRange.toLowerCase().includes(selectedCostFilter.toLowerCase());
      });
    }

    return filtered;
  }, [rules, activeTab, selectedCostFilter]);

  // Helper function to get user names from user IDs
  const getUserNames = (userIds: number[] | null | undefined): string => {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) return '-';
    
    return userIds.map(id => {
      const user = escalateToUsers.find(u => u.id === id);
      return user ? user.full_name : `User ${id}`;
    }).join(', ');
  };

  // Helper function to get cost range display
  const getCostRangeDisplay = (rule: CostApprovalGetResponse): string => {
    if (rule.cost_unit === 'between' && rule.cost_from !== null) {
      return `₹${rule.cost_from} - ₹${rule.cost_to}`;
    }
    return `> ₹${rule.cost_to}`;
  };

  const handleUserSelect = (level: string, selectedOptions: { value: number; label: string }[]) => {
    const newUsers = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedUsers(prev => ({ ...prev, [level]: newUsers }));
    
    // Update form data
    const levelIndex = APPROVAL_LEVELS.indexOf(level as typeof APPROVAL_LEVELS[number]);
    const currentLevels = form.getValues('approvalLevels');
    if (currentLevels[levelIndex]) {
      currentLevels[levelIndex].escalateToUsers = newUsers;
      form.setValue('approvalLevels', currentLevels, { shouldValidate: false });
    }
  };

  const getUserDisplayName = (userId: number): string => {
    const user = escalateToUsers.find(u => u.id === userId);
    return user ? user.full_name : `User ${userId}`;
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCostApproval(id)).unwrap();
      
      toast({
        title: 'Success',
        description: 'Cost approval rule deleted successfully',
      });

      // Refresh the cost approvals list
      dispatch(fetchCostApprovals());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete cost approval rule';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: CostApprovalFormData) => {
    try {
      // Basic validation
      if (!data.costTo || data.costTo <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Cost value must be greater than 0',
          variant: 'destructive',
        });
        return;
      }

      if (data.costUnit === 'between') {
        if (!data.costFrom || data.costFrom <= 0) {
          toast({
            title: 'Validation Error',
            description: 'Cost From must be greater than 0 when using between option',
            variant: 'destructive',
          });
          return;
        }
        if (data.costFrom >= data.costTo) {
          toast({
            title: 'Validation Error',
            description: 'Cost From must be less than Cost To',
            variant: 'destructive',
          });
          return;
        }
      }

      // Check if at least one user is selected
      const hasUsers = data.approvalLevels.some(level => level.escalateToUsers.length > 0);
      if (!hasUsers) {
        toast({
          title: 'Validation Error',
          description: 'Please select at least one user for approval levels',
          variant: 'destructive',
        });
        return;
      }

      const payload: CostApprovalPayload = {
        cost_approval: {
          related_to: activeTab === 'fm' ? 'FM' : 'Project',
          level: '',
          cost_unit: data.costUnit,
          cost_to: data.costTo,
          cost_approval_levels_attributes: data.approvalLevels
            .filter(level => level.escalateToUsers.length > 0)
            .map(level => ({
              name: level.level,
              escalate_to_users: level.escalateToUsers,
            })),
        },
      };

      // Add cost_from only for 'between' option
      if (data.costUnit === 'between' && data.costFrom !== undefined) {
        payload.cost_approval.cost_from = data.costFrom;
      }

      console.log('Submitting payload:', payload);

      await dispatch(createCostApproval(payload)).unwrap();
      
      toast({
        title: 'Success',
        description: 'Cost approval rule created successfully',
      });

      // Refresh the cost approvals list
      dispatch(fetchCostApprovals());

      // Reset form
      form.reset({
        costUnit: 'between',
        costFrom: undefined,
        costTo: 0,
        approvalLevels: createDefaultApprovalLevels(),
      });
      setSelectedUsers({});
    } catch (error: unknown) {
      console.error('Error creating cost approval:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create cost approval rule';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const renderForm = () => (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Cost Unit Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="costUnit"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Cost Unit</FormLabel>
                    <FormControl>
                      <MuiFormControl fullWidth size="small" error={!!fieldState.error}>
                        <MuiSelect
                          displayEmpty
                          value={field.value ?? ''}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value="" disabled>
                            <em>Select Cost Unit</em>
                          </MenuItem>
                          {COST_UNITS.map(unit => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Conditional Cost Fields */}
              {costUnit === 'between' && (
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost From</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="costTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {costUnit === 'between' ? 'Cost To' : 
                       costUnit === 'greater_than' ? 'Greater Than' : 'Greater Than Equal'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10000"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Approval Levels */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Approval Levels</h3>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left text-sm font-medium">Levels</th>
                      <th className="p-3 text-left text-sm font-medium">Approvers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {APPROVAL_LEVELS.map((level) => (
                      <tr key={level} className="border-b last:border-b-0">
                        <td className="p-3 text-sm font-medium">{level}</td>
                        <td className="p-3">
                          <MuiFormControl size="small" className="min-w-[250px]">
                            <MuiSelect
                              multiple
                              displayEmpty
                              disabled={usersLoading}
                              value={(selectedUsers[level] || []).map(String)}
                              onChange={(e: SelectChangeEvent<string[]>) => {
                                const value = e.target.value;
                                const ids = typeof value === 'string' ? value.split(',') : value;
                                handleUserSelect(
                                  level,
                                  ids
                                    .map(Number)
                                    .filter(id => !Number.isNaN(id))
                                    .map(id => ({ value: id, label: getUserDisplayName(id) }))
                                );
                              }}
                              renderValue={(selected) =>
                                selected.length > 0
                                  ? `${selected.length} user(s) selected`
                                  : 'Select up to 15 users...'
                              }
                              sx={fieldStyles}
                              MenuProps={selectMenuProps}
                            >
                              {userOptions.length === 0 ? (
                                <MenuItem disabled value="">
                                  <em>{usersLoading ? 'Loading users...' : 'No users available'}</em>
                                </MenuItem>
                              ) : (
                                userOptions.map((option) => (
                                  <MenuItem key={option.value} value={String(option.value)}>
                                    <MuiCheckbox
                                      checked={(selectedUsers[level] || []).includes(option.value)}
                                      size="small"
                                    />
                                    <ListItemText primary={option.label} />
                                  </MenuItem>
                                ))
                              )}
                            </MuiSelect>
                          </MuiFormControl>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                type="submit" 
                className="px-8 bg-[#C72030] hover:bg-[#C72030]/90"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Submit'}
              </Button>
              {/* <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  console.log('Form Data:', form.getValues());
                  console.log('Selected Users:', selectedUsers);
                  console.log('Form Errors:', form.formState.errors);
                  console.log('Form Valid:', form.formState.isValid);
                }}
                className="px-4"
              >
                Debug
              </Button> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cost Approval</h1>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'project' | 'fm')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="project"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Project
          </TabsTrigger>
          <TabsTrigger
            value="fm"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            FM
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="space-y-6">
          <div className="space-y-6">
            {renderForm()}
            
            {/* Existing Rules Section */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Filter</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cost-filter" className="text-sm font-medium text-gray-700">
                        Cost Range
                      </Label>
                      <MuiFormControl size="small" className="w-48">
                        <MuiSelect
                          displayEmpty
                          value={selectedCostFilter ?? ''}
                          onChange={(event) => setSelectedCostFilter(event.target.value)}
                          renderValue={(selected) =>
                            selected ? (
                              selected === 'all' ? 'All Ranges' : selected
                            ) : (
                              <span className="text-gray-500">Select Cost Range</span>
                            )
                          }
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value="all">All Ranges</MenuItem>
                          {rules
                            .filter(rule => rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project') && rule.active === true)
                            .map((rule) => (
                              <MenuItem key={rule.id} value={getCostRangeDisplay(rule)}>
                                {getCostRangeDisplay(rule)}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className="fm-button-fix fm-button-brand px-4 py-2"
                      onClick={() => setSelectedCostFilter('all')}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-white border border-brand text-brand hover:bg-brand-selected px-4 py-2"
                      onClick={() => setSelectedCostFilter('all')}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {fetchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
                    <span className="ml-2 text-gray-600">Loading cost approval rules...</span>
                  </div>
                ) : filteredRules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No cost approval rules found.</p>
                    <p className="text-sm mt-1">Create your first rule using the form above.</p>
                  </div>
                ) : (
                  <div className="space-y-6 p-6">
                    {filteredRules.map((rule, index) => (
                      <div key={rule.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold text-gray-900">Rule {index + 1}</h3>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                    disabled={deleteLoading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this cost approval rule for {getCostRangeDisplay(rule)}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(rule.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                        
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/3">Cost Range</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/6">Levels</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4">Approvers</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-gray-100 hover:bg-gray-50/50">
                                <TableCell className="py-4 px-4 align-top font-medium text-gray-900">
                                  {getCostRangeDisplay(rule)}
                                </TableCell>
                                <TableCell className="py-4 px-4 align-top">
                                  <div className="space-y-2">
                                    {rule.cost_approval_levels?.map((level) => (
                                      <div key={level.id} className="text-sm text-gray-700 font-medium">
                                        {level.name}
                                      </div>
                                    )) || <span className="text-sm text-gray-500">-</span>}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-4 align-top">
                                  <div className="space-y-2">
                                    {rule.cost_approval_levels?.map((level) => (
                                      <div key={level.id} className="text-sm text-gray-700">
                                        {getUserNames(level.escalate_to_users)}
                                      </div>
                                    )) || <span className="text-sm text-gray-500">-</span>}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="fm" className="space-y-6">
          <div className="space-y-6">
            {renderForm()}
            
            {/* Existing Rules Section */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Filter</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cost-filter" className="text-sm font-medium text-gray-700">
                        Cost Range
                      </Label>
                      <MuiFormControl size="small" className="w-48">
                        <MuiSelect
                          displayEmpty
                          value={selectedCostFilter ?? ''}
                          onChange={(event) => setSelectedCostFilter(event.target.value)}
                          renderValue={(selected) =>
                            selected ? (
                              selected === 'all' ? 'All Ranges' : selected
                            ) : (
                              <span className="text-gray-500">Select Cost Range</span>
                            )
                          }
                          sx={fieldStyles}
                          MenuProps={selectMenuProps}
                        >
                          <MenuItem value="all">All Ranges</MenuItem>
                          {rules
                            .filter(rule => rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project') && rule.active === true)
                            .map((rule) => (
                              <MenuItem key={rule.id} value={getCostRangeDisplay(rule)}>
                                {getCostRangeDisplay(rule)}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </MuiFormControl>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className="fm-button-fix fm-button-brand px-4 py-2"
                      onClick={() => setSelectedCostFilter('all')}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-white border border-brand text-brand hover:bg-brand-selected px-4 py-2"
                      onClick={() => setSelectedCostFilter('all')}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {fetchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
                    <span className="ml-2 text-gray-600">Loading cost approval rules...</span>
                  </div>
                ) : filteredRules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No cost approval rules found.</p>
                    <p className="text-sm mt-1">Create your first rule using the form above.</p>
                  </div>
                ) : (
                  <div className="space-y-6 p-6">
                    {filteredRules.map((rule, index) => (
                      <div key={rule.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold text-gray-900">Rule {index + 1}</h3>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                    disabled={deleteLoading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this cost approval rule for {getCostRangeDisplay(rule)}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(rule.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                        
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/3">Cost Range</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/6">Levels</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-left py-3 px-4">Approvers</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-gray-100 hover:bg-gray-50/50">
                                <TableCell className="py-4 px-4 align-top font-medium text-gray-900">
                                  {getCostRangeDisplay(rule)}
                                </TableCell>
                                <TableCell className="py-4 px-4 align-top">
                                  <div className="space-y-2">
                                    {rule.cost_approval_levels?.map((level) => (
                                      <div key={level.id} className="text-sm text-gray-700 font-medium">
                                        {level.name}
                                      </div>
                                    )) || <span className="text-sm text-gray-500">-</span>}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-4 align-top">
                                  <div className="space-y-2">
                                    {rule.cost_approval_levels?.map((level) => (
                                      <div key={level.id} className="text-sm text-gray-700">
                                        {getUserNames(level.escalate_to_users)}
                                      </div>
                                    )) || <span className="text-sm text-gray-500">-</span>}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};