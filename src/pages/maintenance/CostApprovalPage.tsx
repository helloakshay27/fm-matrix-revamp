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
    costTo: z.number().positive(),
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
  }).refine((data) => {
    // Filter existing rules by related_to (activeTab)
    const relatedRules = existingRules.filter(rule => rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project'))
    
    if (relatedRules.length === 0) return true
    
    // Check for overlapping ranges
    const hasOverlap = relatedRules.some(rule => {
      if (data.costUnit === 'between' && data.costFrom !== undefined) {
        // Check if new range overlaps with existing range
        if (rule.cost_unit === 'between' && rule.cost_from !== null) {
          return !(data.costTo <= rule.cost_from || data.costFrom >= rule.cost_to)
        }
        if (rule.cost_unit === 'greater_than' || rule.cost_unit === 'greater_than_equal') {
          return data.costTo > rule.cost_to
        }
      } else if (data.costUnit === 'greater_than' || data.costUnit === 'greater_than_equal') {
        // Check if new greater_than value conflicts with existing ranges
        if (rule.cost_unit === 'between' && rule.cost_from !== null) {
          return data.costTo <= rule.cost_to
        }
        if (rule.cost_unit === 'greater_than' || rule.cost_unit === 'greater_than_equal') {
          return data.costTo <= rule.cost_to
        }
      }
      return false
    })
    
    return !hasOverlap
  }, {
    message: 'Cost range conflicts with existing rules. Please ensure your range is greater than the last added cost.',
    path: ['costTo'],
  })

export const CostApprovalPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'project' | 'fm'>('project');
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: number[] }>({});
  const [escalateToUsers, setEscalateToUsers] = useState<EscalateToUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  const { rules, createLoading, fetchLoading, deleteLoading } = useSelector((state: RootState) => state.costApproval);

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

  // Filter rules based on active tab
  const filteredRules = useMemo(() => 
    rules.filter(rule => rule.related_to === (activeTab === 'fm' ? 'FM' : 'Project')),
    [rules, activeTab]
  )

  const handleUserSelect = (level: string, userId: number) => {
    const currentUsers = selectedUsers[level] || [];
    if (!currentUsers.includes(userId) && currentUsers.length < 15) {
      const newUsers = [...currentUsers, userId];
      setSelectedUsers(prev => ({ ...prev, [level]: newUsers }));
      
      // Update form data
      const levelIndex = APPROVAL_LEVELS.indexOf(level as typeof APPROVAL_LEVELS[number]);
      const currentLevels = form.getValues('approvalLevels');
      currentLevels[levelIndex].escalateToUsers = newUsers;
      form.setValue('approvalLevels', currentLevels);
    }
  };

  const removeUser = (level: string, userIdToRemove: number) => {
    const currentUsers = selectedUsers[level] || [];
    const newUsers = currentUsers.filter(userId => userId !== userIdToRemove);
    setSelectedUsers(prev => ({ ...prev, [level]: newUsers }));
    
    // Update form data
    const levelIndex = APPROVAL_LEVELS.indexOf(level as typeof APPROVAL_LEVELS[number]);
    const currentLevels = form.getValues('approvalLevels');
    currentLevels[levelIndex].escalateToUsers = newUsers;
    form.setValue('approvalLevels', currentLevels);
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
      const payload: CostApprovalPayload = {
        cost_approval: {
          related_to: activeTab === 'fm' ? 'FM' : 'Project',
          level: '',
          cost_unit: data.costUnit,
          cost_to: data.costTo,
          cost_approval_levels_attributes: data.approvalLevels.map(level => ({
            name: level.level,
            escalate_to_users: level.escalateToUsers.length > 0 ? level.escalateToUsers : [''],
          })),
        },
      };

      // Add cost_from only for 'between' option
      if (data.costUnit === 'between' && data.costFrom !== undefined) {
        payload.cost_approval.cost_from = data.costFrom;
      }

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
              <MuiFormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Cost Unit</InputLabel>
                <MuiSelect
                  value={form.watch('costUnit')}
                  onChange={(e) => form.setValue('costUnit', e.target.value as CostUnit)}
                  label="Cost Unit"
                  notched
                  displayEmpty
                >
                  {COST_UNITS.map(unit => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
              
              {/* Conditional Cost Fields */}
              {costUnit === 'between' && (
                <TextField
                  label="Cost From"
                  placeholder="0"
                  type="number"
                  value={form.watch('costFrom') || ''}
                  onChange={(e) => form.setValue('costFrom', parseInt(e.target.value) || undefined)}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  InputProps={{
                    sx: fieldStyles,
                  }}
                />
              )}
              
              <TextField
                label={
                  costUnit === 'between' ? 'Cost To' : 
                  costUnit === 'greater_than' ? 'Greater Than' : 'Greater Than Equal'
                }
                placeholder="10000"
                type="number"
                value={form.watch('costTo') || ''}
                onChange={(e) => form.setValue('costTo', parseInt(e.target.value) || 0)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Approval Levels */}
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
                        <div className="space-y-2">
                          <MuiFormControl
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiInputBase-root': fieldStyles }}
                          >
                            <MuiSelect
                              value=""
                              onChange={(e) => handleUserSelect(level, parseInt(e.target.value))}
                              displayEmpty
                              disabled={usersLoading}
                            >
                              <MenuItem value="">
                                {usersLoading ? "Loading..." : "Select up to 15 users..."}
                              </MenuItem>
                              {escalateToUsers
                                .filter(user => !(selectedUsers[level] || []).includes(user.id))
                                .map(user => (
                                  <MenuItem key={user.id} value={user.id.toString()}>
                                    {user.full_name}
                                  </MenuItem>
                                ))}
                            </MuiSelect>
                          </MuiFormControl>
                          
                          {selectedUsers[level] && selectedUsers[level].length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {selectedUsers[level].map(userId => (
                                <Badge key={userId} variant="secondary" className="text-xs">
                                  {getUserDisplayName(userId)}
                                  <button
                                    type="button"
                                    onClick={() => removeUser(level, userId)}
                                    className="ml-1 text-xs hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="px-8 bg-[#C72030] hover:bg-[#C72030]/90"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Submit'}
              </Button>
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