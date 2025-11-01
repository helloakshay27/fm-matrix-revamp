import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Flag,
  ChevronRight,
  Building2,
  User,
  Globe,
  RotateCcw,
  Eye,
  Building2Icon,
  EyeIcon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCommentModal } from "./AddCommentModal";
import { useNavigate } from "react-router-dom";
import { recentUpdatedApi } from "@/services/recentUpdatedApi";
import { apiClient } from "@/utils/apiClient";
import { useToast } from "@/hooks/use-toast";
import { changeSite } from "@/store/slices/siteSlice";
interface RecentTicketsSidebarProps {
  onTicketUpdate?: () => void; // Callback to refresh parent data
}

export const RecentUpdatedSidebar: React.FC<RecentTicketsSidebarProps> = ({
  onTicketUpdate,
}) => {
  const { toast } = useToast();
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    ticketId: string;
  }>({
    isOpen: false,
    ticketId: "",
  });
  // Initialize state from localStorage
  const [flaggedTickets, setFlaggedTickets] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("flaggedTickets");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [goldenTickets, setGoldenTickets] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("goldenTickets");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(
      "flaggedTickets",
      JSON.stringify(Array.from(flaggedTickets))
    );
  }, [flaggedTickets]);

  useEffect(() => {
    localStorage.setItem(
      "goldenTickets",
      JSON.stringify(Array.from(goldenTickets))
    );
  }, [goldenTickets]);

  const fetchRecentTickets = async () => {
    try {
      setLoading(true);
      // Use the new recent updates API
      const activities = await recentUpdatedApi.getRecentUpdates();
      // Map each activity based on its type
      const mappedTickets = (activities || []).map((item: any) => {
        if (item.type === "Complaint") {
          // Ticket/Complaint
          return {
            id: `Ticket ID: ${item.id}`,
            ticketNumber: `Ticket ID: ${item.ticket_number}`,
            title: item.heading,
            category: item.category_type,
            subCategory: item.sub_category_type,
            assigneeName: item.assigned_to || "Unassigned",
            site: item.site_name,
            priority: item.priority,
            tat: item.response_escalation,
            status: item.status,
            is_flagged: item.is_flagged || false,
            is_golden_ticket: item.is_golden_ticket || false,
            type: "ticket",
            updatedAt: item.updated_at,
            handledBy: item.assigned_to,
          };
        } else if (item.type === "Pms::Asset") {
          // Asset
          let tatDisplay = "0 hrs / Fully Operational";
          if (item.tat) {
            const {
              tat_status,
              average_tat_days,
              current_breakdown_tat_days,
              last_breakdown_tat_days,
            } = item.tat;
            const tatDays =
              current_breakdown_tat_days !== null &&
              current_breakdown_tat_days !== undefined
                ? current_breakdown_tat_days
                : last_breakdown_tat_days !== null &&
                  last_breakdown_tat_days !== undefined
                ? last_breakdown_tat_days
                : average_tat_days;
            if (tatDays !== null && tatDays !== undefined && tatDays > 0) {
              const days = Math.floor(tatDays);
              const hours = Math.floor((tatDays - days) * 24);
              tatDisplay = `${days}d ${hours}h`;
            }
          }
          return {
            id: `Asset ID: ${item.id}`,
            type: "asset",
            assetCode: item.asset_code,
            name: item.name,
            tat: tatDisplay,
            status: item.status,
            warranty: item.warranty,
            warrantyExpiry: item.warranty_expiry,
            site: item.site_name,
            updatedAt: item.updated_at,
            critical: item.critical,
          };
        } else if (item.type === "Pms::AssetTaskOccurrence") {
          // Task, mapped to ticket-like structure
          return {
            id: `Task ID: ${item.id}`,
            type: "task",
            ticketNumber: `Task ID: ${item.id}`,
            title: item.checklist_name || item.task_comments || "Task Update",
            category: "-",
            subCategory: "-",
            assigneeName:
              item.assigned_to_name ||
              (item.closed_by_id ? `User ${item.closed_by_id}` : "Unassigned"),
            site: item.site_name,
            priority: "-",
            tat: item.start_date
              ? new Date(item.start_date).toLocaleString()
              : "-",
            status: item.task_status,
            is_flagged: false,
            is_golden_ticket: false,
            updatedAt: item.updated_at,
            handledBy:
              item.assigned_to_name ||
              (item.closed_by_id ? `User ${item.closed_by_id}` : "Unassigned"),
          };
        } else if (item.type === "Pms::Consumption") {
          // Inventory/Consumption
          return {
            id: `Inventory ID: ${item.id}`,
            type: "inventory",
            inventoryName: item.inventory_name,
            moveType: item.move_type,
            wastageType: item.inventory_wastage_type,
            site: item.site_name,
            updatedBy: item.updated_by,
            updatedAt: item.updated_at,
          };
        } else {
          // Unknown type, return as is
          return item;
        }
      });
      setRecentTickets(mappedTickets);

      // Initialize localStorage sets with actual API data
      const newFlaggedTickets = new Set<string>();
      const newGoldenTickets = new Set<string>();
      mappedTickets.forEach((ticket: any) => {
        const ticketId = ticket.id?.toString();
        if (ticket.type === "ticket" && ticket.is_flagged) {
          newFlaggedTickets.add(ticketId);
        }
        if (ticket.type === "ticket" && ticket.is_golden_ticket) {
          newGoldenTickets.add(ticketId);
        }
      });
      setFlaggedTickets(newFlaggedTickets);
      setGoldenTickets(newGoldenTickets);

      // Debug logging
      console.log(
        "API Response - Flagged tickets from server:",
        mappedTickets
          .filter((t) => t.is_flagged)
          .map((t) => ({ id: t.id, is_flagged: t.is_flagged }))
      );
      console.log(
        "API Response - Golden tickets from server:",
        mappedTickets
          .filter((t) => t.is_golden_ticket)
          .map((t) => ({ id: t.id, is_golden_ticket: t.is_golden_ticket }))
      );
      console.log(
        "Updated localStorage - Flagged:",
        Array.from(newFlaggedTickets)
      );
      console.log(
        "Updated localStorage - Golden:",
        Array.from(newGoldenTickets)
      );
    } catch (error) {
      console.error("Error fetching recent tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTickets();
  }, [location.pathname, localStorage.getItem('selectedSiteId') ]);

  // Utility to format status values (e.g., 'in_use' -> 'in use')
  const formatStatus = (status: string) => {
    if (!status) return '';
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_use":
      case "in use":
        return "bg-[#DBC2A9] text-[#1A1A1A]";
      case "breakdown":
        return "bg-[#E4626F] text-[#1A1A1A]";
      case "in_storage":
      case "in store":
        return "bg-[#C4B89D] text-[#1A1A1A]";
      case "disposed":
        return "bg-[#D5DbDB] text-[#1A1A1A]";
      default:
        return "bg-[#AAB9C5] text-[#1A1A1A]";
    }
  };
  const handleAddComment = (ticketId: string) => {
    setCommentModal({
      isOpen: true,
      ticketId,
    });
  };
  const handleFlag = async (ticketId: string | number) => {
    const ticketIdStr = ticketId.toString();
    const currentlyFlagged = flaggedTickets.has(ticketIdStr);

    console.log(
      `Flag clicked - Ticket ID: ${ticketIdStr}, Currently flagged: ${currentlyFlagged}`
    );

    try {
      // Update local state first for immediate UI feedback
      setFlaggedTickets((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
          console.log(`Removed ${ticketIdStr} from flagged tickets`);
        } else {
          newSet.add(ticketIdStr);
          console.log(`Added ${ticketIdStr} to flagged tickets`);
        }
        console.log(
          `Flag state updated - New flagged tickets:`,
          Array.from(newSet)
        );
        return newSet;
      });

      // Make API call
      await apiClient.post(
        `/pms/admin/complaints/mark_as_flagged.json?ids=[${ticketId}]`
      );

      toast({
        title: "Success",
        description: `Ticket ${
          !currentlyFlagged ? "flagged" : "unflagged"
        } successfully`,
      });

      // Notify parent to refresh data
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error flagging ticket:", error);

      toast({
        title: "Error",
        description: "Failed to update flag status",
        variant: "destructive",
      });

      // Revert state on error
      setFlaggedTickets((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
        } else {
          newSet.add(ticketIdStr);
        }
        return newSet;
      });
    }
  };
  const handleGoldenTicket = async (ticketId: string | number) => {
    const ticketIdStr = ticketId.toString();
    const currentlyGolden = goldenTickets.has(ticketIdStr);

    console.log(
      `Golden ticket clicked - Ticket ID: ${ticketIdStr}, Currently golden: ${currentlyGolden}`
    );

    try {
      // Update local state first for immediate UI feedback
      setGoldenTickets((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
          console.log(`Removed ${ticketIdStr} from golden tickets`);
        } else {
          newSet.add(ticketIdStr);
          console.log(`Added ${ticketIdStr} to golden tickets`);
        }
        console.log(
          `Golden state updated - New golden tickets:`,
          Array.from(newSet)
        );
        return newSet;
      });

      // Make API call
      await apiClient.post(
        `/pms/admin/complaints/mark_as_golden_ticket.json?ids=[${ticketId}]`
      );

      toast({
        title: "Success",
        description: `Golden Ticket ${
          !currentlyGolden ? "marked" : "unmarked"
        } successfully`,
      });

      // Notify parent to refresh data
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error marking as golden ticket:", error);

      toast({
        title: "Error",
        description: "Failed to update golden ticket status",
        variant: "destructive",
      });

      // Revert state on error
      setGoldenTickets((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
        } else {
          newSet.add(ticketIdStr);
        }
        return newSet;
      });
    }
  };
  const handleViewDetails = (ticket: any) => {
    if (ticket.type === "ticket") {
      // Ticket detail
      const id = ticket.id.replace("Ticket ID: ", "");
      navigate(`/maintenance/ticket/details/${id}`);
    } else if (ticket.type === "task") {
      // Task detail
      const id = ticket.id.replace("Task ID: ", "");
      navigate(`/maintenance/task/task-details/${id}`);
    } else if (ticket.type === "asset") {
      // Asset detail
      const id = ticket.id.replace("Asset ID: ", "");
      navigate(`/maintenance/asset/details/${id}`);
    } else if (ticket.type === "inventory") {
      // Inventory detail
      const id = ticket.id.replace("Inventory ID: ", "");
      navigate(`/maintenance/inventory/details/${id}`);
    }
  };
  return (
    <>
      <div className="w-full bg-[#fff] border p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col" style={{ boxShadow: '0px 4px 14.2px 0px #0000001A' }}>
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "#c72030" }}
          >
            Recent Updates
          </h2>
        </div>

        {/* Tickets List */}
        <div className="flex-1  space-y-4">
          {recentTickets.map((ticket, index) => {
            // Debug logging for each ticket
            const isCurrentlyFlagged = flaggedTickets.has(ticket.id.toString());
            const isCurrentlyGolden = goldenTickets.has(ticket.id.toString());
            // Render based on type
            if (ticket.type === "ticket") {
              return (
                <div
                  key={`${ticket.id}-${index}`}
                  className="bg-[#fff] rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60"
                  style={{ borderWidth: "0.6px" }}
                >
                  {/* Header with ID, Star, and Priority */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-400 text-xs leading-[10px] tracking-[0px]">
                      {ticket.ticketNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleGoldenTicket(ticket.id);
                        }}
                        className="transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`h-5 w-5 cursor-pointer transition-all duration-200 hover:opacity-80 ${
                            goldenTickets.has(ticket.id.toString())
                              ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                              : "text-gray-400 hover:text-yellow-500"
                          }`}
                        />
                      </button>
                      <span
                        className="text-pink-800 px-6 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FFCFCF" }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  {/* Title and TAT */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {ticket.title}
                    </h3>
                  </div>
                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Category
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Sub-Category
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.subCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        TAT :
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.tat}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Assignee Name
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.assigneeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Status
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="italic text-gray-600">
                          {formatStatus(ticket.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Site
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.site}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 ml-7">
                      (Handled By {ticket.handledBy})
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        type="button"
                        className={`flex items-center text-black text-sm font-medium transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 ${
                          flaggedTickets.has(ticket.id.toString())
                            ? "opacity-75"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFlag(ticket.id);
                        }}
                      >
                        <Flag
                          className={`h-5 w-5 transition-all duration-200 ${
                            flaggedTickets.has(ticket.id.toString())
                              ? "text-red-600 fill-red-600 drop-shadow-sm"
                              : "text-red-500 hover:text-red-600 hover:fill-red-100"
                          }`}
                        />
                      </button>
                      <button
                        className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80"
                        onClick={() => handleAddComment(ticket.id)}
                      >
                        <MessageSquare
                          className="h-5 w-5 "
                          style={{ color: "#c72030" }}
                        />
                      </button>
                      <button
                        className="hover:opacity-80"
                        onClick={() => handleViewDetails(ticket)}
                      >
                        <Eye className="w-5 h-5" style={{ color: "#c72030" }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (ticket.type === "asset") {
              return (
                <div
                  key={ticket.id}
                  className="bg-[#fff] rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60"
                  style={{ borderWidth: "0.6px" }}
                >
                  {/* Header with ID and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-400 text-xs leading-[10px] tracking-[0px]">
                      {ticket.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-blue-800 px-6 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#E0F2FE" }}
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {ticket.name}
                    </h3>
                  </div>
                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2Icon className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        TAT
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.tat}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Status
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {formatStatus(ticket.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Site
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.site}
                      </span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        className="hover:opacity-80"
                        onClick={() => handleViewDetails(ticket)}
                      >
                        <Eye className="w-5 h-5" style={{ color: "#c72030" }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (ticket.type === "task") {
              return (
                <div
                  key={`${ticket.id}-${index}`}
                  className="bg-[#fff] rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60"
                  style={{ borderWidth: "0.6px" }}
                >
                  {/* Header with ID and Priority */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-400 text-xs leading-[10px] tracking-[0px]">
                      {ticket.ticketNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-pink-800 px-6 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FFCFCF" }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  {/* Title and TAT */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {ticket.title}
                    </h3>
                  </div>
                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        TAT
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.tat}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Status
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="italic text-gray-600">
                          {formatStatus(ticket.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Site
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.site}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 ">
                      (Handled By {ticket.handledBy})
                    </div>
                  </div>
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        className="hover:opacity-80"
                        onClick={() => handleViewDetails(ticket)}
                      >
                        <Eye className="w-5 h-5" style={{ color: "#c72030" }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (ticket.type === "inventory") {
              return (
                <div
                  key={`${ticket.id}-${index}`}
                  className="bg-[#fff] rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60"
                  style={{ borderWidth: "0.6px" }}
                >
                  {/* Header with Inventory Name and Move/Wastage Type */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-400 text-xs leading-[10px] tracking-[0px]">
                      {ticket.id}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* <span
                        className="text-pink-800 px-6 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FFCFCF" }}
                      >
                        {ticket.priority}
                      </span> */}
                    </div>
                  </div>
                  {/* Title and TAT */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {ticket.inventoryName}
                    </h3>
                  </div>
                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Move Type
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.moveType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Updated By
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.updatedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Updated At
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.updatedAt
                          ? new Date(ticket.updatedAt).toLocaleString()
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        Site
                      </span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">
                        {ticket.site}
                      </span>
                    </div>
                  </div>
                  {/* Action Buttons (View only) */}
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        className="hover:opacity-80"
                        onClick={() => handleViewDetails(ticket)}
                      >
                        <Eye className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              // fallback for unknown type
              return null;
            }
          })}
        </div>
      </div>

      <AddCommentModal
        isOpen={commentModal.isOpen}
        onClose={() =>
          setCommentModal({
            isOpen: false,
            ticketId: "",
          })
        }
        itemId={commentModal.ticketId}
        itemType="ticket"
      />
    </>
  );
};
