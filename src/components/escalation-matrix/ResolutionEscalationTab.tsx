import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, ChevronDown, ChevronUp, Filter, Eye, EyeOff, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { RootState, AppDispatch } from '@/store/store';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { createResolutionEscalation } from '@/store/slices/resolutionEscalationSlice';
import { EscalationLevel, PriorityTiming, ResolutionEscalationRule, ESCALATION_LEVELS, PRIORITY_LEVELS, ResolutionEscalationApiFormData, ResolutionEscalationMatrixPayload, FMUserDropdown } from '@/types/escalationMatrix';

// Schema for form validation
const resolutionEscalationSchema = z.object({
  categoryIds: z.array(z.number()).min(1, 'At least one category is required').max(15, 'Maximum 15 categories allowed'),
  escalationLevels: z.object({
    e1: z.object({
      users: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
      priorities: z.object({
        p1: z.object({
          days: z.number().min(0),
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
        }),
        p2: z.object({
          days: z.number().min(0),
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
        }),
        p3: z.object({
          days: z.number().min(0),
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
        }),
        p4: z.object({
          days: z.number().min(0),
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
        }),
        p5: z.object({
          days: z.number().min(0),
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
        }),
      }),
    }),
    e2: z.object({
      users: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      }),
    }),
    e3: z.object({
      users: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      }),
    }),
    e4: z.object({
      users: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      }),
    }),
    e5: z.object({
      users: z.array(z.number()).max(15, 'Maximum 15 users allowed per level'),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      }),
    }),
  }),
});

type ResolutionEscalationFormData = z.infer<typeof resolutionEscalationSchema>;

