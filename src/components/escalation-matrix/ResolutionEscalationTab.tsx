import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  createResolutionEscalation, 
  fetchResolutionEscalations, 
  updateResolutionEscalation, 
  deleteResolutionEscalation,
  clearState 
} from '@/store/slices/resolutionEscalationSlice';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { useToast } from '@/hooks/use-toast';
import ReactSelect from 'react-select';

const resolutionEscalationSchema = z.object({
  categoryIds: z.array(z.number()).min(1, 'At least one category is required'),
  escalationLevels: z.object({
    e1: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.number().min(0),
        p2: z.number().min(0),
        p3: z.number().min(0),
        p4: z.number().min(0),
        p5: z.number().min(0),
      })
    }),
    e2: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.number().min(0),
        p2: z.number().min(0),
        p3: z.number().min(0),
        p4: z.number().min(0),
        p5: z.number().min(0),
      })
    }),
    e3: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.number().min(0),
        p2: z.number().min(0),
        p3: z.number().min(0),
        p4: z.number().min(0),
        p5: z.number().min(0),
      })
    }),
    e4: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.number().min(0),
        p2: z.number().min(0),
        p3: z.number().min(0),
        p4: z.number().min(0),
        p5: z.number().min(0),
      })
    }),
    e5: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.number().min(0),
        p2: z.number().min(0),
        p3: z.number().min(0),
        p4: z.number().min(0),
        p5: z.number().min(0),
      })
    }),
  })
});

type ResolutionEscalationFormData = z.infer<typeof resolutionEscalationSchema>;

