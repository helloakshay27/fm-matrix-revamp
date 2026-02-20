import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

// Type definitions for Bill
interface Bill {
  id: number;
  bill_number: string;
  vendor_name: string;
  date: string;
  due_date: string;
  amount: number;
  balance_due: number;
  status: "draft" | "open" | "paid" | "overdue" | "cancelled";
  reference_number: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Bill[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface BillFilters {
  status?: string;
  vendorId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "date",
    label: "Date",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "bill_number",
    label: "Recurring Bill#",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "reference_number",
    label: "Reference Number",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "vendor_name",
    label: "Vendor Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "due_date",
    label: "Due Date",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "balance_due",
    label: "Balance Due",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

export const RecurringBillsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<BillFilters>({});
  const [billData, setBillData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false,
  });

  // Fetch bill data from API
  const fetchBillData = async (
    page = 1,
    per_page = 10,
    search = "",
    filters: BillFilters = {}
  ) => {
    setLoading(true);
    try {
      // Load recurring bills from localStorage
      const storedBills = JSON.parse(
        localStorage.getItem("recurringBills") || "[]"
      );

      // Use stored bills directly (no mock data)
      const mockData: Bill[] = storedBills;

      // Filter based on search
      let filteredData = mockData;
      if (search.trim()) {
        filteredData = mockData.filter(
          (bill) =>
            bill.bill_number.toLowerCase().includes(search.toLowerCase()) ||
            bill.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
            bill.reference_number.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply filters
      if (filters.status) {
        filteredData = filteredData.filter(
          (order) => order.status === filters.status
        );
      }

      const totalCount = filteredData.length;
      const totalPages = Math.ceil(totalCount / per_page);
      const startIndex = (page - 1) * per_page;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + per_page
      );

      setBillData(paginatedData);
      setPagination({
        current_page: page,
        per_page: per_page,
        total_pages: totalPages,
        total_count: totalCount,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
      });
    } catch (error: unknown) {
      console.error("Error fetching bill data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to load bill data: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchBillData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (!term.trim()) {
      fetchBillData(1, perPage, "", appliedFilters);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      open: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const totalRecords = pagination.total_count;
  const totalPages = pagination.total_pages;
  const displayedData = billData;

  // Render row function for enhanced table
  const renderRow = (bill: Bill) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleView(bill.id)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEdit(bill.id)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(bill.id)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    date: (
      <span className="text-sm text-gray-600">
        {new Date(bill.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    ),
    bill_number: (
      <div className="font-medium text-blue-600">{bill.bill_number}</div>
    ),
    reference_number: (
      <span className="text-sm text-gray-900">{bill.reference_number}</span>
    ),
    vendor_name: (
      <span className="text-sm text-gray-900">{bill.vendor_name}</span>
    ),
    status: (
      <div className="flex items-center justify-center">
        {getStatusBadge(bill.status)}
      </div>
    ),
    due_date: (
      <span className="text-sm text-gray-600">
        {new Date(bill.due_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    ),
    amount: (
      <span className="text-sm font-medium text-gray-900">
        ₹
        {bill.amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    balance_due: (
      <span className="text-sm font-medium text-gray-900">
        ₹
        {bill.balance_due.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  });

  const handleView = (id: number) => {
    navigate(`/accounting/bills/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/accounting/bills/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      toast.success("Bill deleted successfully!", {});
      fetchBillData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recurring Bills</h1>
      </header>

      <EnhancedTaskTable
        data={displayedData}
        columns={columns}
        renderRow={renderRow}
        storageKey="recurring-bills-dashboard-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        loading={loading}
        leftActions={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/accounting/recurring-bills/create")}
          >
            <Plus className="w-4 h-4 mr-2" /> New
          </Button>
        }
      />

      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={perPage}
          isLoading={loading}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default RecurringBillsDashboard;
