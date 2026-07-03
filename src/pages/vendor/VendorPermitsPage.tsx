import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "refNo", label: "Ref No.", sortable: true, draggable: true, defaultVisible: true },
  { key: "permitType", label: "Permit Type", sortable: true, draggable: true, defaultVisible: true },
  { key: "permitFor", label: "Permit For", sortable: true, draggable: true, defaultVisible: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
  { key: "designation", label: "Designation", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "location", label: "Location", sortable: true, draggable: true, defaultVisible: true },
  { key: "createdOn", label: "Created On", sortable: true, draggable: true, defaultVisible: true },
  { key: "permitExpiry", label: "Permit Expiry/Extend Date", sortable: true, draggable: true, defaultVisible: true },
];

export const VendorPermitsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [permitList, setPermitList] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalPermits: 0,
    draftPermits: 0,
    holdPermits: 0,
    openPermits: 0,
    approvedPermits: 0,
    rejectedPermits: 0,
    extendedPermits: 0,
    closedPermits: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 14,
    total_pages: 1,
  });

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://${baseUrl}/pms/permits/pending_permit_form.json?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch permit data");
      const data = await response.json();
      
      const items = data?.permits || data?.data || [];
      const formatted = items.map((item: any) => ({
        id: item.id,
        refNo: item.reference_number || item.ref_no || "-",
        permitType: item.permit_type?.name || item.permit_type || "-",
        permitFor: item.permit_for || "-",
        createdBy: item.created_by?.name || item.created_by || "-",
        designation: item.designation || "-",
        status: item.status || "-",
        location: item.location?.name || item.location || "-",
        createdOn: item.created_on || item.created_at || "-",
        permitExpiry: item.permit_expiry || "-",
      }));
      setPermitList(formatted);
      
      if (data?.cards) {
        setStats({
          totalPermits: data.cards.total || 0,
          draftPermits: data.cards.draft || 0,
          holdPermits: data.cards.hold || 0,
          openPermits: data.cards.open || 0,
          approvedPermits: data.cards.approved || 0,
          rejectedPermits: data.cards.rejected || 0,
          extendedPermits: data.cards.extended || 0,
          closedPermits: data.cards.closed || 0,
        });
      }

      const pg = data?.pagination;
      setPagination((prev) => ({
        ...prev,
        current_page: pg?.current_page ?? prev.current_page,
        total_count: pg?.total_count ?? data?.total_count ?? formatted.length,
        total_pages: pg?.total_pages ?? data?.total_pages ?? 1,
      }));
    } catch (error: any) {
      console.error(error);
      setPermitList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current_page);
  }, [pagination.current_page]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case "draft": return "bg-blue-600 text-white";
      case "open": return "bg-orange-500 text-white";
      case "expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <div className={`px-3 py-1 rounded text-xs font-semibold inline-block ${getStatusStyle(item.status)}`}>
          {item.status}
        </div>
      );
    }
    return item[columnKey] ?? "-";
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/vendor/permits/details/${item.id}`)}
        title="View"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) return;
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const refreshAction = (
    <Button
      variant="outline"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={() => fetchData(pagination.current_page)}
      disabled={loading}
      title="Refresh"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
    </Button>
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Permit &gt; <span className="text-gray-900 font-medium">Permit List</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">
          PERMIT LIST
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.totalPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Total Permits</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.draftPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Draft Permits</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.holdPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Hold Permits</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.openPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Open Permits</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.approvedPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Approved</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.rejectedPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Rejected</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.extendedPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Extended</p>
          </div>
        </div>
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.closedPermits}</p>
            <p className="text-xs text-gray-500 font-medium">Closed</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <EnhancedTable
          data={permitList}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="vendor-permits-columns"
          className="min-w-[1200px]"
          emptyMessage="No permits found"
          selectAllLabel="Select all permits"
          searchTerm={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search Permits..."
          exportFileName="vendor-permits"
          enableSearch={true}
          filterAdjacentActions={refreshAction}
          loading={loading}
        />
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total)
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* First page */}
              {pagination.current_page > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(1)}>1</PaginationLink>
                  </PaginationItem>
                  {pagination.current_page > 4 && (
                    <PaginationItem><span className="px-2 text-gray-400">…</span></PaginationItem>
                  )}
                </>
              )}

              {/* Pages around current */}
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                .filter(p => p >= pagination.current_page - 2 && p <= pagination.current_page + 2)
                .map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === pagination.current_page}
                      className={p === pagination.current_page ? "pointer-events-none" : "cursor-pointer"}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Last page */}
              {pagination.current_page < pagination.total_pages - 2 && (
                <>
                  {pagination.current_page < pagination.total_pages - 3 && (
                    <PaginationItem><span className="px-2 text-gray-400">…</span></PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(pagination.total_pages)}>
                      {pagination.total_pages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default VendorPermitsPage;
