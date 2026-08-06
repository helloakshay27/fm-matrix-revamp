import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, RefreshCw, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';
import { EditMoveInOutModal } from '@/components/EditMoveInOutModal';
import { EditWorkTypeModal } from '@/components/EditWorkTypeModal';
import { EditVisitorCommentModal } from '@/components/EditVisitorCommentModal';
import { fetchSites, fetchAllowedSites, Site } from '@/services/sitesAPI';
import { fetchVisitorSetup, VisitPurpose, MoveInOutPurpose, StaffType, VisitorComment } from '@/services/visitorSetupAPI';
import { createVisitPurpose, editVisitPurpose } from '@/services/visitPurposeAPI';
import { createMoveInOutPurpose } from '@/services/moveInOutPurposeAPI';
import { createWorkType } from '@/services/workTypeAPI';
import { createVisitorComment } from '@/services/visitorCommentAPI';
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import {
  VisitingPurposeFilterDialog,
  type VisitingPurposeFilters,
} from '@/components/VisitingPurposeFilterDialog';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  backgroundColor: '#fff',
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    backgroundColor: '#ffffff',
    paddingLeft: '4px',
    paddingRight: '4px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
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
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const isMuiOverlayTarget = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.(
    '.MuiPopover-root, .MuiModal-root, .MuiMenu-root'
  );

const outlineBrandBtn =
  'border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030]';
const solidBrandBtn = 'bg-brand hover:bg-brand-hover text-white';

interface VisitingPurposeData {
  id: number;
  purpose: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
  active?: number; // For API compatibility
}

interface MoveInOutData {
  id: number;
  purpose: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
  active?: number; // For API compatibility
}

interface WorkTypeData {
  id: number;
  staffType: string;
  workType: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
  active?: number; // For API compatibility
}

interface VisitorCommentData {
  id: number;
  comment: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
  description?: string; // For API compatibility
  active?: boolean; // For API compatibility
}

