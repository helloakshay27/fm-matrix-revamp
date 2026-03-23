import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
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

interface ExpenseApi {
  id: number | string;
  date?: string;
  created_at?: string;
  vendor_id?: number | string | null;
  vendor_name?: string;
  amount?: string | number;
  total_amount?: string | number;
  total_tax_amount?: string | number;
}

interface BillApi {
  id: number | string;
  bill_date?: string;
  date?: string;
  created_at?: string;
  vendor_id?: number | string | null;
  vendor_name?: string;
  resident_name?: string;
  amount?: string | number;
  total_amount?: string | number;
  sub_total_amount?: string | number;
  lock_account_tax_amount?: string | number;
}

interface VendorCreditApi {
  id: number | string;
  date?: string;
  credit_note_date?: string;
  vendor_id?: number | string | null;
  vendor_name?: string;
  supplier_name?: string;
  amount?: string | number;
  total_amount?: string | number;
  total_tax_amount?: string | number;
}

interface ManualJournalApi {
  id: number | string;
  transaction_date?: string;
  created_at?: string;
  vendor_id?: number | string | null;
  vendor_name?: string;
  supplier_name?: string;
  party_name?: string;
  amount?: string | number;
  total_amount?: string | number;
  records?: Array<{
    amount?: string | number;
  }>;
}

interface VendorSummaryRow {
  id: string;
  vendor_name: string;
  expense_count: number;
  bill_count: number;
  vendor_credit_count: number;
  journal_count: number;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "expense_count", label: "EXPENSE COUNT", sortable: true, hideable: false, draggable: true },
  { key: "bill_count", label: "BILL COUNT", sortable: true, hideable: false, draggable: true },
  { key: "vendor_credit_count", label: "VENDOR CREDIT COUNT", sortable: true, hideable: false, draggable: true },
  { key: "journal_count", label: "JOURNAL COUNT", sortable: true, hideable: false, draggable: true },
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

const extractArray = <T,>(payload: any, keys: string[] = []): T[] => {
  if (Array.isArray(payload)) return payload as T[];

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key] as T[];
    }
  }

  return [];
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

const normalizeVendorName = (name?: string | null) => {
  const normalized = String(name || "").trim();
  return normalized || "Others";
};

