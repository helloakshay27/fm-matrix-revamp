import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';
import { TextField, FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import ReactSelect from 'react-select';
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
  const filteredRules = useMemo(() => 
    rules.filter(rule => 
      rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project') && 
      rule.active === true
    ),
    [rules, activeTab]
  )

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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Unit</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cost Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {COST_UNITS.map(unit => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          <ReactSelect
                            isMulti
                            options={userOptions}
                            onChange={(selected) => handleUserSelect(level, selected as { value: number; label: string }[])}
                            value={userOptions.filter(option => (selectedUsers[level] || []).includes(option.value))}
                            placeholder="Select up to 15 users..."
                            isLoading={usersLoading}
                            isDisabled={usersLoading}
                            className="min-w-[250px]"
                            styles={{
                              control: (base) => ({
                                ...base,
                                minHeight: '40px',
                                fontSize: '14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                boxShadow: 'none',
                                '&:hover': {
                                  borderColor: '#9ca3af'
                                }
                              }),
                              multiValue: (base) => ({
                                ...base,
                                fontSize: '12px',
                                backgroundColor: '#f3f4f6'
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: '#374151'
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: '#6b7280',
                                '&:hover': {
                                  backgroundColor: '#ef4444',
                                  color: 'white'
                                }
                              })
                            }}
                          />
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
            <Card>
              <CardHeader>
                <CardTitle>Existing Cost Approval Rules</CardTitle>
              </CardHeader>
              <CardContent>
                {fetchLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">Loading existing rules...</div>
                  </div>
                ) : filteredRules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No cost approval rules found for Project
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                       <thead>
                         <tr className="border-b">
                           <th className="text-left p-3 font-medium">Cost Range</th>
                           <th className="text-left p-3 font-medium">Unit</th>
                           <th className="text-left p-3 font-medium">Levels</th>
                           <th className="text-left p-3 font-medium">Status</th>
                           <th className="text-left p-3 font-medium">Created Date</th>
                           <th className="text-left p-3 font-medium">Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredRules.map((rule) => (
                           <tr key={rule.id} className="border-b hover:bg-muted/50">
                             <td className="p-3">
                               {rule.cost_unit === 'between' && rule.cost_from !== null
                                 ? `₹${rule.cost_from} - ₹${rule.cost_to}`
                                 : `> ₹${rule.cost_to}`
                               }
                             </td>
                             <td className="p-3 capitalize">
                               {rule.cost_unit.replace('_', ' ')}
                             </td>
                             <td className="p-3">
                               <div className="flex flex-wrap gap-1">
                                 {['L1', 'L2', 'L3', 'L4', 'L5'].map(level => (
                                   <span key={level} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                     {level}
                                   </span>
                                 ))}
                               </div>
                             </td>
                             <td className="p-3">
                               <span className={`px-2 py-1 rounded-full text-xs ${
                                 rule.active 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-gray-100 text-gray-800'
                               }`}>
                                 {rule.active ? 'Active' : 'Inactive'}
                               </span>
                             </td>
                             <td className="p-3 text-sm text-muted-foreground">
                               {new Date(rule.created_at).toLocaleDateString()}
                             </td>
                             <td className="p-3">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleDelete(rule.id)}
                                 disabled={deleteLoading}
                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
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
            <Card>
              <CardHeader>
                <CardTitle>Existing Cost Approval Rules</CardTitle>
              </CardHeader>
              <CardContent>
                {fetchLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">Loading existing rules...</div>
                  </div>
                ) : filteredRules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No cost approval rules found for FM
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                       <thead>
                         <tr className="border-b">
                           <th className="text-left p-3 font-medium">Cost Range</th>
                           <th className="text-left p-3 font-medium">Unit</th>
                           <th className="text-left p-3 font-medium">Levels</th>
                           <th className="text-left p-3 font-medium">Status</th>
                           <th className="text-left p-3 font-medium">Created Date</th>
                           <th className="text-left p-3 font-medium">Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredRules.map((rule) => (
                           <tr key={rule.id} className="border-b hover:bg-muted/50">
                             <td className="p-3">
                               {rule.cost_unit === 'between' && rule.cost_from !== null
                                 ? `₹${rule.cost_from} - ₹${rule.cost_to}`
                                 : `> ₹${rule.cost_to}`
                               }
                             </td>
                             <td className="p-3 capitalize">
                               {rule.cost_unit.replace('_', ' ')}
                             </td>
                             <td className="p-3">
                               <div className="flex flex-wrap gap-1">
                                 {['L1', 'L2', 'L3', 'L4', 'L5'].map(level => (
                                   <span key={level} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                     {level}
                                   </span>
                                 ))}
                               </div>
                             </td>
                             <td className="p-3">
                               <span className={`px-2 py-1 rounded-full text-xs ${
                                 rule.active 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-gray-100 text-gray-800'
                               }`}>
                                 {rule.active ? 'Active' : 'Inactive'}
                               </span>
                             </td>
                             <td className="p-3 text-sm text-muted-foreground">
                               {new Date(rule.created_at).toLocaleDateString()}
                             </td>
                             <td className="p-3">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleDelete(rule.id)}
                                 disabled={deleteLoading}
                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
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