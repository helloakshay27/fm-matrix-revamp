import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  QrCode,
  MapPin,
  ExternalLink,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  API_CONFIG,
  getFullUrl,
  getAuthenticatedFetchOptions,
} from "@/config/apiConfig";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketPagination } from "@/components/TicketPagination";

interface CheckpointListItem {
  id: number;
  name: string;
  order_sequence: number;
  route_id: number;
  route_name: string;
  location_path: string;
  qr_code_available: boolean;
  qr_code_url: string;
  total_visits: number;
  created_on: string;
  start_date: string;
  end_date: string;
  grace_time_hours: number;
  active: boolean;
  scheduled_times: string[];
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateStr;
  }
};

export const PatrollingResponsePage = () => {
  const navigate = useNavigate();
  const [checkpoints, setCheckpoints] = useState<CheckpointListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 1,
  });

  const [showQrPreview, setShowQrPreview] = useState(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState("");
  const [qrPreviewName, setQrPreviewName] = useState("");

  const fetchCheckpoints = useCallback(
    async (page: number = 1, search?: string) => {
      setIsLoading(true);
      try {
        const url = getFullUrl("/patrolling/checkpoints");
        const urlWithParams = new URL(url);
        urlWithParams.searchParams.append("page", page.toString());
        urlWithParams.searchParams.append("per_page", perPage.toString());
        if (API_CONFIG.TOKEN) {
          urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        }
        if (search && search.trim()) {
          urlWithParams.searchParams.append("search", search.trim());
        }

        const options = getAuthenticatedFetchOptions();
        const response = await fetch(urlWithParams.toString(), options);
        if (!response.ok) throw new Error("Failed to fetch checkpoints");
        const result = await response.json();
        if (!result.success)
          throw new Error(result.message || "Failed to fetch checkpoints");

        setCheckpoints(result.data.checkpoints || []);
        if (result.data.total_checkpoints !== undefined) {
          setPagination({
            current_page: page,
            per_page: perPage,
            total_count: result.data.total_checkpoints,
            total_pages: Math.ceil(result.data.total_checkpoints / perPage),
          });
        }
      } catch (error) {
        console.error("Error fetching checkpoints:", error);
        toast.error("Failed to load checkpoints");
        setCheckpoints([]);
      } finally {
        setIsLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchCheckpoints(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchCheckpoints]);

  const columns = React.useMemo(
    () => [
      {
        key: "location_path",
        label: "Location",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "scheduled_times",
        label: "Scheduled Time",
        sortable: false,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "created_on",
        label: "Created On",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "start_date",
        label: "Start Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "end_date",
        label: "End Date",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "grace_time_hours",
        label: "Grace Time(Hours)",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "active",
        label: "Active/Inactive",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
      {
        key: "qr_code",
        label: "Qr Code",
        sortable: false,
        draggable: true,
        defaultVisible: true,
        hideable: true,
      },
    ],
    []
  );

  const renderCell = (item: CheckpointListItem, columnKey: string) => {
    switch (columnKey) {
      case "location_path":
        return (
          <div className="flex items-start gap-1.5 max-w-[280px]">
            <MapPin className="w-3.5 h-3.5 text-[#C72030] mt-0.5 flex-shrink-0" />
            <span className="text-sm">{item.location_path || "-"}</span>
          </div>
        );
      case "scheduled_times":
        return (
          <div className="text-sm max-w-[160px]">
            {item.scheduled_times && item.scheduled_times.length > 0 ? (
              item.scheduled_times.map((t, i) => (
                <div key={i} className="text-gray-700">
                  {t}
                </div>
              ))
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      case "created_on":
        return (
          <span className="text-sm">{formatDateTime(item.created_on)}</span>
        );
      case "start_date":
        return <span className="text-sm">{formatDate(item.start_date)}</span>;
      case "end_date":
        return <span className="text-sm">{formatDate(item.end_date)}</span>;
      case "grace_time_hours":
        return <span>{item.grace_time_hours ?? "-"}</span>;
      case "active":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.active ? "Active" : "Inactive"}
          </span>
        );
      case "qr_code":
        return item.qr_code_available && item.qr_code_url ? (
          <button
            onClick={() => {
              setQrPreviewUrl(item.qr_code_url);
              setQrPreviewName(item.name);
              setShowQrPreview(true);
            }}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-gray-200 hover:border-[#C72030] transition-colors text-xs font-medium text-gray-700"
            title="View QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            View QR
          </button>
        ) : (
          <span className="text-gray-400 text-xs">No QR</span>
        );
      default:
        return <span>{String(item[columnKey] ?? "-")}</span>;
    }
  };

  const renderActions = (item: CheckpointListItem) => (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        title="View checkpoint history"
        onClick={() =>
          navigate(`/security/patrolling/checkpoints/${item.id}/history`)
        }
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* QR Code Preview Dialog */}
      <Dialog open={showQrPreview} onOpenChange={setShowQrPreview}>
        <DialogContent className="max-w-sm" aria-describedby="qr-preview-desc">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code — {qrPreviewName}
            </DialogTitle>
            <div id="qr-preview-desc" className="sr-only">
              QR code preview for checkpoint
            </div>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            {qrPreviewUrl ? (
              <img
                src={qrPreviewUrl}
                alt="QR Code"
                className="max-w-full h-auto max-h-[400px]"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                No QR code available
              </span>
            )}
          </div>
          <div className="flex justify-end">
            <a
              href={qrPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#C72030] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Patrolling Checkpoints
          </h1>
          <p className="text-sm text-gray-600">
            View and manage patrolling checkpoints
          </p>
        </div>
      </div>

      {/* Checkpoints Table */}
      <div className="overflow-x-auto animate-fade-in">
        <div className="space-y-4">
          <EnhancedTable
            data={checkpoints}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="patrolling-checkpoints-table"
            enableExport={true}
            exportFileName="patrolling-checkpoints"
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search checkpoints..."
            pagination={false}
            pageSize={perPage}
            hideColumnsButton={false}
            hideTableExport={false}
            loading={isLoading}
          />
          {pagination.total_count > 0 && (
            <TicketPagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              totalRecords={pagination.total_count}
              perPage={perPage}
              isLoading={isLoading}
              onPageChange={(page) => setCurrentPage(page)}
              onPerPageChange={(newPerPage) => {
                setPerPage(newPerPage);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};