import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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

  // Fetch ticket data for editing
  const fetchTicketData = async (ticketId: string) => {
    try {
      console.log('Fetching ticket data for ID:', ticketId);
      const response = await apiClient.get(`/pms/admin/complaints/${ticketId}.json`);
      const ticketData = response.data;
      
      console.log('Received ticket data:', ticketData);
      console.log('Category type:', ticketData.category_type);
      console.log('Sub category type:', ticketData.sub_category_type);
      
      // Populate form with API data
      setFormData(prev => ({
        ...prev,
        title: ticketData.heading || '',
        adminPriority: ticketData.priority || '',
        selectedStatus: ticketData.issue_status || '',
        proactiveReactive: ticketData.proactive_reactive || '',
        serviceType: ticketData.service_type || '',
        externalPriority: ticketData.external_priority || '',
        preventiveAction: ticketData.preventive_action || '',
        impact: ticketData.impact || '',
        correction: ticketData.correction || '',
        rootCause: ticketData.root_cause || '',
        categoryType: ticketData.category_type || '',
        subCategoryType: ticketData.sub_category_type || '',
        assignTo: ticketData.assigned_to || '',
        mode: ticketData.complaint_mode || '',
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
      if (ticketData.review_tracking) {
        setReviewDate(new Date(ticketData.review_tracking));
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
    if (id) {
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
  }, [id, location.state]);

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
    // Update main form data with popup data
    setFormData(prev => ({
      ...prev,
      cost: costPopupData.cost,
      description: costPopupData.description
    }));
    setAttachments(prev => [...prev, ...costPopupData.attachments]);
    setShowCostPopup(false);
  };

  const handleCostPopupClose = () => {
    setShowCostPopup(false);
    setFormData(prev => ({ ...prev, costInvolved: false }));
    setCostPopupData({ cost: '', description: '', attachments: [] });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would implement the actual update API call
      // For now, just showing success message
      toast({
        title: "Success",
        description: `Successfully updated ${selectedTickets.length} ticket(s).`,
      });
      
      navigate(-1);
    } catch (error) {
      console.error('Error updating tickets:', error);
      toast({
        title: "Error",
        description: "Failed to update tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-xl font-semibold text-gray-900">COMPLAINT EDIT</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <textarea
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Feedback: Tap Faulty, Wc Choked, Hand Dryer Faulty, Tissue Paper Missing"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Preventive Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preventive Action</label>
              <input
                type="text"
                value={formData.preventiveAction}
                onChange={(e) => handleInputChange('preventiveAction', e.target.value)}
                placeholder="nn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.selectedStatus}
                onChange={(e) => handleInputChange('selectedStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Closed</option>
                {complaintStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 2 */}
            {/* Responsible Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Person</label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Responsible Person Name</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Review (Tracking) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review (Tracking)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal border-gray-300",
                      !reviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reviewDate ? format(reviewDate, "PPP") : <span>Pick a review date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reviewDate}
                    onSelect={setReviewDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
              <select
                value={formData.categoryType}
                onChange={(e) => handleInputChange('categoryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
                disabled={helpdeskLoading}
              >
                <option value="">Select Category Type</option>
                {helpdeskData?.helpdesk_categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3 */}
            {/* Proactive/Reactive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proactive/Reactive</label>
              <select
                value={formData.proactiveReactive}
                onChange={(e) => handleInputChange('proactiveReactive', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Proactive/Reactive</option>
                <option value="Proactive">Proactive</option>
                <option value="Reactive">Reactive</option>
              </select>
            </div>

            {/* Sub Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category Type</label>
              <select
                value={formData.subCategoryType}
                onChange={(e) => handleInputChange('subCategoryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
                disabled={subCategoriesLoading || !formData.categoryType}
              >
                <option value="">Select Sub Category</option>
                {Array.isArray(subCategories) && subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <select
                value={formData.assignTo}
                onChange={(e) => handleInputChange('assignTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Vinayak Mane</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4 */}
            {/* Admin Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Priority</label>
              <select
                value={formData.adminPriority}
                onChange={(e) => handleInputChange('adminPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Priority</option>
                <option value="p1">P1 - Critical</option>
                <option value="p2">P2 - Very High</option>
                <option value="p3">P3 - High</option>
                <option value="p4">P4 - Medium</option>
                <option value="p5">P5 - Low</option>
              </select>
            </div>

            {/* External Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">External Priority</label>
              <select
                value={formData.externalPriority}
                onChange={(e) => handleInputChange('externalPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select External Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Complaint Mode</option>
                {complaintModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 5 */}
            {/* Root Cause */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Root Cause</label>
              <input
                type="text"
                value={formData.rootCause}
                onChange={(e) => handleInputChange('rootCause', e.target.value)}
                placeholder="ghj"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
              <input
                type="text"
                value={formData.impact}
                onChange={(e) => handleInputChange('impact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Correction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correction</label>
              <input
                type="text"
                value={formData.correction}
                onChange={(e) => handleInputChange('correction', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Row 6 */}
            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={formData.refNumber}
                onChange={(e) => handleInputChange('refNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Corrective Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Corrective Action</label>
              <input
                type="text"
                value={formData.correctiveAction}
                onChange={(e) => handleInputChange('correctiveAction', e.target.value)}
                placeholder="hko"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Service Type</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
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
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.associatedTo.asset ? 'Select Asset' : 'Select Service'}
              </label>
              <select
                value={formData.selectedAsset}
                onChange={(e) => handleInputChange('selectedAsset', e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
                disabled={isLoadingAssets || isLoadingServices}
              >
                <option value="">
                  {isLoadingAssets || isLoadingServices 
                    ? 'Loading...' 
                    : `Select ${formData.associatedTo.asset ? 'Asset' : 'Service'}`
                  }
                </option>
                {formData.associatedTo.asset && assetOptions.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
                {formData.associatedTo.service && serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
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
              <button className="bg-[#C72030] text-white px-4 py-2 rounded text-sm hover:bg-[#C72030]/90">
                Add
              </button>
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
                  <tr>
                    <td className="px-4 py-3 text-gray-500 text-center" colSpan={13}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSubmit}
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