import React, { useState, useEffect, useRef } from "react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { PostHogAuditActivity } from "@/components/PostHogAuditActivity";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { StatusBadge } from "@/components/ui/status-badge";
import { OperationalAuditConductedFilterDialog } from "@/components/OperationalAuditConductedFilterDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AuditConductedOccurrence {
  id: number;
  form_name: string;
  start_date: string;
  conducted_by: string;
  status: string;
  site: string;
  duration: number | null;
  percentage: number;
  has_response: boolean;
  print_pdf_url: string | null;
  delete_url: string | null;
}

interface AuditConductedResponse {
  occurrences: AuditConductedOccurrence[];
  total_count: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export const OperationalAuditConductedDashboard = () => {
  const { shouldShow } = useDynamicPermissions();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [conductedData, setConductedData] = useState<AuditConductedOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [auditEvent, setAuditEvent] = useState<{ key: number; event: "Report opened" } | null>(null);
  const auditEventKeyRef = useRef(0);

  const captureAuditEvent = (event: "Report opened") => {
    auditEventKeyRef.current += 1;
    setAuditEvent({ key: auditEventKeyRef.current, event });
  };

  useEffect(() => {
    fetchAuditsConducted();
  }, [currentPage]);

  const fetchAuditsConducted = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<AuditConductedResponse>(
        "/pms/custom_forms/audits_conducted.json",
        {
          params: {
            page: currentPage,
            per_page: 20,
          },
        }
      );
      setConductedData(response.data.occurrences);
      setTotalPages(response.data.total_pages);
      setTotalCount(response.data.total_count);
    } catch (error) {
      console.error("Error fetching audits conducted:", error);
      toast.error("Failed to fetch audits conducted data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = async (
    auditId: number,
    printPdfUrl: string | null
  ) => {
    if (!printPdfUrl) {
      toast.error("PDF report not available for this audit");
      return;
    }

    try {
      const response = await apiClient.get(printPdfUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      captureAuditEvent("Report opened");

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.success("Opening PDF report...");
    } catch (error) {
      console.error("Error opening PDF:", error);
      toast.error("Failed to open PDF report");
    }
  };

  const handleDeleteReport = async (
    auditId: number,
    deleteUrl: string | null
  ) => {
    if (!deleteUrl) {
      toast.error("Cannot delete report for this audit");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await apiClient.delete(
        `/pms/asset_task_occurrences/${auditId}/delete_print_pdf`
      );
      toast.success("Report deleted successfully");
      fetchAuditsConducted();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete report");
    }
  };

  const formatDuration = (duration: number | null): string => {
    if (!duration) return "-";
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "accepted";
      case "in progress":
      case "in-progress":
        return "pending";
      default:
        return "pending";
    }
  };

  const columns = [
    { key: "report", label: "Report", sortable: true, draggable: true, defaultVisible: true },
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "auditName", label: "Audit Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "startDateTime", label: "Start Date & Time", sortable: true, draggable: true, defaultVisible: true },
    { key: "conductedBy", label: "Conducted By", sortable: true, draggable: true, defaultVisible: true },
    { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
    { key: "site", label: "Site", sortable: true, draggable: true, defaultVisible: true },
    { key: "duration", label: "Duration", sortable: true, draggable: true, defaultVisible: true },
    { key: "percentage", label: "%", sortable: true, draggable: true, defaultVisible: true },
    { key: "delete", label: "Delete", sortable: false, draggable: true, defaultVisible: true },
  ];

  const filteredData = searchTerm
    ? conductedData.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : conductedData;

  const renderCell = (item: AuditConductedOccurrence, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return shouldShow("Audit", "show") ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-black hover:bg-gray-100"
            onClick={() => console.log("View conducted audit:", item.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        ) : null;
      case "report":
        return item.has_response && item.print_pdf_url ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePrintReport(item.id, item.print_pdf_url)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Print PDF"
          >
            <FileText className="w-4 h-4 text-gray-700" />
          </Button>
        ) : null;
      case "id":
        return <span className="text-gray-900 font-medium">{item.id}</span>;
      case "auditName":
        return item.form_name;
      case "startDateTime":
        return item.start_date;
      case "conductedBy":
        return item.conducted_by || "-";
      case "status":
        return (
          <StatusBadge status={getStatusVariant(item.status)}>
            {item.status}
          </StatusBadge>
        );
      case "site":
        return item.site;
      case "duration":
        return formatDuration(item.duration);
      case "percentage":
        return item.percentage ? `${item.percentage}%` : "-";
      case "delete":
        return item.has_response && item.delete_url ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteReport(item.id, item.delete_url)}
            className="text-brand-error hover:bg-brand-error/10"
            title="Delete Report"
          >
            Delete
          </Button>
        ) : null;
      default:
        return null;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map((item) => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <PostHogAuditActivity event="Audit Conducted List Viewed" />
      {auditEvent && (
        <PostHogAuditActivity key={auditEvent.key} event={auditEvent.event} />
      )}

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Audits Conducted &gt; Audits Conducted List
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Audits Conducted List
        </h1>
      </div>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item) => item.id.toString()}
        storageKey="conducted-audit-table"
        loading={loading}
        loadingMessage="Loading..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search audits..."
        pagination={false}
        emptyMessage="No audits conducted found."
        onFilterClick={() => setShowFilters(true)}
      />

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter((page) => page > 1 && page < totalPages)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-center mt-2 text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({totalCount} total audits)
          </div>
        </div>
      )}

      <OperationalAuditConductedFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
