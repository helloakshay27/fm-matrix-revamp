import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface VendorOption {
  id?: number | string;
  name?: string;
  company_name?: string;
  vendor_name?: string;
}

interface CustomerOption {
  id?: number | string;
  name?: string;
  full_name?: string;
  customer_name?: string;
  display_name?: string;
  company_name?: string;
}

interface TaxRate {
  id?: number | string;
  rate?: number | string;
}

interface TaxGroup {
  id?: number | string;
  tax_rates?: TaxRate[];
}

interface ExpenseAccountApi {
  id?: number | string;
  lock_account_name?: string;
  amount?: string | number;
  tax_type?: string;
  tax_group_id?: number | string | null;
}

interface ExpenseTransactionApi {
  voucher_number?: string;
  transaction_type?: string;
}

interface ExpenseApi {
  id: number;
  date?: string;
  created_at?: string;
  vendor_id?: number | string | null;
  vendor_name?: string;
  customer_id?: number | string | null;
  customer_name?: string;
  reference_number?: string;
  amount?: string | number;
  total_amount?: string | number;
  total_tax_amount?: string | number;
  expense_accounts?: ExpenseAccountApi[];
  transaction?: ExpenseTransactionApi;
}

interface ExpenseRow {
  id: number;
  status: string;
  date: string;
  transaction_type: string;
  transaction_number: string;
  vendor_name: string;
  category: string;
  customer_name: string;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_type", label: "TRANSACTION TYPE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "category", label: "CATEGORY", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseAmount = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const getApiBaseUrl = (baseUrl?: string | null) => {
  if (!baseUrl) return "";
  return baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
};

const extractArray = <T,>(payload: unknown, keys: string[] = []) => {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const source = payload as Record<string, unknown>;

    for (const key of keys) {
      if (Array.isArray(source[key])) {
        return source[key] as T[];
      }
    }
  }

  return [] as T[];
};

const isWithinRange = (dateValue: string, fromDate: string, toDate: string) => {
  if (!dateValue) return false;

  const rowDate = new Date(dateValue);
  const from = new Date(toApiDate(fromDate));
  const to = new Date(toApiDate(toDate));

  if (Number.isNaN(rowDate.getTime()) || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return true;
  }

  rowDate.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  return rowDate >= from && rowDate <= to;
};

const getDisplayName = (item?: VendorOption | CustomerOption | null) => {
  if (!item) return "";
  const source = item as Record<string, unknown>;
  return (
    item.name ||
    (source.full_name as string | undefined) ||
    (source.customer_name as string | undefined) ||
    (source.display_name as string | undefined) ||
    item.company_name ||
    (source.vendor_name as string | undefined) ||
    ""
  );
};

const calculateTaxFromAccounts = (expenseAccounts: ExpenseAccountApi[] = [], taxGroups: TaxGroup[] = []) => {
  return expenseAccounts.reduce((sum, account) => {
    if (account.tax_type !== "tax_group" || !account.tax_group_id) {
      return sum;
    }

    const group = taxGroups.find((taxGroup) => String(taxGroup.id) === String(account.tax_group_id));
    const baseAmount = parseAmount(account.amount);
    const taxAmount = (group?.tax_rates || []).reduce((taxSum, rate) => {
      const percentage = parseAmount(rate.rate);
      return taxSum + (baseAmount * percentage) / 100;
    }, 0);

    return sum + taxAmount;
  }, 0);
};

const ExpenseDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      fromDate: firstDay.toLocaleDateString("en-GB"),
      toDate: lastDay.toLocaleDateString("en-GB"),
    };
  }, []);

  const [filters, setFilters] = useState(defaultDateRange);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const fetchExpenseDetails = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);

    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");
      const apiBaseUrl = getApiBaseUrl(baseUrl);

      if (!apiBaseUrl || !token || !lockAccountId) {
        setRows([]);
        return;
      }

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const [expensesResponse, vendorsResponse, customersResponse, taxGroupsResponse] = await Promise.all([
        axios.get(`${apiBaseUrl}/expenses.json`, {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
            page: 1,
            per_page: 500,
          },
          headers: authHeaders,
        }),
        axios.get(`${apiBaseUrl}/pms/purchase_orders/get_suppliers.json`, {
          params: { access_token: token },
        }),
        axios.get(`${apiBaseUrl}/lock_account_customers.json`, {
          params: { lock_account_id: lockAccountId },
          headers: authHeaders,
        }),
        axios.get(`${apiBaseUrl}/lock_accounts/${lockAccountId}/tax_groups_view.json`, {
          headers: authHeaders,
        }),
      ]);

      const expenses = extractArray<ExpenseApi>(expensesResponse.data, ["expenses", "data"]);
      const vendors = extractArray<VendorOption>(vendorsResponse.data, ["suppliers", "data"]);
      const customers = extractArray<CustomerOption>(customersResponse.data, ["lock_account_customers", "customers", "data"]);
      const taxGroups = extractArray<TaxGroup>(taxGroupsResponse.data, ["tax_groups", "data"]);

      const vendorMap = vendors.reduce<Record<string, string>>((acc, vendor) => {
        const key = vendor.id !== undefined && vendor.id !== null ? String(vendor.id) : "";
        const name = getDisplayName(vendor);

        if (key && name) {
          acc[key] = name;
        }

        return acc;
      }, {});

      const customerMap = customers.reduce<Record<string, string>>((acc, customer) => {
        const key = customer.id !== undefined && customer.id !== null ? String(customer.id) : "";
        const name = getDisplayName(customer);

        if (key && name) {
          acc[key] = name;
        }

        return acc;
      }, {});

      const mappedRows: ExpenseRow[] = expenses
        .filter((item) => isWithinRange(item.date || item.created_at || "", fromDate, toDate))
        .map((item) => {
          const baseAmount = parseAmount(item.amount ?? item.total_amount);
          const computedTax = parseAmount(item.total_tax_amount) || calculateTaxFromAccounts(item.expense_accounts, taxGroups);
          const vendorName = item.vendor_name || vendorMap[String(item.vendor_id ?? "")] || "-";
          const customerName = item.customer_name || customerMap[String(item.customer_id ?? "")] || "-";
          const categories = (item.expense_accounts || [])
            .map((account) => (account.lock_account_name || "").trim())
            .filter(Boolean)
            .join(", ");

          return {
            id: item.id,
            status: "Non-Billable",
            date: item.date || item.created_at || "",
            transaction_type: item.transaction?.transaction_type || "Expense",
            transaction_number: item.transaction?.voucher_number || item.reference_number || `EXP-${item.id}`,
            vendor_name: vendorName,
            category: categories || "-",
            customer_name: customerName,
            amount: baseAmount,
            amount_with_tax: baseAmount + computedTax,
          };
        });

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch expense details report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseDetails(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchExpenseDetails]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          amount: acc.amount + row.amount,
          amount_with_tax: acc.amount_with_tax + row.amount_with_tax,
        }),
        { amount: 0, amount_with_tax: 0 }
      ),
    [rows]
  );

  const renderRow = (row: ExpenseRow) => ({
    status: <span className="text-[13px] text-[#667085]">{row.status}</span>,
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    transaction_type: <span className="text-[13px] text-[#111827]">{row.transaction_type}</span>,
    transaction_number: (
      <button
        type="button"
        onClick={() => navigate(`/accounting/expense/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb] hover:underline"
      >
        {row.transaction_number}
      </button>
    ),
    vendor_name: (
      <button
        type="button"
        onClick={() => navigate(`/accounting/expense/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb] hover:underline"
      >
        {row.vendor_name}
      </button>
    ),
    category: <span className="text-[13px] text-[#111827]">{row.category}</span>,
    customer_name: (
      <span className={row.customer_name === "-" ? "text-[13px] text-[#98A2B3]" : "text-[13px] font-semibold text-[#2563eb]"}>
        {row.customer_name}
      </span>
    ),
    amount: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount)}</span>,
    amount_with_tax: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount_with_tax)}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Expense Details</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={toInputDate(filters.fromDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />

            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={toInputDate(filters.toDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />

            <Button
              onClick={() => fetchExpenseDetails(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Expense Details</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="expense-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no expenses during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-middle"
          />

          <div
            className="grid border-b border-[#EAECF0] bg-white px-8 py-3 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div>Total</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount)}</div>
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.amount_with_tax)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsReport;