import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, FileText, Star, Flag, Paperclip, Download, Eye, ChevronDown, ChevronUp, User, MapPin, FileSearch, PlusCircle, ClipboardList, DollarSign, History, File, FileSpreadsheet, X, Edit, FileIcon, Check, Minus, MessageSquare, Ticket } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Select as MuiSelect, Tooltip } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';
import Select, { components } from "react-select";
import { min } from 'lodash';

const CustomMultiValue = (props) => (
  <div
    style={{
      position: "relative",
      backgroundColor: "#E5E0D3",
      borderRadius: "2px",
      margin: "3px",
      marginTop: "10px",
      padding: "4px 10px 6px 10px",
      display: "flex",
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: "13px", color: "#1a1a1a8a", fontWeight: "500" }}>{props.data.label}</span>
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (props.removeProps && props.removeProps.onClick) {
          props.removeProps.onClick(e);
        }
      }}
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        fontSize: "6px",
        fontWeight: "500",
        color: "#000",
        cursor: "pointer",
        lineHeight: "1",
        border: "1.5px solid #000",
        borderRadius: "50%",
        padding: "2px",
      }}
    >
      ✕
    </div>
  </div>
);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    borderColor: state.isFocused ? "#C72030" : "#dcdcdc",
    boxShadow: "none",
    fontSize: "14px",
    paddingTop: "6px",
    backgroundColor: "transparent",
    "&:hover": { borderColor: "#C72030" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "4px 6px",
    flexWrap: "wrap",
    backgroundColor: "transparent",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "4px 8px",
    color: state.isFocused ? "#C72030" : "#666",
    "&:hover": { color: "#C72030" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 100,
    fontSize: "14px",
    backgroundColor: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#C72030"
      : state.isFocused
        ? "#F6F4EE"
        : "#fff",
    color: state.isSelected ? "#fff" : "#1A1A1A",
    fontSize: "14px",
    padding: "8px 12px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F6F4EE",
      color: "#1A1A1A",
    },
    "&:active": {
      backgroundColor: "#C72030",
      color: "#fff",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#1a1a1a8a",
    fontSize: "13px",
    fontWeight: "500",
  }),
};

// Custom styles for single select dropdowns (Preventive, Corrective, etc.)
const singleSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    borderColor: state.isFocused ? "#C72030" : "#dcdcdc",
    boxShadow: "none",
    fontSize: "14px",
    paddingTop: "6px",
    backgroundColor: "transparent",
    "&:hover": { borderColor: "#C72030" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "4px 12px",
    backgroundColor: "transparent",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1A1A1A",
    fontSize: "14px",
    fontWeight: "500",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "4px 8px",
    color: state.isFocused ? "#C72030" : "#666",
    "&:hover": { color: "#C72030" },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    padding: "4px 8px",
    color: state.isFocused ? "#C72030" : "#666",
    cursor: "pointer",
    "&:hover": {
      color: "#C72030",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    fontSize: "14px",
    backgroundColor: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#C72030"
      : state.isFocused
        ? "#F6F4EE"
        : "#fff",
    color: state.isSelected ? "#fff" : "#1A1A1A",
    fontSize: "14px",
    padding: "8px 12px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#C72030",
    },
  }),
};

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '40px',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const formatMinutesToDDHHMM = (minutes: number | null | undefined): string => {
  if (!minutes || minutes === 0 || minutes === null || minutes === undefined) return '00:00:00';

  const totalMinutes = Math.abs(minutes);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = Math.floor(totalMinutes % 60);

  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const formatTicketAgeingToDDHHMM = (ageingString: string | null | undefined): string => {
  if (!ageingString) return '00:00:00';

  // If it's already in the format "52 hour 20 min", parse it
  const hourMatch = ageingString.match(/(\d+)\s*hour/i);
  const minMatch = ageingString.match(/(\d+)\s*min/i);

  if (hourMatch || minMatch) {
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const mins = minMatch ? parseInt(minMatch[1]) : 0;
    const totalMinutes = hours * 60 + mins;

    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingHours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const remainingMins = Math.floor(totalMinutes % 60);

    return `${String(days).padStart(2, '0')}:${String(remainingHours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}`;
  }

  // If it's in minutes format, convert it
  const minutesValue = parseInt(ageingString);
  if (!isNaN(minutesValue)) {
    return formatMinutesToDDHHMM(minutesValue);
  }

  return '00:00:00';
};

// Add function to format response/resolution time if needed
const formatTimeToDDHHMM = (timeString: string | null | undefined): string => {
  if (!timeString) return '00:00:00';

  // If already in HH:MM:SS format, convert to DD:HH:MM
  const parts = timeString.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    const totalMinutes = hours * 60 + minutes;
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingHours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const remainingMins = Math.floor(totalMinutes % 60);

    return `${String(days).padStart(2, '0')}:${String(remainingHours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}`;
  }

  return '00:00:00';
};

