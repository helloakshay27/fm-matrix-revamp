import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Eye } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GDNPendingApproval {
  gdnId: number;
  siteName: string;
  level: string;
  levelId?: number;
  userId?: number | string | null;
}

interface GDNPagination {
  current_page: number;
  total_pages: number;
  total_entries: number;
  per_page: number;
}

interface GDNPendingApprovalApiItem {
  gdn_id?: number | string;
  id?: number | string;
  site_name?: string | number | boolean | null;
  level_name?: string | number | boolean | null;
  level_id?: number;
  user_id?: number | string | null;
}

interface GDNPendingApprovalsResponse {
  pending_data?: GDNPendingApprovalApiItem[];
  pending_approvals?: GDNPendingApprovalApiItem[];
  pagination?: Partial<GDNPagination> & {
    total_count?: number;
  };
  current_page?: number;
  page?: number;
  total_pages?: number;
  total_entries?: number;
  total_count?: number;
  per_page?: number;
}

const GDN_PENDING_APPROVALS_ENDPOINT = "/pms/srns/pending_approvals.json";

const columns: ColumnConfig[] = [
  {
    key: "gdnId",
    label: "GDN ID",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "siteName",
    label: "Site Name",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "level",
    label: "Level",
    sortable: true,
    defaultVisible: true,
  },
];

const displayValue = (value?: string | number | boolean | null) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const getPaginationFromResponse = (
  result: GDNPendingApprovalsResponse,
  page: number
): GDNPagination => ({
  current_page: Number(
    result.pagination?.current_page || result.current_page || result.page || page
  ),
  total_pages: Number(result.pagination?.total_pages || result.total_pages || 0),
  total_entries: Number(
    result.pagination?.total_entries ||
      result.pagination?.total_count ||
      result.total_entries ||
      result.total_count ||
      0
  ),
  per_page: Number(result.pagination?.per_page || result.per_page || 15),
});

export const GDNPendingApprovalsDashboard = () => {
  const navigate = useNavigate();
  const [pendingApprovalsData, setPendingApprovalsData] = useState<
    GDNPendingApproval[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GDNPagination>({
    current_page: 1,
    total_pages: 0,
    total_entries: 0,
    per_page: 15,
  });

  const fetchPendingApprovals = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) throw new Error("Base URL is not configured.");
      const url = new URL(GDN_PENDING_APPROVALS_ENDPOINT, baseUrl);
      url.searchParams.set("page", String(page));
      const response = await fetch(url.toString(), {
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to fetch pending approvals (${response.status})`);
      const result = (await response.json()) as GDNPendingApprovalsResponse;
      const source: GDNPendingApprovalApiItem[] = Array.isArray(result.pending_data)
        ? result.pending_data
        : Array.isArray(result.pending_approvals)
          ? result.pending_approvals
          : [];
      const rows: GDNPendingApproval[] = source.map((item) => ({
        gdnId: Number(item.gdn_id ?? item.id),
        siteName: displayValue(item.site_name),
        level: displayValue(item.level_name),
        levelId: item.level_id,
        userId: item.user_id,
      }));
      setPendingApprovalsData(rows);
      setPagination(getPaginationFromResponse(result, page));
    } catch (error) {
      console.error("Error fetching GDN pending approvals:", error);
      toast.error("Failed to load GDN pending approvals. Please try again.");
      setPendingApprovalsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleView = (item: GDNPendingApproval) => {
    const queryParams = new URLSearchParams();

    if (item.levelId) {
      queryParams.set("level_id", String(item.levelId));
    }

    if (item.userId) {
      queryParams.set("user_id", item.userId);
    }

    queryParams.set("type", "approval");

    navigate(
      `/finance/gdn/pending-approvals/details/${item.gdnId}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
  };

  const renderCell = (item: GDNPendingApproval, columnKey: string) => {
    const value = item[columnKey as keyof GDNPendingApproval];
    return displayValue(value);
  };

  const renderActions = (item: GDNPendingApproval) => (
    <Button
      size="sm"
      variant="ghost"
      className="p-1"
      onClick={() => handleView(item)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  const handlePageChange = (page: number) => {
    if (
      loading ||
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page
    ) {
      return;
    }

    fetchPendingApprovals(page);
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }

    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let page = start; page <= end; page += 1) {
        items.push(
          <PaginationItem key={page} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    } else {
      for (let page = 1; page <= totalPages; page += 1) {
        items.push(
          <PaginationItem key={page} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-4 text-sm text-gray-600">
        GDN &gt; Pending Approvals
      </div>

      <h1 className="text-2xl font-semibold mb-6">GDN Pending Approvals</h1>

      <Card className="shadow-sm border border-border">
        <div className="flex items-center gap-3 px-6 pt-6 pb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Pending Approvals
          </h3>
        </div>
        <CardContent>
          <EnhancedTable
            data={pendingApprovalsData}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="gdn-pending-approvals"
            emptyMessage="No pending approvals found"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            loading={loading}
            loadingMessage="Loading GDN pending approvals..."
          />
        </CardContent>
      </Card>

      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.current_page - 1))
                  }
                  className={
                    pagination.current_page === 1 || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.total_pages,
                        pagination.current_page + 1
                      )
                    )
                  }
                  className={
                    pagination.current_page === pagination.total_pages ||
                    loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
