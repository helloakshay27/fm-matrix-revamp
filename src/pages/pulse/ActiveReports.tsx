import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import axios from "axios";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Report {
  id: number;
  issue_type: string;
  issue_description: string;
  review_status: string;
  report_date: string;
  // optional fields that may come from API
  reported_by?: string;
  reported_against?: string;
  report_time?: string;
  status?: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  reports: Report[];
}

// ─── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  "Under Review",
  "Action in Progress",
  "Resolved",
  "Closed",
] as const;

type TabValue = (typeof TABS)[number];

// ─── Status dropdown ──────────────────────────────────────────────────────────

const STATUS_OPTIONS: TabValue[] = [
  "Under Review",
  "Action in Progress",
  "Resolved",
  "Closed",
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ActiveReports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>("Under Review");

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // ── Fetch reports ────────────────────────────────────────────────────────────
  const fetchReports = useCallback(
    async (tab: TabValue) => {
      if (!baseUrl || !token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse>(
          `https://${baseUrl}/reports.json`,
          {
            params: {
              "q[resource_type_eq]": "Ride",
              "q[status_eq]": tab,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReports(response.data?.reports ?? []);
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err)
            ? err.response?.data?.error ?? err.message
            : "Failed to fetch reports";
        setError(message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, token]
  );

  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab, fetchReports]);

  // ── Update status ────────────────────────────────────────────────────────────
  const handleStatusChange = async (reportId: number, newStatus: string) => {
    if (!baseUrl || !token) return;
    setUpdatingId(reportId);
    try {
      await axios.put(
        `https://${baseUrl}/reports/${reportId}.json`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated successfully");
      // Refresh current tab
      fetchReports(activeTab);
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to update status";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Shared table columns ──────────────────────────────────────────────────────
  const columns = [
    { key: "actions",          label: "Action",            sortable: false, hideable: false, draggable: false },
    { key: "reportedBy",       label: "Reported by",       sortable: true,  hideable: true,  draggable: true  },
    { key: "reportedAgainst",  label: "Reported Against",  sortable: true,  hideable: true,  draggable: true  },
    { key: "issueDescription", label: "Issue Description", sortable: false, hideable: true,  draggable: true  },
    { key: "reportTime",       label: "Report Time",       sortable: true,  hideable: true,  draggable: true  },
    { key: "reportDate",       label: "Report Date",       sortable: true,  hideable: true,  draggable: true  },
    { key: "statusBadge",      label: "Status",            sortable: false, hideable: true,  draggable: true  },
    { key: "statusDropdown",   label: "Status",            sortable: false, hideable: false, draggable: false },
  ];

  // Map API report → table row
  const tableData = reports.map((r) => ({
    id: String(r.id),
    reportedBy:       r.reported_by       ?? "—",
    reportedAgainst:  r.reported_against  ?? "—",
    issueDescription: r.issue_description ?? "—",
    reportTime:       r.report_time       ?? "—",
    reportDate:       r.report_date       ?? "—",
    status:           r.review_status     ?? activeTab,
    issue_type:       r.issue_type        ?? "",
    rawId:            r.id,
  }));

  const renderRow = (row: (typeof tableData)[number]) => ({
    actions: (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/pulse/carpool/ride-detail?id=${row.id}`);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
    reportedBy:       row.reportedBy,
    reportedAgainst:  row.reportedAgainst,
    issueDescription: <span className="max-w-[250px] block">{row.issueDescription}</span>,
    reportTime:       row.reportTime,
    reportDate:       row.reportDate,
    statusBadge: (
      <Badge
        variant="secondary"
        className={
          row.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }
      >
        {row.status}
      </Badge>
    ),
    statusDropdown: (
      <div className="relative">
        <select
          aria-label="Change report status"
          defaultValue={row.status}
          disabled={updatingId === row.rawId}
          onChange={(e) => handleStatusChange(row.rawId, e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] cursor-pointer disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          {updatingId === row.rawId ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          )}
        </div>
      </div>
    ),
  });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white px-6 py-4 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span
          className="cursor-pointer hover:text-gray-700"
          onClick={() => navigate("/pulse/carpool")}
        >
          Carpool
        </span>{" "}
        &gt; <span className="text-gray-700">Active Reports</span>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border">
          <TabsTrigger
            value="Under Review"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Under Review
          </TabsTrigger>
          <TabsTrigger
            value="Action in Progress"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Action in Progress
          </TabsTrigger>
          <TabsTrigger
            value="Resolved"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Resolved
          </TabsTrigger>
          <TabsTrigger
            value="Closed"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Closed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Section Title */}
      <h2 className="text-xl font-bold mb-4">Active Reports</h2>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
          <AlertCircle className="w-10 h-10 text-[#C72030]" />
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchReports(activeTab)}>
            Retry
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <EnhancedTaskTable
          data={tableData}
          columns={columns}
          renderRow={renderRow}
          enableSearch={false}
          hideColumnsButton={true}
          enableSelection={false}
          hideTableExport={true}
          selectable={false}
          enableExport={false}
          hideTableSearch={true}
          storageKey={`carpool-active-reports-${activeTab}`}
          emptyMessage="No reports found"
          exportFileName="active-reports"
        />
      )}
    </div>
  );
};
