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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, ChevronDown, ChevronUp, Filter, Eye, EyeOff, Plus, X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { RootState, AppDispatch } from '@/store/store';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { 
  createResolutionEscalation, 
  fetchResolutionEscalations, 
  updateResolutionEscalation, 
  deleteResolutionEscalation 
} from '@/store/slices/resolutionEscalationSlice';
import { 
  ResolutionEscalationGetResponse, 
  ResolutionEscalationMatrixPayload, 
  UpdateResolutionEscalationPayload,
  FMUserDropdown 
} from '@/types/escalationMatrix';

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
  const { data: categoriesData, loading: categoriesLoading } = useSelector((state: RootState) => state.helpdeskCategories);
  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers);
  const { 
    loading: submitting, 
    data: resolutionRules, 
    fetchLoading, 
    updateLoading, 
    deleteLoading 
  } = useSelector((state: RootState) => state.resolutionEscalation);

  // Local state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set());
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ResolutionEscalationGetResponse | null>(null);

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
    dispatch(fetchResolutionEscalations());
  }, [dispatch]);

  // Helper function to convert time to total minutes
  const convertToMinutes = (days: number, hours: number, minutes: number): number => {
    return (days * 24 * 60) + (hours * 60) + minutes;
  };

  // Helper function to convert minutes to day/hour/minute format
  const convertFromMinutes = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  };

  // Helper function to format time display
  const formatTimeDisplay = (totalMinutes: number): string => {
    if (totalMinutes === 0) return "0 day, 0 hour, 0 minute";
    const { days, hours, minutes } = convertFromMinutes(totalMinutes);
    return `${days} day, ${hours} hour, ${minutes} minute`;
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
      const societyId = JSON.parse(localStorage.getItem('selectedSiteId') || '0');
      
      if (!societyId) {
        toast.error('Site ID not found. Please select a site.');
        return;
      }

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

      await dispatch(createResolutionEscalation(payload)).unwrap();
      
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

      // Refresh the rules list
      dispatch(fetchResolutionEscalations());

    } catch (error: any) {
      toast.error(error.message || 'Failed to create resolution escalation rule');
    }
  };

  // Handle edit
  const handleEdit = (rule: ResolutionEscalationGetResponse) => {
    setEditingRule(rule);
    
    // Pre-populate form with existing data
    const categoryName = categoriesData?.helpdesk_categories?.find(cat => cat.id === rule.category_id)?.name || '';
    
    // Convert escalation data to form format
    const formData = {
      categoryIds: [rule.category_id],
      escalationLevels: {
        e1: {
          users: rule.escalations.find(e => e.name === 'E1')?.escalate_to_users 
            ? JSON.parse(rule.escalations.find(e => e.name === 'E1')?.escalate_to_users as string || '[]')
            : [],
          priorities: {
            p1: convertFromMinutes(rule.escalations.find(e => e.name === 'E1')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find(e => e.name === 'E1')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find(e => e.name === 'E1')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find(e => e.name === 'E1')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find(e => e.name === 'E1')?.p5 || 0),
          },
        },
        e2: {
          users: rule.escalations.find(e => e.name === 'E2')?.escalate_to_users 
            ? JSON.parse(rule.escalations.find(e => e.name === 'E2')?.escalate_to_users as string || '[]')
            : [],
          priorities: {
            p1: convertFromMinutes(rule.escalations.find(e => e.name === 'E2')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find(e => e.name === 'E2')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find(e => e.name === 'E2')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find(e => e.name === 'E2')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find(e => e.name === 'E2')?.p5 || 0),
          },
        },
        e3: {
          users: rule.escalations.find(e => e.name === 'E3')?.escalate_to_users 
            ? JSON.parse(rule.escalations.find(e => e.name === 'E3')?.escalate_to_users as string || '[]')
            : [],
          priorities: {
            p1: convertFromMinutes(rule.escalations.find(e => e.name === 'E3')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find(e => e.name === 'E3')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find(e => e.name === 'E3')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find(e => e.name === 'E3')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find(e => e.name === 'E3')?.p5 || 0),
          },
        },
        e4: {
          users: rule.escalations.find(e => e.name === 'E4')?.escalate_to_users 
            ? JSON.parse(rule.escalations.find(e => e.name === 'E4')?.escalate_to_users as string || '[]')
            : [],
          priorities: {
            p1: convertFromMinutes(rule.escalations.find(e => e.name === 'E4')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find(e => e.name === 'E4')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find(e => e.name === 'E4')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find(e => e.name === 'E4')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find(e => e.name === 'E4')?.p5 || 0),
          },
        },
        e5: {
          users: rule.escalations.find(e => e.name === 'E5')?.escalate_to_users 
            ? JSON.parse(rule.escalations.find(e => e.name === 'E5')?.escalate_to_users as string || '[]')
            : [],
          priorities: {
            p1: convertFromMinutes(rule.escalations.find(e => e.name === 'E5')?.p1 || 0),
            p2: convertFromMinutes(rule.escalations.find(e => e.name === 'E5')?.p2 || 0),
            p3: convertFromMinutes(rule.escalations.find(e => e.name === 'E5')?.p3 || 0),
            p4: convertFromMinutes(rule.escalations.find(e => e.name === 'E5')?.p4 || 0),
            p5: convertFromMinutes(rule.escalations.find(e => e.name === 'E5')?.p5 || 0),
          },
        },
      },
    };

    form.reset(formData);
    setSelectedCategories([rule.category_id]);
    setSelectedUsers({
      e1: formData.escalationLevels.e1.users,
      e2: formData.escalationLevels.e2.users,
      e3: formData.escalationLevels.e3.users,
      e4: formData.escalationLevels.e4.users,
      e5: formData.escalationLevels.e5.users,
    });
    setIsEditDialogOpen(true);
  };

  // Handle update
  const handleUpdate = async (data: ResolutionEscalationFormData) => {
    if (!editingRule) return;

    try {
      const payload: UpdateResolutionEscalationPayload = {
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
        },
      };

      await dispatch(updateResolutionEscalation(payload)).unwrap();
      
      toast.success('Resolution escalation rule updated successfully!');
      setIsEditDialogOpen(false);
      setEditingRule(null);
      
      // Refresh the rules list
      dispatch(fetchResolutionEscalations());

    } catch (error: any) {
      toast.error(error.message || 'Failed to update resolution escalation rule');
    }
  };

  // Handle delete
  const handleDelete = async (ruleId: number) => {
    try {
      await dispatch(deleteResolutionEscalation(ruleId)).unwrap();
      toast.success('Resolution escalation rule deleted successfully!');
      dispatch(fetchResolutionEscalations());
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete resolution escalation rule');
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
  const toggleRuleExpansion = (ruleId: number) => {
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
    ? resolutionRules 
    : resolutionRules.filter(rule => {
        const categoryName = getCategoryName(rule.category_id);
        return categoryName === selectedCategoryFilter;
      });

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create Resolution Escalation Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(isEditDialogOpen ? handleUpdate : handleSubmit)} className="space-y-6">
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
            </div>

            {/* Escalation Levels */}
            {(['e1', 'e2', 'e3', 'e4', 'e5'] as const).map((level) => (
              <div key={level} className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{level.toUpperCase()}</h3>
                
                {/* Users Selection */}
                <div className="space-y-2">
                  <Label>Escalate To Users (max 15)</Label>
                  
                  <Select
                    onValueChange={(value) => addUser(level, parseInt(value))}
                    disabled={fmUsersLoading || selectedUsers[level].length >= 15}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        fmUsersLoading 
                          ? "Loading users..." 
                          : selectedUsers[level].length >= 15
                          ? "Maximum users selected"
                          : "Select users"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers(level).map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Selected Users */}
                  {selectedUsers[level].length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUsers[level].map((userId) => (
                        <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                          {getUserName(userId)}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeUser(level, userId)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority Timings */}
                <div className="grid grid-cols-5 gap-4">
                  {(['p1', 'p2', 'p3', 'p4', 'p5'] as const).map((priority) => (
                    <div key={priority} className="space-y-2">
                      <Label className="text-sm font-medium">{priority.toUpperCase()}</Label>
                      
                      <div className="space-y-1">
                        <Input
                          type="number"
                          placeholder="Days"
                          min="0"
                          {...form.register(`escalationLevels.${level}.priorities.${priority}.days`, { valueAsNumber: true })}
                        />
                        <Input
                          type="number"
                          placeholder="Hours"
                          min="0"
                          max="23"
                          {...form.register(`escalationLevels.${level}.priorities.${priority}.hours`, { valueAsNumber: true })}
                        />
                        <Input
                          type="number"
                          placeholder="Minutes"
                          min="0"
                          max="59"
                          {...form.register(`escalationLevels.${level}.priorities.${priority}.minutes`, { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button type="submit" disabled={submitting || updateLoading} className="w-full">
              {submitting || updateLoading ? 'Processing...' : isEditDialogOpen ? 'Update Rule' : 'Create Rule'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter and Rules Display Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resolution Escalation Rules</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
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
          </div>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="text-center py-4">Loading rules...</div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No resolution escalation rules found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Type</TableHead>
                  <TableHead>Levels</TableHead>
                  <TableHead>P1</TableHead>
                  <TableHead>P2</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => {
                  const activeE1 = rule.escalations.find(e => e.name === 'E1');
                  const activeLevels = rule.escalations.filter(e => 
                    e.escalate_to_users && JSON.parse(e.escalate_to_users as string || '[]').length > 0
                  );
                  
                  return (
                    <React.Fragment key={rule.id}>
                      <TableRow>
                        <TableCell>{getCategoryName(rule.category_id)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {rule.escalations.map((escalation) => {
                              const hasUsers = escalation.escalate_to_users && 
                                JSON.parse(escalation.escalate_to_users as string || '[]').length > 0;
                              return (
                                <Badge 
                                  key={escalation.id} 
                                  variant={hasUsers ? "default" : "outline"}
                                >
                                  {escalation.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {activeE1 ? formatTimeDisplay(activeE1.p1 || 0) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {activeE1 ? formatTimeDisplay(activeE1.p2 || 0) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRuleExpansion(rule.id)}
                            >
                              {expandedRules.has(rule.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Resolution Escalation Rule</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this resolution escalation rule for {getCategoryName(rule.category_id)}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(rule.id)}
                                    disabled={deleteLoading}
                                  >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Details */}
                      {expandedRules.has(rule.id) && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-semibold mb-3">Detailed Escalation Matrix</h4>
                              <div className="space-y-3">
                                {rule.escalations.map((escalation) => {
                                  const users = escalation.escalate_to_users 
                                    ? JSON.parse(escalation.escalate_to_users as string || '[]')
                                    : [];
                                  
                                  return (
                                    <div key={escalation.id} className="flex items-center gap-4 p-2 border rounded">
                                      <Badge variant={users.length > 0 ? "default" : "outline"}>
                                        {escalation.name}
                                      </Badge>
                                      <div className="flex-1">
                                        <div className="text-sm text-muted-foreground mb-1">Escalate To:</div>
                                        <div className="flex flex-wrap gap-1">
                                          {users.length > 0 ? users.map((userId: number) => (
                                            <Badge key={userId} variant="secondary" className="text-xs">
                                              {getUserName(userId)}
                                            </Badge>
                                          )) : (
                                            <span className="text-sm text-muted-foreground">No users assigned</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-5 gap-2 text-xs">
                                        <div>
                                          <div className="font-medium">P1</div>
                                          <div>{formatTimeDisplay(escalation.p1 || 0)}</div>
                                        </div>
                                        <div>
                                          <div className="font-medium">P2</div>
                                          <div>{formatTimeDisplay(escalation.p2 || 0)}</div>
                                        </div>
                                        <div>
                                          <div className="font-medium">P3</div>
                                          <div>{formatTimeDisplay(escalation.p3 || 0)}</div>
                                        </div>
                                        <div>
                                          <div className="font-medium">P4</div>
                                          <div>{formatTimeDisplay(escalation.p4 || 0)}</div>
                                        </div>
                                        <div>
                                          <div className="font-medium">P5</div>
                                          <div>{formatTimeDisplay(escalation.p5 || 0)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resolution Escalation Rule</DialogTitle>
          </DialogHeader>
          {/* Form content is shared with the main form above */}
        </DialogContent>
      </Dialog>
    </div>
  );
};