export const VisitingPurposePage = () => {
  const navigate = useNavigate();
   const { shouldShow } = useDynamicPermissions();

  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [activeTab, setActiveTab] = useState('Visit Purpose');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VisitingPurposeFilters>({ name: '', status: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveInOutModalOpen, setIsMoveInOutModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPurpose, setEditingPurpose] = useState<VisitingPurposeData | null>(null);
  const [editingPurposes, setEditingPurposes] = useState<string[]>(['']);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
  // Edit modal states for different types
  const [isEditMoveInOutModalOpen, setIsEditMoveInOutModalOpen] = useState(false);
  const [editingMoveInOut, setEditingMoveInOut] = useState<MoveInOutData | null>(null);
  const [isEditWorkTypeModalOpen, setIsEditWorkTypeModalOpen] = useState(false);
  const [editingWorkType, setEditingWorkType] = useState<WorkTypeData | null>(null);
  const [isEditVisitorCommentModalOpen, setIsEditVisitorCommentModalOpen] = useState(false);
  const [editingVisitorComment, setEditingVisitorComment] = useState<VisitorCommentData | null>(null);
  const [formData, setFormData] = useState({
    purpose: '',
    active: true
  });
  const [moveInOutFormData, setMoveInOutFormData] = useState({
    purpose: '',
    active: true
  });
  const [workTypeFormData, setWorkTypeFormData] = useState({
    staffType: '',
    workType: '',
    active: true
  });
  const [commentFormData, setCommentFormData] = useState({
    comment: '',
    active: true
  });

  // Initialize all data arrays as empty - will be populated from API
  const [purposes, setPurposes] = useState<VisitingPurposeData[]>([]);
  const [moveInOutData, setMoveInOutData] = useState<MoveInOutData[]>([]);
  const [workTypeData, setWorkTypeData] = useState<WorkTypeData[]>([]);
  const [commentsData, setCommentsData] = useState<VisitorCommentData[]>([]);
  
  // Sites state
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  
  // Visitor setup data loading state
  const [loadingVisitorSetup, setLoadingVisitorSetup] = useState(true);
  const [staffTypes, setStaffTypes] = useState<StaffType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingMoveInOut, setIsSubmittingMoveInOut] = useState(false);
  const [isSubmittingWorkType, setIsSubmittingWorkType] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    setCurrentSection('Settings');
    
    // Function to load sites from API
    const loadSites = async () => {
      setLoadingSites(true);
      try {
        // First try to get user ID from localStorage for allowed sites
        const userId = localStorage.getItem('userId');
        
        // Check if we have base URL and token
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        
        console.log('Site API Debug:', {
          hasUserId: !!userId,
          hasToken: !!token,
          hasBaseUrl: !!baseUrl,
          userId,
          tokenLength: token?.length || 0,
          baseUrl
        });
        
        if (!token || !baseUrl) {
          console.warn('Missing authentication or base URL');
          return;
        }
        
        if (userId) {
          console.log('Fetching allowed sites for user:', userId);
          const allowedSitesResponse = await fetchAllowedSites(userId);
          if (allowedSitesResponse.sites && allowedSitesResponse.sites.length > 0) {
            setSites(allowedSitesResponse.sites);
            // toast({
            //   title: "Sites Loaded",
            //   description: `Loaded ${allowedSitesResponse.sites.length} allowed sites`,
            // });
            return;
          }
        }
        
        // Fallback to all sites if no user-specific sites found
        console.log('Fetching all available sites...');
        const sitesResponse = await fetchSites();
        if (sitesResponse.sites && sitesResponse.sites.length > 0) {
          setSites(sitesResponse.sites);
          toast({
            title: "Sites Loaded",
            description: `Loaded ${sitesResponse.sites.length} sites`,
          });
        } else {
          console.log('No sites found from API');
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        toast({
          title: "Sites Loading Failed",
          description: "Failed to load sites. Please check your internet connection.",
          variant: "destructive",
        });
      } finally {
        setLoadingSites(false);
      }
    };

    // Function to load visitor setup data from API
    const loadVisitorSetupData = async () => {
      setLoadingVisitorSetup(true);
      // Clear all data at start to ensure clean state
      setPurposes([]);
      setMoveInOutData([]);
      setWorkTypeData([]);
      setCommentsData([]);
      
      try {
        console.log('Fetching visitor setup data...');
        const visitorSetupResponse = await fetchVisitorSetup();
        
        // Transform API data to component format
        if (visitorSetupResponse.visit_purposes && visitorSetupResponse.visit_purposes.length > 0) {
          const transformedPurposes: VisitingPurposeData[] = visitorSetupResponse.visit_purposes.map((purpose) => ({
            id: purpose.id,
            purpose: purpose.purpose,
            status: Boolean(purpose.active),
            createdOn: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            createdBy: 'System',
            active: purpose.active
          }));
          setPurposes(transformedPurposes);
        }

        if (visitorSetupResponse.move_in_out_purposes && visitorSetupResponse.move_in_out_purposes.length > 0) {
          const transformedMoveInOut: MoveInOutData[] = visitorSetupResponse.move_in_out_purposes.map((purpose) => ({
            id: purpose.id,
            purpose: purpose.purpose,
            status: Boolean(purpose.active),
            createdOn: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            createdBy: 'System',
            active: purpose.active
          }));
          setMoveInOutData(transformedMoveInOut);
        }

        if (visitorSetupResponse.staff_types && visitorSetupResponse.staff_types.length > 0) {
          const transformedWorkTypes: WorkTypeData[] = visitorSetupResponse.staff_types.map((staffType) => ({
            id: staffType.id,
            staffType: staffType.related_to || 'Unknown', // related_to becomes Staff Type column
            workType: staffType.staff_type, // staff_type becomes Work Type column
            status: Boolean(staffType.active),
            createdOn: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            createdBy: 'System',
            active: staffType.active
          }));
          setWorkTypeData(transformedWorkTypes);
          setStaffTypes(visitorSetupResponse.staff_types);
        }

        if (visitorSetupResponse.visitor_comment) {
          const transformedComment: VisitorCommentData[] = [{
            id: visitorSetupResponse.visitor_comment.id,
            comment: visitorSetupResponse.visitor_comment.description,
            status: Boolean(visitorSetupResponse.visitor_comment.active),
            createdOn: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            createdBy: 'System',
            description: visitorSetupResponse.visitor_comment.description,
            active: visitorSetupResponse.visitor_comment.active
          }];
          setCommentsData(transformedComment);
        } else {
          // Explicitly set empty array if no visitor comment in API response
          setCommentsData([]);
        }

        // toast({
        //   title: "Visitor Setup Data Loaded",
        //   description: "All visitor setup data loaded successfully from API",
        // });

      } catch (error) {
        console.error('Error loading visitor setup data:', error);
        // Ensure all data is cleared on API error
        setPurposes([]);
        setMoveInOutData([]);
        setWorkTypeData([]);
        setCommentsData([]);
        toast({
          title: "API Loading Failed",
          description: "Failed to load visitor setup data from API.",
          variant: "destructive",
        });
      } finally {
        setLoadingVisitorSetup(false);
      }
    };

    // Load both sites and visitor setup data
    loadSites();
    loadVisitorSetupData();
  }, [setCurrentSection, toast]);

  // Filter functions for each tab data
  const getFilteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const nameFilter = filters.name.trim().toLowerCase();
    const statusFilter = filters.status.toLowerCase();

    const matchesCommon = (name: string, status: boolean, createdOn: string, createdBy: string) => {
      const statusLabel = status ? 'active' : 'inactive';
      if (nameFilter && !name.toLowerCase().includes(nameFilter)) return false;
      if (statusFilter && statusLabel !== statusFilter) return false;
      if (q) {
        return (
          name.toLowerCase().includes(q) ||
          createdBy.toLowerCase().includes(q) ||
          createdOn.toLowerCase().includes(q) ||
          statusLabel.includes(q)
        );
      }
      return true;
    };

    switch (activeTab) {
      case 'Visit Purpose':
        return purposes.filter((item) =>
          matchesCommon(item.purpose, item.status, item.createdOn, item.createdBy)
        );
      case 'Move In/Out':
        return moveInOutData.filter((item) =>
          matchesCommon(item.purpose, item.status, item.createdOn, item.createdBy)
        );
      case 'Work Type':
        return workTypeData.filter((item) => {
          const name = `${item.staffType} ${item.workType}`;
          return matchesCommon(name, item.status, item.createdOn, item.createdBy);
        });
      case 'Visitor Comment':
        return commentsData.filter((item) =>
          matchesCommon(item.comment, item.status, item.createdOn, item.createdBy)
        );
      default:
        return [];
    }
  }, [activeTab, purposes, moveInOutData, workTypeData, commentsData, searchTerm, filters]);

  const tableColumns = useMemo((): ColumnConfig[] => {
    switch (activeTab) {
      case 'Work Type':
        return [
          { key: 'staffType', label: 'Staff Type', sortable: true, defaultVisible: true },
          { key: 'workType', label: 'Work Type', sortable: true, defaultVisible: true },
          { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
          { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
        ];
      case 'Visitor Comment':
        return [
          { key: 'comment', label: 'Comment', sortable: true, defaultVisible: true },
          { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
          { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
        ];
      case 'Move In/Out':
        return [
          { key: 'purpose', label: 'Move In/Out Purpose', sortable: true, defaultVisible: true },
          { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
          { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
        ];
      case 'Visit Purpose':
      default:
        return [
          { key: 'purpose', label: 'Purpose', sortable: true, defaultVisible: true },
          { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
          { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
        ];
    }
  }, [activeTab]);

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.status ? 'Active' : 'Inactive'}
          </span>
        );
      case 'createdOn':
        return <span className="text-sm text-gray-600">{item.createdOn}</span>;
      case 'purpose':
      case 'comment':
      case 'staffType':
      case 'workType':
        return <span className="font-medium">{item[columnKey]}</span>;
      default:
        return item[columnKey] ?? '-';
    }
  };

  const renderTableActions = (item: any) => {
    if (activeTab === 'Visit Purpose' && !shouldShow('Visiting Purpose', 'update')) {
      return null;
    }

    const onEdit = () => {
      if (activeTab === 'Visit Purpose') handleEdit(item.id);
      else if (activeTab === 'Move In/Out') handleEditMoveInOut(item.id);
      else if (activeTab === 'Work Type') handleEditWorkType(item.id);
      else handleEditVisitorComment(item.id);
    };

    return (
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-brand hover:bg-brand-selected"
          onClick={onEdit}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const handleAddPurpose = () => {
    setIsAddModalOpen(true);
  };

  const handleMoveInOut = () => {
    setIsMoveInOutModalOpen(true);
  };

  const handleMoveInOutModalClose = () => {
    setIsMoveInOutModalOpen(false);
    setMoveInOutFormData({
      purpose: '',
      active: true
    });
  };

  const handleMoveInOutSubmit = async () => {
    if (!moveInOutFormData.purpose) {
      toast({
        title: "Error",
        description: "Please enter a move in/out purpose",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingMoveInOut(true);
    
    try {
      // Split purposes by pipe separator for multiple purposes
      const purposeList = moveInOutFormData.purpose.split('|').filter(p => p.trim());
      
      // Create each purpose via API (resource_id will be handled by backend)
      const createPromises = purposeList.map(async (purpose) => {
        const result = await createMoveInOutPurpose(purpose.trim(), moveInOutFormData.active);
        return result;
      });
      
      const results = await Promise.all(createPromises);
      
      // Check if all API calls were successful
      const successfulCreations = results.filter(result => result.success);
      const failedCreations = results.filter(result => !result.success);
      
      if (successfulCreations.length > 0) {
        // Add the new purposes to local state for immediate UI update
        const newMoveInOutPurposes: MoveInOutData[] = purposeList.map((purpose, index) => ({
          id: Math.max(...moveInOutData.map(p => p.id), 0) + index + 1,
          purpose: purpose.trim(),
          status: moveInOutFormData.active,
          createdOn: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          createdBy: 'Current User'
        }));

        setMoveInOutData(prev => [...prev, ...newMoveInOutPurposes]);
        
        toast({
          title: "Success",
          description: `${successfulCreations.length} move in/out purpose(s) created successfully`,
        });
      }
      
      if (failedCreations.length > 0) {
        toast({
          title: "Partial Success",
          description: `${failedCreations.length} purpose(s) failed to create. Check console for details.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error creating move in/out purpose:', error);
      toast({
        title: "Error",
        description: "Failed to create move in/out purpose. Please try again.",
        variant: "destructive"
      });
      return;
    } finally {
      setIsSubmittingMoveInOut(false);
    }

    handleMoveInOutModalClose();
  };

  const handleWorkType = () => {
    setIsWorkTypeModalOpen(true);
  };

  const handleWorkTypeModalClose = () => {
    setIsWorkTypeModalOpen(false);
    setWorkTypeFormData({
      staffType: '',
      workType: '',
      active: true
    });
  };

  const handleWorkTypeSubmit = async () => {
    if (!workTypeFormData.workType) {
      toast({
        title: "Error",
        description: "Please enter a work type",
        variant: "destructive"
      });
      return;
    }

    if (!workTypeFormData.staffType) {
      toast({
        title: "Error",
        description: "Please select staff type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingWorkType(true);
    
    try {
      // Split work types by pipe separator for multiple work types
      const workTypeList = workTypeFormData.workType.split('|').filter(wt => wt.trim());
      
      // Create each work type via API (resource_id will be handled by backend)
      const createPromises = workTypeList.map(async (workType) => {
        const result = await createWorkType(
          workType.trim(),
          workTypeFormData.staffType,
          workTypeFormData.active
        );
        return result;
      });
      
      const results = await Promise.all(createPromises);
      
      // Check if all API calls were successful
      const successfulCreations = results.filter(result => result.success);
      const failedCreations = results.filter(result => !result.success);
      
      if (successfulCreations.length > 0) {
        // Add the new work types to local state for immediate UI update
        const newWorkTypes: WorkTypeData[] = workTypeList.map((workType, index) => ({
          id: Math.max(...workTypeData.map(wt => wt.id), 0) + index + 1,
          staffType: workTypeFormData.staffType,
          workType: workType.trim(),
          status: workTypeFormData.active,
          createdOn: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          createdBy: 'Current User'
        }));

        setWorkTypeData(prev => [...prev, ...newWorkTypes]);
        
        toast({
          title: "Success",
          description: `${successfulCreations.length} work type(s) created successfully`,
        });
      }
      
      if (failedCreations.length > 0) {
        toast({
          title: "Partial Success",
          description: `${failedCreations.length} work type(s) failed to create. Check console for details.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error creating work type:', error);
      toast({
        title: "Error",
        description: "Failed to create work type. Please try again.",
        variant: "destructive"
      });
      return;
    } finally {
      setIsSubmittingWorkType(false);
    }

    handleWorkTypeModalClose();
  };

  const handleVisitorCategory = () => {
    setIsCommentModalOpen(true);
  };

  const handleCommentModalClose = () => {
    setIsCommentModalOpen(false);
    setCommentFormData({
      comment: '',
      active: true
    });
  };

  const handleCommentSubmit = async () => {
    if (!commentFormData.comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      console.log('Creating visitor comment with data:', commentFormData);
      
      const result = await createVisitorComment(
        commentFormData.comment.trim(),
        commentFormData.active
      );
      
      if (result.success) {
        // Add the new comment to local state for immediate UI update
        const newComment: VisitorCommentData = {
          id: Math.max(...commentsData.map(c => c.id), 0) + 1,
          comment: commentFormData.comment.trim(),
          status: commentFormData.active,
          createdOn: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          createdBy: 'Current User'
        };

        setCommentsData(prev => [...prev, newComment]);
        
        toast({
          title: "Success",
          description: "Visitor comment created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create visitor comment. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
    } catch (error) {
      console.error('Error creating visitor comment:', error);
      toast({
        title: "Error",
        description: "Failed to create visitor comment. Please try again.",
        variant: "destructive"
      });
      return;
    } finally {
      setIsSubmittingComment(false);
    }

    handleCommentModalClose();
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      purpose: '',
      active: true
    });
  };

  const handleSubmit = async () => {
    if (!formData.purpose) {
      toast({
        title: "Error",
        description: "Please enter a purpose",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Split purposes by pipe separator for multiple purposes
      const purposeList = formData.purpose.split('|').filter(p => p.trim());
      
      // Create each purpose via API (resource_id will be handled by backend)
      const createPromises = purposeList.map(async (purpose) => {
        const result = await createVisitPurpose(purpose.trim(), formData.active);
        return result;
      });
      
      const results = await Promise.all(createPromises);
      
      // Check if all API calls were successful
      const successfulCreations = results.filter(result => result.success);
      const failedCreations = results.filter(result => !result.success);
      
      if (successfulCreations.length > 0) {
        // Add the new purposes to local state for immediate UI update
        const newPurposes: VisitingPurposeData[] = purposeList.map((purpose, index) => ({
          id: Math.max(...purposes.map(p => p.id), 0) + index + 1,
          purpose: purpose.trim(),
          status: formData.active,
          createdOn: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          createdBy: 'Current User'
        }));

        setPurposes(prev => [...prev, ...newPurposes]);
        
        toast({
          title: "Success",
          description: `${successfulCreations.length} visiting purpose(s) created successfully`,
        });
      }
      
      if (failedCreations.length > 0) {
        toast({
          title: "Partial Success",
          description: `${failedCreations.length} purpose(s) failed to create. Check console for details.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error creating visit purpose:', error);
      toast({
        title: "Error",
        description: "Failed to create visiting purpose. Please try again.",
        variant: "destructive"
      });
      return;
    } finally {
      setIsSubmitting(false);
    }

    handleModalClose();
  };

  const handleStatusToggle = (id: number) => {
    setPurposes(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, status: !item.status }
          : item
      )
    );
    
    const updatedItem = purposes.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.status : false;
    toast({
      title: "Status Updated",
      description: `Purpose status updated to ${newValue ? 'Active' : 'Inactive'}`
    });
  };

  const handleEdit = (purposeId: number) => {
    const purpose = purposes.find(p => p.id === purposeId);
    if (purpose) {
      setEditingPurpose(purpose);
      // Split the purpose string by pipe separator or use single purpose
      const purposeArray = purpose.purpose.includes('|') 
        ? purpose.purpose.split('|') 
        : [purpose.purpose];
      setEditingPurposes(purposeArray);
      setIsEditModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPurpose(null);
    setEditingPurposes(['']);
  };

  const handleEditSubmit = async () => {
    if (!editingPurpose) return;

    const validPurposes = editingPurposes.filter(p => p.trim());
    
    if (validPurposes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one purpose",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingEdit(true);
    
    try {
      // For edit, we'll update with the first purpose (main purpose)
      // Multiple purposes can be handled differently if needed
      const mainPurpose = validPurposes[0];
      
      const result = await editVisitPurpose(
        editingPurpose.id,
        mainPurpose,
        editingPurpose.status
      );
      
      if (result.success) {
        // Update local state for immediate UI update
        setPurposes(prev => 
          prev.map(p => 
            p.id === editingPurpose.id 
              ? { 
                  ...p, 
                  purpose: validPurposes.join('|'), 
                  status: editingPurpose.status,
                  createdOn: new Date().toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })
                }
              : p
          )
        );

        toast({
          title: "Success",
          description: "Purpose updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update purpose. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
    } catch (error) {
      console.error('Error updating purpose:', error);
      toast({
        title: "Error",
        description: "Failed to update purpose. Please try again.",
        variant: "destructive"
      });
      return;
    } finally {
      setIsSubmittingEdit(false);
    }

    handleEditModalClose();
  };

  const handleDelete = (purposeId: number) => {
    setPurposes(prev => prev.filter(item => item.id !== purposeId));
    toast({
      title: "Delete Purpose",
      description: "Purpose deleted successfully",
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setFilters({ name: '', status: '' });
  };

  // Edit handlers for different types
  const handleEditMoveInOut = (itemId: number) => {
    const item = moveInOutData.find(m => m.id === itemId);
    if (item) {
      setEditingMoveInOut(item);
      setIsEditMoveInOutModalOpen(true);
    }
  };

  const handleEditWorkType = (itemId: number) => {
    const item = workTypeData.find(w => w.id === itemId);
    if (item) {
      setEditingWorkType(item);
      setIsEditWorkTypeModalOpen(true);
    }
  };

  const handleEditVisitorComment = (itemId: number) => {
    const item = commentsData.find(c => c.id === itemId);
    if (item) {
      setEditingVisitorComment(item);
      setIsEditVisitorCommentModalOpen(true);
    }
  };

  // Update handlers for different types
  const handleUpdateMoveInOut = (updatedData: MoveInOutData) => {
    setMoveInOutData(prev => 
      prev.map(item => 
        item.id === updatedData.id ? updatedData : item
      )
    );
  };

  const handleUpdateWorkType = (updatedData: WorkTypeData) => {
    setWorkTypeData(prev => 
      prev.map(item => 
        item.id === updatedData.id ? updatedData : item
      )
    );
  };

  const handleUpdateVisitorComment = (updatedData: VisitorCommentData) => {
    setCommentsData(prev => 
      prev.map(item => 
        item.id === updatedData.id ? updatedData : item
      )
    );
  };

  // Helper functions for editing purposes
  const addEditPurpose = () => {
    setEditingPurposes([...editingPurposes, '']);
  };

  const removeEditPurpose = (index: number) => {
    if (editingPurposes.length > 1) {
      const newPurposes = editingPurposes.filter((_, i) => i !== index);
      setEditingPurposes(newPurposes);
    }
  };

  const updateEditPurpose = (index: number, value: string) => {
    const newPurposes = [...editingPurposes];
    newPurposes[index] = value;
    setEditingPurposes(newPurposes);
  };

  const leftActions = (() => {
    if (activeTab === 'Visit Purpose' && shouldShow('Visiting Purpose', 'create')) {
      return (
        <Button
          onClick={handleAddPurpose}
          className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Purpose
        </Button>
      );
    }
    if (activeTab === 'Move In/Out' && shouldShow('Visiting Purpose', 'create')) {
      return (
        <Button
          onClick={handleMoveInOut}
          className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Move In/Out
        </Button>
      );
    }
    if (activeTab === 'Work Type' && shouldShow('Visiting Purpose', 'create')) {
      return (
        <Button
          onClick={handleWorkType}
          className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Work Type
        </Button>
      );
    }
    if (activeTab === 'Visitor Comment' && commentsData.length === 0) {
      return (
        <Button
          onClick={handleVisitorCategory}
          className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Visitor Comment
        </Button>
      );
    }
    return null;
  })();

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          {/* Debug Panel - Remove this in production */}
          {/* <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-yellow-800">API Debug Panel</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const token = localStorage.getItem('token');
                  const baseUrl = localStorage.getItem('baseUrl');
                  const userId = localStorage.getItem('userId');
                  console.log('=== Manual API Debug Check ===');
                  console.log('Token:', token ? `Present (${token.length} chars)` : 'Missing');
                  console.log('Base URL:', baseUrl || 'Missing');
                  console.log('User ID:', userId || 'Missing');
                  console.log('Sites count:', sites.length);
                  console.log('Loading sites:', loadingSites);
                  toast({
                    title: "API Debug",
                    description: `Token: ${token ? 'Present' : 'Missing'}, BaseURL: ${baseUrl ? 'Present' : 'Missing'}, Sites: ${sites.length}`,
                  });
                }}
              >
                Debug API Status
              </Button>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              Sites loaded: {sites.length} | Loading: {loadingSites ? 'Yes' : 'No'}
            </div>
          </div> */}
          {/* Loading indicator */}
          {/* {(loadingSites || loadingVisitorSetup) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  Loading visitor setup data...
                </span>
              </div>
            </div>
          )} */}
          
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex border-b border-gray-200">
              {['Visit Purpose', 'Move In/Out', 'Work Type', 'Visitor Comment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-brand text-brand bg-brand-selected'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              <EnhancedTable
                data={getFilteredData}
                columns={tableColumns}
                renderCell={renderTableCell}
                renderActions={renderTableActions}
                leftActions={leftActions}
                storageKey={`visiting-purpose-${activeTab}`}
                emptyMessage={
                  searchTerm || Object.values(filters).some(Boolean)
                    ? 'No records found matching your search'
                    : 'No data available'
                }
                loading={loadingVisitorSetup}
                loadingMessage="Loading..."
                enableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search..."
                disableClientSearch
                onFilterClick={() => setShowFilters(true)}
                hideTableExport
                pagination
                pageSize={10}
                getItemId={(item) => String(item.id)}
              />
            </div>
          </div>

          <VisitingPurposeFilterDialog
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onApplyFilters={setFilters}
            onResetFilters={() => setFilters({ name: '', status: '' })}
          />
        </div>
      </div>

      {/* Add Purpose Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-full sm:max-w-[500px] !bg-white overflow-visible">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Add Purpose</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleModalClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Purpose *</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentPurposes = formData.purpose ? formData.purpose.split('|') : [''];
                  setFormData({ ...formData, purpose: [...currentPurposes, ''].join('|') });
                }}
                className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.purpose ? formData.purpose.split('|') : ['']).map((purpose, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextField
                    label={`Purpose ${index + 1} *`}
                    value={purpose}
                    onChange={(e) => {
                      const purposes = formData.purpose ? formData.purpose.split('|') : [''];
                      purposes[index] = e.target.value;
                      setFormData({ ...formData, purpose: purposes.join('|') });
                    }}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                  />
                  {(formData.purpose ? formData.purpose.split('|') : ['']).length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const purposes = formData.purpose ? formData.purpose.split('|') : [''];
                        purposes.splice(index, 1);
                        setFormData({ ...formData, purpose: purposes.join('|') });
                      }}
                      className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0 h-10 w-10 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked as boolean })
                }
              />
              <Label htmlFor="active" className="text-sm font-medium">
                Active
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'CREATE'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Move In/Out Purpose Modal */}
      <Dialog open={isMoveInOutModalOpen} onOpenChange={setIsMoveInOutModalOpen}>
        <DialogContent className="max-w-md !bg-white">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Move In/Out Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMoveInOutModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Multiple Move In/Out Purpose Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Purpose *</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentPurposes = moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : [''];
                    setMoveInOutFormData({...moveInOutFormData, purpose: [...currentPurposes, ''].join('|')});
                  }}
                  className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-3">
                {(moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : ['']).map((purpose, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <TextField
                      label={`Purpose ${index + 1} *`}
                      placeholder="Enter purpose"
                      value={purpose}
                      onChange={(e) => {
                        const purposes = moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : [''];
                        purposes[index] = e.target.value;
                        setMoveInOutFormData({...moveInOutFormData, purpose: purposes.join('|')});
                      }}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldStyles}
                    />
                    {(moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : ['']).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const purposes = moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : [''];
                          purposes.splice(index, 1);
                          setMoveInOutFormData({...moveInOutFormData, purpose: purposes.join('|')});
                        }}
                        className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0 h-10 w-10 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="moveInOutActive"
                checked={moveInOutFormData.active}
                onCheckedChange={(checked) => setMoveInOutFormData({...moveInOutFormData, active: checked as boolean})}
              />
              <Label htmlFor="moveInOutActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleMoveInOutSubmit}
                disabled={isSubmittingMoveInOut}
                className={`${solidBrandBtn} px-8`}
              >
                {isSubmittingMoveInOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Work Type Modal */}
      <Dialog open={isWorkTypeModalOpen} onOpenChange={setIsWorkTypeModalOpen} modal={false}>
        <DialogContent
          className="max-w-md !bg-white"
          onPointerDownOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) e.preventDefault();
          }}
        >
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Work Type</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWorkTypeModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Staff Type Selection */}
            <FormControl fullWidth variant="outlined">
              <InputLabel id="add-staff-type-label" shrink>
                Select Staff Type *
              </InputLabel>
              <MuiSelect
                labelId="add-staff-type-label"
                label="Select Staff Type *"
                value={workTypeFormData.staffType}
                onChange={(e) =>
                  setWorkTypeFormData({
                    ...workTypeFormData,
                    staffType: e.target.value as string,
                  })
                }
                displayEmpty
                notched
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Staff Type</em>
                </MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Society">Society</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Work Type Input */}
            <TextField
              label="Enter Work Type *"
              placeholder="Enter Work Type"
              value={workTypeFormData.workType}
              onChange={(e) =>
                setWorkTypeFormData({ ...workTypeFormData, workType: e.target.value })
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="workTypeActive"
                checked={workTypeFormData.active}
                onCheckedChange={(checked) => setWorkTypeFormData({...workTypeFormData, active: checked as boolean})}
              />
              <Label htmlFor="workTypeActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleWorkTypeSubmit}
                disabled={isSubmittingWorkType}
                className={`${solidBrandBtn} px-8`}
              >
                {isSubmittingWorkType ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Comment Modal */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="max-w-md !bg-white">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Comment <span className="text-red-500">*</span></DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCommentModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Comment field */}
            <TextField
              label="Enter Comment *"
              placeholder="Enter Comment"
              value={commentFormData.comment}
              onChange={(e) => setCommentFormData({...commentFormData, comment: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="commentActive"
                checked={commentFormData.active}
                onCheckedChange={(checked) => setCommentFormData({...commentFormData, active: checked as boolean})}
              />
              <Label htmlFor="commentActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment}
                className={`${solidBrandBtn} px-8`}
              >
                {isSubmittingComment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Purpose Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-full sm:max-w-[500px] !bg-white overflow-visible">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Edit Purpose</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditModalClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Purpose *</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEditPurpose}
                className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {editingPurposes.map((purpose, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextField
                    label={`Purpose ${index + 1} *`}
                    value={purpose}
                    onChange={(e) => updateEditPurpose(index, e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                  />
                  {editingPurposes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEditPurpose(index)}
                      className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0 h-10 w-10 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="editActive"
                checked={editingPurpose?.status || false}
                onCheckedChange={(checked) =>
                  editingPurpose &&
                  setEditingPurpose({
                    ...editingPurpose,
                    status: checked as boolean,
                  })
                }
              />
              <Label htmlFor="editActive" className="text-sm font-medium">
                Active
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmittingEdit || editingPurposes.every((p) => !p.trim())}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
            >
              {isSubmittingEdit ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'UPDATE'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleEditModalClose}
              disabled={isSubmittingEdit}
              className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030] px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Move In/Out Modal */}
      <EditMoveInOutModal
        isOpen={isEditMoveInOutModalOpen}
        onClose={() => setIsEditMoveInOutModalOpen(false)}
        moveInOutData={editingMoveInOut}
        onUpdate={handleUpdateMoveInOut}
      />

      {/* Edit Work Type Modal */}
      <EditWorkTypeModal
        isOpen={isEditWorkTypeModalOpen}
        onClose={() => setIsEditWorkTypeModalOpen(false)}
        workTypeData={editingWorkType}
        onUpdate={handleUpdateWorkType}
      />

      {/* Edit Visitor Comment Modal */}
      <EditVisitorCommentModal
        isOpen={isEditVisitorCommentModalOpen}
        onClose={() => setIsEditVisitorCommentModalOpen(false)}
        commentData={editingVisitorComment}
        onUpdate={handleUpdateVisitorComment}
      />
    </>
  );
};