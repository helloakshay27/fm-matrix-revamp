import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { getToken } from '@/utils/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectedTicket {
  id: number;
  ticket_number: string;
  heading: string;
  category_type: string;
  sub_category_type: string;
  site_name: string;
  posted_by: string;
  assigned_to: string | null;
  issue_status: string;
  priority: string;
  created_at: string;
  issue_type: string;
  complaint_mode: string;
  service_or_asset: string | null;
  asset_task_occurrence_id: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
}

interface ComplaintStatus {
  id: number;
  society_id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
  created_at: string;
  updated_at: string;
  position: number;
  of_phase: string;
  of_atype: string;
  email: boolean;
}

interface FMUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  login: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface ComplaintMode {
  id: number;
  name: string;
}

interface AssetOption {
  id: number;
  name: string;
}

interface ServiceOption {
  id: number;
  service_name: string;
}

const UpdateTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data: helpdeskData, loading: helpdeskLoading } = useAppSelector(state => state.helpdeskCategories);
  
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    responsiblePerson: '',
    proactiveReactive: '',
    adminPriority: '',
    softClose: '',
    refNumber: '',
    issueRelatedTo: '',
    associatedTo: { asset: false, service: false },
    comments: '',
    cost: '',
    description: '',
    preventiveAction: '',
    reviewTracking: '',
    categoryType: '',
    subCategoryType: '',
    externalPriority: '',
    impact: '',
    correctiveAction: '',
    assignTo: '',
    mode: '',
    serviceType: '',
    costInvolved: false,
    selectedStatus: '',
    rootCause: '',
    correction: '',
    selectedAsset: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintStatuses, setComplaintStatuses] = useState<ComplaintStatus[]>([]);
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [complaintModes, setComplaintModes] = useState<ComplaintMode[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCostPopup, setShowCostPopup] = useState(false);
  const [costPopupData, setCostPopupData] = useState({
    cost: '',
    description: '',
    attachments: [] as File[]
  });
  const [assetOptions, setAssetOptions] = useState<AssetOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [reviewDate, setReviewDate] = useState<Date>();
  const [ticketApiData, setTicketApiData] = useState<any>(null); // Store original API data
  const [costApprovalRequests, setCostApprovalRequests] = useState<Array<{
    id: string;
    amount: string;
    comments: string;
    createdOn: string;
    createdBy: string;
    attachments: File[];
  }>>([]);

  // Fetch ticket data for editing
  const fetchTicketData = async (ticketId: string) => {
    try {
      console.log('Fetching ticket data for ID:', ticketId);
      const response = await apiClient.get(`/pms/admin/complaints/${ticketId}.json`);
      const ticketData = response.data;
      
      console.log('Received ticket data:', ticketData);
      console.log('Category type:', ticketData.category_type);
      console.log('Sub category type:', ticketData.sub_category_type);
      
      // Store original API data for later use
      setTicketApiData(ticketData);
      
      // Find the category ID that matches the category name from API
      const matchingCategory = helpdeskData?.helpdesk_categories?.find(
        category => category.name === ticketData.category_type
      );

      // Find the complaint mode ID that matches the mode name from API
      const matchingMode = complaintModes.find(
        mode => mode.name === ticketData.complaint_mode
      );

      // Find the status ID that matches the status name from API
      const matchingStatus = complaintStatuses.find(
        status => status.name === ticketData.issue_status
      );

      // Find the user ID that matches the assigned_to name from API
      console.log('Looking for assigned_to match:', ticketData.assigned_to);
      console.log('Available fmUsers:', fmUsers);
      const matchingUser = fmUsers.find(user => {
        const fullName = `${user.firstname} ${user.lastname}`;
        const apiAssignedTo = ticketData.assigned_to?.trim() || '';
        console.log('Comparing:', fullName, 'with:', apiAssignedTo);
        
        // Try exact match first
        if (fullName === apiAssignedTo) return true;
        
        // Try partial matches
        if (apiAssignedTo.includes(fullName) || fullName.includes(apiAssignedTo)) return true;
        
        // Try case-insensitive match
        if (fullName.toLowerCase() === apiAssignedTo.toLowerCase()) return true;
        
        return false;
      });
      console.log('Found matching user:', matchingUser);

      // Populate form with API data
      setFormData(prev => ({
        ...prev,
        title: ticketData.heading || '',
        adminPriority: ticketData.priority || '',
        selectedStatus: matchingStatus?.id.toString() || '',
        proactiveReactive: ticketData.proactive_reactive || '',
        serviceType: ticketData.service_type || '',
        externalPriority: ticketData.external_priority || '',
        preventiveAction: ticketData.preventive_action || '',
        impact: ticketData.impact || '',
        correction: ticketData.correction || '',
        rootCause: ticketData.root_cause || '',
        categoryType: matchingCategory?.id.toString() || '',
        subCategoryType: '', // Will be set after subcategories are fetched
        assignTo: matchingUser?.id.toString() || '',
        mode: matchingMode?.id.toString() || '',
        responsiblePerson: ticketData.responsible_person || '',
        issueRelatedTo: ticketData.issue_related_to || '',
        refNumber: ticketData.reference_number || '',
        correctiveAction: ticketData.corrective_action || '',
        selectedAsset: ticketData.asset_service === 'Asset' ? (ticketData.asset_id || '') : '',
        associatedTo: {
          asset: ticketData.asset_service === 'Asset',
          service: ticketData.asset_service === 'Service'
        }
      }));

      // Set review date if available
      console.log('Review tracking from API:', ticketData.review_tracking);
      if (ticketData.review_tracking && ticketData.review_tracking !== null) {
        // Check if it's in DD/MM/YYYY format
        const dateMatch = ticketData.review_tracking.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dateMatch) {
          const [, day, month, year] = dateMatch;
          const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(parsedDate.getTime())) {
            setReviewDate(parsedDate);
            console.log('Set review date from DD/MM/YYYY format:', parsedDate);
          } else {
            console.log('Invalid date parsed from DD/MM/YYYY:', parsedDate);
          }
        } else {
          // Try ISO format as fallback
          const date = new Date(ticketData.review_tracking);
          if (!isNaN(date.getTime())) {
            setReviewDate(date);
            console.log('Set review date from ISO format:', date);
          } else {
            console.log('Invalid date value:', ticketData.review_tracking);
          }
        }
      } else {
        console.log('No review tracking date available');
        setReviewDate(undefined);
      }

      // Fetch sub-categories if category is set
      if (matchingCategory?.id) {
        fetchSubCategories(matchingCategory.id.toString());
      }
      
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      toast({
        title: "Error",
        description: "Failed to load ticket data.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // If we have an ID from the URL, fetch the ticket data
    if (id && helpdeskData?.helpdesk_categories && complaintModes.length > 0 && fmUsers.length > 0 && complaintStatuses.length > 0) {
      fetchTicketData(id);
    }
    // If we have selected tickets from navigation state, use the first one
    else if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
      const firstTicket = location.state.selectedTickets[0];
      if (firstTicket) {
        setFormData(prev => ({
          ...prev,
          title: firstTicket.heading || '',
          categoryType: firstTicket.category_type || '',
          subCategoryType: firstTicket.sub_category_type || '',
          proactiveReactive: firstTicket.proactive_reactive || '',
          assignTo: firstTicket.assigned_to || '',
          mode: firstTicket.complaint_mode || '',
          serviceType: firstTicket.service_or_asset || ''
        }));
      }
    }
  }, [id, location.state, helpdeskData, complaintModes, fmUsers, complaintStatuses]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusResponse, usersResponse, complaintModesResponse] = await Promise.all([
          apiClient.get('/pms/admin/complaint_statuses.json'),
          apiClient.get('/pms/account_setups/fm_users.json'),
          apiClient.get('/pms/admin/complaint_modes.json')
        ]);
        
        setComplaintStatuses(statusResponse.data || []);
        setFmUsers(usersResponse.data.fm_users || []);
        setComplaintModes(complaintModesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data.",
          variant: "destructive"
        });
      }
    };

    fetchData();
    dispatch(fetchHelpdeskCategories());
  }, [toast, dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  const fetchAssets = async () => {
    if (isLoadingAssets) return;
    
    setIsLoadingAssets(true);
    try {
      const response = await apiClient.get('/pms/assets/get_assets.json');
      setAssetOptions(response.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assets",
        variant: "destructive"
      });
      setAssetOptions([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const fetchServices = async () => {
    if (isLoadingServices) return;
    
    setIsLoadingServices(true);
    try {
      const response = await apiClient.get('/pms/services/get_services.json');
      setServiceOptions(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive"
      });
      setServiceOptions([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Fetch sub-categories when category changes
    if (field === 'categoryType' && value) {
      fetchSubCategories(value);
    } else if (field === 'categoryType' && !value) {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, subCategoryType: '' }));
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setSubCategoriesLoading(true);
      const response = await apiClient.get(`/pms/admin/get_sub_categories.json?category_type_id=${categoryId}`);
      console.log('Sub-categories API response:', response.data);
      
      // Handle different possible response structures
      let categories = [];
      if (Array.isArray(response.data)) {
        categories = response.data;
      } else if (response.data && Array.isArray(response.data.sub_categories)) {
        categories = response.data.sub_categories;
      } else if (response.data && Array.isArray(response.data.subcategories)) {
        categories = response.data.subcategories;
      }
      
      setSubCategories(categories);

      // If we have stored ticket API data, find and set the matching subcategory
      if (ticketApiData?.sub_category_type && categories.length > 0) {
        const matchingSubCategory = categories.find(
          subCat => subCat.name === ticketApiData.sub_category_type
        );
        
        if (matchingSubCategory) {
          setFormData(prev => ({
            ...prev,
            subCategoryType: matchingSubCategory.id.toString()
          }));
        }
      }
      
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
      setSubCategories([]);
      toast({
        title: "Error",
        description: "Failed to load sub-categories.",
        variant: "destructive"
      });
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleCheckboxChange = (group: string, field: string, checked: boolean) => {
    if (group === 'associatedTo') {
      setFormData(prev => ({
        ...prev,
        associatedTo: {
          asset: field === 'asset' ? checked : false,
          service: field === 'service' ? checked : false
        },
        selectedAsset: '' // Reset selected asset when switching between asset/service
      }));

      // Fetch data based on selection
      if (checked) {
        if (field === 'asset') {
          fetchAssets();
        } else if (field === 'service') {
          fetchServices();
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [group]: {
          ...prev[group as keyof typeof prev] as any,
          [field]: checked
        }
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCostInvolvedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, costInvolved: checked }));
    if (checked) {
      setShowCostPopup(true);
    } else {
      setCostPopupData({ cost: '', description: '', attachments: [] });
    }
  };

  const handleCostPopupFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCostPopupData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(event.target.files!)]
      }));
    }
  };

  const removeCostPopupAttachment = (index: number) => {
    setCostPopupData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleCostPopupSubmit = () => {
    // Create new cost approval request
    const newRequest = {
      id: Date.now().toString(),
      amount: costPopupData.cost,
      comments: costPopupData.description,
      createdOn: new Date().toLocaleDateString(),
      createdBy: 'Current User', // You can replace this with actual user data
      attachments: costPopupData.attachments
    };

    // Add to cost approval requests
    setCostApprovalRequests(prev => [...prev, newRequest]);

    // Update main form data with popup data
    setFormData(prev => ({
      ...prev,
      cost: costPopupData.cost,
      description: costPopupData.description
    }));
    setAttachments(prev => [...prev, ...costPopupData.attachments]);
    
    // Close popup and reset data
    setShowCostPopup(false);
    setCostPopupData({ cost: '', description: '', attachments: [] });
  };

  const handleCostPopupClose = () => {
    setShowCostPopup(false);
    setFormData(prev => ({ ...prev, costInvolved: false }));
    setCostPopupData({ cost: '', description: '', attachments: [] });
  };

  const handleSubmit = async () => {
    console.log('=== HANDLE SUBMIT STARTED ===');
    console.log('handleSubmit called');
    console.log('Current selectedTickets:', selectedTickets);
    console.log('URL ID parameter:', id);
    console.log('Form data state:', formData);
    
    setIsSubmitting(true);
    
    try {
      // Use the URL ID parameter if selectedTickets is empty
      let ticketId: number;
      
      if (selectedTickets.length > 0) {
        ticketId = selectedTickets[0].id;
        console.log('Using ticketId from selectedTickets:', ticketId);
      } else if (id) {
        ticketId = parseInt(id);
        console.log('Using ticketId from URL parameter:', ticketId);
      } else {
        console.error('No ticket ID available - selectedTickets empty and no URL id');
        toast({
          title: "Error",
          description: "No ticket ID found for update.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Final ticket ID to use:', ticketId);

      // Get the first selected ticket for the complaint ID
      console.log('Form Data before API call:', formData);
      console.log('Review Date before API call:', reviewDate);
      
      // Prepare form data for API
      const formDataToSend = new FormData();
      
      // Complaint Log data
      formDataToSend.append('complaint_log[complaint_id]', ticketId.toString());
      formDataToSend.append('complaint_log[society_staff_type]', 'User');
      formDataToSend.append('complaint_log[status_reason]', '');
      formDataToSend.append('complaint_log[expected_date]', '');
      formDataToSend.append('complaint_log[complaint_status_id]', formData.selectedStatus || '');
      formDataToSend.append('complaint_log[assigned_to]', formData.assignTo || '');
      formDataToSend.append('complaint_log[priority]', formData.adminPriority || '');
      formDataToSend.append('complaint_log[comment]', formData.comments || '');
      formDataToSend.append('save_and_show_detail', 'true');
      formDataToSend.append('custom_redirect', `/pms/admin/complaints/${ticketId}`);
      
      // Complaint data
      formDataToSend.append('complaint[complaint_type]', 'Request');
      formDataToSend.append('complaint[preventive_action]', formData.preventiveAction || '');
      formDataToSend.append('complaint[person_id]', '');
      
      // Format review tracking date properly
      if (reviewDate) {
        const formattedDate = format(reviewDate, 'yyyy-MM-dd');
        formDataToSend.append('complaint[review_tracking_date]', formattedDate);
        console.log('Review date formatted:', formattedDate);
      } else {
        formDataToSend.append('complaint[review_tracking_date]', '');
      }
      
      formDataToSend.append('complaint[category_type_id]', formData.categoryType || '');
      formDataToSend.append('complaint[proactive_reactive]', formData.proactiveReactive || '');
      formDataToSend.append('complaint[sub_category_id]', formData.subCategoryType || '');
      formDataToSend.append('complaint[external_priority]', formData.externalPriority || '');
      formDataToSend.append('complaint[complaint_mode_id]', formData.mode || '');
      formDataToSend.append('complaint[root_cause]', formData.rootCause || '');
      formDataToSend.append('complaint[impact]', formData.impact || '');
      formDataToSend.append('complaint[correction]', formData.correction || '');
      formDataToSend.append('complaint[reference_number]', formData.refNumber || '');
      formDataToSend.append('complaint[corrective_action]', formData.correctiveAction || '');
      formDataToSend.append('complaint[service_type]', formData.serviceType || '');
      formDataToSend.append('complaint[issue_related_to]', formData.issueRelatedTo || '');
      formDataToSend.append('complaint[cost_involved]', formData.costInvolved ? 'true' : 'false');
      
      // Add cost approval data if cost is involved
      if (formData.costInvolved && costPopupData.cost) {
        const timestamp = Date.now();
        formDataToSend.append(`complaint[cost_approval_requests_attributes][${timestamp}][created_by_id]`, '12437');
        formDataToSend.append(`complaint[cost_approval_requests_attributes][${timestamp}][cost]`, costPopupData.cost);
        formDataToSend.append(`complaint[cost_approval_requests_attributes][${timestamp}][comment]`, costPopupData.description || '');
        formDataToSend.append(`complaint[cost_approval_requests_attributes][${timestamp}][_destroy]`, 'false');
        
        // Add attachments if any
        costPopupData.attachments.forEach((file, index) => {
          const attachmentTimestamp = Date.now() + index;
          formDataToSend.append(`complaint[cost_approval_requests_attributes][${timestamp}][attachments_attributes][${attachmentTimestamp}][_destroy]`, 'false');
        });
      }
      
      formDataToSend.append('checklist_type', 'Asset');
      formDataToSend.append('asset_id', formData.selectedAsset || '');
      formDataToSend.append('service_id', '');
      
      // Add file attachments if any
      attachments.forEach((file) => {
        formDataToSend.append('attachments[]', file);
      });

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Get token
      const token = getToken();
      console.log('Token available:', !!token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call to:', 'https://fm-uat-api.lockated.com/complaint_logs.json');

      // Make API call
      const response = await fetch('https://fm-uat-api.lockated.com/complaint_logs.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      toast({
        title: "Success",
        description: `Successfully updated ticket ${ticketId}.`,
      });
      
      // Redirect to ticket list page
      navigate('/maintenance/ticket');
    } catch (error) {
      console.error('Error updating tickets:', error);
      toast({
        title: "Error",
        description: `Failed to update tickets: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">TICKET EDIT</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <Textarea
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Feedback: Tap Faulty, Wc Choked, Hand Dryer Faulty, Tissue Paper Missing"
                rows={1}
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
              />
            </div>

            {/* Preventive Action */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Preventive Action</label>
              <Input
                type="text"
                value={formData.preventiveAction}
                onChange={(e) => handleInputChange('preventiveAction', e.target.value)}
                placeholder=""
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Select value={formData.selectedStatus} onValueChange={(value) => handleInputChange('selectedStatus', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Closed"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {complaintStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2 */}
            {/* Responsible Person */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
              <Select value={formData.responsiblePerson} onValueChange={(value) => handleInputChange('responsiblePerson', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {fmUsers.map((user) => (
                    <SelectItem key={user.id} value={`${user.firstname} ${user.lastname}`} className="text-gray-900 hover:bg-gray-100">
                      {user.firstname} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Review (Tracking) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Review (Tracking)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 justify-start text-left font-normal"
                  >
                    {reviewDate ? format(reviewDate, "MM/dd/yyyy") : <span className="text-gray-500">mm/dd/yyyy</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reviewDate || undefined}
                    onSelect={(date) => setReviewDate(date || null)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category Type*</label>
              <Select value={formData.categoryType} onValueChange={(value) => handleInputChange('categoryType', value)} disabled={helpdeskLoading}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select category"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {helpdeskData?.helpdesk_categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 3 */}
            {/* Proactive/Reactive */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Proactive/Reactive</label>
              <Select value={formData.proactiveReactive} onValueChange={(value) => handleInputChange('proactiveReactive', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select type"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  <SelectItem value="Proactive" className="text-gray-900 hover:bg-gray-100">Proactive</SelectItem>
                  <SelectItem value="Reactive" className="text-gray-900 hover:bg-gray-100">Reactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sub Category Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Sub Category Type</label>
              <Select 
                value={formData.subCategoryType} 
                onValueChange={(value) => handleInputChange('subCategoryType', value)}
                disabled={subCategoriesLoading || !formData.categoryType}
              >
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select Category First"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {Array.isArray(subCategories) && subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assign To */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <Select value={formData.assignTo} onValueChange={(value) => handleInputChange('assignTo', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select engineer"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {fmUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {user.firstname} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 4 */}
            {/* Admin Priority */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Admin Priority</label>
              <Select value={formData.adminPriority} onValueChange={(value) => handleInputChange('adminPriority', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select priority"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  <SelectItem value="p1" className="text-gray-900 hover:bg-gray-100">P1 - Critical</SelectItem>
                  <SelectItem value="p2" className="text-gray-900 hover:bg-gray-100">P2 - Very High</SelectItem>
                  <SelectItem value="p3" className="text-gray-900 hover:bg-gray-100">P3 - High</SelectItem>
                  <SelectItem value="p4" className="text-gray-900 hover:bg-gray-100">P4 - Medium</SelectItem>
                  <SelectItem value="p5" className="text-gray-900 hover:bg-gray-100">P5 - Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* External Priority */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">External Priority</label>
              <Select value={formData.externalPriority} onValueChange={(value) => handleInputChange('externalPriority', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  <SelectItem value="High" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                  <SelectItem value="Medium" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                  <SelectItem value="Low" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {complaintModes.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 5 */}
            {/* Root Cause */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Root Cause</label>
              <Input
                type="text"
                value={formData.rootCause}
                onChange={(e) => handleInputChange('rootCause', e.target.value)}
                placeholder=""
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Impact */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Impact</label>
              <Input
                type="text"
                value={formData.impact}
                onChange={(e) => handleInputChange('impact', e.target.value)}
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Correction */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Correction</label>
              <Input
                type="text"
                value={formData.correction}
                onChange={(e) => handleInputChange('correction', e.target.value)}
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Row 6 */}
            {/* Reference Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Reference Number</label>
              <Input
                type="text"
                value={formData.refNumber}
                onChange={(e) => handleInputChange('refNumber', e.target.value)}
                placeholder="Enter reference number"
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Corrective Action */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Corrective Action</label>
              <Input
                type="text"
                value={formData.correctiveAction}
                onChange={(e) => handleInputChange('correctiveAction', e.target.value)}
                placeholder=""
                className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Service Type</label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder="Select"
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  <SelectItem value="product" className="text-gray-900 hover:bg-gray-100">Product</SelectItem>
                  <SelectItem value="service" className="text-gray-900 hover:bg-gray-100">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Issue Related To */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 min-w-[120px]">Issue Related To</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="issueRelatedTo"
                    value="Projects"
                    checked={formData.issueRelatedTo === 'Projects'}
                    onChange={(e) => handleInputChange('issueRelatedTo', e.target.value)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Project</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="issueRelatedTo"
                    value="FM"
                    checked={formData.issueRelatedTo === 'FM'}
                    onChange={(e) => handleInputChange('issueRelatedTo', e.target.value)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">FM</span>
                </label>
              </div>
            </div>
          </div>

          {/* Associated To */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 min-w-[120px]">Associated To</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="associatedTo"
                    value="asset"
                    checked={formData.associatedTo.asset}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'asset', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Asset</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="associatedTo"
                    value="service"
                    checked={formData.associatedTo.service}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'service', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Service</span>
                </label>
              </div>
            </div>
          </div>

          {/* Select Asset/Service */}
          {(formData.associatedTo.asset || formData.associatedTo.service) && (
            <div className="mt-6 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {formData.associatedTo.asset ? 'Select Asset' : 'Select Service'}
              </label>
              <Select value={formData.selectedAsset} onValueChange={(value) => handleInputChange('selectedAsset', value)} disabled={isLoadingAssets || isLoadingServices}>
                <SelectTrigger className="h-10 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue 
                    placeholder={
                      isLoadingAssets || isLoadingServices 
                        ? "Loading..."
                        : `Select ${formData.associatedTo.asset ? 'Asset' : 'Service'}`
                    }
                    className="text-gray-500"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded shadow-lg z-50">
                  {formData.associatedTo.asset && assetOptions.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {asset.name}
                    </SelectItem>
                  ))}
                  {formData.associatedTo.service && serviceOptions.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()} className="text-gray-900 hover:bg-gray-100">
                      {service.service_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <Textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows={4}
              className="text-base border rounded min-h-[100px] w-full border-gray-300 bg-white px-3 py-2 focus:outline-none"
              placeholder="Add comment"
            />
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.costInvolved}
                  onChange={(e) => handleCostInvolvedChange(e.target.checked)}
                  className="mr-2"
                />
                Cost Involved
              </label>
            </div>
          </div>

          {/* Cost Approval Requests */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Cost Approval Requests</h3>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Request Id</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Comments</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Created On</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Created By</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">L1</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">L2</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">L3</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">L4</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b">L5</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Master Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Cancelled By</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  {costApprovalRequests.length > 0 ? (
                    costApprovalRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-3 text-gray-900 border-b">{request.id}</td>
                        <td className="px-4 py-3 text-gray-900 border-b">{request.amount}</td>
                        <td className="px-4 py-3 text-gray-900 border-b">{request.comments}</td>
                        <td className="px-4 py-3 text-gray-900 border-b">{request.createdOn}</td>
                        <td className="px-4 py-3 text-gray-900 border-b">{request.createdBy}</td>
                        <td className="px-4 py-3 text-center text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-center text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-center text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-center text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-center text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-gray-900 border-b">Pending</td>
                        <td className="px-4 py-3 text-gray-900 border-b">-</td>
                        <td className="px-4 py-3 text-gray-900 border-b">
                          {request.attachments.length > 0 ? `${request.attachments.length} file(s)` : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-gray-500 text-center" colSpan={13}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {
                console.log('=== SAVE BUTTON CLICKED ===');
                console.log('Button clicked, calling handleSubmit');
                handleSubmit();
              }}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </div>

        {/* Cost Popup Modal */}
        {showCostPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 max-w-md mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Cost involved</h3>
                <button
                  onClick={handleCostPopupClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Cost Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={costPopupData.cost}
                    onChange={(e) => setCostPopupData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="Enter Cost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={costPopupData.description}
                    onChange={(e) => setCostPopupData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter Description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Attachment Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment<span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="cost-popup-file-upload"
                      multiple
                      onChange={handleCostPopupFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cost-popup-file-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </label>
                  </div>
                  
                  {/* Display uploaded files in popup */}
                  {costPopupData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {costPopupData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{file.name}</span>
                          <Button
                            onClick={() => removeCostPopupAttachment(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-center">
                  <Button
                    onClick={handleCostPopupSubmit}
                    className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
                    disabled={!costPopupData.cost || !costPopupData.description}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTicketsPage;