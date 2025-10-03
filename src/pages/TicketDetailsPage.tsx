import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, FileText, Star, Flag, Paperclip, Download, Eye, ChevronDown, ChevronUp, User, MapPin, FileSearch, PlusCircle, ClipboardList, DollarSign, History, FileSpreadsheet, X, Edit, FileIcon, Check, Minus, MessageSquare } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';

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

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [costInvolveEnabled, setCostInvolveEnabled] = useState<boolean>(false);
  const [costRows, setCostRows] = useState<Array<{
    id: number;
    quotation: string;
    vendor: string;
    description: string;
    cost: string;
    attachment: string;
  }>>([
    { id: 1, quotation: '', vendor: '', description: '', cost: '', attachment: '' }
  ]);

  // (Add handlers near other handlers)
  const addCostRow = () => {
    setCostRows(prev => [...prev, {
      id: Date.now(),
      quotation: '',
      vendor: '',
      description: '',
      cost: '',
      attachment: ''
    }]);
  };
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

  const tatGridRows = [
    [
      { label: 'Response TAT', value: hasData(ticketData.response_tat) ? ticketData.response_tat : 'DD:HH:MM' },
      { label: 'Balance TAT', value: 'DD:HH:MM' },
      { label: 'Escalation', value: 'E1 Abdul Ghaffar' },
    ],
    [
      { label: 'Resolution TAT', value: hasData(ticketData.resolution_tat) ? ticketData.resolution_tat : 'DD:HH:MM' },
      { label: 'Balance TAT', value: 'DD:HH:MM' },
      { label: 'Escalation', value: 'E1 Abdul Ghaffar' },
    ],
  ];

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
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {ticketData.heading || "Ticket Summary"}
              </h1>
            </div>

            <div className="text-sm text-gray-600">
              Ticket #{ticketData.ticket_number || "N/A"} • Created by{" "}
              {ticketData.created_by_name || "Unknown"} • Last updated{" "}
              {ticketData.updated_at || "N/A"}
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

            <TabsTrigger
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
            </TabsTrigger>

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
              Action Logs
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
                              <div key="red-flag" className="flex items-center justify-center w-full">
                                Red Flag
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" style={{ marginLeft: "4px" }} viewBox="0 0 13 16" fill="none">
                                  <path d="M1 8.5V15.5C1 15.642 0.952 15.7607 0.856 15.856C0.76 15.9513 0.641 15.9993 0.499 16C0.357 16.0007 0.238333 15.9527 0.143 15.856C0.0476668 15.7593 0 15.6407 0 15.5V1.308C0 1.07934 0.0773332 0.887338 0.232 0.732004C0.386667 0.576671 0.578667 0.499338 0.808 0.500004H6.521C6.71433 0.500004 6.887 0.559004 7.039 0.677004C7.191 0.795004 7.28567 0.951671 7.323 1.147L7.593 2.5H12.193C12.4217 2.5 12.6133 2.57667 12.768 2.73C12.9227 2.88334 13 3.07334 13 3.3V9.7C13 9.92667 12.9227 10.1167 12.768 10.27C12.6133 10.4233 12.4213 10.5 12.192 10.5H8.48C8.28667 10.5 8.114 10.441 7.962 10.323C7.81 10.205 7.71533 10.0483 7.678 9.853L7.407 8.5H1Z" fill="#C72030" />
                                </svg>

                              </div>,
                              <div key="golden-ticket" className="flex items-center justify-center gap-1">
                                Golden Ticket
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                  <path d="M10.5005 3L8.54219 7.8L3.36719 8.18333L7.33385 11.5333L6.09219 16.5667L10.5005 13.8333L14.9089 16.5667L13.6672 11.5333L17.6339 8.18333L12.4589 7.8L10.5005 3Z" fill="#CCC500" stroke="#CCC500" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>,
                              "Attachments"
                            ].map((header, idx) => (
                              <th
                                key={idx}
                                className="p-4 text-center text-black font-semibold text-lg border border-gray-300"
                                style={{ backgroundColor: "#EDEAE3", textAlign: "center" }}
                              >
                                {header}
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
                              {ticketData?.priority === 'High' || ticketData?.priority === 'Critical' ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.issue_status === 'Closed' && ticketData?.priority === 'High' ? (
                                <Check className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="p-4 text-center border border-gray-300 bg-white">
                              {ticketData?.documents.length > 0 ? (
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
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M12 6v6l4 2"
                            stroke="#C72030"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Ticket Ageing
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
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
                            strokeWidth="1.5"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Response TAT
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
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
                            strokeWidth="1.5"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Resolution TAT
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
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
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                          <path
                            d="m12 6 0 6 4 2"
                            stroke="#C72030"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Response Escalation
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
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
                            strokeWidth="1.5"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Resolution Escalation
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
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
                            strokeWidth="1.5"
                          />
                          <path
                            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                            stroke="#C72030"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className="font-semibold text-[#1A1A1A]"
                          style={{ fontSize: 24 }}
                        >
                          00:00:00
                        </span>
                        <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
                          Golden Ticket Escalation
                        </span>
                        <span className="text-[12px] text-[#9CA3AF] mt-1">
                          E1 - Abdul Ghaffar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Ticket Details - Full Width */}
              <TabsContent value="details" className="space-y-8">
                {/* <div className="space-y-6">
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
                      <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                          <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-black">
                          Ticket Information
                        </h3>
                      </div>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {hasData(ticketData.ticket_number) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Ticket Number</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.ticket_number}</span>
                            </div>
                          )}
                          {hasData(ticketData.heading) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Title</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} title={ticketData.heading}>{ticketData.heading}</span>
                            </div>
                          )}
                          {hasData(ticketData.category_type) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Category</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.category_type}</span>
                            </div>
                          )}
                          {hasData(ticketData.sub_category_type) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">SubCategory</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.sub_category_type}</span>
                            </div>
                          )}
                          {hasData(ticketData.issue_status) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Status</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium"><Badge className="bg-yellow-100 text-yellow-700">{ticketData.issue_status}</Badge></span>
                            </div>
                          )}
                          {hasData(ticketData.created_by_name) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Created By</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.created_by_name}</span>
                            </div>
                          )}
                          {(hasData(ticketData.created_date) || hasData(ticketData.created_time) || hasData(ticketData.created_at)) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Created On</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">
                                {ticketData.created_at
                                  ? new Date(ticketData.created_at).toLocaleString()
                                  : `${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim()
                                }
                              </span>
                            </div>
                          )}
                          {hasData(ticketData.updated_by) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Updated By</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.updated_by}</span>
                            </div>
                          )}
                          {hasData(ticketData.complaint_mode) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Complaint Mode</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.complaint_mode}</span>
                            </div>
                          )}
                          {hasData(ticketData.priority || ticketData.external_priority) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Priority</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.priority || ticketData.external_priority}</span>
                            </div>
                          )}
                          {hasData(ticketData.priority_status || ticketData.effective_priority) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Admin Priority</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.priority_status || ticketData.effective_priority}</span>
                            </div>
                          )}
                          {hasData(ticketData.assigned_to) && (
                            <div className="flex items-center">
                              <span className="text-gray-500 min-w-[140px]">Assigned To</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{ticketData.assigned_to}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
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
                </div> */}

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
                    /* Ticket Information Card */
                    <Card className="w-full">
                      <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                          <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
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
                                <span className="text-gray-500 min-w-[140px]" style={{ fontSize: '14px' }}>Description</span>
                                <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>The air conditioner is not functioning properly it is not cooling, turning on, or responding to controls. Immediate inspection and servicing are required. The air conditioner is not functioning properly it is not cooling, turning on.</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="">
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[140px]" style={{ fontSize: '14px' }}>Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>Washroom</span>
                                  </div>
                                  <div className="flex items-start mb-4">
                                    <span className="text-gray-500 min-w-[140px]" style={{ fontSize: '14px' }}>Sub Category</span>
                                    <span className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>Washroom</span>
                                  </div>
                                </div>
                                <div className="bg-white rounded-md p-3" style={{ width: '75%' }}>
                                  <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                                    {tatGridRows.flat().map((cell, idx) => (
                                      <div key={idx} className="flex ">
                                        <span className=" w-[150px] text-[14px] leading-tight text-gray-500 tracking-wide pr-2">
                                          {cell.label}
                                        </span>
                                        <span className="text-[13px] md:text-[14px] font-semibold text-gray-900 ml-8">
                                          {cell.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'center', marginLeft: '40px' }}>
                            <button className='w-full py-1 bg-black rounded-full text-white mb-2'>open</button>
                            <div className='mb-2'>
                              <button className='w-full py-1 bg-[#FFCFCF] rounded-full text-white'>p1</button>
                            </div>
                            <div className="flex mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <mask id="mask0_9118_15345" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="0" width="20" height="23">
                                  <path d="M12 21.9995C16.6945 21.9995 20.5 18.194 20.5 13.4995C20.5 8.80501 16.6945 4.99951 12 4.99951C7.3055 4.99951 3.5 8.80501 3.5 13.4995C3.5 18.194 7.3055 21.9995 12 21.9995Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round" />
                                  <path d="M15.5 1.99951H8.5M19 4.99951L17.5 6.49951" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M12 9V13.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </mask>
                                <g mask="url(#mask0_9118_15345)">
                                  <path d="M0 0H24V24H0V0Z" fill="#434343" />
                                </g>
                              </svg>
                              <span style={{ fontSize: 16, fontWeight: 600 }} className="text-black ml-1">
                                09:06
                              </span>
                            </div>
                            <div className="flex justify-center items-center gap-2 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                <path d="M12.36 9.76C14.31 10.42 16 11.5 16 13V18H0V13C0 11.5 1.69 10.42 3.65 9.76L4.27 11L4.5 11.5C3 11.96 1.9 12.62 1.9 13V16.1H6.12L7 11.03L6.06 9.15C6.68 9.08 7.33 9.03 8 9.03C8.67 9.03 9.32 9.08 9.94 9.15L9 11.03L9.88 16.1H14.1V13C14.1 12.62 13 11.96 11.5 11.5L11.73 11L12.36 9.76ZM8 2C6.9 2 6 2.9 6 4C6 5.1 6.9 6 8 6C9.1 6 10 5.1 10 4C10 2.9 9.1 2 8 2ZM8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0C10.21 0 12 1.79 12 4C12 6.21 10.21 8 8 8Z" fill="black" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                                <path d="M17.6219 20.0977C17.5715 20.0977 17.5214 20.085 17.4765 20.0585L10.9967 16.2938L4.5084 20.0459C4.46385 20.0719 4.41384 20.0844 4.36383 20.0844C4.3057 20.0844 4.24792 20.0676 4.19919 20.0329C4.10788 19.9695 4.06564 19.8599 4.09105 19.7548L5.82438 12.6847L0.0968238 7.92979C0.011544 7.85906 -0.0211751 7.74629 0.013865 7.64365C0.0486731 7.54111 0.144281 7.4686 0.256711 7.45937L7.80786 6.85484L10.756 0.164147C10.7997 0.0643917 10.9014 0 11.0139 0C11.0141 0 11.0143 0 11.0143 0C11.127 0 11.2288 0.0649467 11.2721 0.164479L14.2058 6.86118L21.7552 7.48095C21.8678 7.49029 21.9631 7.56302 21.9981 7.66555C22.0328 7.7682 22 7.88108 21.9144 7.95136L16.1762 12.6948L17.8943 19.7686C17.9202 19.8736 17.8774 19.983 17.7858 20.0464C17.7373 20.0806 17.6793 20.0977 17.6219 20.0977Z" fill="url(#paint0_radial_9118_15308)" />
                                <path d="M17.6229 19.896C17.6103 19.896 17.5977 19.8926 17.5864 19.8862L10.998 16.0584L4.40068 19.8732C4.38954 19.8795 4.37736 19.8826 4.36471 19.8826C4.35021 19.8826 4.3357 19.879 4.32352 19.8696C4.30055 19.8541 4.2901 19.8267 4.2966 19.8006L6.05905 12.6117L0.235078 7.77705C0.213845 7.75947 0.205725 7.73112 0.214311 7.7052C0.223361 7.67996 0.247029 7.66172 0.275107 7.65972L7.95284 7.04474L10.9502 0.241834C10.9614 0.216923 10.9866 0.200684 11.0147 0.200684C11.0147 0.200684 11.0147 0.200684 11.0149 0.200684C11.0432 0.200684 11.0685 0.217032 11.0794 0.241943L14.062 7.05063L21.7385 7.68085C21.7665 7.68307 21.7902 7.70121 21.7992 7.72701C21.8076 7.75281 21.7994 7.78105 21.7783 7.7984L15.9439 12.6213L17.6909 19.8137C17.6973 19.8397 17.6862 19.8674 17.6638 19.883C17.6512 19.8916 17.6371 19.896 17.6229 19.896Z" fill="url(#paint1_linear_9118_15308)" />
                                <path d="M7.99743 7.10811L11.0112 0.268066L14.0103 7.11412L21.7291 7.7479L15.8627 12.5975L17.6192 19.8291L10.9944 15.9802L4.36114 19.8159L6.13322 12.5877L0.277344 7.72644L7.99743 7.10811Z" fill="url(#paint2_linear_9118_15308)" />
                                <path d="M11.1891 11.551C11.1439 11.4959 11.0748 11.4633 11.0016 11.4633C11.0013 11.4633 11.0013 11.4633 11.0009 11.4633C10.928 11.4633 10.8587 11.4956 10.8138 11.5507L8.37693 14.534L10.5906 11.395C10.6317 11.3368 10.6425 11.2637 10.6201 11.197C10.5972 11.1303 10.5441 11.0772 10.4752 11.053L6.76172 9.75321L10.5606 10.8015C10.5824 10.8077 10.6044 10.8107 10.6263 10.8107C10.6762 10.8107 10.7253 10.7958 10.7663 10.7672C10.8257 10.7258 10.8619 10.6606 10.8644 10.5904L11.0063 6.80371L11.1405 10.5907C11.143 10.6611 11.179 10.7263 11.2382 10.7677C11.2793 10.7962 11.3287 10.8113 11.3782 10.8113C11.4 10.8113 11.4222 10.8084 11.4438 10.8026L15.245 9.76189L11.5286 11.054C11.4599 11.0783 11.4064 11.1311 11.3835 11.1977C11.3608 11.2647 11.3714 11.3376 11.4124 11.396L13.6195 14.5391L11.1891 11.551Z" fill="white" />
                                <path d="M10.6435 10.0628L8.08027 6.91957L11.0111 0.267578L10.6435 10.0628ZM21.7289 7.74752H21.7291L14.2765 7.13554L11.9655 10.4201L21.7289 7.74752ZM9.90642 11.0964L0.277344 7.72606L5.98598 12.4647L9.90642 11.0964ZM11.961 11.7709L17.6192 19.8288L15.9261 12.8597L11.961 11.7709ZM4.36114 19.8153L10.7915 16.0971L10.6454 12.1225L4.36114 19.8153Z" fill="url(#paint3_linear_9118_15308)" />
                                <path d="M11.3577 10.0658L11.0112 0.267578L13.9241 6.91623L11.3577 10.0658ZM7.72152 7.12998L0.277344 7.72606L10.0372 10.4191L7.72152 7.12998ZM21.7289 7.74752L12.0992 11.0962L16.0235 12.464L21.7289 7.74752ZM11.2154 16.1082L17.6191 19.8288L11.3594 12.1331L11.2154 16.1082ZM10.0325 11.7743L6.06523 12.8657L4.36126 19.8154V19.8152L10.0325 11.7743Z" fill="url(#paint4_linear_9118_15308)" />
                                <defs>
                                  <radialGradient id="paint0_radial_9118_15308" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.0059 10.0489) scale(10.7481 10.3019)">
                                    <stop stop-color="#D08B01" />
                                    <stop offset="0.5758" stop-color="#F2B145" />
                                    <stop offset="1" stop-color="#F8F3BC" />
                                  </radialGradient>
                                  <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F6DB89" />
                                    <stop offset="1" stop-color="#F8F7DA" />
                                  </linearGradient>
                                  <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ED9017" />
                                    <stop offset="0.1464" stop-color="#F09F23" />
                                    <stop offset="0.4262" stop-color="#F6C642" />
                                    <stop offset="0.4945" stop-color="#F8D04A" />
                                    <stop offset="1" stop-color="#F6E6B5" />
                                  </linearGradient>
                                  <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#ED9017" />
                                    <stop offset="0.1464" stop-color="#F09F23" />
                                    <stop offset="0.4262" stop-color="#F6C642" />
                                    <stop offset="0.4945" stop-color="#F8D04A" />
                                    <stop offset="1" stop-color="#F6E6B5" />
                                  </linearGradient>
                                  <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DF8D00" />
                                    <stop offset="0.0848" stop-color="#FFD006" />
                                    <stop offset="0.2242" stop-color="#F4AD06" />
                                    <stop offset="0.85" stop-color="#F4AD06" />
                                    <stop offset="0.8777" stop-color="#F2A807" />
                                    <stop offset="0.9093" stop-color="#EC9B09" />
                                    <stop offset="0.9428" stop-color="#E2840D" />
                                    <stop offset="0.9773" stop-color="#D46412" />
                                    <stop offset="1" stop-color="#C94B16" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                                <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                              </svg>

                            </div>
                          </div>

                        </div>

                      </div>
                      <CardContent className="pt-6">
                        {[
                          [
                            { label: 'Issue Type', value: hasData(ticketData.issue_type) ? ticketData.issue_type : 'Complain' },
                            { label: 'Assigned To', value: hasData(ticketData.assigned_to) ? ticketData.assigned_to : 'Abdul Ghaffar' },
                            { label: 'Behalf Of', value: hasData(ticketData.behalf_of) ? ticketData.behalf_of : 'Samuel (Occupant)' },
                            { label: 'Association', value: hasData(ticketData.association) ? ticketData.association : 'Asset' },
                          ],
                          [
                            { label: 'Created By', value: hasData(ticketData.created_by_name) ? ticketData.created_by_name : 'Abdul Ghaffar' },
                            { label: 'Updated By', value: hasData(ticketData.updated_by) ? ticketData.updated_by : 'Abdul Ghaffar' },
                            { label: 'Mode', value: hasData(ticketData.complaint_mode) ? ticketData.complaint_mode : 'App' },
                            { label: 'Identification', value: hasData(ticketData.identification) ? ticketData.identification : 'Reactive / Proactive' },
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

                {/* Location Details */}
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
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

                      <div className="flex justify-between items-start relative z-10">
                        {[
                          { label: "Site", value: ticketData.site_name || "NA" },
                          { label: "Building", value: ticketData.building_name || "NA" },
                          { label: "Wing", value: ticketData.wing_name || "NA" },
                          { label: "Floor", value: ticketData.floor_name || "NA" },
                          { label: "Area", value: ticketData.area_name || "NA" },
                          { label: "Room", value: ticketData.room_name || "NA" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center w-full text-center"
                          >
                            <div className="text-sm text-gray-500 mb-2 mt-1">
                              {item.label}
                            </div>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-1" />
                            <div className="mt-2 text-base font-medium text-[#1A1A1A] break-words px-2">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] px-5 py-3 border border-[#D9D9D9] rounded-t-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <ClipboardList className="w-4 h-4 text-[#C72030]" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-wide text-[#1A1A1A]">
                      Association
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-8 text-[12px]">
                      {[
                        { label: 'Asset Name', value: ticketData.asset_name || '—' },
                        { label: 'Group', value: ticketData.asset_group || '—' },
                        { label: 'Status', value: ticketData.asset_status || '—' },
                        { label: 'Criticality', value: ticketData.asset_criticality || 'Critical/Non critical' },

                        { label: 'Asset ID', value: ticketData.asset_id || '—' },
                        { label: 'Sub group', value: ticketData.asset_sub_group || '—' },
                        { label: 'AMC Status', value: ticketData.asset_amc_status || 'Active/Inactive' },
                        { label: 'Under Warranty', value: hasData(ticketData.asset_under_warranty) ? ticketData.asset_under_warranty : 'Yes/No' },

                        { label: 'Category', value: ticketData.asset_category || '—' },
                        { label: 'Allocated', value: hasData(ticketData.asset_allocated) ? ticketData.asset_allocated : '—' },
                        { label: 'AMC Type', value: ticketData.asset_amc_type || 'Comprehensive' },
                        { label: 'Warranty Expiry', value: ticketData.asset_warranty_expiry || 'DD/MM/YYYY' },
                      ].map(field => (
                        <div key={field.label} className="flex flex-col">
                          <span className="text-[14px] tracking-wide text-[#6B6B6B] mb-1">
                            {field.label}
                          </span>
                          <span className="text-[14px] font-semibold text-[#1A1A1A] break-words">
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header (consistent) */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        Ticket Management
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-[#4BE2B9]" />
                    </div>
                    <div className="flex items-center gap-2">
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
                              <stop stop-color="#D08B01" />
                              <stop offset="0.5758" stop-color="#F2B145" />
                              <stop offset="1" stop-color="#F8F3BC" />
                            </radialGradient>
                            <linearGradient id="paint1_linear_9118_15308" x1="0.211178" y1="10.0483" x2="21.8026" y2="10.0483" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#F6DB89" />
                              <stop offset="1" stop-color="#F8F7DA" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_9118_15308" x1="0.277344" y1="10.0486" x2="21.7291" y2="10.0486" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#ED9017" />
                              <stop offset="0.1464" stop-color="#F09F23" />
                              <stop offset="0.4262" stop-color="#F6C642" />
                              <stop offset="0.4945" stop-color="#F8D04A" />
                              <stop offset="1" stop-color="#F6E6B5" />
                            </linearGradient>
                            <linearGradient id="paint3_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7291" y2="10.0482" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#ED9017" />
                              <stop offset="0.1464" stop-color="#F09F23" />
                              <stop offset="0.4262" stop-color="#F6C642" />
                              <stop offset="0.4945" stop-color="#F8D04A" />
                              <stop offset="1" stop-color="#F6E6B5" />
                            </linearGradient>
                            <linearGradient id="paint4_linear_9118_15308" x1="0.277344" y1="10.0482" x2="21.7288" y2="10.0482" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#DF8D00" />
                              <stop offset="0.0848" stop-color="#FFD006" />
                              <stop offset="0.2242" stop-color="#F4AD06" />
                              <stop offset="0.85" stop-color="#F4AD06" />
                              <stop offset="0.8777" stop-color="#F2A807" />
                              <stop offset="0.9093" stop-color="#EC9B09" />
                              <stop offset="0.9428" stop-color="#E2840D" />
                              <stop offset="0.9773" stop-color="#D46412" />
                              <stop offset="1" stop-color="#C94B16" />
                            </linearGradient>
                          </defs>
                        </svg>

                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#EDEAE3]"
                        title="Flag"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                          <path d="M8.73145 0.5C8.85649 0.5 8.96486 0.537942 9.07324 0.630859C9.18052 0.722846 9.24902 0.836423 9.28125 0.990234V0.991211L9.54785 2.33301L9.62793 2.73535H14.9453C15.1136 2.73541 15.2354 2.78882 15.3438 2.90234C15.4533 3.01712 15.5121 3.1555 15.5117 3.35156V12.2939C15.5117 12.4916 15.4524 12.6312 15.3428 12.7461C15.2344 12.8596 15.1132 12.9125 14.9463 12.9121H9.4248C9.29987 12.9121 9.1923 12.8731 9.08398 12.7803C8.9758 12.6875 8.90589 12.5728 8.87402 12.417L8.6084 11.0791L8.52832 10.6768H1.64551V17.8828C1.64542 18.0801 1.58599 18.2192 1.47656 18.334C1.36825 18.4475 1.24682 18.5003 1.08008 18.5C0.911684 18.4996 0.788548 18.4457 0.679688 18.332C0.570877 18.2183 0.511811 18.08 0.511719 17.8828V1.11719C0.51181 0.919961 0.570878 0.781717 0.679688 0.667969C0.761428 0.582619 0.851184 0.531283 0.961914 0.510742L1.08008 0.5H8.73145Z" fill="#C72030" stroke="#C72030" />
                        </svg>
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-[12px] border-[#D9D9D9] hover:bg-[#F6F4EE]"
                        onClick={handleUpdate}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>

                  {/* Body (consistent background / border like Location card) */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    {(() => {
                      const mgmtFields = [
                        { label: 'Update Status', value: ticketData.issue_status || 'Pending' },
                        { label: 'Severity', value: ticketData.severity || 'Major/Minor' },
                        { label: 'Select Vendor', value: ticketData.vendor_name || 'Abdul Ghaffar' },
                        { label: 'Assigned To', value: ticketData.assigned_to || 'Abdul Ghaffar' },
                        { label: 'Source', value: ticketData.association || 'Asset' },

                        { label: 'Expected Visit Date', value: formatDate(ticketData.expected_visit_date) },
                        { label: 'Expected Completion Date', value: formatDate(ticketData.expected_completion_date) },
                        { label: 'Scope', value: ticketData.scope || 'Maintenance/Project' },
                        { label: 'Mode', value: ticketData.complaint_mode || 'App' },
                        { label: 'Identification', value: ticketData.identification || 'Reactive / Proactive' },
                      ];

                      // Split into two vertical columns
                      const midpoint = Math.ceil(mgmtFields.length / 2);
                      const colA = mgmtFields.slice(0, midpoint);
                      const colB = mgmtFields.slice(midpoint);

                      return (
                        <div className="flex flex-col lg:flex-row gap-10">
                          {/* Left: two vertical columns of key/value pairs */}
                          <div className="flex-1 flex gap-16">
                            {[colA, colB].map((col, ci) => (
                              <div key={ci} className="flex flex-col gap-4 min-w-[210px]">
                                {col.map(f => (
                                  <div key={f.label} className="flex text-[14px] leading-snug">
                                    <span className="text-[#6B6B6B] w-[120px] shrink-0">
                                      {f.label}
                                    </span>
                                    <span className="ml-2 text-[14px] font-semibold text-[#1A1A1A]">
                                      {f.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Right: Root Cause + Notes (stacked) */}
                          <div className="w-full lg:w-[38%] flex flex-col gap-8">
                            <div className="flex flex-col">
                              <FormControl
                                fullWidth
                                variant="outlined"
                                sx={fieldStyles}
                              >
                                <InputLabel shrink>Root Cause Analysis</InputLabel>
                                <Select
                                  label="Root Cause Analysis"
                                  notched
                                  displayEmpty
                                  value={ticketData.root_cause || ''}
                                  onChange={() => { }}
                                >
                                  <MenuItem value="">Select Root Cause Analysis</MenuItem>
                                  <MenuItem value="Pipe broken">Pipe broken</MenuItem>
                                  <MenuItem value="Short circuit">Short circuit</MenuItem>
                                  <MenuItem value="Transformer breakdown">Transformer breakdown</MenuItem>
                                  <MenuItem value="Short circuit">Short circuit</MenuItem>
                                </Select>
                              </FormControl>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[11px] tracking-wide text-[#6B6B6B] mb-1">
                                Additional Notes
                              </span>
                              <div className="text-[12.5px] font-medium text-[#1A1A1A] leading-[16px] max-h-32 overflow-auto pr-1">
                                {ticketData.heading ||
                                  'The Air Conditioner Is Not Functioning Properly It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Card>

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] px-5 py-3 border border-[#D9D9D9] rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <DollarSign className="w-4 h-4 text-[#C72030]" />
                      </div>
                      <h3 className="text-sm font-semibold tracking-wide text-[#1A1A1A]">
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
                        <div key={row.id} className="mb-4 last:mb-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                              <div className="bg-[#F2F2F2] border border-[#DAD7D0] px-2 pt-1 pb-2">
                                <label className="block text-[10px] tracking-wide text-[#5B5B5B] mb-0.5">
                                  Quotation
                                </label>
                                <input
                                  className="w-full h-8 px-2 text-[11px] bg-transparent outline-none"
                                  placeholder="Enter Quotation 1"
                                  value={row.quotation}
                                  onChange={e =>
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, quotation: e.target.value } : r)
                                    )
                                  }
                                />
                              </div>
                              <div className="bg-[#F2F2F2] border border-[#DAD7D0] px-2 pt-1 pb-2">
                                <label className="block text-[10px] tracking-wide text-[#5B5B5B] mb-0.5">
                                  Cost
                                </label>
                                <input
                                  className="w-full h-8 px-2 text-[11px] bg-transparent outline-none"
                                  placeholder="Enter Cost"
                                  value={row.cost}
                                  onChange={e =>
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, cost: e.target.value } : r)
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-4">
                              <div className="bg-[#F2F2F2] border border-[#DAD7D0] px-2 pt-1 pb-2">
                                <label className="block text-[10px] tracking-wide text-[#5B5B5B] mb-0.5">
                                  Vendor
                                </label>
                                <input
                                  className="w-full h-8 px-2 text-[11px] bg-transparent outline-none"
                                  placeholder="Enter Vendor"
                                  value={row.vendor}
                                  onChange={e =>
                                    setCostRows(prev =>
                                      prev.map(r => r.id === row.id ? { ...r, vendor: e.target.value } : r)
                                    )
                                  }
                                />
                              </div>
                              <div className="bg-[#F2F2F2] border border-[#DAD7D0] px-2 pt-1 pb-2">
                                <label className="block text-[10px] tracking-wide text-[#5B5B5B] mb-0.5">
                                  Attachment
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    className="w-full h-8 px-2 text-[11px] bg-transparent outline-none"
                                    placeholder="Attachment"
                                    value={row.attachment}
                                    onChange={e =>
                                      setCostRows(prev =>
                                        prev.map(r => r.id === row.id ? { ...r, attachment: e.target.value } : r)
                                      )
                                    }
                                  />
                                  <Paperclip className="w-4 h-4 text-gray-500" />
                                </div>
                              </div>
                            </div>

                            {/* Right Column (Description) */}
                            <div className="bg-[#F2F2F2] border border-[#DAD7D0] px-2 pt-1 pb-2 md:row-span-2">
                              <label className="block text-[10px] tracking-wide text-[#5B5B5B] mb-0.5">
                                Description
                              </label>
                              <textarea
                                rows={5}
                                className="w-full resize-none text-[11px] leading-snug bg-transparent outline-none px-1"
                                placeholder="Enter Description"
                                value={row.description}
                                onChange={e =>
                                  setCostRows(prev =>
                                    prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r)
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add / Remove Row Buttons */}
                      <div className="flex justify-end gap-4 mt-2 pr-2">
                        <button
                          type="button"
                          onClick={addCostRow}
                          className="text-[#C72030] text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-1"
                          title="Add Row"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={removeCostRow}
                          className="text-[#C72030] text-xs flex items-center gap-1 hover:underline rounded-full bg-[#F6F4EE] p-1"
                          title="Remove Row"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Table */}
                      <div className="mt-4 border border-[#D9D9D9]">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-[11px]">
                            <thead>
                              <tr className="bg-[#EDEAE3] text-[#1A1A1A] font-semibold">
                                {['Request Id', 'Amount', 'Comments', 'Created On', 'Created By', 'L1', 'L2', 'L3', 'L4', 'L5'].map(h => (
                                  <th key={h} className="px-4 py-2 text-left border border-[#D2CEC4] whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {costRows.map(r => (
                                <tr key={r.id} className="bg-white even:bg-[#FAFAF9]">
                                  {Array.from({ length: 10 }).map((_, i) =>
                                    <td key={i} className="px-4 py-2 border border-[#E5E2DC] text-gray-500 text-center">-</td>
                                  )}
                                </tr>
                              ))}
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
                  <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
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
                      onClick={handleUpdate}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FFFDFB] border border-t-0 border-[#D9D9D9] px-6 py-6">
                    {/* Two row / two column panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Preventive Action */}
                      <div className="bg-[#F6F6F4] border border-[#E7E4DD] p-4">
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <InputLabel shrink>Preventive Action</InputLabel>
                          <Select
                            label="Preventive Action"
                            notched
                            displayEmpty
                            value={ticketData.preventive_action || ''}
                            onChange={() => { }}
                          >
                            <MenuItem value="">Select Preventive Action</MenuItem>
                            <MenuItem value="General Cleaning">General Cleaning</MenuItem>
                            <MenuItem value="Filter Replacement">Filter Replacement</MenuItem>
                          </Select>
                        </FormControl>
                        <div className="mt-4 text-[11.5px] leading-[15px] text-[#1A1A1A] font-medium space-y-1">
                          <p>
                            {ticketData.preventive_action_description ||
                              'The Air Conditioner Is Not Functioning Properly It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
                          </p>
                        </div>
                      </div>

                      {/* Short-term Impact */}
                      <div className="bg-[#F6F6F4] border border-[#E7E4DD] p-4">
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <InputLabel shrink>Short-term Impact</InputLabel>
                          <Select
                            label="Short-term Impact"
                            notched
                            displayEmpty
                            value={ticketData.short_term_impact || ''}
                            onChange={() => { }}
                          >
                            <MenuItem value="">Select Short-term Impact</MenuItem>
                            <MenuItem value="Minor Downtime">Minor Downtime</MenuItem>
                            <MenuItem value="Service Interruption">Service Interruption</MenuItem>
                          </Select>
                        </FormControl>
                        <div className="mt-4 text-[11.5px] leading-[15px] text-[#1A1A1A] font-medium space-y-1">
                          <p>
                            {ticketData.short_term_impact_desc ||
                              'The Air Conditioner Is Not Functioning Properly It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
                          </p>
                        </div>
                      </div>

                      {/* Corrective Action */}
                      <div className="bg-[#F6F6F4] border border-[#E7E4DD] p-4">
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <InputLabel shrink>Corrective Action</InputLabel>
                          <Select
                            label="Corrective Action"
                            notched
                            displayEmpty
                            value={ticketData.corrective_action || ''}
                            onChange={() => { }}
                          >
                            <MenuItem value="">Select Corrective Action</MenuItem>
                            <MenuItem value="Gas Refill">Gas Refill</MenuItem>
                            <MenuItem value="Component Replacement">Component Replacement</MenuItem>
                          </Select>
                        </FormControl>
                        <div className="mt-4 text-[11.5px] leading-[15px] text-[#1A1A1A] font-medium space-y-1">
                          <p>
                            {ticketData.corrective_action_description ||
                              'The Air Conditioner Is Not Functioning Properly It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
                          </p>
                        </div>
                      </div>

                      {/* Long-term Impact */}
                      <div className="bg-[#F6F6F4] border border-[#E7E4DD] p-4">
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <InputLabel shrink>Long-term Impact</InputLabel>
                          <Select
                            label="Long-term Impact"
                            notched
                            displayEmpty
                            value={ticketData.long_term_impact || ''}
                            onChange={() => { }}
                          >
                            <MenuItem value="">Select Long-term Impact</MenuItem>
                            <MenuItem value="Lifecycle Reduction">Lifecycle Reduction</MenuItem>
                            <MenuItem value="High Energy Usage">High Energy Usage</MenuItem>
                          </Select>
                        </FormControl>
                        <div className="mt-4 text-[11.5px] leading-[15px] text-[#1A1A1A] font-medium space-y-1">
                          <p>
                            {ticketData.long_term_impact_desc ||
                              'The Air Conditioner Is Not Functioning Properly It Is Not Cooling, Turning On, Or Responding To Controls. Immediate Inspection And Servicing Are Required.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Review Date & Responsible Person */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                      <div className="flex items-start text-[12px]">
                        <span className="w-[120px] text-[#6B6B6B]">Review Date</span>
                        <span className="ml-4 font-semibold text-[#1A1A1A]">
                          {ticketData.review_date
                            ? formatDate(ticketData.review_date)
                            : 'DD/MM/YYYY'}
                        </span>
                      </div>
                      <div>
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <InputLabel shrink>Responsible Person</InputLabel>
                          <Select
                            label="Responsible Person"
                            notched
                            displayEmpty
                            value={ticketData.responsible_person || ''}
                            onChange={() => { }}
                          >
                            <MenuItem value="">Select Responsible Person</MenuItem>
                            <MenuItem value="Abdul Ghaffar">Abdul Ghaffar</MenuItem>
                            <MenuItem value="Samuel">Samuel</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                </Card>

                {ticketData.documents && (
                  <Card className="w-full bg-white rounded-lg shadow-sm border">
                    {/* Header */}
                    <div className="flex items-center gap-2 bg-[#F6F4EE] px-4 py-2 border border-[#D9D9D9] rounded-t-lg">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <Paperclip className="w-3.5 h-3.5 text-[#C72030]" />
                      </div>
                      <h3 className="text-[12px] font-semibold tracking-wide text-[#1A1A1A]">
                        Attachments
                      </h3>
                    </div>

                    {/* Body */}
                    <div className="bg-[#FAFAF8] border border-t-0 border-[#D9D9D9] p-4">
                      {ticketData.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                          {ticketData.documents.map((doc, idx) => {
                            const rawUrl =
                              doc.document ||
                              doc.document_url ||
                              doc.url ||
                              doc.attachment_url ||
                              '';
                            const ext =
                              rawUrl.split('.').pop()?.toLowerCase() ||
                              doc.doctype?.split('/').pop()?.toLowerCase() ||
                              '';
                            const isImg =
                              ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ||
                              (doc.doctype || '').startsWith('image/');

                            return (
                              <button
                                key={doc.id || idx}
                                type="button"
                                onClick={() => {
                                  if (isImg && rawUrl) {
                                    setPreviewImage({
                                      url: rawUrl,
                                      name: `Attachment_${doc.id || idx + 1}.${ext || 'file'}`,
                                      document: doc
                                    });
                                    setShowImagePreview(true);
                                  }
                                }}
                                className="group outline-none"
                              >
                                <div className="w-[116px] h-[116px] bg-white border border-[#D3CEC4] overflow-hidden relative flex items-center justify-center">
                                  {isImg ? (
                                    <img
                                      src={rawUrl}
                                      alt=""
                                      className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (
                                          (e.target as HTMLImageElement)
                                            .nextSibling as HTMLElement
                                        ).style.display = 'flex';
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-[#5F5F5F] text-[10px] leading-tight gap-2 w-full h-full">
                                      <FileText className="w-6 h-6 text-[#8A8A8A]" />
                                      <span className="px-2 break-all">
                                        {`File_${doc.id || idx + 1}.${ext || 'file'}`}
                                      </span>
                                    </div>
                                  )}
                                  {/* Fallback */}
                                  <div
                                    className="hidden absolute inset-0 items-center justify-center text-[10px] text-gray-500 bg-white"
                                  >
                                    <FileText className="w-6 h-6 mb-1" />
                                    Unavailable
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">No attachments</div>
                      )}
                    </div>
                  </Card>
                )}

                <Card className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-2 bg-[#F6F4EE] px-4 py-3 border-b border-[#E8E3D8]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C72030]" />
                    </div>
                    <h3 className="text-[13px] font-medium text-[#2C2C2C]">Comments</h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#FAFAF8] ">
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Internal Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5">
                          <h4 className="text-[18px] font-regular text-[#1A1A1A]">Internal</h4>
                        </div>
                        {/* Comment Input */}
                        <div className="mb-4 mt-4 ml-2">
                          <textarea
                            className="w-full min-h-[100px] px-3 py-2 text-[11px] bg-white border border-[#D9D9D9] rounded resize-vertical focus:outline-none focus:border-[#C72030]"
                            placeholder="Add your comment..."
                          />
                        </div>

                        {/* Add Attachment Button */}
                        <button
                          type="button"
                          className="text-[#C72030] text-[11px] font-medium border border-[#C72030] rounded px-3 py-1.5 hover:bg-[#C72030] hover:text-white transition-colors"
                        >
                          Add Attachment
                        </button>
                      </div>

                      {/* Customer Comments Section */}
                      <div className="flex-1">
                        <div className="bg-white w-full text-center py-0.5">
                          <h4 className="text-[18px] font-regular text-[#1A1A1A]">Customer</h4>
                        </div>

                        <div className="mt-4 mr-2">


                          {/* Template Dropdown */}
                          <div className="mb-3">
                           <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Template</InputLabel>
            <Select
              label="Template"
              notched
              displayEmpty
              defaultValue=""
              sx={{
                fontSize: '11px',
                height: '40px',
              }}
            >
              <MenuItem value="">
                <span style={{ color: '#aaa' }}>Select Template</span>
              </MenuItem>
              <MenuItem value="template1">Template 1</MenuItem>
              <MenuItem value="template2">Template 2</MenuItem>
            </Select>
          </FormControl>
                          </div>

                          {/* Comment Input */}
                          <div className="mb-4">
                            <textarea
                              className="w-full min-h-[100px] px-3 py-2 text-[11px] bg-white border border-[#D9D9D9] rounded resize-vertical focus:outline-none focus:border-[#C72030]"
                              placeholder="Add your comment..."
                            />
                          </div>
                        </div>
                        {/* Add Attachment Button */}
                        <button
                          type="button"
                          className="text-[#C72030] text-[11px] font-medium border border-[#C72030] rounded px-3 py-1.5 hover:bg-[#C72030] hover:text-white transition-colors"
                        >
                          Add Attachment
                        </button>
                      </div>
                    </div>

                    {/* Submit Comment Button (centered) */}
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        className="bg-[#C72030] text-white text-[12px] font-medium px-6 py-2 rounded hover:bg-[#A01828] transition-colors"
                      >
                        Submit Comment
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Logs Card – Adjusted Alignment */}
<Card className="w-full bg-white rounded-lg shadow-sm border">
  {/* Header */}
  <div className="flex items-center gap-2 bg-[#F6F4EE] h-10 px-4 border-b border-[#E8E3D8]">
    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#E5E0D3]">
      <History className="w-3.5 h-3.5 text-[#C72030]" />
    </div>
    <h3 className="text-[12px] font-medium text-[#2C2C2C]">Logs</h3>
  </div>

  {/* Body */}
  <div className="bg-[#FAFAF8] relative px-6 pt-6 pb-8">
    {complaintLogs.length === 0 ? (
      <div className="text-xs text-gray-400">No logs available</div>
    ) : (
      (() => {
        const sorted = [...complaintLogs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        return (
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-[12px] top-0 bottom-0 w-[2px] bg-[#C72030]" />

            <div className="space-y-6">
              {sorted.map((log, i) => {
                return (
                  <div key={log.id || i} className="relative flex gap-3">
                    {/* Dot aligned exactly on line */}
                    <div className="relative">
                      <span
                        className={`block w-3 h-3 rounded-full border-2 ml-2 bg-[#C72030] border-[#C72030]`}
                      />
                    </div>

                    {/* Log Content */}
                    <div className="ml-1 text-[12px] leading-snug">
                      <div>
                        <span className="text-[#6B6B6B] mr-1">
                          {formatLogTime(log.created_at)}
                        </span>
                        {log.log_status && (
                          <span className="font-semibold text-[#1A1A1A]">
                            {log.log_status}
                          </span>
                        )}
                        {log.log_by && (
                          <span className="ml-1 text-[#1A1A1A]">By {log.log_by}</span>
                        )}
                      </div>
                      {log.log_comment && (
                        <div className="mt-0.5 text-[#2C2C2C]">{log.log_comment}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()
    )}
  </div>
</Card>


              </TabsContent>
              {/* 
              <TabsContent value="analytics">
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <h3 className="text-lg font-semibold uppercase text-black">
                      Analytics Overview
                    </h3>
                  </div>
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <div className="text-center py-8 text-gray-500">
                      Analytics features coming soon...
                    </div>
                  </div>
                </div>
              </TabsContent> */}
            </Tabs>
          </TabsContent>

          <TabsContent value="details" className="space-y-8 p-4">
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
                /* Ticket Information Card */
                <Card className="w-full">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-black">
                      Ticket Information
                    </h3>
                  </div>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {hasData(ticketData.ticket_number) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Ticket Number</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.ticket_number}</span>
                        </div>
                      )}
                      {hasData(ticketData.heading) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Title</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }} title={ticketData.heading}>{ticketData.heading}</span>
                        </div>
                      )}
                      {hasData(ticketData.category_type) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Category</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.category_type}</span>
                        </div>
                      )}
                      {hasData(ticketData.sub_category_type) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">SubCategory</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.sub_category_type}</span>
                        </div>
                      )}
                      {hasData(ticketData.issue_status) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Status</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium"><Badge className="bg-yellow-100 text-yellow-700">{ticketData.issue_status}</Badge></span>
                        </div>
                      )}
                      {hasData(ticketData.created_by_name) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Created By</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.created_by_name}</span>
                        </div>
                      )}
                      {(hasData(ticketData.created_date) || hasData(ticketData.created_time) || hasData(ticketData.created_at)) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Created On</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">
                            {ticketData.created_at
                              ? new Date(ticketData.created_at).toLocaleString()
                              : `${ticketData.created_date || ''} ${ticketData.created_time || ''}`.trim()
                            }
                          </span>
                        </div>
                      )}
                      {hasData(ticketData.updated_by) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Updated By</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.updated_by}</span>
                        </div>
                      )}
                      {hasData(ticketData.complaint_mode) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Complaint Mode</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.complaint_mode}</span>
                        </div>
                      )}
                      {hasData(ticketData.priority || ticketData.external_priority) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Priority</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.priority || ticketData.external_priority}</span>
                        </div>
                      )}
                      {hasData(ticketData.priority_status || ticketData.effective_priority) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Admin Priority</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.priority_status || ticketData.effective_priority}</span>
                        </div>
                      )}
                      {hasData(ticketData.assigned_to) && (
                        <div className="flex items-center">
                          <span className="text-gray-500 min-w-[140px]">Assigned To</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{ticketData.assigned_to}</span>
                        </div>
                      )}
                    </div>
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
            </div>

            {/* Location Details */}
            <div className="w-full bg-white rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
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

                  <div className="flex justify-between items-start relative z-10">
                    {[
                      { label: "Site", value: ticketData.site_name || "NA" },
                      { label: "Building", value: ticketData.building_name || "NA" },
                      { label: "Wing", value: ticketData.wing_name || "NA" },
                      { label: "Floor", value: ticketData.floor_name || "NA" },
                      { label: "Area", value: ticketData.area_name || "NA" },
                      { label: "Room", value: ticketData.room_name || "NA" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center w-full text-center"
                      >
                        <div className="text-sm text-gray-500 mb-2 mt-1">
                          {item.label}
                        </div>
                        <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-1" />
                        <div className="mt-2 text-base font-medium text-[#1A1A1A] break-words px-2">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline/Progress Details */}
            <div className="w-full bg-white rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                  <History className="w-6 h-6" style={{ color: "#C72030" }} />
                </div>
                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                  Timeline Details
                </h3>
              </div>

              <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] px-6">
                <div className="relative w-full px-4">
                  <div
                    className="flex flex-col items-center w-full relative"
                    style={{ minHeight: "56px" }}
                  >
                    <div className="flex w-full items-center justify-between relative">
                      {/* Created */}
                      <div className="flex flex-col items-center w-1/2 text-left">
                        <div className="text-xs text-gray-500 mb-2 ml-1">
                          Created On
                        </div>
                        <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-[2px]" />
                      </div>

                      {/* Line */}
                      <div className="absolute top-[32px] left-[25%] right-[25%] h-0.5 bg-[#C72030] z-0" />

                      {/* Last Updated */}
                      <div className="flex flex-col items-center w-1/2 text-right">
                        <div className="text-xs text-gray-500 mb-2 mr-1">
                          Last Updated
                        </div>
                        <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10" />
                      </div>
                    </div>

                    <div className="flex w-[80%] mx-auto justify-between mt-6">
                      <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-left">
                        {ticketData.created_at
                          ? new Date(ticketData.created_at).toLocaleDateString()
                          : ticketData.created_date || "NA"}
                      </div>
                      <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-right">
                        {ticketData.updated_at
                          ? new Date(ticketData.updated_at).toLocaleDateString()
                          : "NA"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                                setPreviewImage({
                                  url: documentUrl,
                                  name: `Document ${index + 1}`,
                                  document: document,
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

          {/* Image Preview Modal */}
          {showImagePreview && previewImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setShowImagePreview(false)}
            >
              <div
                className="max-w-4xl max-h-[90vh] bg-white rounded-lg p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold truncate">
                    {previewImage.name}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        // Reuse the download logic for the preview modal with new API
                        const document = previewImage.document;

                        console.log(
                          "📎 Modal download attempt using new API:",
                          {
                            id: document.id,
                            doctype: document.doctype,
                          }
                        );

                        if (!document.id) {
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

                          console.log("🔗 Modal download URL:", downloadUrl);

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
                            const link = window.document.createElement("a");
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
                              "Modal download failed with status:",
                              response.status
                            );
                            throw new Error(
                              `HTTP ${response.status}: ${response.statusText}`
                            );
                          }
                        } catch (error) {
                          console.error("Error downloading file:", error);
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
                      onClick={() => setShowImagePreview(false)}
                    >
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
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      (target.nextSibling as HTMLElement).style.display = "block";
                    }}
                  />
                  <div className="hidden text-center py-8 text-gray-500">
                    Failed to load image preview
                  </div>
                </div>
              </div>
            </div>
          )}

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
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.id || `REQ-${index + 1}`}
                        </TableCell>
                        <TableCell>
                          {request.amount || "Not Provided"}
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
                        <TableCell>{request.approvals?.L1 || "Na"}</TableCell>
                        <TableCell>{request.approvals?.L2 || "Na"}</TableCell>
                        <TableCell>{request.approvals?.L3 || "Na"}</TableCell>
                        <TableCell>{request.approvals?.L4 || "Na"}</TableCell>
                        <TableCell>{request.approvals?.L5 || "Na"}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            {request.master_status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.cancelled_by || "NA"}</TableCell>
                        <TableCell>
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
                                const imageUrl = attachment.url;
                                if (imageUrl) {
                                  setPreviewImage({
                                    url: imageUrl,
                                    name: `Cost Approval Request ${request.id || index + 1
                                      }`,
                                    document: attachment,
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
                          {log.log_comment || "No comments"}
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
      {showImagePreview && previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-white rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold truncate">
                {previewImage.name}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // Reuse the download logic for the preview modal with new API
                    const document = previewImage.document;

                    console.log("📎 Modal download attempt using new API:", {
                      id: document.id,
                      doctype: document.doctype,
                    });

                    if (!document.id) {
                      console.error("No document ID found", document);
                      toast.error("Unable to download: No document ID found");
                      return;
                    }

                    try {
                      // Check if we're in a browser environment
                      if (typeof window === "undefined" || !window.document) {
                        throw new Error(
                          "Download not supported in this environment"
                        );
                      }

                      // Import API_CONFIG to get the base URL
                      const { API_CONFIG } = await import("@/config/apiConfig");
                      const baseUrl = API_CONFIG.BASE_URL;
                      const token = localStorage.getItem("token");

                      // Clean up base URL - ensure it doesn't have protocol and has no trailing slash
                      const cleanBaseUrl = baseUrl
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "");
                      const downloadUrl = `https://${cleanBaseUrl}/attachfiles/${document.id}?show_file=true`;

                      console.log(
                        "🔗 Modal new API download URL:",
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
                          document.document?.split(".").pop()?.toLowerCase() ||
                          "file";
                        const documentName = `document_${document.id}.${fileExtension}`;

                        // Create download link using window.document
                        const url = window.URL.createObjectURL(blob);
                        const link = window.document.createElement("a");
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
                          "Modal download failed with status:",
                          response.status
                        );
                        throw new Error(
                          `HTTP ${response.status}: ${response.statusText}`
                        );
                      }
                    } catch (error) {
                      console.error("Error downloading file:", error);
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
                  onClick={() => setShowImagePreview(false)}
                >
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
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  (target.nextSibling as HTMLElement).style.display = "block";
                }}
              />
              <div className="hidden text-center py-8 text-gray-500">
                Failed to load image preview
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};