export const ResolutionEscalationTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.helpdeskCategories);
  const { data: fmUsersData, loading: fmUsersLoading, error: fmUsersError } = useSelector((state: RootState) => state.fmUsers);
  const { loading: submitting, error: submitError } = useSelector((state: RootState) => state.resolutionEscalation);

  // Local state
  const [rules, setRules] = useState<ResolutionEscalationRule[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{
    e1: number[];
    e2: number[];
    e3: number[];
    e4: number[];
    e5: number[];
  }>({
    e1: [],
    e2: [],
    e3: [],
    e4: [],
    e5: [],
  });

  // Get FM users as dropdown options
  const fmUsers: FMUserDropdown[] = React.useMemo(() => {
    if (!fmUsersData?.fm_users) return [];
    return fmUsersData.fm_users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      displayName: `${user.firstname} ${user.lastname}`
    }));
  }, [fmUsersData]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchHelpdeskCategories());
    dispatch(fetchFMUsers());
  }, [dispatch]);

  // Helper function to convert time to total minutes
  const convertToMinutes = (days: number, hours: number, minutes: number): number => {
    return (days * 24 * 60) + (hours * 60) + minutes;
  };

  // Helper function to create default priority timings
  const createDefaultPriorityTimings = () => ({
    p1: { days: 0, hours: 0, minutes: 0 },
    p2: { days: 0, hours: 0, minutes: 0 },
    p3: { days: 0, hours: 0, minutes: 0 },
    p4: { days: 0, hours: 0, minutes: 0 },
    p5: { days: 0, hours: 0, minutes: 0 },
  });

  // Form setup
  const form = useForm<ResolutionEscalationFormData>({
    resolver: zodResolver(resolutionEscalationSchema),
    defaultValues: {
      categoryIds: [],
      escalationLevels: {
        e1: { users: [], priorities: createDefaultPriorityTimings() },
        e2: { users: [], priorities: createDefaultPriorityTimings() },
        e3: { users: [], priorities: createDefaultPriorityTimings() },
        e4: { users: [], priorities: createDefaultPriorityTimings() },
        e5: { users: [], priorities: createDefaultPriorityTimings() },
      },
    },
  });

  // Handle form submission
  const handleSubmit = async (data: ResolutionEscalationFormData) => {
    try {
      // Get society_id from localStorage
      const societyId = JSON.parse(localStorage.getItem('selectedSiteId') || '0');
      
      if (!societyId) {
        toast.error('Site ID not found. Please select a site.');
        return;
      }

      // Transform form data to API payload
      const payload: ResolutionEscalationMatrixPayload = {
        complaint_worker: {
          society_id: societyId,
          esc_type: 'resolution',
          of_phase: 'pms',
          of_atype: 'Pms::Site',
        },
        category_ids: data.categoryIds,
        escalation_matrix: {
          e1: {
            name: 'E1',
            escalate_to_users: data.escalationLevels.e1.users,
            p1: convertToMinutes(data.escalationLevels.e1.priorities.p1.days, data.escalationLevels.e1.priorities.p1.hours, data.escalationLevels.e1.priorities.p1.minutes),
            p2: convertToMinutes(data.escalationLevels.e1.priorities.p2.days, data.escalationLevels.e1.priorities.p2.hours, data.escalationLevels.e1.priorities.p2.minutes),
            p3: convertToMinutes(data.escalationLevels.e1.priorities.p3.days, data.escalationLevels.e1.priorities.p3.hours, data.escalationLevels.e1.priorities.p3.minutes),
            p4: convertToMinutes(data.escalationLevels.e1.priorities.p4.days, data.escalationLevels.e1.priorities.p4.hours, data.escalationLevels.e1.priorities.p4.minutes),
            p5: convertToMinutes(data.escalationLevels.e1.priorities.p5.days, data.escalationLevels.e1.priorities.p5.hours, data.escalationLevels.e1.priorities.p5.minutes),
          },
          e2: {
            name: 'E2',
            escalate_to_users: data.escalationLevels.e2.users,
            p1: convertToMinutes(data.escalationLevels.e2.priorities.p1.days, data.escalationLevels.e2.priorities.p1.hours, data.escalationLevels.e2.priorities.p1.minutes),
            p2: convertToMinutes(data.escalationLevels.e2.priorities.p2.days, data.escalationLevels.e2.priorities.p2.hours, data.escalationLevels.e2.priorities.p2.minutes),
            p3: convertToMinutes(data.escalationLevels.e2.priorities.p3.days, data.escalationLevels.e2.priorities.p3.hours, data.escalationLevels.e2.priorities.p3.minutes),
            p4: convertToMinutes(data.escalationLevels.e2.priorities.p4.days, data.escalationLevels.e2.priorities.p4.hours, data.escalationLevels.e2.priorities.p4.minutes),
            p5: convertToMinutes(data.escalationLevels.e2.priorities.p5.days, data.escalationLevels.e2.priorities.p5.hours, data.escalationLevels.e2.priorities.p5.minutes),
          },
          e3: {
            name: 'E3',
            escalate_to_users: data.escalationLevels.e3.users,
            p1: convertToMinutes(data.escalationLevels.e3.priorities.p1.days, data.escalationLevels.e3.priorities.p1.hours, data.escalationLevels.e3.priorities.p1.minutes),
            p2: convertToMinutes(data.escalationLevels.e3.priorities.p2.days, data.escalationLevels.e3.priorities.p2.hours, data.escalationLevels.e3.priorities.p2.minutes),
            p3: convertToMinutes(data.escalationLevels.e3.priorities.p3.days, data.escalationLevels.e3.priorities.p3.hours, data.escalationLevels.e3.priorities.p3.minutes),
            p4: convertToMinutes(data.escalationLevels.e3.priorities.p4.days, data.escalationLevels.e3.priorities.p4.hours, data.escalationLevels.e3.priorities.p4.minutes),
            p5: convertToMinutes(data.escalationLevels.e3.priorities.p5.days, data.escalationLevels.e3.priorities.p5.hours, data.escalationLevels.e3.priorities.p5.minutes),
          },
          e4: {
            name: 'E4',
            escalate_to_users: data.escalationLevels.e4.users,
            p1: convertToMinutes(data.escalationLevels.e4.priorities.p1.days, data.escalationLevels.e4.priorities.p1.hours, data.escalationLevels.e4.priorities.p1.minutes),
            p2: convertToMinutes(data.escalationLevels.e4.priorities.p2.days, data.escalationLevels.e4.priorities.p2.hours, data.escalationLevels.e4.priorities.p2.minutes),
            p3: convertToMinutes(data.escalationLevels.e4.priorities.p3.days, data.escalationLevels.e4.priorities.p3.hours, data.escalationLevels.e4.priorities.p3.minutes),
            p4: convertToMinutes(data.escalationLevels.e4.priorities.p4.days, data.escalationLevels.e4.priorities.p4.hours, data.escalationLevels.e4.priorities.p4.minutes),
            p5: convertToMinutes(data.escalationLevels.e4.priorities.p5.days, data.escalationLevels.e4.priorities.p5.hours, data.escalationLevels.e4.priorities.p5.minutes),
          },
          e5: {
            name: 'E5',
            escalate_to_users: data.escalationLevels.e5.users,
            p1: convertToMinutes(data.escalationLevels.e5.priorities.p1.days, data.escalationLevels.e5.priorities.p1.hours, data.escalationLevels.e5.priorities.p1.minutes),
            p2: convertToMinutes(data.escalationLevels.e5.priorities.p2.days, data.escalationLevels.e5.priorities.p2.hours, data.escalationLevels.e5.priorities.p2.minutes),
            p3: convertToMinutes(data.escalationLevels.e5.priorities.p3.days, data.escalationLevels.e5.priorities.p3.hours, data.escalationLevels.e5.priorities.p3.minutes),
            p4: convertToMinutes(data.escalationLevels.e5.priorities.p4.days, data.escalationLevels.e5.priorities.p4.hours, data.escalationLevels.e5.priorities.p4.minutes),
            p5: convertToMinutes(data.escalationLevels.e5.priorities.p5.days, data.escalationLevels.e5.priorities.p5.hours, data.escalationLevels.e5.priorities.p5.minutes),
          },
        },
      };

      const result = await dispatch(createResolutionEscalation(payload)).unwrap();
      
      toast.success('Resolution escalation rule created successfully!');
      
      // Reset form and local state
      form.reset({
        categoryIds: [],
        escalationLevels: {
          e1: { users: [], priorities: createDefaultPriorityTimings() },
          e2: { users: [], priorities: createDefaultPriorityTimings() },
          e3: { users: [], priorities: createDefaultPriorityTimings() },
          e4: { users: [], priorities: createDefaultPriorityTimings() },
          e5: { users: [], priorities: createDefaultPriorityTimings() },
        },
      });
      setSelectedCategories([]);
      setSelectedUsers({
        e1: [],
        e2: [],
        e3: [],
        e4: [],
        e5: [],
      });

    } catch (error: any) {
      toast.error(error.message || 'Failed to create resolution escalation rule');
    }
  };

  // Helper functions for multi-select
  const getCategoryName = (id: number) => {
    return categoriesData?.helpdesk_categories?.find(cat => cat.id === id)?.name || 'Unknown Category'
  }

  const getUserName = (id: number) => {
    return fmUsers.find(user => user.id === id)?.displayName || 'Unknown User'
  }

  const availableCategories = categoriesData?.helpdesk_categories?.filter(
    cat => !selectedCategories.includes(cat.id)
  ) || []

  const availableUsers = (level: keyof typeof selectedUsers) => {
    return fmUsers.filter(user => !selectedUsers[level].includes(user.id))
  }

  const addCategory = (categoryId: number) => {
    if (selectedCategories.length < 15) {
      const newCategories = [...selectedCategories, categoryId]
      setSelectedCategories(newCategories)
      form.setValue('categoryIds', newCategories)
    }
  }

  const removeCategory = (categoryId: number) => {
    const newCategories = selectedCategories.filter(id => id !== categoryId)
    setSelectedCategories(newCategories)
    form.setValue('categoryIds', newCategories)
  }

  const addUser = (level: keyof typeof selectedUsers, userId: number) => {
    if (selectedUsers[level].length < 15) {
      const newUsers = [...selectedUsers[level], userId]
      setSelectedUsers(prev => ({ ...prev, [level]: newUsers }))
      form.setValue(`escalationLevels.${level}.users`, newUsers)
    }
  }

  const removeUser = (level: keyof typeof selectedUsers, userId: number) => {
    const newUsers = selectedUsers[level].filter(id => id !== userId)
    setSelectedUsers(prev => ({ ...prev, [level]: newUsers }))
    form.setValue(`escalationLevels.${level}.users`, newUsers)
  }

  // Toggle rule expansion
  const toggleRuleExpansion = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  // Filter rules based on category
  const filteredRules = selectedCategoryFilter === 'all' 
    ? rules 
    : rules.filter(rule => rule.categoryType === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create Resolution Escalation Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Category Type Selection */}
            <div className="space-y-2">
              <Label>Category Type (max 15)</Label>
              
              {/* Category Selection Dropdown */}
              <Select
                onValueChange={(value) => addCategory(parseInt(value))}
                disabled={categoriesLoading || selectedCategories.length >= 15}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    categoriesLoading 
                      ? "Loading categories..." 
                      : selectedCategories.length >= 15
                      ? "Maximum categories selected"
                      : "Select categories"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Categories */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((categoryId) => (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {getCategoryName(categoryId)}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCategory(categoryId)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {selectedCategories.length}/15 categories selected
              </p>

              {form.formState.errors.categoryIds && (
                <p className="text-sm text-red-600">{form.formState.errors.categoryIds.message}</p>
              )}
            </div>

            {/* Escalation Levels */}
            <div className="space-y-4">
              <Label>Escalation Levels & Priority Timings</Label>
              {ESCALATION_LEVELS.map((level) => {
                const levelKey = level.toLowerCase() as keyof typeof selectedUsers;
                return (
                  <Card key={level} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lg">{level}</h4>
                    </div>
                    
                    {/* User Selection for this level */}
                    <div className="space-y-3 mb-4">
                      <Label>Escalate To Users (max 15)</Label>
                      
                      <Select
                        onValueChange={(value) => addUser(levelKey, parseInt(value))}
                        disabled={fmUsersLoading || selectedUsers[levelKey].length >= 15}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            fmUsersLoading 
                              ? "Loading users..." 
                              : selectedUsers[levelKey].length >= 15
                              ? "Maximum users selected"
                              : "Select users"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers(levelKey).map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Selected Users */}
                      {selectedUsers[levelKey].length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers[levelKey].map((userId) => (
                            <Badge key={userId} variant="outline" className="flex items-center gap-1">
                              {getUserName(userId)}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeUser(levelKey, userId)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        {selectedUsers[levelKey].length}/15 users selected
                      </p>
                    </div>

                    {/* Priority Timings for this level */}
                    <div className="space-y-3">
                      <Label>Priority Timings</Label>
                      {PRIORITY_LEVELS.map((priority) => {
                        const priorityKey = priority.toLowerCase() as 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
                        return (
                          <div key={priority} className="grid grid-cols-4 gap-4 items-center">
                            <Label className="font-medium">{priority}</Label>
                            <div className="space-y-1">
                              <Label className="text-xs">Days</Label>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...form.register(`escalationLevels.${levelKey}.priorities.${priorityKey}.days`, { valueAsNumber: true })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Hours</Label>
                              <Input
                                type="number"
                                min="0"
                                max="23"
                                placeholder="0"
                                {...form.register(`escalationLevels.${levelKey}.priorities.${priorityKey}.hours`, { valueAsNumber: true })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Minutes</Label>
                              <Input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="0"
                                {...form.register(`escalationLevels.${levelKey}.priorities.${priorityKey}.minutes`, { valueAsNumber: true })}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Resolution Escalation Rule'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Category Type</Label>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.helpdesk_categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                Apply
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategoryFilter('all')}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Rules Table */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No resolution escalation rules found. Create your first rule above.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRules.map((rule, index) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Rule {index + 1}</span>
                    <Badge variant="outline">{rule.categoryType}</Badge>
                    <Badge variant={rule.active ? "default" : "secondary"}>
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRuleExpansion(rule.id)}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedRules.has(rule.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              
              {expandedRules.has(rule.id) && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Escalation Levels</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border-r px-4 py-3 text-left font-medium">Level</th>
                              <th className="px-4 py-3 text-left font-medium">Escalation To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rule.escalationLevels.map((level) => (
                              <tr key={level.level} className="border-t">
                                <td className="border-r px-4 py-3 font-medium">{level.level}</td>
                                <td className="px-4 py-3">{level.escalationTo}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created by {rule.createdBy} on {new Date(rule.createdOn).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