export const ResolutionEscalationTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { 
    loading, 
    error, 
    success, 
    data: resolutionEscalations,
    fetchLoading,
    updateLoading,
    deleteLoading
  } = useAppSelector((state) => state.resolutionEscalation);
  
  const { data: categories, loading: categoriesLoading } = useAppSelector((state) => state.helpdeskCategories);
  const { data: fmUsers, loading: fmUsersLoading } = useAppSelector((state) => state.fmUsers);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [filteredRules, setFilteredRules] = useState(resolutionEscalations);
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set());
  const [editingRule, setEditingRule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    register
  } = useForm<ResolutionEscalationFormData>({
    resolver: zodResolver(resolutionEscalationSchema),
    defaultValues: {
      categoryIds: [],
      escalationLevels: {
        e1: { users: [], priorities: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 } },
        e2: { users: [], priorities: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 } },
        e3: { users: [], priorities: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 } },
        e4: { users: [], priorities: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 } },
        e5: { users: [], priorities: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 } },
      }
    }
  });

  // Load initial data
  useEffect(() => {
    dispatch(fetchHelpdeskCategories());
    dispatch(fetchFMUsers());
    dispatch(fetchResolutionEscalations());
  }, [dispatch]);

  // Handle success/error states
  useEffect(() => {
    if (success) {
      toast({ title: 'Success', description: 'Resolution escalation saved successfully' });
      reset();
      dispatch(clearState());
      dispatch(fetchResolutionEscalations());
    }
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      dispatch(clearState());
    }
  }, [success, error, toast, reset, dispatch]);

  // Filter rules based on selected category
  useEffect(() => {
    if (!selectedCategoryFilter || selectedCategoryFilter === 'all') {
      setFilteredRules(resolutionEscalations);
    } else {
      const categoryId = parseInt(selectedCategoryFilter);
      setFilteredRules(resolutionEscalations.filter(rule => rule.category_id === categoryId));
    }
  }, [selectedCategoryFilter, resolutionEscalations]);

  const onSubmit = async (data: ResolutionEscalationFormData) => {
    try {
      const payload = {
        complaint_worker: {
          society_id: 3584,
          esc_type: 'resolution',
          of_phase: 'pms',
          of_atype: 'Pms::Site',
        },
        category_ids: data.categoryIds,
        escalation_matrix: {
          e1: {
            name: 'E1',
            escalate_to_users: data.escalationLevels.e1.users,
            p1: data.escalationLevels.e1.priorities.p1,
            p2: data.escalationLevels.e1.priorities.p2,
            p3: data.escalationLevels.e1.priorities.p3,
            p4: data.escalationLevels.e1.priorities.p4,
            p5: data.escalationLevels.e1.priorities.p5,
          },
          e2: {
            name: 'E2',
            escalate_to_users: data.escalationLevels.e2.users,
            p1: data.escalationLevels.e2.priorities.p1,
            p2: data.escalationLevels.e2.priorities.p2,
            p3: data.escalationLevels.e2.priorities.p3,
            p4: data.escalationLevels.e2.priorities.p4,
            p5: data.escalationLevels.e2.priorities.p5,
          },
          e3: {
            name: 'E3',
            escalate_to_users: data.escalationLevels.e3.users,
            p1: data.escalationLevels.e3.priorities.p1,
            p2: data.escalationLevels.e3.priorities.p2,
            p3: data.escalationLevels.e3.priorities.p3,
            p4: data.escalationLevels.e3.priorities.p4,
            p5: data.escalationLevels.e3.priorities.p5,
          },
          e4: {
            name: 'E4',
            escalate_to_users: data.escalationLevels.e4.users,
            p1: data.escalationLevels.e4.priorities.p1,
            p2: data.escalationLevels.e4.priorities.p2,
            p3: data.escalationLevels.e4.priorities.p3,
            p4: data.escalationLevels.e4.priorities.p4,
            p5: data.escalationLevels.e4.priorities.p5,
          },
          e5: {
            name: 'E5',
            escalate_to_users: data.escalationLevels.e5.users,
            p1: data.escalationLevels.e5.priorities.p1,
            p2: data.escalationLevels.e5.priorities.p2,
            p3: data.escalationLevels.e5.priorities.p3,
            p4: data.escalationLevels.e5.priorities.p4,
            p5: data.escalationLevels.e5.priorities.p5,
          },
        }
      };

      await dispatch(createResolutionEscalation(payload));
    } catch (err) {
      console.error('Error creating resolution escalation:', err);
    }
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    
    // Helper function to safely parse escalate_to_users
    const safeParseUsers = (escalateToUsers: any): number[] => {
      if (!escalateToUsers) return [];
      try {
        if (typeof escalateToUsers === 'string') {
          return JSON.parse(escalateToUsers);
        } else if (Array.isArray(escalateToUsers)) {
          return escalateToUsers;
        }
      } catch (error) {
        console.error('Error parsing escalate_to_users in edit:', error);
      }
      return [];
    };
    
    // Pre-populate form with existing data
    const formData: ResolutionEscalationFormData = {
      categoryIds: [rule.category_id],
      escalationLevels: {
        e1: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E1')?.escalate_to_users),
          priorities: {
            p1: rule.escalations.find((e: any) => e.name === 'E1')?.p1 || 0,
            p2: rule.escalations.find((e: any) => e.name === 'E1')?.p2 || 0,
            p3: rule.escalations.find((e: any) => e.name === 'E1')?.p3 || 0,
            p4: rule.escalations.find((e: any) => e.name === 'E1')?.p4 || 0,
            p5: rule.escalations.find((e: any) => e.name === 'E1')?.p5 || 0,
          }
        },
        e2: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E2')?.escalate_to_users),
          priorities: {
            p1: rule.escalations.find((e: any) => e.name === 'E2')?.p1 || 0,
            p2: rule.escalations.find((e: any) => e.name === 'E2')?.p2 || 0,
            p3: rule.escalations.find((e: any) => e.name === 'E2')?.p3 || 0,
            p4: rule.escalations.find((e: any) => e.name === 'E2')?.p4 || 0,
            p5: rule.escalations.find((e: any) => e.name === 'E2')?.p5 || 0,
          }
        },
        e3: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E3')?.escalate_to_users),
          priorities: {
            p1: rule.escalations.find((e: any) => e.name === 'E3')?.p1 || 0,
            p2: rule.escalations.find((e: any) => e.name === 'E3')?.p2 || 0,
            p3: rule.escalations.find((e: any) => e.name === 'E3')?.p3 || 0,
            p4: rule.escalations.find((e: any) => e.name === 'E3')?.p4 || 0,
            p5: rule.escalations.find((e: any) => e.name === 'E3')?.p5 || 0,
          }
        },
        e4: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E4')?.escalate_to_users),
          priorities: {
            p1: rule.escalations.find((e: any) => e.name === 'E4')?.p1 || 0,
            p2: rule.escalations.find((e: any) => e.name === 'E4')?.p2 || 0,
            p3: rule.escalations.find((e: any) => e.name === 'E4')?.p3 || 0,
            p4: rule.escalations.find((e: any) => e.name === 'E4')?.p4 || 0,
            p5: rule.escalations.find((e: any) => e.name === 'E4')?.p5 || 0,
          }
        },
        e5: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E5')?.escalate_to_users),
          priorities: {
            p1: rule.escalations.find((e: any) => e.name === 'E5')?.p1 || 0,
            p2: rule.escalations.find((e: any) => e.name === 'E5')?.p2 || 0,
            p3: rule.escalations.find((e: any) => e.name === 'E5')?.p3 || 0,
            p4: rule.escalations.find((e: any) => e.name === 'E5')?.p4 || 0,
            p5: rule.escalations.find((e: any) => e.name === 'E5')?.p5 || 0,
          }
        },
      }
    };

    reset(formData);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: ResolutionEscalationFormData) => {
    if (!editingRule) return;

    try {
      const payload = {
        id: editingRule.id,
        complaint_worker: {
          category_id: data.categoryIds[0],
        },
        escalation_matrix: {
          e1: {
            name: 'E1',
            escalate_to_users: data.escalationLevels.e1.users,
            p1: data.escalationLevels.e1.priorities.p1,
            p2: data.escalationLevels.e1.priorities.p2,
            p3: data.escalationLevels.e1.priorities.p3,
            p4: data.escalationLevels.e1.priorities.p4,
            p5: data.escalationLevels.e1.priorities.p5,
          },
          e2: {
            name: 'E2',
            escalate_to_users: data.escalationLevels.e2.users,
            p1: data.escalationLevels.e2.priorities.p1,
            p2: data.escalationLevels.e2.priorities.p2,
            p3: data.escalationLevels.e2.priorities.p3,
            p4: data.escalationLevels.e2.priorities.p4,
            p5: data.escalationLevels.e2.priorities.p5,
          },
          e3: {
            name: 'E3',
            escalate_to_users: data.escalationLevels.e3.users,
            p1: data.escalationLevels.e3.priorities.p1,
            p2: data.escalationLevels.e3.priorities.p2,
            p3: data.escalationLevels.e3.priorities.p3,
            p4: data.escalationLevels.e3.priorities.p4,
            p5: data.escalationLevels.e3.priorities.p5,
          },
          e4: {
            name: 'E4',
            escalate_to_users: data.escalationLevels.e4.users,
            p1: data.escalationLevels.e4.priorities.p1,
            p2: data.escalationLevels.e4.priorities.p2,
            p3: data.escalationLevels.e4.priorities.p3,
            p4: data.escalationLevels.e4.priorities.p4,
            p5: data.escalationLevels.e4.priorities.p5,
          },
          e5: {
            name: 'E5',
            escalate_to_users: data.escalationLevels.e5.users,
            p1: data.escalationLevels.e5.priorities.p1,
            p2: data.escalationLevels.e5.priorities.p2,
            p3: data.escalationLevels.e5.priorities.p3,
            p4: data.escalationLevels.e5.priorities.p4,
            p5: data.escalationLevels.e5.priorities.p5,
          },
        }
      };

      await dispatch(updateResolutionEscalation(payload));
      setIsEditDialogOpen(false);
      setEditingRule(null);
      dispatch(fetchResolutionEscalations());
    } catch (err) {
      console.error('Error updating resolution escalation:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteResolutionEscalation(id));
      toast({ title: 'Success', description: 'Resolution escalation deleted successfully' });
    } catch (err) {
      console.error('Error deleting resolution escalation:', err);
    }
  };

  const handleFilter = () => {
    // Filter is applied automatically through useEffect
  };

  const handleResetFilter = () => {
    setSelectedCategoryFilter('');
  };

  const toggleRuleExpansion = (ruleId: number) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  // Options for react-select
  const categoryOptions = categories?.helpdesk_categories?.map(cat => ({ value: cat.id, label: cat.name })) || [];
  const userOptions = fmUsers?.fm_users?.map(user => ({ value: user.id, label: `${user.firstname} ${user.lastname}` })) || [];

  const escalationLevels = ['e1', 'e2', 'e3', 'e4', 'e5'] as const;
  const priorities = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Select up to 15 Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <div>
              <ReactSelect
                isMulti
                options={categoryOptions}
                onChange={(selected) => {
                  setValue('categoryIds', selected ? selected.map(s => s.value) : []);
                }}
                className="mt-1"
                placeholder="Select categories..."
                isLoading={categoriesLoading}
              />
              {errors.categoryIds && (
                <p className="text-sm text-red-500 mt-1">{errors.categoryIds.message}</p>
              )}
            </div>

            {/* Escalation Matrix Table */}
            <div>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-center border-r">Levels</TableHead>
                    <TableHead className="font-semibold text-center border-r">Escalation To</TableHead>
                    <TableHead className="font-semibold text-center border-r">P1</TableHead>
                    <TableHead className="font-semibold text-center border-r">P2</TableHead>
                    <TableHead className="font-semibold text-center border-r">P3</TableHead>
                    <TableHead className="font-semibold text-center border-r">P4</TableHead>
                    <TableHead className="font-semibold text-center">P5</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalationLevels.map((level) => (
                    <TableRow key={level} className="border-b">
                      <TableCell className="font-medium text-center border-r">{level.toUpperCase()}</TableCell>
                      <TableCell className="p-2 border-r">
                        <ReactSelect
                          isMulti
                          options={userOptions}
                          onChange={(selected) => {
                            setValue(`escalationLevels.${level}.users`, selected ? selected.map(s => s.value) : []);
                          }}
                          placeholder="Select up to 15 Options..."
                          isLoading={fmUsersLoading}
                          className="min-w-[250px]"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '32px',
                              fontSize: '14px',
                              border: 'none',
                              boxShadow: 'none'
                            }),
                            multiValue: (base) => ({
                              ...base,
                              fontSize: '12px'
                            })
                          }}
                        />
                      </TableCell>
                      {priorities.map((priority) => (
                        <TableCell key={priority} className="p-2 text-center border-r last:border-r-0">
                          <Input
                            type="number"
                            min="0"
                            {...register(`escalationLevels.${level}.priorities.${priority}`, { valueAsNumber: true })}
                            className="w-16 h-8 text-center text-sm border-none focus-visible:ring-0"
                            placeholder="0"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                {loading ? 'Creating...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">Category Type</Label>
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.helpdesk_categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleFilter} variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
                Apply
              </Button>
              <Button onClick={handleResetFilter} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Display */}
      <Card>
        <CardContent className="p-0">
          {fetchLoading ? (
            <div className="text-center py-8">Loading rules...</div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No resolution escalation rules found</div>
          ) : (
            <div className="space-y-0">
              {filteredRules.map((rule, index) => {
                const isExpanded = expandedRules.has(rule.id);
                const categoryName = categories?.helpdesk_categories?.find(cat => cat.id === rule.category_id)?.name || 'Unknown';
                
                return (
                  <div key={rule.id} className="border-b last:border-b-0">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-purple-600">Rule {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRuleExpansion(rule.id)}
                            className="p-1"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                            disabled={updateLoading}
                            className="p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={deleteLoading} className="p-1 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this resolution escalation rule? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(rule.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>

                    <Collapsible open={isExpanded}>
                      <CollapsibleContent>
                        <div className="p-4 bg-gray-50 border-t">
                          <div className="mb-4">
                            <div className="flex items-center space-x-4 text-sm">
                              <span><strong>Category Type:</strong> {categoryName}</span>
                            </div>
                          </div>
                          
                          <Table className="bg-white border">
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                <TableHead className="font-semibold text-center w-20 border-r">Levels</TableHead>
                                <TableHead className="font-semibold text-center border-r">Escalation To</TableHead>
                                <TableHead className="font-semibold text-center w-32 border-r">P1</TableHead>
                                <TableHead className="font-semibold text-center w-32 border-r">P2</TableHead>
                                <TableHead className="font-semibold text-center w-32 border-r">P3</TableHead>
                                <TableHead className="font-semibold text-center w-32 border-r">P4</TableHead>
                                <TableHead className="font-semibold text-center w-32">P5</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rule.escalations.map((escalation) => {
                                // Safely parse escalate_to_users with error handling
                                let escalateToUsers: number[] = [];
                                if (escalation.escalate_to_users) {
                                  try {
                                    if (typeof escalation.escalate_to_users === 'string') {
                                      escalateToUsers = JSON.parse(escalation.escalate_to_users);
                                    } else if (Array.isArray(escalation.escalate_to_users)) {
                                      escalateToUsers = escalation.escalate_to_users;
                                    }
                                  } catch (error) {
                                    console.error('Error parsing escalate_to_users:', error);
                                    escalateToUsers = [];
                                  }
                                }
                                
                                // Ensure escalateToUsers is an array before mapping
                                const userNames = Array.isArray(escalateToUsers) 
                                  ? escalateToUsers.map((userId: number) => {
                                      const user = fmUsers?.fm_users?.find(u => u.id === userId);
                                      return user ? `${user.firstname} ${user.lastname}` : `User ${userId}`;
                                    }).join(', ')
                                  : '';

                                return (
                                  <TableRow key={escalation.id} className="border-b">
                                    <TableCell className="font-medium text-center border-r">{escalation.name}</TableCell>
                                    <TableCell className="text-center border-r">{userNames || '-'}</TableCell>
                                    <TableCell className="text-center text-sm border-r">
                                      {escalation.p1 ? `${escalation.p1} min` : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm border-r">
                                      {escalation.p2 ? `${escalation.p2} min` : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm border-r">
                                      {escalation.p3 ? `${escalation.p3} min` : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm border-r">
                                      {escalation.p4 ? `${escalation.p4} min` : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                      {escalation.p5 ? `${escalation.p5} min` : '-'}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
            {/* Category Selection */}
            <div>
              <Label className="text-sm font-medium">Category Type</Label>
              <ReactSelect
                options={categoryOptions}
                value={categoryOptions.filter(option => watch('categoryIds')?.includes(option.value))}
                onChange={(selected) => {
                  setValue('categoryIds', selected ? [selected.value] : []);
                }}
                className="mt-1"
                placeholder="Select category..."
                isLoading={categoriesLoading}
              />
            </div>

            {/* Escalation Matrix Table */}
            <div>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-center border-r">Levels</TableHead>
                    <TableHead className="font-semibold text-center border-r">Escalation To</TableHead>
                    <TableHead className="font-semibold text-center border-r">P1</TableHead>
                    <TableHead className="font-semibold text-center border-r">P2</TableHead>
                    <TableHead className="font-semibold text-center border-r">P3</TableHead>
                    <TableHead className="font-semibold text-center border-r">P4</TableHead>
                    <TableHead className="font-semibold text-center">P5</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalationLevels.map((level) => (
                    <TableRow key={level} className="border-b">
                      <TableCell className="font-medium text-center border-r">{level.toUpperCase()}</TableCell>
                      <TableCell className="p-2 border-r">
                        <ReactSelect
                          isMulti
                          options={userOptions}
                          value={userOptions.filter(option => watch(`escalationLevels.${level}.users`)?.includes(option.value))}
                          onChange={(selected) => {
                            setValue(`escalationLevels.${level}.users`, selected ? selected.map(s => s.value) : []);
                          }}
                          placeholder="Select up to 15 Options..."
                          isLoading={fmUsersLoading}
                          className="min-w-[250px]"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '32px',
                              fontSize: '14px',
                              border: 'none',
                              boxShadow: 'none'
                            }),
                            multiValue: (base) => ({
                              ...base,
                              fontSize: '12px'
                            })
                          }}
                        />
                      </TableCell>
                      {priorities.map((priority) => (
                        <TableCell key={priority} className="p-2 text-center border-r last:border-r-0">
                          <Input
                            type="number"
                            min="0"
                            {...register(`escalationLevels.${level}.priorities.${priority}`, { valueAsNumber: true })}
                            className="w-16 h-8 text-center text-sm border-none focus-visible:ring-0"
                            placeholder="0"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {updateLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};