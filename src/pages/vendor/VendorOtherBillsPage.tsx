import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Settings, Info, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "description", label: "Description", sortable: true, draggable: true, defaultVisible: true },
  { key: "supplier", label: "Supplier", sortable: true, draggable: true, defaultVisible: true },
  { key: "amount", label: "Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "deduction", label: "Deduction", sortable: true, draggable: true, defaultVisible: true },
  { key: "tdsPercent", label: "TDS(%)", sortable: true, draggable: true, defaultVisible: true },
  { key: "tdsAmount", label: "TDS Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "retentionPercent", label: "Retention(%)", sortable: true, draggable: true, defaultVisible: true },
  { key: "retentionAmount", label: "Retention Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "payableAmount", label: "Payable Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "billDate", label: "Bill Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "invoiceNumber", label: "Invoice Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "paymentTenure", label: "Payment Tenure in Days", sortable: true, draggable: true, defaultVisible: true },
  { key: "lastApprovedBy", label: "Last Approved By", sortable: true, draggable: true, defaultVisible: true },
  { key: "amountPaid", label: "Amount Paid", sortable: true, draggable: true, defaultVisible: true },
  { key: "balanceAmount", label: "Balance Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "paymentStatus", label: "Payment Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "createdOn", label: "Created On", sortable: true, draggable: true, defaultVisible: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
];

export const VendorOtherBillsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [billList, setBillList] = useState<any[]>([]);

  // Stats for the cards
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0,
  });

  const [pagination, setPagination] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      current_page: Number(params.get("page")) || 1,
      total_count: 0,
      total_pages: 1,
    };
  });

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      // Mock data representing what would normally come from the API
      setStats({
        totalBills: 0,
        totalAmount: 0,
        totalPaidAmount: 0,
        totalPendingAmount: 0,
      });
      setBillList([]);
      setPagination((prev) => ({ ...prev, current_page: page, total_pages: 1 }));
    } catch (error) {
      console.error(error);
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

  const renderCell = (item: any, columnKey: string) => {
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
    navigate(`${location.pathname}?page=${page}`, { replace: true });
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
        <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">
          BILL LIST
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg p-4 flex items-center gap-4 text-white" style={{ background: "linear-gradient(90deg, #872e4a 0%, #d25039 100%)" }}>
          <div className="bg-white/20 p-2 rounded-full">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalBills}</div>
            <div className="text-sm font-medium">Total Bills</div>
          </div>
        </div>
        
        <div className="rounded-lg p-4 flex items-center gap-4 text-white" style={{ background: "linear-gradient(90deg, #6c3258 0%, #d87d3a 100%)" }}>
          <div className="bg-white/20 p-2 rounded-full">
            <span className="font-bold text-lg">₹</span>
          </div>
          <div>
            <div className="text-2xl font-bold">₹ {stats.totalAmount}</div>
            <div className="text-sm font-medium">Total Amount</div>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-center gap-4 text-white" style={{ background: "linear-gradient(90deg, #e47738 0%, #d45934 100%)" }}>
          <div className="bg-white/20 p-2 rounded-full">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">₹ {stats.totalPaidAmount}</div>
            <div className="text-sm font-medium">Total Paid Amount</div>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-center gap-4 text-white" style={{ background: "linear-gradient(90deg, #c44d32 0%, #aa3e28 100%)" }}>
          <div className="bg-white/20 p-2 rounded-full">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">₹ {stats.totalPendingAmount}</div>
            <div className="text-sm font-medium">Total Pending Amount</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <EnhancedTable
          data={billList}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="vendor-other-bills-columns"
          className="min-w-[1200px]"
          emptyMessage="No bills found"
          selectAllLabel="Select all bills"
          searchTerm={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search Bills..."
          exportFileName="vendor-other-bills"
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

export default VendorOtherBillsPage;
