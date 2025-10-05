import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, X, FileText, User, MapPin, Eye, Edit, Star, Trash2, Flag } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast as sonnerToast } from "sonner";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from '@mui/material';
import { userService } from '@/services/userService';
import { taskService, TaskOccurrence } from '@/services/taskService';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { bulkTaskService, EscalateUser } from '@/services/bulkTaskService';
import { JobSheetModal } from '@/components/JobSheetModal';




// If User type is not imported, define minimally here:
type User = {
  id: number;
  full_name: string;
};

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskDetails, setTaskDetails] = useState<TaskOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [escalateUsers, setEscalateUsers] = useState<EscalateUser[]>([]);
  const [ticketData, setTicketData] = useState<any>(null); // For storing ticket information
  const [ticketLoading, setTicketLoading] = useState(false);

  // Removed showSubmitModal state as we now navigate to a separate page
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showJobSheetModal, setShowJobSheetModal] = useState(false);
  const [jobSheetData, setJobSheetData] = useState<any>(null);
  const [jobSheetLoading, setJobSheetLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("task-details");

  // Legacy form state (can be removed if not needed elsewhere)
  const [formData, setFormData] = useState({
    isFloorClean: false,
    floorComment: '',
    isDustClean: false,
    dustComment: '',
    isLiftClean: false,
    liftOptions: {
      dust: false,
      dryMop: false,
      wetMop: false,
      vacuum: false
    },
    liftComment: '',
    attachments: null as File | null
  });

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduleDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
    scheduleTime: '10:30',
    email: false
  });

  // File upload state (for attachments in submit form)
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
    file4: null
  });

  // Menu props for MUI Select
  // Helper function to extract location parts from asset_path
  const extractLocationPart = (assetPath: string, part: string): string => {
    if (!assetPath) return 'NA';
    const regex = new RegExp(`${part}\\s*-\\s*([^/]+)`, 'i');
    const match = assetPath.match(regex);
    const value = match ? match[1].trim() : 'NA';
    return value === 'NA' ? 'NA' : value;
  };

  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999
      }
    },
    disablePortal: true,
    container: document.body
  };

  // Style for fields
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' }
    }
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await taskService.getTaskDetails(id);
        
        // Log the response from taskService to see what we're getting
        console.log('📡 Raw API Response from taskService:', response);
        console.log('📍 Location from taskService:', response?.task_details?.location);
        
        // Map the API response to match our component structure
        const rawDetails = (response as any).task_occurrence ? (response as any).task_occurrence : response;
        
        // Enhanced mapping to handle the new API structure
        const mappedDetails = {
          ...rawDetails,
          // task_details is already properly mapped by taskService, just ensure it exists
          task_details: rawDetails.task_details || {
            id: rawDetails.id,
            task_name: rawDetails.checklist,
            asset_service_code: rawDetails.asset_code,
            created_by: rawDetails.first_name || rawDetails.assigned_to_name,
            scheduled_on: rawDetails.start_date,
            associated_with: rawDetails.asset,
            asset_service_name: rawDetails.asset,
            task_duration: rawDetails.grace_time,
            supplier: rawDetails.company,
            backup_assigned_user: rawDetails.backup_assigned_user,
            assigned_to: rawDetails.assigned_to_name,
            created_on: rawDetails.created_at,
            start_time: rawDetails.task_start_time,
            completed_on: rawDetails.updated_at,
            performed_by: rawDetails.performed_by,
            status: rawDetails.task_details?.status || {
              value: rawDetails.task_status?.toLowerCase().replace(/\s+/g, '') || 'unknown',
              display_name: rawDetails.task_status || 'Unknown'
            },
            // Use the location that was already mapped by taskService
            location: rawDetails.task_details?.location || rawDetails.location || {
              site: 'NA',
              building: 'NA',
              wing: 'NA',
              floor: 'NA',
              area: 'NA',
              room: 'NA'
            }
          },
          // Map activity/checklist responses - if responses exist, map them; otherwise map questions
          activity: {
            resp: rawDetails.checklist_responses
              ? rawDetails.checklist_responses.map((item: any) => ({
                  label: item.label || item.activity,
                  hint: item.hint || item.help_text || '',
                  userData: item.userData || [item.input_value],
                  comment: item.comment || item.comments || '',
                  weightage: item.weightage || '',
                  rating: item.rating || '',
                  values: item.values || [],
                  attachments: item.attachments || [],
                  name: item.name,
                  className: item.className,
                  type: item.type,
                  required: item.required,
                  is_reading: item.is_reading,
                  group_id: item.group_id || '',
                  sub_group_id: item.sub_group_id || '',
                  group_name: item.group_name || '',
                  sub_group_name: item.sub_group_name || ''
                }))
              : (rawDetails.checklist_questions || []).map((item: any) => ({
                  label: item.label || item.activity,
                  hint: item.hint || item.help_text || '',
                  userData: ['-'], // Show '-' for questions without responses
                  comment: '-',
                  weightage: item.weightage || '',
                  rating: '',
                  values: item.values || [],
                  attachments: [],
                  name: item.name,
                  className: item.className,
                  type: item.type,
                  required: item.required,
                  is_reading: item.is_reading,
                  group_id: item.group_id || '',
                  sub_group_id: item.sub_group_id || '',
                  group_name: item.group_name || '',
                  sub_group_name: item.sub_group_name || ''
                }))
          },
          // Map before/after attachments
          bef_sub_attachment: rawDetails.bef_sub_attachment,
          aft_sub_attachment: rawDetails.aft_sub_attachment,
          // Map checklist questions
          checklist_questions: rawDetails.checklist_questions || [],
          // Map actions based on status
          actions: {
            can_submit_task: ['open', 'inprogress', 'scheduled', 'workinprogress', 'overdue'].includes(
              rawDetails.task_status?.toLowerCase().replace(/\s+/g, '') || ''
            ),
            can_reschedule: ['open', 'inprogress', 'scheduled', 'workinprogress'].includes(
              rawDetails.task_status?.toLowerCase().replace(/\s+/g, '') || ''
            ),
            can_edit: ['open', 'inprogress', 'scheduled', 'workinprogress'].includes(
              rawDetails.task_status?.toLowerCase().replace(/\s+/g, '') || ''
            ),
            can_view_job_sheet: ['closed', 'completed'].includes(
              rawDetails.task_status?.toLowerCase().replace(/\s+/g, '') || ''
            )
          },
          // Keep original fields for reference
          before_after_enabled: rawDetails.steps === 3 ? 'Yes' : 'No',
          steps: rawDetails.steps
        };
        
        setTaskDetails(mappedDetails);
        
        // Enhanced debug logging
        console.log('🗺️ Final Mapped Details:', mappedDetails);
        console.log('📍 Final Location Object:', mappedDetails?.task_details?.location);
        
        // Debug logging for image attachments and checklist
        console.log('🖼️ Task Details Image Data:');
        console.log('- Before Image (bef_sub_attachment):', mappedDetails?.bef_sub_attachment || 'null');
        console.log('- After Image (aft_sub_attachment):', mappedDetails?.aft_sub_attachment || 'null');
        console.log('- Before/After Enabled:', mappedDetails?.before_after_enabled || false);
        console.log('📋 Checklist Responses with Attachments:', mappedDetails?.activity?.resp?.map((r: any) => ({
          label: r.label,
          attachments: r.attachments?.length || 0
        })));
        
        // Fetch ticket data using the task occurrence ID
        if (mappedDetails?.id) {
          try {
            setTicketLoading(true);
            const ticketResponse = await ticketManagementAPI.getTicketsByTaskOccurrenceId(mappedDetails.id.toString());
            console.log('🎫 Ticket API Response:', ticketResponse);
            
            if (ticketResponse?.complaints && ticketResponse.complaints.length > 0) {
              // Set the first ticket from the response
              const ticket = ticketResponse.complaints[0];
              setTicketData({
                id: ticket.id,
                ticket_number: ticket.ticket_number,
                heading: ticket.heading,
                category_type: ticket.category_type,
                sub_category_type: ticket.sub_category_type,
                posted_by: ticket.posted_by,
                is_flagged: ticket.is_flagged,
                is_golden_ticket: ticket.is_golden_ticket,
                priority: ticket.priority,
                issue_status: ticket.issue_status,
                department_name: ticket.department_name,
                assigned_to: ticket.backup_assigned_user || ticket.assigned_to,
                created_at: ticket.created_at,
                updated_at: ticket.updated_at,
                building_name: ticket.building_name,
                floor_name: ticket.floor_name,
                site_name: ticket.site_name,
                pms_site_name: ticket.pms_site_name,
                complaint_type: ticket.complaint_type,
                issue_type: ticket.issue_type,
                color_code: ticket.color_code,
                updated_by: ticket.updated_by,
                priority_status: ticket.priority_status,
                effective_priority: ticket.effective_priority,
                schedule_type: ticket.schedule_type,
                service_or_asset: ticket.service_or_asset,
                asset_or_service_name: ticket.asset_or_service_name,
                response_escalation: ticket.response_escalation,
                resolution_escalation: ticket.resolution_escalation,
                response_tat: ticket.response_tat,
                resolution_tat: ticket.resolution_tat,
                escalation_response_name: ticket.escalation_response_name,
                escalation_resolution_name: ticket.escalation_resolution_name,
                status: ticket.status,
                unit_name: ticket.unit_name,
                complaint_logs: ticket.complaint_logs || [],
                documents: ticket.documents || [],
                faqs: ticket.faqs || []
              });
            } else {
              console.log('No tickets found for task occurrence ID:', mappedDetails.id);
              setTicketData(null);
            }
          } catch (error) {
            console.error('Could not fetch ticket details:', error);
            setTicketData(null);
          } finally {
            setTicketLoading(false);
          }
        }
      } catch (error) {
        sonnerToast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.searchUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        sonnerToast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Utility: build start_date as "YYYY-MM-DD HH:mm:ss"
  const getStartDateString = () => {
    if (!rescheduleData.scheduleDate || !rescheduleData.scheduleTime) return '';
    return `${rescheduleData.scheduleDate} ${rescheduleData.scheduleTime}:00`;
  };

  const handleBack = () => navigate('/maintenance/task');
  const handleSubmitTask = () => navigate(`/maintenance/task/submit/${id}`);
  const handleTaskReschedule = () => setShowRescheduleDialog(true);

  const handleJobSheetClick = () => {
    if (!id) return;
    navigate(`/maintenance/task/job-sheet/${id}`);
  };

  const handleJobSheetModalClick = async () => {
    if (!id) return;
    try {
      setJobSheetLoading(true);
      setShowJobSheetModal(true);
      const jobSheet = await taskService.getJobSheet(id);
      setJobSheetData(jobSheet);
    } catch (error) {
      sonnerToast.error("Failed to load job sheet");
      setShowJobSheetModal(false);
    } finally {
      setJobSheetLoading(false);
    }
  };

  // File upload handler for form
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  // --- Submit Handlers (task submission now handled on separate page)

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleData.scheduleDate ||
      !rescheduleData.scheduleTime
    ) {
      sonnerToast.error('Please fill in all required fields');
      return;
    }

    const loadingToastId = sonnerToast.loading("Rescheduling task...", {
      duration: Infinity,
    });

    try {
      // Convert date and time to ISO format for bulk API
      const dateTimeString = `${rescheduleData.scheduleDate}T${rescheduleData.scheduleTime}:00Z`;
      
      const payload = {
        task_occurrence_ids: [parseInt(id!)],
        start_date: dateTimeString,
        email: rescheduleData.email,
      };

      // Use bulk reschedule API for consistency
      await bulkTaskService.bulkReschedule(payload);

      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success("Task rescheduled successfully!");

      // Refresh task details after successful reschedule
      const updatedDetails = await taskService.getTaskDetails(id!);
      setTaskDetails(updatedDetails);

      setShowRescheduleDialog(false);
      
      // Reset form
      setRescheduleData({
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '10:30',
        email: false,
      });
    } catch (error) {
      console.error('Task reschedule failed:', error);
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.error(error instanceof Error ? error.message : "Failed to reschedule task");
    }
  };

  const handleCloseJobSheet = () => {
    setShowJobSheetModal(false);
    setJobSheetData(null);
  };

  // --- API Action Handlers ---
  
  // Helper function to refresh ticket data
  const refreshTicketData = async () => {
    if (taskDetails?.id) {
      try {
        const ticketResponse = await ticketManagementAPI.getTicketsByTaskOccurrenceId(taskDetails.id.toString());
        if (ticketResponse?.complaints && ticketResponse.complaints.length > 0) {
          const ticket = ticketResponse.complaints[0];
          setTicketData({
            id: ticket.id,
            ticket_number: ticket.ticket_number,
            heading: ticket.heading,
            category_type: ticket.category_type,
            sub_category_type: ticket.sub_category_type,
            posted_by: ticket.posted_by,
            is_flagged: ticket.is_flagged,
            is_golden_ticket: ticket.is_golden_ticket,
            priority: ticket.priority,
            issue_status: ticket.issue_status,
            department_name: ticket.department_name,
            assigned_to: ticket.assigned_to,
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
            building_name: ticket.building_name,
            floor_name: ticket.floor_name,
            site_name: ticket.site_name,
            pms_site_name: ticket.pms_site_name,
            complaint_type: ticket.complaint_type,
            issue_type: ticket.issue_type,
            color_code: ticket.color_code,
            updated_by: ticket.updated_by,
            priority_status: ticket.priority_status,
            effective_priority: ticket.effective_priority,
            schedule_type: ticket.schedule_type,
            service_or_asset: ticket.service_or_asset,
            asset_or_service_name: ticket.asset_or_service_name,
            response_escalation: ticket.response_escalation,
            resolution_escalation: ticket.resolution_escalation,
            response_tat: ticket.response_tat,
            resolution_tat: ticket.resolution_tat,
            escalation_response_name: ticket.escalation_response_name,
            escalation_resolution_name: ticket.escalation_resolution_name,
            status: ticket.status,
            unit_name: ticket.unit_name,
            complaint_logs: ticket.complaint_logs || [],
            documents: ticket.documents || [],
            faqs: ticket.faqs || []
          });
        }
      } catch (refreshError) {
        console.error('Failed to refresh ticket data:', refreshError);
      }
    }
  };
  
  const handleTicketFlag = async (ticketId: number, currentFlagStatus: boolean) => {
    try {
      const response = await ticketManagementAPI.markAsFlagged([ticketId]);
      
      sonnerToast.success(response.message || `Ticket ${!currentFlagStatus ? 'flagged' : 'unflagged'} successfully`);
      
      // Refresh ticket data to ensure consistency with server
      await refreshTicketData();
    } catch (error) {
      console.error('Flag action failed:', error);
      sonnerToast.error("Failed to flag ticket");
    }
  };

  const handleTicketGoldenTicket = async (ticketId: number, currentGoldenStatus: boolean) => {
    try {
      const response = await ticketManagementAPI.markAsGoldenTicket([ticketId]);
      
      sonnerToast.success(response.message || `Golden Ticket ${!currentGoldenStatus ? 'marked' : 'unmarked'} successfully!`);
      
      // Refresh ticket data to ensure consistency with server
      await refreshTicketData();
    } catch (error) {
      console.error('Golden ticket action failed:', error);
      sonnerToast.error("Failed to mark as golden ticket");
    }
  };

  const handleTicketView = (ticketId: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes("tickets")) {
      navigate(`/tickets/details/${ticketId}`);
    } else {
      navigate(`/maintenance/ticket/details/${ticketId}`);
    }
  };

  const handleTicketEdit = (ticketId: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes("tickets")) {
      navigate(`/tickets/edit/${ticketId}`);
    } else {
      navigate(`/maintenance/ticket/edit/${ticketId}`);
    }
  };

  // --- Dynamic Data Helpers
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get task name dynamically
  const getTaskName = () => {
    return taskDetails?.task_details?.task_name || "Task Details";
  };

  // Get task location details dynamically
  const getLocationBadges = () => {
    const location = taskDetails?.task_details?.location;
    if (!location) return [];

    const badges = [];
    if (location.site && location.site !== "NA") badges.push({ label: "Site", value: location.site });
    if (location.building && location.building !== "NA") badges.push({ label: "Building", value: location.building });
    if (location.wing && location.wing !== "NA") badges.push({ label: "Wing", value: location.wing });
    if (location.floor && location.floor !== "NA") badges.push({ label: "Floor", value: location.floor });
    if (location.area && location.area !== "NA") badges.push({ label: "Area", value: location.area });
    if (location.room && location.room !== "NA") badges.push({ label: "Room", value: location.room });

    return badges;
  };

  // Get activity data grouped by sections
  const getGroupedActivityData = () => {
    const activityResp = (taskDetails?.activity as any)?.resp;
    console.log('🎯 getActivityData - activityResp:', activityResp);
    console.log('🎯 getActivityData - activityResp length:', activityResp?.length);
    
    if (!activityResp || activityResp.length === 0) {
      console.log('⚠️ No activity responses found');
      return [];
    }
    
    // Group by group_id and sub_group_id
    const grouped: { [key: string]: any[] } = {};
    
    activityResp.forEach((item: any, index: number) => {
      const groupId = item.group_id || 'ungrouped';
      const subGroupId = item.sub_group_id || 'ungrouped';
      const key = `${groupId}_${subGroupId}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push({
        id: item.name || `activity_${index}`,
        helpText: item.hint || "-",
        activities: item.label || "-",
        input: item.userData?.length > 0 ? item.userData : ["-"],
        comments: item.comment || "-",
        weightage: item.weightage || "-",
        rating: item.rating || "-",
        attachments: item.attachments || [],
        values: item.values || [],
        group_name: item.group_name || '',
        sub_group_name: item.sub_group_name || '',
        group_id: groupId,
        sub_group_id: subGroupId
      });
    });
    
    // Convert to array of sections
    return Object.keys(grouped).map(key => ({
      sectionKey: key,
      group_name: grouped[key][0]?.group_name || 'Ungrouped',
      sub_group_name: grouped[key][0]?.sub_group_name || '',
      activities: grouped[key]
    }));
  };

  // Get activity data dynamically (flat list for compatibility)
  const getActivityData = () => {
    const activityResp = (taskDetails?.activity as any)?.resp;
    
    if (!activityResp || activityResp.length === 0) {
      return [];
    }
    
    return activityResp.map((item: any, index: number) => ({
      id: item.name || `activity_${index}`,
      helpText: item.hint || "-",
      activities: item.label || "-",
      input: item.userData?.length > 0 ? item.userData : ["-"],
      comments: item.comment || "-",
      weightage: item.weightage || "-",
      rating: item.rating || "-",
      attachments: item.attachments || [],
      values: item.values || []
    }));
  };

  // Get assigned user name
  const getAssignedUserName = () => {
    return taskDetails?.task_details?.backup_assigned_user || 
           taskDetails?.task_details?.assigned_to || 
           taskDetails?.task_details?.created_by || 
           "-";
  };

  // Get before/after image URLs from task details
  const getBeforeImageUrl = () => {
    return taskDetails?.bef_sub_attachment || null;
  };

  const getAfterImageUrl = () => {
    return taskDetails?.aft_sub_attachment || null;
  };

  // Handle image load errors with fallback SVGs
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, type: 'before' | 'after') => {
    const target = e.target as HTMLImageElement;
    const color = type === 'before' ? 'f5f5f5' : 'e8f5e8';
    const textColor = type === 'before' ? '888888' : '2d5a2d';
    const label = type === 'before' ? 'BEFORE' : 'AFTER';
    
    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="128" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="40%" font-family="Arial" font-size="10" fill="#${textColor}" text-anchor="middle" dy=".3em">${label}</text>
        <text x="50%" y="60%" font-family="Arial" font-size="8" fill="#${textColor}" text-anchor="middle" dy=".3em">No Image Available</text>
      </svg>
    `)}`;
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Activity table columns configuration
  const activityColumns: ColumnConfig[] = [
    { key: 'helpText', label: 'Help Text', sortable: true, defaultVisible: true },
    { key: 'activities', label: 'Activities', sortable: true, defaultVisible: true },
    { key: 'input', label: 'Input', sortable: true, defaultVisible: true },
    { key: 'comments', label: 'Comments', sortable: true, defaultVisible: true },
    { key: 'weightage', label: 'Weightage', sortable: true, defaultVisible: true },
    { key: 'rating', label: 'Rating', sortable: true, defaultVisible: true },
    { key: 'score', label: 'Score', sortable: true, defaultVisible: true },
    { key: 'attachments', label: 'Attachments', sortable: false, defaultVisible: true },
  ];

  // Ticket table columns configuration
  const ticketColumns: ColumnConfig[] = [
    { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
    { key: 'ticket_number', label: 'Ticket ID', sortable: true, defaultVisible: true },
    { key: 'heading', label: 'Description', sortable: true, defaultVisible: true },
    { key: 'issue_type', label: 'Type', sortable: true, defaultVisible: true },
    { key: 'category', label: 'Category', sortable: true, defaultVisible: true },
    { key: 'priority', label: 'Priority', sortable: true, defaultVisible: true },
    { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
    { key: 'posted_by', label: 'Created By', sortable: true, defaultVisible: true },
    { key: 'assigned_to', label: 'Assigned To', sortable: true, defaultVisible: true },
    { key: 'location', label: 'Location', sortable: true, defaultVisible: true },
    { key: 'escalation', label: 'Escalation', sortable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created', sortable: true, defaultVisible: true },
  ];

  // Activity table cell renderer
  const renderActivityCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'helpText':
        return <span className="text-xs">{item.helpText}</span>;
      case 'activities':
        return <span className="text-xs">{item.activities}</span>;
      case 'input':
        return <span className="text-xs">{Array.isArray(item.input) ? item.input.join(', ') : item.input}</span>;
      case 'comments':
        return <span className="text-xs">{item.comments}</span>;
      case 'weightage':
        return <span className="text-xs">{item.weightage}</span>;
      case 'rating':
        return <span className="text-xs">{item.rating}</span>;
      case 'score':
        return <span className="text-xs">{item.score}</span>;
      case 'attachments':
        // Handle attachments display
        if (!item.attachments || item.attachments.length === 0) {
          return <span className="text-xs text-gray-400">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {item.attachments.map((attachment: any, idx: number) => {
              const attachmentUrl = typeof attachment === 'string' ? attachment : attachment.url || attachment.file_url;
              const attachmentName = typeof attachment === 'string' 
                ? `Attachment ${idx + 1}` 
                : attachment.name || attachment.filename || `Attachment ${idx + 1}`;
              
              return (
                <a
                  key={idx}
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                  title={attachmentName}
                >
                 <img src={attachmentUrl} alt={attachmentName} className="w-12 h-12" />
                </a>
              );
            })}
          </div>
        );
      default:
        return item[columnKey] || '-';
    }
  };

  // Ticket table cell renderer
  const renderTicketCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-1">
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => handleTicketView(item.ticket_number)}
              title="View ticket details"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                item.is_flagged ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
              }`}
              onClick={() => handleTicketFlag(item.id, item.is_flagged)}
              title={item.is_flagged ? "Remove flag" : "Flag ticket"}
            >
              <Flag className={`w-4 h-4 transition-all duration-200 ${
                item.is_flagged 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600'
              }`} />
            </button>
            <button 
              className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                item.is_golden_ticket ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-400'
              }`}
              onClick={() => handleTicketGoldenTicket(item.id, item.is_golden_ticket)}
              title={item.is_golden_ticket ? "Remove golden ticket" : "Mark as golden ticket"}
            >
              <Star className={`w-4 h-4 transition-all duration-200 hover:scale-110 ${
                item.is_golden_ticket
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-600'
              }`} />
            </button>
          </div>
        );
      case 'ticket_number':
        return <span className="text-xs font-medium">{item.ticket_number}</span>;
      case 'heading':
        return <span className="text-xs">{item.heading || 'N/A'}</span>;
      case 'issue_type':
        return (
          <Badge className="px-2 py-1 text-xs bg-blue-100 text-blue-700">
            {item.issue_type || 'N/A'}
          </Badge>
        );
      case 'category':
        return (
          <div className="space-y-1">
            <div className="font-medium text-xs">{item.category_type || 'N/A'}</div>
            {item.sub_category_type && (
              <div className="text-gray-500 text-xs">{item.sub_category_type}</div>
            )}
          </div>
        );
      case 'priority':
        return (
          <div className="space-y-1">
            <Badge className={`px-2 py-1 text-xs ${
              item.priority === 'P1' ? 'bg-red-100 text-red-700' :
              item.priority === 'P2' ? 'bg-yellow-100 text-yellow-700' :
              item.priority === 'P3' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {item.priority || 'N/A'}
            </Badge>
            <div className="text-xs text-gray-500">{item.priority_status || 'N/A'}</div>
          </div>
        );
      case 'status':
        return (
          <Badge 
            className="px-2 py-1 text-xs text-white"
            style={{ 
              backgroundColor: item.status?.color_code || item.color_code || '#60A8C0',
              color: 'white'
            }}
          >
            {item.status?.name || item.issue_status || 'N/A'}
          </Badge>
        );
      case 'posted_by':
        return <span className="text-xs">{item.posted_by || 'N/A'}</span>;
      case 'assigned_to':
        return (
          <div className="space-y-1">
            <div className="font-medium text-xs">{item.assigned_to || 'N/A'}</div>
            <div className="text-gray-500 text-xs">{item.department_name || 'N/A'}</div>
          </div>
        );
      case 'location':
        return (
          <div className="space-y-1">
            <div className="font-medium text-xs">{item.pms_site_name || item.site_name || 'N/A'}</div>
            <div className="text-gray-500 text-xs">
              {item.building_name && `${item.building_name}`}
              {item.floor_name && ` - ${item.floor_name}`}
            </div>
          </div>
        );
      case 'escalation':
        return (
          <div className="space-y-1">
            <div className={`text-xs px-2 py-1 rounded ${
              item.response_escalation === 'Breached' ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            }`}>
              Response: {item.response_escalation || 'N/A'}
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              item.resolution_escalation === 'Breached' ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            }`}>
              Resolution: {item.resolution_escalation || 'N/A'}
            </div>
          </div>
        );
      case 'created_at':
        return <span className="text-xs">{formatDate(item.created_at)}</span>;
      default:
        return item[columnKey] || '-';
    }
  };

  // --- UI ---

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!taskDetails) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Task List
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">
                  {getTaskName()}
                </h1>
              </div>
                     

            </div>

            <div className="flex items-center gap-3">
              {(() => {
                const status = taskDetails?.task_details?.status?.value?.toLowerCase();
                
                // If status is open, in progress, scheduled, or work in progress - show Task Reschedule and Submit Task
                if (['open', 'in progress',  'work in progress', 'inprogress', 'workinprogress'].includes(status)) {
                  return (
                    <>
                      {(taskDetails?.actions?.can_reschedule || taskDetails?.actions?.can_edit) && (
                        <Button
                          onClick={handleTaskReschedule}
                          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                        >
                          Task Reschedule
                        </Button>
                      )}
                      {(taskDetails?.actions?.can_submit_task || taskDetails?.actions?.can_edit) && (
                        <Button
                          onClick={handleSubmitTask}
                          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                        >
                          Submit Task
                        </Button>
                      )}
                    </>
                  );
                }
                else if (['scheduled'].includes(status)) {
                  return (
                    <>
                      {(taskDetails?.actions?.can_reschedule || taskDetails?.actions?.can_edit) && (
                        <Button
                          onClick={handleTaskReschedule}
                          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                        >
                          Task Reschedule
                        </Button>
                      )}
                  
                    </>
                  );
                }
                
                // If status is closed - show Job Sheet
                else if (['closed', 'completed'].includes(status)) {
                  return (
                    <>
                      {(taskDetails?.actions?.can_view_job_sheet || ['closed', 'completed'].includes(status)) && (
                        <Button
                          onClick={handleJobSheetModalClick}
                          variant="outline"
                          className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10 px-4 py-2"
                        >
                          Job Sheet 
                        </Button>
                      )}
                    </>
                  );
                }
                
                // If status is overdue - show Submit Task (even if can_submit_task is false, show for overdue)
                else if (['overdue'].includes(status)) {
                  return (
                    <>
                      <Button
                        onClick={handleSubmitTask}
                        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                      >
                        Submit Task
                      </Button>
                    </>
                  );
                }
                
                // Default case - show all buttons if conditions are met
                return (
                  <>
                    {(taskDetails?.actions?.can_view_job_sheet || ['closed', 'completed'].includes(status)) && (
                      <Button
                        onClick={handleJobSheetModalClick}
                        variant="outline"
                        className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10 px-4 py-2"
                      >
                        Job Sheet 
                      </Button>
                    )}
                    {taskDetails?.actions?.can_submit_task && (
                      <Button
                        onClick={handleSubmitTask}
                        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                      >
                        Submit Task
                      </Button>
                    )}
                    {taskDetails?.actions?.can_reschedule && (
                      <Button
                        onClick={handleTaskReschedule}
                        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                      >
                        Task Reschedule
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Pre-Post Inspection Info - Conditional rendering based on steps and before_after_enabled */}
          {taskDetails?.steps == 3 && (
            <Card className="w-full bg-transparent shadow-none border-none">
              <div className="figma-card-header">
                <div className="flex items-center gap-3">
                  <div className="figma-card-icon-wrapper">
                    <User className="figma-card-icon" />
                  </div>
                  <h3 className="figma-card-title">Pre-Post Inspection Info</h3>
                </div>
              </div>
              <div className="figma-card-content">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Before</h4>
                      <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                        {getBeforeImageUrl() ? (
                          <img 
                            src={getBeforeImageUrl()!} 
                            alt="Before inspection" 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => handleImageError(e, 'before')}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="text-xs font-medium">BEFORE</div>
                            <div className="text-xs mt-1">No Image Available</div>
                          </div>
                        )}
                      </div>
                   
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">After</h4>
                      <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                        {getAfterImageUrl() ? (
                          <img 
                            src={getAfterImageUrl()!} 
                            alt="After inspection" 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => handleImageError(e, 'after')}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="text-xs font-medium">AFTER</div>
                            <div className="text-xs mt-1">No Image Available</div>
                          </div>
                        )}
                      </div>
                     
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                    <select className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>{getAssignedUserName()}</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Task Info */}
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <FileText className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Task Info</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <div className="task-info-enhanced">
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>ID</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.id || taskDetails?.id || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Asset/Service Id</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.asset_service_code || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Created By</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.created_by || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Task</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.task_name || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Scheduled On</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.scheduled_on || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Associated With</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.associated_with || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Asset/Service Name</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.asset_service_name || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Task Duration</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.task_duration || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Supplier</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.supplier || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Assigned To</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.backup_assigned_user || taskDetails?.task_details?.assigned_to || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Created On</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    {taskDetails?.task_details?.created_on || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Status</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    <Badge className={getStatusColor(taskDetails?.task_details?.status?.value || '')}>
                      {taskDetails?.task_details?.status?.display_name || 'Unknown'}
                    </Badge>
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Check-in With <br /> Before/After Photograph</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                    <Badge className={taskDetails?.before_after_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {taskDetails?.before_after_enabled}
                    </Badge>
                  </span>
                </div>
                {taskDetails?.task_details?.start_time && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Start Time</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                      {taskDetails.task_details.start_time}
                    </span>
                  </div>
                )}
                {taskDetails?.task_details?.completed_on && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Completed On</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                      {taskDetails.task_details.completed_on}
                    </span>
                  </div>
                )}
                {taskDetails?.task_details?.performed_by && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}>Completed By</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced" style={{ fontFamily: 'Work Sans', fontWeight: 400, fontSize: '14px' }}>
                      {taskDetails.task_details.performed_by}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Location Details */}
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <MapPin className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Location Details</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <div className="relative">
                {/* Stepper Line */}
                <div className="location-stepper-line absolute top-8 left-6 right-6" style={{zIndex: 1}}></div>
                
                {/* Location Steps */}
                <div className="grid grid-cols-6 gap-4 relative" style={{zIndex: 2}}>
                  {/* Site */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Site</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.site || '-'}
                    </div>
                  </div>

                  {/* Building */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Building</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.building || '-'}
                    </div>
                  </div>

                  {/* Wing */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Wing</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.wing || '-'}
                    </div>
                  </div>

                  {/* Floor */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Floor</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.floor || '-'}
                    </div>
                  </div>

                  {/* Area */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Area</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.area || '-'}
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Room</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.room || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity */}
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <FileText className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Activity</h3>
              </div>
            </div>
            <div className="figma-card-content">
              {(taskDetails?.checklist_questions?.length > 0 || taskDetails?.activity?.resp?.length > 0) ? (
                <div className="space-y-6">
                  {/* Grouped Checklist Sections */}
                  {getGroupedActivityData().map((section, sectionIndex) => (
                    <div key={section.sectionKey} className="space-y-3">
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2 rounded-lg border-l-4 border-[#C72030AD]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-semibold text-gray-800">
                              {section.group_name}
                            </h4>
                            {section.sub_group_name && (
                              <p className="text-sm text-gray-600 mt-1">
                                {section.sub_group_name}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-[rgba(196,184,157,0.33)] text-black-700 px-3 py-1">
                            Section {sectionIndex + 1}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Section Table */}
                      <EnhancedTable
                        data={section.activities}
                        columns={activityColumns}
                        renderCell={renderActivityCell}
                        emptyMessage="No activities found in this section."
                        hideTableExport={true}
                        hideTableSearch={true}
                        hideColumnsButton={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No activities found for this task.
                </p>
              )}
            </div>
          </Card>

          {/* Ticket Details - Show only for closed/completed status */}
          {(() => {
            const status = taskDetails?.task_details?.status?.value?.toLowerCase();
            return ['closed', 'completed'].includes(status) && (
              <Card className="w-full bg-transparent shadow-none border-none">
                <div className="figma-card-header">
                  <div className="flex items-center gap-3">
                    <div className="figma-card-icon-wrapper">
                      <FileText className="figma-card-icon" />
                    </div>
                    <h3 className="figma-card-title">Ticket Details</h3>
                  </div>
                </div>
                <div className="figma-card-content">
                  {ticketLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C72030] mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading ticket details...</p>
                    </div>
                  ) : ticketData ? (
                    <EnhancedTable
                      data={[ticketData]}
                      columns={ticketColumns}
                      renderCell={renderTicketCell}
                      storageKey="task-ticket-table"
                      emptyMessage="No tickets found for this task."
                      hideTableExport={true}
                      hideTableSearch={true}
                      hideColumnsButton={true}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tickets found for this task.</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })()}
        </div>
      </div>

      {/* Task submission now navigates to separate page */}

      {/* Task Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent
          className="max-w-lg"
          aria-describedby="reschedule-dialog-description"
        >
          <span id="reschedule-dialog-description" className="sr-only">
            Select a new schedule date, time, user, and notification preferences for this task.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Task Reschedule</DialogTitle>
            <button
              onClick={() => setShowRescheduleDialog(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                New Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Schedule Date"
                  type="date"
                  value={rescheduleData.scheduleDate}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleDate: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
                <TextField
                  label="Time"
                  type="time"
                  value={rescheduleData.scheduleTime}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleTime: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Notification Preferences
              </h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={rescheduleData.email}
                  onCheckedChange={checked =>
                    setRescheduleData(prev => ({
                      ...prev,
                      email: !!checked
                    }))
                  }
                />
                <label htmlFor="email" className="text-sm font-medium">
                  Email Notification
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleSubmit}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90 px-6"
              >
                Reschedule Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Sheet Modal */}
      <JobSheetModal
        isOpen={showJobSheetModal}
        onClose={handleCloseJobSheet}
        taskId={id || ''}
        taskDetails={taskDetails}
        jobSheetData={jobSheetData}
        jobSheetLoading={jobSheetLoading}
      />
    </>
  );
};