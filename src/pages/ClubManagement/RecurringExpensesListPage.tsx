import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2 } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast as sonnerToast } from "sonner";

interface RecurringExpense {
  id: string | number;
  profile_name: string;
  expense_account?: string;
  vendor_name?: string;
  frequency?: string;
  last_expense_date?: string;
  next_expense_date?: string;
  status?: string;
  amount?: string | number;
  reference_number?: string;
  paid_through?: string;
  voucher_number?: string;
  description?: string;
  date?: string;
}

const columns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "profile_name",
    label: "Profile Name",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "expense_account",
    label: "Expense Account",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "vendor_name",
    label: "Vendor Name",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "frequency",
    label: "Frequency",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "last_expense_date",
    label: "Last Expense Date",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "next_expense_date",
    label: "Next Expense Date",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: false,
    draggable: false,
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    hideable: false,
    draggable: false,
  },
];

const RecurringExpensesListPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 800);

  const [recurringExpenseData, setRecurringExpenseData] = useState<
    RecurringExpense[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "-";
    }
  };

  const loadData = async (search = "") => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      let baseUrl = localStorage.getItem("baseUrl") || "";

      if (!token) {
        sonnerToast.error("Authentication token missing");
        return;
      }

      if (!baseUrl) {
        sonnerToast.error("Base URL missing");
        return;
      }

      if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = `https://${baseUrl}`;
      }

      const response = await fetch(`${baseUrl}/recurring_expenses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recurring expenses");
      }

      const apiData = await response.json();

      let items: RecurringExpense[] = (apiData || []).map((item: any) => ({
        id: item.id,
        profile_name: item.profile_name || "-",
        expense_account: item.account_id ? `Account #${item.account_id}` : "-",
        vendor_name: item.vendor_id ? `Vendor #${item.vendor_id}` : "-",
        frequency: item.repeat_every || "-",
        last_expense_date: formatDate(item.start_date),
        next_expense_date: formatDate(item.end_date),
        status: item.active ? "ACTIVE" : "INACTIVE",
        amount:
          item.amount !== null && item.amount !== undefined
            ? `₹${Number(item.amount).toLocaleString("en-IN")}`
            : "-",
        reference_number: `REC-${item.id}`,
        paid_through: item.paid_through_account_id
          ? `Account #${item.paid_through_account_id}`
          : "-",
        voucher_number: "-",
        description: item.description || "-",
        date: formatDate(item.start_date),
      }));

      if (search.trim()) {
        const q = search.toLowerCase();
        items = items.filter(
          (item) =>
            item.profile_name?.toLowerCase().includes(q) ||
            item.expense_account?.toLowerCase().includes(q) ||
            item.vendor_name?.toLowerCase().includes(q) ||
            item.reference_number?.toLowerCase().includes(q)
        );
      }

      const total = items.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = (currentPage - 1) * perPage;
      const paginatedItems = items.slice(start, start + perPage);

      setRecurringExpenseData(paginatedItems);
      setPagination({
        current_page: currentPage,
        per_page: perPage,
        total_pages: totalPages,
        total_count: total,
      });
    } catch (error) {
      console.error(error);
      sonnerToast.error("Failed to load recurring expenses");
      setRecurringExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Recurring Expenses";
    loadData(debouncedSearchQuery);
  }, [currentPage, perPage, debouncedSearchQuery]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async (item: RecurringExpense) => {
    if (!window.confirm(`Are you sure you want to delete "${item.profile_name}"?`)) {
      return;
    }

    setDeletingId(item.id);
    try {
      const token = localStorage.getItem("token");
      let baseUrl = localStorage.getItem("baseUrl") || "";

      if (!token || !baseUrl) {
        sonnerToast.error("Missing authentication or base URL");
        setDeletingId(null);
        return;
      }

      if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = `https://${baseUrl}`;
      }

      const response = await fetch(`${baseUrl}/recurring_expenses/${item.id}.json`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errBody || response.statusText}`
        );
      }

      sonnerToast.success("Recurring expense deleted successfully");
      loadData(debouncedSearchQuery);
    } catch (error: any) {
      console.error("Failed to delete recurring expense:", error);
      sonnerToast.error(error.message || "Failed to delete recurring expense");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item: RecurringExpense) => {
    setDeletingId(item.id);
    try {
      const token = localStorage.getItem("token");
      let baseUrl = localStorage.getItem("baseUrl") || "";

      if (!token || !baseUrl) {
        sonnerToast.error("Missing authentication or base URL");
        setDeletingId(null);
        return;
      }

      if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        baseUrl = `https://${baseUrl}`;
      }

      const response = await fetch(`${baseUrl}/recurring_expenses/${item.id}/toggle_active.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errBody || response.statusText}`
        );
      }

      const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      sonnerToast.success(`Recurring expense marked as ${newStatus}`);
      loadData(debouncedSearchQuery);
    } catch (error: any) {
      console.error("Failed to toggle recurring expense status:", error);
      sonnerToast.error(error.message || "Failed to update status");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status?: string, item?: RecurringExpense) => {
    const upper = status?.toUpperCase() || "";
    let cls = "bg-gray-100 text-gray-800";

    if (upper === "ACTIVE") cls = "bg-green-100 text-green-800";
    else if (upper === "INACTIVE") cls = "bg-red-100 text-red-800";

    return (
      <span
        onClick={() => item && handleToggleStatus(item)}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls} cursor-pointer hover:opacity-80 transition-opacity`}
        title="Click to toggle status"
      >
        {upper || "-"}
      </span>
    );
  };

  const renderRow = (item: RecurringExpense) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/accounting/recurring-expenses/${item.id}`)}
          className="h-8 w-8"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(item)}
          disabled={deletingId === item.id || loading}
          className="h-8 w-8 hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),

    profile_name: (
      <span
        className="text-blue-600 font-medium cursor-pointer"
        onClick={() => navigate(`/accounting/recurring-expenses/${item.id}`)}
      >
        {item.profile_name}
      </span>
    ),

    expense_account: <span>{item.expense_account || "-"}</span>,
    frequency: <span>{item.frequency || "-"}</span>,
    last_expense_date: <span>{item.last_expense_date || "-"}</span>,
    next_expense_date: <span>{item.next_expense_date || "-"}</span>,
    status: getStatusBadge(item.status, item),
    amount: <span className="font-medium">{item.amount || "-"}</span>,

    reference: (
      <div>
        <div className="font-medium">{item.reference_number || "-"}</div>
      </div>
    ),

    vendor_name: <span>{item.vendor_name || "-"}</span>,
    paid_through: <span>{item.paid_through || "-"}</span>,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Recurring Expenses</h1>
      </div>

      <EnhancedTaskTable
        data={recurringExpenseData}
        columns={columns}
        renderRow={renderRow}
        storageKey="recurring-expense-list"
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        loading={loading}
        hideTableExport={true}
        leftActions={
          <Button
            onClick={() => navigate("/accounting/recurring-expenses/create")}
            // className="fm-button-fix fm-button-brand gap-2 px-4 py-2"
            className='fm-button-fix fm-button-brand px-4 py-2P'
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />

      {pagination.total_count > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          totalRecords={pagination.total_count}
          perPage={perPage}
          isLoading={loading}
          onPageChange={setCurrentPage}
          onPerPageChange={(n) => {
            setPerPage(n);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};

export default RecurringExpensesListPage;