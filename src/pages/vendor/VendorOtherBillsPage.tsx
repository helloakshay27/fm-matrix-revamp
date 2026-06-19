import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Settings, Info, CreditCard, Banknote, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
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
      const url = getFullUrl(`/pms/bills/bills_list.json?page=${page}`);
      const response = await fetch(url, {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills data");
      }

      const data = await response.json();

      // Assuming data structure based on standard Lockated API
      const summary = data.summary || {};
      setStats({
        totalBills: summary.total_bill_count || summary.total || 0,
        totalAmount: summary.total_amount || 0,
        totalPaidAmount: summary.total_paid || summary.paid_amount || 0,
        totalPendingAmount: summary.total_pending || summary.pending_amount || 0,
      });

      const list = data.bills_list || data.bills || data.data || [];
      const mappedList = list.map((item: any) => ({
        id: item.id,
        description: item.description,
        supplier: item.supplier_name || item.supplier,
        amount: item.amount || item.bill_amount,
        deduction: item.deduction,
        tdsPercent: item.tds_percent || item.tds_percentage,
        tdsAmount: item.tds_amount,
        retentionPercent: item.retention_percent || item.retention_percentage,
        retentionAmount: item.retention_amount,
        payableAmount: item.payable_amount,
        billDate: item.bill_date,
        invoiceNumber: item.invoice_number,
        paymentTenure: item.payment_tenure,
        lastApprovedBy: item.last_approved_by,
        amountPaid: item.amount_paid,
        balanceAmount: item.balance_amount,
        paymentStatus: item.payment_status,
        createdOn: item.created_at,
        createdBy: item.created_by,
        ...item // keep original keys just in case
      }));

      setBillList(mappedList);
      
      const paginationData = data.pagination || {};
      setPagination((prev) => ({ 
        ...prev, 
        current_page: paginationData.current_page || data.current_page || page, 
        total_pages: paginationData.total_pages || data.total_pages || 1,
        total_count: paginationData.total_count || data.total_count || mappedList.length,
      }));
    } catch (error) {
      console.error("Error fetching bills:", error);
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
        onClick={() => navigate(`/vendor/other-bills/details/${item.id}`)}
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
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">{stats.totalBills}</p>
            <p className="text-xs text-gray-500 font-medium">Total Bills</p>
          </div>
        </div>
        
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">₹ {stats.totalAmount}</p>
            <p className="text-xs text-gray-500 font-medium">Total Amount</p>
          </div>
        </div>

        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">₹ {stats.totalPaidAmount}</p>
            <p className="text-xs text-gray-500 font-medium">Total Paid Amount</p>
          </div>
        </div>

        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 h-[100px]">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#D92818]" />
          </div>
          <div>
            <p className="text-[#D92818] font-bold text-lg leading-tight">₹ {stats.totalPendingAmount}</p>
            <p className="text-xs text-gray-500 font-medium">Total Pending Amount</p>
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
