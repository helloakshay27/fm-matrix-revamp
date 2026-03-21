import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

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

interface ExpenseApi {
  id: number | string;
  date?: string;
  created_at?: string;
  amount?: string | number;
  total_amount?: string | number;
  total_tax_amount?: string | number;
  expense_accounts?: ExpenseAccountApi[];
  category?: string;
  category_name?: string;
}

interface ExpenseSummaryRow {
  category_name: string;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "category_name", label: "CATEGORY NAME", sortable: true, hideable: false, draggable: true },
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

const calculateTaxFromTaxGroup = (baseAmount: number, taxGroupId: string | number | null | undefined, taxGroups: TaxGroup[]) => {
  if (!taxGroupId || !baseAmount) return 0;

  const group = taxGroups.find((taxGroup) => String(taxGroup.id) === String(taxGroupId));
  if (!group) return 0;

  return (group.tax_rates || []).reduce((sum, rate) => {
    const percentage = parseAmount(rate.rate);
    return sum + (baseAmount * percentage) / 100;
  }, 0);
};

const ExpenseSummaryByCategoryReport: React.FC = () => {
  const [rows, setRows] = useState<ExpenseSummaryRow[]>([]);
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

  const fetchExpenseSummaryByCategory = useCallback(async (fromDate: string, toDate: string) => {
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

      const [expensesResponse, taxGroupsResponse] = await Promise.all([
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
        axios.get(`${apiBaseUrl}/lock_accounts/${lockAccountId}/tax_groups_view.json`, {
          headers: authHeaders,
        }),
      ]);

      const expenses = extractArray<ExpenseApi>(expensesResponse.data, ["expenses", "data"]);
      const taxGroups = extractArray<TaxGroup>(taxGroupsResponse.data, ["tax_groups", "data"]);

      const grouped = new Map<string, { amount: number; amount_with_tax: number }>();

      expenses
        .filter((item) => isWithinRange(item.date || item.created_at || "", fromDate, toDate))
        .forEach((item) => {
          const expenseAccounts = item.expense_accounts || [];

          if (expenseAccounts.length > 0) {
            expenseAccounts.forEach((account) => {
              const category = (account.lock_account_name || "Others").trim() || "Others";
              const amount = parseAmount(account.amount);
              const tax = calculateTaxFromTaxGroup(amount, account.tax_group_id, taxGroups);
              const amountWithTax = amount + tax;

              const existing = grouped.get(category);
              if (existing) {
                existing.amount += amount;
                existing.amount_with_tax += amountWithTax;
              } else {
                grouped.set(category, {
                  amount,
                  amount_with_tax: amountWithTax,
                });
              }
            });

            return;
          }

          const fallbackCategory = (item.category_name || item.category || "Others").trim() || "Others";
          const amount = parseAmount(item.amount ?? item.total_amount);
          const tax = parseAmount(item.total_tax_amount);
          const amountWithTax = amount + tax;

          const existing = grouped.get(fallbackCategory);
          if (existing) {
            existing.amount += amount;
            existing.amount_with_tax += amountWithTax;
          } else {
            grouped.set(fallbackCategory, {
              amount,
              amount_with_tax: amountWithTax,
            });
          }
        });

      const mappedRows: ExpenseSummaryRow[] = Array.from(grouped.entries())
        .map(([category_name, data]) => ({
          category_name,
          amount: data.amount,
          amount_with_tax: data.amount_with_tax,
        }))
        .sort((a, b) => a.category_name.localeCompare(b.category_name));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch expense summary by category", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseSummaryByCategory(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchExpenseSummaryByCategory]);

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

  const renderRow = (row: ExpenseSummaryRow) => ({
    category_name: <span className="text-[13px] text-[#111827]">{row.category_name}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Expense Summary by Category</h3>
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
              onClick={() => fetchExpenseSummaryByCategory(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Expense Summary by Category</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="expense-summary-by-category-report-v1"
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
            style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
          >
            <div className="font-medium">Total</div>
            <div className="text-right font-semibold">{formatCurrency(totals.amount)}</div>
            <div className="text-right font-semibold">{formatCurrency(totals.amount_with_tax)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummaryByCategoryReport;
