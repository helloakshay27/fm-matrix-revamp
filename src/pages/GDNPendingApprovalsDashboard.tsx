import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GDNRequest {
  id: number;
  gdn_date?: string;
  status?: string;
  site_name?: string;
}

interface GDNPendingApprovalReference extends GDNRequest {
  resource_id?: number;
  srn_id?: number;
  gdn_id?: number;
  level_id?: number;
  approval_level_id?: number;
  approval_level_name?: string;
  level_name?: string;
  user_id?: number | string | null;
}

interface GDNApprovalLevel {
  level_id: number;
  level_name: string;
  status: string;
  approved_by?: string | null;
  approved_at?: string | null;
  user_id?: number | string | null;
}

interface GDNInventory {
  inventory_name?: string;
  quantity?: number;
  purpose?: string;
  reason?: string;
  handed_over_to?: string | null;
}

interface GDNDetails {
  gdn_date?: string;
  description?: string;
  status?: string;
  approval_levels?: GDNApprovalLevel[];
  inventories?: GDNInventory[];
  can_take_action?: boolean;
  site_name?: string;
}

interface GDNPendingApproval {
  gdnId: number;
  gdnDate: string;
  description: string;
  status: string;
  siteName: string;
  level: string;
  levelId?: number;
  userId?: string;
  inventorySummary: string;
  handedOverTo: string;
}

interface GDNPagination {
  current_page: number;
  total_pages: number;
  total_entries: number;
  per_page: number;
}

