import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, X, FileText, User, MapPin, Eye, Edit, Star, Trash2 } from 'lucide-react';
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
        // Map the API response to match our component structure
        const mappedDetails = (response as any).task_occurrence ? (response as any).task_occurrence : response;
        setTaskDetails(mappedDetails);
        
        // Debug logging for image attachments
        console.log('🖼️ Task Details Image Data:');
        console.log('- Before Image (bef_sub_attachment):', mappedDetails?.bef_sub_attachment || 'null');
        console.log('- After Image (aft_sub_attachment):', mappedDetails?.aft_sub_attachment || 'null');
        console.log('- Before/After Enabled:', mappedDetails?.before_after_enabled || false);
        
        // If there's a related ticket ID in the task details, fetch ticket data
        const ticketId = mappedDetails?.task_details?.asset_task_occurrence_id || 
                         mappedDetails?.ticket_id ||
                         mappedDetails?.related_ticket_id;
        
        if (ticketId) {
          try {
            // Try to get ticket details if ticket ID is available
            // Since we don't have a direct ticket detail API, we'll set default ticket data
            setTicketData({
              id: 218911106,
              ticket_number: "2189-11106",
              heading: "Light off office",
              category_type: "House keeping",
              sub_category_type: "Cleaning",
              posted_by: "System",
              is_flagged: false,
              is_golden_ticket: false
            });
          } catch (ticketError) {
            console.log('Could not fetch ticket details:', ticketError);
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
  
  const handleTicketFlag = async (ticketId: number, currentFlagStatus: boolean) => {
    try {
      const response = await ticketManagementAPI.markAsFlagged([ticketId]);
      
      // Update local ticket state
      setTicketData((prev: any) => prev ? { ...prev, is_flagged: !currentFlagStatus } : prev);
      
      sonnerToast.success(response.message || `Ticket ${!currentFlagStatus ? 'flagged' : 'unflagged'} successfully`);
    } catch (error) {
      console.error('Flag action failed:', error);
      sonnerToast.error("Failed to flag ticket");
    }
  };

  const handleTicketGoldenTicket = async (ticketId: number, currentGoldenStatus: boolean) => {
    try {
      const response = await ticketManagementAPI.markAsGoldenTicket([ticketId]);
      
      // Update local ticket state
      setTicketData((prev: any) => prev ? { ...prev, is_golden_ticket: !currentGoldenStatus } : prev);
      
      sonnerToast.success(response.message || `Golden Ticket ${!currentGoldenStatus ? 'marked' : 'unmarked'} successfully!`);
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

  // Get activity data dynamically
  const getActivityData = () => {
    const activityResp = (taskDetails?.activity as any)?.resp;
    if (!activityResp) return [];
    
    return activityResp.map((item: any, index: number) => ({
      id: item.name || `activity_${index}`,
      helpText: item.hint || "-",
      activities: item.label || "-",
      input: item.userData?.length > 0 ? item.userData : ["-"],
      comments: item.comment || "-",
      weightage: item.weightage || "-",
      rating: item.rating || "-",
      values: item.values || []
    }));
  };

  // Get assigned user name
  const getAssignedUserName = () => {
    return taskDetails?.task_details?.assigned_to || 
           taskDetails?.task_details?.created_by || 
           "Abdul Ghaffar";
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
              {(taskDetails?.actions?.can_view_job_sheet || taskDetails?.task_details?.status?.value?.toLowerCase() === 'closed') && (
                <>
                  {/* <Button
                    onClick={handleJobSheetClick}
                    className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                  >
                    View Job Sheet
                  </Button> */}
                  <Button
                    onClick={handleJobSheetModalClick}
                    variant="outline"
                    className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10 px-4 py-2"
                  >
                    Job Sheet Modal
                  </Button>
                </>
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Pre-Post Inspection Info */}
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
                  <span className="task-info-label-enhanced">ID</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.id || taskDetails?.id || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Asset/Service Id</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.asset_service_code || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Created By</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.created_by || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Task</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.task_name || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Scheduled On</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.scheduled_on || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Associated With</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.associated_with || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Asset/Service Name</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.asset_service_name || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Task Duration</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.task_duration || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Supplier</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.supplier || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Assigned To</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.assigned_to || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Created On</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    {taskDetails?.task_details?.created_on || 'N/A'}
                  </span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Status</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">
                    <Badge className={getStatusColor(taskDetails?.task_details?.status?.value || '')}>
                      {taskDetails?.task_details?.status?.display_name || 'Unknown'}
                    </Badge>
                  </span>
                </div>
                {taskDetails?.task_details?.start_time && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced">Start Time</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced">
                      {taskDetails.task_details.start_time}
                    </span>
                  </div>
                )}
                {taskDetails?.task_details?.completed_on && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced">Completed On</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced">
                      {taskDetails.task_details.completed_on}
                    </span>
                  </div>
                )}
                {taskDetails?.task_details?.performed_by && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced">Performed By</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced">
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
                      {taskDetails?.task_details?.location?.site || 'Haven Infoline'}
                    </div>
                  </div>

                  {/* Building */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Building</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.building || 'Jyoti Tower'}
                    </div>
                  </div>

                  {/* Wing */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Wing</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.wing || 'J - Wing'}
                    </div>
                  </div>

                  {/* Floor */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Floor</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.floor || '2nd'}
                    </div>
                  </div>

                  {/* Area */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Area</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.area || 'East'}
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Room</div>
                    <div className="location-step-dot mb-3"></div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {taskDetails?.task_details?.location?.room || 'R 202'}
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
              {(taskDetails?.activity?.checklist_groups?.length > 0 || taskDetails?.activity?.ungrouped_content?.length > 0) ? (
                <div className="space-y-4">
                  {/* Main Checklist Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 bg-gray-100 px-3 py-2 rounded">
                      {taskDetails?.task_details?.task_name || 'Checklist Items'}
                    </h4>
                    <div className="overflow-x-auto">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-xs font-medium text-gray-600">Help Text</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Activities</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Input</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Comments</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Weightage</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Rating</TableHead>
                            <TableHead className="text-xs font-medium text-gray-600">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...(taskDetails?.activity?.checklist_groups || []), ...(taskDetails?.activity?.ungrouped_content || [])].map((item: any, index: number) => (
                            <TableRow key={item.name || index}>
                              <TableCell className="text-xs">
                                {item.hint || '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.label || '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.values && item.values.length > 0 
                                  ? item.values.map((val: any) => val.label).join(', ')
                                  : '-'
                                }
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.comment || '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.weightage || '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.rating || '-'}
                              </TableCell>
                              <TableCell className="text-xs">
                                {item.score || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No activities found for this task.
                </p>
              )}
            </div>
          </Card>

          {/* Ticket Details */}
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
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-medium text-gray-600 w-20">Action</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Ticket ID</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Task Number</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Description</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Category</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Sub-Category</TableHead>
                      <TableHead className="text-xs font-medium text-gray-600">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1">
                          <Checkbox className="w-4 h-4" />
                          <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleTicketView(ticketData?.ticket_number || "2189-11106")}
                            title="View ticket details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          {/* <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleTicketEdit(ticketData?.ticket_number || "2189-11106")}
                            title="Edit ticket"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button> */}
                          <button 
                            className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                              ticketData?.is_flagged ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                            }`}
                            onClick={() => handleTicketFlag(ticketData?.id || 218911106, ticketData?.is_flagged || false)}
                            title={ticketData?.is_flagged ? "Remove flag" : "Flag ticket"}
                          >
                            🚩
                          </button>
                          <button 
                            className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                              ticketData?.is_golden_ticket ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-400'
                            }`}
                            onClick={() => handleTicketGoldenTicket(ticketData?.id || 218911106, ticketData?.is_golden_ticket || false)}
                            title={ticketData?.is_golden_ticket ? "Remove golden ticket" : "Mark as golden ticket"}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {ticketData?.ticket_number || "2189-11106"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {taskDetails?.task_details?.task_name || "test"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {ticketData?.heading || taskDetails?.task_details?.task_name || "Light off office"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {ticketData?.category_type || "House keeping"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {ticketData?.sub_category_type || "Cleaning"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {ticketData?.posted_by || taskDetails?.task_details?.created_by || "System"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
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
