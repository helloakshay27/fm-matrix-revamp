import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, X } from 'lucide-react';
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
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [activeTab, setActiveTab] = useState('Visit Purpose');
  const [searchTerm, setSearchTerm] = useState('');
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
    site: '',
    purpose: '',
    active: true
  });
  const [moveInOutFormData, setMoveInOutFormData] = useState({
    site: '',
    purpose: '',
    active: true
  });
  const [workTypeFormData, setWorkTypeFormData] = useState({
    site: '',
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
  const [loadingVisitorSetup, setLoadingVisitorSetup] = useState(false);
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
  const getFilteredData = () => {
    switch (activeTab) {
      case 'Visit Purpose':
        return purposes.filter(item =>
          item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Move In/Out':
        return moveInOutData.filter(item =>
          item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Work Type':
        return workTypeData.filter(item =>
          item.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.staffType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'Visitor Comment':
        return commentsData.filter(item =>
          item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
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
      site: '',
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

    if (!moveInOutFormData.site) {
      toast({
        title: "Error",
        description: "Please select a site",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingMoveInOut(true);
    
    try {
      // Get resource_id from selected site
      const resourceId = parseInt(moveInOutFormData.site);
      
      // Split purposes by pipe separator for multiple purposes
      const purposeList = moveInOutFormData.purpose.split('|').filter(p => p.trim());
      
      // Create each purpose via API
      const createPromises = purposeList.map(async (purpose) => {
        const result = await createMoveInOutPurpose(purpose.trim(), resourceId, moveInOutFormData.active);
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
      site: '',
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

    if (!workTypeFormData.site) {
      toast({
        title: "Error",
        description: "Please select a site",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingWorkType(true);
    
    try {
      // Get resource_id from selected site
      const resourceId = parseInt(workTypeFormData.site);
      
      // Split work types by pipe separator for multiple work types
      const workTypeList = workTypeFormData.workType.split('|').filter(wt => wt.trim());
      
      // Create each work type via API
      const createPromises = workTypeList.map(async (workType) => {
        const result = await createWorkType(
          workType.trim(), // This becomes staff_type in API
          workTypeFormData.staffType, // This becomes related_to in API
          resourceId, 
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
      site: '',
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

    if (!formData.site) {
      toast({
        title: "Error",
        description: "Please select a site",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get resource_id from selected site
      const resourceId = parseInt(formData.site);
      
      // Split purposes by pipe separator for multiple purposes
      const purposeList = formData.purpose.split('|').filter(p => p.trim());
      
      // Create each purpose via API
      const createPromises = purposeList.map(async (purpose) => {
        const result = await createVisitPurpose(purpose.trim(), resourceId, formData.active);
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
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {['Visit Purpose', 'Move In/Out', 'Work Type', 'Visitor Comment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              {activeTab === 'Visit Purpose' && (
                <Button 
                  onClick={handleAddPurpose}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Purpose
                </Button>
              )}
              
              {activeTab === 'Move In/Out' && (
                <Button 
                  onClick={handleMoveInOut}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Move In/Out
                </Button>
              )}
              
              {activeTab === 'Work Type' && (
                <Button 
                  onClick={handleWorkType}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Work Type
                </Button>
              )}
              
              {activeTab === 'Visitor Comment' && commentsData.length === 0 && (
                <Button 
                  onClick={handleVisitorCategory}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Visitor Comment
                </Button>
              )}

              <div className="flex-1"></div>

            </div>

            {/* Tables for each tab */}
            <div className="overflow-hidden">
              {activeTab === 'Visit Purpose' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f4ee]">
                      <TableHead className="px-4 py-3 w-20">Action</TableHead>
                      <TableHead className="px-4 py-3 min-w-[200px]">Purpose</TableHead>
                      <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      <TableHead className="px-4 py-3 min-w-[120px]">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredData().map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="px-4 py-3">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                            </button>
                          </TableCell>
                          <TableCell className="px-4 py-3 font-medium">{item.purpose}</TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {activeTab === 'Move In/Out' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f4ee]">
                      <TableHead className="px-4 py-3 w-20">Action</TableHead>
                      <TableHead className="px-4 py-3 min-w-[200px]">Move In/Out Purpose</TableHead>
                      <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      <TableHead className="px-4 py-3 min-w-[120px]">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredData().map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                           <TableCell className="px-4 py-3">
                             <button
                               onClick={() => handleEditMoveInOut(item.id)}
                               className="p-1 hover:bg-gray-100 rounded"
                               title="Edit"
                             >
                               <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                             </button>
                           </TableCell>
                          <TableCell className="px-4 py-3 font-medium">{item.purpose}</TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {activeTab === 'Work Type' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f4ee]">
                      <TableHead className="px-4 py-3 w-20">Action</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Staff Type</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Work Type</TableHead>
                      <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      <TableHead className="px-4 py-3 min-w-[120px]">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredData().map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                           <TableCell className="px-4 py-3">
                             <button
                               onClick={() => handleEditWorkType(item.id)}
                               className="p-1 hover:bg-gray-100 rounded"
                               title="Edit"
                             >
                               <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                             </button>
                           </TableCell>
                          <TableCell className="px-4 py-3 font-medium">{item.staffType}</TableCell>
                          <TableCell className="px-4 py-3 font-medium">{item.workType}</TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {activeTab === 'Visitor Comment' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f4ee]">
                      <TableHead className="px-4 py-3 w-20">Action</TableHead>
                      <TableHead className="px-4 py-3 min-w-[300px]">Comment</TableHead>
                      <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                      <TableHead className="px-4 py-3 min-w-[150px]">Created On</TableHead>
                      <TableHead className="px-4 py-3 min-w-[120px]">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredData().map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                           <TableCell className="px-4 py-3">
                             <button
                               onClick={() => handleEditVisitorComment(item.id)}
                               className="p-1 hover:bg-gray-100 rounded"
                               title="Edit"
                             >
                               <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                             </button>
                           </TableCell>
                          <TableCell className="px-4 py-3 font-medium">{item.comment}</TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdOn}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{item.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add Purpose Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select site</Label>
              <Select 
                value={formData.site} 
                onValueChange={(value) => setFormData({...formData, site: value})}
                disabled={loadingSites}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder={loadingSites ? "Loading sites..." : "Select Site"} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  {loadingSites ? (
                    <SelectItem value="loading" disabled>Loading sites...</SelectItem>
                  ) : sites.length > 0 ? (
                    sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No sites available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Multiple Users Purpose Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enter Purpose</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentPurposes = formData.purpose ? formData.purpose.split('|') : [''];
                    setFormData({...formData, purpose: [...currentPurposes, ''].join('|')});
                  }}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-3">
                {(formData.purpose ? formData.purpose.split('|') : ['']).map((purpose, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextField
                        placeholder="Enter purpose"
                        value={purpose}
                        onChange={(e) => {
                          const purposes = formData.purpose ? formData.purpose.split('|') : [''];
                          purposes[index] = e.target.value;
                          setFormData({...formData, purpose: purposes.join('|')});
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: '#C72030',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#C72030',
                            },
                          },
                        }}
                      />
                    </div>
                    {(formData.purpose ? formData.purpose.split('|') : ['']).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const purposes = formData.purpose ? formData.purpose.split('|') : [''];
                          purposes.splice(index, 1);
                          setFormData({...formData, purpose: purposes.join('|')});
                        }}
                        className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0"
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
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked as boolean})}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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

      {/* Add Move In/Out Purpose Modal */}
      <Dialog open={isMoveInOutModalOpen} onOpenChange={setIsMoveInOutModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
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
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select site</Label>
              <Select 
                value={moveInOutFormData.site} 
                onValueChange={(value) => setMoveInOutFormData({...moveInOutFormData, site: value})}
                disabled={loadingSites}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder={loadingSites ? "Loading sites..." : "Select Site"} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  {loadingSites ? (
                    <SelectItem value="loading" disabled>Loading sites...</SelectItem>
                  ) : sites.length > 0 ? (
                    sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No sites available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Multiple Move In/Out Purpose Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enter move in/ out purpose</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentPurposes = moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : [''];
                    setMoveInOutFormData({...moveInOutFormData, purpose: [...currentPurposes, ''].join('|')});
                  }}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-3">
                {(moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : ['']).map((purpose, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextField
                        placeholder="Enter purpose"
                        value={purpose}
                        onChange={(e) => {
                          const purposes = moveInOutFormData.purpose ? moveInOutFormData.purpose.split('|') : [''];
                          purposes[index] = e.target.value;
                          setMoveInOutFormData({...moveInOutFormData, purpose: purposes.join('|')});
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: '#C72030',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#C72030',
                            },
                          },
                        }}
                      />
                    </div>
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
                        className="text-destructive border-destructive hover:bg-destructive/10"
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
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleMoveInOutSubmit}
                disabled={isSubmittingMoveInOut}
                className="bg-green-500 hover:bg-green-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <Dialog open={isWorkTypeModalOpen} onOpenChange={setIsWorkTypeModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
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
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select Site</Label>
              <Select 
                value={workTypeFormData.site} 
                onValueChange={(value) => setWorkTypeFormData({...workTypeFormData, site: value})}
                disabled={loadingSites}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder={loadingSites ? "Loading sites..." : "Select Site"} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  {loadingSites ? (
                    <SelectItem value="loading" disabled>Loading sites...</SelectItem>
                  ) : sites.length > 0 ? (
                    sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No sites available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Staff Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select Staff Type</Label>
              <Select 
                value={workTypeFormData.staffType} 
                onValueChange={(value) => setWorkTypeFormData({...workTypeFormData, staffType: value})}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select Staff Type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Society">Society</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Type Input */}
            <div className="space-y-2">
              <Label>Enter Work Type</Label>
              <TextField
                placeholder="Enter Work Type"
                value={workTypeFormData.workType}
                onChange={(e) => setWorkTypeFormData({...workTypeFormData, workType: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

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
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleWorkTypeSubmit}
                disabled={isSubmittingWorkType}
                className="bg-green-500 hover:bg-green-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Comment</DialogTitle>
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
            {/* Comment Textarea */}
            <div className="space-y-2">
              <Label>Enter comment</Label>
              <TextField
                placeholder="Enter Comment"
                value={commentFormData.comment}
                onChange={(e) => setCommentFormData({...commentFormData, comment: e.target.value})}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

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
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment}
                className="bg-green-500 hover:bg-green-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Edit Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Multiple Purpose Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enter Purpose</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEditPurpose}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-3">
                {editingPurposes.map((purpose, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextField
                        placeholder="Enter purpose"
                        value={purpose}
                        onChange={(e) => updateEditPurpose(index, e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: '#C72030',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#C72030',
                            },
                          },
                        }}
                      />
                    </div>
                    {editingPurposes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEditPurpose(index)}
                        className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0"
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
                id="editActive"
                checked={editingPurpose?.status || false}
                onCheckedChange={(checked) => editingPurpose && setEditingPurpose({...editingPurpose, status: checked as boolean})}
              />
              <Label htmlFor="editActive" className="text-black">Active</Label>
            </div>

            {/* Update Button */}
            <div className="flex justify-start pt-4">
              <Button 
                onClick={handleEditSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingEdit || editingPurposes.every(p => !p.trim())}
              >
                {isSubmittingEdit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'UPDATE'
                )}
              </Button>
            </div>
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