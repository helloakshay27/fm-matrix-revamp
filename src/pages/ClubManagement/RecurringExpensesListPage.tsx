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
  transaction_type?: string;
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
  {
    key: "reference",
    label: "Reference#",
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
    key: "paid_through",
    label: "Paid Through",
    sortable: true,
    hideable: false,
    draggable: false,
  },
];

const defaultItems: RecurringExpense[] = [
  {
    id: 1,
    profile_name: "Facility Cleaning Contract",
    date: "08/02/2026",
    expense_account: "Building Maintenance - Janitorial Services",
    vendor_name: "CleanPro Solutions",
    frequency: "Bi-weekly",
    last_expense_date: "08/02/2026",
    next_expense_date: "22/02/2026",
    status: "ACTIVE",
    amount: "₹12,000.00",
    reference_number: "CLEAN-2026-0234",
    paid_through: "Cheque - Finance Account",
    voucher_number: "VCH-CLEAN-234",
    transaction_type: "EXPENSE",
    description: "Bi-weekly facility and office cleaning",
  },
  {
    id: 2,
    profile_name: "Office Stationery Supplies",
    date: "12/02/2026",
    expense_account: "Administrative Supplies - Office Materials",
    vendor_name: "PaperWorks India Pvt Ltd",
    frequency: "Monthly",
    last_expense_date: "12/02/2026",
    next_expense_date: "12/03/2026",
    status: "ACTIVE",
    amount: "₹6,500.00",
    reference_number: "STAT-2026-0567",
    paid_through: "Credit Card - Corporate",
    voucher_number: "VCH-STAT-567",
    transaction_type: "EXPENSE",
    description: "Monthly office stationery procurement",
  },
  {
    id: 3,
    profile_name: "Security Guard Services",
    date: "01/02/2026",
    expense_account: "Security & Safety - Personnel Costs",
    vendor_name: "SecureGuard Enterprises",
    frequency: "Monthly",
    last_expense_date: "01/02/2026",
    next_expense_date: "01/03/2026",
    status: "ACTIVE",
    amount: "₹35,000.00",
    reference_number: "SEC-2026-0891",
    paid_through: "Bank Transfer - Payroll Account",
    voucher_number: "VCH-SEC-891",
    transaction_type: "EXPENSE",
    description: "Monthly security personnel salaries",
  },
  {
    id: 4,
    profile_name: "Vehicle Maintenance & Fuel",
    date: "14/02/2026",
    expense_account: "Transportation - Vehicle Operations",
    vendor_name: "AutoCare Services Ltd",
    frequency: "Monthly",
    last_expense_date: "14/02/2026",
    next_expense_date: "14/03/2026",
    status: "ACTIVE",
    amount: "₹18,500.00",
    reference_number: "VEHM-2026-0445",
    paid_through: "Fuel Card + Service Cheque",
    voucher_number: "VCH-VEHM-445",
    transaction_type: "EXPENSE",
    description: "Vehicle fuel, maintenance and repairs",
  },
  {
    id: 5,
    profile_name: "Professional Training Programs",
    date: "03/02/2026",
    expense_account: "Human Resources - Employee Development",
    vendor_name: "SkillBuild Academy",
    frequency: "Quarterly",
    last_expense_date: "03/02/2026",
    next_expense_date: "03/05/2026",
    status: "ACTIVE",
    amount: "₹45,000.00",
    reference_number: "TRAIN-2026-0723",
    paid_through: "Bank Transfer - Training Fund",
    voucher_number: "VCH-TRAIN-723",
    transaction_type: "EXPENSE",
    description: "Quarterly employee skill development program",
  },
  {
    id: 6,
    profile_name: "Pest Control & Hygiene",
    date: "16/02/2026",
    expense_account: "Building Maintenance - Health & Hygiene",
    vendor_name: "BioSafe Pest Management",
    frequency: "Monthly",
    last_expense_date: "16/02/2026",
    next_expense_date: "16/03/2026",
    status: "ACTIVE",
    amount: "₹4,200.00",
    reference_number: "PEST-2026-0156",
    paid_through: "Cash Payment - Admin Reserve",
    voucher_number: "VCH-PEST-156",
    transaction_type: "EXPENSE",
    description: "Monthly pest control and hygiene services",
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

  // Load data from localStorage (or defaults)
  const loadData = (search = "") => {
    setLoading(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem("recurringExpenses") || "[]"
      );
      let items: RecurringExpense[] =
        stored && Array.isArray(stored) && stored.length > 0
          ? stored
          : defaultItems;

      // Apply search filter
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
      const totalPages = Math.ceil(total / perPage);
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
    else if (upper === "EXPIRED") cls = "bg-yellow-100 text-yellow-800";

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
        {item.voucher_number && (
          <div className="text-xs text-gray-500 mt-0.5">
            {item.voucher_number}
          </div>
        )}
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
