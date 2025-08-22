import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, FileText, Paperclip, Download, Eye, ChevronDown, ChevronUp, User, MapPin, FileSearch, PlusCircle, ClipboardList, DollarSign, History, FileSpreadsheet, X, Edit } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Helper function to check if value has data
  const hasData = (value) => {
    return value && value !== null && value !== undefined && value !== '';
  };

  // Helper function to display value or "Not Provided"
  const displayValue = (value) => {
    return value && value !== null && value !== undefined && value !== '' ? value : 'Not Provided';
  };
  
  // State for expandable sections - will be set dynamically based on data
  const [expandedSections, setExpandedSections] = useState({
    ticketDetails: false,
    creatorInfo: false,
    locationInfo: false,
    surveyInfo: false,
    additionalInfo: false,
    attachments: false,
    costApproval: false,
    actionLogs: false
  });

  // Update expanded sections based on data availability
  useEffect(() => {
    if (ticketData) {
      const complaintLogs = ticketData.complaint_logs || [];
      
      setExpandedSections({
        ticketDetails: hasData(ticketData.heading) || hasData(ticketData.issue_status) || hasData(ticketData.ticket_number) || hasData(ticketData.sub_category_type) || hasData(ticketData.created_by_name) || hasData(ticketData.created_date) || hasData(ticketData.created_time) || hasData(ticketData.category_type) || hasData(ticketData.updated_by) || hasData(ticketData.complaint_mode) || hasData(ticketData.priority) || hasData(ticketData.external_priority) || hasData(ticketData.priority_status) || hasData(ticketData.effective_priority) || hasData(ticketData.assigned_to),
        creatorInfo: hasData(ticketData.posted_by) || hasData(ticketData.id_society),
        locationInfo: hasData(ticketData.region) || hasData(ticketData.building_name) || hasData(ticketData.city) || hasData(ticketData.floor_name) || hasData(ticketData.flat_number) || hasData(ticketData.unit_name) || hasData(ticketData.zone) || hasData(ticketData.district) || hasData(ticketData.room_name) || hasData(ticketData.area_name) || hasData(ticketData.site_name) || hasData(ticketData.state) || hasData(ticketData.address) || hasData(ticketData.wing_name),
        surveyInfo: hasData(ticketData.survey_id) || hasData(ticketData.survey_name) || hasData(ticketData.survey_location),
        additionalInfo: hasData(ticketData.corrective_action) || hasData(ticketData.preventive_action) || hasData(ticketData.root_cause) || hasData(ticketData.response_tat) || hasData(ticketData.ticket_urgency) || hasData(ticketData.responsible_person) || hasData(ticketData.asset_service) || hasData(ticketData.resolution_tat) || hasData(ticketData.task_id) || hasData(ticketData.asset_service_location) || hasData(ticketData.resolution_time) || hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name),
        attachments: ticketData.documents && ticketData.documents.length > 0,
        costApproval: ticketData.cost_approval_enabled && ticketData.requests && ticketData.requests.length > 0,
        actionLogs: complaintLogs.length > 0
      });
    }
  }, [ticketData]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await ticketManagementAPI.getTicketDetails(id);
        setTicketData(data);
      } catch (err) {
        setError('Failed to fetch ticket details');
        console.error('Error fetching ticket details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate('/maintenance/ticket');
  };

  const handleFeeds = () => {
    navigate(`/maintenance/ticket/${id}/feeds`);
  };

  const handleTagVendor = () => {
    navigate(`/maintenance/ticket/${id}/tag-vendor`);
  };

  const handleCreateTask = async () => {
    if (!id) {
      console.error('No ticket ID available');
      return;
    }

    try {
      console.log('Fetching create task data for ticket:', id);
      const taskData = await ticketManagementAPI.getCreateTaskData(id);
      console.log('Create task data:', taskData);
      
      // You can handle the response data here
      // For example, navigate to a create task page with the data
      // or open a modal with the task creation form
      
      // Placeholder for now - you can customize this based on your requirements
      toast.success('Create task data fetched successfully! Check console for details.');
      
    } catch (error) {
      console.error('Error fetching create task data:', error);
      toast.error('Failed to fetch create task data. Please try again.');
    }
  };

  const handleUpdate = () => {
    // Navigate to update page with the ticket ID and pass source information
    navigate(`/maintenance/ticket/update/${id}`, {
      state: { 
        from: 'details',
        returnTo: `/maintenance/ticket/${id}` 
      }
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ticket details...</div>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'Ticket not found'}</div>
        </div>
      </div>
    );
  }

  // Process complaint logs for table display
  const complaintLogs = ticketData?.complaint_logs || [];

  // Expandable Section Component (similar to AMC cards)
  const ExpandableSection = ({ 
    title, 
    icon: Icon, 
    number, 
    isExpanded, 
    onToggle, 
    children,
    hasData = true 
  }) => (
    <div className="border-2 rounded-lg mb-6">
      <div 
        onClick={onToggle} 
        className="flex items-center justify-between cursor-pointer p-6"
        style={{ backgroundColor: 'rgb(246 244 238)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
            <Icon className="w-4 h-4" style={{ color: "#C72030" }} />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {!hasData && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
      </div>
      {isExpanded && (
        <div 
          className="p-6"
          style={{ backgroundColor: 'rgb(246 247 247)' }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className=" font-bold text-[#1a1a1a]">Back to Ticket List</span>
          </button>
        </div>
        
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Ticket Summary</h1>
          <div className="flex gap-3">
            
            <Button onClick={handleFeeds} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Logs
            </Button>
            {/* <Button onClick={handleTagVendor} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Tag Vendor
            </Button> */}
            <Button onClick={handleCreateTask} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Create Task
            </Button>
            <Button onClick={handleUpdate} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Ticket Details */}
      <ExpandableSection
        title="TICKET DETAILS"
        icon={FileText}
        number="1"
        isExpanded={expandedSections.ticketDetails}
        onToggle={() => toggleSection('ticketDetails')}
        hasData={hasData(ticketData.heading) || hasData(ticketData.issue_status) || hasData(ticketData.ticket_number)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(ticketData.heading) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Title</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1 break-words truncate max-w-full" style={{wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0, display: 'block'}} title={ticketData.heading}>
                  {ticketData.heading}
                </span>
              </div>
            )}
            {hasData(ticketData.issue_status) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Status</span>
                <span className="text-gray-500 mx-3">:</span>
                <div className="flex-1">
                  <Badge className="bg-yellow-100 text-yellow-700">{ticketData.issue_status}</Badge>
                </div>
              </div>
            )}
            {hasData(ticketData.sub_category_type) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">SubCategory</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.sub_category_type}</span>
              </div>
            )}
            {hasData(ticketData.created_by_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Created By</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.created_by_name}</span>
              </div>
            )}
            {(hasData(ticketData.created_date) || hasData(ticketData.created_time)) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Created On</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{`${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim()}</span>
              </div>
            )}
            {hasData(ticketData.category_type) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Category</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.category_type}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {hasData(ticketData.ticket_number) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Ticket Number</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.ticket_number}</span>
              </div>
            )}
            {hasData(ticketData.updated_by) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Updated By</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.updated_by}</span>
              </div>
            )}
            {hasData(ticketData.complaint_mode) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Complaint Mode</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.complaint_mode}</span>
              </div>
            )}
            {hasData(ticketData.priority || ticketData.external_priority) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Priority</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.priority || ticketData.external_priority}</span>
              </div>
            )}
            {hasData(ticketData.priority_status || ticketData.effective_priority) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Admin Priority</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.priority_status || ticketData.effective_priority}</span>
              </div>
            )}
            {hasData(ticketData.assigned_to) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Assigned To</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.assigned_to}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 2: Creator's Information */}
      <ExpandableSection
        title="CREATOR'S INFORMATION"
        icon={User}
        number="2"
        isExpanded={expandedSections.creatorInfo}
        onToggle={() => toggleSection('creatorInfo')}
        hasData={hasData(ticketData.posted_by) || hasData(ticketData.id_society)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(ticketData.posted_by) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Posted By</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.posted_by}</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {hasData(ticketData.id_society) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Society</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.id_society}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 3: Location Information */}
      <ExpandableSection
        title="LOCATION INFORMATION"
        icon={MapPin}
        number="3"
        isExpanded={expandedSections.locationInfo}
        onToggle={() => toggleSection('locationInfo')}
        hasData={hasData(ticketData.region) || hasData(ticketData.building_name) || hasData(ticketData.city)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(ticketData.region) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Region</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.region}</span>
              </div>
            )}
            {hasData(ticketData.building_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Building</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.building_name}</span>
              </div>
            )}
            {hasData(ticketData.floor_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Floor</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.floor_name}</span>
              </div>
            )}
            {hasData(ticketData.flat_number || ticketData.unit_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Flat/Unit</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.flat_number || ticketData.unit_name}</span>
              </div>
            )}
            {hasData(ticketData.zone) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Zone</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.zone}</span>
              </div>
            )}
            {hasData(ticketData.district) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">District</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.district}</span>
              </div>
            )}
            {hasData(ticketData.room_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Room</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.room_name}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {hasData(ticketData.area_name || ticketData.site_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Area/Site</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.area_name || ticketData.site_name}</span>
              </div>
            )}
            {hasData(ticketData.city) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">City</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.city}</span>
              </div>
            )}
            {hasData(ticketData.state) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">State</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.state}</span>
              </div>
            )}
            {hasData(ticketData.address) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Address</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.address}</span>
              </div>
            )}
            {hasData(ticketData.wing_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Wing</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.wing_name}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 4: Survey Information */}
      {/* <ExpandableSection
        title="SURVEY INFORMATION"
        icon={FileSearch}
        number="4"
        isExpanded={expandedSections.surveyInfo}
        onToggle={() => toggleSection('surveyInfo')}
        hasData={hasData(ticketData.survey_id) || hasData(ticketData.survey_name) || hasData(ticketData.survey_location)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(ticketData.survey_id) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Survey ID</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.survey_id}</span>
              </div>
            )}
            {hasData(ticketData.survey_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Survey Name</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.survey_name}</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {hasData(ticketData.survey_location) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Survey Location</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.survey_location}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection> */}

      {/* Section 5: Additional Information */}
      <ExpandableSection
        title="ADDITIONAL INFORMATION"
        icon={PlusCircle}
        number="5"
        isExpanded={expandedSections.additionalInfo}
        onToggle={() => toggleSection('additionalInfo')}
        hasData={hasData(ticketData.corrective_action) || hasData(ticketData.preventive_action) || hasData(ticketData.root_cause) || hasData(ticketData.response_tat) || hasData(ticketData.ticket_urgency) || hasData(ticketData.responsible_person) || hasData(ticketData.asset_service) || hasData(ticketData.resolution_tat) || hasData(ticketData.task_id) || hasData(ticketData.asset_service_location) || hasData(ticketData.resolution_time) || hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(ticketData.corrective_action) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Corrective Action</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.corrective_action}</span>
              </div>
            )}
            {hasData(ticketData.preventive_action) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Preventive Action</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.preventive_action}</span>
              </div>
            )}
            {hasData(ticketData.root_cause) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Root Cause</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.root_cause}</span>
              </div>
            )}
            {hasData(ticketData.response_tat) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Response TAT</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.response_tat}</span>
              </div>
            )}
            {hasData(ticketData.ticket_urgency) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Ticket Urgency</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.ticket_urgency}</span>
              </div>
            )}
            {hasData(ticketData.responsible_person) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Responsible Person</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.responsible_person}</span>
              </div>
            )}
            {hasData(ticketData.asset_service) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Asset Service</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.asset_service}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {hasData(ticketData.resolution_tat) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Resolution TAT</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.resolution_tat}</span>
              </div>
            )}
            {hasData(ticketData.task_id) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Task ID</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.task_id}</span>
              </div>
            )}
            {hasData(ticketData.asset_service_location) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Asset/Service Location</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.asset_service_location}</span>
              </div>
            )}
            {hasData(ticketData.resolution_time) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Resolution Time</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{ticketData.resolution_time}</span>
              </div>
            )}
            {(hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name)) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Escalation Tracking</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{`${ticketData.escalation_response_name || ''}, ${ticketData.escalation_resolution_name || ''}`.replace(/^,\s*|,\s*$/g, '')}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 6: Attachments */}
      <ExpandableSection
        title="ATTACHMENTS"
        icon={Paperclip}
        number="6"
        isExpanded={expandedSections.attachments}
        onToggle={() => toggleSection('attachments')}
        hasData={ticketData.documents && ticketData.documents.length > 0}
      >
        {ticketData.documents && ticketData.documents.length > 0 ? (
          <div className="bg-white rounded-md shadow px-6 py-4">
            <h2 className="font-semibold text-base mb-4">Ticket Attachments:</h2>
            <div className="flex flex-wrap gap-4">
              {ticketData.documents.map((document, index) => {
                // Updated to use the correct field name from API response
                const documentUrl = document.document || document.document_url || document.url || document.attachment_url;
                const fileExtension = documentUrl?.split('.').pop()?.toLowerCase() || 
                                    document.doctype?.split('/').pop()?.toLowerCase() || '';
                const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(fileExtension) || 
                               document.doctype?.startsWith('image/');
                const isPdf = fileExtension === 'pdf' || document.doctype === 'application/pdf';
                const isExcel = ['xls', 'xlsx', 'csv'].includes(fileExtension) || 
                               document.doctype?.includes('spreadsheet') || 
                               document.doctype?.includes('excel');

                console.log('📄 Document processing:', {
                  id: document.id,
                  documentUrl,
                  doctype: document.doctype,
                  fileExtension,
                  isImage,
                  isPdf,
                  document
                });

                return (
                  <div
                    key={document.id || index}
                    className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                  >
                    {isImage ? (
                      <div 
                        className="w-14 h-14 cursor-pointer border rounded-md mb-2 overflow-hidden"
                        onClick={() => {
                          if (documentUrl) {
                            setPreviewImage({
                              url: documentUrl,
                              name: `Document ${index + 1}`,
                              document: document
                            });
                            setShowImagePreview(true);
                          }
                        }}
                      >
                        <img
                          src={documentUrl}
                          alt={`Document ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center border rounded-md text-gray-600 bg-white" style={{display: 'none'}}>
                          <FileText className="w-6 h-6" />
                        </div>
                      </div>
                    ) : isPdf ? (
                      <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                        <FileText className="w-6 h-6" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                      {`Document_${document.id || index + 1}.${fileExtension || 'file'}`}
                    </span>
                    
                    {/* Download Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                      onClick={async () => {
                        // Use the correct field from API response
                        const documentUrl = document.document || document.document_url || document.url || document.attachment_url;
                        const documentName = `document_${document.id}.${fileExtension || 'file'}`;

                        console.log('📎 Download attempt:', {
                          id: document.id,
                          documentUrl,
                          documentName,
                          doctype: document.doctype,
                          document
                        });

                        if (!documentUrl) {
                          console.error('No document URL found', document);
                          toast.error('Unable to download: No file URL found');
                          return;
                        }

                        try {
                          console.log('🔗 Starting download from URL:', documentUrl);

                          // For S3 URLs, we can try direct download first
                          if (documentUrl.includes('s3.') || documentUrl.includes('amazonaws.com')) {
                            console.log('📥 Direct S3 download attempt...');
                            
                            try {
                              const response = await fetch(documentUrl, {
                                method: 'GET',
                                mode: 'cors',
                              });

                              if (response.ok) {
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = documentName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                toast.success('File downloaded successfully');
                                return;
                              }
                            } catch (directError) {
                              console.log('❌ Direct download failed, trying with authentication...');
                            }
                          }

                          // Try with authentication
                          const token = localStorage.getItem('token');
                          if (token) {
                            console.log('� Trying authenticated download...');
                            const response = await fetch(documentUrl, {
                              method: 'GET',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': '*/*',
                              },
                              mode: 'cors',
                            });

                            if (response.ok) {
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = documentName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                              toast.success('File downloaded successfully');
                              return;
                            }
                          }

                          // Last resort: open in new tab
                          console.log('🌐 Opening in new tab as fallback...');
                          window.open(documentUrl, '_blank');
                          // toast.success('File opened in new tab for download');
                          
                        } catch (error) {
                          console.error('Error downloading file:', error);
                          // Fallback: open URL in new tab
                          try {
                            window.open(documentUrl, '_blank');
                            // toast.success('File opened in new tab for download');
                          } catch (fallbackError) {
                            toast.error(`Failed to download file: ${error.message}`);
                          }
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    {/* Preview Button for Images */}
                    {isImage && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 left-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                        onClick={() => {
                          const imageUrl = document.document || document.document_url || document.url || document.attachment_url;
                          if (imageUrl) {
                            setPreviewImage({
                              url: imageUrl,
                              name: `Document ${index + 1}`,
                              document: document
                            });
                            setShowImagePreview(true);
                          }
                        }}
                      >
                       
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No attachments found</p>
        )}
      </ExpandableSection>

      {/* Image Preview Modal */}
      {showImagePreview && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImagePreview(false)}>
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold truncate">{previewImage.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // Reuse the download logic for the preview modal
                    const document = previewImage.document;
                    const documentUrl = document.document || document.document_url || document.url || document.attachment_url;
                    const fileExtension = documentUrl?.split('.').pop()?.toLowerCase() || 
                                        document.doctype?.split('/').pop()?.toLowerCase() || '';
                    const documentName = `document_${document.id}.${fileExtension || 'file'}`;

                    console.log('📎 Modal download attempt:', {
                      id: document.id,
                      documentUrl,
                      documentName,
                      doctype: document.doctype
                    });

                    if (!documentUrl) {
                      toast.error('Unable to download: No file URL found');
                      return;
                    }

                    try {
                      // For S3 URLs, try direct download first
                      if (documentUrl.includes('s3.') || documentUrl.includes('amazonaws.com')) {
                        console.log('📥 Direct S3 download attempt...');
                        
                        try {
                          const response = await fetch(documentUrl, {
                            method: 'GET',
                            mode: 'cors',
                          });

                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = documentName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                            toast.success('File downloaded successfully');
                            return;
                          }
                        } catch (directError) {
                          console.log('❌ Direct download failed, trying with authentication...');
                        }
                      }

                      // Try with authentication
                      const token = localStorage.getItem('token');
                      if (token) {
                        console.log('🔐 Trying authenticated download...');
                        const response = await fetch(documentUrl, {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': '*/*',
                          },
                          mode: 'cors',
                        });

                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = documentName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                          toast.success('File downloaded successfully');
                          return;
                        }
                      }

                      // Last resort: open in new tab
                      console.log('🌐 Opening in new tab as fallback...');
                      window.open(documentUrl, '_blank');
                      // toast.success('File opened in new tab for download');
                      
                    } catch (error) {
                      console.error('Error downloading file:', error);
                      // Fallback: open URL in new tab
                      try {
                        window.open(documentUrl, '_blank');
                        // toast.success('File opened in new tab for download');
                      } catch (fallbackError) {
                        toast.error(`Failed to download: ${error.message}`);
                      }
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowImagePreview(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full h-auto rounded-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-8 text-gray-500">
                Failed to load image preview
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 7: Cost Approval Request */}
      <ExpandableSection
        title="COST APPROVAL REQUEST"
        icon={DollarSign}
        number="7"
        isExpanded={expandedSections.costApproval}
        onToggle={() => toggleSection('costApproval')}
        hasData={ticketData.cost_approval_enabled && ticketData.requests && ticketData.requests.length > 0}
      >
        {ticketData.cost_approval_enabled && ticketData.requests && ticketData.requests.length > 0 ? (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 font-medium">Request ID</TableHead>
                  <TableHead className="text-gray-600 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-600 font-medium">Comments</TableHead>
                  <TableHead className="text-gray-600 font-medium">Created On</TableHead>
                  <TableHead className="text-gray-600 font-medium">Created By</TableHead>
                   <TableHead className="text-gray-600 font-medium">L1</TableHead>
                  <TableHead className="text-gray-600 font-medium">L2</TableHead>
                  <TableHead className="text-gray-600 font-medium">L3</TableHead>
                  <TableHead className="text-gray-600 font-medium">L4</TableHead>
                  <TableHead className="text-gray-600 font-medium">L5</TableHead>
                  <TableHead className="text-gray-600 font-medium">Master Status</TableHead>
                  <TableHead className="text-gray-600 font-medium">Cancelled By</TableHead>
                  {/* <TableHead className="text-gray-600 font-medium">Action</TableHead> */}
                  <TableHead className="text-gray-600 font-medium">Attachment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketData.requests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.id || `REQ-${index + 1}`}</TableCell>
                    <TableCell>{request.amount || 'Not Provided'}</TableCell>
                    <TableCell>{request.comment || 'No comments'}</TableCell>
                    <TableCell>{request.created_on || request.created_at || 'Not Provided'}</TableCell>
                    <TableCell>{request.created_by || 'Not Provided'}</TableCell>
                    <TableCell>{request.approvals?.L1 || 'Na'}</TableCell>
                    <TableCell>{request.approvals?.L2 || 'Na'}</TableCell>
                    <TableCell>{request.approvals?.L3 || 'Na'}</TableCell>
                    <TableCell>{request.approvals?.L4 || 'Na'}</TableCell>
                    <TableCell>{request.approvals?.L5 || 'Na'}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {request.master_status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.cancelled_by || 'NA'}</TableCell>
                    {/* <TableCell>
                      {request.action && (
                        <Button variant="outline" size="sm">
                          Action
                        </Button>
                      )}
                    </TableCell> */}
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Check if request has attachments
                          if (request.attachments && request.attachments.length > 0) {
                            const attachment = request.attachments[0]; // Take first attachment
                            const imageUrl = attachment.url;
                            if (imageUrl) {
                              setPreviewImage({
                                url: imageUrl,
                                name: `Cost Approval Request ${request.id || index + 1}`,
                                document: attachment
                              });
                              setShowImagePreview(true);
                            }
                          } else {
                            toast.error('No attachments found for this request');
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {ticketData.cost_approval_enabled ? 'No cost approval requests found' : 'Cost approval not enabled for this ticket'}
          </p>
        )}
      </ExpandableSection>

      {/* Section 8: Complaint/Action Logs */}
      <ExpandableSection
        title="COMPLAINT/ACTION LOGS"
        icon={History}
        number="8"
        isExpanded={expandedSections.actionLogs}
        onToggle={() => toggleSection('actionLogs')}
        hasData={complaintLogs.length > 0}
      >
        {complaintLogs.length > 0 ? (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 font-medium">Date/Time</TableHead>
                  <TableHead className="text-gray-600 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 font-medium">By</TableHead>
                  <TableHead className="text-gray-600 font-medium">Priority</TableHead>
                  <TableHead className="text-gray-600 font-medium">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaintLogs.map((log, index) => (
                  <TableRow key={log.id || index}>
                    <TableCell className="font-medium text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {log.log_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.log_by || 'System'}</TableCell>
                    <TableCell className="text-sm">{log.priority || '-'}</TableCell>
                    <TableCell className="text-sm">{log.log_comment || 'No comments'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No action logs found</p>
        )}
      </ExpandableSection>
    </div>
  );
};