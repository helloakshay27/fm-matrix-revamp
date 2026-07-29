import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { fetchDeletionRequests } from "@/store/slices/pendingApprovalSlice";
import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { useProcurementEvents } from "@/components/PostHogProcurementEvents";

interface DeletionRequestRow {
  id: number | string;
  type: string;
  prNo: string | number;
  siteName: string;
  level: string;
  level_id?: number | string;
  user_id?: number | string;
  delete_request_id?: number | string;
}

const columns: ColumnConfig[] = [
  {
    key: "type",
    label: "Type",
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "id",
    label: "ID",
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "prNo",
    label: "PR No.",
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "siteName",
    label: "Site Name",
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "level",
    label: "Level",
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const PRDeletionRequests = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [loading, setLoading] = useState(false);
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequestRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [draftTypeFilter, setDraftTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const procurementEvents = useProcurementEvents();

  const getDeletionRequests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchDeletionRequests({ baseUrl, token, page })
      ).unwrap();
      const formattedResponse = (response.pending_data || []).map(
        (item: {
          resource_id: number | string;
          resource_type?: string;
          letter_of_indent?: boolean;
          external_id?: string | number;
          site_name?: string;
          approval_level_name?: string;
          level_id?: number | string;
          user_id?: number | string;
          delete_request_id?: number | string;
        }) => ({
          id: item.resource_id,
          type:
            item.resource_type === "Pms::PurchaseOrder" && item.letter_of_indent === true
              ? "Material PR"
              : item.resource_type === "Pms::WorkOrder" && item.letter_of_indent === true
                ? "Service PR"
                : "",
          prNo: item.external_id,
          siteName: item.site_name,
          level: item.approval_level_name,
          level_id: item.level_id,
          user_id: item.user_id,
          delete_request_id: item.delete_request_id,
        })
      );
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages,
      });
      setDeletionRequests(formattedResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeletionRequests();
    try {
      procurementEvents.onProcurementListViewed("deletion_requests", {
        list_type: "deletion_requests",
        row_count: deletionRequests.length,
      });
    } catch {
      /* ignore analytics errors */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = deletionRequests.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      item.type.toLowerCase().includes(q) ||
      String(item.id).toLowerCase().includes(q) ||
      String(item.prNo ?? "").toLowerCase().includes(q) ||
      String(item.siteName ?? "").toLowerCase().includes(q) ||
      String(item.level ?? "").toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const renderCell = (item: DeletionRequestRow, columnKey: string) => {
    switch (columnKey) {
      case "type":
        return <span className="font-medium text-gray-900">{item.type || "—"}</span>;
      case "id":
        return <span className="text-gray-900">{item.id}</span>;
      case "prNo":
        return <span className="text-gray-900">{item.prNo ?? "—"}</span>;
      case "siteName":
        return item.siteName || "—";
      case "level":
        return item.level || "—";
      default:
        return "—";
    }
  };

  const renderActions = (item: DeletionRequestRow) => {
    const url =
      item.type === "Material PR"
        ? "finance/material-pr/details"
        : item.type === "Service PR"
          ? "finance/service-pr/details"
          : "";

    if (!shouldShow("Material PR", "show") || !url) return null;

    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        title="View"
        onClick={() =>
          navigate(
            `/${url}/${item.id}?level_id=${item.level_id}&user_id=${item.user_id}&request_id=${item.delete_request_id}&type=delete-request`
          )
        }
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
  };

  const handlePageChange = async (page: number) => {
    if (
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page ||
      loading
    ) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await getDeletionRequests(page);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const handleApplyFilters = () => {
    setTypeFilter(draftTypeFilter);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setDraftTypeFilter("all");
    setTypeFilter("all");
    setShowFilters(false);
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
            aria-disabled={loading}
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
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">PR Deletion Requests</h1>

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="pr-deletion-requests-table"
          emptyMessage="No PR deletion requests found"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          disableClientSearch
          searchPlaceholder="Search deletion requests..."
          onFilterClick={() => {
            setDraftTypeFilter(typeFilter);
            setShowFilters(true);
          }}
          hideTableExport
          loading={loading}
          getItemId={(item) => String(item.id)}
        />
      </div>

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
                    Math.min(pagination.total_pages, pagination.current_page + 1)
                  )
                }
                className={
                  pagination.current_page === pagination.total_pages || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Filters</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={draftTypeFilter} onValueChange={setDraftTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Material PR">Material PR</SelectItem>
                  <SelectItem value="Service PR">Service PR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="h-9"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button
              className="h-9 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
