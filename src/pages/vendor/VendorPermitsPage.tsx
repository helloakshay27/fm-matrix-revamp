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
  
  const [permitList, setPermitList] = useState<any[]>([
    {
      id: 448, refNo: 21610, permitType: "Electrical Work", permitFor: "wiring", createdBy: "Testing 1", designation: "TECHNICAL", status: "Draft", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "11/06/2026 12:30 PM", permitExpiry: ""
    },
    {
      id: 447, refNo: 21609, permitType: "Electrical Work", permitFor: "Height work", createdBy: "Testing 1", designation: "TECHNICAL", status: "Draft", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "11/06/2026 12:28 PM", permitExpiry: ""
    },
    {
      id: 443, refNo: 21590, permitType: "Height Work", permitFor: "cleaning", createdBy: "Testing 1", designation: "TECHNICAL", status: "Draft", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "10/06/2026 10:49 AM", permitExpiry: ""
    },
    {
      id: 442, refNo: 21587, permitType: "Height Work", permitFor: "Tank cleaning", createdBy: "Testing 1", designation: "TECHNICAL", status: "Draft", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "10/06/2026 10:32 AM", permitExpiry: ""
    },
    {
      id: 441, refNo: 21558, permitType: "Confined Space Work", permitFor: "tank cleaning", createdBy: "Testing 1", designation: "TECHNICAL", status: "Open", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "08/06/2026 11:20 AM", permitExpiry: ""
    },
    {
      id: 440, refNo: 21556, permitType: "Height Work", permitFor: "cctv", createdBy: "Testing 1", designation: "TECHNICAL", status: "Expired", location: "Site - Panchshil Test / Building - Vinayak Build / Wing - NA / Floor - NA / Area - NA", createdOn: "08/06/2026 11:04 AM", permitExpiry: "10/06/2026 6:00 PM"
    },
  ]);

  const [stats, setStats] = useState({
    totalPermits: 14,
    draftPermits: 7,
    openPermits: 3,
    approvedPermits: 1,
    rejectedPermits: 0,
    extendedPermits: 1,
    closedPermits: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 14,
    total_pages: 1,
  });

  const fetchData = async (page: number) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
        onClick={() => {}}
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
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #6c3258 0%, #d87d3a 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.totalPermits}</div><div className="text-xs font-medium">Total Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #e47738 0%, #d45934 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.draftPermits}</div><div className="text-xs font-medium">Draft Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #e47738 0%, #d45934 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.openPermits}</div><div className="text-xs font-medium">Open Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #1aa476 0%, #157956 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.approvedPermits}</div><div className="text-xs font-medium">Approved Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #c44d32 0%, #aa3e28 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.rejectedPermits}</div><div className="text-xs font-medium">Rejected Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #25c4be 0%, #1b908b 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.extendedPermits}</div><div className="text-xs font-medium">Extended Permits</div></div>
        </div>
        <div className="rounded-lg p-3 flex items-center gap-3 text-white flex-1 min-w-[140px]" style={{ background: "linear-gradient(90deg, #1aa476 0%, #157956 100%)" }}>
          <div className="bg-white/20 p-1.5 rounded-full"><Settings className="w-5 h-5" /></div>
          <div><div className="text-xl font-bold">{stats.closedPermits}</div><div className="text-xs font-medium">Closed Permits</div></div>
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

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default VendorPermitsPage;