const formatTicketAgeing = (ageingSeconds: number): string => {
  if (!ageingSeconds || ageingSeconds === 0) return '00:00:00:00';

  // ageingSeconds is already in seconds, no conversion needed
  const totalSeconds = ageingSeconds;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Helper function to calculate balance TAT
const calculateBalanceTAT = (tatTime: string | null | undefined, tatMinutes: number | null | undefined): { value: string; isExceeded: boolean; exceededBy: string } => {
  if (!tatTime) {
    return {
      value: tatMinutes ? formatMinutesToDDHHMM(tatMinutes) : '00:00:00:00',
      isExceeded: false,
      exceededBy: ''
    };
  }

  try {
    const tatDate = new Date(tatTime);
    const currentDate = new Date();
    const diffMs = tatDate.getTime() - currentDate.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);

    if (totalSeconds < 0) {
      // Time exceeded
      const exceededSeconds = Math.abs(totalSeconds);
      const days = Math.floor(exceededSeconds / (24 * 60 * 60));
      const hours = Math.floor((exceededSeconds % (24 * 60 * 60)) / (60 * 60));
      const mins = Math.floor((exceededSeconds % (60 * 60)) / 60);
      const secs = exceededSeconds % 60;
      const exceededTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      return {
        value: exceededTime,
        isExceeded: true,
        exceededBy: exceededTime
      };
    } else {
      // Time remaining
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const mins = Math.floor((totalSeconds % (60 * 60)) / 60);
      const secs = totalSeconds % 60;
      const remainingTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      return {
        value: remainingTime,
        isExceeded: false,
        exceededBy: ''
      };
    }
  } catch (error) {
    console.error('Error calculating balance TAT:', error);
    return {
      value: tatMinutes ? formatMinutesToDDHHMM(tatMinutes) : '00:00:00:00',
      isExceeded: false,
      exceededBy: ''
    };
  }
};

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [costInvolveEnabled, setCostInvolveEnabled] = useState<boolean>(false);
  const [currentAgeing, setCurrentAgeing] = useState<number>(0); // Ageing in seconds for real-time countdown
  const [balanceTATTrigger, setBalanceTATTrigger] = useState<number>(0); // State to trigger TAT re-calculation
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communicationTemplates, setCommunicationTemplates] = useState<Array<{
    id: number;
    identifier: string;
    identifier_action: string;
    body: string;
    resource_id: number;
    resource_type: string;
    active: boolean;
  }>>([]);
  const [selectedInternalTemplate, setSelectedInternalTemplate] = useState<number | string>("");
  const [selectedCustomerTemplate, setSelectedCustomerTemplate] = useState<number | string>("");
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [internalCommentText, setInternalCommentText] = useState("");
  const [customerAttachments, setCustomerAttachments] = useState<File[]>([]);
  const [internalAttachments, setInternalAttachments] = useState<File[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [responsiblePersons, setResponsiblePersons] = useState<Array<{
    id: number;
    employee_type: string;
    full_name: string;
  }>>([]);
  const [loadingResponsiblePersons, setLoadingResponsiblePersons] = useState(false);

  const [suppliers, setSuppliers] = useState<Array<{
    id: number;
    company_name: string;
    email: string;
  }>>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [complaintModes, setComplaintModes] = useState<Array<{
    id: number;
    name: string;
  }>>([]);
  const [loadingComplaintModes, setLoadingComplaintModes] = useState(false);
  const [loadingComplaintStatus, setLoadingComplaintStatus] = useState(false);

  // Add missing complaintStatus state
  const [complaintStatus, setComplaintStatus] = useState<Array<any>>([]);


  const [costRows, setCostRows] = useState<Array<{
    id: number;
    quotation: string;
    vendor: string;
    vendor_id: string;
    description: string;
    cost: string;
    attachment: string;
    attachmentFiles: File[];
  }>>([
    { id: 1, quotation: '', vendor: '', vendor_id: '', description: '', cost: '', attachment: '', attachmentFiles: [] }
  ]);

  const [submittingCostApproval, setSubmittingCostApproval] = useState(false);

  // Ticket Management Edit State
  const [isEditingTicketMgmt, setIsEditingTicketMgmt] = useState(false);
  const [ticketMgmtFormData, setTicketMgmtFormData] = useState({
    selectedStatus: '',
    severity: '',
    assigned_to: '',
    asset_service: '',
    visit_date: '',
    expected_completion_date: '',
    issue_related_to: '',
    complaint_mode_id: '',
    rca_template_ids: [] as number[],
    additional_notes: '',
  });
  const [submittingTicketMgmt, setSubmittingTicketMgmt] = useState(false);

  // (Add handlers near other handlers)
  const addCostRow = () => {
    setCostRows(prev => [...prev, {
      id: Date.now(),
      quotation: '',
      vendor: '',
      vendor_id: '',
      description: '',
      cost: '',
      attachment: '',
      attachmentFiles: []
    }])
  }
  const removeCostRow = () => {
    setCostRows(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const formatLogDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatLogTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      .replace(' ', '')
      .toUpperCase();

  // Helper function to check if value has data
  const hasData = (value) => {
    return value && value !== null && value !== undefined && value !== "";
  };

  // Helper function to display value or "Not Provided"
  const displayValue = (value) => {
    return value && value !== null && value !== undefined && value !== ""
      ? value
      : "Not Provided";
  };

  const formatDate = (d?: string) =>
    d && d.trim() !== '' ? new Date(d).toLocaleDateString() : 'DD/MM/YYYY';

  // Helper to truncate text to 5 characters and append ellipsis; shows full text on hover via title
  const truncateWithEllipsis = (value: string, max: number = 5) => {
    if (typeof value !== 'string') return value;
    if (value.length <= max) return value;
    return value.slice(0, max) + '...';
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
        surveyInfo: ticketData.survey && (hasData(ticketData.survey.survey?.id) || hasData(ticketData.survey.survey?.name) || hasData(ticketData.survey.site_name) || hasData(ticketData.survey.building_name) || hasData(ticketData.survey.wing_name) || hasData(ticketData.survey.area_name) || hasData(ticketData.survey.floor_name) || hasData(ticketData.survey.room_name)),
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
        console.error('Error fetching ticket details:', err);
        setError('Failed to fetch ticket details');
        toast.error('Failed to fetch ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // Fetch communication templates
  useEffect(() => {
    const fetchCommunicationTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const url = `https://${baseUrl}${API_CONFIG.ENDPOINTS.COMMUNICATION_TEMPLATES}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Communication templates response:', data);
        // The API returns an array directly
        setCommunicationTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching communication templates:', err);
        toast.error('Failed to load communication templates');
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchCommunicationTemplates();
  }, []);

  useEffect(() => {
    const fetchComplaintModes = async () => {
      try {
        setLoadingComplaintModes(true);
        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const url = `https://${baseUrl}/pms/admin/complaint_modes.json`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const complaintModesResponse = await response.json();
        console.log('Complaint modes response:', complaintModesResponse);
        setComplaintModes(complaintModesResponse || []);
      } catch (err) {
        console.error('Error fetching complaint modes:', err);
        toast.error('Failed to load complaint modes');
      } finally {
        setLoadingComplaintModes(false);
      }
    };

    fetchComplaintModes();
  }, []);
  useEffect(() => {
    const fetchComplaintStatus = async () => {
      try {
        setLoadingComplaintStatus(true);
        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const url = `https://${baseUrl}/pms/admin/complaint_statuses.json`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const complaintStatusResponse = await response.json();
        console.log('Complaint status response:', complaintStatusResponse);
        setComplaintStatus(complaintStatusResponse.data || complaintStatusResponse || []);
      } catch (err) {
        console.error('Error fetching complaint status:', err);
        toast.error('Failed to load complaint status');
      } finally {
        setLoadingComplaintStatus(false);
      }
    };

    fetchComplaintStatus();
  }, []);

  // Fetch responsible persons
  useEffect(() => {
    const fetchResponsiblePersons = async () => {
      try {
        setLoadingResponsiblePersons(true);
        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const url = `https://${baseUrl}/pms/users/get_escalate_to_users.json`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Responsible persons response:', data);
        setResponsiblePersons(data.users || []);
      } catch (err) {
        console.error('Error fetching responsible persons:', err);
        toast.error('Failed to load responsible persons');
      } finally {
        setLoadingResponsiblePersons(false);
      }
    };

    fetchResponsiblePersons();
  }, []);

  console.log("corrective:-------------------", communicationTemplates
    .filter(template => template.identifier === "Corrective Action" && template?.active === true)
    .map(t => ({ value: t.id, label: t.identifier_action })));


  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const url = `https://${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Suppliers response:', data);
        // API returns pms_suppliers array
        setSuppliers(Array.isArray(data.pms_suppliers) ? data.pms_suppliers : []);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        toast.error('Failed to load suppliers');
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Add useEffect to initialize and update ageing
  useEffect(() => {
    if (ticketData?.ticket_ageing_minutes) {
      // Convert minutes to seconds for real-time countdown
      setCurrentAgeing(ticketData.ticket_ageing_minutes * 60);

      // Update ageing every second for real-time countdown
      const interval = setInterval(() => {
        setCurrentAgeing(prev => prev + 1);
      }, 1000); // 1000ms = 1 second

      return () => clearInterval(interval);
    }
  }, [ticketData?.ticket_ageing_minutes]);

  const handleBackToList = () => {
    navigate(-1);
  };

  const handleFeeds = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes("tickets")) {
      navigate(`/tickets/${id}/feeds`);
    } else {
      navigate(`/maintenance/ticket/${id}/feeds`);
    }
    // navigate(`/maintenance/ticket/${id}/feeds`);
  };

  const handleTagVendor = () => {
    navigate(`/maintenance/ticket/${id}/tag-vendor`);
  };

  const handleCreateTask = async () => {
    if (!id) {
      console.error("No ticket ID available");
      return;
    }

    try {
      console.log("Fetching create task data for ticket:", id);
      const taskData = await ticketManagementAPI.getCreateTaskData(id);
      console.log("Create task data:", taskData);

      toast.success('Create task data fetched successfully! Check console for details.');

    } catch (error) {
      console.error("Error fetching create task data:", error);
      toast.error("Failed to fetch create task data. Please try again.");
    }
  };

  const handleUpdate = () => {
    console.log("🔄 Navigating to update page for ticket ID:", id);

    const currentPath = window.location.pathname;

    if (currentPath.includes("tickets")) {
      navigate(`/tickets/edit/${id}`, {
        state: {
          from: "details",
          returnTo: `/tickets/details/${id}`,
        },
      });
    } else {
      navigate(`/maintenance/ticket/update/${id}`, {
        state: {
          from: "details",
          returnTo: `/maintenance/ticket/${id}`,
        },
      });
    }

    // navigate(`/maintenance/ticket/update/${id}`, {
    //   state: {
    //     from: 'details',
    //     returnTo: `/maintenance/ticket/${id}`
    //   }
    // });
  };

  // Handle file selection for customer comments
  const handleCustomerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setCustomerAttachments(Array.from(files));
    }
  };

  // Handle file selection for internal comments
  const handleInternalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setInternalAttachments(Array.from(files));
    }
  };

  // Handle Root Cause multi-select change with auto-save
  const handleRootCauseChange = async (selectedValues: string | string[] | number | number[]) => {
    try {
      // Convert to array of numbers (template IDs)
      let templateIds: number[] = [];
      if (Array.isArray(selectedValues)) {
        templateIds = selectedValues.map(v => typeof v === 'number' ? v : parseInt(String(v)));
      } else {
        templateIds = [typeof selectedValues === 'number' ? selectedValues : parseInt(String(selectedValues))];
      }

      // Filter out any NaN values
      templateIds = templateIds.filter(id => !isNaN(id));

      // Get the selected templates to store their names
      const selectedTemplates = communicationTemplates.filter(t => templateIds.includes(t.id));
      const rootCauseString = selectedTemplates.map(t => t.identifier_action).join(', ');

      console.log('🔄 Auto-saving root cause template IDs:', templateIds);

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);

      // Add each template ID with array notation
      templateIds.forEach(templateId => {
        formDataToSend.append('root_cause[template_ids][]', String(templateId));
      });

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Root cause auto-saved successfully:', data);

      // Update local state AFTER successful API call
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          root_cause: rootCauseString,
          rca_template_ids: templateIds
        };
      });

      toast.success('Root cause updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving root cause:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update root cause');

      // Optionally: Revert the UI change on error
      // You could refetch the ticket data here to ensure UI is in sync
    }
  };

  // Handle Preventive Action change with auto-save (multi-select)
  const handlePreventiveActionChange = async (selectedOptions: Array<{ value: number; label: string }>) => {
    try {
      // Handle clear/unselect case
      if (!selectedOptions || selectedOptions.length === 0) {
        console.log('🔄 Clearing preventive action');

        // Update local state
        setTicketData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            preventive_action: '',
            preventive_action_template_ids: []
          };
        });

        // Call API to clear
        if (!id) {
          console.error('No ticket ID available for update');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('complaint_log[complaint_id]', id);
        formDataToSend.append('preventive_action[template_ids][]', '');

        const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        toast.success('Preventive action cleared successfully');
        return;
      }

      // Get template IDs from selected options
      const templateIds = selectedOptions.map(option => option.value);
      const templateLabels = selectedOptions.map(option => option.label).join(', ');

      // Update local state
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          preventive_action: templateLabels,
          preventive_action_template_ids: templateIds
        };
      });

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      console.log('🔄 Auto-saving preventive action template IDs:', templateIds);

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);
      templateIds.forEach(templateId => {
        formDataToSend.append('preventive_action[template_ids][]', String(templateId));
      });

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Preventive action auto-saved successfully:', data);

      toast.success('Preventive action updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving preventive action:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update preventive action');
    }
  };

  // Handle Corrective Action change with auto-save (multi-select)
  const handleCorrectiveActionChange = async (selectedOptions: Array<{ value: number; label: string }>) => {
    try {
      // Handle clear/unselect case
      if (!selectedOptions || selectedOptions.length === 0) {
        console.log('🔄 Clearing corrective action');

        // Update local state
        setTicketData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            corrective_action: '',
            corrective_action_template_ids: []
          };
        });

        // Call API to clear
        if (!id) {
          console.error('No ticket ID available for update');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('complaint_log[complaint_id]', id);
        formDataToSend.append('corrective_action[template_ids][]', '');

        const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        toast.success('Corrective action cleared successfully');
        return;
      }

      // Get template IDs from selected options
      const templateIds = selectedOptions.map(option => option.value);
      const templateLabels = selectedOptions.map(option => option.label).join(', ');

      // Update local state
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          corrective_action: templateLabels,
          corrective_action_template_ids: templateIds
        };
      });

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      console.log('🔄 Auto-saving corrective action template IDs:', templateIds);

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);
      templateIds.forEach(templateId => {
        formDataToSend.append('corrective_action[template_ids][]', String(templateId));
      });

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Corrective action auto-saved successfully:', data);

      toast.success('Corrective action updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving corrective action:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update corrective action');
    }
  };

  // Handle Short-term Impact change with auto-save (multi-select)
  const handleShortTermImpactChange = async (selectedOptions: Array<{ value: number; label: string }>) => {
    try {
      // Handle clear/unselect case
      if (!selectedOptions || selectedOptions.length === 0) {
        console.log('🔄 Clearing short-term impact');

        // Update local state
        setTicketData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            short_term_impact: '',
            short_term_impact_template_ids: []
          };
        });

        // Call API to clear
        if (!id) {
          console.error('No ticket ID available for update');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('complaint_log[complaint_id]', id);
        formDataToSend.append('short_term_impact[template_ids][]', '');

        const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        toast.success('Short-term impact cleared successfully');
        return;
      }

      // Get template IDs from selected options
      const templateIds = selectedOptions.map(option => option.value);
      const templateLabels = selectedOptions.map(option => option.label).join(', ');

      // Update local state
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          short_term_impact: templateLabels,
          short_term_impact_template_ids: templateIds
        };
      });

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      console.log('🔄 Auto-saving short-term impact template IDs:', templateIds);

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);
      templateIds.forEach(templateId => {
        formDataToSend.append('short_term_impact[template_ids][]', String(templateId));
      });

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Short-term impact auto-saved successfully:', data);

      toast.success('Short-term impact updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving short-term impact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update short-term impact');
    }
  };

  // Handle Long-term Impact change with auto-save (multi-select)
  const handleLongTermImpactChange = async (selectedOptions: Array<{ value: number; label: string }>) => {
    try {
      // Handle clear/unselect case
      if (!selectedOptions || selectedOptions.length === 0) {
        console.log('🔄 Clearing long-term impact');

        // Update local state
        setTicketData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            impact: '',
            long_term_impact_template_ids: []
          };
        });

        // Call API to clear
        if (!id) {
          console.error('No ticket ID available for update');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('complaint_log[complaint_id]', id);
        formDataToSend.append('impact[template_ids][]', '');

        const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        toast.success('Long-term impact cleared successfully');
        return;
      }

      // Get template IDs from selected options
      const templateIds = selectedOptions.map(option => option.value);
      const templateLabels = selectedOptions.map(option => option.label).join(', ');

      // Update local state
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          impact: templateLabels,
          long_term_impact_template_ids: templateIds
        };
      });

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      console.log('🔄 Auto-saving long-term impact template IDs:', templateIds);

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);
      templateIds.forEach(templateId => {
        formDataToSend.append('impact[template_ids][]', String(templateId));
      });

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Long-term impact auto-saved successfully:', data);

      toast.success('Long-term impact updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving long-term impact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update long-term impact');
    }
  };

  // Handle Responsible Person change with auto-save
  const handleResponsiblePersonChange = async (selectedPersonId: string) => {
    try {
      // Find the person by ID
      const selectedPerson = responsiblePersons.find(
        person => person.id.toString() === selectedPersonId
      );

      if (!selectedPerson) {
        console.error('Selected responsible person not found');
        return;
      }

      // Update local state
      setTicketData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          responsible_person: selectedPerson.full_name
        };
      });

      // Call API to save immediately
      if (!id) {
        console.error('No ticket ID available for update');
        return;
      }

      console.log('🔄 Auto-saving responsible person ID:', selectedPersonId);

      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', id);
      formDataToSend.append('complaint[person_id]', selectedPersonId);

      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_TICKET);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Responsible person auto-saved successfully:', data);

      toast.success('Responsible person updated successfully');

    } catch (error) {
      console.error('❌ Error auto-saving responsible person:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update responsible person');
    }
  };

  // Submit comment handler
  const handleSubmitComment = async () => {
    if (!id) {
      toast.error('Ticket ID not found');
      return;
    }

    // Validate that at least one comment is provided
    if (!commentText.trim() && !internalCommentText.trim()) {
      toast.error('Please enter at least one comment');
      return;
    }

    try {
      setSubmittingComment(true);

      // Get user ID from localStorage or auth context
      const userId = localStorage.getItem('userId') || '';

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      // Create FormData - matching the curl command structure exactly
      const formData = new FormData();

      // Required fields
      formData.append('complaint_log[complaint_id]', id);
      formData.append('complaint_log[changed_by]', userId);

      // Add customer comment if provided
      if (commentText.trim()) {
        formData.append('complaint_log[comment]', commentText.trim());
        // Add customer attachments with array notation
        customerAttachments.forEach((file) => {
          formData.append('complaint_comment[docs][]', file);
        });
      }

      // Add internal comment if provided
      if (internalCommentText.trim()) {
        formData.append('complaint_log[internal_comment]', internalCommentText.trim());
        // Add internal attachments with array notation
        internalAttachments.forEach((file) => {
          formData.append('internal_complaint_comment[docs][]', file);
        });
      }

      // Make API call
      const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const url = `https://${baseUrl}${API_CONFIG.ENDPOINTS.UPDATE_TICKET}`;

      console.log('Submitting comment to:', url);
      console.log('FormData contents:', {
        complaint_id: id,
        changed_by: userId,
        comment: commentText.trim() || '-',
        internal_comment: internalCommentText.trim() || '-',
        customer_attachments: customerAttachments.length,
        internal_attachments: internalAttachments.length,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type header when using FormData, browser will set it automatically with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Comment submitted successfully:', data);

      toast.success('Comment submitted successfully!');

      // Clear form
      setCommentText('');
      setInternalCommentText('');
      setSelectedInternalTemplate('');
      setSelectedCustomerTemplate('');
      setCustomerAttachments([]);
      setInternalAttachments([]);

      // Refresh ticket data to show new comment
      const ticketDetails = await ticketManagementAPI.getTicketDetails(id);
      setTicketData(ticketDetails);

    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle cost approval file change
  const handleCostAttachmentChange = (rowId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setCostRows(prev =>
        prev.map(r => r.id === rowId ? { ...r, attachmentFiles: Array.from(files) } : r)
      );
    }
  };

  // Submit cost approval handler
  const handleSubmitCostApproval = async () => {
    if (!id) {
      toast.error('Ticket ID not found');
      return;
    }

    // Validate that all required fields are filled
    const invalidRows = costRows.filter(row =>
      !row.cost.trim() || !row.description.trim()
    );

    if (invalidRows.length > 0) {
      toast.error('Please fill in all required fields (Cost and Description)');
      return;
    }

    try {
      setSubmittingCostApproval(true);

      // Create FormData
      const formData = new FormData();

      // Add complaint_id (single value)
      formData.append('complaint_id', id);

      // Add each cost approval with array indices
      costRows.forEach((row, index) => {
        formData.append(`cost_approvals[${index}][cost]`, row.cost);
        formData.append(`cost_approvals[${index}][comment]`, row.description);

        // Add vendor_id if selected
        if (row.vendor_id) {
          formData.append(`cost_approvals[${index}][vendor_id]`, row.vendor_id);
        }

        // Add quotation if provided
        if (row.quotation.trim()) {
          formData.append(`cost_approvals[${index}][quotation]`, row.quotation);
        }

        // Add attachment (single file) for this row
        if (row.attachmentFiles.length > 0) {
          formData.append(`cost_approvals[${index}][attachment]`, row.attachmentFiles[0]);
        }
      });

      // Make API call
      const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const url = `https://${baseUrl}${API_CONFIG.ENDPOINTS.COST_APPROVALS_CREATE}`;

      console.log('Submitting cost approval to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type, browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cost approval submitted successfully:', data);

      toast.success('Cost approval submitted successfully!');

      // Reset cost rows to initial state
      setCostRows([
        { id: 1, quotation: '', vendor: '', vendor_id: '', description: '', cost: '', attachment: '', attachmentFiles: [] }
      ]);

      // Refresh ticket data
      const ticketDetails = await ticketManagementAPI.getTicketDetails(id);
      setTicketData(ticketDetails);

    } catch (error) {
      console.error('Error submitting cost approval:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit cost approval. Please try again.');
    } finally {
      setSubmittingCostApproval(false);
    }
  };
  const convertDateFormat = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Try to parse other formats
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
    }

    return '';
  };

  // Update the handleTicketMgmtEdit function
  const handleTicketMgmtEdit = () => {
    console.log('=== Form Initialization Debug ===');
    console.log('ticketData:', ticketData);
    console.log('visit_date from API:', ticketData?.visit_date);
    console.log('expected_completion_date from API:', ticketData?.expected_completion_date);

    // Find the status ID by matching status name with complaintStatus
    const findStatusId = () => {
      if (!ticketData?.issue_status) return '';
      const matchedStatus = complaintStatus.find(status =>
        status.name === ticketData.issue_status ||
        status.id.toString() === ticketData.issue_status
      );
      console.log('Status mapping:', {
        original: ticketData.issue_status,
        matched: matchedStatus,
        result: matchedStatus ? matchedStatus.id.toString() : ''
      });
      return matchedStatus ? matchedStatus.id.toString() : '';
    };

    // Find the mode ID by matching mode name with complaintModes
    const findModeId = () => {
      if (!ticketData?.complaint_mode) return '';
      const matchedMode = complaintModes.find(mode =>
        mode.name === ticketData.complaint_mode ||
        mode.id.toString() === ticketData.complaint_mode
      );
      console.log('Mode mapping:', {
        original: ticketData.complaint_mode,
        matched: matchedMode,
        result: matchedMode ? matchedMode.id.toString() : ''
      });
      return matchedMode ? matchedMode.id.toString() : '';
    };

    // Find the assigned user ID by matching user name with responsiblePersons
    const findAssignedUserId = () => {
      if (!ticketData?.assigned_to) return '';
      const matchedUser = responsiblePersons.find(user =>
        user.full_name === ticketData.assigned_to ||
        user.id.toString() === ticketData.assigned_to
      );
      console.log('User mapping:', {
        original: ticketData.assigned_to,
        matched: matchedUser,
        result: matchedUser ? matchedUser.id.toString() : ''
      });
      return matchedUser ? matchedUser.id.toString() : '';
    };

    // Convert dates to proper format for HTML date inputs
    const convertedVisitDate = convertDateFormat(ticketData?.visit_date);
    const convertedCompletionDate = convertDateFormat(ticketData?.expected_completion_date);

    console.log('Date conversion:', {
      original_visit_date: ticketData?.visit_date,
      converted_visit_date: convertedVisitDate,
      original_completion_date: ticketData?.expected_completion_date,
      converted_completion_date: convertedCompletionDate
    });

    // Initialize form data with current ticket data
    const formData = {
      selectedStatus: findStatusId(),
      severity: ticketData?.severity || '',
      assigned_to: findAssignedUserId(),
      asset_service: ticketData?.asset_service || 'Asset',
      visit_date: convertedVisitDate,
      expected_completion_date: convertedCompletionDate,
      issue_related_to: ticketData?.issue_related_to || 'FM',
      complaint_mode_id: findModeId(),
      rca_template_ids: ticketData?.rca_template_ids || [],
      additional_notes: ticketData?.notes || ticketData?.heading || ticketData?.text || '',
    };

    console.log('Final form data:', formData);
    setTicketMgmtFormData(formData);
    setIsEditingTicketMgmt(true);
  };

  // Handle Ticket Management Form Input Change
  const handleTicketMgmtInputChange = (field: string, value: any) => {
    setTicketMgmtFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Ticket Management Form Submit
  const handleTicketMgmtSubmit = async () => {
    try {
      setSubmittingTicketMgmt(true);

      if (!id) {
        throw new Error('No ticket ID available');
      }

      // Build query parameters matching the curl command format
      const queryParams = new URLSearchParams();

      // Required parameter: complaint_id
      queryParams.append('complaint_log[complaint_id]', id);

      // Add other parameters based on form data
      if (ticketMgmtFormData.severity) {
        queryParams.append('severity', ticketMgmtFormData.severity);
      }

      if (ticketMgmtFormData.asset_service) {
        queryParams.append('source', ticketMgmtFormData.asset_service);
      }

      if (ticketMgmtFormData.complaint_mode_id) {
        queryParams.append('complaint_mode_id', ticketMgmtFormData.complaint_mode_id);
      }

      if (ticketMgmtFormData.issue_related_to) {
        queryParams.append('scope', ticketMgmtFormData.issue_related_to);
      }

      if (ticketMgmtFormData.assigned_to) {
        queryParams.append('assigned_to', ticketMgmtFormData.assigned_to);
      }

      if (ticketMgmtFormData.expected_completion_date) {
        queryParams.append('expected_completion_date', ticketMgmtFormData.expected_completion_date);
      }

      if (ticketMgmtFormData.visit_date) {
        queryParams.append('visit_date', ticketMgmtFormData.visit_date);
      }

      if (ticketMgmtFormData.selectedStatus) {
        queryParams.append('issue_status', ticketMgmtFormData.selectedStatus);
      }

      if (ticketMgmtFormData.additional_notes) {
        queryParams.append('additional_notes', ticketMgmtFormData.additional_notes);
      }

      // Build the API URL with query parameters
      const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const apiUrl = `https://${baseUrl}/complaint_logs.json?${queryParams.toString()}`;

      console.log('🔄 Submitting to:', apiUrl);
      console.log('🔄 Form data:', ticketMgmtFormData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Ticket management updated successfully:', data);

      toast.success('Ticket management updated successfully');

      // Refresh ticket data
      const ticketDetails = await ticketManagementAPI.getTicketDetails(id);
      setTicketData(ticketDetails);

      // Exit edit mode
      setIsEditingTicketMgmt(false);

    } catch (error) {
      console.error('❌ Error updating ticket management:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update ticket management');
    } finally {
      setSubmittingTicketMgmt(false);
    }
  };
  // Add useEffect to initialize and update ageing
  useEffect(() => {
    if (ticketData?.ticket_ageing_minutes) {
      // Convert minutes to seconds for real-time countdown
      setCurrentAgeing(ticketData.ticket_ageing_minutes * 60);

      // Update ageing every second for real-time countdown
      const interval = setInterval(() => {
        setCurrentAgeing(prev => prev + 1);
      }, 1000); // 1000ms = 1 second

      return () => clearInterval(interval);
    }
  }, [ticketData?.ticket_ageing_minutes]);

  // Add useEffect to trigger balance TAT recalculation every second for real-time countdown
  useEffect(() => {
    // Update balance TAT every second to show real-time countdown
    const interval = setInterval(() => {
      setBalanceTATTrigger(prev => prev + 1);
    }, 1000); // 1000ms = 1 second

    return () => clearInterval(interval);
  }, []);

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
          <div className="text-lg text-red-600">
            {error || "Ticket not found"}
          </div>
        </div>
      </div>
    );
  }

  console.log("ticketData:-", ticketData);

  // Process complaint logs for table display
  const complaintLogs = ticketData?.complaint_logs || [];

  // Calculate balance TATs with exceeded check
  const responseBalanceTAT = calculateBalanceTAT(ticketData.response_tat_time, ticketData.balance_reponse_tat);
  const resolutionBalanceTAT = calculateBalanceTAT(ticketData.resolution_tat_time, ticketData.balance_resolution_tat);

  const tatGridRows = [
    [
      {
        label: 'Response TAT',
        value: hasData(ticketData.response_tat)
          ? formatMinutesToDDHHMM(ticketData.response_tat)
          : '00:00:00'
      },
      {
        label: 'Balance TAT',
        value: responseBalanceTAT.value,
        isExceeded: responseBalanceTAT.isExceeded,
        exceededBy: responseBalanceTAT.exceededBy
      },
      {
        label: 'Escalation',
        value: (() => {
          console.log('Response Escalation Debug:', {
            response_escalate_to_user: ticketData.response_escalate_to_user,
            response_esc_name: ticketData.response_esc_name,
            response_escalation: ticketData.response_escalation
          });

          // Build the escalation display string
          const parts: string[] = [];

          // Add escalation name (E2, E3, etc.) if available
          if (ticketData.response_esc_name) {
            parts.push(ticketData.response_esc_name);
          }

          // Add user names if available
          if (Array.isArray(ticketData.response_escalate_to_user) && ticketData.response_escalate_to_user.length > 0) {
            const users = ticketData.response_escalate_to_user.filter(user => user !== null && user !== undefined && user !== '');
            if (users.length > 0) {
              parts.push(users.join(', '));
            }
          }

          // Return combined string or fallback
          return parts.length > 0 ? parts.join(' - ') : (ticketData.response_escalation || '-');
        })()
      },
    ],
    [
      {
        label: 'Resolution TAT',
        value: hasData(ticketData.resolution_tat)
          ? formatMinutesToDDHHMM(ticketData.resolution_tat)
          : '00:00:00'
      },
      {
        label: 'Balance TAT',
        value: resolutionBalanceTAT.value,
        isExceeded: resolutionBalanceTAT.isExceeded,
        exceededBy: resolutionBalanceTAT.exceededBy
      },
      {
        label: 'Escalation',
        value: (() => {
          console.log('Resolution Escalation Debug:', {
            resolution_escalate_to_user: ticketData.resolution_escalate_to_user,
            resolution_esc_name: ticketData.resolution_esc_name,
            resolution_escalation: ticketData.resolution_escalation
          });

          // Build the escalation display string
          const parts: string[] = [];

          // Add escalation name (E2, E3, etc.) if available
          if (ticketData.resolution_esc_name) {
            parts.push(ticketData.resolution_esc_name);
          }

          // Add user names if available
          if (Array.isArray(ticketData.resolution_escalate_to_user) && ticketData.resolution_escalate_to_user.length > 0) {
            const users = ticketData.resolution_escalate_to_user.filter(user => user !== null && user !== undefined && user !== '');
            if (users.length > 0) {
              parts.push(users.join(', '));
            }
          }

          // Return combined string or fallback
          return parts.length > 0 ? parts.join(' - ') : (ticketData.resolution_escalation || '-');
        })()
      },
    ],
  ];

  console.log("escNAme", ticketData.response_esc_name, ticketData.resolution_esc_name);


  // Helper function to find the matched responsible person
  const getResponsiblePersonValue = () => {
    if (!ticketData?.responsible_person) return '';

    console.log('🔍 Responsible Person Debug:', {
      ticketDataValue: ticketData.responsible_person,
      availablePersons: responsiblePersons.map(p => ({ id: p.id, name: p.full_name }))
    });

    // Try to find exact match by full_name
    const matchedPerson = responsiblePersons.find(
      person => person.full_name === ticketData.responsible_person
    );

    console.log('🔍 Responsible Person Matched:', matchedPerson ? `${matchedPerson.full_name} (ID: ${matchedPerson.id})` : 'No match');

    return matchedPerson ? matchedPerson.id.toString() : ticketData.responsible_person;
  };

  // Helper function to get template values for Preventive Action (multi-select)
  const getPreventiveActionValues = () => {
    if (!ticketData?.preventive_action_template_ids || !Array.isArray(ticketData.preventive_action_template_ids)) {
      return [];
    }

    const uniqueIds = [...new Set(ticketData.preventive_action_template_ids)];
    const matchedTemplates = communicationTemplates.filter(
      template => uniqueIds.includes(template.id) &&
        template.identifier === "Preventive Action" &&
        template.active === true
    );

    return matchedTemplates.map(t => ({ value: t.id, label: t.identifier_action }));
  };

  // Helper function to get template values for Short-term Impact (multi-select)
  const getShortTermImpactValues = () => {
    if (!ticketData?.short_term_impact_template_ids || !Array.isArray(ticketData.short_term_impact_template_ids)) {
      return [];
    }

    const uniqueIds = [...new Set(ticketData.short_term_impact_template_ids)];
    const matchedTemplates = communicationTemplates.filter(
      template => uniqueIds.includes(template.id) &&
        template.identifier === "Short-term Impact" &&
        template.active === true
    );

    return matchedTemplates.map(t => ({ value: t.id, label: t.identifier_action }));
  };

  // Helper function to get template values for Corrective Action (multi-select)
  const getCorrectiveActionValues = () => {
    if (!ticketData?.corrective_action_template_ids || !Array.isArray(ticketData.corrective_action_template_ids)) {
      return [];
    }

    const uniqueIds = [...new Set(ticketData.corrective_action_template_ids)];
    const matchedTemplates = communicationTemplates.filter(
      template => uniqueIds.includes(template.id) &&
        template.identifier === "Corrective Action" &&
        template.active === true
    );

    return matchedTemplates.map(t => ({ value: t.id, label: t.identifier_action }));
  };

  // Helper function to get template values for Long-term Impact (multi-select)
  const getLongTermImpactValues = () => {
    if (!ticketData?.long_term_impact_template_ids || !Array.isArray(ticketData.long_term_impact_template_ids)) {
      return [];
    }

    const uniqueIds = [...new Set(ticketData.long_term_impact_template_ids)];
    const matchedTemplates = communicationTemplates.filter(
      template => uniqueIds.includes(template.id) &&
        template.identifier === "Long-term Impact" &&
        template.active === true
    );

    return matchedTemplates.map(t => ({ value: t.id, label: t.identifier_action }));
  };

  // Helper function to get Root Cause Analysis values for React Select
  const getRootCauseAnalysisValues = () => {
    // First priority: Use template IDs from API if available
    if (ticketData?.rca_template_ids && Array.isArray(ticketData.rca_template_ids)) {
      // Filter out duplicate IDs using Set
      const uniqueIds = [...new Set(ticketData.rca_template_ids)];

      console.log('🔍 Root Cause Analysis Template IDs from API:', uniqueIds);

      // Find templates by IDs
      const matchedTemplates = communicationTemplates.filter(
        (t) =>
          uniqueIds.includes(t.id) &&
          t.identifier === "Root Cause Analysis"
      );

      console.log('🔍 Root Cause Analysis Matched Templates:', matchedTemplates.map(t => ({ id: t.id, action: t.identifier_action })));

      return matchedTemplates.map((t) => ({
        value: t.id,
        label: t.identifier_action,
      }));
    }

    // Fallback: Use text matching if no template IDs
    if (!ticketData.root_cause) return [];
    const rootCauseString =
      typeof ticketData.root_cause === "string"
        ? ticketData.root_cause
        : Array.isArray(ticketData.root_cause)
          ? ticketData.root_cause.join(", ")
          : "";

    if (!rootCauseString) return [];

    const rootCauseValues = rootCauseString.split(",").map((s) => s.trim());
    const matchedTemplates = communicationTemplates.filter(
      (t) =>
        t.identifier === "Root Cause Analysis" &&
        rootCauseValues.includes(t.identifier_action)
    );

    return matchedTemplates.map((t) => ({
      value: t.id,
      label: t.identifier_action,
    }));
  };

  const getPriorityLabel = (priority: string | null | undefined): string => {
    if (!priority) return '-';

    const priorityMap: Record<string, string> = {
      'P1': 'P1 - Critical',
      'P2': 'P2 - Very High',
      'P3': 'P3 - High',
      'P4': 'P4 - Medium',
      'P5': 'P5 - Low'
    };

    // Handle case-insensitive matching
    const upperPriority = priority.toUpperCase();
    return priorityMap[upperPriority] || priority;
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ticket List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] break-words overflow-wrap-anywhere" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {ticketData.heading || "Ticket Summary"}
            </h1>

            <div className="text-sm text-gray-600">
              Ticket #{ticketData.ticket_number || "-"} • Created by{" "}
              {ticketData.created_by_name || "Unknown"} • Last updated{" "}
              {ticketData.updated_at ? (() => {
                const date = new Date(ticketData.updated_at);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                return `${day}/${month}/${year}, ${hours}:${minutes}${ampm}`;
              })() : "-"}
            </div>
          </div>

          {/* {activeTab === "details" && ( */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleFeeds}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
            >
              Logs
            </Button>

            <Button
              onClick={handleCreateTask}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
            >
              Create Task
            </Button>

            <Button
              onClick={handleUpdate}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          {/* )} */}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs
          defaultValue="analytics"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="analytics"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Details
            </TabsTrigger>

            {/* <TabsTrigger
              value="creator-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Creator Info
            </TabsTrigger> */}

            {/* <TabsTrigger
              value="location-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Location
            </TabsTrigger>

            <TabsTrigger
              value="survey-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Survey Info
            </TabsTrigger> */}

            {/* <TabsTrigger
              value="additional-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Additional
            </TabsTrigger> */}

            {/* <TabsTrigger
              value="attachments"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Attachments
            </TabsTrigger> */}

            <TabsTrigger
              value="cost-approval"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Cost Approval
            </TabsTrigger>

            <TabsTrigger
              value="action-logs"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="p-4 sm:p-6">
            <Tabs defaultValue="analytics" style={{ width: "100%" }}>
              <TabsList className="w-full mb-6">
                <TabsTrigger
                  value="analytics"
                  className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
                >
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                      fill="#currentColor"
                    />
                  </svg>
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
                >
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Ticket Details
                </TabsTrigger>
              </TabsList>

              {/* Analytics Content */}
              <TabsContent value="analytics">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-[14px] font-medium text-[#1A1A1A]">
                      Ticket Detail Table
                    </h2>
                  </div>

                  {/* Ticket Detail Table */}
                  <div
                    className="rounded-xl p-3 sm:p-6 border shadow-lg"
                    style={{ backgroundColor: "#F6F4EE" }}
                  >
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 rounded-lg">
                        <thead>
                          <tr>
                            {[
                              "Assignee",
                              "Response TAT",
                              "Resolution TAT",
                              <div key="red-flag" className="flex items-center justify-center w-full gap-1">
                                Red Flag
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none">
                                  <path d="M1 8.5V15.5C1 15.642 0.952 15.7607 0.856 15.856C0.76 15.9513 0.641 15.9993 0.499 16C0.357 16.0007 0.238333 15.9527 0.143 15.856C0.0476668 15.7593 0 15.6407 0 15.5V1.308C0 1.07934 0.0773332 0.887338 0.232 0.732004C0.386667 0.576671 0.578667 0.499338 0.808 0.500004H6.521C6.71433 0.500004 6.887 0.559004 7.039 0.677004C7.191 0.795004 7.28567 0.951671 7.323 1.147L7.593 2.5H12.193C12.4217 2.5 12.6133 2.57667 12.768 2.73C12.9227 2.88334 13 3.07334 13 3.3V9.7C13 9.92667 12.9227 10.1167 12.768 10.27C12.6133 10.4233 12.4213 10.5 12.192 10.5H8.48C8.28667 10.5 8.114 10.441 7.962 10.323C7.81 10.205 7.71533 10.0483 7.678 9.853L7.407 8.5H1Z" fill="#C72030" />
                                </svg>
                              </div>,
                              <div key="golden-ticket" className="flex items-center justify-center w-full gap-1">
                                Golden Ticket
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                  <path d="M10.5005 3L8.54219 7.8L3.36719 8.18333L7.33385 11.5333L6.09219 16.5667L10.5005 13.8333L14.9089 16.5667L13.6672 11.5333L17.6339 8.18333L12.4589 7.8L10.5005 3Z" fill="#CCC500" stroke="#CCC500" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>,
                              "Attachments"
                            ].map((header, idx) => (
                              <th
                                key={idx}
                                className="p-4 border border-gray-300"
                                style={{ backgroundColor: "#EDEAE3" }}
                              >
                                <div className="flex items-center justify-center text-black font-semibold text-lg">
                                  {header}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.assigned_to ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.response_tat ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.resolution_tat ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.is_flagged ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.is_golden_ticket ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.documents?.length > 0 ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Ageing */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <Ticket style={{ color: '#C72030', width: '24px', height: '24px' }} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          {ticketData.ticket_ageing_minutes
                            ? formatMinutesToDDHHMM(ticketData.ticket_ageing_minutes)
                            : formatTicketAgeingToDDHHMM(ticketData.ticket_ageing)
                          }
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Ticket Ageing
                        </span>
                      </div>
                    </div>

                    {/* Response TAT */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          {formatMinutesToDDHHMM(ticketData.response_tat)}
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Response TAT
                        </span>
                      </div>
                    </div>

                    {/* Resolution TAT */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          {formatTimeToDDHHMM(ticketData.resolution_time)}
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Resolution TAT
                        </span>
                      </div>
                    </div>

                    {/* Response Escalation */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <Ticket className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex justify-between w-full">
                          <span
                            className="font-semibold text-[#1A1A1A]"
                            style={{ fontSize: 24 }}
                          >
                            {formatMinutesToDDHHMM(ticketData.balance_reponse_tat)}
                          </span>

                          <span className="text-[12px] text-[#9CA3AF] mt-1">
                            {(() => {
                              const escalationName = ticketData.response_esc_name || '';
                              const escalationUsers = Array.isArray(ticketData.response_escalate_to_user) && ticketData.response_escalate_to_user.length > 0
                                ? ticketData.response_escalate_to_user.filter(user => user !== null && user !== undefined && user !== '').join(', ')
                                : '';

                              if (escalationName && escalationUsers) {
                                return `${escalationName} - ${escalationUsers}`;
                              } else {
                                return ''
                              }
                            })()}
                          </span>
                        </div>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Response Escalation
                        </span>
                      </div>
                    </div>

                    {/* Resolution Escalation */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex justify-between w-full">
                          <span
                            className="font-semibold text-[#1A1A1A]"
                            style={{ fontSize: 24 }}
                          >
                            {formatMinutesToDDHHMM(ticketData.balance_resolution_tat)}
                          </span>
                          <span className="text-[12px] text-[#9CA3AF] mt-1">
                            {(() => {
                              const escalationName = ticketData.resolution_esc_name || '';
                              const escalationUsers = Array.isArray(ticketData.resolution_escalate_to_user) && ticketData.resolution_escalate_to_user.length > 0
                                ? ticketData.resolution_escalate_to_user.filter(user => user !== null && user !== undefined && user !== '').join(', ')
                                : '';

                              if (escalationName && escalationUsers) {
                                return `${escalationName} - ${escalationUsers}`;
                              } else {
                                return ''
                              }
                            })()}
                          </span>
                        </div>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Resolution Escalation
                        </span>
                      </div>
                    </div>

                    {/* Golden Ticket Escalation */}
                    <div
                      className="border bg-[#F6F4EE] flex items-center p-4"
                      style={{ height: "132px", width: "auto" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg mr-4"
                        style={{ background: "#EDEAE3", width: 62, height: 62 }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex justify-between w-full">
                          <p
                            className="font-semibold text-[#1A1A1A]"
                            style={{ fontSize: 24 }}
                          >
                            {formatMinutesToDDHHMM(ticketData.golden_resp_time_minutes)}
                          </p>
                          <p className="text-[12px] text-[#9CA3AF] mt-1">
                            {(() => {
                              const escalationName = ticketData.golden_esc_name || '';
                              const escalationUsers = Array.isArray(ticketData.golden_escalate_to_user) && ticketData.golden_escalate_to_user.length > 0
                                ? ticketData.golden_escalate_to_user.filter(user => user !== null && user !== undefined && user !== '').join(', ')
                                : '';

                              if (escalationName && escalationUsers) {
                                return `${escalationName} - ${escalationUsers}`;
                              } else {
                                return ''
                              }
                            })()}
                          </p>
                        </div>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Golden Ticket Escalation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Ticket Details - Full Width */}
              <TabsContent value="details" className="space-y-8">

                <div className="space-y-6">
                  {/* Check if there's any ticket data to display */}
                  {hasData(ticketData.heading) ||
                    hasData(ticketData.issue_status) ||
                    hasData(ticketData.sub_category_type) ||
                    hasData(ticketData.created_by_name) ||
                    hasData(ticketData.created_date) ||
                    hasData(ticketData.created_time) ||
                    hasData(ticketData.created_at) ||
                    hasData(ticketData.category_type) ||
                    hasData(ticketData.ticket_number) ||
                    hasData(ticketData.updated_by) ||
                    hasData(ticketData.complaint_mode) ||
                    hasData(ticketData.priority) ||
                    hasData(ticketData.external_priority) ||
                    hasData(ticketData.priority_status) ||
                    hasData(ticketData.effective_priority) ||
                    hasData(ticketData.assigned_to) ? (


                    <Card className="w-full">
                      <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                        <div style={{ width: '40px', height: '40px' }} className="rounded-full flex items-center justify-center bg-[#E5E0D3]">
                          <Ticket className="w-5 h-5" style={{ color: '#C72030' }} />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-black">
                          Ticket Details
                        </h3>
                      </div>
                      <div className="px-6 bg-[#dfd9cb]">
                        <div className="flex justify-between py-4 border-b border-[#dfd9cb]">
                          <div className='w-full '>
                            <div className="">
                              <div className="flex items-start mb-4">
                                <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Description</span>
                                <span className="text-gray-900 font-medium break-words overflow-wrap-anywhere" style={{ fontSize: '14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                  {ticketData.heading || 'No description available'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="">
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>
                                      {ticketData.category_type || '-'}
                                    </span>
                                  </div>
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Sub Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>
                                      {ticketData.sub_category_type || '-'}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-white p-4" style={{ width: '75%', borderRadius: '4px' }}>
                                  <div className="grid grid-cols-3 w-full items-center gap-4">
                                    {tatGridRows.flat().map((cell, idx) => {
                                      // Determine column alignment
                                      const colAlign =
                                        idx % 3 === 0
                                          ? 'justify-start'
                                          : idx % 3 === 1
                                            ? 'justify-center'
                                            : 'justify-end';

                                      return (
                                        <div
                                          key={idx}
                                          className={`flex ${colAlign} w-full`}
                                        >
                                          {/* Inner flex box for key-value pair with fixed key width and 20px gap */}
                                          <div className="flex items-center gap-[20px]">
                                            {/* Fixed width label to align values */}
                                            <span className="text-[14px] text-gray-500 whitespace-nowrap" style={{ minWidth: cell.label === 'Response TAT' ? '90px' : '5px' }}>
                                              {cell.label}
                                            </span>

                                            {/* Dynamic value */}
                                            <span
                                              className={`text-[13px] md:text-[14px] font-semibold whitespace-nowrap ${cell.isExceeded && cell.label === 'Balance TAT'
                                                ? 'text-red-600'
                                                : 'text-gray-900'
                                                }`}
                                            >
                                              {cell.isExceeded && cell.label === 'Balance TAT'
                                                ? 'Exceeded'
                                                : cell.value}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-around" style={{ textAlign: 'center', marginLeft: '20px' }}>
                            <button className='w-full py-1 bg-black rounded-full text-white mb-2 text-xs px-3'>
                              {ticketData.issue_status || '-'}
                            </button>
                            <div className='mb-2'>
                              <button className='w-full py-1 bg-[#FFCFCF] rounded-full text-[#C72030] text-xs px-3 font-semibold'>
                                {getPriorityLabel(ticketData.priority)}
                              </button>
                            </div>
                            <div className="flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <mask id="mask0_9118_15345" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="0" width="20" height="23">
                                  <path d="M12 21.9995C16.6945 21.9995 20.5 18.194 20.5 13.4995C20.5 8.80501 16.6945 4.99951 12 4.99951C7.3055 4.99951 3.5 8.80501 3.5 13.4995C3.5 18.194 7.3055 21.9995 12 21.9995Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                  <path d="M15.5 1.99951H8.5M19 4.99951L17.5 6.49951" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M12 9V13.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </mask>
                                <g mask="url(#mask0_9118_15345)">
                                  <path d="M0 0H24V24H0V0Z" fill="#434343" />
                                </g>
                              </svg>
                              <span style={{ fontSize: '16px', fontWeight: 600 }} className="text-black ml-1">
                                {formatTicketAgeing(currentAgeing)}
                              </span>
                            </div>
                            <div className="flex justify-center items-center gap-2 mb-2">
                              {ticketData.is_executive_ecalation === true && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                <path d="M12.36 9.76C14.31 10.42 16 11.5 16 13V18H0V13C0 11.5 1.69 10.42 3.65 9.76L4.27 11L4.5 11.5C3 11.96 1.9 12.62 1.9 13V16.1H6.12L7 11.03L6.06 9.15C6.68 9.08 7.33 9.03 8 9.03C8.67 9.03 9.32 9.08 9.94 9.15L9 11.03L9.88 16.1H14.1V13C14.1 12.62 13 11.96 11.5 11.5L11.73 11L12.36 9.76ZM8 2C6.9 2 6 2.9 6 4C6 5.1 6.9 6 8 6C9.1 6 10 5.1 10 4C10 2.9 9.1 2 8 2ZM8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0C10.21 0 12 1.79 12 4C12 6.21 10.21 8 8 8Z" fill="black" />
                              </svg>)}
                              {ticketData.is_golden_ticket && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                                  <path d="M17.6219 20.0977C17.5715 20.0977 17.5214 20.085 17.4765 20.0585L10.9967 16.2938L4.5084 20.0459C4.46385 20.0719 4.41384 20.0844 4.36383 20.0844C4.3057 20.0844 4.24792 20.0676 4.19919 20.0329C4.10788 19.9695 4.06564 19.8599 4.09105 19.7548L5.82438 12.6847L0.0968238 7.92979C0.011544 7.85906 -0.0211751 7.74629 0.013865 7.64365C0.0486731 7.54111 0.144281 7.4686 0.256711 7.45937L7.80786 6.85484L10.756 0.164147C10.7997 0.0643917 10.9014 0 11.0139 0C11.0141 0 11.0143 0 11.0143 0C11.127 0 11.2288 0.0649467 11.2721 0.164479L14.2058 6.86118L21.7552 7.48095C21.8678 7.49029 21.9631 7.56302 21.9981 7.66555C22.0328 7.7682 22 7.88108 21.9144 7.95136L16.1762 12.6948L17.8943 19.7686C17.9202 19.8736 17.8774 19.983 17.7858 20.0464C17.7373 20.0806 17.6793 20.0977 17.6219 20.0977Z" fill="url(#paint0_radial_9118_15308)" />
                                  <path d="M17.6229 19.896C17.6103 19.896 17.5977 19.8926 17.5864 19.8862L10.998 16.0584L4.40068 19.8732C4.38954 19.8795 4.37736 19.8826 4.36471 19.8826C4.35021 19.8826 4.3357 19.879 4.32352 19.8696C4.30055 19.8541 4.2901 19.8267 4.2966 19.8006L6.05905 12.6117L0.235078 7.77705C0.213845 7.75947 0.205725 7.73112 0.214311 7.7052C0.223361 7.67996 0.247029 7.66172 0.275107 7.65972L7.95284 7.04474L10.9502 0.241834C10.9614 0.216923 10.9866 0.200684 11.0147 0.200684C11.0147 0.200684 11.0147 0.200684 11.0149 0.200684C11.0432 0.200684 11.0685 0.217032 11.0794 0.241943L14.062 7.05063L21.7385 7.68085C21.7665 7.68307 21.7902 7.70121 21.7992 7.72701C21.8076 7.75281 21.7994 7.78105 21.7783 7.7984L15.9439 12.6213L17.6909 19.8137C17.6973 19.8397 17.6862 19.8674 17.6638 19.883C17.6512 19.8916 17.6371 19.896 17.6229 19.896Z" fill="url(#paint1_linear_9118_15308)" />
                                  <path d="M7.99743 7.10811L11.0112 0.268066L14.0103 7.11412L21.7291 7.7479L15.8627 12.5975L17.6192 19.8291L10.9944 15.9802L4.36114 19.8159L6.13322 12.5877L0.277344 7.72644L7.99743 7.10811Z" fill="url(#paint2_linear_9118_15308)" />
                                  <path d="M11.1891 11.551C11.1439 11.4959 11.0748 11.4633 11.0016 11.4633C11.0013 11.4633 11.0013 11.4633 11.0009 11.4633C10.928 11.4633 10.8587 11.4956 10.8138 11.5507L8.37693 14.534L10.5906 11.395C10.6317 11.3368 10.6425 11.2637 10.6201 11.197C10.5972 11.1303 10.5441 11.0772 10.4752 11.053L6.76172 9.75321L10.5606 10.8015C10.5824 10.8077 10.6044 10.8107 10.6263 10.8107C10.6762 10.8107 10.7253 10.7958 10.7663 10.7672C10.8257 10.7258 10.8619 10.6606 10.8644 10.5904L11.0063 6.80371L11.1405 10.5907C11.143 10.6611 11.179 10.7263 11.2382 10.7677C11.2793 10.7962 11.3287 10.8113 11.3782 10.8113C11.4 10.8113 11.4222 10.8084 11.4438 10.8026L15.245 9.76189L11.5286 11.054C11.4599 11.0783 11.4064 11.1311 11.3835 11.1977C11.3608 11.2647 11.3714 11.3376 11.4124 11.396L13.6195 14.5391L11.1891 11.551Z" fill="white" />
                                  <path d="M10.6435 10.0628L8.08027 6.91957L11.0111 0.267578L10.6435 10.0628ZM21.7289 7.74752H21.7291L14.2765 7.13554L11.9655 10.4201L21.7289 7.74752ZM9.90642 11.0964L0.277344 7.72606L5.98598 12.4647L9.90642 11.0964ZM11.961 11.7709L17.6192 19.8288L15.9261 12.8597L11.961 11.7709ZM4.36114 19.8153L10.7915 16.0971L10.6454 12.1225L4.36114 19.8153Z" fill="url(#paint3_linear_9118_15308)" />
                                  <path d="M11.3577 10.0658L11.0112 0.267578L13.9241 6.91623L11.3577 10.0658ZM7.72152 7.12998L0.277344 7.72606L10.0372 10.4191L7.72152 7.12998ZM21.7289 7.74752L12.0992 11.0962L16.0235 12.464L21.7289 7.74752ZM11.2154 16.1082L17.6191 19.8288L11.3594 12.1331L11.2154 16.1082ZM10.0325 11.7743L6.06523 12.8657L4.36126 19.8154V19.8152L10.0325 11.7743Z" fill="url(#paint4_linear_9118_15308)" />
                                  <defs>
                                    <radialGradient id="paint0_radial_9118_15308" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.0059 10.0489) scale(10.7481 10.3019)">
                                      <stop stopColor="#D08B01" />
                                      <stop offset="0.5758" stopColor="#F2B145" />
                                      <stop offset="1" stopColor="#F8F3BC" />
                                    </radialGradient>
                                    <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#F6DB89" />
                                      <stop offset="1" stopColor="#F8F7DA" />
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#ED9017" />
                                      <stop offset="0.1464" stopColor="#F09F23" />
                                      <stop offset="0.4262" stopColor="#F6C642" />
                                      <stop offset="0.4945" stopColor="#F8D04A" />
                                      <stop offset="1" stopColor="#F6E6B5" />
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#ED9017" />
                                      <stop offset="0.1464" stopColor="#F09F23" />
                                      <stop offset="0.4262" stopColor="#F6C642" />
                                      <stop offset="0.4945" stopColor="#F8D04A" />
                                      <stop offset="1" stopColor="#F6E6B5" />
                                    </linearGradient>
                                    <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#DF8D00" />
                                      <stop offset="0.0848" stopColor="#FFD006" />
                                      <stop offset="0.2242" stopColor="#F4AD06" />
                                      <stop offset="0.85" stopColor="#F4AD06" />
                                      <stop offset="0.8777" stopColor="#F2A807" />
                                      <stop offset="0.9093" stopColor="#EC9B09" />
                                      <stop offset="0.9428" stopColor="#E2840D" />
                                      <stop offset="0.9773" stopColor="#D46412" />
                                      <stop offset="1" stopColor="#C94B16" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              )}
                              {ticketData.is_flagged && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                                  <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        {[
                          [
                            { label: 'Issue Type', value: ticketData.issue_type || '-' },
                            { label: 'Assigned To', value: ticketData.assigned_to || '-' },
                            { label: 'Behalf Of', value: ticketData.on_behalf_of || '-' },
                            { label: 'Association', value: ticketData.service_or_asset || '-' },
                          ],
                          [
                            { label: 'Created By', value: ticketData.created_by_name || '-' },
                            { label: 'Updated By', value: ticketData.updated_by || '-' },
                            { label: 'Mode', value: ticketData.complaint_mode || '-' },
                            { label: 'Identification', value: ticketData.proactive_reactive || '-' },
                          ],
                        ].map((row, rIdx) => (
                          <div
                            key={rIdx}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                          >
                            {row
                              .filter(f => hasData(f.value))
                              .map(field => (
                                <div key={field.label} className="mb-4">
                                  <div className="flex">
                                    <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide pr-2">
                                      {field.label}
                                    </div>
                                    <div className="text-[14px] font-semibold text-gray-900">
                                      {field.value}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    /* No Data Available Message */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No Data Available
                      </h3>
                      <p className="text-gray-400 max-w-sm">
                        There is no ticket information available to display at this
                        time.
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <ClipboardList className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Association
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                      {[
                        { label: 'Asset Name', value: ticketData.asset_or_service_name || '-' },
                        { label: 'Group', value: ticketData.asset_group || '-' },
                        { label: 'Status', value: ticketData.amc?.amc_status || '-' },
                        { label: 'Criticality', value: ticketData.asset_criticality ? 'Critical' : 'Non Critical' },

                        { label: 'Asset ID', value: ticketData.pms_asset_id || ticketData.asset_or_service_id || '-' },
                        { label: 'Sub group', value: ticketData.asset_sub_group || '-' },
                        { label: 'AMC Status', value: ticketData.amc?.amc_status || '-' },
                        { label: 'Under Warranty', value: ticketData.warranty ? 'Yes' : 'No' },

                        { label: 'Category', value: ticketData.asset_type_category || '-' },
                        { label: 'Allocated', value: ticketData.assigned_to || '-' },
                        { label: 'AMC Type', value: 'Comprehensive' },
                        { label: 'Warranty Expiry', value: ticketData.asset_warranty_expiry ? new Date(ticketData.asset_warranty_expiry).toLocaleDateString('en-GB') : '-' },
                      ].map(field => (
                        <div key={field.label} className="flex items-start">
                          <div className="w-[140px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">
                            {field.label}
                          </div>
                          <div className="text-[14px] font-semibold text-gray-900 flex-1">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header (consistent) */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Ticket Management
                      </h3>
                      {ticketData.closure_date === null || ticketData.closure_date === undefined || ticketData.closure_date === '' && (
                        <span className="w-2 h-2 rounded-full bg-[#4BE2B9]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {ticketData.is_golden_ticket && (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#EDEAE3]"
                          title="Favourite"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                            <path d="M17.6219 20.0977C17.5715 20.0977 17.5214 20.085 17.4765 20.0585L10.9967 16.2938L4.5084 20.0459C4.46385 20.0719 4.41384 20.0844 4.36383 20.0844C4.3057 20.0844 4.24792 20.0676 4.19919 20.0329C4.10788 19.9695 4.06564 19.8599 4.09105 19.7548L5.82438 12.6847L0.0968238 7.92979C0.011544 7.85906 -0.0211751 7.74629 0.013865 7.64365C0.0486731 7.54111 0.144281 7.4686 0.256711 7.45937L7.80786 6.85484L10.756 0.164147C10.7997 0.0643917 10.9014 0 11.0139 0C11.0141 0 11.0143 0 11.0143 0C11.127 0 11.2288 0.0649467 11.2721 0.164479L14.2058 6.86118L21.7552 7.48095C21.8678 7.49029 21.9631 7.56302 21.9981 7.66555C22.0328 7.7682 22 7.88108 21.9144 7.95136L16.1762 12.6948L17.8943 19.7686C17.9202 19.8736 17.8774 19.983 17.7858 20.0464C17.7373 20.0806 17.6793 20.0977 17.6219 20.0977Z" fill="url(#paint0_radial_9118_15308)" />
                            <path d="M17.6229 19.896C17.6103 19.896 17.5977 19.8926 17.5864 19.8862L10.998 16.0584L4.40068 19.8732C4.38954 19.8795 4.37736 19.8826 4.36471 19.8826C4.35021 19.8826 4.3357 19.879 4.32352 19.8696C4.30055 19.8541 4.2901 19.8267 4.2966 19.8006L6.05905 12.6117L0.235078 7.77705C0.213845 7.75947 0.205725 7.73112 0.214311 7.7052C0.223361 7.67996 0.247029 7.66172 0.275107 7.65972L7.95284 7.04474L10.9502 0.241834C10.9614 0.216923 10.9866 0.200684 11.0147 0.200684C11.0147 0.200684 11.0147 0.200684 11.0149 0.200684C11.0432 0.200684 11.0685 0.217032 11.0794 0.241943L14.062 7.05063L21.7385 7.68085C21.7665 7.68307 21.7902 7.70121 21.7992 7.72701C21.8076 7.75281 21.7994 7.78105 21.7783 7.7984L15.9439 12.6213L17.6909 19.8137C17.6973 19.8397 17.6862 19.8674 17.6638 19.883C17.6512 19.8916 17.6371 19.896 17.6229 19.896Z" fill="url(#paint1_linear_9118_15308)" />
                            <path d="M7.99743 7.10811L11.0112 0.268066L14.0103 7.11412L21.7291 7.7479L15.8627 12.5975L17.6192 19.8291L10.9944 15.9802L4.36114 19.8159L6.13322 12.5877L0.277344 7.72644L7.99743 7.10811Z" fill="url(#paint2_linear_9118_15308)" />
                            <path d="M11.1891 11.551C11.1439 11.4959 11.0748 11.4633 11.0016 11.4633C11.0013 11.4633 11.0013 11.4633 11.0009 11.4633C10.928 11.4633 10.8587 11.4956 10.8138 11.5507L8.37693 14.534L10.5906 11.395C10.6317 11.3368 10.6425 11.2637 10.6201 11.197C10.5972 11.1303 10.5441 11.0772 10.4752 11.053L6.76172 9.75321L10.5606 10.8015C10.5824 10.8077 10.6044 10.8107 10.6263 10.8107C10.6762 10.8107 10.7253 10.7958 10.7663 10.7672C10.8257 10.7258 10.8619 10.6606 10.8644 10.5904L11.0063 6.80371L11.1405 10.5907C11.143 10.6611 11.179 10.7263 11.2382 10.7677C11.2793 10.7962 11.3287 10.8113 11.3782 10.8113C11.4 10.8113 11.4222 10.8084 11.4438 10.8026L15.245 9.76189L11.5286 11.054C11.4599 11.0783 11.4064 11.1311 11.3835 11.1977C11.3608 11.2647 11.3714 11.3376 11.4124 11.396L13.6195 14.5391L11.1891 11.551Z" fill="white" />
                            <path d="M10.6435 10.0628L8.08027 6.91957L11.0111 0.267578L10.6435 10.0628ZM21.7289 7.74752H21.7291L14.2765 7.13554L11.9655 10.4201L21.7289 7.74752ZM9.90642 11.0964L0.277344 7.72606L5.98598 12.4647L9.90642 11.0964ZM11.961 11.7709L17.6192 19.8288L15.9261 12.8597L11.961 11.7709ZM4.36114 19.8153L10.7915 16.0971L10.6454 12.1225L4.36114 19.8153Z" fill="url(#paint3_linear_9118_15308)" />
                            <path d="M11.3577 10.0658L11.0112 0.267578L13.9241 6.91623L11.3577 10.0658ZM7.72152 7.12998L0.277344 7.72606L10.0372 10.4191L7.72152 7.12998ZM21.7289 7.74752L12.0992 11.0962L16.0235 12.464L21.7289 7.74752ZM11.2154 16.1082L17.6191 19.8288L11.3594 12.1331L11.2154 16.1082ZM10.0325 11.7743L6.06523 12.8657L4.36126 19.8154V19.8152L10.0325 11.7743Z" fill="url(#paint4_linear_9118_15308)" />
                            <defs>
                              <radialGradient id="paint0_radial_9118_15308" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.0059 10.0489) scale(10.7481 10.3019)">
                                <stop stopColor="#D08B01" />
                                <stop offset="0.5758" stopColor="#F2B145" />
                                <stop offset="1" stopColor="#F8F3BC" />
                              </radialGradient>
                              <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F6DB89" />
                                <stop offset="1" stopColor="#F8F7DA" />
                              </linearGradient>
                              <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ED9017" />
                                <stop offset="0.1464" stopColor="#F09F23" />
                                <stop offset="0.4262" stopColor="#F6C642" />
                                <stop offset="0.4945" stopColor="#F8D04A" />
                                <stop offset="1" stopColor="#F6E6B5" />
                              </linearGradient>
                              <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ED9017" />
                                <stop offset="0.1464" stopColor="#F09F23" />
                                <stop offset="0.4262" stopColor="#F6C642" />
                                <stop offset="0.4945" stopColor="#F8D04A" />
                                <stop offset="1" stopColor="#F6E6B5" />
                              </linearGradient>
                              <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#DF8D00" />
                                <stop offset="0.0848" stopColor="#FFD006" />
                                <stop offset="0.2242" stopColor="#F4AD06" />
                                <stop offset="0.85" stopColor="#F4AD06" />
                                <stop offset="0.8777" stopColor="#F2A807" />
                                <stop offset="0.9093" stopColor="#EC9B09" />
                                <stop offset="0.9428" stopColor="#E2840D" />
                                <stop offset="0.9773" stopColor="#D46412" />
                                <stop offset="1" stopColor="#C94B16" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </button>
                      )}
                      {ticketData.is_flagged && (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#EDEAE3]"
                          title="Flag"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                            <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                          </svg>
                        </button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-[12px] border-[#D9D9D9] hover:bg-[#F6F4EE]"
                        onClick={handleTicketMgmtEdit}
                        disabled={isEditingTicketMgmt || loadingComplaintStatus || loadingComplaintModes || loadingResponsiblePersons}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {(loadingComplaintStatus || loadingComplaintModes || loadingResponsiblePersons) ? 'Loading...' : 'Edit'}
                      </Button>
                    </div>
                  </div>

                  {/* Body (consistent background / border like Location card) */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4 overflow-hidden">
                    {!isEditingTicketMgmt ? (
                      // View Mode - Show current ticket data
                      (() => {
                        const mgmtFields = [
                          { label: 'Update Status', value: ticketData.issue_status || '-' },
                          { label: 'Severity', value: ticketData.severity || '-' },
                          { label: 'Select Vendor', value: ticketData.vendors && ticketData.vendors.length > 0 ? ticketData.vendors.map(v => v.name || v).join(', ') : '-' },
                          { label: 'Assigned To', value: ticketData.assigned_to || '-' },
                          { label: 'Source', value: ticketData.asset_service || '-' },

                          { label: 'Expected Visit Date', value: ticketData.visit_date ? ticketData.visit_date || formatDate(ticketData.visit_date) : '-' },
                          { label: 'Expected Completion Date', value: ticketData.expected_completion_date ? formatDate(ticketData.expected_completion_date) : '-' },
                          { label: 'Scope', value: ticketData.issue_related_to || '-' },
                          { label: 'Mode', value: ticketData.complaint_mode || '-' },
                          { label: 'Identification', value: ticketData.proactive_reactive || '-' },
                        ];

                        // Split into two vertical columns
                        const midpoint = Math.ceil(mgmtFields.length / 2);
                        const colA = mgmtFields.slice(0, midpoint);
                        const colB = mgmtFields.slice(midpoint);

                        return (
                          <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left: two vertical columns of key/value pairs */}
                            <div className="flex-1 flex gap-16 min-w-0">
                              {[colA, colB].map((col, ci) => (
                                <div key={ci} className="flex flex-col gap-4 min-w-[280px] flex-1">
                                  {col.map((field) => (
                                    <div key={field.label} className="flex text-[14px] leading-snug min-w-0">
                                      <div className="w-[180px] flex-shrink-0 text-[#6B6B6B] font-medium">
                                        {field.label}
                                      </div>
                                      <div className="flex-1 text-[14px] font-semibold text-[#1A1A1A] break-words overflow-wrap-anywhere min-w-0">
                                        {field.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* Right: Root Cause + Notes (stacked) */}
                            <div className="w-full lg:w-[38%] min-w-0">
                              <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                                <div className="relative w-full">
                                  {/* Floating label on border */}
                                  <label
                                    style={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "12px",
                                      background: "#fff",
                                      padding: "0 6px",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      color: "#1A1A1A",
                                      zIndex: 1
                                    }}
                                  >
                                    Root Cause Analysis
                                  </label>

                                  {/* React Select */}
                                  <Select
                                    isMulti
                                    value={getRootCauseAnalysisValues()}
                                    onChange={(selectedOptions) => {
                                      const selectedIds = selectedOptions
                                        ? selectedOptions.map((opt) => opt.value)
                                        : [];
                                      handleRootCauseChange(selectedIds);
                                    }}
                                    options={communicationTemplates
                                      .filter((t) => t.identifier === "Root Cause Analysis" && t.active === true)
                                      .map((t) => ({
                                        value: t.id,
                                        label: t.identifier_action,
                                      }))}
                                    placeholder="Select Root Cause Analysis..."
                                    styles={customStyles}
                                    components={{
                                      MultiValue: CustomMultiValue,
                                      MultiValueRemove: () => null,
                                    }}
                                    closeMenuOnSelect={false}
                                  />
                                </div>
                              </div>
                              {(ticketData.rca_template_ids && ticketData.rca_template_ids.length > 0) && (
                                <div
                                  className="space-y-2 min-w-0 mt-4"
                                  style={{ fontSize: "14px", fontWeight: "500" }}
                                >
                                  {(() => {
                                    // Use template IDs from API with duplicate filtering
                                    const uniqueIds = [...new Set(ticketData.rca_template_ids)];

                                    return uniqueIds.map((templateId, index) => {
                                      const matchedTemplate = communicationTemplates.find(
                                        (template) =>
                                          template.id === templateId &&
                                          template.identifier === "Root Cause Analysis"
                                      );

                                      if (!matchedTemplate) return null;

                                      return (
                                        <div
                                          key={`rca-display-${templateId}`}
                                          className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                        >
                                          {matchedTemplate.body || matchedTemplate.identifier_action}
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0 mt-4">
                                <span className="text-[11px] tracking-wide text-[#6B6B6B] mb-1">
                                  Additional Notes
                                </span>
                                <div
                                  className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                >
                                  {ticketData.notes ||
                                    ticketData.heading ||
                                    ticketData.text ||
                                    'No additional notes available'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Edit Mode - Show form
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleTicketMgmtSubmit();
                        }}
                        className="space-y-4"
                      >
                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* 1️⃣ LEFT COLUMN */}
                          <div className="space-y-4">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ '& .MuiInputBase-root': fieldStyles }}
                            >
                              <InputLabel shrink>Status</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.selectedStatus}
                                onChange={(e) => handleTicketMgmtInputChange("selectedStatus", e.target.value)}
                                label="Status"
                                notched
                                displayEmpty
                                disabled={loadingComplaintStatus || complaintStatus.length === 0}
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">
                                    {loadingComplaintStatus ? 'Loading statuses...' : 'Select status'}
                                  </span>
                                </MenuItem>
                                {complaintStatus.map((status) => (
                                  <MenuItem key={status.id} value={status.id.toString()}>
                                    {status.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Severity</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.severity}
                                onChange={(e) => handleTicketMgmtInputChange('severity', e.target.value)}
                                label="Severity"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select severity</span>
                                </MenuItem>
                                <MenuItem value="Major">Major</MenuItem>
                                <MenuItem value="Minor">Minor</MenuItem>
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Assigned To</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.assigned_to}
                                onChange={(e) => handleTicketMgmtInputChange('assigned_to', e.target.value)}
                                label="Assigned To"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select engineer</span>
                                </MenuItem>
                                {responsiblePersons.map((user) => (
                                  <MenuItem key={user.id} value={user.id.toString()}>
                                    {user.full_name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Source</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.asset_service}
                                onChange={(e) => handleTicketMgmtInputChange('asset_service', e.target.value)}
                                label="Source"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select source</span>
                                </MenuItem>
                                <MenuItem value="Asset">Asset</MenuItem>
                                <MenuItem value="Service">Service</MenuItem>
                              </MuiSelect>
                            </FormControl>

                          </div>

                          {/* 2️⃣ MIDDLE COLUMN */}
                          <div className="space-y-4">
                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              label="Expected Visit Date"
                              value={ticketMgmtFormData.visit_date}
                              onChange={(e) => handleTicketMgmtInputChange('visit_date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              label="Expected Completion Date"
                              value={ticketMgmtFormData.expected_completion_date}
                              onChange={(e) => handleTicketMgmtInputChange('expected_completion_date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />

                            <FormControl fullWidth size="small">
                              <InputLabel>Scope</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.issue_related_to}
                                onChange={(e) => handleTicketMgmtInputChange('issue_related_to', e.target.value)}
                                label="Scope"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select scope</span>
                                </MenuItem>
                                <MenuItem value="Projects">Projects</MenuItem>
                                <MenuItem value="FM">FM</MenuItem>
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Mode</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.complaint_mode_id || ''}
                                onChange={(e) => handleTicketMgmtInputChange('complaint_mode_id', e.target.value)}
                                label="Mode"
                                disabled={loadingComplaintModes}
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">
                                    {loadingComplaintModes ? 'Loading modes...' : 'Select mode'}
                                  </span>
                                </MenuItem>
                                {complaintModes.map((mode) => (
                                  <MenuItem key={mode.id} value={mode.id.toString()}>
                                    {mode.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                          </div>

                          {/* 3️⃣ RIGHT COLUMN - Template Fields */}
                          <div className="space-y-4">
                            {/* Root Cause Analysis */}
                            <div className="relative">
                              <label className="absolute -top-2 left-3 bg-white px-2 text-sm font-medium text-gray-700 z-10">
                                Root Cause Analysis
                              </label>
                              <Select
                                isMulti
                                value={communicationTemplates
                                  .filter(
                                    (t) =>
                                      t.identifier === 'Root Cause Analysis' && t.active === true &&
                                      ticketMgmtFormData.rca_template_ids.includes(t.id)
                                  )
                                  .map((t) => ({ value: t.id, label: t.identifier_action }))}
                                onChange={(selected) => {
                                  const selectedIds = selected ? selected.map((s) => s.value) : [];
                                  handleTicketMgmtInputChange('rca_template_ids', selectedIds);
                                  // Auto-save when dropdown changes
                                  handleRootCauseChange(selectedIds);
                                }}
                                options={communicationTemplates
                                  .filter((t) => t.identifier === 'Root Cause Analysis' && t.active)
                                  .map((t) => ({ value: t.id, label: t.identifier_action }))}
                                styles={customStyles}
                                components={{
                                  MultiValue: CustomMultiValue,
                                  MultiValueRemove: () => null,
                                }}
                                closeMenuOnSelect={false}
                                placeholder="Select Root Cause Analysis..."
                              />
                            </div>
                            {(ticketMgmtFormData.rca_template_ids && ticketMgmtFormData.rca_template_ids.length > 0) && (
                              <div
                                className="space-y-2 min-w-0 mt-4"
                                style={{ fontSize: "14px", fontWeight: "500" }}
                              >
                                {(() => {
                                  // Use template IDs from form data with duplicate filtering
                                  const uniqueIds = [...new Set(ticketMgmtFormData.rca_template_ids)];

                                  return uniqueIds.map((templateId, index) => {
                                    const matchedTemplate = communicationTemplates.find(
                                      (template) =>
                                        template.id === templateId &&
                                        template.identifier === "Root Cause Analysis"
                                    );

                                    if (!matchedTemplate) return null;

                                    return (
                                      <div
                                        key={`rca-display-${templateId}`}
                                        className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                      >
                                        {matchedTemplate.body || matchedTemplate.identifier_action}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            )}

                            {/* Additional Notes */}
                            <TextField
                              fullWidth
                              multiline
                              minRows={4}
                              label={
                                <span style={{ fontSize: '16px' }}>
                                  Additional Notes
                                </span>
                              }
                              placeholder="Enter Additional Notes"
                              value={ticketMgmtFormData.additional_notes}
                              onChange={(e) =>
                                handleTicketMgmtInputChange('additional_notes', e.target.value)
                              }
                              sx={{
                                mb: 3,
                                "& textarea": {
                                  width: "100% !important",   // force full width
                                  resize: "both",             // allow resizing
                                  overflow: "auto",
                                  boxSizing: "border-box",
                                  display: "block",
                                },
                                "& textarea[aria-hidden='true']": {
                                  display: "none !important", // hide shadow textarea
                                },
                              }}
                            />
                          </div>
                        </div>

                        {/* Additional Notes - Full Width */}
                        {/* <div className="mt-6">
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Additional Notes"
                            value={ticketMgmtFormData.additional_notes}
                            onChange={(e) =>
                              handleTicketMgmtInputChange('additional_notes', e.target.value)
                            }
                            sx={fieldStyles}
                          />
                        </div>
                        </div> */}


                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 justify-end mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditingTicketMgmt(false)}
                            disabled={submittingTicketMgmt}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submittingTicketMgmt}
                            className="bg-[#C72030] hover:bg-[#A01825] text-white px-8"
                          >
                            {submittingTicketMgmt ? 'Saving...' : 'Submit'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </Card>

                {/* Cost Involve */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9] rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <DollarSign className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Cost Involve
                      </h3>
                    </div>

                    {/* Slider Toggle (Yes / No) */}
                    <div className="flex items-center gap-2 text-[11px] font-medium select-none">
                      <span className={costInvolveEnabled ? "text-[#1A1A1A]" : "text-gray-400"}>
                        Yes
                      </span>
                      <div
                        role="switch"
                        aria-checked={costInvolveEnabled}
                        aria-label={costInvolveEnabled ? "Deactivate cost involve" : "Activate cost involve"}
                        tabIndex={0}
                        onClick={() => setCostInvolveEnabled(v => !v)}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setCostInvolveEnabled(v => !v)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C72030] ${costInvolveEnabled ? 'bg-[#C72030]' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${costInvolveEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </div>
                      <span className={!costInvolveEnabled ? "text-[#1A1A1A]" : "text-gray-400"}>
                        No
                      </span>
                    </div>
                  </div>

                  {/* Body (rendered only when active) */}
                  {costInvolveEnabled && (
                    <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-4 sm:px-5 pt-4 pb-6">
                      {/* Form Rows */}
                      {costRows.map((row) => (
                        <div key={row.id} className="mb-6 last:mb-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                              <TextField
                                label={
                                  <span style={{ fontSize: '14px' }}>
                                    Quotation <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                placeholder="Enter Quotation"
                                fullWidth
                                value={row.quotation}
                                onChange={e =>
                                  setCostRows(prev =>
                                    prev.map(r => r.id === row.id ? { ...r, quotation: e.target.value } : r)
                                  )
                                }
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                }}
                              />

                              <TextField
                                label={
                                  <span style={{ fontSize: '14px' }}>
                                    Cost <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                placeholder="Enter Cost"
                                type="text"
                                fullWidth
                                value={row.cost}
                                onChange={e => {
                                  const value = e.target.value;
                                  // Allow empty string
                                  if (value === '') {
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, cost: value } : r)
                                    );
                                    return;
                                  }
                                  // Validate: allow only numbers and up to 2 decimal places
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value) && Number(value) >= 0) {
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, cost: value } : r)
                                    );
                                  }
                                }}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                }}
                              />
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-4">
                              <FormControl
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                  '& .MuiInputLabel-root': {
                                    fontSize: '14px',
                                    '&.Mui-focused': {
                                      color: '#C72030',
                                    },
                                  },
                                }}
                              >
                                <InputLabel id={`vendor-label-${row.id}`}>
                                  <span style={{ fontSize: '14px' }}>
                                    Vendor <span style={{ color: "red" }}>*</span>
                                  </span>
                                </InputLabel>
                                <MuiSelect
                                  labelId={`vendor-label-${row.id}`}
                                  label="Vendor *"
                                  value={row.vendor_id}
                                  onChange={e => {
                                    const selectedVendorId = e.target.value;
                                    const selectedVendor = suppliers.find(s => s.id.toString() === selectedVendorId);
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? {
                                        ...r,
                                        vendor: selectedVendor?.company_name || '',
                                        vendor_id: selectedVendorId
                                      } : r)
                                    );
                                  }}
                                  disabled={loadingSuppliers}
                                  displayEmpty
                                >
                                  <MenuItem value="">
                                    <span style={{ color: '#aaa' }}>
                                      {loadingSuppliers ? 'Loading vendors...' : 'Select Vendor'}
                                    </span>
                                  </MenuItem>
                                  {suppliers.map((supplier) => (
                                    <MenuItem key={supplier.id} value={supplier.id.toString()}>
                                      {supplier.company_name || supplier.email}
                                    </MenuItem>
                                  ))}
                                </MuiSelect>
                              </FormControl>

                              {/* File Input for Attachments */}
                              <div>
                                <input
                                  type="file"
                                  id={`cost-file-input-${row.id}`}
                                  multiple
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={(e) => handleCostAttachmentChange(row.id, e)}
                                  style={{ display: 'none' }}
                                />
                                <label htmlFor={`cost-file-input-${row.id}`}>
                                  <MuiButton
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    startIcon={<Paperclip className="w-4 h-4" />}
                                    sx={{
                                      borderColor: '#DAD7D0',
                                      color: '#1A1A1A',
                                      textTransform: 'none',
                                      fontFamily: 'Work Sans, sans-serif',
                                      fontWeight: 500,
                                      borderRadius: '4px',
                                      padding: '10px 12px',
                                      backgroundColor: '#F2F2F2',
                                      justifyContent: 'flex-start',
                                      fontSize: '14px',
                                      '&:hover': {
                                        borderColor: '#C72030',
                                        backgroundColor: '#F2F2F2',
                                      },
                                    }}
                                  >
                                    {row.attachmentFiles.length > 0
                                      ? `${row.attachmentFiles.length} file(s) selected`
                                      : 'Choose Attachments'}
                                  </MuiButton>
                                </label>
                                {row.attachmentFiles.length > 0 && (
                                  <div className="mt-2 text-[11px] text-gray-600">
                                    {row.attachmentFiles.map((file, idx) => (
                                      <div key={idx} className="truncate">
                                        • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Column (Description) */}
                            <div className="space-y-4">
                              <div className="relative w-full">
                                <textarea
                                  id={`cost-description-${row.id}`}
                                  value={row.description}
                                  onChange={e =>
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r)
                                    )
                                  }
                                  rows={6}
                                  placeholder=" "
                                  className="peer block w-full appearance-none rounded border border-[#DAD7D0] bg-[#F2F2F2] px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[#C72030] 
      resize-vertical"
                                  style={{ fontSize: '14px' }}
                                />

                                <label
                                  htmlFor={`cost-description-${row.id}`}
                                  className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[#C72030]"
                                >
                                  Description <span style={{ color: "red" }}>*</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add / Remove Row Buttons */}
                      <div className="flex justify-end gap-4 mt-4 pr-2">
                        <button
                          type="button"
                          onClick={addCostRow}
                          className="text-[#C72030] text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-2"
                          title="Add Row"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={removeCostRow}
                          disabled={costRows.length <= 1}
                          className={`text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-2 ${costRows.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'text-[#C72030]'
                            }`}
                          title="Remove Row"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Submit Cost Approval Button */}
                      <div className="flex justify-center mt-6">
                        <button
                          type="button"
                          onClick={handleSubmitCostApproval}
                          disabled={submittingCostApproval}
                          className={`bg-[#C72030] text-white text-[13px] font-semibold px-8 py-2.5 rounded transition-colors ${submittingCostApproval
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#A01828]'
                            }`}
                        >
                          {submittingCostApproval ? 'Submitting...' : 'Submit Cost Approval'}
                        </button>
                      </div>

                      {/* Table - Display actual requests data from API */}
                      <div className="mt-6 border border-[#D9D9D9] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-[11px]">
                            <thead>
                              <tr className="bg-[#EDEAE3] text-[#1A1A1A] font-semibold">
                                {['Request Id', 'Amount', 'Comments', 'Created On', 'Created By', 'L1', 'L2', 'L3', 'L4', 'L5', 'Status'].map(h => (
                                  <th key={h} className="px-4 py-3 text-left border border-[#D2CEC4] whitespace-nowrap text-[12px]">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {ticketData.requests && ticketData.requests.length > 0 ? (
                                ticketData.requests.map(request => (
                                  <tr key={request.id} className="bg-white even:bg-[#FAFAF9] hover:bg-[#F6F4EE] transition-colors">
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A] font-medium">
                                      {request.id}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A] font-semibold">
                                      ₹{parseFloat(request.amount || '0').toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.comment || '-'}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.created_on}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.created_by}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L1 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L1 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L1 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L2 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L2 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L2 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L3 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L3 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L3 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L4 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L4 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L4 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L5 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L5 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L5 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC]">
                                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${request.master_status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : request.master_status === 'Approved'
                                          ? 'bg-green-100 text-green-700'
                                          : request.master_status === 'Rejected'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {request.master_status}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white">
                                  <td colSpan={11} className="px-4 py-6 border border-[#E5E2DC] text-gray-500 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <DollarSign className="w-8 h-8 text-gray-300" />
                                      <span className="text-sm">No cost approval requests found</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Ticket Closure (Figma-aligned) */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Ticket Closure
                      </h3>

                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-[12px] border-[#D9D9D9] hover:bg-[#F6F4EE]"
                    // onClick={handleUpdate}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FFFDFB] border border-t-0 border-[#D9D9D9] px-6 py-6">
                    {/* Two row / two column panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Preventive Action */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Preventive Action
                          </label>

                          {/* React Select */}
                          <Select
                            value={getPreventiveActionValues()}
                            onChange={(selectedOptions) => {
                              handlePreventiveActionChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Preventive Action" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Preventive Action"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.preventive_action_template_ids || ticketData.preventive_action_template_ids.length === 0) {
                              return 'No preventive action description available';
                            }

                            const uniqueIds = [...new Set(ticketData.preventive_action_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Preventive Action"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No preventive action description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`preventive-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Short-term Impact */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Short-term Impact
                          </label>

                          {/* React Select */}
                          <Select
                            value={getShortTermImpactValues()}
                            onChange={(selectedOptions) => {
                              handleShortTermImpactChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Short-term Impact" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Short-term Impact"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.short_term_impact_template_ids || ticketData.short_term_impact_template_ids.length === 0) {
                              return 'No short-term impact description available';
                            }

                            const uniqueIds = [...new Set(ticketData.short_term_impact_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Short-term Impact"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No short-term impact description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`short-term-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Corrective Action */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Corrective Action
                          </label>

                          {/* React Select */}
                          <Select
                            value={getCorrectiveActionValues()}
                            onChange={(selectedOptions) => {
                              handleCorrectiveActionChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Corrective Action" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Corrective Action"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.corrective_action_template_ids || ticketData.corrective_action_template_ids.length === 0) {
                              return 'No corrective action description available';
                            }

                            const uniqueIds = [...new Set(ticketData.corrective_action_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Corrective Action"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No corrective action description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`corrective-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Long-term Impact */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Long-term Impact
                          </label>

                          {/* React Select */}
                          <Select
                            value={getLongTermImpactValues()}
                            onChange={(selectedOptions) => {
                              handleLongTermImpactChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Long-term Impact" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Long-term Impact"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.long_term_impact_template_ids || ticketData.long_term_impact_template_ids.length === 0) {
                              return 'No long-term impact description available';
                            }

                            const uniqueIds = [...new Set(ticketData.long_term_impact_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Long-term Impact"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No long-term impact description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`long-term-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Review Date & Responsible Person */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                      <div className="flex items-start text-[12px]">
                        <span className="w-[120px] text-[#6B6B6B]">Review Date</span>
                        <span className="ml-4 font-semibold text-[#1A1A1A]">
                          {ticketData.review_tracking
                            ? ticketData.review_tracking
                            : '-'}
                        </span>
                      </div>
                      <div>
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Responsible Person
                          </label>

                          {/* React Select */}
                          <Select
                            value={(() => {
                              const value = getResponsiblePersonValue();
                              if (!value) return null;
                              const matchedPerson = responsiblePersons.find(
                                p => p.id.toString() === value
                              );
                              return matchedPerson ? {
                                value: matchedPerson.id,
                                label: `${matchedPerson.full_name}${matchedPerson.employee_type ? ` (${matchedPerson.employee_type})` : ''}`
                              } : null;
                            })()}
                            onChange={(selectedOption) => {
                              if (selectedOption && 'value' in selectedOption) {
                                handleResponsiblePersonChange(selectedOption.value.toString());
                              }
                            }}
                            options={responsiblePersons.map((person) => ({
                              value: person.id,
                              label: `${person.full_name}${person.employee_type ? ` (${person.employee_type})` : ''}`,
                            }))}
                            placeholder={loadingResponsiblePersons ? "Loading..." : "Select Responsible Person"}
                            styles={singleSelectStyles}
                            isDisabled={loadingResponsiblePersons}
                            isClearable
                          />
                        </div>

                        {/* Show current value if it doesn't match any option */}
                        {ticketData.responsible_person &&
                          !responsiblePersons.find(p => p.full_name === ticketData.responsible_person) && (
                            <div className="mt-1 text-[11px] text-[#6B6B6B] italic">
                              Current: {ticketData.responsible_person}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <MapPin className="w-6 h-6" style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-black">
                      Location Details
                    </h3>
                  </div>

                  <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <div className="relative w-full px-4">
                      <div
                        className="absolute top-[38px] left-0 right-0 h-0.5 bg-[#C72030] z-0"
                        style={{
                          left: `calc(9%)`,
                          right: `calc(9%)`,
                        }}
                      />

                      <div className="flex justify-between items-start relative z-1">
                        {[
                          { label: "Site", value: ticketData.site_name || "-" },
                          { label: "Building", value: ticketData.building_name || "-" },
                          { label: "Wing", value: ticketData.wing_name || "-" },
                          { label: "Floor", value: ticketData.floor_name || "-" },
                          { label: "Area", value: ticketData.area_name || "-" },
                          { label: "Room", value: ticketData.room_name || "-" },
                        ].map((item, index) => (
                          <div
                            key={`location-${index}`}
                            className="flex flex-col items-center w-full text-center"
                          >
                            <div className="text-sm text-gray-500 mb-2 mt-1">
                              {item.label}
                            </div>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-1" />
                            <div className="mt-2 text-base font-medium text-[#1A1A1A] break-words px-2">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {ticketData.documents && (
                  <Card className="w-full bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <Paperclip className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Attachments
                      </h3>
                    </div>

                    <CardContent className="pt-4 bg-[#FAFAF8] border border-t-0 border-[#D9D9D9]">
                      {Array.isArray(ticketData.documents) && ticketData.documents.length > 0 ? (
                        <div className="flex items-center flex-wrap gap-4">
                          {ticketData.documents.map((attachment: any, idx: number) => {
                            const url = attachment.document || attachment.document_url || attachment.url || attachment.attachment_url || '';
                            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
                            const isPdf = /\.pdf$/i.test(url) || attachment.doctype === 'application/pdf';
                            const isExcel = /\.(xls|xlsx|csv)$/i.test(url) ||
                              attachment.doctype?.includes('spreadsheet') ||
                              attachment.doctype?.includes('excel');
                            const isWord = /\.(doc|docx)$/i.test(url) ||
                              attachment.doctype?.includes('document') ||
                              attachment.doctype?.includes('word');
                            const isDownloadable = isPdf || isExcel || isWord;

                            return (
                              <div
                                key={attachment.id || idx}
                                className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                              >
                                {isImage ? (
                                  <>
                                    <button
                                      className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                      title="View"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      type="button"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <img
                                      src={url}
                                      alt={attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`}
                                      className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </>
                                ) : isPdf ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : isExcel ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                    <FileSpreadsheet className="w-6 h-6" />
                                  </div>
                                ) : isWord ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                    <File className="w-6 h-6" />
                                  </div>
                                )}
                                <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                  {attachment.document_name ||
                                    attachment.document_file_name ||
                                    url.split('/').pop() ||
                                    `Document_${attachment.id || idx + 1}`}
                                </span>
                                {isDownloadable && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: attachment.id || 0,
                                        document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                        url: url,
                                        document_url: url,
                                        document: url,
                                      });
                                      setShowImagePreview(true);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No attachments</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {isModalOpen && selectedDoc && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <div
                      className="max-w-4xl max-h-[90vh] bg-white rounded-lg p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold truncate">
                          {selectedDoc.document_name ||
                            selectedDoc.document_file_name ||
                            selectedDoc.url?.split('/').pop() ||
                            `Document_${selectedDoc.id}`}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!selectedDoc.id) {
                                toast.error('Unable to download: No document ID found');
                                return;
                              }

                              try {
                                const { API_CONFIG } = await import('@/config/apiConfig');
                                const baseUrl = API_CONFIG.BASE_URL;
                                const token = localStorage.getItem('token');

                                const cleanBaseUrl = baseUrl
                                  .replace(/^https?:\/\//, '')
                                  .replace(/\/$/, '');
                                const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${selectedDoc.id}?show_file=true`;

                                const response = await fetch(downloadUrl, {
                                  method: 'GET',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: '*/*',
                                  },
                                  mode: 'cors',
                                });

                                if (response.ok) {
                                  const blob = await response.blob();
                                  const fileExtension =
                                    selectedDoc.doctype?.split('/').pop() ||
                                    selectedDoc.url?.split('.').pop()?.toLowerCase() ||
                                    'file';
                                  const documentName = `document_${selectedDoc.id}.${fileExtension}`;

                                  const url = window.URL.createObjectURL(blob);
                                  const link = window.document.createElement('a');
                                  link.href = url;
                                  link.download = documentName;
                                  link.style.display = 'none';
                                  window.document.body.appendChild(link);
                                  link.click();

                                  setTimeout(() => {
                                    window.document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  }, 100);

                                  toast.success('File downloaded successfully');
                                } else {
                                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                }
                              } catch (error) {
                                console.error('Error downloading file:', error);
                                toast.error(`Failed to download: ${error.message}`);
                              }
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Close
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-[70vh] overflow-auto">
                        {selectedDoc.type === 'image' ? (
                          <img
                            src={selectedDoc.url}
                            alt={selectedDoc.document_name || 'Document'}
                            className="max-w-full h-auto rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              (target.nextSibling as HTMLElement).style.display = 'block';
                            }}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">
                              Preview not available for this file type
                            </p>
                            <Button
                              onClick={async () => {
                                // Same download logic as above
                                if (!selectedDoc.id) {
                                  toast.error('Unable to download: No document ID found');
                                  return;
                                }

                                try {
                                  const { API_CONFIG } = await import('@/config/apiConfig');
                                  const baseUrl = API_CONFIG.BASE_URL;
                                  const token = localStorage.getItem('token');

                                  const cleanBaseUrl = baseUrl
                                    .replace(/^https?:\/\//, '')
                                    .replace(/\/$/, '');
                                  const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${selectedDoc.id}?show_file=true`;

                                  const response = await fetch(downloadUrl, {
                                    method: 'GET',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Accept: '*/*',
                                    },
                                    mode: 'cors',
                                  });

                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const fileExtension =
                                      selectedDoc.doctype?.split('/').pop() ||
                                      selectedDoc.url?.split('.').pop()?.toLowerCase() ||
                                      'file';
                                    const documentName = `document_${selectedDoc.id}.${fileExtension}`;

                                    const url = window.URL.createObjectURL(blob);
                                    const link = window.document.createElement('a');
                                    link.href = url;
                                    link.download = documentName;
                                    link.style.display = 'none';
                                    window.document.body.appendChild(link);
                                    link.click();

                                    setTimeout(() => {
                                      window.document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    }, 100);

                                    toast.success('File downloaded successfully');
                                  } else {
                                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                  }
                                } catch (error) {
                                  console.error('Error downloading file:', error);
                                  toast.error(`Failed to download: ${error.message}`);
                                }
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download File
                            </Button>
                          </div>
                        )}
                        <div className="hidden text-center py-8 text-gray-500">
                          Failed to load preview
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <MessageSquare className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Comments
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FAFAF8]">
                    <div className="flex flex-col md:flex-row gap-3 px-2">
                      {/* Internal Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5 bg-[#fafafa] border-[#D9D9D9]">
                          <h4 className="text-[18px] font-regular text-[#000000]">Internal</h4>
                        </div>

                        <div className="mt-4 ml-2">
                          {/* Template Dropdown */}
                          <div className="mb-3">
                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                              <InputLabel shrink>Template</InputLabel>
                              <MuiSelect
                                label="Template"
                                notched
                                displayEmpty
                                value={selectedInternalTemplate}
                                onChange={(e) => {
                                  const templateId = e.target.value;
                                  setSelectedInternalTemplate(templateId);
                                  // Auto-populate the textarea with the selected template's body
                                  if (templateId) {
                                    const selectedTemplateData = communicationTemplates.find(t => t.id === templateId);
                                    setInternalCommentText(selectedTemplateData?.body || '');
                                  } else {
                                    setInternalCommentText('');
                                  }
                                }}
                                disabled={loadingTemplates}
                                sx={{
                                  fontSize: '11px',
                                  height: '40px',
                                }}
                              >
                                <MenuItem value="">
                                  <span style={{ color: '#aaa' }}>
                                    {loadingTemplates ? 'Loading templates...' : 'Select Template'}
                                  </span>
                                </MenuItem>
                                {communicationTemplates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.identifier_action}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>
                          </div>

                          {/* Comment Input */}
                          <div className="mb-4">
                            <div className="relative w-full">
                              <textarea
                                id="internal-comment"
                                value={internalCommentText}
                                onChange={(e) => setInternalCommentText(e.target.value)}
                                rows={4}
                                placeholder=" "
                                className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[rgb(25,118,210)] 
      resize-vertical"
                              />

                              <label
                                htmlFor="internal-comment"
                                className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
                              >
                                Add comment
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Show selected files */}
                        {internalAttachments.length > 0 && (
                          <div className="mb-2 text-[11px] text-gray-600 ml-2">
                            <strong>Selected files:</strong>
                            <ul className="list-disc pl-5">
                              {internalAttachments.map((file, idx) => (
                                <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Add Attachment Button */}
                        <input
                          type="file"
                          id="internal-file-input"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleInternalFileChange}
                          style={{ display: 'none' }}
                        />
                        <MuiButton
                          variant="outlined"
                          component="label"
                          htmlFor="internal-file-input"
                          sx={{
                            marginLeft: '8px',
                            borderColor: '#C72030',
                            color: '#C72030',
                            textTransform: 'none',
                            fontFamily: 'Work Sans, sans-serif',
                            fontWeight: 500,
                            borderRadius: '0',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#B8252F',
                              backgroundColor: 'rgba(199, 32, 48, 0.04)',
                            },
                          }}
                        >
                          Add Attachment
                        </MuiButton>
                      </div>

                      {/* Customer Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5 bg-[#fafafa] border-[#D9D9D9]">
                          <h4 className="text-[18px] font-regular text-[#000000]">Customer</h4>
                        </div>

                        <div className="mt-4 mr-2">


                          {/* Template Dropdown */}
                          <div className="mb-3">
                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                              <InputLabel shrink>Template</InputLabel>
                              <MuiSelect
                                label="Template"
                                notched
                                displayEmpty
                                value={selectedCustomerTemplate}
                                onChange={(e) => {
                                  const templateId = e.target.value;
                                  setSelectedCustomerTemplate(templateId);
                                  // Auto-populate the textarea with the selected template's body
                                  if (templateId) {
                                    const selectedTemplateData = communicationTemplates.find(t => t.id === templateId);
                                    setCommentText(selectedTemplateData?.body || '');
                                  } else {
                                    setCommentText('');
                                  }
                                }}
                                disabled={loadingTemplates}
                                sx={{
                                  fontSize: '11px',
                                  height: '40px',
                                }}
                              >
                                <MenuItem value="">
                                  <span style={{ color: '#aaa' }}>
                                    {loadingTemplates ? 'Loading templates...' : 'Select Template'}
                                  </span>
                                </MenuItem>
                                {communicationTemplates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.identifier_action}
                                  </MenuItem>
                                ))}
                                {communicationTemplates
                                  .filter(template => template.active === true)
                                  .map((template) => (
                                    <MenuItem key={template.id} value={template.id}>
                                      {template.identifier_action}
                                    </MenuItem>
                                  ))
                                }
                              </MuiSelect>
                            </FormControl>
                          </div>

                          {/* Comment Input */}
                          <div className="mb-4">
                            <div className="relative w-full">
                              <textarea
                                id="customer-comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={4}
                                placeholder=" "
                                className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[rgb(25,118,210)] 
      resize-vertical"
                              />

                              <label
                                htmlFor="customer-comment"
                                className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
                              >
                                Add customer comment
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Show selected files */}
                        {customerAttachments.length > 0 && (
                          <div className="mb-2 text-[11px] text-gray-600 mr-2">
                            <strong>Selected files:</strong>
                            <ul className="list-disc pl-5">
                              {customerAttachments.map((file, idx) => (
                                <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Add Attachment Button */}
                        <input
                          type="file"
                          id="customer-file-input"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleCustomerFileChange}
                          style={{ display: 'none' }}
                        />
                        <MuiButton
                          variant="outlined"
                          component="label"
                          htmlFor="customer-file-input"
                          sx={{
                            borderColor: '#C72030',
                            color: '#C72030',
                            textTransform: 'none',
                            fontFamily: 'Work Sans, sans-serif',
                            fontWeight: 500,
                            borderRadius: '0',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#B8252F',
                              backgroundColor: 'rgba(199, 32, 48, 0.04)',
                            },
                          }}
                        >
                          Add Attachment
                        </MuiButton>
                      </div>
                    </div>

                    {/* Submit Comment Button (centered) */}
                    <div className="flex justify-center mt-6 pb-6">
                      <button
                        type="button"
                        onClick={handleSubmitComment}
                        disabled={submittingComment}
                        className={`bg-[#C72030] text-white text-[12px] font-medium px-6 py-2 transition-colors ${submittingComment
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#A01828]'
                          }`}
                      >
                        {submittingComment ? 'Submitting...' : 'Submit Comment'}
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Logs Card – Adjusted Alignment */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <div className="w-6 h-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 26" fill="none">
                            <path d="M9 25.0908H2C1.73478 25.0908 1.48043 24.9644 1.29289 24.7394C1.10536 24.5143 1 24.2091 1 23.8908V2.29082C1 1.97256 1.10536 1.66734 1.29289 1.44229C1.48043 1.21725 1.73478 1.09082 2 1.09082H16C16.2652 1.09082 16.5196 1.21725 16.7071 1.44229C16.8946 1.66734 17 1.97256 17 2.29082V13.0908M14.75 25.0908V17.2908" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 19.0908L12.8333 18.4242L14.5 17.0908L16.1667 18.4242L17 19.0908" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 8.09082H13M5 13.0908H9" stroke="#C72030" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Logs
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FAFAF8] relative px-6 pt-6 pb-8 pl-8">
                    {complaintLogs.length === 0 ? (
                      <div className="text-xs text-gray-400">No logs available</div>
                    ) : (
                      (() => {
                        const sorted = [...complaintLogs].sort(
                          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        );

                        return (
                          <>
                            <div className="pl-8 pt-2 relative">
                              {/* Vertical Progress Line */}
                              <div className="flex ml-1 mt-[-10px] mb-4 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="26" viewBox="0 0 18 26" fill="none">
                                  <path d="M9 25.0908H2C1.73478 25.0908 1.48043 24.9644 1.29289 24.7394C1.10536 24.5143 1 24.2091 1 23.8908V2.29082C1 1.97256 1.10536 1.66734 1.29289 1.44229C1.48043 1.21725 1.73478 1.09082 2 1.09082H16C16.2652 1.09082 16.5196 1.21725 16.7071 1.44229C16.8946 1.66734 17 1.97256 17 2.29082V13.0908M14.75 25.0908V17.2908" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M12 19.0908L12.8333 18.4242L14.5 17.0908L16.1667 18.4242L17 19.0908" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M5 8.09082H13M5 13.0908H9" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <h4 style={{ marginLeft: '8px', fontWeight: '500', color: '#C72030' }}>Logs</h4>
                              </div>

                              {/* Container for dots and line */}
                              <div className="relative">
                                {/* Vertical line - stops before the last dot */}
                                {sorted.length > 1 && (
                                  <div
                                    className="absolute left-[13px] top-0 w-[2px] bg-[#C72030]"
                                    style={{
                                      height: `calc(100% - ${sorted.length > 0 ? '48px' : '0px'})`
                                    }}
                                  />
                                )}

                                <div className="space-y-6">
                                  {sorted.map((log, i) => {
                                    const isLast = i === sorted.length - 1;
                                    const currentDate = formatLogDate(log.created_at);
                                    const previousDate = i > 0 ? formatLogDate(sorted[i - 1].created_at) : null;
                                    const showDate = currentDate !== previousDate;

                                    return (
                                      <div key={log.id || i} className="relative flex items-start gap-3">
                                        {/* Dot aligned exactly on line */}
                                        <div className="relative">
                                          <span
                                            className={`block w-3 h-3 rounded-full border-2 ml-2 bg-[#C72030] border-[#C72030]`}
                                          />
                                        </div>

                                        {/* Log Content */}
                                        <div className="text-[12px] leading-snug">
                                          {/* Date on top - only show if different from previous log */}
                                          {showDate && (
                                            <div className="text-[#1A1A1A] text-[16px] font-semibold mb-1">
                                              {currentDate}
                                            </div>
                                          )}

                                          {/* Time, Status, and By on same line */}
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[#6B6B6B] text-[12px]">
                                              {formatLogTime(log.created_at)}
                                            </span>
                                            <span className="font-semibold text-[#1A1A1A] text-[16px]">
                                              {log.log_status === null || log.log_status === undefined || log.log_status === '' ? 'Status Changed' : log.log_status}
                                            </span>
                                            {log.log_by && (
                                              <span className="text-[#1A1A1A] text-[16px]">
                                                By <span className="text-[#1A1A1A]">{log.log_by}</span>
                                              </span>
                                            )}
                                          </div>

                                          {/* Comment below */}
                                          {log.log_comment && (
                                            <div className="text-[#2C2C2C] text-[16px] leading-[20px]">
                                              {log.log_comment}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="details" className="space-y-8 p-6">

                <div className="space-y-6">
                  {/* Check if there's any ticket data to display */}
                  {hasData(ticketData.heading) ||
                    hasData(ticketData.issue_status) ||
                    hasData(ticketData.sub_category_type) ||
                    hasData(ticketData.created_by_name) ||
                    hasData(ticketData.created_date) ||
                    hasData(ticketData.created_time) ||
                    hasData(ticketData.created_at) ||
                    hasData(ticketData.category_type) ||
                    hasData(ticketData.ticket_number) ||
                    hasData(ticketData.updated_by) ||
                    hasData(ticketData.complaint_mode) ||
                    hasData(ticketData.priority) ||
                    hasData(ticketData.external_priority) ||
                    hasData(ticketData.priority_status) ||
                    hasData(ticketData.effective_priority) ||
                    hasData(ticketData.assigned_to) ? (


                    <Card className="w-full">
                      <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                        <div style={{ width: '40px', height: '40px' }} className="rounded-full flex items-center justify-center bg-[#E5E0D3]">
                          <Ticket className="w-5 h-5" style={{ color: '#C72030' }} />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-black">
                          Ticket Details
                        </h3>
                      </div>
                      <div className="px-6 bg-[#dfd9cb]">
                        <div className="flex justify-between py-4 border-b border-[#dfd9cb]">
                          <div className='w-full '>
                            <div className="">
                              <div className="flex items-start mb-4">
                                <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Description</span>
                                <span className="text-gray-900 font-medium break-words overflow-wrap-anywhere" style={{ fontSize: '14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                  {ticketData.heading || 'No description available'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="">
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>
                                      {ticketData.category_type || '-'}
                                    </span>
                                  </div>
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[110px]" style={{ fontSize: '14px' }}>Sub Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>
                                      {ticketData.sub_category_type || '-'}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-white p-4" style={{ width: '75%', borderRadius: '4px' }}>
                                  <div className="grid grid-cols-3 w-full items-center gap-4">
                                    {tatGridRows.flat().map((cell, idx) => {
                                      // Determine column alignment
                                      const colAlign =
                                        idx % 3 === 0
                                          ? 'justify-start'
                                          : idx % 3 === 1
                                            ? 'justify-center'
                                            : 'justify-end';

                                      return (
                                        <div
                                          key={idx}
                                          className={`flex ${colAlign} w-full`}
                                        >
                                          {/* Inner flex box for key-value pair with fixed key width and 20px gap */}
                                          <div className="flex items-center gap-[20px]">
                                            {/* Fixed width label to align values */}
                                            <span className="text-[14px] text-gray-500 whitespace-nowrap" style={{ minWidth: cell.label === 'Response TAT' ? '90px' : '5px' }}>
                                              {cell.label}
                                            </span>

                                            {/* Dynamic value */}
                                            <span
                                              className={`text-[13px] md:text-[14px] font-semibold whitespace-nowrap ${cell.isExceeded && cell.label === 'Balance TAT'
                                                ? 'text-red-600'
                                                : 'text-gray-900'
                                                }`}
                                            >
                                              {cell.isExceeded && cell.label === 'Balance TAT'
                                                ? 'Exceeded'
                                                : cell.value}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-around" style={{ textAlign: 'center', marginLeft: '20px' }}>
                            <button className='w-full py-1 bg-black rounded-full text-white mb-2 text-xs px-3'>
                              {ticketData.issue_status || '-'}
                            </button>
                            <div className='mb-2'>
                              <button className='w-full py-1 bg-[#FFCFCF] rounded-full text-[#C72030] text-xs px-3 font-semibold'>
                                {getPriorityLabel(ticketData.priority)}
                              </button>
                            </div>
                            <div className="flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <mask id="mask0_9118_15345" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="0" width="20" height="23">
                                  <path d="M12 21.9995C16.6945 21.9995 20.5 18.194 20.5 13.4995C20.5 8.80501 16.6945 4.99951 12 4.99951C7.3055 4.99951 3.5 8.80501 3.5 13.4995C3.5 18.194 7.3055 21.9995 12 21.9995Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                  <path d="M15.5 1.99951H8.5M19 4.99951L17.5 6.49951" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M12 9V13.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </mask>
                                <g mask="url(#mask0_9118_15345)">
                                  <path d="M0 0H24V24H0V0Z" fill="#434343" />
                                </g>
                              </svg>
                              <span style={{ fontSize: '16px', fontWeight: 600 }} className="text-black ml-1">
                                {formatTicketAgeing(currentAgeing)}
                              </span>
                            </div>
                            <div className="flex justify-center items-center gap-2 mb-2">
                              {ticketData.is_executive_ecalation === true && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                <path d="M12.36 9.76C14.31 10.42 16 11.5 16 13V18H0V13C0 11.5 1.69 10.42 3.65 9.76L4.27 11L4.5 11.5C3 11.96 1.9 12.62 1.9 13V16.1H6.12L7 11.03L6.06 9.15C6.68 9.08 7.33 9.03 8 9.03C8.67 9.03 9.32 9.08 9.94 9.15L9 11.03L9.88 16.1H14.1V13C14.1 12.62 13 11.96 11.5 11.5L11.73 11L12.36 9.76ZM8 2C6.9 2 6 2.9 6 4C6 5.1 6.9 6 8 6C9.1 6 10 5.1 10 4C10 2.9 9.1 2 8 2ZM8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0C10.21 0 12 1.79 12 4C12 6.21 10.21 8 8 8Z" fill="black" />
                              </svg>)}
                              {ticketData.is_golden_ticket && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                                  <path d="M17.6219 20.0977C17.5715 20.0977 17.5214 20.085 17.4765 20.0585L10.9967 16.2938L4.5084 20.0459C4.46385 20.0719 4.41384 20.0844 4.36383 20.0844C4.3057 20.0844 4.24792 20.0676 4.19919 20.0329C4.10788 19.9695 4.06564 19.8599 4.09105 19.7548L5.82438 12.6847L0.0968238 7.92979C0.011544 7.85906 -0.0211751 7.74629 0.013865 7.64365C0.0486731 7.54111 0.144281 7.4686 0.256711 7.45937L7.80786 6.85484L10.756 0.164147C10.7997 0.0643917 10.9014 0 11.0139 0C11.0141 0 11.0143 0 11.0143 0C11.127 0 11.2288 0.0649467 11.2721 0.164479L14.2058 6.86118L21.7552 7.48095C21.8678 7.49029 21.9631 7.56302 21.9981 7.66555C22.0328 7.7682 22 7.88108 21.9144 7.95136L16.1762 12.6948L17.8943 19.7686C17.9202 19.8736 17.8774 19.983 17.7858 20.0464C17.7373 20.0806 17.6793 20.0977 17.6219 20.0977Z" fill="url(#paint0_radial_9118_15308)" />
                                  <path d="M17.6229 19.896C17.6103 19.896 17.5977 19.8926 17.5864 19.8862L10.998 16.0584L4.40068 19.8732C4.38954 19.8795 4.37736 19.8826 4.36471 19.8826C4.35021 19.8826 4.3357 19.879 4.32352 19.8696C4.30055 19.8541 4.2901 19.8267 4.2966 19.8006L6.05905 12.6117L0.235078 7.77705C0.213845 7.75947 0.205725 7.73112 0.214311 7.7052C0.223361 7.67996 0.247029 7.66172 0.275107 7.65972L7.95284 7.04474L10.9502 0.241834C10.9614 0.216923 10.9866 0.200684 11.0147 0.200684C11.0147 0.200684 11.0147 0.200684 11.0149 0.200684C11.0432 0.200684 11.0685 0.217032 11.0794 0.241943L14.062 7.05063L21.7385 7.68085C21.7665 7.68307 21.7902 7.70121 21.7992 7.72701C21.8076 7.75281 21.7994 7.78105 21.7783 7.7984L15.9439 12.6213L17.6909 19.8137C17.6973 19.8397 17.6862 19.8674 17.6638 19.883C17.6512 19.8916 17.6371 19.896 17.6229 19.896Z" fill="url(#paint1_linear_9118_15308)" />
                                  <path d="M7.99743 7.10811L11.0112 0.268066L14.0103 7.11412L21.7291 7.7479L15.8627 12.5975L17.6192 19.8291L10.9944 15.9802L4.36114 19.8159L6.13322 12.5877L0.277344 7.72644L7.99743 7.10811Z" fill="url(#paint2_linear_9118_15308)" />
                                  <path d="M11.1891 11.551C11.1439 11.4959 11.0748 11.4633 11.0016 11.4633C11.0013 11.4633 11.0013 11.4633 11.0009 11.4633C10.928 11.4633 10.8587 11.4956 10.8138 11.5507L8.37693 14.534L10.5906 11.395C10.6317 11.3368 10.6425 11.2637 10.6201 11.197C10.5972 11.1303 10.5441 11.0772 10.4752 11.053L6.76172 9.75321L10.5606 10.8015C10.5824 10.8077 10.6044 10.8107 10.6263 10.8107C10.6762 10.8107 10.7253 10.7958 10.7663 10.7672C10.8257 10.7258 10.8619 10.6606 10.8644 10.5904L11.0063 6.80371L11.1405 10.5907C11.143 10.6611 11.179 10.7263 11.2382 10.7677C11.2793 10.7962 11.3287 10.8113 11.3782 10.8113C11.4 10.8113 11.4222 10.8084 11.4438 10.8026L15.245 9.76189L11.5286 11.054C11.4599 11.0783 11.4064 11.1311 11.3835 11.1977C11.3608 11.2647 11.3714 11.3376 11.4124 11.396L13.6195 14.5391L11.1891 11.551Z" fill="white" />
                                  <path d="M10.6435 10.0628L8.08027 6.91957L11.0111 0.267578L10.6435 10.0628ZM21.7289 7.74752H21.7291L14.2765 7.13554L11.9655 10.4201L21.7289 7.74752ZM9.90642 11.0964L0.277344 7.72606L5.98598 12.4647L9.90642 11.0964ZM11.961 11.7709L17.6192 19.8288L15.9261 12.8597L11.961 11.7709ZM4.36114 19.8153L10.7915 16.0971L10.6454 12.1225L4.36114 19.8153Z" fill="url(#paint3_linear_9118_15308)" />
                                  <path d="M11.3577 10.0658L11.0112 0.267578L13.9241 6.91623L11.3577 10.0658ZM7.72152 7.12998L0.277344 7.72606L10.0372 10.4191L7.72152 7.12998ZM21.7289 7.74752L12.0992 11.0962L16.0235 12.464L21.7289 7.74752ZM11.2154 16.1082L17.6191 19.8288L11.3594 12.1331L11.2154 16.1082ZM10.0325 11.7743L6.06523 12.8657L4.36126 19.8154V19.8152L10.0325 11.7743Z" fill="url(#paint4_linear_9118_15308)" />
                                  <defs>
                                    <radialGradient id="paint0_radial_9118_15308" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.0059 10.0489) scale(10.7481 10.3019)">
                                      <stop stopColor="#D08B01" />
                                      <stop offset="0.5758" stopColor="#F2B145" />
                                      <stop offset="1" stopColor="#F8F3BC" />
                                    </radialGradient>
                                    <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#F6DB89" />
                                      <stop offset="1" stopColor="#F8F7DA" />
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#ED9017" />
                                      <stop offset="0.1464" stopColor="#F09F23" />
                                      <stop offset="0.4262" stopColor="#F6C642" />
                                      <stop offset="0.4945" stopColor="#F8D04A" />
                                      <stop offset="1" stopColor="#F6E6B5" />
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#ED9017" />
                                      <stop offset="0.1464" stopColor="#F09F23" />
                                      <stop offset="0.4262" stopColor="#F6C642" />
                                      <stop offset="0.4945" stopColor="#F8D04A" />
                                      <stop offset="1" stopColor="#F6E6B5" />
                                    </linearGradient>
                                    <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#DF8D00" />
                                      <stop offset="0.0848" stopColor="#FFD006" />
                                      <stop offset="0.2242" stopColor="#F4AD06" />
                                      <stop offset="0.85" stopColor="#F4AD06" />
                                      <stop offset="0.8777" stopColor="#F2A807" />
                                      <stop offset="0.9093" stopColor="#EC9B09" />
                                      <stop offset="0.9428" stopColor="#E2840D" />
                                      <stop offset="0.9773" stopColor="#D46412" />
                                      <stop offset="1" stopColor="#C94B16" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              )}
                              {ticketData.is_flagged && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                                  <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        {[
                          [
                            { label: 'Issue Type', value: ticketData.issue_type || '-' },
                            { label: 'Assigned To', value: ticketData.assigned_to || '-' },
                            { label: 'Behalf Of', value: ticketData.on_behalf_of || '-' },
                            { label: 'Association', value: ticketData.service_or_asset || '-' },
                          ],
                          [
                            { label: 'Created By', value: ticketData.created_by_name || '-' },
                            { label: 'Updated By', value: ticketData.updated_by || '-' },
                            { label: 'Mode', value: ticketData.complaint_mode || '-' },
                            { label: 'Identification', value: ticketData.proactive_reactive || '-' },
                          ],
                        ].map((row, rIdx) => (
                          <div
                            key={rIdx}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                          >
                            {row
                              .filter(f => hasData(f.value))
                              .map(field => (
                                <div key={field.label} className="mb-4">
                                  <div className="flex">
                                    <div className="w-[120px] text-[14px] leading-tight text-gray-500 tracking-wide pr-2">
                                      {field.label}
                                    </div>
                                    <div className="text-[14px] font-semibold text-gray-900">
                                      {field.value}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    /* No Data Available Message */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No Data Available
                      </h3>
                      <p className="text-gray-400 max-w-sm">
                        There is no ticket information available to display at this
                        time.
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <ClipboardList className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Association
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                      {[
                        { label: 'Asset Name', value: ticketData.asset_or_service_name || '-' },
                        { label: 'Group', value: ticketData.asset_group || '-' },
                        { label: 'Status', value: ticketData.amc?.amc_status || '-' },
                        { label: 'Criticality', value: ticketData.asset_criticality ? 'Critical' : 'Non Critical' },

                        { label: 'Asset ID', value: ticketData.pms_asset_id || ticketData.asset_or_service_id || '-' },
                        { label: 'Sub group', value: ticketData.asset_sub_group || '-' },
                        { label: 'AMC Status', value: ticketData.amc?.amc_status || '-' },
                        { label: 'Under Warranty', value: ticketData.warranty ? 'Yes' : 'No' },

                        { label: 'Category', value: ticketData.asset_type_category || '-' },
                        { label: 'Allocated', value: ticketData.assigned_to || '-' },
                        { label: 'AMC Type', value: 'Comprehensive' },
                        { label: 'Warranty Expiry', value: ticketData.asset_warranty_expiry ? new Date(ticketData.asset_warranty_expiry).toLocaleDateString('en-GB') : '-' },
                      ].map(field => (
                        <div key={field.label} className="flex items-start">
                          <div className="w-[140px] text-[14px] leading-tight text-gray-500 tracking-wide flex-shrink-0">
                            {field.label}
                          </div>
                          <div className="text-[14px] font-semibold text-gray-900 flex-1">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header (consistent) */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Ticket Management
                      </h3>
                      {ticketData.closure_date === null || ticketData.closure_date === undefined || ticketData.closure_date === '' && (
                        <span className="w-2 h-2 rounded-full bg-[#4BE2B9]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {ticketData.is_golden_ticket && (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#EDEAE3]"
                          title="Favourite"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                            <path d="M17.6219 20.0977C17.5715 20.0977 17.5214 20.085 17.4765 20.0585L10.9967 16.2938L4.5084 20.0459C4.46385 20.0719 4.41384 20.0844 4.36383 20.0844C4.3057 20.0844 4.24792 20.0676 4.19919 20.0329C4.10788 19.9695 4.06564 19.8599 4.09105 19.7548L5.82438 12.6847L0.0968238 7.92979C0.011544 7.85906 -0.0211751 7.74629 0.013865 7.64365C0.0486731 7.54111 0.144281 7.4686 0.256711 7.45937L7.80786 6.85484L10.756 0.164147C10.7997 0.0643917 10.9014 0 11.0139 0C11.0141 0 11.0143 0 11.0143 0C11.127 0 11.2288 0.0649467 11.2721 0.164479L14.2058 6.86118L21.7552 7.48095C21.8678 7.49029 21.9631 7.56302 21.9981 7.66555C22.0328 7.7682 22 7.88108 21.9144 7.95136L16.1762 12.6948L17.8943 19.7686C17.9202 19.8736 17.8774 19.983 17.7858 20.0464C17.7373 20.0806 17.6793 20.0977 17.6219 20.0977Z" fill="url(#paint0_radial_9118_15308)" />
                            <path d="M17.6229 19.896C17.6103 19.896 17.5977 19.8926 17.5864 19.8862L10.998 16.0584L4.40068 19.8732C4.38954 19.8795 4.37736 19.8826 4.36471 19.8826C4.35021 19.8826 4.3357 19.879 4.32352 19.8696C4.30055 19.8541 4.2901 19.8267 4.2966 19.8006L6.05905 12.6117L0.235078 7.77705C0.213845 7.75947 0.205725 7.73112 0.214311 7.7052C0.223361 7.67996 0.247029 7.66172 0.275107 7.65972L7.95284 7.04474L10.9502 0.241834C10.9614 0.216923 10.9866 0.200684 11.0147 0.200684C11.0147 0.200684 11.0147 0.200684 11.0149 0.200684C11.0432 0.200684 11.0685 0.217032 11.0794 0.241943L14.062 7.05063L21.7385 7.68085C21.7665 7.68307 21.7902 7.70121 21.7992 7.72701C21.8076 7.75281 21.7994 7.78105 21.7783 7.7984L15.9439 12.6213L17.6909 19.8137C17.6973 19.8397 17.6862 19.8674 17.6638 19.883C17.6512 19.8916 17.6371 19.896 17.6229 19.896Z" fill="url(#paint1_linear_9118_15308)" />
                            <path d="M7.99743 7.10811L11.0112 0.268066L14.0103 7.11412L21.7291 7.7479L15.8627 12.5975L17.6192 19.8291L10.9944 15.9802L4.36114 19.8159L6.13322 12.5877L0.277344 7.72644L7.99743 7.10811Z" fill="url(#paint2_linear_9118_15308)" />
                            <path d="M11.1891 11.551C11.1439 11.4959 11.0748 11.4633 11.0016 11.4633C11.0013 11.4633 11.0013 11.4633 11.0009 11.4633C10.928 11.4633 10.8587 11.4956 10.8138 11.5507L8.37693 14.534L10.5906 11.395C10.6317 11.3368 10.6425 11.2637 10.6201 11.197C10.5972 11.1303 10.5441 11.0772 10.4752 11.053L6.76172 9.75321L10.5606 10.8015C10.5824 10.8077 10.6044 10.8107 10.6263 10.8107C10.6762 10.8107 10.7253 10.7958 10.7663 10.7672C10.8257 10.7258 10.8619 10.6606 10.8644 10.5904L11.0063 6.80371L11.1405 10.5907C11.143 10.6611 11.179 10.7263 11.2382 10.7677C11.2793 10.7962 11.3287 10.8113 11.3782 10.8113C11.4 10.8113 11.4222 10.8084 11.4438 10.8026L15.245 9.76189L11.5286 11.054C11.4599 11.0783 11.4064 11.1311 11.3835 11.1977C11.3608 11.2647 11.3714 11.3376 11.4124 11.396L13.6195 14.5391L11.1891 11.551Z" fill="white" />
                            <path d="M10.6435 10.0628L8.08027 6.91957L11.0111 0.267578L10.6435 10.0628ZM21.7289 7.74752H21.7291L14.2765 7.13554L11.9655 10.4201L21.7289 7.74752ZM9.90642 11.0964L0.277344 7.72606L5.98598 12.4647L9.90642 11.0964ZM11.961 11.7709L17.6192 19.8288L15.9261 12.8597L11.961 11.7709ZM4.36114 19.8153L10.7915 16.0971L10.6454 12.1225L4.36114 19.8153Z" fill="url(#paint3_linear_9118_15308)" />
                            <path d="M11.3577 10.0658L11.0112 0.267578L13.9241 6.91623L11.3577 10.0658ZM7.72152 7.12998L0.277344 7.72606L10.0372 10.4191L7.72152 7.12998ZM21.7289 7.74752L12.0992 11.0962L16.0235 12.464L21.7289 7.74752ZM11.2154 16.1082L17.6191 19.8288L11.3594 12.1331L11.2154 16.1082ZM10.0325 11.7743L6.06523 12.8657L4.36126 19.8154V19.8152L10.0325 11.7743Z" fill="url(#paint4_linear_9118_15308)" />
                            <defs>
                              <radialGradient id="paint0_radial_9118_15308" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.0059 10.0489) scale(10.7481 10.3019)">
                                <stop stopColor="#D08B01" />
                                <stop offset="0.5758" stopColor="#F2B145" />
                                <stop offset="1" stopColor="#F8F3BC" />
                              </radialGradient>
                              <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F6DB89" />
                                <stop offset="1" stopColor="#F8F7DA" />
                              </linearGradient>
                              <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ED9017" />
                                <stop offset="0.1464" stopColor="#F09F23" />
                                <stop offset="0.4262" stopColor="#F6C642" />
                                <stop offset="0.4945" stopColor="#F8D04A" />
                                <stop offset="1" stopColor="#F6E6B5" />
                              </linearGradient>
                              <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ED9017" />
                                <stop offset="0.1464" stopColor="#F09F23" />
                                <stop offset="0.4262" stopColor="#F6C642" />
                                <stop offset="0.4945" stopColor="#F8D04A" />
                                <stop offset="1" stopColor="#F6E6B5" />
                              </linearGradient>
                              <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#DF8D00" />
                                <stop offset="0.0848" stopColor="#FFD006" />
                                <stop offset="0.2242" stopColor="#F4AD06" />
                                <stop offset="0.85" stopColor="#F4AD06" />
                                <stop offset="0.8777" stopColor="#F2A807" />
                                <stop offset="0.9093" stopColor="#EC9B09" />
                                <stop offset="0.9428" stopColor="#E2840D" />
                                <stop offset="0.9773" stopColor="#D46412" />
                                <stop offset="1" stopColor="#C94B16" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </button>
                      )}
                      {ticketData.is_flagged && (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#EDEAE3]"
                          title="Flag"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                            <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                          </svg>
                        </button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-[12px] border-[#D9D9D9] hover:bg-[#F6F4EE]"
                        onClick={handleTicketMgmtEdit}
                        disabled={isEditingTicketMgmt || loadingComplaintStatus || loadingComplaintModes || loadingResponsiblePersons}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {(loadingComplaintStatus || loadingComplaintModes || loadingResponsiblePersons) ? 'Loading...' : 'Edit'}
                      </Button>
                    </div>
                  </div>

                  {/* Body (consistent background / border like Location card) */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4 overflow-hidden">
                    {!isEditingTicketMgmt ? (
                      // View Mode - Show current ticket data
                      (() => {
                        const mgmtFields = [
                          { label: 'Update Status', value: ticketData.issue_status || '-' },
                          { label: 'Severity', value: ticketData.severity || '-' },
                          { label: 'Select Vendor', value: ticketData.vendors && ticketData.vendors.length > 0 ? ticketData.vendors.map(v => v.name || v).join(', ') : '-' },
                          { label: 'Assigned To', value: ticketData.assigned_to || '-' },
                          { label: 'Source', value: ticketData.asset_service || '-' },

                          { label: 'Expected Visit Date', value: ticketData.visit_date ? ticketData.visit_date || formatDate(ticketData.visit_date) : '-' },
                          { label: 'Expected Completion Date', value: ticketData.expected_completion_date ? formatDate(ticketData.expected_completion_date) : '-' },
                          { label: 'Scope', value: ticketData.issue_related_to || '-' },
                          { label: 'Mode', value: ticketData.complaint_mode || '-' },
                          { label: 'Identification', value: ticketData.proactive_reactive || '-' },
                        ];

                        // Split into two vertical columns
                        const midpoint = Math.ceil(mgmtFields.length / 2);
                        const colA = mgmtFields.slice(0, midpoint);
                        const colB = mgmtFields.slice(midpoint);

                        return (
                          <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left: two vertical columns of key/value pairs */}
                            <div className="flex-1 flex gap-16 min-w-0">
                              {[colA, colB].map((col, ci) => (
                                <div key={ci} className="flex flex-col gap-4 min-w-[280px] flex-1">
                                  {col.map((field) => (
                                    <div key={field.label} className="flex text-[14px] leading-snug min-w-0">
                                      <div className="w-[180px] flex-shrink-0 text-[#6B6B6B] font-medium">
                                        {field.label}
                                      </div>
                                      <div className="flex-1 text-[14px] font-semibold text-[#1A1A1A] break-words overflow-wrap-anywhere min-w-0">
                                        {field.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* Right: Root Cause + Notes (stacked) */}
                            <div className="w-full lg:w-[38%] min-w-0">
                              <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                                <div className="relative w-full">
                                  {/* Floating label on border */}
                                  <label
                                    style={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "12px",
                                      background: "#fff",
                                      padding: "0 6px",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      color: "#1A1A1A",
                                      zIndex: 1
                                    }}
                                  >
                                    Root Cause Analysis
                                  </label>

                                  {/* React Select */}
                                  <Select
                                    isMulti
                                    value={getRootCauseAnalysisValues()}
                                    onChange={(selectedOptions) => {
                                      const selectedIds = selectedOptions
                                        ? selectedOptions.map((opt) => opt.value)
                                        : [];
                                      handleRootCauseChange(selectedIds);
                                    }}
                                    options={communicationTemplates
                                      .filter((t) => t.identifier === "Root Cause Analysis" && t.active === true)
                                      .map((t) => ({
                                        value: t.id,
                                        label: t.identifier_action,
                                      }))}
                                    placeholder="Select Root Cause Analysis..."
                                    styles={customStyles}
                                    components={{
                                      MultiValue: CustomMultiValue,
                                      MultiValueRemove: () => null,
                                    }}
                                    closeMenuOnSelect={false}
                                  />
                                </div>
                              </div>
                              {(ticketData.rca_template_ids && ticketData.rca_template_ids.length > 0) && (
                                <div
                                  className="space-y-2 min-w-0 mt-4"
                                  style={{ fontSize: "14px", fontWeight: "500" }}
                                >
                                  {(() => {
                                    // Use template IDs from API with duplicate filtering
                                    const uniqueIds = [...new Set(ticketData.rca_template_ids)];

                                    return uniqueIds.map((templateId, index) => {
                                      const matchedTemplate = communicationTemplates.find(
                                        (template) =>
                                          template.id === templateId &&
                                          template.identifier === "Root Cause Analysis"
                                      );

                                      if (!matchedTemplate) return null;

                                      return (
                                        <div
                                          key={`rca-display-${templateId}`}
                                          className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                        >
                                          {matchedTemplate.body || matchedTemplate.identifier_action}
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0 mt-4">
                                <span className="text-[11px] tracking-wide text-[#6B6B6B] mb-1">
                                  Additional Notes
                                </span>
                                <div
                                  className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                >
                                  {ticketData.notes ||
                                    ticketData.heading ||
                                    ticketData.text ||
                                    'No additional notes available'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Edit Mode - Show form
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleTicketMgmtSubmit();
                        }}
                        className="space-y-4"
                      >
                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* 1️⃣ LEFT COLUMN */}
                          <div className="space-y-4">
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ '& .MuiInputBase-root': fieldStyles }}
                            >
                              <InputLabel shrink>Status</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.selectedStatus}
                                onChange={(e) => handleTicketMgmtInputChange("selectedStatus", e.target.value)}
                                label="Status"
                                notched
                                displayEmpty
                                disabled={loadingComplaintStatus || complaintStatus.length === 0}
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">
                                    {loadingComplaintStatus ? 'Loading statuses...' : 'Select status'}
                                  </span>
                                </MenuItem>
                                {complaintStatus.map((status) => (
                                  <MenuItem key={status.id} value={status.id.toString()}>
                                    {status.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Severity</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.severity}
                                onChange={(e) => handleTicketMgmtInputChange('severity', e.target.value)}
                                label="Severity"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select severity</span>
                                </MenuItem>
                                <MenuItem value="Major">Major</MenuItem>
                                <MenuItem value="Minor">Minor</MenuItem>
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Assigned To</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.assigned_to}
                                onChange={(e) => handleTicketMgmtInputChange('assigned_to', e.target.value)}
                                label="Assigned To"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select engineer</span>
                                </MenuItem>
                                {responsiblePersons.map((user) => (
                                  <MenuItem key={user.id} value={user.id.toString()}>
                                    {user.full_name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Source</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.asset_service}
                                onChange={(e) => handleTicketMgmtInputChange('asset_service', e.target.value)}
                                label="Source"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select source</span>
                                </MenuItem>
                                <MenuItem value="Asset">Asset</MenuItem>
                                <MenuItem value="Service">Service</MenuItem>
                              </MuiSelect>
                            </FormControl>

                          </div>

                          {/* 2️⃣ MIDDLE COLUMN */}
                          <div className="space-y-4">
                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              label="Expected Visit Date"
                              value={ticketMgmtFormData.visit_date}
                              onChange={(e) => handleTicketMgmtInputChange('visit_date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              label="Expected Completion Date"
                              value={ticketMgmtFormData.expected_completion_date}
                              onChange={(e) => handleTicketMgmtInputChange('expected_completion_date', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />

                            <FormControl fullWidth size="small">
                              <InputLabel>Scope</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.issue_related_to}
                                onChange={(e) => handleTicketMgmtInputChange('issue_related_to', e.target.value)}
                                label="Scope"
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">Select scope</span>
                                </MenuItem>
                                <MenuItem value="Projects">Projects</MenuItem>
                                <MenuItem value="FM">FM</MenuItem>
                              </MuiSelect>
                            </FormControl>

                            <FormControl fullWidth size="small">
                              <InputLabel>Mode</InputLabel>
                              <MuiSelect
                                value={ticketMgmtFormData.complaint_mode_id || ''}
                                onChange={(e) => handleTicketMgmtInputChange('complaint_mode_id', e.target.value)}
                                label="Mode"
                                disabled={loadingComplaintModes}
                              >
                                <MenuItem value="">
                                  <span className="text-gray-500">
                                    {loadingComplaintModes ? 'Loading modes...' : 'Select mode'}
                                  </span>
                                </MenuItem>
                                {complaintModes.map((mode) => (
                                  <MenuItem key={mode.id} value={mode.id.toString()}>
                                    {mode.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>

                          </div>

                          {/* 3️⃣ RIGHT COLUMN - Template Fields */}
                          <div className="space-y-4">
                            {/* Root Cause Analysis */}
                            <div className="relative">
                              <label className="absolute -top-2 left-3 bg-white px-2 text-sm font-medium text-gray-700 z-10">
                                Root Cause Analysis
                              </label>
                              <Select
                                isMulti
                                value={communicationTemplates
                                  .filter(
                                    (t) =>
                                      t.identifier === 'Root Cause Analysis' && t.active === true &&
                                      ticketMgmtFormData.rca_template_ids.includes(t.id)
                                  )
                                  .map((t) => ({ value: t.id, label: t.identifier_action }))}
                                onChange={(selected) => {
                                  const selectedIds = selected ? selected.map((s) => s.value) : [];
                                  handleTicketMgmtInputChange('rca_template_ids', selectedIds);
                                  // Auto-save when dropdown changes
                                  handleRootCauseChange(selectedIds);
                                }}
                                options={communicationTemplates
                                  .filter((t) => t.identifier === 'Root Cause Analysis' && t.active)
                                  .map((t) => ({ value: t.id, label: t.identifier_action }))}
                                styles={customStyles}
                                components={{
                                  MultiValue: CustomMultiValue,
                                  MultiValueRemove: () => null,
                                }}
                                closeMenuOnSelect={false}
                                placeholder="Select Root Cause Analysis..."
                              />
                            </div>
                            {(ticketMgmtFormData.rca_template_ids && ticketMgmtFormData.rca_template_ids.length > 0) && (
                              <div
                                className="space-y-2 min-w-0 mt-4"
                                style={{ fontSize: "14px", fontWeight: "500" }}
                              >
                                {(() => {
                                  // Use template IDs from form data with duplicate filtering
                                  const uniqueIds = [...new Set(ticketMgmtFormData.rca_template_ids)];

                                  return uniqueIds.map((templateId, index) => {
                                    const matchedTemplate = communicationTemplates.find(
                                      (template) =>
                                        template.id === templateId &&
                                        template.identifier === "Root Cause Analysis"
                                    );

                                    if (!matchedTemplate) return null;

                                    return (
                                      <div
                                        key={`rca-display-${templateId}`}
                                        className="text-[14px] font-medium text-[#000000] leading-[20px] max-h-48 overflow-y-auto pr-1 break-words overflow-wrap-anywhere"
                                        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                      >
                                        {matchedTemplate.body || matchedTemplate.identifier_action}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            )}

                            {/* Additional Notes */}
                            <TextField
                              fullWidth
                              multiline
                              minRows={4}
                              label={
                                <span style={{ fontSize: '16px' }}>
                                  Additional Notes
                                </span>
                              }
                              placeholder="Enter Additional Notes"
                              value={ticketMgmtFormData.additional_notes}
                              onChange={(e) =>
                                handleTicketMgmtInputChange('additional_notes', e.target.value)
                              }
                              sx={{
                                mb: 3,
                                "& textarea": {
                                  width: "100% !important",   // force full width
                                  resize: "both",             // allow resizing
                                  overflow: "auto",
                                  boxSizing: "border-box",
                                  display: "block",
                                },
                                "& textarea[aria-hidden='true']": {
                                  display: "none !important", // hide shadow textarea
                                },
                              }}
                            />
                          </div>
                        </div>

                        {/* Additional Notes - Full Width */}
                        {/* <div className="mt-6">
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Additional Notes"
                            value={ticketMgmtFormData.additional_notes}
                            onChange={(e) =>
                              handleTicketMgmtInputChange('additional_notes', e.target.value)
                            }
                            sx={fieldStyles}
                          />
                        </div>
                        </div> */}


                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 justify-end mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditingTicketMgmt(false)}
                            disabled={submittingTicketMgmt}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submittingTicketMgmt}
                            className="bg-[#C72030] hover:bg-[#A01825] text-white px-8"
                          >
                            {submittingTicketMgmt ? 'Saving...' : 'Submit'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </Card>

                {/* Cost Involve */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9] rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <DollarSign className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Cost Involve
                      </h3>
                    </div>

                    {/* Slider Toggle (Yes / No) */}
                    <div className="flex items-center gap-2 text-[11px] font-medium select-none">
                      <span className={costInvolveEnabled ? "text-[#1A1A1A]" : "text-gray-400"}>
                        Yes
                      </span>
                      <div
                        role="switch"
                        aria-checked={costInvolveEnabled}
                        aria-label={costInvolveEnabled ? "Deactivate cost involve" : "Activate cost involve"}
                        tabIndex={0}
                        onClick={() => setCostInvolveEnabled(v => !v)}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setCostInvolveEnabled(v => !v)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C72030] ${costInvolveEnabled ? 'bg-[#C72030]' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${costInvolveEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </div>
                      <span className={!costInvolveEnabled ? "text-[#1A1A1A]" : "text-gray-400"}>
                        No
                      </span>
                    </div>
                  </div>

                  {/* Body (rendered only when active) */}
                  {costInvolveEnabled && (
                    <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-4 sm:px-5 pt-4 pb-6">
                      {/* Form Rows */}
                      {costRows.map((row) => (
                        <div key={row.id} className="mb-6 last:mb-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                              <TextField
                                label={
                                  <span style={{ fontSize: '14px' }}>
                                    Quotation <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                placeholder="Enter Quotation"
                                fullWidth
                                value={row.quotation}
                                onChange={e =>
                                  setCostRows(prev =>
                                    prev.map(r => r.id === row.id ? { ...r, quotation: e.target.value } : r)
                                  )
                                }
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                }}
                              />

                              <TextField
                                label={
                                  <span style={{ fontSize: '14px' }}>
                                    Cost <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                placeholder="Enter Cost"
                                type="text"
                                fullWidth
                                value={row.cost}
                                onChange={e => {
                                  const value = e.target.value;
                                  // Allow empty string
                                  if (value === '') {
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, cost: value } : r)
                                    );
                                    return;
                                  }
                                  // Validate: allow only numbers and up to 2 decimal places
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value) && Number(value) >= 0) {
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, cost: value } : r)
                                    );
                                  }
                                }}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                }}
                              />
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-4">
                              <FormControl
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '4px',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: '#DAD7D0',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#C72030',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                  '& .MuiInputBase-input': {
                                    fontSize: '14px',
                                    padding: '10px 12px',
                                  },
                                  '& .MuiInputLabel-root': {
                                    fontSize: '14px',
                                    '&.Mui-focused': {
                                      color: '#C72030',
                                    },
                                  },
                                }}
                              >
                                <InputLabel id={`vendor-label-${row.id}`}>
                                  <span style={{ fontSize: '14px' }}>
                                    Vendor <span style={{ color: "red" }}>*</span>
                                  </span>
                                </InputLabel>
                                <MuiSelect
                                  labelId={`vendor-label-${row.id}`}
                                  label="Vendor *"
                                  value={row.vendor_id}
                                  onChange={e => {
                                    const selectedVendorId = e.target.value;
                                    const selectedVendor = suppliers.find(s => s.id.toString() === selectedVendorId);
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? {
                                        ...r,
                                        vendor: selectedVendor?.company_name || '',
                                        vendor_id: selectedVendorId
                                      } : r)
                                    );
                                  }}
                                  disabled={loadingSuppliers}
                                  displayEmpty
                                >
                                  <MenuItem value="">
                                    <span style={{ color: '#aaa' }}>
                                      {loadingSuppliers ? 'Loading vendors...' : 'Select Vendor'}
                                    </span>
                                  </MenuItem>
                                  {suppliers.map((supplier) => (
                                    <MenuItem key={supplier.id} value={supplier.id.toString()}>
                                      {supplier.company_name || supplier.email}
                                    </MenuItem>
                                  ))}
                                </MuiSelect>
                              </FormControl>

                              {/* File Input for Attachments */}
                              <div>
                                <input
                                  type="file"
                                  id={`cost-file-input-${row.id}`}
                                  multiple
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={(e) => handleCostAttachmentChange(row.id, e)}
                                  style={{ display: 'none' }}
                                />
                                <label htmlFor={`cost-file-input-${row.id}`}>
                                  <MuiButton
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    startIcon={<Paperclip className="w-4 h-4" />}
                                    sx={{
                                      borderColor: '#DAD7D0',
                                      color: '#1A1A1A',
                                      textTransform: 'none',
                                      fontFamily: 'Work Sans, sans-serif',
                                      fontWeight: 500,
                                      borderRadius: '4px',
                                      padding: '10px 12px',
                                      backgroundColor: '#F2F2F2',
                                      justifyContent: 'flex-start',
                                      fontSize: '14px',
                                      '&:hover': {
                                        borderColor: '#C72030',
                                        backgroundColor: '#F2F2F2',
                                      },
                                    }}
                                  >
                                    {row.attachmentFiles.length > 0
                                      ? `${row.attachmentFiles.length} file(s) selected`
                                      : 'Choose Attachments'}
                                  </MuiButton>
                                </label>
                                {row.attachmentFiles.length > 0 && (
                                  <div className="mt-2 text-[11px] text-gray-600">
                                    {row.attachmentFiles.map((file, idx) => (
                                      <div key={idx} className="truncate">
                                        • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Column (Description) */}
                            <div className="space-y-4">
                              <div className="relative w-full">
                                <textarea
                                  id={`cost-description-${row.id}`}
                                  value={row.description}
                                  onChange={e =>
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r)
                                    )
                                  }
                                  rows={6}
                                  placeholder=" "
                                  className="peer block w-full appearance-none rounded border border-[#DAD7D0] bg-[#F2F2F2] px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[#C72030] 
      resize-vertical"
                                  style={{ fontSize: '14px' }}
                                />

                                <label
                                  htmlFor={`cost-description-${row.id}`}
                                  className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[#C72030]"
                                >
                                  Description <span style={{ color: "red" }}>*</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add / Remove Row Buttons */}
                      <div className="flex justify-end gap-4 mt-4 pr-2">
                        <button
                          type="button"
                          onClick={addCostRow}
                          className="text-[#C72030] text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-2"
                          title="Add Row"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={removeCostRow}
                          disabled={costRows.length <= 1}
                          className={`text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-2 ${costRows.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'text-[#C72030]'
                            }`}
                          title="Remove Row"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Submit Cost Approval Button */}
                      <div className="flex justify-center mt-6">
                        <button
                          type="button"
                          onClick={handleSubmitCostApproval}
                          disabled={submittingCostApproval}
                          className={`bg-[#C72030] text-white text-[13px] font-semibold px-8 py-2.5 rounded transition-colors ${submittingCostApproval
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#A01828]'
                            }`}
                        >
                          {submittingCostApproval ? 'Submitting...' : 'Submit Cost Approval'}
                        </button>
                      </div>

                      {/* Table - Display actual requests data from API */}
                      <div className="mt-6 border border-[#D9D9D9] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-[11px]">
                            <thead>
                              <tr className="bg-[#EDEAE3] text-[#1A1A1A] font-semibold">
                                {['Request Id', 'Amount', 'Comments', 'Created On', 'Created By', 'L1', 'L2', 'L3', 'L4', 'L5', 'Status'].map(h => (
                                  <th key={h} className="px-4 py-3 text-left border border-[#D2CEC4] whitespace-nowrap text-[12px]">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {ticketData.requests && ticketData.requests.length > 0 ? (
                                ticketData.requests.map(request => (
                                  <tr key={request.id} className="bg-white even:bg-[#FAFAF9] hover:bg-[#F6F4EE] transition-colors">
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A] font-medium">
                                      {request.id}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A] font-semibold">
                                      ₹{parseFloat(request.amount || '0').toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.comment || '-'}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.created_on}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-[#1A1A1A]">
                                      {request.created_by}
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L1 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L1 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L1 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L2 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L2 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L2 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L3 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L3 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L3 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L4 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L4 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L4 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC] text-center">
                                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${request.approvals?.L5 === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : request.approvals?.L5 === 'Rejected'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {request.approvals?.L5 || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 border border-[#E5E2DC]">
                                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${request.master_status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : request.master_status === 'Approved'
                                          ? 'bg-green-100 text-green-700'
                                          : request.master_status === 'Rejected'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {request.master_status}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white">
                                  <td colSpan={11} className="px-4 py-6 border border-[#E5E2DC] text-gray-500 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <DollarSign className="w-8 h-8 text-gray-300" />
                                      <span className="text-sm">No cost approval requests found</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Ticket Closure (Figma-aligned) */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Ticket Closure
                      </h3>

                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-[12px] border-[#D9D9D9] hover:bg-[#F6F4EE]"
                    // onClick={handleUpdate}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FFFDFB] border border-t-0 border-[#D9D9D9] px-6 py-6">
                    {/* Two row / two column panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Preventive Action */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Preventive Action
                          </label>

                          {/* React Select */}
                          <Select
                            value={getPreventiveActionValues()}
                            onChange={(selectedOptions) => {
                              handlePreventiveActionChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Preventive Action" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Preventive Action"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.preventive_action_template_ids || ticketData.preventive_action_template_ids.length === 0) {
                              return 'No preventive action description available';
                            }

                            const uniqueIds = [...new Set(ticketData.preventive_action_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Preventive Action"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No preventive action description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`preventive-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Short-term Impact */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Short-term Impact
                          </label>

                          {/* React Select */}
                          <Select
                            value={getShortTermImpactValues()}
                            onChange={(selectedOptions) => {
                              handleShortTermImpactChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Short-term Impact" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Short-term Impact"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.short_term_impact_template_ids || ticketData.short_term_impact_template_ids.length === 0) {
                              return 'No short-term impact description available';
                            }

                            const uniqueIds = [...new Set(ticketData.short_term_impact_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Short-term Impact"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No short-term impact description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`short-term-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Corrective Action */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Corrective Action
                          </label>

                          {/* React Select */}
                          <Select
                            value={getCorrectiveActionValues()}
                            onChange={(selectedOptions) => {
                              handleCorrectiveActionChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Corrective Action" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Corrective Action"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.corrective_action_template_ids || ticketData.corrective_action_template_ids.length === 0) {
                              return 'No corrective action description available';
                            }

                            const uniqueIds = [...new Set(ticketData.corrective_action_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Corrective Action"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No corrective action description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`corrective-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Long-term Impact */}
                      <div className="bg-[#f2efea] border border-[#f2efea] p-4">
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Long-term Impact
                          </label>

                          {/* React Select */}
                          <Select
                            value={getLongTermImpactValues()}
                            onChange={(selectedOptions) => {
                              handleLongTermImpactChange(selectedOptions as Array<{ value: number; label: string }>);
                            }}
                            options={communicationTemplates
                              .filter((t) => t.identifier === "Long-term Impact" && t.active === true)
                              .map((t) => ({
                                value: t.id,
                                label: t.identifier_action,
                              }))}
                            placeholder="Select Long-term Impact"
                            styles={customStyles}
                            components={{ MultiValue: CustomMultiValue }}
                            isMulti
                            closeMenuOnSelect={false}
                            isClearable
                          />
                        </div>

                        <div className="mt-4 space-y-2 text-[14px] font-medium text-[#000000] leading-[16px] min-h-16 h-auto pr-1">
                          {(() => {
                            if (!ticketData?.long_term_impact_template_ids || ticketData.long_term_impact_template_ids.length === 0) {
                              return 'No long-term impact description available';
                            }

                            const uniqueIds = [...new Set(ticketData.long_term_impact_template_ids)];
                            const matchedTemplates = communicationTemplates.filter(
                              template => uniqueIds.includes(template.id) &&
                                template.identifier === "Long-term Impact"
                            );

                            if (matchedTemplates.length === 0) {
                              return 'No long-term impact description available';
                            }

                            return matchedTemplates.map((template, index) => (
                              <div key={`long-term-${template.id}`}>
                                {index > 0 && <div className="my-2 border-t border-gray-300"></div>}
                                <div>{template.body || template.identifier_action}</div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Review Date & Responsible Person */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                      <div className="flex items-start text-[12px]">
                        <span className="w-[120px] text-[#6B6B6B]">Review Date</span>
                        <span className="ml-4 font-semibold text-[#1A1A1A]">
                          {ticketData.review_tracking
                            ? ticketData.review_tracking
                            : '-'}
                        </span>
                      </div>
                      <div>
                        <div className="relative w-full">
                          {/* Floating label on border */}
                          <label
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "12px",
                              background: "#fff",
                              padding: "0 6px",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#1A1A1A",
                              zIndex: 1,
                            }}
                          >
                            Responsible Person
                          </label>

                          {/* React Select */}
                          <Select
                            value={(() => {
                              const value = getResponsiblePersonValue();
                              if (!value) return null;
                              const matchedPerson = responsiblePersons.find(
                                p => p.id.toString() === value
                              );
                              return matchedPerson ? {
                                value: matchedPerson.id,
                                label: `${matchedPerson.full_name}${matchedPerson.employee_type ? ` (${matchedPerson.employee_type})` : ''}`
                              } : null;
                            })()}
                            onChange={(selectedOption) => {
                              if (selectedOption && 'value' in selectedOption) {
                                handleResponsiblePersonChange(selectedOption.value.toString());
                              }
                            }}
                            options={responsiblePersons.map((person) => ({
                              value: person.id,
                              label: `${person.full_name}${person.employee_type ? ` (${person.employee_type})` : ''}`,
                            }))}
                            placeholder={loadingResponsiblePersons ? "Loading..." : "Select Responsible Person"}
                            styles={singleSelectStyles}
                            isDisabled={loadingResponsiblePersons}
                            isClearable
                          />
                        </div>

                        {/* Show current value if it doesn't match any option */}
                        {ticketData.responsible_person &&
                          !responsiblePersons.find(p => p.full_name === ticketData.responsible_person) && (
                            <div className="mt-1 text-[11px] text-[#6B6B6B] italic">
                              Current: {ticketData.responsible_person}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <MapPin className="w-6 h-6" style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-black">
                      Location Details
                    </h3>
                  </div>

                  <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <div className="relative w-full px-4">
                      <div
                        className="absolute top-[38px] left-0 right-0 h-0.5 bg-[#C72030] z-0"
                        style={{
                          left: `calc(9%)`,
                          right: `calc(9%)`,
                        }}
                      />

                      <div className="flex justify-between items-start relative z-1">
                        {[
                          { label: "Site", value: ticketData.site_name || "-" },
                          { label: "Building", value: ticketData.building_name || "-" },
                          { label: "Wing", value: ticketData.wing_name || "-" },
                          { label: "Floor", value: ticketData.floor_name || "-" },
                          { label: "Area", value: ticketData.area_name || "-" },
                          { label: "Room", value: ticketData.room_name || "-" },
                        ].map((item, index) => (
                          <div
                            key={`location-${index}`}
                            className="flex flex-col items-center w-full text-center"
                          >
                            <div className="text-sm text-gray-500 mb-2 mt-1">
                              {item.label}
                            </div>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-1" />
                            <div className="mt-2 text-base font-medium text-[#1A1A1A] break-words px-2">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {ticketData.documents && (
                  <Card className="w-full bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <Paperclip className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Attachments
                      </h3>
                    </div>

                    <CardContent className="pt-4 bg-[#FAFAF8] border border-t-0 border-[#D9D9D9]">
                      {Array.isArray(ticketData.documents) && ticketData.documents.length > 0 ? (
                        <div className="flex items-center flex-wrap gap-4">
                          {ticketData.documents.map((attachment: any, idx: number) => {
                            const url = attachment.document || attachment.document_url || attachment.url || attachment.attachment_url || '';
                            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
                            const isPdf = /\.pdf$/i.test(url) || attachment.doctype === 'application/pdf';
                            const isExcel = /\.(xls|xlsx|csv)$/i.test(url) ||
                              attachment.doctype?.includes('spreadsheet') ||
                              attachment.doctype?.includes('excel');
                            const isWord = /\.(doc|docx)$/i.test(url) ||
                              attachment.doctype?.includes('document') ||
                              attachment.doctype?.includes('word');
                            const isDownloadable = isPdf || isExcel || isWord;

                            return (
                              <div
                                key={attachment.id || idx}
                                className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                              >
                                {isImage ? (
                                  <>
                                    <button
                                      className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                      title="View"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      type="button"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <img
                                      src={url}
                                      alt={attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`}
                                      className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                      onClick={() => {
                                        setSelectedDoc({
                                          id: attachment.id || 0,
                                          document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                          url: url,
                                          document_url: url,
                                          document: url,
                                        });
                                        setShowImagePreview(true);
                                      }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </>
                                ) : isPdf ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : isExcel ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                    <FileSpreadsheet className="w-6 h-6" />
                                  </div>
                                ) : isWord ? (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                    <File className="w-6 h-6" />
                                  </div>
                                )}
                                <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                  {attachment.document_name ||
                                    attachment.document_file_name ||
                                    url.split('/').pop() ||
                                    `Document_${attachment.id || idx + 1}`}
                                </span>
                                {isDownloadable && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: attachment.id || 0,
                                        document_name: attachment.document_name || attachment.document_file_name || `Document_${attachment.id || idx + 1}`,
                                        url: url,
                                        document_url: url,
                                        document: url,
                                      });
                                      setShowImagePreview(true);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No attachments</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {isModalOpen && selectedDoc && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <div
                      className="max-w-4xl max-h-[90vh] bg-white rounded-lg p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold truncate">
                          {selectedDoc.document_name ||
                            selectedDoc.document_file_name ||
                            selectedDoc.url?.split('/').pop() ||
                            `Document_${selectedDoc.id}`}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!selectedDoc.id) {
                                toast.error('Unable to download: No document ID found');
                                return;
                              }

                              try {
                                const { API_CONFIG } = await import('@/config/apiConfig');
                                const baseUrl = API_CONFIG.BASE_URL;
                                const token = localStorage.getItem('token');

                                const cleanBaseUrl = baseUrl
                                  .replace(/^https?:\/\//, '')
                                  .replace(/\/$/, '');
                                const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${selectedDoc.id}?show_file=true`;

                                const response = await fetch(downloadUrl, {
                                  method: 'GET',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: '*/*',
                                  },
                                  mode: 'cors',
                                });

                                if (response.ok) {
                                  const blob = await response.blob();
                                  const fileExtension =
                                    selectedDoc.doctype?.split('/').pop() ||
                                    selectedDoc.url?.split('.').pop()?.toLowerCase() ||
                                    'file';
                                  const documentName = `document_${selectedDoc.id}.${fileExtension}`;

                                  const url = window.URL.createObjectURL(blob);
                                  const link = window.document.createElement('a');
                                  link.href = url;
                                  link.download = documentName;
                                  link.style.display = 'none';
                                  window.document.body.appendChild(link);
                                  link.click();

                                  setTimeout(() => {
                                    window.document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  }, 100);

                                  toast.success('File downloaded successfully');
                                } else {
                                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                }
                              } catch (error) {
                                console.error('Error downloading file:', error);
                                toast.error(`Failed to download: ${error.message}`);
                              }
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Close
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-[70vh] overflow-auto">
                        {selectedDoc.type === 'image' ? (
                          <img
                            src={selectedDoc.url}
                            alt={selectedDoc.document_name || 'Document'}
                            className="max-w-full h-auto rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              (target.nextSibling as HTMLElement).style.display = 'block';
                            }}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">
                              Preview not available for this file type
                            </p>
                            <Button
                              onClick={async () => {
                                // Same download logic as above
                                if (!selectedDoc.id) {
                                  toast.error('Unable to download: No document ID found');
                                  return;
                                }

                                try {
                                  const { API_CONFIG } = await import('@/config/apiConfig');
                                  const baseUrl = API_CONFIG.BASE_URL;
                                  const token = localStorage.getItem('token');

                                  const cleanBaseUrl = baseUrl
                                    .replace(/^https?:\/\//, '')
                                    .replace(/\/$/, '');
                                  const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${selectedDoc.id}?show_file=true`;

                                  const response = await fetch(downloadUrl, {
                                    method: 'GET',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      Accept: '*/*',
                                    },
                                    mode: 'cors',
                                  });

                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const fileExtension =
                                      selectedDoc.doctype?.split('/').pop() ||
                                      selectedDoc.url?.split('.').pop()?.toLowerCase() ||
                                      'file';
                                    const documentName = `document_${selectedDoc.id}.${fileExtension}`;

                                    const url = window.URL.createObjectURL(blob);
                                    const link = window.document.createElement('a');
                                    link.href = url;
                                    link.download = documentName;
                                    link.style.display = 'none';
                                    window.document.body.appendChild(link);
                                    link.click();

                                    setTimeout(() => {
                                      window.document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    }, 100);

                                    toast.success('File downloaded successfully');
                                  } else {
                                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                  }
                                } catch (error) {
                                  console.error('Error downloading file:', error);
                                  toast.error(`Failed to download: ${error.message}`);
                                }
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download File
                            </Button>
                          </div>
                        )}
                        <div className="hidden text-center py-8 text-gray-500">
                          Failed to load preview
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <MessageSquare className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Comments
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FAFAF8]">
                    <div className="flex flex-col md:flex-row gap-3 px-2">
                      {/* Internal Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5 bg-[#fafafa] border-[#D9D9D9]">
                          <h4 className="text-[18px] font-regular text-[#000000]">Internal</h4>
                        </div>

                        <div className="mt-4 ml-2">
                          {/* Template Dropdown */}
                          <div className="mb-3">
                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                              <InputLabel shrink>Template</InputLabel>
                              <MuiSelect
                                label="Template"
                                notched
                                displayEmpty
                                value={selectedInternalTemplate}
                                onChange={(e) => {
                                  const templateId = e.target.value;
                                  setSelectedInternalTemplate(templateId);
                                  // Auto-populate the textarea with the selected template's body
                                  if (templateId) {
                                    const selectedTemplateData = communicationTemplates.find(t => t.id === templateId);
                                    setInternalCommentText(selectedTemplateData?.body || '');
                                  } else {
                                    setInternalCommentText('');
                                  }
                                }}
                                disabled={loadingTemplates}
                                sx={{
                                  fontSize: '11px',
                                  height: '40px',
                                }}
                              >
                                <MenuItem value="">
                                  <span style={{ color: '#aaa' }}>
                                    {loadingTemplates ? 'Loading templates...' : 'Select Template'}
                                  </span>
                                </MenuItem>
                                {communicationTemplates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.identifier_action}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>
                          </div>

                          {/* Comment Input */}
                          <div className="mb-4">
                            <div className="relative w-full">
                              <textarea
                                id="internal-comment"
                                value={internalCommentText}
                                onChange={(e) => setInternalCommentText(e.target.value)}
                                rows={4}
                                placeholder=" "
                                className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[rgb(25,118,210)] 
      resize-vertical"
                              />

                              <label
                                htmlFor="internal-comment"
                                className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
                              >
                                Add comment
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Show selected files */}
                        {internalAttachments.length > 0 && (
                          <div className="mb-2 text-[11px] text-gray-600 ml-2">
                            <strong>Selected files:</strong>
                            <ul className="list-disc pl-5">
                              {internalAttachments.map((file, idx) => (
                                <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Add Attachment Button */}
                        <input
                          type="file"
                          id="internal-file-input"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleInternalFileChange}
                          style={{ display: 'none' }}
                        />
                        <MuiButton
                          variant="outlined"
                          component="label"
                          htmlFor="internal-file-input"
                          sx={{
                            marginLeft: '8px',
                            borderColor: '#C72030',
                            color: '#C72030',
                            textTransform: 'none',
                            fontFamily: 'Work Sans, sans-serif',
                            fontWeight: 500,
                            borderRadius: '0',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#B8252F',
                              backgroundColor: 'rgba(199, 32, 48, 0.04)',
                            },
                          }}
                        >
                          Add Attachment
                        </MuiButton>
                      </div>

                      {/* Customer Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5 bg-[#fafafa] border-[#D9D9D9]">
                          <h4 className="text-[18px] font-regular text-[#000000]">Customer</h4>
                        </div>

                        <div className="mt-4 mr-2">


                          {/* Template Dropdown */}
                          <div className="mb-3">
                            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                              <InputLabel shrink>Template</InputLabel>
                              <MuiSelect
                                label="Template"
                                notched
                                displayEmpty
                                value={selectedCustomerTemplate}
                                onChange={(e) => {
                                  const templateId = e.target.value;
                                  setSelectedCustomerTemplate(templateId);
                                  // Auto-populate the textarea with the selected template's body
                                  if (templateId) {
                                    const selectedTemplateData = communicationTemplates.find(t => t.id === templateId);
                                    setCommentText(selectedTemplateData?.body || '');
                                  } else {
                                    setCommentText('');
                                  }
                                }}
                                disabled={loadingTemplates}
                                sx={{
                                  fontSize: '11px',
                                  height: '40px',
                                }}
                              >
                                <MenuItem value="">
                                  <span style={{ color: '#aaa' }}>
                                    {loadingTemplates ? 'Loading templates...' : 'Select Template'}
                                  </span>
                                </MenuItem>
                                {communicationTemplates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.identifier_action}
                                  </MenuItem>
                                ))}
                                {communicationTemplates
                                  .filter(template => template.active === true)
                                  .map((template) => (
                                    <MenuItem key={template.id} value={template.id}>
                                      {template.identifier_action}
                                    </MenuItem>
                                  ))
                                }
                              </MuiSelect>
                            </FormControl>
                          </div>

                          {/* Comment Input */}
                          <div className="mb-4">
                            <div className="relative w-full">
                              <textarea
                                id="customer-comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={4}
                                placeholder=" "
                                className="peer block w-full appearance-none rounded border border-gray-300 bg-white px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent 
      focus:outline-none 
      focus:border-[2px] 
      focus:border-[rgb(25,118,210)] 
      resize-vertical"
                              />

                              <label
                                htmlFor="customer-comment"
                                className="absolute left-3 -top-[10px] bg-white px-1 text-sm text-gray-500 z-[1] transition-all duration-200
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:-top-[10px]
      peer-focus:text-sm
      peer-focus:text-[rgb(25,118,210)]"
                              >
                                Add customer comment
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Show selected files */}
                        {customerAttachments.length > 0 && (
                          <div className="mb-2 text-[11px] text-gray-600 mr-2">
                            <strong>Selected files:</strong>
                            <ul className="list-disc pl-5">
                              {customerAttachments.map((file, idx) => (
                                <li key={idx}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Add Attachment Button */}
                        <input
                          type="file"
                          id="customer-file-input"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleCustomerFileChange}
                          style={{ display: 'none' }}
                        />
                        <MuiButton
                          variant="outlined"
                          component="label"
                          htmlFor="customer-file-input"
                          sx={{
                            borderColor: '#C72030',
                            color: '#C72030',
                            textTransform: 'none',
                            fontFamily: 'Work Sans, sans-serif',
                            fontWeight: 500,
                            borderRadius: '0',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#B8252F',
                              backgroundColor: 'rgba(199, 32, 48, 0.04)',
                            },
                          }}
                        >
                          Add Attachment
                        </MuiButton>
                      </div>
                    </div>

                    {/* Submit Comment Button (centered) */}
                    <div className="flex justify-center mt-6 pb-6">
                      <button
                        type="button"
                        onClick={handleSubmitComment}
                        disabled={submittingComment}
                        className={`bg-[#C72030] text-white text-[12px] font-medium px-6 py-2 transition-colors ${submittingComment
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#A01828]'
                          }`}
                      >
                        {submittingComment ? 'Submitting...' : 'Submit Comment'}
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Logs Card – Adjusted Alignment */}
                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <div className="w-6 h-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 26" fill="none">
                            <path d="M9 25.0908H2C1.73478 25.0908 1.48043 24.9644 1.29289 24.7394C1.10536 24.5143 1 24.2091 1 23.8908V2.29082C1 1.97256 1.10536 1.66734 1.29289 1.44229C1.48043 1.21725 1.73478 1.09082 2 1.09082H16C16.2652 1.09082 16.5196 1.21725 16.7071 1.44229C16.8946 1.66734 17 1.97256 17 2.29082V13.0908M14.75 25.0908V17.2908" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 19.0908L12.8333 18.4242L14.5 17.0908L16.1667 18.4242L17 19.0908" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 8.09082H13M5 13.0908H9" stroke="#C72030" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Logs
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FAFAF8] relative px-6 pt-6 pb-8 pl-8">
                    {complaintLogs.length === 0 ? (
                      <div className="text-xs text-gray-400">No logs available</div>
                    ) : (
                      (() => {
                        const sorted = [...complaintLogs].sort(
                          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        );

                        return (
                          <>
                            <div className="pl-8 pt-2 relative">
                              {/* Vertical Progress Line */}
                              <div className="flex ml-1 mt-[-10px] mb-4 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="26" viewBox="0 0 18 26" fill="none">
                                  <path d="M9 25.0908H2C1.73478 25.0908 1.48043 24.9644 1.29289 24.7394C1.10536 24.5143 1 24.2091 1 23.8908V2.29082C1 1.97256 1.10536 1.66734 1.29289 1.44229C1.48043 1.21725 1.73478 1.09082 2 1.09082H16C16.2652 1.09082 16.5196 1.21725 16.7071 1.44229C16.8946 1.66734 17 1.97256 17 2.29082V13.0908M14.75 25.0908V17.2908" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M12 19.0908L12.8333 18.4242L14.5 17.0908L16.1667 18.4242L17 19.0908" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M5 8.09082H13M5 13.0908H9" stroke="#C72030" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <h4 style={{ marginLeft: '8px', fontWeight: '500', color: '#C72030' }}>Logs</h4>
                              </div>

                              {/* Container for dots and line */}
                              <div className="relative">
                                {/* Vertical line - stops before the last dot */}
                                {sorted.length > 1 && (
                                  <div
                                    className="absolute left-[13px] top-0 w-[2px] bg-[#C72030]"
                                    style={{
                                      height: `calc(100% - ${sorted.length > 0 ? '48px' : '0px'})`
                                    }}
                                  />
                                )}

                                <div className="space-y-6">
                                  {sorted.map((log, i) => {
                                    const isLast = i === sorted.length - 1;
                                    const currentDate = formatLogDate(log.created_at);
                                    const previousDate = i > 0 ? formatLogDate(sorted[i - 1].created_at) : null;
                                    const showDate = currentDate !== previousDate;

                                    return (
                                      <div key={log.id || i} className="relative flex items-start gap-3">
                                        {/* Dot aligned exactly on line */}
                                        <div className="relative">
                                          <span
                                            className={`block w-3 h-3 rounded-full border-2 ml-2 bg-[#C72030] border-[#C72030]`}
                                          />
                                        </div>

                                        {/* Log Content */}
                                        <div className="text-[12px] leading-snug">
                                          {/* Date on top - only show if different from previous log */}
                                          {showDate && (
                                            <div className="text-[#1A1A1A] text-[16px] font-semibold mb-1">
                                              {currentDate}
                                            </div>
                                          )}

                                          {/* Time, Status, and By on same line */}
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[#6B6B6B] text-[12px]">
                                              {formatLogTime(log.created_at)}
                                            </span>
                                            <span className="font-semibold text-[#1A1A1A] text-[16px]">
                                              {log.log_status === null || log.log_status === undefined || log.log_status === '' ? 'Status Changed' : log.log_status}
                                            </span>
                                            {log.log_by && (
                                              <span className="text-[#1A1A1A] text-[16px]">
                                                By <span className="text-[#1A1A1A]">{log.log_by}</span>
                                              </span>
                                            )}
                                          </div>

                                          {/* Comment below */}
                                          {log.log_comment && (
                                            <div className="text-[#2C2C2C] text-[16px] leading-[20px]">
                                              {log.log_comment}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                </Card>
          </TabsContent>

          <TabsContent value="creator-info" className="p-4 sm:p-6">
            <div className="space-y-6">

              {hasData(ticketData.posted_by) ||
                hasData(ticketData.id_society) ? (
                /* Creator Information Card */
                <Card className="w-full">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                        <User className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <span>CREATOR INFORMATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {hasData(ticketData.posted_by) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Posted By</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.posted_by}</span>
                        </div>
                      )}
                      {hasData(ticketData.id_society) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Society</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.id_society}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No Creator Information Available
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    There is no creator information available to display at this
                    time.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Location Info Tab */}
          <TabsContent value="location-info" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Check if there's any location data to display */}
              {hasData(ticketData.region) ||
                hasData(ticketData.building_name) ||
                hasData(ticketData.floor_name) ||
                hasData(ticketData.flat_number) ||
                hasData(ticketData.unit_name) ||
                hasData(ticketData.zone) ||
                hasData(ticketData.district) ||
                hasData(ticketData.room_name) ||
                hasData(ticketData.area_name) ||
                hasData(ticketData.site_name) ||
                hasData(ticketData.city) ||
                hasData(ticketData.state) ||
                hasData(ticketData.address) ||
                hasData(ticketData.wing_name) ? (
                /* Location Information Card */
                <Card className="w-full">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                        <MapPin className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <span>LOCATION INFORMATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {hasData(ticketData.region) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Region</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.region}</span>
                        </div>
                      )}
                      {hasData(ticketData.building_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Building</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.building_name}</span>
                        </div>
                      )}
                      {hasData(ticketData.floor_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Floor</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.floor_name}</span>
                        </div>
                      )}
                      {hasData(ticketData.flat_number || ticketData.unit_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Flat/Unit</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.flat_number || ticketData.unit_name}</span>
                        </div>
                      )}
                      {hasData(ticketData.zone) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Zone</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.zone}</span>
                        </div>
                      )}
                      {hasData(ticketData.district) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">District</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.district}</span>
                        </div>
                      )}
                      {hasData(ticketData.room_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Room</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.room_name}</span>
                        </div>
                      )}
                      {hasData(ticketData.area_name || ticketData.site_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Area/Site</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.area_name || ticketData.site_name}</span>
                        </div>
                      )}
                      {hasData(ticketData.city) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">City</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.city}</span>
                        </div>
                      )}
                      {hasData(ticketData.state) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">State</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.state}</span>
                        </div>
                      )}
                      {hasData(ticketData.address) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Address</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.address}</span>
                        </div>
                      )}
                      {hasData(ticketData.wing_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Wing</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.wing_name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* No Data Available Message */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No Location Information Available
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    There is no location information available to display at
                    this time.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Survey Info Tab */}
          <TabsContent value="survey-info" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Check if there's any survey data to display */}
              {hasData(ticketData.survey?.survey?.id) ||
                hasData(ticketData.survey?.survey?.name) ||
                hasData(ticketData.survey?.site_name) ||
                hasData(ticketData.survey?.building_name) ||
                hasData(ticketData.survey?.wing_name) ||
                hasData(ticketData.survey?.area_name) ||
                hasData(ticketData.survey?.floor_name) ||
                hasData(ticketData.survey?.room_name) ? (
                /* Survey Information Card */
                <Card className="w-full">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                        <FileSearch className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <span>SURVEY INFORMATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {hasData(ticketData.survey?.survey?.id) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Survey ID</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.survey.survey.id}</span>
                        </div>
                      )}
                      {hasData(ticketData.survey?.survey?.name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Survey Name</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{ticketData.survey.survey.name}</span>
                        </div>
                      )}
                      {(hasData(ticketData.survey?.site_name) || hasData(ticketData.survey?.building_name) || hasData(ticketData.survey?.wing_name) || hasData(ticketData.survey?.area_name) || hasData(ticketData.survey?.floor_name) || hasData(ticketData.survey?.room_name)) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Survey Location</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{[
                            ticketData.survey.site_name,
                            ticketData.survey.building_name,
                            ticketData.survey.wing_name,
                            ticketData.survey.area_name,
                            ticketData.survey.floor_name,
                            ticketData.survey.room_name
                          ].filter(Boolean).join('/')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No survey information available
                </p>
              )}
            </div>
          </TabsContent>

          {/* Additional Info Tab */}
          <TabsContent value="additional-info" className="p-4 sm:p-6">
            <div className="space-y-6">

              {hasData(ticketData.corrective_action) ||
                hasData(ticketData.preventive_action) ||
                hasData(ticketData.root_cause) ||
                hasData(ticketData.response_tat) ||
                hasData(ticketData.ticket_urgency) ||
                hasData(ticketData.responsible_person) ||
                hasData(ticketData.asset_service) ||
                hasData(ticketData.resolution_tat) ||
                hasData(ticketData.task_id) ||
                hasData(ticketData.asset_service_location) ||
                hasData(ticketData.resolution_time) ||
                hasData(ticketData.escalation_response_name) ||
                hasData(ticketData.escalation_resolution_name) ? (
                /* Additional Information Card */
                <Card className="w-full">
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                        <PlusCircle className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <span>ADDITIONAL INFORMATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-sm">
                      {hasData(ticketData.corrective_action) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Corrective Action</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium" title={ticketData.corrective_action}>
                            {truncateWithEllipsis(ticketData.corrective_action, 5)}
                          </span>
                        </div>
                      )}
                      {hasData(ticketData.preventive_action) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Preventive Action</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium" title={ticketData.preventive_action}>
                            {truncateWithEllipsis(ticketData.preventive_action, 5)}
                          </span>
                        </div>
                      )}
                      {hasData(ticketData.root_cause) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Root Cause</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium" title={ticketData.root_cause}>
                            {truncateWithEllipsis(ticketData.root_cause, 5)}
                          </span>
                        </div>
                      )}
                      {hasData(ticketData.response_tat) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Response TAT</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.response_tat}</span>
                        </div>
                      )}
                      {hasData(ticketData.ticket_urgency) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Ticket Urgency</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.ticket_urgency}</span>
                        </div>
                      )}
                      {hasData(ticketData.responsible_person) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Responsible Person</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.responsible_person}</span>
                        </div>
                      )}
                      {hasData(ticketData.asset_service) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Asset Service</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.asset_service}</span>
                        </div>
                      )}
                      {hasData(ticketData.resolution_tat) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Resolution TAT</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.resolution_tat}</span>
                        </div>
                      )}
                      {hasData(ticketData.task_id) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Task ID</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.task_id}</span>
                        </div>
                      )}
                      {hasData(ticketData.asset_service_location) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Asset/Service Location</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.asset_service_location}</span>
                        </div>
                      )}
                      {hasData(ticketData.resolution_time) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Resolution Time</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.resolution_time}</span>
                        </div>
                      )}
                      {(hasData(ticketData.escalation_response_name) || hasData(ticketData.escalation_resolution_name)) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Escalation Tracking</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{`${ticketData.escalation_response_name || ''}, ${ticketData.escalation_resolution_name || ''}`.replace(/^,\s*|,\s*$/g, '')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PlusCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No Additional Information Available
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    There is no additional information available to display at
                    this time.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Attachment Type Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto pb-2">
                <Button
                  variant="default"
                  className="flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 rounded-lg bg-[#FBE8EA] border-[#C72030]"
                >
                  <div className="w-4 h-4 rounded flex-shrink-0 bg-red-700"></div>
                  <span className="text-sm font-medium text-[#C72030]">
                    Ticket Attachments
                  </span>
                  <span className="text-xs text-[#C72030]">
                    {ticketData.documents?.length || 0} Files
                  </span>
                </Button>
              </div>

              {/* Files Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Files</h3>

                {ticketData.documents && ticketData.documents.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ticketData.documents.map((document, index) => {
                      // Updated to use the correct field name from API response
                      const documentUrl =
                        document.document ||
                        document.document_url ||
                        document.url ||
                        document.attachment_url;
                      const fileExtension =
                        documentUrl?.split(".").pop()?.toLowerCase() ||
                        document.doctype?.split("/").pop()?.toLowerCase() ||
                        "";
                      const isImage =
                        ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(
                          fileExtension
                        ) || document.doctype?.startsWith("image/");
                      const isPdf =
                        fileExtension === "pdf" ||
                        document.doctype === "application/pdf";
                      const isExcel =
                        ["xls", "xlsx", "csv"].includes(fileExtension) ||
                        document.doctype?.includes("spreadsheet") ||
                        document.doctype?.includes("excel");

                      console.log("📄 Document processing:", {
                        id: document.id,
                        documentUrl,
                        doctype: document.doctype,
                        fileExtension,
                        isImage,
                        isPdf,
                        document,
                      });

                      return (
                        <div
                          key={document.id || index}
                          className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                        >
                          {/* File Preview */}
                          <div
                            className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center border overflow-hidden cursor-pointer"
                            onClick={() => {
                              if (documentUrl && isImage) {
                                // Set selectedDoc for AttachmentPreviewModal
                                setSelectedDoc({
                                  id: document.id || 0,
                                  document_name: document.document_name || document.document_file_name || `Document ${index + 1}`,
                                  url: documentUrl,
                                });
                                setShowImagePreview(true);
                              }
                            }}
                          >
                            {isImage ? (
                              <img
                                src={documentUrl}
                                alt={`Document ${index + 1}`}
                                className="object-contain w-full h-full rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  (
                                    target.nextSibling as HTMLElement
                                  ).style.display = "flex";
                                }}
                              />
                            ) : isPdf ? (
                              <FileIcon className="w-8 h-8 text-red-600" />
                            ) : isExcel ? (
                              <FileSpreadsheet className="w-8 h-8 text-green-600" />
                            ) : (
                              <FileText className="w-8 h-8 text-gray-600" />
                            )}

                            {/* Fallback for failed image loads */}
                            <div
                              className="w-full h-full items-center justify-center"
                              style={{ display: "none" }}
                            >
                              <FileText className="w-8 h-8 text-gray-600" />
                            </div>
                          </div>

                          {/* File Name */}
                          <p className="text-sm text-gray-700 text-center font-medium break-all mb-2">
                            {`Document_${document.id || index + 1}.${fileExtension || "file"
                              }`}
                          </p>

                          {/* Download Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-auto text-xs px-2 py-1"
                            onClick={async () => {
                              console.log(
                                "📎 Download attempt using new API:",
                                {
                                  id: document.id,
                                  doctype: document.doctype,
                                  document,
                                }
                              );

                              if (!document.id) {
                                console.error("No document ID found", document);
                                toast.error(
                                  "Unable to download: No document ID found"
                                );
                                return;
                              }

                              try {
                                // Check if we're in a browser environment
                                if (
                                  typeof window === "undefined" ||
                                  !window.document
                                ) {
                                  throw new Error(
                                    "Download not supported in this environment"
                                  );
                                }

                                // Import API_CONFIG to get the base URL
                                const { API_CONFIG } = await import(
                                  "@/config/apiConfig"
                                );
                                const baseUrl = API_CONFIG.BASE_URL;
                                const token = localStorage.getItem("token");

                                // Clean up base URL - ensure it doesn't have protocol and has no trailing slash
                                const cleanBaseUrl = baseUrl
                                  .replace(/^https?:\/\//, "")
                                  .replace(/\/$/, "");
                                const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${document.id}?show_file=true`;

                                console.log(
                                  "🔗 New API download URL:",
                                  downloadUrl
                                );

                                // Try authenticated download
                                const response = await fetch(downloadUrl, {
                                  method: "GET",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "*/*",
                                  },
                                  mode: "cors",
                                });

                                if (response.ok) {
                                  const blob = await response.blob();

                                  // Get file extension from doctype or original URL
                                  const fileExtension =
                                    document.doctype?.split("/").pop() ||
                                    document.document
                                      ?.split(".")
                                      .pop()
                                      ?.toLowerCase() ||
                                    "file";
                                  const documentName = `document_${document.id}.${fileExtension}`;

                                  // Create download link using window.document
                                  const url = window.URL.createObjectURL(blob);
                                  const link =
                                    window.document.createElement("a");
                                  link.href = url;
                                  link.download = documentName;
                                  link.style.display = "none";
                                  window.document.body.appendChild(link);
                                  link.click();

                                  // Cleanup
                                  setTimeout(() => {
                                    window.document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  }, 100);

                                  toast.success("File downloaded successfully");
                                  return;
                                } else {
                                  console.error(
                                    "Download failed with status:",
                                    response.status
                                  );
                                  throw new Error(
                                    `HTTP ${response.status}: ${response.statusText}`
                                  );
                                }
                              } catch (error) {
                                console.error("Error downloading file:", error);
                                toast.error(
                                  `Failed to download file: ${error.message}`
                                );
                              }
                            }}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    No files available.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Image Preview Modal - Using AttachmentPreviewModal Component */}

          {/* Cost Approval Tab */}
          <TabsContent value="cost-approval" className="p-4 sm:p-6">
            {ticketData.cost_approval_enabled &&
              ticketData.requests &&
              ticketData.requests.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>L1</TableHead>
                      <TableHead>L2</TableHead>
                      <TableHead>L3</TableHead>
                      <TableHead>L4</TableHead>
                      <TableHead>L5</TableHead>
                      <TableHead>Master Status</TableHead>
                      <TableHead>Cancelled By</TableHead>
                      <TableHead>Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketData.requests.map((request, index) => (
                      <TableRow key={`log-${index}`}>
                        <TableCell className="font-medium">
                          {request.id || `REQ-${index + 1}`}
                        </TableCell>
                        <TableCell>
                          ₹{parseFloat(request.amount || '0').toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {request.comment || "No comments"}
                        </TableCell>
                        <TableCell>
                          {request.created_on ||
                            request.created_at ||
                            "Not Provided"}
                        </TableCell>
                        <TableCell>
                          {request.created_by || "Not Provided"}
                        </TableCell>
                        <TableCell>{request.approvals?.L1 || "-"}</TableCell>
                        <TableCell>{request.approvals?.L2 || "-"}</TableCell>
                        <TableCell>{request.approvals?.L3 || "-"}</TableCell>
                        <TableCell>{request.approvals?.L4 || "-"}</TableCell>
                        <TableCell>{request.approvals?.L5 || "-"}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            {request.master_status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.cancelled_by || "-"}</TableCell>
                        <TableCell>
                          {request.attachments && request.attachments.length > 0 && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Check if request has attachments
                                  if (
                                    request.attachments &&
                                    request.attachments.length > 0
                                  ) {
                                    const attachment = request.attachments[0]; // Take first attachment
                                    const imageUrl = attachment.document || attachment.url;
                                    if (imageUrl) {
                                      // Set selectedDoc for AttachmentPreviewModal
                                      setSelectedDoc({
                                        id: attachment.id || 0,
                                        document_name: `Cost Approval Request ${request.id || index + 1}`,
                                        url: imageUrl,
                                        document_url: imageUrl,
                                        document: imageUrl,
                                      });
                                      setShowImagePreview(true);
                                    }
                                  } else {
                                    toast.error(
                                      "No attachments found for this request"
                                    );
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {ticketData.cost_approval_enabled
                  ? "No cost approval requests found"
                  : "Cost approval not enabled for this ticket"}
              </p>
            )}
          </TabsContent>

          {/* Action Logs Tab */}
          <TabsContent value="action-logs" className="p-4 sm:p-6">
            {complaintLogs.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Comments</TableHead>
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
                        <TableCell className="text-sm">
                          {log.log_by || "System"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.priority || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.log_comment && log.log_comment.length > 5 ? (
                            <Tooltip title={log.log_comment} arrow>
                              <span className="cursor-help">
                                {log.log_comment.substring(0, 5)}...
                              </span>
                            </Tooltip>
                          ) : (
                            log.log_comment || "No comments"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No action logs found
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Preview Modal */}
      <AttachmentPreviewModal
        isModalOpen={showImagePreview}
        setIsModalOpen={setShowImagePreview}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
}