const PurchaseOrdersByVendorReport: React.FC = () => {
  const [rows, setRows] = useState<VendorSummaryRow[]>([]);
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

  const fetchVendorSummary = useCallback(async (fromDate: string, toDate: string) => {
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

      const [vendorsResponse, expensesResponse, billsResponse, vendorCreditsResponse, journalsResponse] = await Promise.all([
        axios.get(`${apiBaseUrl}/pms/purchase_orders/get_suppliers.json`, {
          params: { access_token: token },
        }),
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
        axios.get(`${apiBaseUrl}/lock_account_bills.json`, {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
            page: 1,
            per_page: 500,
          },
          headers: authHeaders,
        }),
        axios.get(`${apiBaseUrl}/lock_account_supplier_credits.json`, {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
            page: 1,
            per_page: 500,
          },
          headers: authHeaders,
        }),
        axios.get(`${apiBaseUrl}/lock_accounts/${lockAccountId}/lock_account_transactions.json`, {
          params: {
            "q[transaction_type_eq]": "Journal Entry",
            "q[transaction_date_gteq]": toApiDate(fromDate),
            "q[transaction_date_lteq]": toApiDate(toDate),
            page: 1,
            per_page: 500,
          },
          headers: authHeaders,
        }),
      ]);

      const vendors = extractArray<VendorOption>(vendorsResponse.data, ["suppliers", "data"]);
      const expenses = extractArray<ExpenseApi>(expensesResponse.data, ["expenses", "data"]);
      const bills = extractArray<BillApi>(billsResponse.data, ["lock_account_bills", "data"]);
      const vendorCredits = extractArray<VendorCreditApi>(vendorCreditsResponse.data, ["lock_account_supplier_credits", "data"]);
      const journals = extractArray<ManualJournalApi>(journalsResponse.data, ["lock_account_transactions", "data"]);

      const vendorMap = vendors.reduce<Record<string, string>>((acc, vendor) => {
        const key = vendor.id !== undefined && vendor.id !== null ? String(vendor.id) : "";
        const name = vendor.name || vendor.company_name || vendor.vendor_name || "";

        if (key && name) {
          acc[key] = name;
        }

        return acc;
      }, {});

      const grouped = new Map<string, VendorSummaryRow>();

      const ensureRow = (vendorName?: string | null) => {
        const normalizedName = normalizeVendorName(vendorName);

        if (!grouped.has(normalizedName)) {
          grouped.set(normalizedName, {
            id: normalizedName,
            vendor_name: normalizedName,
            expense_count: 0,
            bill_count: 0,
            vendor_credit_count: 0,
            journal_count: 0,
            amount: 0,
            amount_with_tax: 0,
          });
        }

        return grouped.get(normalizedName)!;
      };

      expenses
        .filter((item) => isWithinRange(item.date || item.created_at || "", fromDate, toDate))
        .forEach((item) => {
          const vendorName = item.vendor_name || vendorMap[String(item.vendor_id ?? "")] || "Others";
          const row = ensureRow(vendorName);
          const baseAmount = parseAmount(item.amount);
          const totalAmount = parseAmount(item.total_amount) || baseAmount + parseAmount(item.total_tax_amount);

          row.expense_count += 1;
          row.amount += baseAmount;
          row.amount_with_tax += totalAmount || baseAmount;
        });

      bills
        .filter((item) => isWithinRange(item.bill_date || item.date || item.created_at || "", fromDate, toDate))
        .forEach((item) => {
          const vendorName = item.vendor_name || item.resident_name || vendorMap[String(item.vendor_id ?? "")] || "Others";
          const row = ensureRow(vendorName);
          const baseAmount = parseAmount(item.sub_total_amount) || parseAmount(item.amount);
          const totalAmount = parseAmount(item.total_amount) || baseAmount + parseAmount(item.lock_account_tax_amount);

          row.bill_count += 1;
          row.amount += baseAmount;
          row.amount_with_tax += totalAmount || baseAmount;
        });

      vendorCredits
        .filter((item) => isWithinRange(item.date || item.credit_note_date || "", fromDate, toDate))
        .forEach((item) => {
          const vendorName = item.vendor_name || item.supplier_name || vendorMap[String(item.vendor_id ?? "")] || "Others";
          const row = ensureRow(vendorName);
          const baseAmount = parseAmount(item.amount);
          const totalAmount = parseAmount(item.total_amount) || baseAmount + parseAmount(item.total_tax_amount);

          row.vendor_credit_count += 1;
          row.amount += baseAmount;
          row.amount_with_tax += totalAmount || baseAmount;
        });

      journals
        .filter((item) => isWithinRange(item.transaction_date || item.created_at || "", fromDate, toDate))
        .forEach((item) => {
          const vendorName = item.vendor_name || item.supplier_name || item.party_name || vendorMap[String(item.vendor_id ?? "")];

          if (!vendorName) {
            return;
          }

          const row = ensureRow(vendorName);
          const recordsAmount = Array.isArray(item.records)
            ? item.records.reduce((sum, record) => sum + parseAmount(record.amount), 0)
            : 0;
          const baseAmount = parseAmount(item.amount) || parseAmount(item.total_amount) || recordsAmount;

          row.journal_count += 1;
          row.amount += baseAmount;
          row.amount_with_tax += parseAmount(item.total_amount) || baseAmount;
        });

      const sortedRows = Array.from(grouped.values()).sort((left, right) => {
        if (left.vendor_name === "Others") return -1;
        if (right.vendor_name === "Others") return 1;
        return left.vendor_name.localeCompare(right.vendor_name);
      });

      setRows(sortedRows);
    } catch (error) {
      console.error("Failed to fetch purchases by vendor report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorSummary(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchVendorSummary]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          expense_count: acc.expense_count + row.expense_count,
          bill_count: acc.bill_count + row.bill_count,
          vendor_credit_count: acc.vendor_credit_count + row.vendor_credit_count,
          journal_count: acc.journal_count + row.journal_count,
          amount: acc.amount + row.amount,
          amount_with_tax: acc.amount_with_tax + row.amount_with_tax,
        }),
        {
          expense_count: 0,
          bill_count: 0,
          vendor_credit_count: 0,
          journal_count: 0,
          amount: 0,
          amount_with_tax: 0,
        }
      ),
    [rows]
  );

  const renderCenteredValue = (value: number) => (
    <span className="inline-flex w-full justify-center text-[13px] font-semibold text-[#111827]">{value}</span>
  );

  const renderRow = (row: VendorSummaryRow) => ({
    vendor_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>,
    expense_count: renderCenteredValue(row.expense_count),
    bill_count: renderCenteredValue(row.bill_count),
    vendor_credit_count: renderCenteredValue(row.vendor_credit_count),
    journal_count: renderCenteredValue(row.journal_count),
    amount: <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount)}</span>,
    amount_with_tax: <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.amount_with_tax)}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Purchases by Vendor</h3>
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
              onClick={() => fetchVendorSummary(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Purchases by Vendor</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="purchases-by-vendor-report-v2"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no purchase and expense entries during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-6 py-3 border-b border-[#EAECF0] hover:bg-transparent align-middle"
          />

          <div
            className="grid border-b border-[#EAECF0] bg-white px-6 py-4 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium">Total</div>
            <div className="text-center font-semibold">{totals.expense_count}</div>
            <div className="text-center font-semibold">{totals.bill_count}</div>
            <div className="text-center font-semibold">{totals.vendor_credit_count}</div>
            <div className="text-center font-semibold">{totals.journal_count}</div>
            <div className="text-right font-semibold">{formatCurrency(totals.amount)}</div>
            <div className="text-right font-semibold">{formatCurrency(totals.amount_with_tax)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersByVendorReport;
