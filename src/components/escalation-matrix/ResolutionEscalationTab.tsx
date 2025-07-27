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
      })
    }),
    e2: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      })
    }),
    e3: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      })
    }),
    e4: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
      })
    }),
    e5: z.object({
      users: z.array(z.number()),
      priorities: z.object({
        p1: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p2: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p3: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p4: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
        p5: z.object({ days: z.number().min(0), hours: z.number().min(0).max(23), minutes: z.number().min(0).max(59) }),
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
        e1: { users: [], priorities: { 
          p1: { days: 0, hours: 0, minutes: 0 }, 
          p2: { days: 0, hours: 0, minutes: 0 }, 
          p3: { days: 0, hours: 0, minutes: 0 }, 
          p4: { days: 0, hours: 0, minutes: 0 }, 
          p5: { days: 0, hours: 0, minutes: 0 } 
        }},
        e2: { users: [], priorities: { 
          p1: { days: 0, hours: 0, minutes: 0 }, 
          p2: { days: 0, hours: 0, minutes: 0 }, 
          p3: { days: 0, hours: 0, minutes: 0 }, 
          p4: { days: 0, hours: 0, minutes: 0 }, 
          p5: { days: 0, hours: 0, minutes: 0 } 
        }},
        e3: { users: [], priorities: { 
          p1: { days: 0, hours: 0, minutes: 0 }, 
          p2: { days: 0, hours: 0, minutes: 0 }, 
          p3: { days: 0, hours: 0, minutes: 0 }, 
          p4: { days: 0, hours: 0, minutes: 0 }, 
          p5: { days: 0, hours: 0, minutes: 0 } 
        }},
        e4: { users: [], priorities: { 
          p1: { days: 0, hours: 0, minutes: 0 }, 
          p2: { days: 0, hours: 0, minutes: 0 }, 
          p3: { days: 0, hours: 0, minutes: 0 }, 
          p4: { days: 0, hours: 0, minutes: 0 }, 
          p5: { days: 0, hours: 0, minutes: 0 } 
        }},
        e5: { users: [], priorities: { 
          p1: { days: 0, hours: 0, minutes: 0 }, 
          p2: { days: 0, hours: 0, minutes: 0 }, 
          p3: { days: 0, hours: 0, minutes: 0 }, 
          p4: { days: 0, hours: 0, minutes: 0 }, 
          p5: { days: 0, hours: 0, minutes: 0 } 
        }},
      }
    }
  });

  // Helper function to convert day/hour/minute to total minutes
  const convertToMinutes = (days: number, hours: number, minutes: number): number => {
    return (days * 24 * 60) + (hours * 60) + minutes;
  };

  // Helper function to convert total minutes to day/hour/minute
  const convertFromMinutes = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  };

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
            p1: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E1')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E1')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E1')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E1')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E1')?.p5 || 0),
          }
        },
        e2: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E2')?.escalate_to_users),
          priorities: {
            p1: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E2')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E2')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E2')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E2')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E2')?.p5 || 0),
          }
        },
        e3: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E3')?.escalate_to_users),
          priorities: {
            p1: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E3')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E3')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E3')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E3')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E3')?.p5 || 0),
          }
        },
        e4: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E4')?.escalate_to_users),
          priorities: {
            p1: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E4')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E4')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E4')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E4')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E4')?.p5 || 0),
          }
        },
        e5: {
          users: safeParseUsers(rule.escalations.find((e: any) => e.name === 'E5')?.escalate_to_users),
          priorities: {
            p1: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E5')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E5')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E5')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E5')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find((e: any) => e.name === 'E5')?.p5 || 0),
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

  // Helper function to get user names display
  const getUserNames = (escalateToUsers: any): string => {
    if (!escalateToUsers) return '';
    
    let userIds: number[] = [];
    try {
      if (typeof escalateToUsers === 'string') {
        userIds = JSON.parse(escalateToUsers);
      } else if (Array.isArray(escalateToUsers)) {
        userIds = escalateToUsers;
      }
    } catch (error) {
      console.error('Error parsing escalate_to_users:', error);
      return '';
    }
    
    if (!Array.isArray(userIds) || userIds.length === 0) return '';
    
    return userIds.map((userId: number) => {
      const user = fmUsers?.fm_users?.find(u => u.id === userId);
      return user ? `${user.firstname} ${user.lastname}` : `User ${userId}`;
    }).join(', ');
  };

  // Helper function to format time display 
  const formatTimeDisplay = (totalMinutes: number): string => {
    if (!totalMinutes || totalMinutes === 0) return '';
    
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    
    return parts.join(', ') || '';
  };

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
                placeholder="Select up to 15 Options..."
                isLoading={categoriesLoading}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    zIndex: 10
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    zIndex: 50
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 50
                  })
                }}
                menuPortalTarget={document.body}
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
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P1</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P2</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P3</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P4</TableHead>
                    <TableHead className="font-semibold text-center" colSpan={3}>P5</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    <TableHead className="border-r"></TableHead>
                    <TableHead className="border-r"></TableHead>
                    {priorities.map((priority) => (
                      <React.Fragment key={priority}>
                        <TableHead className="text-center text-xs border-r">Day</TableHead>
                        <TableHead className="text-center text-xs border-r">Hrs</TableHead>
                        <TableHead className="text-center text-xs border-r">Min</TableHead>
                      </React.Fragment>
                    ))}
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
                              boxShadow: 'none',
                              backgroundColor: 'white',
                              zIndex: 10
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: 'white',
                              zIndex: 50
                            }),
                            multiValue: (base) => ({
                              ...base,
                              fontSize: '12px'
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 50
                            })
                          }}
                          menuPortalTarget={document.body}
                        />
                      </TableCell>
                      {priorities.map((priority) => (
                        <React.Fragment key={priority}>
                          <TableCell className="p-1 border-r">
                            <Input
                              type="number"
                              min="0"
                              {...register(`escalationLevels.${level}.priorities.${priority}.days` as const, { valueAsNumber: true })}
                              className="w-16 h-8 text-center"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="p-1 border-r">
                            <Input
                              type="number"
                              min="0"
                              max="23"
                              {...register(`escalationLevels.${level}.priorities.${priority}.hours` as const, { valueAsNumber: true })}
                              className="w-16 h-8 text-center"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="p-1 border-r">
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              {...register(`escalationLevels.${level}.priorities.${priority}.minutes` as const, { valueAsNumber: true })}
                              className="w-16 h-8 text-center"
                              placeholder="0"
                            />
                          </TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-[#C72030] hover:bg-[#A11B2B] text-white">
                {loading ? 'Creating...' : 'Create'}
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
                <SelectContent className="bg-white z-50">
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
              <Button 
                onClick={handleFilter} 
                className="bg-[#C72030] hover:bg-[#A11B2B] text-white"
              >
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
      <div className="space-y-4">
        {fetchLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">Loading rules...</div>
            </CardContent>
          </Card>
        ) : filteredRules.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-gray-500">No resolution escalation rules found</div>
            </CardContent>
          </Card>
        ) : (
          filteredRules.map((rule, index) => {
            const categoryName = categories?.helpdesk_categories?.find(cat => cat.id === rule.category_id)?.name || 'Unknown';
            
            return (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                          📋
                        </span>
                        <span>Rule {index + 1}</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(rule)}
                        disabled={updateLoading}
                        className="p-1 hover:bg-yellow-100"
                      >
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={deleteLoading} 
                            className="p-1 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
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
                </CardHeader>
                <CardContent className="pt-0">
                  <Table className="border">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold border-r">Category Type</TableHead>
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
                      {rule.escalations.map((escalation, escIndex) => (
                        <TableRow key={escalation.id} className="border-b">
                          {escIndex === 0 && (
                            <TableCell 
                              className="font-medium border-r bg-gray-50" 
                              rowSpan={rule.escalations.length}
                            >
                              {categoryName}
                            </TableCell>
                          )}
                          <TableCell className="font-medium text-center border-r">{escalation.name}</TableCell>
                          <TableCell className="text-center border-r">
                            {getUserNames(escalation.escalate_to_users)}
                          </TableCell>
                          <TableCell className="text-center text-sm border-r">
                            {formatTimeDisplay(escalation.p1 || 0)}
                          </TableCell>
                          <TableCell className="text-center text-sm border-r">
                            {formatTimeDisplay(escalation.p2 || 0)}
                          </TableCell>
                          <TableCell className="text-center text-sm border-r">
                            {formatTimeDisplay(escalation.p3 || 0)}
                          </TableCell>
                          <TableCell className="text-center text-sm border-r">
                            {formatTimeDisplay(escalation.p4 || 0)}
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {formatTimeDisplay(escalation.p5 || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

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
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P1</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P2</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P3</TableHead>
                    <TableHead className="font-semibold text-center border-r" colSpan={3}>P4</TableHead>
                    <TableHead className="font-semibold text-center" colSpan={3}>P5</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    <TableHead className="border-r"></TableHead>
                    <TableHead className="border-r"></TableHead>
                    {priorities.map((priority) => (
                      <React.Fragment key={priority}>
                        <TableHead className="text-center text-xs border-r">Day</TableHead>
                        <TableHead className="text-center text-xs border-r">Hrs</TableHead>
                        <TableHead className="text-center text-xs border-r">Min</TableHead>
                      </React.Fragment>
                    ))}
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
                        <React.Fragment key={priority}>
                          <TableCell className="p-1 text-center border-r">
                            <Input
                              type="number"
                              min="0"
                              {...register(`escalationLevels.${level}.priorities.${priority}.days`, { valueAsNumber: true })}
                              className="w-12 h-8 text-center text-xs border-none focus-visible:ring-0"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="p-1 text-center border-r">
                            <Input
                              type="number"
                              min="0"
                              max="23"
                              {...register(`escalationLevels.${level}.priorities.${priority}.hours`, { valueAsNumber: true })}
                              className="w-12 h-8 text-center text-xs border-none focus-visible:ring-0"
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell className="p-1 text-center border-r last:border-r-0">
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              {...register(`escalationLevels.${level}.priorities.${priority}.minutes`, { valueAsNumber: true })}
                              className="w-12 h-8 text-center text-xs border-none focus-visible:ring-0"
                              placeholder="0"
                            />
                          </TableCell>
                        </React.Fragment>
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