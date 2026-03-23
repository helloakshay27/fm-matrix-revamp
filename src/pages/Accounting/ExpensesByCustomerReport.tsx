import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

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
  amount?: string | number;
  tax_type?: string;
  tax_group_id?: number | string | null;
}

interface ExpenseApi {
  id: number | string;
  date?: string;
  created_at?: string;
  customer_id?: number | string | null;
  customer_name?: string;
  amount?: string | number;
  total_amount?: string | number;
  total_tax_amount?: string | number;
  expense_accounts?: ExpenseAccountApi[];
}

interface ExpensesByCustomerRow {
  customer_name: string;
  expense_count: number;
  expense_amount: number;
  expense_amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "expense_count", label: "EXPENSE COUNT", sortable: true, hideable: false, draggable: true },
  { key: "expense_amount", label: "EXPENSE AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "expense_amount_with_tax", label: "EXPENSE AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
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

const getDisplayName = (item?: CustomerOption | null) => {
  if (!item) return "";
  return item.name || item.full_name || item.customer_name || item.display_name || item.company_name || "";
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

const normalizeCustomerName = (name?: string | null) => {
  const normalized = String(name || "").trim();
  return normalized || "Others";
};

const ExpensesByCustomerReport: React.FC = () => {
  const [rows, setRows] = useState<ExpensesByCustomerRow[]>([]);
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

  const fetchExpensesByCustomer = useCallback(async (fromDate: string, toDate: string) => {
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

      const [expensesResponse, customersResponse, taxGroupsResponse] = await Promise.all([
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
        axios.get(`${apiBaseUrl}/lock_account_customers.json`, {
          params: { lock_account_id: lockAccountId },
          headers: authHeaders,
        }),
        axios.get(`${apiBaseUrl}/lock_accounts/${lockAccountId}/tax_groups_view.json`, {
          headers: authHeaders,
        }),
      ]);

      const expenses = extractArray<ExpenseApi>(expensesResponse.data, ["expenses", "data"]);
      const customers = extractArray<CustomerOption>(customersResponse.data, ["lock_account_customers", "customers", "data"]);
      const taxGroups = extractArray<TaxGroup>(taxGroupsResponse.data, ["tax_groups", "data"]);

      const customerMap = customers.reduce<Record<string, string>>((acc, customer) => {
        const key = customer.id !== undefined && customer.id !== null ? String(customer.id) : "";
        const name = getDisplayName(customer);

        if (key && name) {
          acc[key] = name;
        }

        return acc;
      }, {});

      const grouped = new Map<string, ExpensesByCustomerRow>();

      expenses
        .filter((item) => isWithinRange(item.date || item.created_at || "", fromDate, toDate))
        .forEach((item) => {
          const baseAmount = parseAmount(item.amount ?? item.total_amount);
          const computedTax = parseAmount(item.total_tax_amount) || calculateTaxFromAccounts(item.expense_accounts, taxGroups);
          const amountWithTax = baseAmount + computedTax;
          const customerName = normalizeCustomerName(item.customer_name || customerMap[String(item.customer_id ?? "")]);

          const existing = grouped.get(customerName);
          if (existing) {
            existing.expense_count += 1;
            existing.expense_amount += baseAmount;
            existing.expense_amount_with_tax += amountWithTax;
          } else {
            grouped.set(customerName, {
              customer_name: customerName,
              expense_count: 1,
              expense_amount: baseAmount,
              expense_amount_with_tax: amountWithTax,
            });
          }
        });

      const mappedRows = Array.from(grouped.values()).sort((a, b) => {
        if (a.customer_name === "Others") return 1;
        if (b.customer_name === "Others") return -1;
        return a.customer_name.localeCompare(b.customer_name);
      });

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch expenses by customer report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpensesByCustomer(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchExpensesByCustomer]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          expense_count: acc.expense_count + row.expense_count,
          expense_amount: acc.expense_amount + row.expense_amount,
          expense_amount_with_tax: acc.expense_amount_with_tax + row.expense_amount_with_tax,
        }),
        {
          expense_count: 0,
          expense_amount: 0,
          expense_amount_with_tax: 0,
        }
      ),
    [rows]
  );

  const renderRow = (row: ExpensesByCustomerRow) => ({
    customer_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.customer_name}</span>,
    expense_count: <span className="inline-flex w-full justify-center text-[13px] font-semibold text-[#111827]">{row.expense_count}</span>,
    expense_amount: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.expense_amount)}</span>
    ),
    expense_amount_with_tax: (
      <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
        {formatCurrency(row.expense_amount_with_tax)}
      </span>
    ),
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
              <h3 className="text-lg font-semibold text-[#111827]">Expenses by Customer</h3>
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
              onClick={() => fetchExpensesByCustomer(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Expenses by Customer</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="expenses-by-customer-report-v1"
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
            cellClassName="px-6 py-3 border-b border-[#EAECF0] hover:bg-transparent align-middle"
          />

          <div
            className="grid border-b border-[#EAECF0] bg-white px-6 py-4 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <div className="font-medium">Total</div>
            <div className="text-center font-semibold">{totals.expense_count}</div>
            <div className="text-right font-semibold">{formatCurrency(totals.expense_amount)}</div>
            <div className="text-right font-semibold">{formatCurrency(totals.expense_amount_with_tax)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesByCustomerReport;
