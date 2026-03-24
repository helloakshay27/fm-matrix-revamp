import React, { useCallback, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ScrollText, Settings } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface JournalRecord {
  id?: number;
  ledger_id?: number;
  ledger_name?: string;
  description?: string;
  tr_type: string;
  amount: number;
}

interface JournalTransaction {
  id: number;
  transaction_type: string;
  reference: string | null;
  voucher_number: string | null;
  transaction_date: string;
  description?: string;
  records?: JournalRecord[];
}

type RowKind = "header" | "line" | "total" | "empty";

interface JournalTableRow {
  id: string;
  rowKind: RowKind;
  headerText?: string;
  accountLabel?: string;
  description?: string;
  debit?: number | null;
  credit?: number | null;
  debitTotal?: number;
  creditTotal?: number;
}

const columns: ColumnConfig[] = [
  {
    key: "accountDescription",
    label: "ACCOUNT / DESCRIPTION",
    sortable: false,
    defaultVisible: true,
  },
  { key: "debit", label: "DEBIT", sortable: false, defaultVisible: true },
  { key: "credit", label: "CREDIT", sortable: false, defaultVisible: true },
];

const formatDisplayDate = (value: string) => {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsed);
};

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getDefaultRange = () => {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: first.toISOString().split("T")[0],
    toDate: last.toISOString().split("T")[0],
  };
};

function isDebitTrType(trType: string | undefined): boolean {
  const t = (trType || "").toLowerCase();
  return t === "dr" || t === "debit";
}

function isCreditTrType(trType: string | undefined): boolean {
  const t = (trType || "").toLowerCase();
  return t === "cr" || t === "credit";
}

function buildTableRows(transactions: JournalTransaction[]): JournalTableRow[] {
  const rows: JournalTableRow[] = [];

  transactions.forEach((tx, txIndex) => {
    const txKey = tx.id != null ? String(tx.id) : `idx-${txIndex}`;
    const ref =
      tx.voucher_number ||
      tx.reference ||
      txKey;
    const headerText = `${formatDisplayDate(tx.transaction_date)}  ·  ${(tx.transaction_type || "").toUpperCase()}  ·  ${ref}`;

    rows.push({
      id: `${txKey}-header`,
      rowKind: "header",
      headerText,
    });

    const records = Array.isArray(tx.records) ? tx.records : [];
    let dr = 0;
    let cr = 0;
    records.forEach((r) => {
      const amt = Number(r.amount) || 0;
      if (isDebitTrType(r.tr_type)) dr += amt;
      else if (isCreditTrType(r.tr_type)) cr += amt;
    });

    if (records.length === 0) {
      rows.push({
        id: `${txKey}-empty`,
        rowKind: "empty",
        accountLabel: "No line items for this transaction.",
      });
    } else {
      records.forEach((r, idx) => {
        const amt = Number(r.amount) || 0;
        const isDr = isDebitTrType(r.tr_type);
        rows.push({
          id: `${txKey}-line-${r.id ?? idx}`,
          rowKind: "line",
          accountLabel: r.ledger_name || "—",
          description: r.description || "",
          debit: isDr ? amt : null,
          credit: !isDr ? amt : null,
        });
      });
    }

    rows.push({
      id: `${txKey}-total`,
      rowKind: "total",
      debitTotal: dr,
      creditTotal: cr,
    });
  });

  return rows;
}

