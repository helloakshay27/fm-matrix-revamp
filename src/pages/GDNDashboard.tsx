import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GDNRequest {
  id: number;
  gdn_date: string;
  inventory_count: number;
  status: string;
  created_at: string;
  created_by: string;
  handed_over_to: string | null;
}

interface GDNPagination {
  current_page: number;
  total_pages: number;
  total_entries: number;
  per_page: number;
}

const GDN_REQUEST_LIST_ENDPOINT = "/pms/srns/gdn_request_list.json";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "gdn_date",
    label: "GDN Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "inventory_count",
    label: "Inventory Count",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "handed_over_to",
    label: "Handed Over To",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const GDNDashboard = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [gdnData, setGdnData] = useState<GDNRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<GDNPagination>({
    current_page: 1,
    total_pages: 0,
    total_entries: 0,
    per_page: 15,
  });

  const fetchGdnRequests = async (page = 1) => {
    setLoading(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL(GDN_REQUEST_LIST_ENDPOINT, baseUrl);
      url.searchParams.set("page", String(page));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GDN request list (${response.status})`
        );
      }

      const result = await response.json();
      setGdnData(Array.isArray(result.data) ? result.data : []);
      setPagination({
        current_page: Number(result.pagination?.current_page || page),
        total_pages: Number(result.pagination?.total_pages || 0),
        total_entries: Number(result.pagination?.total_entries || 0),
        per_page: Number(result.pagination?.per_page || 15),
      });
    } catch (error) {
      console.error("Error fetching GDN request list:", error);
      toast.error("Failed to load GDN request list. Please try again.");
      setGdnData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGdnRequests();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "dispatched":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderCell = (item: GDNRequest, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          {item.status || "-"}
        </span>
      );
    }

    const value = item[columnKey as keyof GDNRequest];
    return value ?? "-";
  };

  const renderActions = (item: GDNRequest) => (
    <>
      {shouldShow("GDN", "show") && (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/finance/gdn/details/${item.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
    </>
  );

  const leftActions = shouldShow("GDN", "create") ? (
    <Button
      className="fm-button-fix fm-button-brand px-4 py-2"
      onClick={() => navigate("/finance/gdn/request-add")}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  const handlePageChange = (page: number) => {
    if (
      loading ||
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page
    ) {
      return;
    }

    fetchGdnRequests(page);
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
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GDN Generation &gt; GDN List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">GDN LIST</h1>

      <EnhancedTable
        data={gdnData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="gdn-request-list-table"
        emptyMessage="No GDN requests found"
        hideTableExport={true}
        loading={loading}
        loadingMessage="Loading GDN requests..."
        leftActions={leftActions}
      />

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
