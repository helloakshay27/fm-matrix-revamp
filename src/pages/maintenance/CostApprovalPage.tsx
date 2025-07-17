import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  APPROVAL_LEVELS, 
  COST_UNITS, 
  CostApprovalFormData, 
  CostApprovalPayload, 
  FMUserDropdown,
  CostUnit
} from '@/types/costApproval';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { createCostApproval } from '@/store/slices/costApprovalSlice';
import { AppDispatch, RootState } from '@/store/store';

const costApprovalSchema = z.object({
  costUnit: z.enum(['between', 'greater_than', 'greater_than_equal']),
  costFrom: z.number().optional(),
  costTo: z.number().min(1, 'Cost must be greater than 0'),
  approvalLevels: z.array(z.object({
    level: z.enum(['L1', 'L2', 'L3', 'L4', 'L5']),
    escalateToUsers: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
  })).length(5),
}).refine((data) => {
  if (data.costUnit === 'between' && (!data.costFrom || data.costFrom >= data.costTo)) {
    return false;
  }
  return true;
}, {
  message: "Cost from must be less than cost to when using 'between'",
  path: ["costFrom"],
});

export const CostApprovalPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'project' | 'fm'>('project');
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: number[] }>({});

  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers);
  const { loading: costApprovalLoading } = useSelector((state: RootState) => state.costApproval);

  const fmUsers: FMUserDropdown[] = fmUsersData?.fm_users || [];

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

  useEffect(() => {
    dispatch(fetchFMUsers());
  }, [dispatch]);

  const handleUserSelect = (level: string, userId: number) => {
    const currentUsers = selectedUsers[level] || [];
    if (!currentUsers.includes(userId) && currentUsers.length < 15) {
      const newUsers = [...currentUsers, userId];
      setSelectedUsers(prev => ({ ...prev, [level]: newUsers }));
      
      // Update form data
      const levelIndex = APPROVAL_LEVELS.indexOf(level as any);
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
    const levelIndex = APPROVAL_LEVELS.indexOf(level as any);
    const currentLevels = form.getValues('approvalLevels');
    currentLevels[levelIndex].escalateToUsers = newUsers;
    form.setValue('approvalLevels', currentLevels);
  };

  const getUserDisplayName = (userId: number): string => {
    const user = fmUsers.find(u => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : `User ${userId}`;
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

      // Reset form
      form.reset({
        costUnit: 'between',
        costFrom: undefined,
        costTo: 0,
        approvalLevels: createDefaultApprovalLevels(),
      });
      setSelectedUsers({});
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create cost approval rule',
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
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="costUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cost Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COST_UNITS.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
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
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                          <Select 
                            onValueChange={(value) => handleUserSelect(level, parseInt(value))}
                            disabled={fmUsersLoading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={
                                fmUsersLoading ? 'Loading users...' : 'Select up to 15 users...'
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {fmUsers
                                .filter(user => !(selectedUsers[level] || []).includes(user.id))
                                .map(user => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.firstname} {user.lastname}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          
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
                className="px-8"
                disabled={costApprovalLoading}
              >
                {costApprovalLoading ? 'Creating...' : 'Submit'}
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="fm">FM</TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="space-y-6">
          {renderForm()}
        </TabsContent>
        
        <TabsContent value="fm" className="space-y-6">
          {renderForm()}
        </TabsContent>
      </Tabs>
    </div>
  );
};