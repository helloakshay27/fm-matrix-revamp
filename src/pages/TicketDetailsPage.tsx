import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Plus,
  FileText,
  Paperclip,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  FileSearch,
  PlusCircle,
  ClipboardList,
  DollarSign,
  History,
  FileSpreadsheet,
  X,
  Edit,
  FileIcon,
} from "lucide-react";
import { ticketManagementAPI } from "@/services/ticketManagementAPI";
import { toast } from "sonner";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

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
    return value && value !== null && value !== undefined && value !== "";
  };

  // Helper function to display value or "Not Provided"
  const displayValue = (value) => {
    return value && value !== null && value !== undefined && value !== ""
      ? value
      : "Not Provided";
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
    actionLogs: false,
  });

  // Update expanded sections based on data availability
  useEffect(() => {
    if (ticketData) {
      const complaintLogs = ticketData.complaint_logs || [];

      setExpandedSections({
        ticketDetails:
          hasData(ticketData.heading) ||
          hasData(ticketData.issue_status) ||
          hasData(ticketData.ticket_number) ||
          hasData(ticketData.sub_category_type) ||
          hasData(ticketData.created_by_name) ||
          hasData(ticketData.created_date) ||
          hasData(ticketData.created_time) ||
          hasData(ticketData.category_type) ||
          hasData(ticketData.updated_by) ||
          hasData(ticketData.complaint_mode) ||
          hasData(ticketData.priority) ||
          hasData(ticketData.external_priority) ||
          hasData(ticketData.priority_status) ||
          hasData(ticketData.effective_priority) ||
          hasData(ticketData.assigned_to),
        creatorInfo:
          hasData(ticketData.posted_by) || hasData(ticketData.id_society),
        locationInfo:
          hasData(ticketData.region) ||
          hasData(ticketData.building_name) ||
          hasData(ticketData.city) ||
          hasData(ticketData.floor_name) ||
          hasData(ticketData.flat_number) ||
          hasData(ticketData.unit_name) ||
          hasData(ticketData.zone) ||
          hasData(ticketData.district) ||
          hasData(ticketData.room_name) ||
          hasData(ticketData.area_name) ||
          hasData(ticketData.site_name) ||
          hasData(ticketData.state) ||
          hasData(ticketData.address) ||
          hasData(ticketData.wing_name),
        surveyInfo:
          ticketData.survey &&
          (hasData(ticketData.survey.survey?.id) ||
            hasData(ticketData.survey.survey?.name) ||
            hasData(ticketData.survey.site_name) ||
            hasData(ticketData.survey.building_name) ||
            hasData(ticketData.survey.wing_name) ||
            hasData(ticketData.survey.area_name) ||
            hasData(ticketData.survey.floor_name) ||
            hasData(ticketData.survey.room_name)),
        additionalInfo:
          hasData(ticketData.corrective_action) ||
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
          hasData(ticketData.escalation_resolution_name),
        attachments: ticketData.documents && ticketData.documents.length > 0,
        costApproval:
          ticketData.cost_approval_enabled &&
          ticketData.requests &&
          ticketData.requests.length > 0,
        actionLogs: complaintLogs.length > 0,
      });
    }
  }, [ticketData]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;

      try {
        console.log("🎯 Fetching ticket details for ID:", id);
        setLoading(true);
        const data = await ticketManagementAPI.getTicketDetails(id);
        console.log("📥 Received ticket details:", data);
        setTicketData(data);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to fetch ticket details");
        toast.error("Failed to fetch ticket details");
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

      toast.success(
        "Create task data fetched successfully! Check console for details."
      );
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

  // Process complaint logs for table display
  const complaintLogs = ticketData?.complaint_logs || [];

  // State for active tab in Tabs
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState("ticket-details");

  // Expandable Section Component (similar to AMC cards)
  const ExpandableSection = ({
    title,
    icon: Icon,
    number,
    isExpanded,
    onToggle,
    children,
    hasData = true,
  }) => (
    <div className="border-2 rounded-lg mb-6">
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer p-6"
        style={{ backgroundColor: "rgb(246 244 238)" }}
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
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              No data
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="p-6" style={{ backgroundColor: "rgb(246 247 247)" }}>
          {children}
        </div>
      )}
    </div>
  );

  // Helper function to check if value has data
  // const hasData = (value) => {
  //   return value && value !== null && value !== undefined && value !== '';
  // };

  // Helper function to display value or "Not Provided"
  // const displayValue = (value) => {
  //   return value && value !== null && value !== undefined && value !== '' ? value : 'Not Provided';
  // };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await ticketManagementAPI.getTicketDetails(id);
        setTicketData(data);
      } catch (err) {
        setError("Failed to fetch ticket details");
        console.error("Error fetching ticket details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // const handleBackToList = () => {
  //   navigate(-1);
  // };

  // const handleFeeds = () => {
  //   const currentPath = window.location.pathname;

  //   if (currentPath.includes("tickets")) {
  //     navigate(`/tickets/${id}/feeds`);
  //   } else {
  //     navigate(`/maintenance/ticket/${id}/feeds`);
  //   }
  //   // navigate(`/maintenance/ticket/${id}/feeds`);
  // };

  // const © = () => {
  //   navigate(`/maintenance/ticket/${id}/tag-vendor`);
  // };

  // const handleCreateTask = async () => {
  //   if (!id) {
  //     console.error("No ticket ID available");
  //     return;
  //   }

  //   try {
  //     console.log("Fetching create task data for ticket:", id);
  //     const taskData = await ticketManagementAPI.getCreateTaskData(id);
  //     console.log("Create task data:", taskData);

  //     // You can handle the response data here
  //     // For example, navigate to a create task page with the data
  //     // or open a modal with the task creation form

  //     // Placeholder for now - you can customize this based on your requirements
  //     toast.success(
  //       "Create task data fetched successfully! Check console for details."
  //     );
  //   } catch (error) {
  //     console.error("Error fetching create task data:", error);
  //     toast.error("Failed to fetch create task data. Please try again.");
  //   }
  // };

  // const handleUpdate = () => {
  //   const currentPath = window.location.pathname;

  //   if (currentPath.includes("tickets")) {
  //     navigate(`/tickets/edit/${id}`, {
  //       state: {
  //         from: "details",
  //         returnTo: `/tickets/details/${id}`,
  //       },
  //     });
  //   } else {
  //     navigate(`/maintenance/ticket/update/${id}`, {
  //       state: {
  //         from: "details",
  //         returnTo: `/maintenance/ticket/${id}`,
  //       },
  //     });
  //   }

  //   // navigate(`/maintenance/ticket/update/${id}`, {
  //   //   state: {
  //   //     from: 'details',
  //   //     returnTo: `/maintenance/ticket/${id}`
  //   //   }
  //   // });
  // };

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

  // Process complaint logs for table display
  // const complaintLogs = ticketData?.complaint_logs || [];

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
                Ticket Summary
              </h1>
            </div>

            <div className="text-sm text-gray-600">
              Ticket #{ticketData.ticket_number || "N/A"} • Created by{" "}
              {ticketData.created_by_name || "Unknown"} • Last updated{" "}
              {ticketData.updated_at || "N/A"}
            </div>
          </div>

          {activeTab === "ticket-details" && (
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
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs
          defaultValue="ticket-details"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="ticket-details"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Ticket Details
            </TabsTrigger>

            <TabsTrigger
              value="creator-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Creator Info
            </TabsTrigger>

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

            <TabsTrigger
              value="additional-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Additional
            </TabsTrigger>

            <TabsTrigger
              value="attachments"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Attachments
            </TabsTrigger>

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

          <TabsContent value="ticket-details" className="p-4 sm:p-6">
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
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                        <FileText className="w-6 h-6 text-[#C72030]" />
                      </div>
                      <span>TICKET INFORMATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {hasData(ticketData.ticket_number) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Ticket Number
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.ticket_number}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.heading) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Title
                          </label>
                          <div
                            className="font-semibold text-base lg:text-lg break-words"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                            title={ticketData.heading}
                          >
                            {ticketData.heading}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.category_type) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Category
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.category_type}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.sub_category_type) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            SubCategory
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.sub_category_type}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.issue_status) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Status
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            <Badge className="bg-yellow-100 text-yellow-700">
                              {ticketData.issue_status}
                            </Badge>
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.created_by_name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Created By
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.created_by_name}
                          </div>
                        </div>
                      )}
                      {(hasData(ticketData.created_date) ||
                        hasData(ticketData.created_time) ||
                        hasData(ticketData.created_at)) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Created On
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.created_at
                              ? new Date(ticketData.created_at).toLocaleString()
                              : `${ticketData.created_date || ""} ${
                                  ticketData.created_time || ""
                                }`.trim()}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.updated_by) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Updated By
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.updated_by}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.complaint_mode) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Complaint Mode
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.complaint_mode}
                          </div>
                        </div>
                      )}
                      {hasData(
                        ticketData.priority || ticketData.external_priority
                      ) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Priority
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.priority ||
                              ticketData.external_priority}
                          </div>
                        </div>
                      )}
                      {hasData(
                        ticketData.priority_status ||
                          ticketData.effective_priority
                      ) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Admin Priority
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.priority_status ||
                              ticketData.effective_priority}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.assigned_to) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Assigned To
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.assigned_to}
                          </div>
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
            </div>
          </TabsContent>

          {/* Creator Info Tab */}
          <TabsContent value="creator-info" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Check if there's any creator data to display */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {hasData(ticketData.posted_by) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Posted By
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.posted_by}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.id_society) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Society
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.id_society}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* No Data Available Message */
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {hasData(ticketData.region) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Region
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.region}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.building_name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Building
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.building_name}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.floor_name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Floor
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.floor_name}
                          </div>
                        </div>
                      )}
                      {hasData(
                        ticketData.flat_number || ticketData.unit_name
                      ) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Flat/Unit
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.flat_number || ticketData.unit_name}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.zone) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Zone
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.zone}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.district) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            District
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.district}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.room_name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Room
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.room_name}
                          </div>
                        </div>
                      )}
                      {hasData(
                        ticketData.area_name || ticketData.site_name
                      ) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Area/Site
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.area_name || ticketData.site_name}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.city) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            City
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.city}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.state) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            State
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.state}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.address) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Address
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.address}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.wing_name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Wing
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.wing_name}
                          </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {hasData(ticketData.survey?.survey?.id) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Survey ID
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.survey.survey.id}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.survey?.survey?.name) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Survey Name
                          </label>
                          <div
                            className="font-semibold text-base lg:text-lg break-words"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {ticketData.survey.survey.name}
                          </div>
                        </div>
                      )}
                      {(hasData(ticketData.survey?.site_name) ||
                        hasData(ticketData.survey?.building_name) ||
                        hasData(ticketData.survey?.wing_name) ||
                        hasData(ticketData.survey?.area_name) ||
                        hasData(ticketData.survey?.floor_name) ||
                        hasData(ticketData.survey?.room_name)) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Survey Location
                          </label>
                          <div
                            className="font-semibold text-base lg:text-lg break-words"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {[
                              ticketData.survey.site_name,
                              ticketData.survey.building_name,
                              ticketData.survey.wing_name,
                              ticketData.survey.area_name,
                              ticketData.survey.floor_name,
                              ticketData.survey.room_name,
                            ]
                              .filter(Boolean)
                              .join("/")}
                          </div>
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
              {/* Check if there's any additional data to display */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                      {hasData(ticketData.corrective_action) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Corrective Action
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.corrective_action}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.preventive_action) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Preventive Action
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.preventive_action}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.root_cause) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Root Cause
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.root_cause}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.response_tat) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Response TAT
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.response_tat}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.ticket_urgency) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Ticket Urgency
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.ticket_urgency}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.responsible_person) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Responsible Person
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.responsible_person}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.asset_service) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Asset Service
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.asset_service}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.resolution_tat) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Resolution TAT
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.resolution_tat}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.task_id) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Task ID
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.task_id}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.asset_service_location) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Asset/Service Location
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.asset_service_location}
                          </div>
                        </div>
                      )}
                      {hasData(ticketData.resolution_time) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Resolution Time
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {ticketData.resolution_time}
                          </div>
                        </div>
                      )}
                      {(hasData(ticketData.escalation_response_name) ||
                        hasData(ticketData.escalation_resolution_name)) && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-500 font-medium">
                            Escalation Tracking
                          </label>
                          <div className="font-semibold text-base lg:text-lg">
                            {`${ticketData.escalation_response_name || ""}, ${
                              ticketData.escalation_resolution_name || ""
                            }`.replace(/^,\s*|,\s*$/g, "")}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* No Data Available Message */
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
                            {`Document_${document.id || index + 1}.${
                              fileExtension || "file"
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
                      (target.nextSibling as HTMLElement).style.display =
                        "block";
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
                                    name: `Cost Approval Request ${
                                      request.id || index + 1
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
