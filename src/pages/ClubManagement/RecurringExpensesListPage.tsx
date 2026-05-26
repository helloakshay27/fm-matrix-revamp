import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
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

  const getStatusBadge = (status?: string) => {
    const upper = status?.toUpperCase() || "";
    let cls = "bg-gray-100 text-gray-800";

    if (upper === "ACTIVE") cls = "bg-green-100 text-green-800";
    else if (upper === "INACTIVE") cls = "bg-red-100 text-red-800";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
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
        >
          <Eye className="h-4 w-4" />
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
    status: getStatusBadge(item.status),
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
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New
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