const GDN_REQUEST_LIST_ENDPOINT = "/pms/srns/gdn_request_list.json";
const GDN_PENDING_APPROVALS_ENDPOINT = "/pms/srns/pending_approvals.json";

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

  const displayValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isPendingStatus = (status?: string) =>
    status?.toLowerCase().includes("pending") || false;

  const getUserId = (level?: { user_id?: number | string | null }) =>
    String(
      level?.user_id ??
        localStorage.getItem("user_id") ??
        localStorage.getItem("userId") ??
        ""
    );

  const buildInventorySummary = (inventories?: GDNInventory[]) => {
    if (!Array.isArray(inventories) || inventories.length === 0) return "-";

    return inventories
      .map((inventory) => {
        const name = inventory.inventory_name || "-";
        const quantity =
          inventory.quantity === null || inventory.quantity === undefined
            ? "-"
            : inventory.quantity;
        return `${name} (${quantity})`;
      })
      .join(", ");
  };

  const getReferenceGdnId = (item: GDNPendingApprovalReference) =>
    Number(item.resource_id ?? item.srn_id ?? item.gdn_id ?? item.id);

  const getReferenceLevelId = (item: GDNPendingApprovalReference) =>
    item.level_id ?? item.approval_level_id;

  const getPaginationFromResponse = (
    result: any,
    page: number
  ): GDNPagination => ({
    current_page: Number(
      result.pagination?.current_page ||
        result.current_page ||
        result.page ||
        page
    ),
    total_pages: Number(
      result.pagination?.total_pages || result.total_pages || 0
    ),
    total_entries: Number(
      result.pagination?.total_entries ||
        result.pagination?.total_count ||
        result.total_entries ||
        result.total_count ||
        0
    ),
    per_page: Number(result.pagination?.per_page || result.per_page || 15),
  });

  const getResponseItems = (result: any): GDNPendingApprovalReference[] => {
    const source = Array.isArray(result.pending_approvals)
      ? result.pending_approvals
      : Array.isArray(result.pending_data)
        ? result.pending_data
        : Array.isArray(result.data)
          ? result.data
          : [];

    return source
      .map((item: GDNPendingApprovalReference) => ({
        ...item,
        id: getReferenceGdnId(item),
      }))
      .filter((item: GDNPendingApprovalReference) => Boolean(item.id));
  };

  const fetchJson = async (endpoint: string, page: number) => {
    const baseUrl = API_CONFIG.BASE_URL;
    if (!baseUrl) {
      throw new Error("Base URL is not configured.");
    }

    const url = new URL(endpoint, baseUrl);
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} (${response.status})`);
    }

    return response.json();
  };

  const fetchPendingApprovalReferences = async (page: number) => {
    try {
      const pendingResult = await fetchJson(
        GDN_PENDING_APPROVALS_ENDPOINT,
        page
      );
      const pendingItems = getResponseItems(pendingResult);

      return {
        items: pendingItems,
        pagination: getPaginationFromResponse(pendingResult, page),
      };
    } catch (error) {
      console.info(
        "GDN pending approvals endpoint unavailable, falling back to request list:",
        error
      );
    }

    const requestResult = await fetchJson(GDN_REQUEST_LIST_ENDPOINT, page);
    const pendingItems = getResponseItems(requestResult).filter((request) =>
      isPendingStatus(request.status)
    );

    return {
      items: pendingItems,
      pagination: getPaginationFromResponse(requestResult, page),
    };
  };

  const fetchGdnDetails = async (gdnId: number): Promise<GDNDetails | null> => {
    const baseUrl = API_CONFIG.BASE_URL;
    if (!baseUrl) {
      throw new Error("Base URL is not configured.");
    }

    const url = new URL(`/pms/srns/${gdnId}/srn_show.json`, baseUrl);
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GDN details (${response.status})`);
    }

    return response.json();
  };

  const mapDetailsToPendingRows = (
    request: GDNPendingApprovalReference,
    details: GDNDetails | null
  ): GDNPendingApproval[] => {
    const referenceLevelId = getReferenceLevelId(request);
    const approvalLevels = Array.isArray(details?.approval_levels)
      ? details.approval_levels
      : [];
    const matchedReferenceLevel = referenceLevelId
      ? approvalLevels.find(
          (level) => String(level.level_id) === String(referenceLevelId)
        )
      : undefined;
    const pendingLevels = matchedReferenceLevel
      ? [matchedReferenceLevel]
      : approvalLevels.filter((level) => isPendingStatus(level.status));

    const inventories = details?.inventories || [];
    const fallbackRow = {
      gdnId: request.id,
      gdnDate: displayValue(details?.gdn_date || request.gdn_date),
      description: displayValue(details?.description),
      status: displayValue(details?.status || request.status || "Pending"),
      siteName: displayValue(details?.site_name || request.site_name),
      inventorySummary: buildInventorySummary(inventories),
      handedOverTo: displayValue(inventories[0]?.handed_over_to),
    };

    if (pendingLevels.length === 0 && isPendingStatus(fallbackRow.status)) {
      return [
        {
          ...fallbackRow,
          level: displayValue(
            request.approval_level_name || request.level_name || "Pending"
          ),
          levelId: referenceLevelId,
          userId: getUserId(request),
        },
      ];
    }

    return pendingLevels.map((level) => ({
      ...fallbackRow,
      level: displayValue(level.level_name),
      levelId: level.level_id,
      status: displayValue(level.status || fallbackRow.status),
      userId: getUserId(level),
    }));
  };

  const fetchPendingApprovals = async (page = 1) => {
    setLoading(true);

    try {
      const { items, pagination: responsePagination } =
        await fetchPendingApprovalReferences(page);

      const pendingRows = await Promise.all(
        items.map(async (request) => {
          try {
            const details = await fetchGdnDetails(request.id);
            return mapDetailsToPendingRows(request, details);
          } catch (error) {
            console.error(`Error fetching GDN ${request.id} details:`, error);
            return mapDetailsToPendingRows(request, null);
          }
        })
      );

      setPendingApprovalsData(pendingRows.flat());
      setPagination(responsePagination);
    } catch (error) {
      console.error("Error fetching GDN pending approvals:", error);
      toast.error("Failed to load GDN pending approvals. Please try again.");
      setPendingApprovalsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

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
    <div className="p-6">
      <div className="mb-4 text-sm text-gray-600">
        GDN &gt; Pending Approvals
      </div>

      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">GDN ID</TableHead>
              <TableHead className="font-semibold">Site Name</TableHead>
              <TableHead className="font-semibold">GDN Date</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Inventory</TableHead>
              <TableHead className="font-semibold">Pending Level</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Handed Over To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading GDN pending approvals...
                  </div>
                </TableCell>
              </TableRow>
            ) : pendingApprovalsData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  No pending approvals found
                </TableCell>
              </TableRow>
            ) : (
              pendingApprovalsData.map((item) => (
                <TableRow
                  key={`${item.gdnId}-${item.levelId || item.level}`}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => handleView(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.gdnId}</TableCell>
                  <TableCell>{item.siteName}</TableCell>
                  <TableCell>{item.gdnDate}</TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {item.description}
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate">
                    {item.inventorySummary}
                  </TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.handedOverTo}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