const JournalReport: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lockAccountId = localStorage.getItem("lock_account_id");

  const defaultRange = useMemo(() => getDefaultRange(), []);
  const [filters, setFilters] = useState({
    fromDate: defaultRange.fromDate,
    toDate: defaultRange.toDate,
    basis: "Accrual" as "Accrual" | "Cash",
  });
  const [transactions, setTransactions] = useState<JournalTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrateRecords = useCallback(
    async (list: JournalTransaction[]): Promise<JournalTransaction[]> => {
      if (!baseUrl || !token || !lockAccountId) return list;
      const needsDetail = list.filter(
        (t) => !Array.isArray(t.records) || t.records.length === 0
      );
      if (needsDetail.length === 0) return list;

      const root = baseUrl.startsWith("http")
        ? baseUrl.replace(/\/$/, "")
        : `https://${baseUrl}`;

      const detailed = await Promise.all(
        needsDetail.map(async (t) => {
          try {
            const res = await axios.get(
              `${root}/lock_accounts/${lockAccountId}/lock_account_transactions/${t.id}.json`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const data = res.data;
            const records = Array.isArray(data.records)
              ? data.records
              : Array.isArray(data.lock_account_transaction_records)
                ? data.lock_account_transaction_records
                : [];
            return { ...t, records } as JournalTransaction;
          } catch {
            return t;
          }
        })
      );

      const map = new Map(detailed.map((t) => [t.id, t]));
      return list.map((t) => map.get(t.id) ?? t);
    },
    [baseUrl, token, lockAccountId]
  );

  const fetchJournalReport = useCallback(async () => {
    if (!filters.fromDate || !filters.toDate) {
      setError("Please select From Date and To Date");
      return;
    }
    if (!baseUrl || !token || !lockAccountId) {
      setError("Missing account session (base URL, token, or lock account).");
      return;
    }

    setLoading(true);
    setError(null);

    const root = baseUrl.startsWith("http")
      ? baseUrl.replace(/\/$/, "")
      : `https://${baseUrl}`;

    const params = new URLSearchParams();
    params.append("q[transaction_date_gteq]", filters.fromDate);
    params.append("q[transaction_date_lteq]", filters.toDate);

    try {
      const response = await axios.get(
        `${root}/lock_accounts/${lockAccountId}/lock_account_transactions.json?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const raw: JournalTransaction[] =
        response.data.lock_account_transactions || [];
      const sorted = [...raw].sort((a, b) =>
        (a.transaction_date || "").localeCompare(b.transaction_date || "")
      );
      const withRecords = await hydrateRecords(sorted);
      setTransactions(withRecords);
    } catch (e) {
      console.error("Journal report fetch failed:", e);
      setError("Failed to load journal report data.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, lockAccountId, filters.fromDate, filters.toDate, hydrateRecords]);

  useEffect(() => {
    void fetchJournalReport();
    // Intentionally run once on mount; View button triggers further loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const tableRows = useMemo(
    () => buildTableRows(transactions),
    [transactions]
  );

  const headerLine = useMemo(() => {
    const from = formatDisplayDate(filters.fromDate);
    const to = formatDisplayDate(filters.toDate);
    return `From ${from} To ${to}`;
  }, [filters.fromDate, filters.toDate]);

  const reportDateStr = useMemo(
    () => new Intl.DateTimeFormat("en-GB").format(new Date()),
    []
  );

  const handleCustomizeReport = useCallback(() => {
    // Hook for customize dialog / navigation when available
  }, []);

  const renderRow = (row: JournalTableRow) => {
    if (row.rowKind === "header") {
      return {
        accountDescription: (
          <span className="text-[13px] font-bold text-[#1A1A1A]">
            {row.headerText}
          </span>
        ),
        debit: <span />,
        credit: <span />,
      };
    }

    if (row.rowKind === "empty") {
      return {
        accountDescription: (
          <span className="text-[13px] text-[#98A2B3]">{row.accountLabel}</span>
        ),
        debit: <span />,
        credit: <span />,
      };
    }

    if (row.rowKind === "total") {
      return {
        accountDescription: (
          <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#1A1A1A]">
            Total
          </span>
        ),
        debit: (
          <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
            {formatCurrency(row.debitTotal ?? 0)}
          </span>
        ),
        credit: (
          <span className="inline-flex w-full justify-end text-[13px] font-semibold tabular-nums text-[#2563eb]">
            {formatCurrency(row.creditTotal ?? 0)}
          </span>
        ),
      };
    }

    return {
      accountDescription: (
        <span className="text-[13px] text-[#101828]">
          <span className="font-medium">{row.accountLabel}</span>
          {row.description ? (
            <span className="ml-2 text-[#667085]">{row.description}</span>
          ) : null}
        </span>
      ),
      debit: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
          {row.debit != null ? formatCurrency(row.debit) : ""}
        </span>
      ),
      credit: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#2563eb]">
          {row.credit != null ? formatCurrency(row.credit) : ""}
        </span>
      ),
    };
  };

  const getRowClassName = (item: JournalTableRow) => {
    if (item.rowKind === "header") {
      return "bg-gray-100 font-bold hover:!bg-gray-100 hover:!shadow-none";
    }
    if (item.rowKind === "total") {
      return "bg-gray-50 hover:!bg-gray-50 hover:!shadow-none";
    }
    if (item.rowKind === "empty") {
      return "hover:bg-gray-50";
    }
    return "hover:bg-gray-50";
  };

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 border-[#D5DbDB] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Journal Report
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Basis"
            value={filters.basis}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                basis: e.target.value as "Accrual" | "Cash",
              }))
            }
            fullWidth
            size="small"
          >
            <MenuItem value="Accrual">Accrual</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </TextField>
          <Button
            type="button"
            onClick={fetchJournalReport}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-[#D5DbDB] bg-white">
        <div className="relative border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCustomizeReport}
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-[#EEF2FF] hover:text-blue-800"
          >
            <Settings className="h-4 w-4" />
            Customize Report
          </Button>

          <div className="mx-auto max-w-3xl px-4 text-center md:px-12">
            <p className="text-sm text-[#667085]">Lockated</p>
            <h1 className="mt-1 text-3xl font-semibold text-[#111827]">
              Journal Report
            </h1>
            <p className="mt-2 text-sm text-[#667085]">
              <span className="font-medium text-[#344054]">Basis</span> :{" "}
              {filters.basis}
            </p>
            <p className="mt-1 text-sm text-[#667085]">{headerLine}</p>
            <p className="mt-0.5 text-sm text-[#667085]">
              Report Date: {reportDateStr}
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-4">
          <EnhancedTaskTable
            data={tableRows}
            columns={columns}
            renderRow={renderRow}
            getRowClassName={getRowClassName}
            getItemId={(r) => String(r.id)}
            storageKey="journal-report-v2"
            hideTableSearch
            hideTableExport
            hideColumnsButton
            toolbarClassName="hidden"
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
            tableWrapperClassName="min-h-[520px] border border-[#EAECF0]"
            headerCellClassName="text-[11px] font-semibold uppercase text-[#667085]"
            cellClassName="py-2.5 align-middle"
          />
        </div>
      </div>
    </div>
  );
};

export default JournalReport;
